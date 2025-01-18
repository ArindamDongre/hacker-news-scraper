# Hacker News Scraper

This project is a Node.js application that scrapes stories from Hacker News, stores them in a MySQL database, and broadcasts real-time updates to connected WebSocket clients.

---

## Features

1. **Hacker News Scraper**:

   - Periodically scrapes the latest stories from Hacker News.
   - Avoids storing duplicate stories in the database.

2. **MySQL Integration**:

   - Saves scraped stories with a unique `id`, `title`, `url`, and `timestamp`.
   - Retrieves the count of stories published in the last 5 minutes.

3. **WebSocket Server**:

   - Sends the recent stories count to clients upon connection.
   - Broadcasts new stories to all connected clients in real-time.

4. **Logging**:
   - Logs successful runs, errors, and skipped duplicates.

---

## Prerequisites

- **Node.js** (v18 or later)
- **MySQL**
- **npm**

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hacker-news-scraper
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root with the following content:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=hacker_news
SCRAPE_INTERVAL=1
WEBSOCKET_PORT=8080
```

Replace values as per your MySQL configuration.

### 4. Initialize the Database

Run the provided SQL script to set up the database schema:

```sql
CREATE DATABASE hacker_news;
USE hacker_news;

CREATE TABLE stories (
  id VARCHAR(255) PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  time_published DATETIME NOT NULL
);
```

### 5. Start the Application

Run the application:

```bash
node src/app.js
```

---

## Usage

### 1. Scraper

The scraper runs periodically based on the interval defined in the `.env` file.

### 2. WebSocket Server

Connect to the WebSocket server at `ws://localhost:<WEBSOCKET_PORT>` to:

- Receive the count of stories published in the last 5 minutes upon connection.
- Get real-time updates when new stories are scraped.

### 3. Testing

Use the included test script to simulate multiple WebSocket clients:

```bash
node testMultiClient.js
```

---

## Project Structure

```
project-root
├── src
│   ├── config
│   │   └── db.js       # Database connection
│   ├── scraper
│   │   └── hackerNews.js  # Scraper logic
│   ├── websocket
│   │   └── server.js     # WebSocket server logic
│   ├── utils
│   │   └── logger.js     # Logging utility
│   ├── app.js            # Initializes the scraper and WebSocket server.
│   ├── scheduler.js      # Handles the periodic scraping schedule.
├── testMultiClient.js    # Simulates multiple WebSocket clients for testing.
└── .env.example  # Example environment variables
```

---

## Logs

- **info**: General information such as successful database insertions and broadcasts.
- **error**: Issues such as failed database queries or scraping errors.
