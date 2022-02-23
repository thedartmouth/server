## Scripts

Initialize the Node.js repository with `yarn install` to get dependencies.

Use `yarn format` to adhere to code syntax and formatting standards. This will edit your files. Use `yarn lint` to adhere to ES standards.

Use `yarn test` to run testing suites.

Use `yarn dev` to start a development instance of the server. Ensure that your local PostgreSQL database is started (`brew services start postgres`), tables initialized, and data seeded (see below commands).

Use `yarn staging` to start a staging instance of the server, which will connect to the staging database hosted on Heroku.

Use `yarn start` to start a production instance of the server. **This should only be used in production containers.**

Use `yarn build` to compile to CommonJS modules, and `yarn prod` to run those modules. **This command is really only reserved for build scripts in production containers.**

## File structure

```shell
root
│   package.json # Node.js project configs
│   .babelrc # Babel transpiler configs    
│   .editorconfig # VSCode configs  
│   .eslintrc.json # linter configs     
│   .gitignore # git ignore list    
│   .prettierrc.json # formatter config    
│   .logs.sh # helper script to read logs from Heroku deployment    
│
└───src/
│   │   app.js # root file
│   │   server.js # Express.js client and configs
│   │   __tests__/ # all test suite scripts
│   │
│   └───controllers/ # business logic, organized by feature
│   │   │   article-controller.js
│   │   │   ceo-controller.js
│   │   │   feed-controller.js
│   │   │   ...
│   │   │   
│   └───routers/ # map HTTP calls to controllers
│   │   │   article-router.js
│   │   │   ceo-router.js
│   │   │   feed-router.js
│   │   │   ...
│   │   │   
│   └───modules/ # misc helper functions
│   │   │   auth/
│   │   │   notifications/
│   │   │   ...
│   │   │   
│   └───db/ # database client and configs
│   │   │   index.js
│   │   │   
└────────   
```

## PostgreSQL database

### Extensions

#### `pgcrypto`

```SQL
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

#### `uuid-ossp`

```SQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Tables

Run these table initialization commands in order.

#### `metaArticles`

```SQL
CREATE TABLE metaArticles (
	slug text PRIMARY KEY,
	reads integer DEFAULT 0,
	published boolean NOT NULL DEFAULT 'true'
);
```

#### `users`

```SQL
CREATE TABLE users (
	id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
	firstname text,
	lastname text,
	email text NOT NULL UNIQUE,
	passhash text,
	reads integer DEFAULT 0
);
```

#### `tags`

```SQL
CREATE TABLE tags (
	slug text PRIMARY KEY,
	type text NOT NULL DEFAULT 'UNKNOWN',
	name text,
	reads integer DEFAULT 0,
	rank integer NOT NULL DEFAULT 0
);
```

#### `notificationTokens`

```SQL
CREATE TABLE notificationTokens (
	token text PRIMARY KEY,
	userId uuid REFERENCES users ON DELETE CASCADE
);
```

#### `notificationSettings`

```SQL
CREATE TABLE notificationSettings (
	notificationToken text NOT NULL REFERENCES notificationTokens ON DELETE CASCADE,
	tagSlug text NOT NULL REFERENCES tags ON DELETE CASCADE,
	active boolean DEFAULT 'true' NOT NULL
);
```

#### `notifications`

```SQL
CREATE TABLE notifications (
	id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
	type text NOT NULL,
	title text,
	body text,
	targetTime timestamp,
	createdTime timestamp NOT NULL,
	triggered boolean DEFAULT 'false' NOT NULL,
	articleSlug text
);
```

#### `notificationFires`

```SQL
CREATE TABLE notificationFires (
	notificationId uuid REFERENCES notifications ON DELETE CASCADE,
	notificationToken text NOT NULL REFERENCES notificationTokens ON DELETE CASCADE,
	success boolean NOT NULL
);
```

#### `reads`

```SQL
CREATE TABLE reads (
	articleSlug text REFERENCES metaArticles ON DELETE CASCADE,
	userId uuid REFERENCES users ON DELETE CASCADE,
	timestamp timestamp NOT NULL
);
```

#### `bookmarks`

```SQL
CREATE TABLE bookmarks (
	articleSlug text REFERENCES metaArticles ON DELETE CASCADE,
	userId uuid REFERENCES users ON DELETE CASCADE,
	timestamp timestamp NOT NULL
);
```

### Seed data

This data must be seeded on first deployment.

#### tags

```SQL
INSERT INTO tags (slug, type, name, rank) VALUES ('top-story', 'ARTICLE', 'Top Story', 0);
INSERT INTO tags (slug, type, name, rank) VALUES ('top-picture', 'ARTICLE', 'Top Picture', 0);
INSERT INTO tags (slug, type, name, rank) VALUES ('cartoon-of-the-day', 'ARTICLE', 'Cartoon of the Day', 0);

INSERT INTO tags (slug, type, name, rank) VALUES ('featured', 'ARTICLE', 'Featured', 1);
INSERT INTO tags (slug, type, name, rank) VALUES ('student-spotlights', 'ARTICLE', 'Student Spotlights', 1);
INSERT INTO tags (slug, type, name, rank) VALUES ('verbum-ultimum', 'ARTICLE', 'Verbum Ultimum', 1);

INSERT INTO tags (slug, type, name, rank) VALUES ('news', 'ARTICLE', 'News', 2);
INSERT INTO tags (slug, type, name, rank) VALUES ('covid-19', 'ARTICLE', 'Covid-19', 2);
INSERT INTO tags (slug, type, name, rank) VALUES ('opinion', 'ARTICLE', 'Opinion', 2);
INSERT INTO tags (slug, type, name, rank) VALUES ('sports', 'ARTICLE', 'Sports', 2);
INSERT INTO tags (slug, type, name, rank) VALUES ('arts', 'ARTICLE', 'Arts', 2);
INSERT INTO tags (slug, type, name, rank) VALUES ('mirror', 'ARTICLE', 'Mirror', 2);
INSERT INTO tags (slug, type, name, rank) VALUES ('cartoon', 'ARTICLE', 'Cartoon', 2);
```
