import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface Contact {
  id: number;
  phoneNumber: string | null;
  email: string | null;
  linkedId: number | null;
  linkPrecedence: 'primary' | 'secondary';
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export const initDatabase = async () => {
  const client = await pool.connect();
  try {
    // Drop existing table if it has wrong schema
    await client.query(`DROP TABLE IF EXISTS Contact CASCADE`);
    
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
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_contact_email ON Contact(email) WHERE email IS NOT NULL;
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_contact_phone ON Contact("phoneNumber") WHERE "phoneNumber" IS NOT NULL;
    `);
  } finally {
    client.release();
  }
};

export default pool;
