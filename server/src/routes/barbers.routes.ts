import express, { Request, Response } from 'express';
import { pool } from '../config/database';
import { authenticateToken } from '../middleware/auth.middleware';

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(
      'SELECT id, first_name, last_name, email FROM users WHERE role = $1 ORDER BY last_name, first_name',
      ['barber'],
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Failed to fetch barbers', error);
    res.status(500).json({ error: 'Failed to fetch barbers' });
  }
});

export default router;
