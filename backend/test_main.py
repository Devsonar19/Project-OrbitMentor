from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_generate():
    response = client.post(
        "/api/generate",
        json={"skills": ["Flutter", "FastAPI"], "domain": "Healthcare AI", "tier": "Safe"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "ideas" in data
    assert len(data["ideas"]) > 0
