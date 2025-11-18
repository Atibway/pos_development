import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import { join } from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import router from "./Router";
import { DatabaseConnection } from "./Database/database";
import { BaseEntity } from "typeorm";
import job from "./config/cron";

dotenv.config();

const app: Application = express();

export const PORT: number = parseInt(process.env.PORT || "3001");

 job.start()

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ─── Static Files ───────────────────────────────────────────────────────────
app.use("/useruploads", express.static(join(__dirname, "../useruploads")));
app.use(express.static(join(__dirname, "./Views/")));

app.get("/api/health", (req, res)=> {
res.status(200).json({status:"ok"})
})

// ─── Start Server AFTER DB is Ready ─────────────────────────────────────────
const startServer = async () => {
  try {
    await DatabaseConnection.initialize();
    console.log("✅ Database Connection Successful");

    // ✅ Bind BaseEntity to your DataSource
    BaseEntity.useDataSource(DatabaseConnection);

    // Register routes after DB is ready
   app.use("/api", router());

    app.listen(PORT, () => {
      console.log(`🚀 Server Running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    process.exit(1);
  }
};

startServer();

// ─── Export DataSource ──────────────────────────────────────────────────────
export const dataSource = DatabaseConnection;
