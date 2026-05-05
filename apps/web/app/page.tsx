"use client";

import { useState } from "react";
import { TaskDashboardClient } from "../components/TaskDashboardClient";
import { CreateTaskModal } from "../components/CreateTaskModal";

export default function DashboardPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <>
      <TaskDashboardClient onCreateClick={() => setIsCreateOpen(true)} />

      <CreateTaskModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </>
  );
}
