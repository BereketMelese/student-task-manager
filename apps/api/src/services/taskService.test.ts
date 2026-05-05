import type { CreateTaskDTO, UpdateTaskDTO } from "@repo/shared-types";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "./taskService.js";

const mockFind = vi.fn();
const mockFindById = vi.fn();
const mockCreate = vi.fn();
const mockFindByIdAndUpdate = vi.fn();
const mockFindByIdAndDelete = vi.fn();
const mockToTask = vi.fn();

vi.mock("../models/task.model.js", () => ({
  TaskModel: {
    find: mockFind,
    findById: mockFindById,
    create: mockCreate,
    findByIdAndUpdate: mockFindByIdAndUpdate,
    findByIdAndDelete: mockFindByIdAndDelete,
  },
  toTask: mockToTask,
}));

describe("taskService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getAllTasks", () => {
    it("filters by status and assignee using Mongo query", async () => {
      const taskDoc = { _id: "doc-1" };
      const sort = vi.fn().mockReturnValue({
        exec: vi.fn().mockResolvedValue([taskDoc]),
      });
      mockFind.mockReturnValue({ sort });
      mockToTask.mockReturnValue({ id: "1", title: "Task 1" });

      const result = await getAllTasks({
        status: "todo",
        assignee: "student-1",
      });

      expect(mockFind).toHaveBeenCalledWith({
        status: "todo",
        studentId: "student-1",
      });
      expect(sort).toHaveBeenCalledWith({ createdAt: -1 });
      expect(mockToTask).toHaveBeenCalledWith(taskDoc);
      expect(result).toEqual([{ id: "1", title: "Task 1" }]);
    });
  });

  describe("getTaskById", () => {
    it("returns mapped task when task exists", async () => {
      const taskDoc = { _id: "doc-1" };
      mockFindById.mockReturnValue({
        exec: vi.fn().mockResolvedValue(taskDoc),
      });
      mockToTask.mockReturnValue({ id: "1", title: "Task 1" });

      const result = await getTaskById("task-1");

      expect(mockFindById).toHaveBeenCalledWith("task-1");
      expect(mockToTask).toHaveBeenCalledWith(taskDoc);
      expect(result).toEqual({ id: "1", title: "Task 1" });
    });

    it("returns null when task does not exist", async () => {
      mockFindById.mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      });

      const result = await getTaskById("missing-task");

      expect(result).toBeNull();
      expect(mockToTask).not.toHaveBeenCalled();
    });
  });

  describe("createTask", () => {
    it("validates and creates a task", async () => {
      const dto: CreateTaskDTO = {
        studentId: "student-1",
        title: "Read chapter 5",
      };
      const createdDoc = { _id: "doc-1" };
      mockCreate.mockResolvedValue(createdDoc);
      mockToTask.mockReturnValue({ id: "1", title: "Read chapter 5" });

      const result = await createTask(dto);

      expect(mockCreate).toHaveBeenCalledWith(dto);
      expect(mockToTask).toHaveBeenCalledWith(createdDoc);
      expect(result).toEqual({ id: "1", title: "Read chapter 5" });
    });

    it("throws when required fields are invalid", async () => {
      const dto = { studentId: "", title: "x" } as CreateTaskDTO;

      await expect(createTask(dto)).rejects.toThrow(
        "studentId is required and must be a non-empty string",
      );
      expect(mockCreate).not.toHaveBeenCalled();
    });
  });

  describe("updateTask", () => {
    it("updates task with partial data and maps result", async () => {
      const dto: UpdateTaskDTO = { status: "done" };
      const updatedDoc = { _id: "doc-updated" };
      mockFindByIdAndUpdate.mockReturnValue({
        exec: vi.fn().mockResolvedValue(updatedDoc),
      });
      mockToTask.mockReturnValue({ id: "2", status: "done" });

      const result = await updateTask("task-2", dto);

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith("task-2", dto, {
        new: true,
        runValidators: true,
      });
      expect(result).toEqual({ id: "2", status: "done" });
    });

    it("throws when provided title is empty", async () => {
      await expect(updateTask("task-1", { title: "   " })).rejects.toThrow(
        "title is required and must be a non-empty string",
      );
      expect(mockFindByIdAndUpdate).not.toHaveBeenCalled();
    });
  });

  describe("deleteTask", () => {
    it("returns true when a task is deleted", async () => {
      mockFindByIdAndDelete.mockReturnValue({
        exec: vi.fn().mockResolvedValue({ _id: "deleted-doc" }),
      });

      await expect(deleteTask("task-3")).resolves.toBe(true);
      expect(mockFindByIdAndDelete).toHaveBeenCalledWith("task-3");
    });

    it("returns false when task does not exist", async () => {
      mockFindByIdAndDelete.mockReturnValue({
        exec: vi.fn().mockResolvedValue(null),
      });

      await expect(deleteTask("missing-task")).resolves.toBe(false);
    });
  });
});
