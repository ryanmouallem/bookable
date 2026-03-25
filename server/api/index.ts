import 'dotenv/config';
import express, { Request, Response } from 'express';
import authRoutes from '../src/routes/auth.routes';
import servicesRoutes from '../src/routes/services.routes';
import barbersRoutes from '../src/routes/barbers.routes';
import appointmentsRoutes from '../src/routes/appointments.routes';
import { corsMiddleware } from '../src/utils/cors';

const app = express();

app.use(corsMiddleware);
app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/auth', authRoutes);
app.use('/services', servicesRoutes);
app.use('/barbers', barbersRoutes);
app.use('/appointments', appointmentsRoutes);

export default app;
