import type {
  CreateTaskDTO,
  EntityId,
  Task,
  TaskStatus,
  UpdateTaskDTO,
} from "@repo/shared-types";
import { client } from "./client.js";

export interface GetAllTasksFilters {
  status?: TaskStatus;
  assignee?: string;
}

export class TaskAPI {
  async getAllTasks(filters: GetAllTasksFilters = {}): Promise<Task[]> {
    const { data } = await client.get<Task[]>("/tasks", { params: filters });
    return data;
  }

  async getTaskById(id: EntityId): Promise<Task> {
    const { data } = await client.get<Task>(`/tasks/${id}`);
    return data;
  }

  async createTask(taskData: CreateTaskDTO): Promise<Task> {
    const { data } = await client.post<Task>("/tasks", taskData);
    return data;
  }

  async updateTask(id: EntityId, taskData: UpdateTaskDTO): Promise<Task> {
    const { data } = await client.patch<Task>(`/tasks/${id}`, taskData);
    return data;
  }

  async deleteTask(id: EntityId): Promise<void> {
    await client.delete(`/tasks/${id}`);
  }
}

export const taskApi = new TaskAPI();
