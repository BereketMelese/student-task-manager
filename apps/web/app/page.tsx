"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useTasks } from "@repo/react-query-hooks";
import { SearchBar, ThemeToggle } from "@repo/ui";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: tasks = [], isLoading, error } = useTasks();

  // Ensure component is mounted before rendering theme-dependent content
  useEffect(() => {
    setMounted(true);
  }, []);

  // Filter tasks by title (case-insensitive)
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-slate-950">
      <main className="flex flex-1 w-full max-w-4xl flex-col gap-8 py-8 px-6 sm:px-8">
        {/* Header with ThemeToggle */}
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-bold text-black dark:text-white">
              Task Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Manage and search your tasks
            </p>
          </div>
          <ThemeToggle
            theme={theme as "light" | "dark"}
            toggleTheme={() =>
              setTheme(theme === "dark" ? "light" : "dark")
            }
          />
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search tasks by title..."
        />

        {/* Loading and Error States */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">Loading tasks...</p>
          </div>
        )}

        {error && (
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950">
            <p className="text-red-800 dark:text-red-200">
              Error loading tasks. Please try again.
            </p>
          </div>
        )}

        {/* Tasks Grid */}
        {!isLoading && !error && filteredTasks.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
              >
                <h2 className="font-semibold text-black dark:text-white">
                  {task.title}
                </h2>
                {task.description && (
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                    {task.description}
                  </p>
                )}
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                      task.status === "completed"
                        ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                        : task.status === "in-progress"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200"
                          : "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                    }`}
                  >
                    {task.status}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredTasks.length === 0 && tasks.length > 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              No tasks match your search.
            </p>
          </div>
        )}

        {/* No Tasks */}
        {!isLoading && tasks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600 dark:text-slate-400">
              No tasks found. Create your first task!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}


