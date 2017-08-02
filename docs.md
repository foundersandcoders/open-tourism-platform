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

## Events

### Get all events
`GET /events`

**Sample Response**
```
Status: 200 OK

[
  {
    "__v": 0,
    "updatedAt": "2017-08-02T14:48:20.989Z",
    "createdAt": "2017-08-02T14:48:20.989Z",
    "ownerId": "8496873ea34958810182138c",
    "placeId": "9348293df12398123885930a",
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
      "braille-menu",
      "wheelchair-friendly"
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
  "ownerId": "8496873ea34958810182138c",
  "placeId": "9348293df12398123885930a",
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
    "braille-menu",
    "wheelchair-friendly"
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
ownerId | mongoose ObjectId | id of event owner.
categories | array of strings | **Required**. Event [categories](https://github.com/foundersandcoders/open-tourism-platform/blob/master/src/models/constants.json).
placeId | mongoose ObjectId | id of event location.
accessibilityOptions | array of strings | Event [accessibility options](https://github.com/foundersandcoders/open-tourism-platform/blob/master/src/models/constants.json).
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
  "ownerId": "8496873ea34958810182138c",
  "categories": [
    "music",
    "dining"
  ],
  "placeId": "9348293df12398123885930a",
  "accessibilityOptions": [
    "braille-menu",
    "wheelchair-friendly"
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
  "ownerId": "8496873ea34958810182138c",
  "placeId": "9348293df12398123885930a",
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
    "braille-menu",
    "wheelchair-friendly"
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
ownerId | mongoose ObjectId | id of event owner.
categories | array of strings | **Required**. Event [categories](https://github.com/foundersandcoders/open-tourism-platform/blob/master/src/models/constants.json).
placeId | mongoose ObjectId | id of event location.
accessibilityOptions | array of strings | Event [accessibility options](https://github.com/foundersandcoders/open-tourism-platform/blob/master/src/models/constants.json).
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
  "ownerId": "8496873ea34958810182138c",
  "placeId": "9348293df12398123885930a",
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
    "braille-menu",
    "wheelchair-friendly"
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

**Sample Response**
```
Status: 200 OK

[
  {
    "__v": 0,
    "updatedAt": "2017-07-31T08:33:40.199Z",
    "createdAt": "2017-07-31T08:33:40.199Z",
    "ownerId": "8496873ea34958810182138c",
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
      "braille-menu",
      "wheelchair-friendly"
    ],
    "categories": [
      "restaurant",
      "cafe"
    ]
  }
]
```

### Get place by id
`GET /places/:id`

**Sample Response**
```
Status: 200 OK

{
  "__v": 0,
  "updatedAt": "2017-07-31T08:33:40.199Z",
  "createdAt": "2017-07-31T08:33:40.199Z",
  "ownerId": "8496873ea34958810182138c",
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
    "braille-menu",
    "wheelchair-friendly"
  ],
  "categories": [
    "restaurant",
    "cafe"
  ]
}
```

### Create place
`POST /places`

**Input**

Name | Type | Description
---|---|---
ownerId | mongoose ObjectId | id of owner in user table.
location | array of numbers | Location coordinates.
categories | array of strings | Place [categories](https://github.com/foundersandcoders/open-tourism-platform/blob/67d654c4fbe74cdcbad5650d9d110c004673e6f2/src/models/constants.json).
accessibilityOptions | array of strings | Place [accessibility options](https://github.com/foundersandcoders/open-tourism-platform/blob/67d654c4fbe74cdcbad5650d9d110c004673e6f2/src/models/constants.json).
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
  "ownerId": "8496873ea34958810182138c",
  "location": [
    32.701358,
    32.2968133
  ],
  "categories": [
    "restaurant",
    "cafe"
  ],
  "accessibilityOptions": [
    "braille-menu",
    "wheelchair-friendly"
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
  "ownerId": "8496873ea34958810182138c",
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
    "braille-menu",
    "wheelchair-friendly"
  ],
  "categories": [
    "restaurant",
    "cafe"
  ]
}
```

### Update place
`PUT /places/:id`

**Input**

Name | Type | Description
---|---|---
ownerId | mongoose ObjectId | id of owner in user table.
location | array of numbers | Location coordinates.
categories | array of strings | Place [categories](https://github.com/foundersandcoders/open-tourism-platform/blob/67d654c4fbe74cdcbad5650d9d110c004673e6f2/src/models/constants.json).
accessibilityOptions | array of strings | Place [accessibility options](https://github.com/foundersandcoders/open-tourism-platform/blob/67d654c4fbe74cdcbad5650d9d110c004673e6f2/src/models/constants.json).
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
  "ownerId": "8496873ea34958810182138c",
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
    "braille-menu",
    "wheelchair-friendly"
  ],
  "categories": [
    "restaurant",
    "cafe"
  ]
}
```

### Delete place
`DELETE /places/:id`

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
    "ownerId": "8496873ea34958810182138c",
    "imageUrl": "imgIsHere.com/12345",
    "cost": 1000,
    "en": {
      "name": "Cool thing",
      "description": "Really cool"
    },
    "_id": "597f1b96e19cb32c342c0be0",
    "categories": [
      "handicraft",
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
  "ownerId": "8496873ea34958810182138c",
  "imageUrl": "imgIsHere.com/12345",
  "cost": 1000,
  "en": {
    "name": "Cool thing",
    "description": "Really cool"
  },
  "_id": "597f1b96e19cb32c342c0be0",
  "categories": [
    "handicraft",
    "clothing"
  ]
}
```

### Create product
`POST /product`

**Input**

Name | Type | Description
---|---|---
ownerId | mongoose ObjectId | id of owner in user table.
categories | array of strings | Product [categories](https://github.com/foundersandcoders/open-tourism-platform/blob/67d654c4fbe74cdcbad5650d9d110c004673e6f2/src/models/constants.json).
imageUrl | string | Link to image of product.
cost | number | Product cost.
name* | string | **Required**. Product name.
description* | string | Product description.

\* These inputs are language-specific, and should be placed inside an object, either `en` or `ar`, at least one of which is required.

**Sample Request**
```
{
  "ownerId": "8496873ea34958810182138c",
  "categories": [
    "handicraft",
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
  "ownerId": "8496873ea34958810182138c",
  "imageUrl": "imgIsHere.com/12345",
  "cost": 1000,
  "en": {
    "name": "Cool thing",
    "description": "Really cool"
  },
  "_id": "597f1b96e19cb32c342c0be0",
  "categories": [
    "handicraft",
    "clothing"
  ]
}
```

### Update product
`PUT /products/:id`

**Input**

Name | Type | Description
---|---|---
ownerId | mongoose ObjectId | id of owner in user table.
categories | array of strings | Product [categories](https://github.com/foundersandcoders/open-tourism-platform/blob/67d654c4fbe74cdcbad5650d9d110c004673e6f2/src/models/constants.json).
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
  "ownerId": "8496873ea34958810182138c",
  "imageUrl": "imgIsHere.com/12345",
  "cost": 1000,
  "en": {
    "name": "Cool thing V2",
    "description": "Really cool"
  },
  "_id": "597f1b96e19cb32c342c0be0",
  "categories": [
    "handicraft",
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
role | string | User's [role](https://github.com/foundersandcoders/open-tourism-platform/blob/67d654c4fbe74cdcbad5650d9d110c004673e6f2/src/models/constants.json).
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
role | string | User's [role](https://github.com/foundersandcoders/open-tourism-platform/blob/67d654c4fbe74cdcbad5650d9d110c004673e6f2/src/models/constants.json).
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