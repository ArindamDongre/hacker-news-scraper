import schedule from "node-schedule";
import { scrapeHackerNews } from "./scraper/hackerNews.js";
import logger from "./utils/logger.js";
import dotenv from "dotenv";

dotenv.config();

const interval = parseInt(process.env.SCRAPE_INTERVAL, 10);

if (isNaN(interval) || interval <= 0) {
  logger.error(
    "Invalid SCRAPE_INTERVAL in .env file. Please set it to a positive integer representing minutes."
  );
  process.exit(1); // Exit if the interval is invalid
}

/**
 * Schedule the scraper based on the configured interval.
 */
function startScheduler() {
  logger.info(`Starting the scheduler to run every ${interval} minute(s)...`);

  // Warn if the interval is unusually short
  if (interval < 1) {
    logger.warn(
      "SCRAPE_INTERVAL is set to less than 1 minute. This may overwhelm the server or database."
    );
  }

  schedule.scheduleJob(`*/${interval} * * * *`, async () => {
    logger.info("Running the scraper...");
    try {
      await scrapeHackerNews();
    } catch (error) {
      logger.error(`Error during scraping: ${error.message}`);
    }
  });
}

export default startScheduler;
