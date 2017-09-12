# Authorization options for OAuth Apps

Use this guide to enable other users to authorize your OAuth app.

> Note: Nazareth Open Tourism Platform's OAuth implementation supports the standard [authorization code](https://tools.ietf.org/html/rfc6749#section-4.1) grant type. You should implement the web application flow described below to obtain an authorization code and then exchange it for a token.

## Web Application Flow
The flow to authorize users for your app is:

- Users are prompted to authorize your app
- Users are redirected back to your site by Nazareth Open Tourism Platform
- Access the Nazareth Open Tourism Platform API with the user's access token

### 1. Users are prompted to authorize your app

When users select to log in to your app with the Nazareth Open Tourism Platform, they should be redirected to the page to authorize your app, at the URL below. If necessary, the user will be prompted to log in to the Nazareth Open Tourism Platform before reaching this page.

```
GET https://nazareth-open-tourism-platform.herokuapp.com/oauth/authorize
```

**Query parameters**

Name | Type | Description
--- | --- | ---
client_id | string | **Required.** The client ID you received from Nazareth Open Tourism Platform for your app.
redirect_uri | string | **Required.** The URL in your application where users will be sent after authorization.
state | string | **Required.** An unguessable random string. It is used to protect against cross-site request forgery attacks.

### 2. Users are redirected back to your site by Nazareth Open Tourism Platform

If the user accepts your request, Nazareth Open Tourism Platform redirects back to your site with a temporary authorizaion code in a `code` parameter as well as the state you provided in the previous step in a `state` parameter. If the states don't match, the request was created by a third party and the process should be aborted.

Exchange the `code` for an access token:

```
POST https://nazareth-open-tourism-platform.herokuapp.com/oauth/token
```

**Query parameters**

Name | Type | Description
--- | --- | ---
client_id | string | **Required.** The client ID you received from Nazareth Open Tourism Platform for your app.
client_secret | string | **Required.** The client secret you received from Nazareth Open Tourism Platform for your app.
code | string | **Required.**The code you received as a response to Step 1.
redirect_uri | string | **Required.** The URL in your application where users are sent after authorization.
grant_type | string | **Required.** Must be 'authorization_code'.
state | string | **Required.** The unguessable random string you provided in step 1.

**Response**

The response takes the following form:
```js
{
  access_token: <access_token>
  token_type: 'Bearer'
  expires_in: <number of minutes>
  refresh_token: <refresh_token>
}
```

- `access_token` is the token you will use in the next step.
- `token_type` should be 'Bearer'
- `expires_in` will be the number of minutes until the token expires
- `refresh_token` is another token which can be used to get a new access_token when the previous one has expired.

### 3. Access the Nazareth Open Tourism Platform API with the user's access token

The access token allows you to make requests to the API on a behalf of a user (See the API docs [here](./api.md)). You should pass the access_token in the `Authorization` header like so:

```
Authorization: Bearer <access_token>
```

### Refresh Tokens

Guide coming soon.
