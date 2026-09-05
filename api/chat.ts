import { ServerlessRequest, ServerlessResponse, parseJsonBody, applyCorsAndSecurityHeaders } from './_types';
import { handleMentorChat } from '../src/server/geminiService';
import { generateFallbackChat } from '../src/data/fallbackEngine';

export default async function handler(req: ServerlessRequest, res: ServerlessResponse): Promise<void> {
  if (applyCorsAndSecurityHeaders(req, res, 'POST, OPTIONS')) return;

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const body = parseJsonBody(req);

  try {
    const result = await handleMentorChat(body);
    res.status(200).json(result);
  } catch (error) {
    console.error('[Vercel API /api/chat Error]:', error);
    const message = typeof body.message === 'string' ? body.message : 'How should I start?';
    const projectTitle = typeof body.project_title === 'string' ? body.project_title : 'Capstone Project';
    const domain = typeof body.domain === 'string' ? body.domain : 'Software Engineering';
    const skills = Array.isArray(body.skills) ? (body.skills as string[]) : ['React', 'Node.js'];

    const fallback = generateFallbackChat(message, projectTitle, domain, skills);
    res.status(200).json(fallback);
  }
}
