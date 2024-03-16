CREATE TABLE IF NOT EXISTS Users (
    id UUID PRIMARY KEY,
    name char(32) NOT NULL,
    email char(64) UNIQUE NOT NULL,
    password char(32) NOT NULL
);

CREATE TABLE IF NOT EXISTS Fields (
    id INT PRIMARY KEY,
    owner_id UUID NOT NULL,
    name char(16) NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES Users(id)
);

--@block 
DROP TABLE IF EXISTS users;

--@block 
DROP TABLE IF EXISTS fields;