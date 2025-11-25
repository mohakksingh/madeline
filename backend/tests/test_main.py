from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from ..main import app
from ..database import Base, get_db
import pytest

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="module")
def test_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_create_user(test_db):
    response = client.post(
        "/auth/signup",
        json={"email": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

def test_login_user(test_db):
    response = client.post(
        "/auth/token",
        data={"username": "test@example.com", "password": "testpassword"},
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    return response.json()["access_token"]

def test_create_task(test_db):
    token = test_login_user(test_db)
    response = client.post(
        "/tasks/",
        json={"title": "Test Task", "description": "Test Description", "priority": "medium"},
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Test Task"

def test_read_tasks(test_db):
    token = test_login_user(test_db)
    response = client.get(
        "/tasks/",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    assert len(response.json()) > 0
