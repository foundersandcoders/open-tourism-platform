# Authorization options for OAuth Apps

Use this guide to enable other users to authorize your OAuth app.

> Note: Nazareth Open Tourism Platform's OAuth implementation supports the standard [authorization code](https://tools.ietf.org/html/rfc6749#section-4.1) grant type. You should implement the web application flow described below to obtain an authorization code and then exchange it for a token.

## Web Application Flow
The flow to authorize users for your app is:

- Register your app with Nazareth Open Tourism Platform to obtain a `client_id` and `client_secret`
- Prompt users to authorize your app
- Receive a temporary `authorization_code` and request an `access_token`
- Access the Nazareth Open Tourism Platform API with the user's access token

### 1. Register your app with Nazareth Open Tourism Platform to obtain a "client_id" and "client_secret"

If you want to allow users to log in to your app using their Nazareth Open Tourism Platform account, first you must register your app with the Nazareth Open Tourism Platform. Currently the way to do this is to contact us or raise an issue [here](https://github.com/foundersandcoders/open-tourism-platform/issues) to indicate you would like to register your app. We will provide you with a `client_id` and `client_secret`, which must not be made public. 

> N.B. In the OAuth flow, the term `client` refers to the app which is using login via the Nazareth Open Tourism Platform.

### 2. Prompt users to authorize your app

When users select to log in to your app with the Nazareth Open Tourism Platform, they should be redirected to the page to authorize your app, at the following URL (including the query parameters listed below):

```
GET https://nazareth-open-tourism-platform.herokuapp.com/oauth/authorize
```

**Query parameters**

Name | Type | Description
--- | --- | ---
client_id | string | **Required.** The client ID you received from Nazareth Open Tourism Platform for your app.
redirect_uri | string | **Required.** The URL in your application where users will be sent after authorization.
state | string | **Required.** An unguessable random string. It is used to protect against malicious cross-site request forgery attacks.

### 3. Receive a temporary "authorization code" and request an "access_token"

If the user accepts your request, Nazareth Open Tourism Platform redirects back to your site with a temporary authorization code in a `code` query parameter in the URL, as well as the state you provided in the previous step in a `state` query parameter. If the states don't match, the request was created by a (potentially malicious) third party and the process should be aborted.

Exchange the `code` for an access token by sending an https `POST` request to the following URL (including the parameters below in the payload of the request):

```
POST https://nazareth-open-tourism-platform.herokuapp.com/oauth/token
```

**Important Notes:**
- The request must be sent with the `Content-Type` header set to `application/x-www-form-urlencoded`.
- The payload of the request must be in a querystring format, e.g. using the Node core module [querystring](https://nodejs.org/api/querystring.html#querystring_querystring_stringify_obj_sep_eq_options):
- The request should be sent as soon as the authorization code is received.

**Parameters**

Name | Type | Description
--- | --- | ---
client_id | string | **Required.** The client ID you received from Nazareth Open Tourism Platform for your app.
client_secret | string | **Required.** The client secret you received from Nazareth Open Tourism Platform for your app.
code | string | **Required.** The authorization code you received as a response to Step 1.
redirect_uri | string | **Required.** The URL in your application where users are sent after authorization.
grant_type | string | **Required.** Must be 'authorization_code'.

**Response**

The response body takes the following form:
```
{
  access_token: <access_token>
  token_type: 'Bearer'
  expires_in: <number_of_minutes>
  refresh_token: <refresh_token>
}
```

- `access_token` is the token you will use in the next step.
- `token_type` should be 'Bearer'
- `expires_in` will be the number of minutes until the token expires
- `refresh_token` is another token which can be used to get a new access_token when the previous one has expired.

### 4. Access the Nazareth Open Tourism Platform API with the user's access token

The access token allows you to make requests to the API on a behalf of a user (See the API docs [here](./api.md)). You should pass the access_token in the `Authorization` header like so:

```
Authorization: Bearer <access_token>
```

You may also want to:
- encrypt the access_token and store it in a cookie or token
- store the `access_token` in a database

### Refresh Tokens

Guide coming soon.
