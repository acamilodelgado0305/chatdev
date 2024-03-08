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

import messageRouter from "./route/route.js";


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
  console.log(`Usuario actual: ${socket.id}`);

  socket.on("join_room", (data) => {
      socket.join(data)
      console.log(`Usuario con id: ${socket.id} se unió a las sala: ${data}`);
  })
  socket.on("send_message", (data) => {
     socket.to(data.room).emit("receive_message",data);
  })

  socket.on("disconnect", () => {
      console.log("Usuario desconectado",socket.id)
  })
})

app.use('/message', messageRouter);



server.listen(process.env.PORT);
console.log(`SERVER RUNNING IN ${process.env.PORT}`);