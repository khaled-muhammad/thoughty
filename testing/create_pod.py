import json
import requests
from const import BASE_URL, get_auth_headers


req = requests.post(BASE_URL + 'pods/', json={
    'title': 'KiwiTime',
    'content': 'A mobile app, integrated with AI for time management',
    'stage': 'idea', # idea, draft, review, final
    'tags':[],
    'version': 1,
    'is_public': False,
}, headers=get_auth_headers())

print(req.content)
with open('res.html', 'wb') as f:
    f.write(req.content)
print(req.status_code)