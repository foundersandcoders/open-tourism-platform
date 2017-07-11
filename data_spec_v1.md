# v1 specification

as discussed initially 5/7/17

## Contents
- [Intro](#intro)
- [Notes](#notes)
- [User Roles](#user-roles)
- [Data Model](#data-model)

## Intro
The specification for the Nazareth open tourism platform v1.

In essence it is an open data platform where anyone can add and view data on users, places, events, products.

There will be a permissions system where, in simple terms, ADMIN and SUPER users will have various edit permissions for the data.

## Notes
Things not addressed in this file yet:
- multi-language support
    - we think we will append/prepend db fields with 'en', 'ar', 'he'
- Http logging
    - we think this will be just a simple db table logging request info
- login and signup flow
    - e.g. email verification?

## User Roles
Unless otherwise specified, the below roles have any permissions assigned to roles lower in the list below.

- SUPER - Owner of the open platform.
- ADMIN - can create any data, can assign ownership of content
- OWNER - Specific to resource.
- BASIC - can have ownership of organisations / their data / events / products

## Data Model

### Users

#### CRUD Permissions

name | permissions
---|---
CREATE | role=BASIC:any, role=ADMIN:SUPER
READ | isPublic ? any : OWNER
UPDATE | only OWNER or SUPER
DELETE | only OWNER or SUPER

#### Fields

name | type | required | permissions
---|---|---|---
id | KEY | true |-
createdAt| DATE | - | -
updatedAt| DATE | - | -
isPublic | BOOL | true | only OWNER or SUPER
username | TEXT | false | only OWNER or SUPER
password | HASH | true | only OWNER or SUPER
name| STRING | true | only OWNER or SUPER
organisationName | TEXT | false | only OWNER or SUPER
organisationDescription | TEXT | false | only OWNER or SUPER
email| TEXT | true | only OWNER or SUPER
role | ENUM (BASIC / ADMIN / SUPER ) | true | SUPER
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
isVerified | BOOL | true | ADMIN
name| STRING | | OWNER
address | ADDRESS | true | OWNER
description | TEXT | false | OWNER
location| LOCATION | | OWNER
category| ENUM | | OWNER
accessibilityOptions| | true | OWNER
openingTimes | [TIME] | | OWNER
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
category|  | OWNER
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
category| ENUM | | OWNER
description| TEXT | | OWNER
cost (shekels) | DOUBLE | | OWNER
imageUrl| TEXT | | OWNER
