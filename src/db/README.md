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