import json
import requests
from const import BASE_URL, get_auth_headers


req = requests.delete(BASE_URL + 'pods/1/', headers=get_auth_headers())

print(req.content)
with open('del_res.html', 'wb') as f:
    f.write(req.content)
print(req.status_code)