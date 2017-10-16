# Open Tourism Platform API

An API providing data for the four apps on the Nazareth Open Tourism Platform, built by graduates of [Founders and Coders](https://foundersandcoders.com/about/).

Base URL: https://nazareth-open-tourism-platform.herokuapp.com/

## Contents
**Events**
- [Get all events](#get-all-events)
- [Get event by id](#get-event-by-id)
- [Create event](#create-event)
- [Update event](#update-event)
- [Delete event](#delete-event)

**Places**
- [Get all places](#get-all-places)
- [Get place by id](#get-place-by-id)
- [Create place](#create-place)
- [Update place](#update-place)
- [Delete place](#delete-place)

**Products**
- [Get all products](#get-all-products)
- [Get product by id](#get-product-by-id)
- [Create product](#create-product)
- [Update product](#update-product)
- [Delete product](#delete-product)

**Users**
- [Get all users](#get-all-users)
- [Get user by id](#get-user-by-id)
- [Create user](#create-user)
- [Update user](#update-user)
- [Delete user](#delete-user)

**Clients**
- [Get users clients](#get-users-clients)
- [Create clients](#create-clients)

**Categories**
- [Accessibility Options](../src/models/constants.json#L7-L19)
- [Places](../src/models/constants.json#L20-L30)
- [Event](../src/models/constants.json#L31-L43)
- [Products](../src/models/constants.json#L44-L55)
## Events

### Get all events
`GET /events`

**Query parameters**

Name | Type | Description
--- | --- | ---
date_from | date string in the form "YYYY-MM-DD" | All returned events should have a startTime later than or equal to 00:00 on this date, if supplied.
date_to | date string in the form "YYYY-MM-DD" | All returned events should have a startTime earlier than this date, if supplied.

**Sample Response**
```
Status: 200 OK

[
  {
    "__v": 0,
    "updatedAt": "2017-08-02T14:48:20.989Z",
    "createdAt": "2017-08-02T14:48:20.989Z",
    "owner": "8496873ea34958810182138c",
    "place": {
      _id: '599152711fd6dc190c9940c1',
      "updatedAt": "2017-08-14T07:34:09.985Z",
      "createdAt": "2017-08-14T07:34:09.985Z",
      "en": {
        "name": "Basilica",
        "description": "biggest church in the middle east"
      },
      "__v": 0,
      "accessibilityOptions": [],
      "categories": []
    },
    "startTime": "2001-01-01T00:00:00.000Z",
    "endTime": "2002-02-02T00:00:00.000Z",
    "cost": "100 shekels",
    "imageUrl": "imgIsHere.com/12345",
    "en": {
      "name": "Party at the guesthouse",
      "description": "Really cool"
    },
    "_id": "5981e634b6e958614d64e111",
    "accessibilityOptions": [
      "Braille",
      "Wheelchair access"
    ],
    "categories": [
      "music",
      "dining"
    ]
  }
]
```

### Get event by id
`GET /events/:id`

**Sample Response**
```
Status: 200 OK

{
  "__v": 0,
  "updatedAt": "2017-08-02T14:48:20.989Z",
  "createdAt": "2017-08-02T14:48:20.989Z",
  "owner": "8496873ea34958810182138c",
  "place": {
    _id: '599152711fd6dc190c9940c1',
    "updatedAt": "2017-08-14T07:34:09.985Z",
    "createdAt": "2017-08-14T07:34:09.985Z",
    "en": {
      "name": "Basilica",
      "description": "biggest church in the middle east"
    },
    "__v": 0,
    "accessibilityOptions": [],
    "categories": []
  },
  "startTime": "2001-01-01T00:00:00.000Z",
  "endTime": "2002-02-02T00:00:00.000Z",
  "cost": "100 shekels",
  "imageUrl": "imgIsHere.com/12345",
  "en": {
    "name": "Party at the guesthouse",
    "description": "Really cool"
  },
  "_id": "5981e634b6e958614d64e111",
  "accessibilityOptions": [
    "Braille",
    "Wheelchair access"
  ],
  "categories": [
    "music",
    "dining"
  ]
}
```

### Create event
`POST /events`

**Input**

Name | Type | Description
---|---|---
owner | mongoose ObjectId | id of event owner.
categories | array of strings | **Required**. Event [categories](#event-categories).
place | mongoose ObjectId | id of event location.
accessibilityOptions | array of strings | Event [accessibility options](#accessibility-options).
startTime | date | Event start time.
endTime | date | Event end time.
cost | string | Rough estimation of event cost.
imageUrl | string | Link to image of event.
name* | string | **Required**. Name of event.
description* | string | More information about event.

\* These inputs are language-specific, and should be placed inside an object, either `en` or `ar`, at least one of which is required.

**Sample Request**
```
{
  "owner": "8496873ea34958810182138c",
  "categories": [
    "music",
    "dining"
  ],
  "place": "9348293df12398123885930a",
  "accessibilityOptions": [
    "Braille",
    "Wheelchair access"
  ],
  "startTime": "2001-01-01T00:00:00.000Z",
  "endTime": "2002-02-02T00:00:00.000Z",
  "cost": "100 shekels",
  "imageUrl": "imgIsHere.com/12345",
  "en": {
    "name": "Party at the guesthouse",
    "description": "Really cool"
  }
}
```

**Sample Response**
```
Status: 201 Created

{
  "__v": 0,
  "updatedAt": "2017-08-02T14:48:20.989Z",
  "createdAt": "2017-08-02T14:48:20.989Z",
  "owner": "8496873ea34958810182138c",
  "place": "9348293df12398123885930a",
  "startTime": "2001-01-01T00:00:00.000Z",
  "endTime": "2002-02-02T00:00:00.000Z",
  "cost": "100 shekels",
  "imageUrl": "imgIsHere.com/12345",
  "en": {
    "name": "Party at the guesthouse",
    "description": "Really cool"
  },
  "_id": "5981e634b6e958614d64e111",
  "accessibilityOptions": [
    "Braille",
    "Wheelchair access"
  ],
  "categories": [
    "music",
    "dining"
  ]
}
```

### Update event
`PUT /events/:id`

**Input**

Name | Type | Description
---|---|---
owner | mongoose ObjectId | id of event owner.
categories | array of strings | **Required**. Event [categories](#event-categories).
place | mongoose ObjectId | id of event location.
accessibilityOptions | array of strings | Event [accessibility options](#accessibility-options).
startTime | date | Event start time.
endTime | date | Event end time.
cost | string | Rough estimation of event cost.
imageUrl | string | Link to image of event.
name* | string | **Required**. Name of event.
description* | string | More information about event.

\* These inputs are language-specific, and should be placed inside an object, either `en` or `ar`, at least one of which is required.

**Sample Request**
```
{
  "en": {
    "name": "Party at the guesthouse V2"
  }
}
```

**Sample Response**
```
Status: 200 OK

{
  "__v": 0,
  "updatedAt": "2017-08-02T14:48:20.989Z",
  "createdAt": "2017-08-02T14:48:20.989Z",
  "owner": "8496873ea34958810182138c",
  "place": "9348293df12398123885930a",
  "startTime": "2001-01-01T00:00:00.000Z",
  "endTime": "2002-02-02T00:00:00.000Z",
  "cost": "100 shekels",
  "imageUrl": "imgIsHere.com/12345",
  "en": {
    "name": "Party at the guesthouse V2",
    "description": "Really cool"
  },
  "_id": "5981e634b6e958614d64e111",
  "accessibilityOptions": [
    "Braille",
    "Wheelchair access"
  ],
  "categories": [
    "music",
    "dining"
  ]
}
```

### Delete event
`DELETE /events/:id`

**Sample Response**

```
Status: 204 No Content
```

## Places

### Get all places
`GET /places`

**Permissions**
 There are no restrictions on this route.
 
**Sample Response**
```
Status: 200 OK

[
  {
    "__v": 0,
    "updatedAt": "2017-07-31T08:33:40.199Z",
    "createdAt": "2017-07-31T08:33:40.199Z",
    "owner": "8496873ea34958810182138c",
    "location": [
      32.701358,
      32.2968133
    ],
    "imageUrl": "imgIsHere.com/12345",
    "website": "myWebsite.com",
    "phone": "07774443333",
    "email": "myEmail@me.com",
    "en": {
      "name": "Alreda",
      "description": "Super cool",
      "address": "Old town",
      "openingHours": "10am-11pm"
    },
    "_id": "597eeb64aecdd6283a873898",
    "accessibilityOptions": [
      "Braille",
      "Wheelchair access"
    ],
    "categories": [
      "food and drink",
      "cafe"
    ]
  }
]
```

### Get place by id
`GET /places/:id`

**Permissions**
 There are no restrictions on this route.

**Sample Response**
```
Status: 200 OK

{
  "__v": 0,
  "updatedAt": "2017-07-31T08:33:40.199Z",
  "createdAt": "2017-07-31T08:33:40.199Z",
  "owner": "8496873ea34958810182138c",
  "location": [
    32.701358,
    32.2968133
  ],
  "imageUrl": "imgIsHere.com/12345",
  "website": "myWebsite.com",
  "phone": "07774443333",
  "email": "myEmail@me.com",
  "en": {
    "name": "Alreda",
    "description": "Super cool",
    "address": "Old town",
    "openingHours": "10am-11pm"
  },
  "_id": "597eeb64aecdd6283a873898",
  "accessibilityOptions": [
    "Braille",
    "Wheelchair access"
  ],
  "categories": [
    "food and drink",
    "cafe"
  ]
}
```

### Create place
`POST /places`

**Permissions**
 There are no restrictions on this route.

**Input**

Name | Type | Description
---|---|---
owner | mongoose ObjectId | id of owner in user table.
location | array of numbers | Location coordinates.
categories | array of strings | Place [categories](#place-categories).
accessibilityOptions | array of strings | Place [accessibility options](#accessibility-options).
imageUrl | string | Link to image of place.
website | string | Link to place's website.
phone | string | Place phone number.
email | string | Place email.
name* | string | **Required**. Place name.
description* | string | Place description.
address* | string | Place address.
openingHours* | string | Place opening hours.

\* These inputs are language-specific, and should be placed inside an object, either `en` or `ar`, at least one of which is required.

**Sample Request**
```
{
  "owner": "8496873ea34958810182138c",
  "location": [
    32.701358,
    32.2968133
  ],
  "categories": [
    "food and drink",
    "cafe"
  ],
  "accessibilityOptions": [
    "Braille",
    "Wheelchair access"
  ],
  "imageUrl": "imgIsHere.com/12345",
  "website": "myWebsite.com",
  "phone": "07774443333",
  "email": "myEmail@me.com",
  "en": {
    "name": "Alreda",
    "description": "Super cool",
    "address": "Old town",
    "openingHours": "10am-11pm"
  }
}
```

**Sample Response**
```
Status: 201 Created

{
  "__v": 0,
  "updatedAt": "2017-07-31T08:33:40.199Z",
  "createdAt": "2017-07-31T08:33:40.199Z",
  "owner": "8496873ea34958810182138c",
  "location": [
    32.701358,
    32.2968133
  ],
  "imageUrl": "imgIsHere.com/12345",
  "website": "myWebsite.com",
  "phone": "07774443333",
  "email": "myEmail@me.com",
  "en": {
    "name": "Alreda",
    "description": "Super cool",
    "address": "Old town",
    "openingHours": "10am-11pm"
  },
  "_id": "597eeb64aecdd6283a873898",
  "accessibilityOptions": [
    "Braille",
    "Wheelchair access"
  ],
  "categories": [
    "food and drink",
    "cafe"
  ]
}
```

### Update place
`PUT /places/:id`

**Permissions**
 This route is only accessible to admin users or the owner of the place. See the table below for specific field permissions.

**Input**

Name | Type | Description | Field Permissions
---|---|---|---
owner | mongoose ObjectId | id of owner in user table-|can only be updated by admin users
location | array of numbers | Location coordinates-|---
categories | array of strings | Place [categories](#place-categories)-|---
accessibilityOptions | array of strings | Place [accessibility options](#accessibility-options)-|---
imageUrl | string | Link to image of place-|---
website | string | Link to place's website-|---
phone | string | Place phone number-|---
email | string | Place email-|---
name* | string | **Required**. Place name-|---
description* | string | Place description-|---
address* | string | Place address-|---
openingHours* | string | Place opening hours-|---

\* These inputs are language-specific, and should be placed inside an object, either `en` or `ar`, at least one of which is required.

**Sample Request**
```
{
  "en": {
    "name": "Alreda V2"
  }
}
```

**Sample Response**
```
Status: 200 OK

{
  "__v": 1,
  "updatedAt": "2017-07-31T08:33:40.199Z",
  "createdAt": "2017-07-31T08:33:40.199Z",
  "owner": "8496873ea34958810182138c",
  "location": [
    32.701358,
    32.2968133
  ],
  "imageUrl": "imgIsHere.com/12345",
  "website": "myWebsite.com",
  "phone": "07774443333",
  "email": "myEmail@me.com",
  "en": {
    "name": "Alreda V2",
    "description": "Super cool",
    "address": "Old town",
    "openingHours": "10am-11pm"
  },
  "_id": "597eeb64aecdd6283a873898",
  "accessibilityOptions": [
    "Braille",
    "Wheelchair access"
  ],
  "categories": [
    "food and drink",
    "cafe"
  ]
}
```

### Delete place
`DELETE /places/:id`

**Permissions**
 This route is only accessible to super users or the owner of the place.
 
**Sample Response**

```
Status: 204 No Content
```

## Products

### Get all products
`GET /products`

**Sample Response**
```
Status: 200 OK

[
  {
    "__v": 0,
    "updatedAt": "2017-07-31T11:59:18.624Z",
    "createdAt": "2017-07-31T11:59:18.624Z",
    "owner": "8496873ea34958810182138c",
    "imageUrl": "imgIsHere.com/12345",
    "cost": 1000,
    "en": {
      "name": "Cool thing",
      "description": "Really cool"
    },
    "_id": "597f1b96e19cb32c342c0be0",
    "categories": [
      "pottery",
      "clothing"
    ]
  }
]
```

### Get product by id
`GET /products/:id`

**Sample Response**
```
Status: 200 OK

{
  "__v": 0,
  "updatedAt": "2017-07-31T11:59:18.624Z",
  "createdAt": "2017-07-31T11:59:18.624Z",
  "owner": "8496873ea34958810182138c",
  "imageUrl": "imgIsHere.com/12345",
  "cost": 1000,
  "en": {
    "name": "Cool thing",
    "description": "Really cool"
  },
  "_id": "597f1b96e19cb32c342c0be0",
  "categories": [
    "pottery",
    "clothing"
  ]
}
```

### Create product
`POST /product`

**Input**

Name | Type | Description
---|---|---
owner | mongoose ObjectId | id of owner in user table.
categories | array of strings | Product [categories](#product-categories).
imageUrl | string | Link to image of product.
cost | number | Product cost.
name* | string | **Required**. Product name.
description* | string | Product description.

\* These inputs are language-specific, and should be placed inside an object, either `en` or `ar`, at least one of which is required.

**Sample Request**
```
{
  "owner": "8496873ea34958810182138c",
  "categories": [
    "pottery",
    "clothing"
  ],
  "imageUrl": "imgIsHere.com/12345",
  "cost": 1000,
  "en": {
    "name": "Cool thing",
    "description": "Really cool"
  }
}
```

**Sample Response**
```
Status: 201 Created

{
  "__v": 0,
  "updatedAt": "2017-07-31T11:59:18.624Z",
  "createdAt": "2017-07-31T11:59:18.624Z",
  "owner": "8496873ea34958810182138c",
  "imageUrl": "imgIsHere.com/12345",
  "cost": 1000,
  "en": {
    "name": "Cool thing",
    "description": "Really cool"
  },
  "_id": "597f1b96e19cb32c342c0be0",
  "categories": [
    "pottery",
    "clothing"
  ]
}
```

### Update product
`PUT /products/:id`

**Input**

Name | Type | Description
---|---|---
owner | mongoose ObjectId | id of owner in user table.
categories | array of strings | Product [categories](#product-categories).
imageUrl | string | Link to image of product.
cost | number | Product cost.
name* | string | **Required**. Product name.
description* | string | Product description.

\* These inputs are language-specific, and should be placed inside an object, either `en` or `ar`, at least one of which is required.

**Sample Request**
```
{
  "en": {
    "name": "Cool thing V2"
  }
}
```

**Sample Response**
```
Status: 200 OK

{
  "__v": 1,
  "updatedAt": "2017-07-31T11:59:18.624Z",
  "createdAt": "2017-07-31T11:59:18.624Z",
  "owner": "8496873ea34958810182138c",
  "imageUrl": "imgIsHere.com/12345",
  "cost": 1000,
  "en": {
    "name": "Cool thing V2",
    "description": "Really cool"
  },
  "_id": "597f1b96e19cb32c342c0be0",
  "categories": [
    "pottery",
    "clothing"
  ]
}
```

### Delete product
`DELETE /products/:id`

**Sample Response**

```
Status: 204 No Content
```

## Users

### Get all users
`GET /users`

**Sample Response**
```
Status: 200 OK

[
  {
    "__v": 0,
    "updatedAt": "2017-07-31T12:59:09.013Z",
    "createdAt": "2017-07-31T12:59:09.013Z",
    "username": "Saliba",
    "password": "ILoveJack",
    "email": "myEmail@me.com",
    "role": "BASIC",
    "imageUrl": "imgIsHere.com/12345",
    "en": {
      "name": "Mario",
      "organisationName": "Guesthouse management",
      "organisationDescription": "Not real"
    },
    "_id": "597f299dc3a0222edda71f0c",
    "isPublic": true
  }
]
```

### Get user by id
`GET /users/:id`

**Sample Response**
```
Status: 200 OK

{
  "__v": 0,
  "updatedAt": "2017-07-31T12:59:09.013Z",
  "createdAt": "2017-07-31T12:59:09.013Z",
  "username": "Saliba",
  "password": "ILoveJack",
  "email": "myEmail@me.com",
  "role": "BASIC",
  "imageUrl": "imgIsHere.com/12345",
  "en": {
    "name": "Mario",
    "organisationName": "Guesthouse management",
    "organisationDescription": "Not real"
  },
  "_id": "597f299dc3a0222edda71f0c",
  "isPublic": true
}
```

### Create user
`POST /users`

**Input**

Name | Type | Description
---|---|---
username | string | Username.
password | string | User's password.
email | string | User's email.
role | string | User's [role](https://github.com/foundersandcoders/open-tourism-platform/blob/master/src/models/constants.json).
isPublic | boolean | Whether the user's profile is public or not.
imageUrl | string | Link to image of user.
name* | string | **Required**. User's name.
organisationName | string | Organisation name.
organisationDescription | string | Organisation description.

\* These inputs are language-specific, and should be placed inside an object, either `en` or `ar`, at least one of which is required.

**Sample Request**
```
{
  "username": "Saliba",
  "password": "ILoveJack",
  "email": "myEmail@me.com",
  "role": "BASIC",
  "isPublic": true,
  "imageUrl": "imgIsHere.com/12345",
  "en": {
    "name": "Mario",
    "organisationName": "Guesthouse management",
    "organisationDescription": "Made up"
  }
}
```

**Sample Response**
```
Status: 201 Created

{
  "__v": 0,
  "updatedAt": "2017-07-31T12:59:09.013Z",
  "createdAt": "2017-07-31T12:59:09.013Z",
  "username": "Saliba",
  "password": "ILoveJack",
  "email": "myEmail@me.com",
  "role": "BASIC",
  "imageUrl": "imgIsHere.com/12345",
  "en": {
    "name": "Mario",
    "organisationName": "Guesthouse management",
    "organisationDescription": "Made up"
  },
  "_id": "597f299dc3a0222edda71f0c",
  "isPublic": true
}
```

### Update user
`PUT /users/:id`

**Input**

Name | Type | Description
---|---|---
username | string | Username.
password | string | User's password.
email | string | User's email.
role | string | User's [role](https://github.com/foundersandcoders/open-tourism-platform/blob/master/src/models/constants.json).
isPublic | boolean | Whether the user's profile is public or not.
imageUrl | string | Link to image of user.
name* | string | **Required**. User's name.
organisationName | string | Organisation name.
organisationDescription | string | Organisation description.

\* These inputs are language-specific, and should be placed inside an object, either `en` or `ar`, at least one of which is required.

**Sample Request**
```
{
  "en": {
    "name": "Mario V2",
  }
}
```

**Sample Response**
```
Status: 200 OK

{
  "__v": 1,
  "updatedAt": "2017-07-31T12:59:09.013Z",
  "createdAt": "2017-07-31T12:59:09.013Z",
  "username": "Saliba",
  "password": "ILoveJack",
  "email": "myEmail@me.com",
  "role": "BASIC",
  "imageUrl": "imgIsHere.com/12345",
  "en": {
    "name": "Mario V2",
    "organisationName": "Guesthouse management",
    "organisationDescription": "Made up"
  },
  "_id": "597f299dc3a0222edda71f0c",
  "isPublic": true
}
```

### Delete user
`DELETE /users/:id`

**Sample Response**

```
Status: 204 No Content
```

## Clients

### Get users clients
`GET /oauth/clients`

This is a secure route and requires users to be logged in directly on the platform to access it.

Users can register clients on the platform to allow Oauth2 flow with users. This `GET` route allows logged in users to see which clients they have created.


**Sample Response**
```
Status: 200 OK

[
{
  "_id": "59b685121d63cc14069a4f82",
  "name": "myNewApp",
  "secret": "idXgKKRGZ9mnbhkl",
  "__v": 0,
  "user": "59abbd1ec76ace6d19534073",
  "redirectUris": [
  "http://localhost:8000/token"
  ],
  "grants": [
  "authorization_code"
  ]
}
]
```
