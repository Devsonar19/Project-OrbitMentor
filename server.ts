import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import { handleGenerateIdeas, handleMentorBlueprint, handleMentorChat } from './src/server/geminiService';
import { DOMAINS, SKILLS_CATALOG } from './src/data/catalog';
import { validateGenerateRequest, validateMentorRequest, validateChatRequest } from './src/server/validation';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security & Standard Middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  // Health check with operational telemetry
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'online',
      app: 'PROJECT ORBITMENTOR',
      ai_configured: Boolean(process.env.GEMINI_API_KEY),
      model: 'gemini-3.8-flash',
      uptime_seconds: Math.floor(process.uptime()),
    });
  });

  // Autocomplete catalogs with HTTP cache-control
  app.get('/api/domains', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json(DOMAINS);
  });

  app.get('/api/skills', (_req: Request, res: Response) => {
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.json(SKILLS_CATALOG);
  });

  // Generate ideas with defensive validation
  app.post('/api/generate', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = validateGenerateRequest(req.body);
      if (!validation.isValid) {
        res.status(400).json({ error: validation.error });
        return;
      }
      const result = await handleGenerateIdeas(validation.data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // Mentorship blueprint with validation
  app.post('/api/mentor', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = validateMentorRequest(req.body);
      if (!validation.isValid) {
        res.status(400).json({ error: validation.error });
        return;
      }
      const result = await handleMentorBlueprint(validation.data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // Chat with mentor with validation
  app.post('/api/chat', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = validateChatRequest(req.body);
      if (!validation.isValid) {
        res.status(400).json({ error: validation.error });
        return;
      }
      const result = await handleMentorChat(validation.data);
      res.json(result);
    } catch (error) {
      next(error);
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global Centralized Error Handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[PROJECT ORBITMENTOR API Error]:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while processing your request.',
    });
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PROJECT ORBITMENTOR] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
