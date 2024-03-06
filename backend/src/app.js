//importamos las dependecias necesarias para el app
import express from 'express'
import http from 'http'
import 'dotenv/config'
import {Server as SocketServer} from 'socket.io'
import "./database.js"
import morgan from "morgan";
import { resolve, dirname } from "path";
import cors from "cors";
//importamos las rutas de contacto
import routeContact from "./routes/contact.js";

//importamos puesto desde .env
const PORT = process.env.PORT;
//iniciamos app en express
const app = express();
// iniciamos el socket server para comunicación en tiempo real
const server = http.createServer(app);
const io = new SocketServer(server, {
});

// Middlewares usados
app.use(cors());
app.use(morgan("dev"));
//usamos morgan para tener respuestas de las peticiones al backend
app.use(express.json());
//usamos urlencode para la solicitudes codificadas en url
app.use(express.urlencoded({ extended: false }));

app.use(express.static(resolve("frontend/dist")));
app.use('/contact', routeContact);


// configuramos la coneccion del socket server-- comunicacion bidireccional
io.on("connection", (socket) => {
  //cuando se conecta el cliente
  console.log(socket.id);
  socket.on("message", (body) => {
    //cuando se recibe un mensaje de cliente
    socket.broadcast.emit("message", {
      body,
      from: socket.id.slice(8),//por seguridad, se puede modificar para pasar el nombre del usuario pero por tiempo no da
    });
  });
});

server.listen(PORT);
console.log(`server on port ${PORT}`);