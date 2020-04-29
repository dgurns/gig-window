require('dotenv').config();
import express from 'express';
import cors from 'cors';
import socketIo from 'socket.io';

import { SocketEvent } from 'types/SocketEvent';

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

io.on(SocketEvent.Connection, (socket) => {
  let room: string;
  socket.on(SocketEvent.JoinRoom, (urlSlug: string) => {
    room = urlSlug;
    socket.join(urlSlug);
  });
  socket.on(SocketEvent.NewMessage, (message) => {
    if (room) {
      io.to(room).emit(SocketEvent.NewMessage, message);
    }
  });
});

server.listen(process.env.CHAT_PORT, () => {
  console.log(`💬 chat ready on port ${process.env.CHAT_PORT}`);
});
