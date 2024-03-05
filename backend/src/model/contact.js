import mongoose from "mongoose";
//Creacion del Schema (modelo de datos)d e mongoose de un contacto
const contactSchema = mongoose.Schema({ 
  name: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: false,
  },
  online:{
    type:Boolean,
    require:false,
  }
});
//exportamos el modelo de datos creado
export default mongoose.model("Contact", contactSchema);
