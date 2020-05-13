# Routes Overview

An overview of the basic route layout of this server

```(text)
server (/)
│
├── /users
│   ├── /
│   │   ├── GET -> get all users (x)
│   │
│   ├── /:id
│   │   ├── GET -> check token (x)
│   │   ├── POST -> create token from credentials (x)
│   │   ├── PUT -> update user (x)
│   │   ├── DELETE -> remove user (x)
│   │
│   ├── /signin
│   │   ├── POST -> sign user in to admin panel (x)  #IMPORTANT: we will be using password for admin code
│   │
│   ├── /verify/:id
│   │   ├── GET -> verify user token for automatic signing in ()   # I think it is already in the /:id code
|   |
│
├── /listings
│   ├── /
│   │   ├── GET -> get all listings (x)
│   │   ├── POST -> create a listing (x)
│   │
│   ├── /:id                                       // advanced (inquiries with token and id management)
│   │   ├── GET -> get specific listing (x)
│   │   ├── PUT -> update specific listing (x)
│   │   ├── DELETE -> delete specific listing (x)
```

## Authentication Flow

user goes to site (first time) -> input credentials -> send to server -> server authenticates -> server sends token -> token placed on frontend -> user proceeeds to site

user goes to site (next times) -> token sent to server -> server authenticates user from token -> server returns validation -> user proceeds to site
