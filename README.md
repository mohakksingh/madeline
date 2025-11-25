# TaskFlow

TaskFlow is a full-stack task management system built with Next.js and FastAPI.

## Tech Stack
- **Frontend**: Next.js, TailwindCSS, TypeScript
- **Backend**: FastAPI, SQLAlchemy, SQLite
- **Auth**: JWT (Argon2 hashing)

## Setup

### Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install fastapi uvicorn sqlalchemy pydantic python-multipart argon2-cffi passlib[bcrypt] pytest httpx email-validator
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features
- User Signup/Login
- Create, Edit, Delete Tasks
- Dashboard with Task List
- AI Weekly Summary (Placeholder)

## Testing
Run backend tests:
```bash
# From project root
source backend/venv/bin/activate
python3 -m pytest backend/tests
```
