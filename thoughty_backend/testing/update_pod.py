import json
import requests
from const import BASE_URL, get_auth_headers


req = requests.patch(BASE_URL + 'pods/13/', json={
    'title': 'SF',
}, headers=get_auth_headers())

print(req.content)
with open('patch_res.html', 'wb') as f:
    f.write(req.content)
print(req.status_code)