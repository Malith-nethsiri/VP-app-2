// Database migration script to add enhanced user fields
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function migrateDatabase() {
  const client = await pool.connect();

  try {
    console.log('🔄 Starting database migration...');

    await client.query('BEGIN');

    // Add new columns to users table
    const alterQueries = [
      // Personal Details
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS honorable VARCHAR(10)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS qualifications JSONB`,

      // Professional Registration
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS professional_status VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS ivsl_membership_type VARCHAR(50)`,

      // Contact Information
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS house_number VARCHAR(50)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS street_name VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS area_name VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS city VARCHAR(100)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS district VARCHAR(100)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS mobile_number VARCHAR(20)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS alternative_contact VARCHAR(20)`,

      // Professional Files
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS signature_path VARCHAR(500)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS letterhead_path VARCHAR(500)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture_path VARCHAR(500)`,

      // Account Management
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verification_token VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE`
    ];

    for (const query of alterQueries) {
      try {
        await client.query(query);
        console.log(`✅ ${query.split('ADD COLUMN IF NOT EXISTS')[1]?.split(' ')[1] || 'Column'} added successfully`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️ Column already exists: ${query.split('ADD COLUMN IF NOT EXISTS')[1]?.split(' ')[1]}`);
        } else {
          throw error;
        }
      }
    }

    await client.query('COMMIT');
    console.log('✅ Database migration completed successfully!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Database migration failed:', error);
    throw error;
  } finally {
    client.release();
  }
}

module.exports = { migrateDatabase };

// Run migration if called directly
if (require.main === module) {
  migrateDatabase()
    .then(() => {
      console.log('🎉 Migration complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}