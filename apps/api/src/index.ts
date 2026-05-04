import cors from "cors";
import express from "express";

import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { TaskModel, toTask } from "./models/task.model.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.get("/tasks", async (_req, res, next) => {
  try {
    const documents = await TaskModel.find().sort({ createdAt: -1 }).exec();
    res.json(documents.map((document) => toTask(document)));
  } catch (error) {
    next(error);
  }
});

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("Unhandled API error.", error);
    res.status(500).json({ message: "Internal server error" });
  },
);

async function bootstrap() {
  try {
    await connectDB();

    app.listen(env.port, () => {
      console.log(`API running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("API failed to start.", error);
    process.exit(1);
  }
}

void bootstrap();
