import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import authRoutes from '../src/routes/auth.routes';
import servicesRoutes from '../src/routes/services.routes';
import barbersRoutes from '../src/routes/barbers.routes';
import appointmentsRoutes from '../src/routes/appointments.routes';

const app = express();

const allowedOrigin = 'https://bookable-33ju.vercel.app';

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
});

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/services', servicesRoutes);
app.use('/barbers', barbersRoutes);
app.use('/appointments', appointmentsRoutes);

export default app;
