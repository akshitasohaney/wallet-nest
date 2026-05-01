import fs from 'node:fs';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

// Load environment variables before importing routes
if (fs.existsSync('.env')) dotenv.config({ path: '.env' });
if (fs.existsSync('server/.env')) dotenv.config({ path: 'server/.env' });

import expenseRoutes from './routes/expenseRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const PORT = Number(process.env.PORT || process.env.MENTOR_PROXY_PORT || 8787);
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
const NODE_ENV = process.env.NODE_ENV || 'development';

function buildCorsOptions() {
  const raw = String(CORS_ORIGIN || '').trim();
  if (!raw || raw === '*') return { origin: true };
  const allowed = raw.split(',').map((s) => s.trim()).filter(Boolean);
  if (allowed.length <= 1) return { origin: allowed[0] };
  return {
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowed.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
  };
}

const app = express();

app.use(cors(buildCorsOptions()));
app.use(express.json({ limit: '500kb' }));

// Health Check Endpoint
app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'wallet-nest-api' });
});

// API Routes
app.use('/api/expenses', expenseRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/finance-chat', chatRoutes); // Preserved existing AI endpoint

// 404 Route Handler
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'API Endpoint Not Found' });
});

// Global Error Handler Middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`WalletNest API Server running at http://localhost:${PORT}`);
  console.log(`Environment: ${NODE_ENV}`);
  console.log(`CORS origin: ${CORS_ORIGIN}`);
});

// Keep process alive reliably in all environments
setInterval(() => {}, 60_000);
