//se importa el modelo de datos desde la ruta donde se creo 
import contactModel from "../model/contact.js";

//-------Obtener Contacto(s)-----------------
export const getContacts = async (req, res) => {
  const Contacts = await contactModel.find();
  res.json(Contacts);
};

//-------Obtener contacto-------------------

export const getContact = async (req, res) => {
  const Contacts = await contactModel.findById(req.params.id);
  res.json(Contacts);
};

//---------Crear Contacto

export const createContact = async (req, res) => {
  const { name, picture } = req.body;
  const newContact = new contactModel({
    name: name,
    picture: picture,
  });
  await newContact.save();
  res.json({ message: ["Contact Saved"] });
};

//Editar Contacto
export const updateContact = async (req, res) => {
  const { name, picture } = req.body;
  await contactModel.findByIdAndUpdate(req.params.id, {
    name: name,
    picture: picture,
  });
  res.json({ message: ["Contacts Updated"] });
};

//---Eliminar contacto----//

export const deleteContact = async (req, res) => {
  await contactModel.findByIdAndDelete(req.params.id);
  res.json({ message: ["Contact Deleted"] });
};
