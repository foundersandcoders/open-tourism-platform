# Open Tourism Platform

[![Join the chat at https://gitter.im/open-tourism-platform/Lobby](https://badges.gitter.im/open-tourism-platform/Lobby.svg)](https://gitter.im/open-tourism-platform/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

If you want to get involved, checkout the [contributing file](./CONTRIBUTING.md).

## What?
An open backend to help support and facilitate the creation of apps and websites aimed at developing tourism.

Primarily, and during initial phases, this will be an open database of places, products, services, events and reviews.

## Next steps

#### Requirement gathering
A good place to start would be to gather the requirements of the apps build for the Nazareth tourism accelerator, from there we can start to spec out a version 1.

#### 30/06/2017

After looking at all of the apps, we have come to a few conclusions:

1. Keep it simple, allow for flexibility and changes in future iterations. Due to the nature of the project, we want to *a)* make sure the platform is generic enough to be used across different apps and *b)* in existence fairly soon so apps can be built from it. Once we have a version 0 we can more easily identify improvements and needs for future iterations.
2. For v0 we will have a set of tables, along with CRUD endpoints, serving up the data which the apps can use. What form these tables take will be defined by the initial apps the platform is being built for #13.

Requirements for each app in #6, #7, #8, #9

From this we have decided initially on 4 tables in a database, Users, Businesses, Events, Products.

[Initial Schema for the tables](schema.md)
