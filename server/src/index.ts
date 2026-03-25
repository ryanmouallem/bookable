import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import servicesRoutes from './routes/services.routes';
import barbersRoutes from './routes/barbers.routes';
import appointmentsRoutes from './routes/appointments.routes';

const app = express();
const PORT = process.env.PORT || 3050;

app.use(
  cors({
    origin:
      process.env.NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:3000',
    credentials: true,
  }),
);
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
