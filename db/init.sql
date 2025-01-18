CREATE DATABASE hacker_news;
USE hacker_news;

CREATE TABLE stories (
  id VARCHAR(255) PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  time_published DATETIME NOT NULL
);