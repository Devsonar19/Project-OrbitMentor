import { ServerlessRequest, ServerlessResponse, applyCorsAndSecurityHeaders } from './_types';
import { DOMAINS } from '../src/data/catalog';

export default function handler(req: ServerlessRequest, res: ServerlessResponse): void {
  res.setHeader('Cache-Control', 'public, max-age=3600');
  if (applyCorsAndSecurityHeaders(req, res, 'GET, OPTIONS')) return;

  res.status(200).json(DOMAINS);
}
