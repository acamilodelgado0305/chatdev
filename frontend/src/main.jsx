import * as React from "react";
import * as ReactDOM from "react-dom/client";
//importanos los elementos enecesarios de react-router-dom para crear rutas de manera optima
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
//importamos estilos
import "./index.css";
////------RUTAS------------------//
//ERROR PAGE
import ErrorPage from "./error-page";
//CHAT//
import Chat from "./routes/Chat";
//ROOT//
import Root from "./routes/root";
//FORMCONTACT//
import FormContacts from "./routes/formContact";


//CREAMOS EL ROUTER para luego pasarle las rutas de cada componenete
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/chat/:_id",
        element: <Chat />,
      },
      {
        path:"/contact/new",
        element: <FormContacts/>
      }
    ],
  },
]);


// iniciamos el renderizado con router cpmo elemento principal
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);