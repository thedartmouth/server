import { Pool } from 'pg';

const pool = new Pool();

const query = (text, params, callback) => {
    return pool.query(text, params, callback);
}

export { query };