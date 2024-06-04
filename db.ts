import mysql, { type QueryResult } from "mysql2/promise";

// Create the connection to database
export const pool = mysql.createPool({
  connectionLimit: 5,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export async function dbQuery<T extends QueryResult>(
  sql: string,
  values?: any[]
) {
  const connection = await pool.getConnection();

  const [rows] = await connection.query<T>(sql, values);

  connection.release();

  return rows;
}
