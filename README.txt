Team Task Manager (Full-Stack)

A web application where users can create projects, assign tasks, and track progress with role-based access.

## Live URL
[Insert your Railway Live URL here]

## GitHub Repository
[Insert your GitHub Repo URL here]

## Tech Stack
- Frontend: React (Vite), React Router, Axios, Lucide React
- Styling: Vanilla CSS (Custom Design System with Glassmorphism)
- Backend: Node.js, Express.js
- Database: SQLite (via Prisma ORM)
- Authentication: JWT

## Features implemented
- Role-based Access Control (Admin vs Member)
- JWT Authentication (Signup/Login)
- Project creation and management
- Task creation, assignment to members, status tracking (To Do, In Progress, Done)
- Dashboard displaying statistics and overdue tasks
- Premium dark-mode UI with dynamic micro-animations

## How to run locally

### 1. Setup Backend
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev

The backend will start on http://localhost:5000

### 2. Setup Frontend
cd frontend
npm install
npm run dev

The frontend will start on http://localhost:5173

### 3. Usage
- Create an account and select your role (Admin or Member).
- Admins can create projects and assign tasks to any registered member.
- Members can view projects and update the status of tasks assigned to them.
