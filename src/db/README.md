# PostgreSQL database

## Tables

### `metaArticles`

```SQL
CREATE TABLE metaArticles (
	slug text PRIMARY KEY,
	reads integer DEFAULT 0,
	published boolean NOT NULL DEFAULT 'true'
);
```

### `users`

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

### `tags`

```SQL
CREATE TABLE tags (
	slug text PRIMARY KEY,
	type text NOT NULL DEFAULT 'UNKNOWN',
	name text,
	reads integer DEFAULT 0,
	rank integer NOT NULL DEFAULT 0
);
```

### `notificationTokens`

```SQL
CREATE TABLE notificationTokens (
	token text PRIMARY KEY,
	userId uuid REFERENCES users ON DELETE CASCADE
);
```

### `notificationSettings`

```SQL
CREATE TABLE notificationSettings (
	notificationToken text NOT NULL REFERENCES notificationTokens ON DELETE CASCADE,
	tagSlug text NOT NULL REFERENCES tags ON DELETE CASCADE,
	active boolean DEFAULT 'true' NOT NULL
);
```

### `notifications`

```SQL
CREATE TABLE notifications (
	id uuid DEFAULT uuid_generate_v4 () PRIMARY KEY,
	type text NOT NULL,
	title text,
	body text,
	targetTime timestamp,
	createdTime timestamp NOT NULL,
	triggered boolean DEFAULT 'false' NOT NULL,
	tagSlug text NOT NULL REFERENCES tags ON DELETE CASCADE,
	articleSlug text
);
```

### `notificationFires`

```SQL
CREATE TABLE notificationFires (
	notificationId uuid REFERENCES notifications ON DELETE CASCADE,
	notificationToken text NOT NULL REFERENCES notificationTokens ON DELETE CASCADE,
	success boolean NOT NULL
);
```

### `reads`

```SQL
CREATE TABLE reads (
	articleSlug text REFERENCES metaArticles ON DELETE CASCADE,
	userId uuid REFERENCES users ON DELETE CASCADE,
	timestamp timestamp NOT NULL
);
```

### `bookmarks`

```SQL
CREATE TABLE bookmarks (
	articleSlug text REFERENCES metaArticles ON DELETE CASCADE,
	userId uuid REFERENCES users ON DELETE CASCADE,
	timestamp timestamp NOT NULL
);
```

## Extensions

### `pgcrypto`

```SQL
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### `uuid-ossp`

```SQL
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## Seed data

### tags

```SQL
INSERT INTO tags (slug, type, name, rank) VALUES ('top-story', 'ARTICLE', 'Top Story', 0);
INSERT INTO tags (slug, type, name, rank) VALUES ('top-section', 'ARTICLE', 'Top Section', 0);
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
