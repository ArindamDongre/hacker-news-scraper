import { WebSocketServer } from "ws";
import logger from "../utils/logger.js";
import { getStoriesPublishedInLast5Minutes } from "../scraper/hackerNews.js";

let clients = [];

/**
 * Initializes the WebSocket server.
 * @param {number} port - The port to run the WebSocket server on.
 */
function startWebSocketServer(port = 8080) {
  const wss = new WebSocketServer({ port });

  logger.info(`WebSocket server started on ws://localhost:${port}`);

  wss.on("connection", async (ws) => {
    logger.info("New client connected.");
    clients.push(ws);

    try {
      // Send the number of stories published in the last 5 minutes to the new client
      const recentStoryCount = await getStoriesPublishedInLast5Minutes();
      ws.send(
        JSON.stringify({
          message: "Welcome! Here is the count of recent stories.",
          recentStoryCount,
        })
      );
      logger.info(
        `Sent recent stories count (${recentStoryCount}) to the new client.`
      );
    } catch (error) {
      logger.error(
        `Failed to send recent stories count to the client: ${error.message}`
      );
    }

    ws.on("close", () => {
      logger.info("Client disconnected.");
      clients = clients.filter((client) => client !== ws);
    });

    ws.on("error", (error) => {
      logger.error(`WebSocket error: ${error.message}`);
    });
  });
}

/**
 * Broadcasts a message to all connected WebSocket clients.
 * @param {object} data - The data to broadcast.
 */
function broadcast(data) {
  clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });

  logger.info(
    `Broadcasted message to ${clients.length} clients: ${JSON.stringify(data)}`
  );
}

export { startWebSocketServer, broadcast };
