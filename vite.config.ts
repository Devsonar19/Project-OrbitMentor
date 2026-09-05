import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { handleGenerateIdeas, handleMentorBlueprint, handleMentorChat } from './src/server/geminiService';
import { DOMAINS, SKILLS_CATALOG } from './src/data/catalog';
import { validateGenerateRequest, validateMentorRequest, validateChatRequest } from './src/server/validation';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'orbitmentor-api-server',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          const url = req.url || '';

          if (url.startsWith('/api/')) {
            // Security Headers
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'SAMEORIGIN');
            res.setHeader('X-XSS-Protection', '1; mode=block');
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

            if (url === '/api/health' && req.method === 'GET') {
              res.end(
                JSON.stringify({
                  status: 'online',
                  app: 'PROJECT ORBITMENTOR',
                  ai_configured: Boolean(process.env.GEMINI_API_KEY),
                  model: 'gemini-3.8-flash',
                  uptime_seconds: Math.floor(process.uptime()),
                })
              );
              return;
            }

            if (url === '/api/domains' && req.method === 'GET') {
              res.setHeader('Cache-Control', 'public, max-age=3600');
              res.end(JSON.stringify(DOMAINS));
              return;
            }

            if (url === '/api/skills' && req.method === 'GET') {
              res.setHeader('Cache-Control', 'public, max-age=3600');
              res.end(JSON.stringify(SKILLS_CATALOG));
              return;
            }

            // Parse body for POST routes
            if (req.method === 'POST') {
              let body = '';
              req.on('data', (chunk) => {
                body += chunk;
                if (body.length > 1024 * 1024) {
                  res.statusCode = 413;
                  res.end(JSON.stringify({ error: 'Payload Too Large' }));
                  req.destroy();
                }
              });

              req.on('end', async () => {
                try {
                  const payload = body ? JSON.parse(body) : {};

                  if (url === '/api/generate') {
                    const validation = validateGenerateRequest(payload);
                    if (!validation.isValid) {
                      res.statusCode = 400;
                      res.end(JSON.stringify({ error: validation.error }));
                      return;
                    }
                    const result = await handleGenerateIdeas(validation.data);
                    res.end(JSON.stringify(result));
                    return;
                  }

                  if (url === '/api/mentor') {
                    const validation = validateMentorRequest(payload);
                    if (!validation.isValid) {
                      res.statusCode = 400;
                      res.end(JSON.stringify({ error: validation.error }));
                      return;
                    }
                    const result = await handleMentorBlueprint(validation.data);
                    res.end(JSON.stringify(result));
                    return;
                  }

                  if (url === '/api/chat') {
                    const validation = validateChatRequest(payload);
                    if (!validation.isValid) {
                      res.statusCode = 400;
                      res.end(JSON.stringify({ error: validation.error }));
                      return;
                    }
                    const result = await handleMentorChat(validation.data);
                    res.end(JSON.stringify(result));
                    return;
                  }

                  res.statusCode = 404;
                  res.end(JSON.stringify({ error: 'Endpoint not found' }));
                } catch (err) {
                  console.error('API Error in dev middleware:', err);
                  res.statusCode = 500;
                  res.end(JSON.stringify({ error: 'Internal Server Error', details: String(err) }));
                }
              });
              return;
            }
          }

          next();
        });
      },
    },
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
  },
});
