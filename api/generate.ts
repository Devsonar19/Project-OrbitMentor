import { ServerlessRequest, ServerlessResponse, parseJsonBody, applyCorsAndSecurityHeaders } from './_types';
import { handleGenerateIdeas } from '../src/server/geminiService';
import { generateFallbackIdeas } from '../src/data/fallbackEngine';
import { GenerationTier } from '../src/types';

export default async function handler(req: ServerlessRequest, res: ServerlessResponse): Promise<void> {
  if (applyCorsAndSecurityHeaders(req, res, 'POST, OPTIONS')) return;

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const body = parseJsonBody(req);

  try {
    const result = await handleGenerateIdeas(body);
    res.status(200).json(result);
  } catch (error) {
    console.error('[Vercel API /api/generate Error]:', error);
    // Deterministic fallback ensures client never breaks
    const domain = typeof body.domain === 'string' ? body.domain : 'Software Engineering';
    const skills = Array.isArray(body.skills) ? (body.skills as string[]) : ['React', 'Python'];
    const tier = typeof body.tier === 'string' ? (body.tier as GenerationTier) : 'Safe';
    const fallback = generateFallbackIdeas(domain, skills, tier);
    res.status(200).json(fallback);
  }
}
