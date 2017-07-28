# Open Tourism Platform API
An API providing data for the four apps on the Nazareth Open Tourism Platform, built by graduates of [Founders and Coders](https://foundersandcoders.com/about/).

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
    "updatedAt": "2017-07-27T09:50:49.414Z",
    "createdAt": "2017-07-27T09:50:49.414Z",
    "name": "Liwan concert",
    "startTime": "2001-01-01T00:00:00.000Z",
    "endTime": "2002-02-02T00:00:00.000Z",
    "description": "Oud concert",
    "cost": "Cheap",
    "imageUrl": "imgIsHere.com/12345",
    "_id": "5979b779ed693f0011b17b57",
    "accessibilityOptions": [
      "wheelchair-friendly"
    ],
    "category": [
      "music"
    ]
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
  "updatedAt": "2017-07-27T09:50:49.414Z",
  "createdAt": "2017-07-27T09:50:49.414Z",
  "name": "Liwan concert",
  "startTime": "2001-01-01T00:00:00.000Z",
  "endTime": "2002-02-02T00:00:00.000Z",
  "description": "Oud concert",
  "cost": "Cheap",
  "imageUrl": "imgIsHere.com/12345",
  "_id": "5979b779ed693f0011b17b57",
  "accessibilityOptions": [
    "wheelchair-friendly"
  ],
  "category": [
    "music"
  ]
}
```

### Create event
`POST /events`

**Input**

Name | Type | Description
---|---|---
name | string | **Required**. The name of the event.
category | array of strings | **Required**. The event category / categories.
accessibilityOptions | array of strings | Event accessibility options.
startTime | date | Event start time.
endTime | date | Event end time.
description | string | More information about the event.
cost | string | Rough estimation of the cost of the event.
imageUrl | string | Link to image of the event.

**Response**
```
Status: 201 Created

{
  "__v": 0,
  "updatedAt": "2017-07-27T09:50:49.414Z",
  "createdAt": "2017-07-27T09:50:49.414Z",
  "name": "Liwan concert",
  "startTime": "2001-01-01T00:00:00.000Z",
  "endTime": "2002-02-02T00:00:00.000Z",
  "description": "Oud concert",
  "cost": "Cheap",
  "imageUrl": "imgIsHere.com/12345",
  "_id": "5979b779ed693f0011b17b57",
  "accessibilityOptions": [
    "wheelchair-friendly"
  ],
  "category": [
    "music"
  ]
}
```

### Update event
`PUT /events/:id`

**Input**

Name | Type | Description
---|---|---
name | string | The name of the event.
category | array of strings | The event category / categories.
accessibilityOptions | array of strings | Event accessibility options.
startTime | date | Event start time.
endTime | date | Event end time.
description | string | More information about the event.
cost | string | Rough estimation of the cost of the event.
imageUrl | string | Link to image of the event.

**Response**
```
Status: 200 OK

{
  "__v": 0,
  "updatedAt": "2017-07-27T09:50:49.414Z",
  "createdAt": "2017-07-27T09:50:49.414Z",
  "name": "Liwan concert V2",
  "startTime": "2001-01-01T00:00:00.000Z",
  "endTime": "2002-02-02T00:00:00.000Z",
  "description": "Oud concert",
  "cost": "Cheap",
  "imageUrl": "imgIsHere.com/12345",
  "_id": "5979b779ed693f0011b17b57",
  "accessibilityOptions": [
    "wheelchair-friendly"
  ],
  "category": [
    "music"
  ]
}
```

### Delete event
`DELETE /events/:id`

**Response**

```
Status: 204 No Content
```
