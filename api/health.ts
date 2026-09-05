import type { IncomingMessage, ServerResponse } from 'http';

export default function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  res.status(200).json({
    status: 'online',
    app: 'PROJECT ORBITMENTOR',
    platform: 'Vercel Serverless',
    ai_configured: Boolean(process.env.GEMINI_API_KEY),
    model: 'gemini-3.8-flash',
    uptime_seconds: Math.floor(process.uptime()),
  });
}
