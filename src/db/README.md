# PostgreSQL database

## Tables

### `metaArticles`

```SQL
CREATE TABLE metaArticles (
	slug text PRIMARY KEY,
	reads integer DEFAULT 0
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

### `notificationTokens`

```SQL
CREATE TABLE notificationTokens (
	token text PRIMARY KEY,
	userId uuid REFERENCES users ON DELETE CASCADE
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

### `notificationSettings`

```SQL
CREATE TABLE notificationSettings (
	notificationToken text NOT NULL REFERENCES notificationTokens ON DELETE CASCADE,
	tagSlug text NOT NULL REFERENCES tags ON DELETE CASCADE,
	active boolean DEFAULT 'true' NOT NULL
);
```

### `tags`

```SQL
CREATE TABLE tags (
	slug text PRIMARY KEY,
	type text NOT NULL DEFAULT 'UNKNOWN',
	name text,
	reads integer DEFAULT 0
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
