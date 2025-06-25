import json
import requests
from const import BASE_URL, TOKEN_FILE

email    = 'sf@example.com'
password = 'starboy+stargirl'

login_req = requests.post(BASE_URL + "auth/jwt/create/", json={
    "email": email,
    "password": password,
})

if login_req.status_code == 200:
    tokens = login_req.json()
    with open(TOKEN_FILE, 'w') as f:
        json.dump(tokens, f)
else:
    print(login_req.content)
    print(login_req.status_code)