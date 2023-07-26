import postgres from 'postgres';
const { DATABASE_URL } = process.env;

const sql = postgres(DATABASE_URL, { ssl: 'require' });

export default sql;
