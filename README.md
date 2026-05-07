# 🚀 Team Task Manager

A premium, full-stack web application designed for efficient team collaboration and project management. Built with a modern tech stack, this application features strict role-based access control, dynamic task tracking, and a stunning "dark mode" glassmorphism UI.

---

## ✨ Key Features

- **🛡️ Role-Based Access Control (RBAC):** Distinct `ADMIN` and `MEMBER` roles. Admins can manage projects and reassign tasks, while Members have restricted access to update their specific assignments.
- **🔒 Secure Authentication:** Fully custom JWT-based authentication system with hashed passwords using `bcryptjs`.
- **📊 Dynamic Dashboard:** A real-time overview of your team's progress, highlighting Completed, In-Progress, and Overdue tasks.
- **📂 Project Management:** Organize workflows by grouping related tasks under specific projects.
- **🎨 Premium Aesthetics:** A highly responsive, modern UI built from scratch using custom CSS, featuring glassmorphism cards, dynamic hover states, and smooth micro-animations.

---

## 🛠️ Technology Stack

**Frontend:**
- React 19 + Vite
- React Router DOM (Protected Routes)
- Axios for API communication
- Lucide React (Icons)
- Custom CSS (Glassmorphism & Flexbox Layouts)

**Backend:**
- Node.js & Express.js
- Prisma ORM
- SQLite Database
- JSON Web Tokens (JWT)

---

## 💻 Local Setup Instructions

Want to run this project on your local machine? Follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/Marshuk/team-task-manager.git
   cd team-task-manager
   ```

2. **Install all dependencies**
   (This command installs packages for both the backend and frontend simultaneously)
   ```bash
   npm install
   ```

3. **Set up your environment variables**
   Navigate into the `/backend` folder and create a `.env` file with the following:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your_super_secret_key"
   PORT=5000
   ```

4. **Start the application**
   From the root folder (`team-task-manager`), run:
   ```bash
   npm start
   ```
   The backend will automatically push the database schema, start the server on `localhost:5000`, and serve the frontend. 

---

## 🌐 Deployment (Railway)

This application is fully optimized for a 1-click monorepo deployment on **Railway**. 

1. Create a new Railway project and select **Deploy from GitHub**.
2. Add the following Variables to your Railway environment:
   - `DATABASE_URL` = `file:./dev.db`
   - `JWT_SECRET` = `<your_secret>`
   - `PORT` = `5000`
3. Generate your Railway Domain and launch! 

*Note: The `package.json` scripts are specifically configured to install Vite dependencies, build the frontend, generate the Prisma schema, and serve the static files dynamically without needing separate frontend/backend services.*
