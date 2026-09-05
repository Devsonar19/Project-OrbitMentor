import { ServerlessRequest, ServerlessResponse, parseJsonBody, applyCorsAndSecurityHeaders } from './_types';
import { handleMentorBlueprint } from '../src/server/geminiService';
import { generateFallbackBlueprint } from '../src/data/fallbackEngine';
import { GenerationTier } from '../src/types';

export default async function handler(req: ServerlessRequest, res: ServerlessResponse): Promise<void> {
  if (applyCorsAndSecurityHeaders(req, res, 'POST, OPTIONS')) return;

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const body = parseJsonBody(req);

  try {
    const result = await handleMentorBlueprint(body);
    res.status(200).json(result);
  } catch (error) {
    console.error('[Vercel API /api/mentor Error]:', error);
    const title = typeof body.idea_title === 'string' ? body.idea_title : 'Engineering Capstone Project';
    const domain = typeof body.domain === 'string' ? body.domain : 'Software Engineering';
    const skills = Array.isArray(body.skills) ? (body.skills as string[]) : ['React', 'FastAPI'];
    const tier = typeof body.tier === 'string' ? (body.tier as GenerationTier) : 'Safe';
    const summary = typeof body.idea_summary === 'string' ? body.idea_summary : '';

    const fallback = generateFallbackBlueprint(title, domain, skills, tier, summary);
    res.status(200).json(fallback);
  }
}
