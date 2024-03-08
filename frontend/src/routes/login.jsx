import { useState } from "react";
import Chat from "./Chat";
import io from "socket.io-client";
const socket = io.connect(import.meta.env.VITE_BACKEND_URL);

export default function Login() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);


  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="Container">
    {!showChat ? (
      <div className="Card">
        <div className="Card-Content">
          <h1>Unirme al Chat</h1>
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
            <button onClick={joinRoom}>Unirme</button>
          </form>
        </div>
      </div>
    ) : (
      <Chat socket={socket} username={username} room={room} />
    )}
  </div>
  );
}

