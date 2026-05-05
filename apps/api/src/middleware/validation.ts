import { z } from "zod";

const taskStatusSchema = z.enum(["todo", "in_progress", "done"]);
const taskPrioritySchema = z.enum(["low", "medium", "high"]);

const dateValueSchema = z.coerce.date();
const nullableDateValueSchema = z.union([z.null(), dateValueSchema]);

export const taskIdParamsSchema = z.object({
  id: z.string().trim().min(1, "Task id is required"),
});

export const getTasksQuerySchema = z.object({
  status: taskStatusSchema.optional(),
  assignee: z.string().trim().min(1).optional(),
});

export const createTaskBodySchema = z.object({
  studentId: z.string().trim().min(1, "studentId is required"),
  title: z.string().trim().min(1, "title is required"),
  description: z.string().trim().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  dueDate: dateValueSchema.optional(),
});

export const updateTaskBodySchema = z
  .object({
    title: z.string().trim().min(1, "title cannot be empty").optional(),
    description: z.string().trim().optional(),
    status: taskStatusSchema.optional(),
    priority: taskPrioritySchema.optional(),
    dueDate: nullableDateValueSchema.optional(),
    completedAt: nullableDateValueSchema.optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required for update",
  });

export const deleteTaskBodySchema = z.object({
  id: z.string().trim().min(1, "Task id is required"),
});
