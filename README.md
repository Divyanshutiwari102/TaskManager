# 📋 Team Task Manager

A full-stack team collaboration and task management application built with **React** (frontend) and **Spring Boot** (backend), featuring JWT-based authentication, role-based access control, and project/task management workflows.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6, Axios, Tailwind CSS |
| Backend | Spring Boot 3.2, Spring Security, Spring Data JPA |
| Database | PostgreSQL |
| Auth | JWT (JSON Web Tokens) |
| Build Tools | Maven (backend), npm (frontend) |

---

## ✨ Features

- **Authentication** — Signup & Login with JWT tokens; auto-logout on token expiry
- **Role-Based Access** — `ADMIN` and `MEMBER` roles with different permissions
- **Projects** — Create, view, and manage projects; add/remove members
- **Tasks** — Create tasks under projects, assign to members, set due dates
- **Task Status** — Update task status: `TODO → IN_PROGRESS → DONE`
- **Dashboard** — Overview of projects and tasks at a glance
- **Protected Routes** — All pages behind authentication guard

---

## 🏗 Project Structure

```
team-task-manager/
├── team-task-manager-frontend/      # React app
│   ├── src/
│   │   ├── api/axios.js             # Axios instance + interceptors
│   │   ├── context/AuthContext.js   # Global auth state
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── ProtectedRoute.js
│   │   └── pages/
│   │       ├── Login.js
│   │       ├── Signup.js
│   │       ├── Dashboard.js
│   │       ├── Projects.js
│   │       ├── ProjectDetail.js
│   │       └── Tasks.js
│   ├── tailwind.config.js
│   └── package.json
│
└── team-task-manager-backend/       # Spring Boot app
    └── src/main/java/com/taskmanager/
        ├── controller/              # REST controllers
        │   ├── AuthController.java
        │   ├── ProjectController.java
        │   ├── TaskController.java
        │   └── DashboardController.java
        ├── service/                 # Business logic
        ├── entity/                  # JPA entities (User, Project, Task)
        ├── dto/                     # Request/Response DTOs
        ├── repository/              # Spring Data JPA repos
        ├── security/                # JWT filter, JwtUtil, UserDetailsService
        └── config/SecurityConfig.java
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/signup` | Register new user | Public |
| POST | `/api/auth/login` | Login & get JWT | Public |

### Projects
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/projects` | Get my projects | All users |
| POST | `/api/projects` | Create project | ADMIN only |
| GET | `/api/projects/{id}` | Get project details | All users |
| POST | `/api/projects/{id}/members/{userId}` | Add member | ADMIN only |
| DELETE | `/api/projects/{id}/members/{userId}` | Remove member | ADMIN only |
| GET | `/api/projects/{id}/members` | List members | All users |

### Tasks
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/projects/{projectId}/tasks` | Get tasks by project | All users |
| POST | `/api/projects/{projectId}/tasks` | Create task | ADMIN only |
| PATCH | `/api/tasks/{taskId}/status` | Update task status | All users |
| PUT | `/api/tasks/{taskId}` | Update task | ADMIN only |
| DELETE | `/api/tasks/{taskId}` | Delete task | ADMIN only |
| GET | `/api/tasks/my` | Get my assigned tasks | All users |

### Dashboard
| Method | Endpoint | Description | Access |
|---|---|---|---|
| GET | `/api/dashboard` | Get dashboard summary | All users |

---

## ⚙️ Local Setup

### Prerequisites
- **Java 17+**
- **Maven 3.8+**
- **Node.js 16+** and **npm**
- **PostgreSQL** (running locally or via cloud)

---

### Backend Setup

**1. Clone and navigate:**
```bash
cd team-task-manager-backend
```

**2. Create a `.env` file** (copy from `.env.example`):
```bash
cp .env.example .env
```

**3. Fill in your `.env`:**
```env
DATABASE_URL=jdbc:postgresql://localhost:5432/taskmanager
DB_USERNAME=your_postgres_username
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_super_secret_key_minimum_32_chars_long
PORT=8080
```

**4. Create the PostgreSQL database:**
```sql
CREATE DATABASE taskmanager;
```

**5. Run the backend:**
```bash
mvn spring-boot:run
```

Backend starts at **`http://localhost:8080`**

> Tables are auto-created by Hibernate (`ddl-auto=update`) on first run.

---

### Frontend Setup

**1. Navigate to frontend:**
```bash
cd team-task-manager-frontend
```

**2. Install dependencies:**
```bash
npm install
```

**3. (Optional) Create `.env` file** to point to your backend:
```env
REACT_APP_API_URL=http://localhost:8080/api
```

**4. Start the dev server:**
```bash
npm start
```

Frontend starts at **`http://localhost:3000`**

---

## 🗄 Database Schema

```
users
├── id (PK)
├── email (unique)
├── password (bcrypt)
├── name
└── role (ADMIN | MEMBER)

projects
├── id (PK)
├── name
├── description
└── created_by (FK → users)

project_members (join table)
├── project_id (FK → projects)
└── user_id (FK → users)

tasks
├── id (PK)
├── title
├── description
├── status (TODO | IN_PROGRESS | DONE)
├── due_date
├── project_id (FK → projects)
└── assigned_to (FK → users)
```

---

## 🔐 Role Permissions

| Action | ADMIN | MEMBER |
|---|---|---|
| Create Project | ✅ | ❌ |
| Add/Remove Members | ✅ | ❌ |
| Create/Edit/Delete Task | ✅ | ❌ |
| Update Task Status | ✅ | ✅ |
| View Projects & Tasks | ✅ | ✅ |
| View Dashboard | ✅ | ✅ |

---

## 🌐 Environment Variables Reference

### Backend
| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL JDBC URL | `jdbc:postgresql://localhost:5432/taskmanager` |
| `DB_USERNAME` | DB username | `postgres` |
| `DB_PASSWORD` | DB password | `secret` |
| `JWT_SECRET` | JWT signing secret (min 32 chars) | `mySecretKey123...` |
| `PORT` | Server port (default: 8080) | `8080` |

### Frontend
| Variable | Description | Default |
|---|---|---|
| `REACT_APP_API_URL` | Backend API base URL | `http://localhost:8080/api` |

---

## 📦 Build for Production

**Backend JAR:**
```bash
cd team-task-manager-backend
mvn clean package -DskipTests
java -jar target/team-task-manager-0.0.1-SNAPSHOT.jar
```

**Frontend build:**
```bash
cd team-task-manager-frontend
npm run build
```

---

## 🤝 Contributing

```bash
# Fork the repo
git checkout -b feature/your-feature
git commit -m "Add: your feature"
git push origin feature/your-feature
# Open a Pull Request
```

---

## 📜 License

This project is licensed under the MIT License.
