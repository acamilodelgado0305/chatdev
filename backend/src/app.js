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


// MIDELWARES usados por app
app.use(cors())
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(resolve("frontend/dist")));

// configuramos el server para usar web sockets

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, //Definimos el origen de las peticiones 
    methods: ["GET", "POST"]// Definimos los metodos que se permiten de ese origen
  }
});
//configuramos el estado de la conexion y damos respuestas a partir de la conexion
io.on("connection", (socket) => {
  console.log(`Usuario actual: ${socket.id}`);
// configuramos la conexion a la sala
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

//pasamos la ruta para que se use la ruta de los mensajes

app.use('/message', messageRouter);

// iniciamos el servidor en el puerto

server.listen(process.env.PORT);
console.log(`SERVER RUNNING IN ${process.env.PORT}`);