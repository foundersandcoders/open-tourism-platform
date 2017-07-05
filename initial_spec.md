# Initial specification

Provisional, as discussed 5/7/17

## Contents
- [Intro](#intro)
- [Notes](#notes)
- [User Roles](#user-roles)
- [API Permissions](#api-permissions)
- [Database schema](#database-schema)

## Intro
The specification for the Nazareth open tourism platform v0.

In essence it is an open data platform where anyone can add and view data on (initially) businesses, events, products.

There will be a permissions system where, in simple terms, moderators and super users will have various edit permissions for the data.

## Notes
Things not addressed in this file yet:
- multi-language support
    - we think we will append/prepend db fields with 'en' or 'ar'
- Http logging
    - we think this will be just a simple db table logging request info 
- login and signup flow 
    - e.g. email verification? 

## User Roles
- Superuser / owner of the open platform.
- Admin / moderator can create any data -> can assign ownership of content
- user - can have ownership of organisations / their data / events / products

## API Permissions
![API permissions table](https://user-images.githubusercontent.com/16781318/27856213-1247a586-6176-11e7-82c6-f62aff11bef7.jpg)
- permissions for businesses, events, products are all very similiar
    - anyone can access the data
    - any registered user can create one
    - creators/owners can edit/delete 
    - moderators can edit their owners
- users:
    - can be created by anyone
    - superusers can edit/delete

## Database schema
We have categorised the fields by their edit permissions.

---

### Users
id
username
name
password
email
role (user, moderator, superuser)

---

### Businesses

#### no one can edit
id
dateCreated
creatorId
#### moderator can edit
ownerId (defaults to creatorId)
isVerified
accessibilityOptions
#### owner can edit
name
address
category
openingHours
description
website
phone
email
imageLink
lat
lng

---

### Events
#### no one can edit
id
dateCreated
creatorId
businessId
#### owner can edit
name 
location
category
accessOptions
startTime
endTime
date
description
cost
imageUrl

---

### Products
#### no one can edit
id
dateCreated
creatorId
businessId
#### owner can edit
name
category
description
price
imageUrl

