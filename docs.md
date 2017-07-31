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

## Events

### Get all events
`GET /events`

**Sample Response**
```
Status: 200 OK

[
  {
    "__v": 0,
    "_id": "597b363ae05960001124583b",
    "updatedAt": "2017-07-28T13:03:54.818Z",
    "createdAt": "2017-07-28T13:03:54.818Z",
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
    "cost": "1000 shekels",
    "imageUrl": "imgIsHere.com/12345"
    "en": {
      "name": "Party at the guesthouse",
      "description": "Sick party dudes"
    },
    "ar": { }
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
  "_id": "597b363ae05960001124583b",
  "updatedAt": "2017-07-28T13:03:54.818Z",
  "createdAt": "2017-07-28T13:03:54.818Z",
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
  "cost": "1000 shekels",
  "imageUrl": "imgIsHere.com/12345"
  "en": {
    "name": "Party at the guesthouse",
    "description": "Sick party dudes"
  },
  "ar": { }
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
  "en": {
    "name": "Party at the guesthouse",
    "description": "Sick party dudes"
  },
  "categories": [
    "music",
    "dining"
  ],
  "accessibilityOptions": [
    "braille-menu",
    "wheelchair-friendly"
  ]
}
```

**Sample Response**
```
Status: 201 Created

{
  "__v": 0,
  "_id": "597b363ae05960001124583b",
  "updatedAt": "2017-07-28T13:03:54.818Z",
  "createdAt": "2017-07-28T13:03:54.818Z",
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
  "cost": "1000 shekels",
  "imageUrl": "imgIsHere.com/12345"
  "en": {
    "name": "Party at the guesthouse",
    "description": "Sick party dudes"
  },
  "ar": { }
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
  "__v": 1,
  "_id": "597b363ae05960001124583b",
  "updatedAt": "2017-07-28T13:03:54.818Z",
  "createdAt": "2017-07-28T13:03:54.818Z",
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
  "cost": "1000 shekels",
  "imageUrl": "imgIsHere.com/12345"
  "en": {
    "name": "Party at the guesthouse V2",
    "description": "Sick party dudes"
  },
  "ar": { }
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
