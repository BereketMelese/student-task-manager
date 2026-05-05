import { useQuery } from "@tanstack/react-query";
import { taskApi, type GetAllTasksFilters } from "@repo/api";
import type { EntityId } from "@repo/shared-types";

export const taskKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (filters: GetAllTasksFilters) =>
    [...taskKeys.lists(), { filters }] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: EntityId) => [...taskKeys.details(), id] as const,
};

export function useTasks(filters: GetAllTasksFilters = {}) {
  return useQuery({
    queryKey: taskKeys.list(filters),
    queryFn: () => taskApi.getAllTasks(filters),
  });
}

export function useTask(id: EntityId) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => taskApi.getTaskById(id),
    enabled: !!id,
  });
}
