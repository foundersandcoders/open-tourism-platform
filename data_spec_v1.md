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

In essence it is an open data platform where anyone can add and view data on (initially) users, places, events, products.

There will be a permissions system where, in simple terms, moderators and SUPER users will have various edit permissions for the data.

## Notes
Things not addressed in this file yet:
- multi-language support
    - we think we will append/prepend db fields with 'en' or 'ar'
- Http logging
    - we think this will be just a simple db table logging request info
- login and signup flow
    - e.g. email verification?

## User Roles
Unless otherwise specified, the below roles have any permissions assigned to roles lower in the list below.

- SUPER - OWNER of the open platform.
- ADMIN - moderator can create any data -> can assign ownership of content
- BASIC - can have ownership of organisations / their data / events / products

## Data Model - Schema and Permissioning

### Users

#### CRUD Permissions

name | permissions
---|---
CREATE | role=BASIC:ADMIN, role=ADMIN:SUPER
READ | isPublic ? any : OWNER
UPDATE | only OWNER or SUPER
DELETE | on OWNER or SUPER

#### Fields


name | type | required | permissions
---|---|---|---
id | KEY | true |-
createdAt| DATE | - | -
updatedAt| DATE | - | -
isPublic | BOOL | true | only OWNER or SUPER (not ADMIN?)
username (do we need this?) | TEXT | false | only OWNER or SUPER
password | HASH | true | only OWNER or SUPER
name| STRING | true | only OWNER or SUPER
organisationName | TEXT | false | only OWNER or SUPER
organisationDescription | TEXT | false | only OWNER or SUPER
email| TEXT | true | only OWNER or SUPER
role | ENUM (BASIC / ADMIN / SUPER )? | true | SUPER
imageUrl| TEXT | false | OWNER

---



### Places


#### CRUD Permissions

name | permissions
---|---
CREATE | any
READ | any
UPDATE | OWNER
DELETE | OWNER

#### Fields


name | type | required | permissions
---|---|---|---
id | KEY | true |-
createdAt| DATE | - | -
updatedAt| DATE | - | -
ownerId | FOREIGN KEY | false | ADMIN
name| STRING | | OWNER
address | ADDRESS | true | OWNER
location| LOCATION | | OWNER
isVerified | BOOL | true | ADMIN
category| ?? do we have a categories table ? / is this an enum| | OWNER
accessibilityOptions| ? | true | OWNER
OPENING_TIMES | [TIME] | | OWNER
imageUrl| TEXT | | OWNER
website | TEXT | false | OWNER
phone | PHONE | false | OWNER
email | TEXT | false | OWNER

---

### Events

#### CRUD Permissions

name | permissions
---|---
CREATE | any
READ | any
UPDATE | OWNER
DELETE | OWNER

#### Fields


name | type | required | permissions
---|---|---|---
id | KEY | true |-
createdAt| DATE | - | -
updatedAt| DATE | - | -
ownerId | FOREIGN KEY | false | ADMIN
name| STRING | | OWNER
location| LOCATION | | OWNER
category| ?? do we have a categories table ? / is this an enum| | OWNER
accessOptions| ? | | OWNER
startTime| DATE | | OWNER
endTime| DATE | | OWNER
description| TEXT | | OWNER
cost (shekles) | DOUBLE | | OWNER
imageUrl| TEXT | | OWNER

---

### Products


#### CRUD Permissions

name | permission
---|---
CREATE | any
READ | any
UPDATE | OWNER
DELETE | OWNER

#### Fields


name | type | required | scope
---|---|---|---
id | KEY | true |-
createdAt| DATE | - | -
updatedAt| DATE | - | -
ownerId | FOREIGN KEY | false | ADMIN
name| STRING | | OWNER
category| ?? do we have a categories table ? / is this an enum| | OWNER
description| TEXT | | OWNER
cost (shekles) | DOUBLE | | OWNER
imageUrl| TEXT | | OWNER
location? | LOCATION | | OWNER
