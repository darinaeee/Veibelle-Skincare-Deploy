import requests

BASE_URL = "http://127.0.0.1:8000"

print("🔹 Testing recommendation API...")

resp = requests.get(f"{BASE_URL}/recommend", params={
    "skin_type": "Oily",
    "allergens_list": "fragrance,alcohol",
    "top_k": 5
})

print("Status code:", resp.status_code)
print("Response:", resp.text)
