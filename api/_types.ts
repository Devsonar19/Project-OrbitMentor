export interface ServerlessRequest {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
}

export interface ServerlessResponse {
  setHeader(name: string, value: string): void;
  status(statusCode: number): ServerlessResponse;
  json(body: unknown): void;
  end(): void;
}

/**
 * Parses request body safely from json string, buffer, or pre-parsed object.
 */
export function parseJsonBody(req: ServerlessRequest): Record<string, unknown> {
  if (!req.body) return {};
  if (typeof req.body === 'object' && req.body !== null) {
    return req.body as Record<string, unknown>;
  }
  if (typeof req.body === 'string') {
    try {
      const parsed = JSON.parse(req.body);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
}

/**
 * Applies security and CORS headers to the response.
 * Returns true if request was handled (e.g. OPTIONS preflight).
 */
export function applyCorsAndSecurityHeaders(
  req: ServerlessRequest,
  res: ServerlessResponse,
  allowedMethods: string = 'GET, POST, OPTIONS'
): boolean {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', allowedMethods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}
