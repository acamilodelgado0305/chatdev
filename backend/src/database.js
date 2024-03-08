import mongoose from "mongoose"
import "dotenv/config"

const URI= process.env.MONGODB_URI;

mongoose
    .connect(URI)
    //si se conecta a la base de datos
    .then(()=>console.log("Conectado a ChatDB"))
    .catch((error)=>console.error(error));