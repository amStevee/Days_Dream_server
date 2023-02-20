CREATE TABLE users (
    userid UUID UNIQUE NOT NULL PRIMARY KEY,
    username VARCHAR(45) NOT NULL,
    email VARCHAR(70) NOT NULL,
    password VARCHAR(255) NOT NULL,
    image VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(7000) NOT NULL,
    image VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    category VARCHAR(45),
    userid UUID REFERENCES users(userid) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION
trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE
trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE PROCEDURE
trigger_set_timestamp();