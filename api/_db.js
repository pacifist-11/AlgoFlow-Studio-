import { neon } from '@neondatabase/serverless';

// Neon serverless SQL client — reused across warm invocations
const sql = neon(process.env.DATABASE_URL);
export default sql;
