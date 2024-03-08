import React, { useEffect, useState, useRef } from "react";
import { IoMdSend } from "react-icons/io";

// Componente funcional Chat que muestra un chat en tiempo real
export default function Chat({ socket, username, room }) {
  // Estados locales
  const [currentMessage, setCurrentMessage] = useState(""); // Estado para el mensaje actual
  const [messagesList, setMessagesList] = useState([]); // Estado para la lista de mensajes
  const messageInputRef = useRef(null); // Referencia al input de mensaje

  // Función para enviar un mensaje
  const sendMessage = async () => {
    // Verifica si hay un usuario y un mensaje actual
    if (username && currentMessage) {
      // Información del mensaje
      const info = {
        message: currentMessage,
        room,
        author: username,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      // Emite el evento "send_message" con la información del mensaje al servidor socket
      await socket.emit("send_message", info);

      // Intenta enviar el mensaje al backend a través de una solicitud HTTP POST
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/message`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(info),
        });
        if (response.ok) {
          console.log('Message sent successfully');
        } else {
          console.error('Failed to send message');
        }
      } catch (error) {
        console.error('Error:', error);
      }

      // Actualiza la lista de mensajes con el nuevo mensaje
      setMessagesList((list) => [...list, info]);
      // Limpia el mensaje actual
      setCurrentMessage("");
    }
  };

  // Manejador para el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  // Efecto de lado para manejar la recepción de mensajes desde el servidor socket
  useEffect(() => {
    const messageHandle = (data) => {
      setMessagesList((list) => [...list, data]);
    };
    socket.on("receive_message", messageHandle);
    // Limpia el listener del evento al desmontar el componente
    return () => socket.off("receive_message", messageHandle);
  }, [socket]);

  // Renderizado del componente Chat
  return (
    <div className="chat-window">
      {/* Encabezado del chat */}
      <header className="chat-header">
        Chat en vivo | Sala: {room}
        <span className="online-status">Online</span>
      </header>
      {/* Cuerpo del chat */}
      <main className="chat-body">
        <ul className="message-list">
          {/* Mapeo de la lista de mensajes para renderizar cada mensaje */}
          {messagesList.map((item, i) => (
            <li
              key={i}
              className={`message-item ${
                username === item.author ? "outgoing-message" : "incoming-message"
              }`}
            >
              <div className="message-content">
                {/* Contenido del mensaje */}
                <p className="message-text">{item.message}</p>
                {/* Información del mensaje */}
                <span className="message-timestamp">
                  Enviado por: <strong>{item.author}</strong>, a las{" "}
                  <i>{item.time}</i>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </main>
      {/* Entrada de mensaje */}
      <footer className="chat-input">
        <form className="message-form" onSubmit={handleSubmit}>
          <input
            className="message-input"
            value={currentMessage}
            type="text"
            placeholder="Mensaje..."
            onChange={(e) => setCurrentMessage(e.target.value)}
            ref={messageInputRef}
          />
          {/* Botón de enviar mensaje */}
          <button type="submit" className="send-button">
            <IoMdSend className="send-icon" />
          </button>
        </form>
      </footer>
    </div>
  );
}
