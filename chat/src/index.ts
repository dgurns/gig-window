require('dotenv').config();
import express from 'express';
import cors from 'cors';
import socketIo from 'socket.io';

const app = express();
const allowedOrigins = [process.env.UI_ORIGIN];
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Request blocked by CORS'));
      }
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

const server = require('http').createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  let room: string;
  socket.on('join_room', (urlSlug) => {
    room = urlSlug;
    socket.join(urlSlug);
  });
  socket.on('new_message', (message) => {
    io.to(room).emit('new_message', message);
  });
});

server.listen(process.env.CHAT_PORT, () => {
  console.log(`💬 chat ready on port ${process.env.CHAT_PORT}`);
});
