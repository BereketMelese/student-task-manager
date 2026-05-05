"use client";

import { useState } from "react";
import {
  useTasks,
  useDeleteTask,
  useUpdateTask,
} from "@repo/react-query-hooks";
import { TaskCard, LoadingSpinner, Button } from "@repo/ui";
import type { Task, TaskStatus } from "@repo/shared-types";

const STATUS_TABS: { label: string; value: TaskStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "To Do", value: "todo" },
  { label: "In Progress", value: "in_progress" },
  { label: "Done", value: "done" },
];

interface TaskDashboardClientProps {
  onCreateClick: () => void;
}

export function TaskDashboardClient({
  onCreateClick,
}: TaskDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<TaskStatus | "all">("all");

  const { data: tasks, isLoading, isError, error } = useTasks();
  const deleteTask = useDeleteTask();
  const updateTask = useUpdateTask();

  const filteredTasks =
    activeTab === "all"
      ? (tasks ?? [])
      : (tasks ?? []).filter((t) => t.status === activeTab);

  function handleStatusChange(id: string, status: TaskStatus) {
    updateTask.mutate({ id, data: { status } });
  }

  function handleDelete(id: string) {
    if (window.confirm("Are you sure you want to delete this task?")) {
      deleteTask.mutate(id);
    }
  }

  return (
    <div className="flex flex-col flex-1">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              📚 Task Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Manage and track your academic tasks
            </p>
          </div>
          <Button id="create-task-btn" onClick={onCreateClick}>
            + New Task
          </Button>
        </div>
      </header>

      {/* ── Status Filter Tabs ── */}
      <div className="bg-white border-b border-gray-200 px-6">
        <div className="max-w-7xl mx-auto flex gap-1">
          {STATUS_TABS.map((tab) => {
            const count =
              tab.value === "all"
                ? (tasks?.length ?? 0)
                : (tasks?.filter((t) => t.status === tab.value).length ?? 0);

            return (
              <button
                key={tab.value}
                id={`filter-tab-${tab.value}`}
                onClick={() => setActiveTab(tab.value)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.value
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-xs ${
                    activeTab === tab.value
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <LoadingSpinner size="lg" />
              <p className="text-gray-500 text-sm">Loading tasks…</p>
            </div>
          )}

          {/* Error state */}
          {isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="text-red-700 font-medium">Failed to load tasks</p>
              <p className="text-red-500 text-sm mt-1">
                {error instanceof Error
                  ? error.message
                  : "Unknown error occurred"}
              </p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !isError && filteredTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 gap-3">
              <span className="text-5xl">📋</span>
              <p className="text-gray-600 font-medium">No tasks found</p>
              <p className="text-gray-400 text-sm">
                {activeTab === "all"
                  ? "Click '+ New Task' to create your first task."
                  : `No tasks with status "${activeTab.replace("_", " ")}".`}
              </p>
            </div>
          )}

          {/* Task Grid */}
          {!isLoading && !isError && filteredTasks.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTasks.map((task: Task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={handleDelete}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
