import type {
  CreateTaskDTO,
  Task,
  TaskStatus,
  UpdateTaskDTO,
} from "@repo/shared-types";

import { TaskModel, toTask } from "../models/task.model.js";

export interface GetAllTasksFilters {
  status?: TaskStatus;
  assignee?: string;
}

function assertNonEmptyString(value: unknown, fieldName: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${fieldName} is required and must be a non-empty string`);
  }
}

function validateCreateTaskData(data: CreateTaskDTO): void {
  assertNonEmptyString(data.studentId, "studentId");
  assertNonEmptyString(data.title, "title");
}

function validateUpdateTaskData(data: UpdateTaskDTO): void {
  if ("title" in data && data.title !== undefined) {
    assertNonEmptyString(data.title, "title");
  }
}

export async function getAllTasks(filters: GetAllTasksFilters = {}): Promise<Task[]> {
  const query: Record<string, unknown> = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.assignee) {
    query.studentId = filters.assignee;
  }

  const documents = await TaskModel.find(query).sort({ createdAt: -1 }).exec();
  return documents.map((document) => toTask(document));
}

export async function getTaskById(id: string): Promise<Task | null> {
  const document = await TaskModel.findById(id).exec();
  return document ? toTask(document) : null;
}

export async function createTask(data: CreateTaskDTO): Promise<Task> {
  validateCreateTaskData(data);

  const document = await TaskModel.create(data);
  return toTask(document);
}

export async function updateTask(id: string, data: UpdateTaskDTO): Promise<Task | null> {
  validateUpdateTaskData(data);

  const document = await TaskModel.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).exec();

  return document ? toTask(document) : null;
}

export async function deleteTask(id: string): Promise<boolean> {
  const result = await TaskModel.findByIdAndDelete(id).exec();
  return Boolean(result);
}
