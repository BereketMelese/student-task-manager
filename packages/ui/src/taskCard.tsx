import type { Task } from "@repo/shared-types";
import { Card, CardBody, CardFooter, CardHeader } from "./card";
import { Badge } from "./badge";
import { Button } from "./button";

interface TaskCardProps {
  task: Task;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: Task["status"]) => void;
}

export function TaskCard({ task, onDelete, onStatusChange }: TaskCardProps) {
  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  const isOverdue =
    task.dueDate &&
    task.status !== "done" &&
    new Date(task.dueDate) < new Date();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 leading-snug line-clamp-2">
            {task.title}
          </h3>
          <Badge variant={task.priority}>{task.priority}</Badge>
        </div>
      </CardHeader>

      <CardBody>
        {task.description && (
          <p className="text-sm text-gray-500 line-clamp-3 mb-3">
            {task.description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={task.status}>
            {task.status.replace("_", " ")}
          </Badge>

          {formattedDueDate && (
            <span
              className={`text-xs font-medium ${
                isOverdue ? "text-red-600" : "text-gray-500"
              }`}
            >
              {isOverdue ? "⚠ Overdue · " : "Due · "}
              {formattedDueDate}
            </span>
          )}
        </div>

        {task.status !== "done" && onStatusChange && (
          <div className="mt-3 flex gap-2">
            {task.status === "todo" && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onStatusChange(task.id, "in_progress")}
              >
                Start
              </Button>
            )}
            {task.status === "in_progress" && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onStatusChange(task.id, "done")}
              >
                Mark Done
              </Button>
            )}
          </div>
        )}
      </CardBody>

      {onDelete && (
        <CardFooter>
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onDelete(task.id)}
          >
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
