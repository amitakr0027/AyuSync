# backend/test_api.py
import requests
import json

BASE_URL = "http://localhost:8000"

def test_endpoints():
    print("Testing API endpoints...")
    
    # Test basic endpoints
    endpoints = [
        "/",
        "/api/namaste/search?q=vata",
        "/api/icd/search?q=bowel",
        "/api/concept-map/NAM-001"
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{BASE_URL}{endpoint}", timeout=5)
            print(f"✅ {endpoint}: {response.status_code}")
            if response.status_code == 200:
                print(f"   Response: {json.dumps(response.json()[:2], indent=2)}...")
        except Exception as e:
            print(f"❌ {endpoint}: ERROR - {e}")
    
    print("\n" + "="*50)
    print("If you see errors above, your API endpoints are not working properly")
    print("Make sure your Python backend is running: python main.py")

if __name__ == "__main__":
    test_endpoints()