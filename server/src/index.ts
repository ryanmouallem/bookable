import 'dotenv/config';
import express from 'express';
import authRoutes from './routes/auth.routes';
import servicesRoutes from './routes/services.routes';
import barbersRoutes from './routes/barbers.routes';
import appointmentsRoutes from './routes/appointments.routes';
import { corsMiddleware } from './utils/cors';

const app = express();
const PORT = process.env.PORT || 3050;

app.use(corsMiddleware);
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/services', servicesRoutes);
app.use('/barbers', barbersRoutes);
app.use('/appointments', appointmentsRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
