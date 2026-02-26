import express from 'express';
import dotenv from 'dotenv';
import { initDatabase } from './db';
import { identifyContact } from './service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    service: 'Bitespeed Identity Reconciliation Service',
    version: '1.0.0',
    endpoints: {
      identify: {
        method: 'POST',
        path: '/identify',
        description: 'Identify and reconcile contact information',
        example: {
          request: {
            email: 'user@example.com',
            phoneNumber: '1234567890'
          }
        }
      },
      health: {
        method: 'GET',
        path: '/health',
        description: 'Health check endpoint'
      }
    }
  });
});

app.post('/identify', async (req, res) => {
  try {
    const result = await identifyContact(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in /identify:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/identify', (req, res) => {
  res.status(405).json({
    error: 'Method Not Allowed',
    message: 'This endpoint only accepts POST requests',
    usage: 'Send a POST request with JSON body containing email and/or phoneNumber'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const startServer = async () => {
  try {
    await initDatabase();
    console.log('Database initialized');
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
