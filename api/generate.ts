import { handleGenerateIdeas } from '../src/server/geminiService';
import { generateFallbackIdeas } from '../src/data/fallbackEngine';

function parseBody(req: any) {
  if (!req.body) return {};
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const body = parseBody(req);
    const result = await handleGenerateIdeas(body);
    res.status(200).json(result);
  } catch (error) {
    console.error('[Vercel API /api/generate Error]:', error);
    // Graceful fallback so frontend never breaks
    const body = parseBody(req);
    const fallback = generateFallbackIdeas(body.domain, body.skills, body.tier);
    res.status(200).json(fallback);
  }
}
