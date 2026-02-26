import express from 'express';
import dotenv from 'dotenv';
import { initDatabase } from './db';
import { identifyContact } from './service';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/identify', async (req, res) => {
  try {
    const result = await identifyContact(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error in /identify:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
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
