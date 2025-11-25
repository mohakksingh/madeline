# TaskFlow

TaskFlow is a modern, full-stack task management application designed to help you organize your life and boost productivity. Built with **Next.js** and **FastAPI**, it features secure authentication, comprehensive task tracking, and AI-powered insights.

## 🚀 Features

- **🔐 Secure Authentication**: User signup and login protected by JWT tokens and Argon2 password hashing.
- **📝 Task Management**: Create, read, update, and delete tasks with ease.
- **✅ Subtasks**: Break down complex tasks into manageable subtasks.
- **🏷️ Organization**: Categorize tasks, set priorities (Low, Medium, High), and track status (Todo, In Progress, Completed).
- **🤖 AI Insights**: Get a weekly productivity summary and motivational tips powered by **Google Gemini AI**.
- **📱 Responsive Design**: A beautiful, mobile-first interface built with TailwindCSS.
- **💾 Flexible Database**: Supports SQLite for local development and PostgreSQL for production.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Styling**: TailwindCSS
- **Language**: TypeScript
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI
- **ORM**: SQLAlchemy
- **Database**: SQLite (Local) / PostgreSQL (Production)
- **AI Model**: Google Gemini (`gemini-2.0-flash`)
- **Authentication**: Python-Jose (JWT), Passlib (Argon2)

## 🔌 API Endpoints

### Authentication (`/auth`)
- `POST /auth/signup`: Register a new user.
- `POST /auth/token`: Login and retrieve an access token.
- `GET /auth/me`: Get the current authenticated user's profile.

### Tasks (`/tasks`)
- `GET /tasks/`: Retrieve all tasks (supports pagination).
- `POST /tasks/`: Create a new task.
- `GET /tasks/{task_id}`: Get details of a specific task.
- `PUT /tasks/{task_id}`: Update a task.
- `DELETE /tasks/{task_id}`: Delete a task.
- `POST /tasks/{task_id}/subtasks`: Add a subtask to a task.
- `PUT /tasks/subtasks/{subtask_id}`: Update a subtask.
- `DELETE /tasks/subtasks/{subtask_id}`: Delete a subtask.

### AI (`/ai`)
- `GET /ai/summary`: Generate a weekly summary of your tasks using AI.

## ⚡ Setup & Installation

### Prerequisites
- Node.js & npm
- Python 3.10+
- Google Gemini API Key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up environment variables:
   Create a `.env` file in the `backend` directory:
   ```env
   SECRET_KEY=your_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   DATABASE_URL= your PostgreSQL URL
   ```
5. Run the server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env.local` file in the `frontend` directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## 🧪 Testing

Run backend tests using pytest:
```bash
# From project root
source backend/venv/bin/activate
python3 -m pytest backend/tests
```

## 📦 Deployment

- **Backend**: Deployed on [Render](https://madeline-udcj.onrender.com).
- **Frontend**: Deployed on [Vercel](https://madeline-zeta.vercel.app).
