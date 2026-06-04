import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

// Import our serverless handlers for complete parity in development
import adminHandler from './api/admin';
import publicHandler from './api/public';
import contactHandler from './api/contact';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// ----------------------------------------------------
// LOCAL DEVELOPMENT API ENDPOINTS (PARITY WITH VERCEL)
// ----------------------------------------------------

// Consolidated CMS admin routes
app.all('/api/admin', async (req, res) => {
  try {
    await adminHandler(req as any, res as any);
  } catch (err: any) {
    console.error('[LOCAL SERVER] Admin Error:', err);
    res.status(500).json({ success: false, error: err?.message || err });
  }
});

// Consolidated Public REST routes
app.all('/api/public', async (req, res) => {
  try {
    await publicHandler(req as any, res as any);
  } catch (err: any) {
    console.error('[LOCAL SERVER] Public Error:', err);
    res.status(500).json({ success: false, error: err?.message || err });
  }
});

// Resend and Supabase contact lead submission
app.all('/api/contact', async (req, res) => {
  try {
    await contactHandler(req as any, res as any);
  } catch (err: any) {
    console.error('[LOCAL SERVER] Contact Error:', err);
    res.status(500).json({ success: false, error: err?.message || err });
  }
});

// Fallback for old submit contact endpoint
app.all('/api/submit-contact', async (req, res) => {
  try {
    await contactHandler(req as any, res as any);
  } catch (err: any) {
    console.error('[LOCAL SERVER] Submit-Contact Error:', err);
    res.status(500).json({ success: false, error: err?.message || err });
  }
});

// ----------------------------------------------------
// VITE OR STATIC SERVING MIDDLEWARE
// ----------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Development Mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    console.log('[LOCAL SERVER] Vite middleware mounted in Development mode.');
  } else {
    // Production Mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    console.log('[LOCAL SERVER] Serving static files from:', distPath);
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Whale Agency Server] Running locally on port ${PORT}`);
  });
}

startServer();
