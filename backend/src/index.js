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

// Root Message
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NERV-VIPER Backend API</title>
        <style>
            body {
                font-family: 'Inter', system-ui, -apple-system, sans-serif;
                background-color: #f8fafc;
                color: #0f172a;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
            }
            .container {
                background: white;
                padding: 3rem;
                border-radius: 1.5rem;
                box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
                border: 1px solid #e2e8f0;
                text-align: center;
                max-width: 600px;
                width: 90%;
            }
            h1 {
                font-size: 2.5rem;
                font-weight: 800;
                letter-spacing: -0.025em;
                margin-bottom: 0.5rem;
                color: #1e293b;
            }
            h1 span {
                color: #2563eb;
            }
            p {
                color: #64748b;
                font-size: 1.125rem;
                margin-bottom: 2rem;
            }
            .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: #dcfce7;
                color: #166534;
                padding: 0.5rem 1rem;
                border-radius: 9999px;
                font-weight: 600;
                font-size: 0.875rem;
            }
            .status-dot {
                width: 8px;
                height: 8px;
                background: #22c55e;
                border-radius: 50%;
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            }
            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: .5; }
            }
            .links {
                margin-top: 2rem;
                padding-top: 2rem;
                border-top: 1px solid #e2e8f0;
                display: flex;
                gap: 1rem;
                justify-content: center;
            }
            a {
                color: #2563eb;
                text-decoration: none;
                font-weight: 500;
                transition: color 0.2s;
            }
            a:hover {
                color: #1d4ed8;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>NERV<span>-VIPER</span></h1>
            <p>Execution Layer & Backend Services</p>
            <div class="status-badge">
                <div class="status-dot"></div>
                SYSTEM ONLINE
            </div>
            <div class="links">
                <a href="https://nerv-sand.vercel.app">Return to App</a>
            </div>
        </div>
    </body>
    </html>
  `);
});

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
    const parsedUrl = new URL(targetUrl);
    const hostname = parsedUrl.hostname;
    
    // Explicitly reject internal IP ranges and cloud metadata endpoints
    const isInternal = /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|169\.254\.)/.test(hostname) || hostname === 'localhost';
    
    if (isInternal) {
      return res.status(403).json({ error: 'SSRF blocked: internal IPs not allowed' });
    }

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
