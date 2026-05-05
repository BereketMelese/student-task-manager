import cors from "cors";
import express, { type Router } from "express";

import { client } from "./client.js";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { taskRouter } from "./routes/tasks.js";
import { TaskAPI, taskApi } from "./taskApi.js";

export { client, TaskAPI, taskApi };
export const taskRouterWithType: Router = taskRouter;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/tasks", taskRouter);
app.use(notFoundHandler);
app.use(errorHandler);

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
