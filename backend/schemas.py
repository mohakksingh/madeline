from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from models import Priority, Status

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    
    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Priority = Priority.MEDIUM
    status: Status = Status.TODO
    deadline: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    title: Optional[str] = None
    priority: Optional[Priority] = None
    status: Optional[Status] = None

class Task(TaskBase):
    id: int
    created_at: datetime
    owner_id: int

    class Config:
        from_attributes = True

class SubtaskBase(BaseModel):
    title: str
    completed: bool = False

class SubtaskCreate(SubtaskBase):
    pass

class Subtask(SubtaskBase):
    id: int
    task_id: int

    class Config:
        from_attributes = True

class Task(TaskBase):
    id: int
    created_at: datetime
    owner_id: int
    subtasks: list[Subtask] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
