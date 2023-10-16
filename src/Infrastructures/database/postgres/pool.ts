/* istanbul ignore file */
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

interface TestConfig {
  host : string;
  port : number;
  user : string;
  database : string;
  password : string;
}

const testConfig : TestConfig = {
  host: process.env.PGHOST_TEST as string,
  port: parseInt(process.env.PGPORT_TEST as string),
  user: process.env.PGUSER_TEST as string,
  database: process.env.PGDATABASE_TEST as string,
  password: process.env.PGPASSWORD_TEST as string,
};

export const pool : Pool = process.env.NODE_ENV === "test" ? new Pool(testConfig) : new Pool();
