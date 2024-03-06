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

import routeContact from "./routes/contact.js";

// MIDELWARES
app.use(cors())
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(resolve("frontend/dist")));



const server = http.createServer(app);
const io = new Server(server, {
  cors:{
    origin:process.env.FRONTEND_URL,
    methods:["GET", "POST"]
  }
});


// configuramos la coneccion del socket server-- comunicacion bidireccional
io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("message", (body) => {
    socket.broadcast.emit("message", {
      body,
      from: socket.id.slice(8),
    });
  });
});


app.use('/contact', routeContact);

server.listen(process.env.PORT);
console.log(`SERVER RUNNING IN ${process.env.PORT}`);