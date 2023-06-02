import mysql from "mysql2/promise";
import Logger from "../../../../apps/utils/logger";
import * as dotenv from "dotenv";
dotenv.config();

const {
  DB_REMOTE_HOST,
  DB_REMOTE_USER,
  DB_REMOTE_PASSWORD,
  DB_REMOTE_DATABASE,
  DB_LOCAL_HOST,
  DB_LOCAL_USER,
  DB_LOCAL_PASSWORD,
  DB_LOCAL_DATABASE,
  MODE,
} = process.env;

export const pool = mysql.createPool({
  host: MODE === "prod" ? DB_REMOTE_HOST : DB_LOCAL_HOST,
  user: MODE === "prod" ? DB_REMOTE_USER : DB_LOCAL_USER,
  password: MODE === "prod" ? DB_REMOTE_PASSWORD : DB_LOCAL_PASSWORD,
  database: MODE === "prod" ? DB_REMOTE_DATABASE : DB_LOCAL_DATABASE,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
});

export class MysqlDataBase {
  constructor() {}

  static async query<T>(sql: string, args?: string[]): Promise<any> {
    const connection = await pool.getConnection();
    try {
      const [rows, fields] = await connection.execute(sql, args);
      return rows;
    } catch (error) {
      Logger.error(`mysql : query : ${error}`);
      throw new Error("" + error);
    } finally {
      connection.release();
    }
  }

  static async update(sql: string, args?: string[]): Promise<any> {
    const connection = await pool.getConnection();
    try {
      await connection.execute(
        "SET TRANSACTION ISOLATION LEVEL READ COMMITTED"
      );
      await connection.beginTransaction();
      const [response, meta] = await connection.execute(sql, args);
      await connection.commit();
      return response;
    } catch (error) {
      await connection.rollback();
      Logger.error(`mysql : update : ${error}`);
      throw new Error("" + error);
    } finally {
      connection.release();
    }
  }

  static toMySQLDateTime(d: any): string {
    // Construir la fecha
    const date = new Date(d.year, d.month - 1, d.day);

    // Obtener los componentes de la fecha
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = "00";
    const minutes = "00";
    const seconds = "00";

    // Formatear la fecha en formato datetime de MySQL
    const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    return formattedDate;
  }
}
