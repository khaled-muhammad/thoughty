import os
import json

import requests

BASE_URL   = 'http://localhost:8000/api/'
TOKEN_FILE = "tokens.json"

def load_tokens():
    if os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, 'r') as f:
            return json.load(f)
    return None

def get_auth_headers():
    tokens = load_tokens()

    if not tokens:
        print("No saved tokens, please login first.")
        return
    
    headers = {
        "Authorization": f"Bearer {tokens['access']}"
    }

    return headers

def authenticated_request():
    headers = get_auth_headers()

    url = BASE_URL + 'auth/users/me/'
    res = requests.get(url, headers=headers)

    print("Authenticated request:", res.status_code, res.text)

if __name__ == '__main__':
    authenticated_request()

# Colors for terminal output
class Colors:
    OK = '\033[92m'
    WARNING = '\033[93m'
    ERROR = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'