const { Pool } = require('pg');

class DatabaseService {
  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    // Test connection on startup
    this.testConnection();
  }

  async testConnection() {
    try {
      const client = await this.pool.connect();
      console.log('✅ Database connected successfully');
      client.release();
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
    }
  }

  async query(text, params) {
    const start = Date.now();
    try {
      const res = await this.pool.query(text, params);
      const duration = Date.now() - start;
      console.log('📊 Database Query:', { text, duration: `${duration}ms`, rows: res.rowCount });
      return res;
    } catch (error) {
      console.error('❌ Database Query Error:', error);
      throw error;
    }
  }

  async getClient() {
    return await this.pool.connect();
  }

  async close() {
    await this.pool.end();
  }

  // Health check method
  async healthCheck() {
    try {
      const result = await this.query('SELECT NOW() as timestamp, version() as version');
      return {
        status: 'healthy',
        timestamp: result.rows[0].timestamp,
        version: result.rows[0].version,
        connected: true
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        connected: false
      };
    }
  }

  // Initialize database schema
  async initializeSchema() {
    const client = await this.getClient();

    try {
      await client.query('BEGIN');

      // Users table
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          professional_title VARCHAR(255),
          ivsl_registration VARCHAR(100),
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Valuation reports table
      await client.query(`
        CREATE TABLE IF NOT EXISTS valuation_reports (
          id SERIAL PRIMARY KEY,
          valuer_id INTEGER REFERENCES users(id),
          report_reference VARCHAR(100) UNIQUE NOT NULL,
          client_reference VARCHAR(100),
          property_address TEXT,
          gps_coordinates JSONB,
          status VARCHAR(50) DEFAULT 'draft',
          report_data JSONB,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);

      // Documents table
      await client.query(`
        CREATE TABLE IF NOT EXISTS documents (
          id SERIAL PRIMARY KEY,
          report_id INTEGER REFERENCES valuation_reports(id),
          file_name VARCHAR(255) NOT NULL,
          file_path VARCHAR(500) NOT NULL,
          file_type VARCHAR(100) NOT NULL,
          file_size INTEGER,
          extracted_data JSONB,
          uploaded_at TIMESTAMP DEFAULT NOW()
        )
      `);

      await client.query('COMMIT');
      console.log('✅ Database schema initialized successfully');

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('❌ Database schema initialization failed:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  // User management methods
  async createUser(userData) {
    const { email, password_hash, full_name, professional_title, ivsl_registration } = userData;
    const result = await this.query(
      `INSERT INTO users (email, password_hash, full_name, professional_title, ivsl_registration)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, email, full_name, created_at`,
      [email, password_hash, full_name, professional_title, ivsl_registration]
    );
    return result.rows[0];
  }

  async getUserByEmail(email) {
    const result = await this.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  async getUserById(id) {
    const result = await this.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  // Report management methods
  async createReport(reportData) {
    const { valuer_id, report_reference, client_reference, property_address, gps_coordinates } = reportData;
    const result = await this.query(
      `INSERT INTO valuation_reports (valuer_id, report_reference, client_reference, property_address, gps_coordinates)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [valuer_id, report_reference, client_reference, property_address, JSON.stringify(gps_coordinates)]
    );
    return result.rows[0];
  }

  async getReportsByUser(valuer_id) {
    const result = await this.query(
      'SELECT * FROM valuation_reports WHERE valuer_id = $1 ORDER BY created_at DESC',
      [valuer_id]
    );
    return result.rows;
  }

  async getReportById(id) {
    const result = await this.query('SELECT * FROM valuation_reports WHERE id = $1', [id]);
    return result.rows[0];
  }

  async updateReport(id, updateData) {
    const { status, report_data } = updateData;
    const result = await this.query(
      `UPDATE valuation_reports
       SET status = COALESCE($2, status),
           report_data = COALESCE($3, report_data),
           updated_at = NOW()
       WHERE id = $1 RETURNING *`,
      [id, status, JSON.stringify(report_data)]
    );
    return result.rows[0];
  }
}

// Export singleton instance
const db = new DatabaseService();
module.exports = db;