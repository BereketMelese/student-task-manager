"use client";

import { useState } from "react";
import { useCreateTask } from "@repo/react-query-hooks";
import { Modal, Button, Input, Select } from "@repo/ui";
import { createTaskSchema, type CreateTaskFormValues } from "../lib/validation";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRIORITY_OPTIONS = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" },
];

const EMPTY_FORM: CreateTaskFormValues = {
  title: "",
  description: "",
  priority: "medium",
  dueDate: "",
  studentId: "student-001",
};

export function CreateTaskModal({ isOpen, onClose }: CreateTaskModalProps) {
  const [formData, setFormData] = useState<CreateTaskFormValues>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateTaskFormValues, string>>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const createTask = useCreateTask();

  function handleChange(field: keyof CreateTaskFormValues, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear field error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitError(null);

    // Validate with Zod
    const result = createTaskSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof CreateTaskFormValues, string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CreateTaskFormValues;
        fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      await createTask.mutateAsync(result.data);
      // Reset and close on success
      setFormData(EMPTY_FORM);
      setErrors({});
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to create task. Please try again."
      );
    }
  }

  function handleClose() {
    setFormData(EMPTY_FORM);
    setErrors({});
    setSubmitError(null);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Task">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        {/* Title */}
        <Input
          id="task-title"
          label="Title"
          placeholder="e.g. Complete assignment 3"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          error={errors.title}
          required
        />

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="task-description"
            className="text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <textarea
            id="task-description"
            rows={3}
            placeholder="Optional details about the task…"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
          />
        </div>

        {/* Priority */}
        <Select
          id="task-priority"
          label="Priority"
          value={formData.priority}
          onChange={(e) => handleChange("priority", e.target.value)}
          options={PRIORITY_OPTIONS}
          error={errors.priority}
        />

        {/* Due Date */}
        <Input
          id="task-due-date"
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleChange("dueDate", e.target.value)}
          error={errors.dueDate}
        />

        {/* Server error */}
        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
            <p className="text-sm text-red-600">{submitError}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            id="cancel-task-btn"
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={createTask.isPending}
          >
            Cancel
          </Button>
          <Button
            id="submit-task-btn"
            type="submit"
            loading={createTask.isPending}
          >
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
