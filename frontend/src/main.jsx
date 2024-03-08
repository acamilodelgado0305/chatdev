import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import "./index.css";

import ErrorPage from "./error-page";

import Chat from "./routes/Chat"

import Login from "./routes/login";

//CREAMOS EL ROUTER para luego pasarle las rutas de cada componenete
const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
    errorElement:<ErrorPage/>
  },
  {
    path:"/",
    element:<Chat/>,
    errorElement:<ErrorPage/>
  }
]);


// iniciamos el renderizado con router cpmo elemento principal
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);