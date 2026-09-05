from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "online"
    assert data["app"] == "PROJECT ORBITMENTOR"

def test_domains():
    response = client.get("/api/domains")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_skills():
    response = client.get("/api/skills")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0

def test_generate():
    response = client.post(
        "/api/generate",
        json={"skills": ["React", "FastAPI"], "domain": "Healthcare & Telemedicine", "tier": "Safe"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "ideas" in data
    assert len(data["ideas"]) > 0

def test_mentor():
    response = client.post(
        "/api/mentor",
        json={
            "idea_title": "Healthcare Smart Hub",
            "domain": "Healthcare & Telemedicine",
            "skills": ["React", "FastAPI"],
            "tier": "Safe"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "blueprint" in data
    assert len(data["blueprint"]["roadmap_phases"]) > 0

def test_chat():
    response = client.post(
        "/api/chat",
        json={
            "project_title": "Healthcare Smart Hub",
            "domain": "Healthcare & Telemedicine",
            "skills": ["React", "FastAPI"],
            "history": [],
            "message": "What database should I use?"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "reply" in data
