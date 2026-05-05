import { Router } from "express";

import { HttpError } from "../middleware/errorHandler.js";
import {
  createTaskBodySchema,
  deleteTaskBodySchema,
  getTasksQuerySchema,
  taskIdParamsSchema,
  updateTaskBodySchema,
} from "../middleware/validation.js";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../services/taskService.js";

export const taskRouter = Router();

taskRouter.get("/", async (req, res, next) => {
  try {
    const filters = getTasksQuerySchema.parse(req.query);
    const tasks = await getAllTasks(filters);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

taskRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = taskIdParamsSchema.parse(req.params);
    const task = await getTaskById(id);

    if (!task) {
      throw new HttpError(404, "Task not found");
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
});

taskRouter.post("/", async (req, res, next) => {
  try {
    const body = createTaskBodySchema.parse(req.body);
    const createdTask = await createTask(body);
    res.status(201).json(createdTask);
  } catch (error) {
    next(error);
  }
});

taskRouter.patch("/:id", async (req, res, next) => {
  try {
    const { id } = taskIdParamsSchema.parse(req.params);
    const body = updateTaskBodySchema.parse(req.body);
    const updatedTask = await updateTask(id, body);

    if (!updatedTask) {
      throw new HttpError(404, "Task not found");
    }

    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

taskRouter.delete("/:id", async (req, res, next) => {
  try {
    const { id } = taskIdParamsSchema.parse(req.params);
    const deleted = await deleteTask(id);

    if (!deleted) {
      throw new HttpError(404, "Task not found");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

taskRouter.delete("/", async (req, res, next) => {
  try {
    const { id } = deleteTaskBodySchema.parse(req.body);
    const deleted = await deleteTask(id);

    if (!deleted) {
      throw new HttpError(404, "Task not found");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});
