//importamos las dependecias necesarias para el app
import express from 'express'
const app = express();
import http from 'http'
import cors from "cors";
import {Server} from 'socket.io'
import morgan from "morgan";
import 'dotenv/config'
import "./database.js"
import { resolve, dirname } from "path";


// MIDELWARES
app.use(cors())
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(resolve("frontend/dist")));



const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  const name = socket.handshake.query.name;
  console.log(`${name} connected with socket ID ${socket.id}`);

  socket.on("message", (body) => {
    socket.broadcast.emit("message", { body, from: name });
  });
});



server.listen(process.env.PORT);
console.log(`SERVER RUNNING IN ${process.env.PORT}`);