const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const { Server } = require("socket.io");
const jsonServer = require("json-server");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();
const dbPath = path.join(__dirname, "db.json");

const readDb = () => JSON.parse(fs.readFileSync(dbPath, "utf8"));
const writeDb = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

const normalizeUser = (user) => ({
  ...user,
  followers: Array.isArray(user.followers) ? user.followers : [],
  following: Array.isArray(user.following) ? user.following : [],
});

const normalizeDb = () => {
  const data = readDb();
  data.users = (data.users || []).map(normalizeUser);
  data.messages = Array.isArray(data.messages) ? data.messages : [];
  writeDb(data);
  return data;
};

app.use(express.json());
app.use(middlewares);

app.get("/messages", (req, res) => {
  const db = normalizeDb();
  const { userId, contactId } = req.query;

  let messages = db.messages || [];
  if (userId && contactId) {
    messages = messages.filter((message) => {
      const fromUser = Number(message.fromUserId);
      const toUser = Number(message.toUserId);
      return (
        (fromUser === Number(userId) && toUser === Number(contactId)) ||
        (fromUser === Number(contactId) && toUser === Number(userId))
      );
    });
  }

  messages = messages.sort((first, second) => new Date(first.createdAt) - new Date(second.createdAt));
  res.json(messages);
});

app.post("/messages", (req, res) => {
  const db = normalizeDb();
  const { fromUserId, toUserId, text } = req.body;

  if (!fromUserId || !toUserId || !text?.trim()) {
    return res.status(400).json({ message: "Missing message data" });
  }

  const message = {
    id: Date.now(),
    fromUserId: Number(fromUserId),
    toUserId: Number(toUserId),
    text: text.trim(),
    createdAt: new Date().toISOString(),
  };

  db.messages.push(message);
  writeDb(db);
  res.status(201).json(message);
});

app.use(router);

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    if (roomId) socket.join(roomId);
  });

  socket.on("send-message", ({ roomId, message }) => {
    if (!roomId || !message) return;
    io.to(roomId).emit("receive-message", message);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Connect server running on port ${PORT}`);
});
