import requests
from const import BASE_URL

email    = 'example_john@example.com'
username = 'example12'
password = 'starboy+stargirl'

reg_req = requests.post(BASE_URL + "auth/users/", json={
    "email": email,
    "username": username,
    "password": password,
    "re_password": password,
})

print("Register:", reg_req.status_code, reg_req.text)