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

      // Users table - Enhanced with IVSL professional fields
      await client.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,

          -- Personal Details (based on planning/document-analysis.md lines 14-22)
          honorable VARCHAR(10),
          full_name VARCHAR(255) NOT NULL,
          professional_title VARCHAR(255),
          qualifications JSONB,

          -- Professional Registration (lines 23-27)
          ivsl_registration VARCHAR(100),
          professional_status VARCHAR(255),
          ivsl_membership_type VARCHAR(50),

          -- Contact Information (lines 28-35)
          house_number VARCHAR(50),
          street_name VARCHAR(255),
          area_name VARCHAR(255),
          city VARCHAR(100),
          district VARCHAR(100),
          phone_number VARCHAR(20),
          mobile_number VARCHAR(20),
          alternative_contact VARCHAR(20),

          -- Professional Files
          signature_path VARCHAR(500),
          letterhead_path VARCHAR(500),
          profile_picture_path VARCHAR(500),

          -- Account Management
          email_verified BOOLEAN DEFAULT FALSE,
          email_verification_token VARCHAR(255),
          is_active BOOLEAN DEFAULT TRUE,

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
    const {
      email, password_hash, honorable, full_name, professional_title, qualifications,
      ivsl_registration, professional_status, ivsl_membership_type,
      house_number, street_name, area_name, city, district,
      phone_number, mobile_number, alternative_contact,
      email_verification_token
    } = userData;

    const result = await this.query(
      `INSERT INTO users (
        email, password_hash, honorable, full_name, professional_title, qualifications,
        ivsl_registration, professional_status, ivsl_membership_type,
        house_number, street_name, area_name, city, district,
        phone_number, mobile_number, alternative_contact, email_verification_token
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
      RETURNING id, email, honorable, full_name, professional_title, ivsl_registration, created_at`,
      [
        email, password_hash, honorable, full_name, professional_title,
        JSON.stringify(qualifications), ivsl_registration, professional_status, ivsl_membership_type,
        house_number, street_name, area_name, city, district,
        phone_number, mobile_number, alternative_contact, email_verification_token
      ]
    );
    return result.rows[0];
  }

  async updateUserProfile(userId, profileData) {
    const {
      honorable, full_name, professional_title, qualifications,
      ivsl_registration, professional_status, ivsl_membership_type,
      house_number, street_name, area_name, city, district,
      phone_number, mobile_number, alternative_contact
    } = profileData;

    const result = await this.query(
      `UPDATE users SET
        honorable = COALESCE($2, honorable),
        full_name = COALESCE($3, full_name),
        professional_title = COALESCE($4, professional_title),
        qualifications = COALESCE($5, qualifications),
        ivsl_registration = COALESCE($6, ivsl_registration),
        professional_status = COALESCE($7, professional_status),
        ivsl_membership_type = COALESCE($8, ivsl_membership_type),
        house_number = COALESCE($9, house_number),
        street_name = COALESCE($10, street_name),
        area_name = COALESCE($11, area_name),
        city = COALESCE($12, city),
        district = COALESCE($13, district),
        phone_number = COALESCE($14, phone_number),
        mobile_number = COALESCE($15, mobile_number),
        alternative_contact = COALESCE($16, alternative_contact),
        updated_at = NOW()
      WHERE id = $1 RETURNING *`,
      [
        userId, honorable, full_name, professional_title,
        Array.isArray(qualifications) ? JSON.stringify(qualifications) :
        typeof qualifications === 'string' ? JSON.stringify(qualifications.split(',').map(q => q.trim()).filter(Boolean)) :
        JSON.stringify(qualifications),
        ivsl_registration, professional_status, ivsl_membership_type,
        house_number, street_name, area_name, city, district,
        phone_number, mobile_number, alternative_contact
      ]
    );
    return result.rows[0];
  }

  async updateUserFiles(userId, fileData) {
    const { signature_path, letterhead_path, profile_picture_path } = fileData;

    const result = await this.query(
      `UPDATE users SET
        signature_path = COALESCE($2, signature_path),
        letterhead_path = COALESCE($3, letterhead_path),
        profile_picture_path = COALESCE($4, profile_picture_path),
        updated_at = NOW()
      WHERE id = $1 RETURNING *`,
      [userId, signature_path, letterhead_path, profile_picture_path]
    );
    return result.rows[0];
  }

  async verifyUserEmail(email, token) {
    const result = await this.query(
      `UPDATE users SET email_verified = TRUE, email_verification_token = NULL
       WHERE email = $1 AND email_verification_token = $2 RETURNING id, email`,
      [email, token]
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

  // Document management methods
  async saveDocument(documentData) {
    const { report_id, file_name, file_path, file_type, file_size, extracted_data } = documentData;
    const result = await this.query(
      `INSERT INTO documents (report_id, file_name, file_path, file_type, file_size, extracted_data)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [report_id, file_name, file_path, file_type, file_size, JSON.stringify(extracted_data)]
    );
    return result.rows[0];
  }

  async getDocumentsByReport(report_id) {
    const result = await this.query(
      'SELECT * FROM documents WHERE report_id = $1 ORDER BY uploaded_at DESC',
      [report_id]
    );
    return result.rows;
  }

  async getDocumentById(id) {
    const result = await this.query('SELECT * FROM documents WHERE id = $1', [id]);
    return result.rows[0];
  }
}

// Export singleton instance
const db = new DatabaseService();
module.exports = db;