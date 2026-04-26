require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

const securityService = require('./services/securityService');

// Public Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'active', timestamp: new Date().toISOString() });
});

// Protected Routes
app.post('/api/scan', authMiddleware, async (req, res) => {
  const { targetUrl } = req.body;

  if (!targetUrl) {
    return res.status(400).json({ error: 'targetUrl is required' });
  }

  try {
    const result = await securityService.initiateScan(targetUrl, req.user.email);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Failed to initiate scan' });
  }
});

app.get('/api/viper', authMiddleware, async (req, res) => {
  try {
    const status = await securityService.getSystemStatus();
    res.json({
      message: 'VIPER Security Orchestrator Access Granted',
      user: req.user.email,
      ...status
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve system status' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`NERV-VIPER Backend running on port ${PORT}`);
});
