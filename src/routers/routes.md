# Routes Overview

An overview of the basic route layout of this server

```
server (/)
│
├── /users
│   ├── /
│   │   ├── GET -> get all users
│   │
│   ├── /:id
│   │   ├── GET -> check token
│   │   ├── POST -> create token from credentials
│   │   ├── PUT -> update user
│   │   ├── DELETE -> remove user
│   │
│   ├── /signin
│   │   ├── POST -> sign user in to admin panel
│   │
│   ├── /verify/:id
│   │   ├── GET -> verify user token for automatic signing in
│
├── /resources
│   ├── /
│   │   ├── GET -> get all resources
│   │   ├── POST -> create a resource
│   │
│   ├── /:id
│   │   ├── GET -> get specific resource
│   │   ├── PUT -> update specific resource
│   │   ├── DELETE -> delete specific resource
```

## Authentication Flow

user goes to site (first time) -> input credentials -> send to server -> server authenticates -> server sends token -> token placed on frontend -> user proceeeds to site

user goes to site (next times) -> token sent to server -> server authenticates user from token -> server returns validation -> user proceeds to site
