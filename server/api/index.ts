import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from '../src/routes/auth.routes';
import servicesRoutes from '../src/routes/services.routes';
import barbersRoutes from '../src/routes/barbers.routes';
import appointmentsRoutes from '../src/routes/appointments.routes';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/services', servicesRoutes);
app.use('/barbers', barbersRoutes);
app.use('/appointments', appointmentsRoutes);

export default app;