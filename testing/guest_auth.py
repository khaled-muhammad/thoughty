import json
import requests
from const import BASE_URL, GUEST_TOKEN_FILE


response = requests.post(BASE_URL + "auth/guest/")
guest_user_token = response.json().get('access')

print(guest_user_token)

if response.status_code == 201:
    tokens = response.json()
    with open(GUEST_TOKEN_FILE, 'w') as f:
        json.dump(tokens, f)
else:
    print(response.content)
    print(response.status_code)