# 📚 Student Task Manager

A production-ready, component-based monorepo for managing academic tasks. Built for a Component-Based Software Development class to demonstrate reusability, separation of concerns, and modern full-stack architecture.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, Tailwind CSS v4 |
| Backend | Express.js 5, Node.js |
| Database | MongoDB + Mongoose |
| Data Fetching | TanStack Query (React Query v5) |
| Monorepo | Turborepo + pnpm workspaces |
| Language | TypeScript (end-to-end) |
| Validation | Zod (API & frontend) |

---

## 📁 Project Structure

```
student-task-manager/
├── apps/
│   ├── api/                        # Express REST API + Mongoose
│   │   └── src/
│   │       ├── models/             # Mongoose Task schema
│   │       ├── services/           # Business logic (taskService)
│   │       ├── routes/             # REST endpoints (/tasks)
│   │       ├── middleware/         # Zod validation + error handler
│   │       └── config/             # DB connection + env config
│   └── web/                        # Next.js 16 frontend
│       ├── app/                    # App Router (layout, page)
│       ├── components/             # TaskDashboardClient, CreateTaskModal
│       └── lib/                    # Zod form validation schema
├── packages/
│   ├── shared/types/               # @repo/shared-types — Task, DTO interfaces
│   ├── ui/                         # @repo/ui — Shared React component library
│   ├── react-query-hooks/          # @repo/react-query-hooks — Data fetching hooks
│   ├── eslint-config/              # Shared ESLint config
│   └── typescript-config/          # Shared TypeScript config
└── docker-compose.yml              # MongoDB container
```

---

## 🧩 Component Architecture

Each package is an independent, reusable component with clear dependencies:

```
@repo/shared-types  ←  Foundation (no deps)
       ↓
@repo/ui            ←  UI components (depends on shared-types)
       ↓
@repo/api           ←  API + Mongoose models (depends on shared-types)
       ↓
@repo/react-query-hooks  ←  Data layer (depends on api + shared-types)
       ↓
apps/web            ←  Dashboard (depends on all packages above)
```

---

## 📦 Shared UI Components (`@repo/ui`)

| Component | Description |
|---|---|
| `Button` | 4 variants (primary, secondary, destructive, ghost), 3 sizes, loading state |
| `Card` | Compound component — `CardHeader`, `CardBody`, `CardFooter` |
| `Badge` | Colour-coded for `TaskStatus` and `TaskPriority` |
| `TaskCard` | Displays a full task with priority, status, due date, overdue warning |
| `Modal` | Backdrop blur, Escape-key dismiss, aria accessible |
| `Input` | Label, error state, focus ring |
| `Select` | Dropdown with options array, same style as Input |
| `LoadingSpinner` | 3 sizes (sm / md / lg) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [pnpm](https://pnpm.io/) >= 9
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for MongoDB)

### 1. Clone and Install

```bash
git clone https://github.com/BereketMelese/student-task-manager.git
cd student-task-manager
pnpm install
```

### 2. Start MongoDB with Docker

```bash
docker-compose up -d
```

This starts a MongoDB instance on `mongodb://localhost:27017`.

### 3. Configure Environment

```bash
cp apps/api/.env.example apps/api/.env
```

The default `.env` content:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/student_task_manager
PORT=3001
```

### 4. Start Development Servers

```bash
pnpm dev
```

Turborepo will start both apps in parallel:

| App | URL |
|---|---|
| 🌐 Web Dashboard | http://localhost:3000 |
| ⚙️ API Server | http://localhost:3001 |
| ❤️ Health Check | http://localhost:3001/health |

---

## 🛠️ Available Scripts

Run from the **project root**:

| Command | Description |
|---|---|
| `pnpm dev` | Start all apps in development mode |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Lint all packages |
| `pnpm format` | Format all files with Prettier |
| `pnpm check-types` | TypeScript type-check all packages |

Run for a **specific package**:

```bash
pnpm --filter web dev          # Start only the web app
pnpm --filter @repo/api dev    # Start only the API
pnpm --filter @repo/ui check-types
```

---

## 📅 Development Log — Commit History

| Week | Commit | Component | Type | Dependencies | Author |
|---|---|---|---|---|---|
| W1-D1 | #1 | Monorepo Setup | Infrastructure | None | **Nibru** |
| W1-D2 | #2 | Mongoose Schema + Model | Persistence | `@repo/shared-types` | **Nibru** |
| W1-D3 | #3 | Task Service | Business Logic | Model + Types | **Nibru** |
| W2-D1 | #4 | Express API Routes | Interface | Task Service | **Nibru** |
| W2-D2 | #5 | API Client (`taskApi`) | HTTP Client | `@repo/shared-types` | **Nibru** |
| W2-D3 | #6 | React Query Hooks | State Management | API Client | **Nibru** |
| W3-D1 | #7 | Shared UI Library | Presentation | `@repo/shared-types` | **Nibru** |
| W3-D2 | #8 | Task Dashboard Page | View | UI + Hooks | **Nibru** |
| W3-D3 | #9 | Task Creation Form | Feature | All above | **Nibru** |
| W3-D1 | #10 | MongoDB Docker Config | Infrastructure | None | **Yeabsira** |
| W3-D1 | #11 | Search Bar UI Component | Presentation | `@repo/ui` | **Yeabsira** |
| W3-D2 | #12 | Search Bar Integration | Feature | UI + Hooks | **Yeabsira** |
| W3-D3 | #13 | Dark Mode / Theme Toggle | Feature | `next-themes` | **Yeabsira** |

---

## 🌐 API Endpoints

Base URL: `http://localhost:3001`

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Server + DB health check |
| `GET` | `/tasks` | Get all tasks (filter by `?status=todo`) |
| `GET` | `/tasks/:id` | Get a single task |
| `POST` | `/tasks` | Create a new task |
| `PATCH` | `/tasks/:id` | Update a task |
| `DELETE` | `/tasks/:id` | Delete a task |

### Create Task — Request Body

```json
{
  "studentId": "student-001",
  "title": "Complete Assignment 3",
  "description": "Optional description",
  "priority": "high",
  "dueDate": "2026-05-20T00:00:00.000Z"
}
```

---

## 👥 Team

| Name | GitHub | Commits | Responsibilities |
|---|---|---|---|
| **Nibru** | [@nibruad16](https://github.com/nibruad16) | #1 → #9 | Monorepo setup, Shared Types, Mongoose Schema, Task Service, Express API, API Client, React Query Hooks, Shared UI Library, Task Dashboard, Task Creation Form |
| **Yeabsira** | — | #10 → #13 | MongoDB Docker config, Search Bar UI component, Search Bar integration, Theme Toggle UI component, Dark Mode integration |

---

## 📄 License

Private — Academic project for Component-Based Software Development class.
