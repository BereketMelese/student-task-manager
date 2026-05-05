import { useMutation, useQueryClient } from "@tanstack/react-query";
import { taskApi } from "@repo/api";
import type {
  CreateTaskDTO,
  EntityId,
  Task,
  UpdateTaskDTO,
} from "@repo/shared-types";
import { taskKeys } from "./useTasks.js";

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (taskData: CreateTaskDTO) => taskApi.createTask(taskData),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: EntityId; data: UpdateTaskDTO }) =>
      taskApi.updateTask(id, data),
    onSuccess: (data: Task) => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      void queryClient.invalidateQueries({
        queryKey: taskKeys.detail(data.id),
      });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: EntityId) => taskApi.deleteTask(id),
    onSuccess: (_data, id) => {
      void queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      void queryClient.invalidateQueries({ queryKey: taskKeys.detail(id) });
    },
  });
}
