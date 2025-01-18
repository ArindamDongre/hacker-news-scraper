import startScheduler from "./scheduler.js";
import { startWebSocketServer } from "./websocket/server.js";

const WEBSOCKET_PORT = process.env.WEBSOCKET_PORT || 8080;

console.log("Starting Hacker News Scraper Service...");
startWebSocketServer(WEBSOCKET_PORT);
startScheduler();
