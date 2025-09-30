import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();
console.log("DB cfg", process.env.DB_HOST, process.env.DB_USER, process.env.DB_NAME);


export const pool = mysql.createPool({
  host: process.env.DB_HOST || "127.0.0.1",
  user: process.env.DB_USER || "arte_user",
  password: process.env.DB_PASS || "arte_pass",
  database: process.env.DB_NAME || "arte_db",
  waitForConnections: true,
  connectionLimit: 10,
});
