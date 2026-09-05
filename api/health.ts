import { ServerlessRequest, ServerlessResponse, applyCorsAndSecurityHeaders } from './_types';

export default function handler(req: ServerlessRequest, res: ServerlessResponse): void {
  if (applyCorsAndSecurityHeaders(req, res, 'GET, OPTIONS')) return;

  res.status(200).json({
    status: 'online',
    app: 'PROJECT ORBITMENTOR',
    platform: 'Vercel Serverless',
    ai_configured: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
    uptime_seconds: Math.floor(process.uptime()),
  });
}
