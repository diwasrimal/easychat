-- Users of the application
CREATE TABLE IF NOT EXISTS users (
	id bigserial NOT NULL PRIMARY KEY,
	fullname text NOT NULL,
	email text NOT NULL UNIQUE,
	password_hash text NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
	id bigserial NOT NULL PRIMARY KEY,
	sender_id bigserial NOT NULL REFERENCES users(id),
	receiver_id bigserial NOT NULL REFERENCES users(id),
	text text NOT NULL,
	timestamp timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS conversations (
	user1_id bigserial NOT NULL REFERENCES users(id),
	user2_id bigserial NOT NULL REFERENCES users(id),
	timestamp timestamptz NOT NULL
);
CREATE UNIQUE INDEX unique_conversation_pair ON conversations(LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id));

-- To search users
CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;
