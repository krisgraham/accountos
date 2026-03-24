import { Router } from 'express';

const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'accountos-api',
    timestamp: new Date().toISOString(),
  });
});

export { healthRouter };
