## Guide for SUPER users on how to register an app:
### Create client
`POST /oauth/client`

This is a secure route and requires users to be logged in directly on the platform to access it.

Users can make clients when logged into the platform, and will recieve a response with the details of the client to be used when setting up oauth.

**Input**

Name | Type | Description
---|---|---
name | string | **Required** Name of the App/client you are setting up.
redirectUris | Array of strings | **Required** At least one redirect URL that OTP can send back the Authorization code used in Oauth2 flow to as a query parameter

**Sample Request**
```
{
  "name": "My First Client",
  "redirectUris": ["www.foundersandcoders.com"]
}
```

**Sample Response**

```
Status: 201 Created

{
    "__v": 0,
    "name": "My First Client",
    "user": "59b691f30ca38514c8a53235",
    "secret": "qvFwiPe2A5L15zFs",
    "_id": "59be4750860f29104898c992",
    "redirectUris": [
        "www.foundersandcoders.com"
    ],
    "grants": [
        "authorization_code"
    ]
}
```

The `user` refers to the ID of the logged in user who created this client. The `id` and `secret` are the `client_id` and `client_secret` to be used in the Oauth2 authorization code flow. The client secret will be 16 digit alphanumeric randomly generated.