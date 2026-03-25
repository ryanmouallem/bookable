import { Request, Response, NextFunction } from 'express';

const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://bookable-33ju.vercel.app',
];

const parseConfiguredOrigins = () => {
  const configured = [
    process.env.FRONTEND_URL,
    ...(process.env.FRONTEND_URLS?.split(',') ?? []),
  ]
    .map((origin) => origin?.trim())
    .filter((origin): origin is string => Boolean(origin));

  return new Set([...defaultAllowedOrigins, ...configured]);
};

const isAllowedOrigin = (origin: string) => {
  const allowedOrigins = parseConfiguredOrigins();

  if (allowedOrigins.has(origin)) {
    return true;
  }

  return /^https:\/\/bookable-[a-z0-9-]+\.vercel\.app$/i.test(origin);
};

export const corsMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const origin = req.headers.origin;

  if (origin && isAllowedOrigin(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
};
