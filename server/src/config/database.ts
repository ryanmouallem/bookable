import { Pool } from 'pg';

export const pool = new Pool({
    user: 'ryan',
    host: 'localhost',
    database: 'bookable_app',
    password: 'dev123',
    port: 5432
});