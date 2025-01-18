import WebSocket from "ws";

const clientCount = 5;
const clients = [];

for (let i = 0; i < clientCount; i++) {
  const ws = new WebSocket("ws://localhost:8080");

  ws.on("open", () => {
    console.log(`Client ${i + 1} connected`);
  });

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    console.log(`Client ${i + 1} received:`, data);
  });

  ws.on("close", () => {
    console.log(`Client ${i + 1} disconnected`);
  });

  ws.on("error", (error) => {
    console.error(`Client ${i + 1} error:`, error.message);
  });

  clients.push(ws);
}

// Keep the clients open indefinitely for testing real-time updates
