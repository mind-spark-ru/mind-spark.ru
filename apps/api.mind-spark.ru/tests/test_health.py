import requests


def test_api_health():
    response = requests.get("http://localhost:8000/v1/api/health")

    assert response.status_code == 200
    assert response.json() == {"health": True}
