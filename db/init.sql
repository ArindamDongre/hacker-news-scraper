CREATE DATABASE hacker_news;
USE hacker_news;

CREATE TABLE stories (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(2083),
    time_published DATETIME,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);