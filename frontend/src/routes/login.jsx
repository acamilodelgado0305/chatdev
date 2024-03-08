import { useState } from "react";
import Chat from "./Chat";
import io from "socket.io-client";
const socket = io.connect(import.meta.env.VITE_BACKEND_URL);

// Componente funcional Login para unirse al chat
export default function Login() {
  // Estados locales
  const [username, setUsername] = useState(""); // Estado para el nombre de usuario
  const [room, setRoom] = useState(""); // Estado para el ID de la sala
  const [showChat, setShowChat] = useState(false); // Estado para mostrar el chat

  // Función para unirse a una sala de chat
  const joinRoom = () => {
    // Verifica si se ha ingresado un nombre de usuario y un ID de sala
    if (username !== "" && room !== "") {
      // Emite el evento "join_room" al servidor socket con el ID de la sala
      socket.emit("join_room", room);
      // Muestra el chat estableciendo el estado de showChat en true
      setShowChat(true);
    }
  };

  // Renderizado del componente Login
  return (
    <div className="Container">
      {/* Condicional para mostrar el formulario de unirse al chat o el componente de chat */}
      {!showChat ? (
        <div className="Card">
          <div className="Card-Content">
            <h1>Unirme al Chat</h1>
            {/* Formulario para ingresar el nombre de usuario y el ID de la sala */}
            <form className="from-control">
              <label>Ingrese aquí su Nombre</label>
              <input
                type="text"
                placeholder="Nombre"
                onChange={(e) => setUsername(e.target.value)}
              />
              <label>Ingrese aqui la sala a la que se quiere unir:</label>
              <input
                type="text"
                placeholder="ID Sala:"
                onChange={(e) => setRoom(e.target.value)}
              />
              {/* Botón para unirse a la sala de chat */}
              <button onClick={joinRoom}>Unirme</button>
            </form>
          </div>
        </div>
      ) : (
        // Renderiza el componente Chat si showChat es true
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}
