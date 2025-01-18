import axios from "axios";
import * as cheerio from "cheerio";
import db from "../config/db.js";
import logger from "../utils/logger.js";
import { broadcast } from "../websocket/server.js";
import moment from "moment";

/**
 * Scrapes stories from Hacker News and stores them in MySQL, avoiding duplicates.
 */
export async function scrapeHackerNews() {
  try {
    const response = await axios.get("https://news.ycombinator.com/");
    const $ = cheerio.load(response.data);

    const stories = [];

    $(".athing").each((_, element) => {
      const id = $(element).attr("id");
      const title = $(element).find(".titleline > a").text();
      const url = $(element).find(".titleline > a").attr("href");
      const relativeTime = $(element)
        .next("tr") // Next <tr> after the .athing
        .find(".subtext .age")
        .attr("title"); // Extract the 'title' attribute containing the timestamp

      // Parse the timestamp from the title attribute (e.g., "2025-01-18T16:22:03 1737217323")
      const timestamp = moment(relativeTime, "YYYY-MM-DDTHH:mm:ss").toDate();

      stories.push({
        id,
        title,
        url,
        timestamp,
      });
    });

    // Store stories in MySQL
    await saveStoriesToDB(stories);

    logger.info(`${stories.length} stories scraped and processed.`);
    return stories;
  } catch (error) {
    logger.error(`Error scraping Hacker News: ${error.message}`);
    return [];
  }
}

/**
 * Saves scraped stories to MySQL, avoiding duplicates.
 * @param {Array} stories - Array of story objects to save.
 */
async function saveStoriesToDB(stories) {
  const connection = await db.getConnection();
  const newStories = [];

  try {
    for (const story of stories) {
      const [result] = await connection.execute(
        `INSERT IGNORE INTO stories (id, title, url, time_published) VALUES (?, ?, ?, ?)`,
        [story.id, story.title, story.url, story.timestamp]
      );

      if (result.affectedRows > 0) {
        newStories.push({
          id: story.id,
          title: story.title,
          url: story.url,
        });
        logger.info(`Saved story: ${story.title} ${story.timestamp}`);
      } else {
        logger.info(`Skipped duplicate story: ${story.title}`);
      }
    }

    // Broadcast only new stories
    if (newStories.length > 0) {
      broadcast({ message: "New stories available", stories: newStories });
      logger.info(`Broadcasted ${newStories.length} new stories.`);
    }
  } catch (error) {
    logger.error(`Error saving stories to the database: ${error.message}`);
  } finally {
    connection.release();
  }
}

/**
 * Gets the count of stories published in the last 5 minutes.
 * @returns {Promise<number>} Count of stories.
 */
export async function getStoriesPublishedInLast5Minutes() {
  const connection = await db.getConnection();
  try {
    const [rows] = await connection.execute(
      `SELECT COUNT(*) AS count FROM stories WHERE time_published > NOW() - INTERVAL 5 MINUTE`
    );
    return rows[0].count;
  } catch (error) {
    logger.error(`Error fetching stories count: ${error.message}`);
    return 0;
  } finally {
    connection.release();
  }
}
