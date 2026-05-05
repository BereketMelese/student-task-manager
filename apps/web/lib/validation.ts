import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().optional(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  // No real auth yet — hardcoded student ID
  studentId: z.string().default("student-001"),
});

export type CreateTaskFormValues = z.input<typeof createTaskSchema>;
export type CreateTaskParsed = z.output<typeof createTaskSchema>;
