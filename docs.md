# Open Tourism Platform API

An API providing data for the four apps on the Nazareth Open Tourism Platform, built by graduates of [Founders and Coders](https://foundersandcoders.com/about/).

Base URL: https://nazareth-open-tourism-platform.herokuapp.com/

## Contents
**Events**
- [Get all events](#get-all-events)
- [Get event by id](#get-event-by-id)
- [Create event](#create-event)
- [Update event](#update-event)
- [Delete event](#delete-event)

## Events

### Get all events
`GET /events`

**Response**
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

**Response**
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

**Response**

```
Status: 204 No Content
```
