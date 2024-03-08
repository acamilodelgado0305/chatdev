import mongoose from "mongoose"
import "dotenv/config"

const URI= process.env.MONGODB_URI;


//configuramos la conexión a la base de datos con mongodb
mongoose
    .connect(URI)
    .then(()=>console.log("Conectado a ChatDB"))
    .catch((error)=>console.error(error));