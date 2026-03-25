import express, { Request, Response } from "express";
import pool from '../config/database';
import { authenticateToken } from "../middleware/auth.middleware";

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req: Request, res: Response) => {
    try {
        const results = await pool.query(
            'SELECT id, name, price, duration FROM services ORDER BY name'
        );
        res.json(results.rows);
    } catch (error) {
        console.error('Error fetching services', error);
        res.status(500).json({ error: 'Failed to fetch services'});
    }
});

export default router;
