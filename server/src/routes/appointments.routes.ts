import express, { Request, Response } from 'express';
import pool from '../config/database';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT * FROM appointments ORDER BY appointment_date, appointment_time',
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch appointments', error);
    res.status(500).json({ error: 'Failed to fetch appointments' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      client_name,
      client_phone,
      service,
      price,
      duration,
      barber,
      appointment_date,
      appointment_time,
      notes,
    } = req.body;

    const result = await pool.query(
      `INSERT INTO appointments
            (client_name,
            client_phone,
            service,
            price,
            duration,
            barber,
            appointment_date,
            appointment_time,
            notes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        client_name,
        client_phone,
        service,
        price,
        duration,
        barber,
        appointment_date,
        appointment_time,
        notes,
      ],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Failed to post appointment', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      client_name,
      client_phone,
      service,
      price,
      duration,
      barber,
      appointment_date,
      appointment_time,
      notes,
    } = req.body;

    const result = await pool.query(
      `UPDATE appointments 
       SET client_name = $1, 
           client_phone = $2, 
           service = $3, 
           price = $4, 
           duration = $5, 
           barber = $6, 
           appointment_date = $7, 
           appointment_time = $8, 
           notes = $9 
       WHERE id = $10 
       RETURNING *`,
      [
        client_name,
        client_phone,
        service,
        price,
        duration,
        barber,
        appointment_date,
        appointment_time,
        notes,
        id,
      ],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Failed to edit appointment', error);
    res.status(500).json({ error: 'Failed to edit appointment' });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM appointments WHERE id = $1', [id]);

    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error('Failed to delete appointment', error);
    res.status(500).json({ error: 'Failed to delete appointment' });
  }
});

export default router;
