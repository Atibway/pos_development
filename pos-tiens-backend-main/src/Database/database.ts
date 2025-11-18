require("dotenv").config();
import { DataSource } from "typeorm";
import { join } from "path";

// 🌿 Pure backend database connection (MySQL)
export const DatabaseConnection = new DataSource({
  host: process.env.DB_HOST,
  type: "mysql",
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: false,
  synchronize: true,
  entities: [join(__dirname, "..", "Entities", "*.{js,ts}")],
});
