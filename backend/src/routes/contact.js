//importamos router desde express
import { Router } from "express";

//almacenamos Router en router
const router = Router();

//importamos los metodos desde controllers

import  {
  getContact,
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} from "../controller/contact.js";


// asociar o enrutar a cada direccon si esta vacia o esta identificada
router.route("/")
.get(getContacts)
.post(createContact);

router.route("/:id")
.get(getContact)
.put(updateContact)
.delete(deleteContact);


export default router;