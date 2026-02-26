import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const migrate = async () => {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const client = await pool.connect();
  try {
    console.log('Starting migration...');
    
    // Drop the old table if it exists
    await client.query(`DROP TABLE IF EXISTS Contact CASCADE`);
    console.log('Dropped existing Contact table');
    
    // Create table with correct camelCase column names
    await client.query(`
      CREATE TABLE Contact (
        id SERIAL PRIMARY KEY,
        "phoneNumber" VARCHAR(255),
        email VARCHAR(255),
        "linkedId" INTEGER REFERENCES Contact(id),
        "linkPrecedence" VARCHAR(20) NOT NULL CHECK ("linkPrecedence" IN ('primary', 'secondary')),
        "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
        "deletedAt" TIMESTAMP
      )
    `);
    console.log('Created Contact table with correct schema');
    
    // Create indexes
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_contact_email ON Contact(email) WHERE email IS NOT NULL;
    `);
    console.log('Created email index');
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_contact_phone ON Contact("phoneNumber") WHERE "phoneNumber" IS NOT NULL;
    `);
    console.log('Created phone index');
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

migrate()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
