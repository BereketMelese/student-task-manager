import { model, type HydratedDocument, Schema } from "mongoose";

import type { Task, TaskPriority, TaskStatus } from "@repo/shared-types";

const TASK_STATUS_VALUES = [
  "todo",
  "in_progress",
  "done",
] as const satisfies readonly TaskStatus[];
const TASK_PRIORITY_VALUES = [
  "low",
  "medium",
  "high",
] as const satisfies readonly TaskPriority[];

interface TaskPersistence {
  studentId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  completedAt?: Date;
}

type TaskDocumentShape = TaskPersistence & {
  createdAt: Date;
  updatedAt: Date;
};

const taskSchema = new Schema<TaskDocumentShape>(
  {
    studentId: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: TASK_STATUS_VALUES,
      default: "todo",
      required: true,
    },
    priority: {
      type: String,
      enum: TASK_PRIORITY_VALUES,
      default: "medium",
      required: true,
    },
    dueDate: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        delete ret._id;
      },
    },
  },
);

taskSchema.virtual("id").get(function getId(this: {
  _id: { toString: () => string };
}) {
  return this._id.toString();
});

export type TaskDocument = HydratedDocument<TaskDocumentShape>;

export const TaskModel = model<TaskDocumentShape>("Task", taskSchema);

export function toTask(document: TaskDocument): Task {
  const serialized = document.toJSON({ virtuals: true }) as Omit<Task, "id"> & {
    id?: string;
  };

  return {
    ...serialized,
    id: serialized.id ?? document._id.toString(),
  };
}
