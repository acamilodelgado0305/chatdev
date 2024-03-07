import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { IoMdSend } from "react-icons/io";
import { MdDone } from "react-icons/md";
import { useParams } from 'react-router-dom';

const socket = io.connect(import.meta.env.VITE_BACKEND_URL)

export default function Chat() {
  const {name} = useParams();

  
  /// Creamos los estados necesarios para mensaje(s), mensaje, y contact
const [messages, setMessages] = useState([]); // Estado para almacenar los mensajes
const [message, setMessage] = useState(''); // Estado para almacenar el mensaje actual
const [contact, setContact] = useState({ name: "" }); // Estado para almacenar los datos del contacto
const [isConnected, setIsConnected] = useState(true); // Estado para rastrear si el socket está conectado
const [sentMessages, setSentMessages] = useState({}); // Estado para rastrear los mensajes enviados

// Usamos useEffect para realizar el cambio de esos estados creados anterior mente
useEffect(() => {
 // Manejamos 'on' para elementos activos
 socket.on('connect', () => setIsConnected(true)); // Actualizar el estado de conexión cuando se conecta
 socket.on('disconnect', () => setIsConnected(false)); // Actualizar el estado de conexión cuando se desconecta
 socket.on('message', receiveMessage); // Escuchar mensajes entrantes

 // Manejamos 'off' para elementos inactivos
 return () => {
   socket.off('message', receiveMessage); // Dejar de escuchar mensajes entrantes
   socket.off('connect'); // Dejar de escuchar eventos de conexión
   socket.off('disconnect'); // Dejar de escuchar eventos de desconexión
 };
}, []);

// Función para recibir mensajes
const receiveMessage = (receivedMessage) => {
  const messageWithTime = {
    ...receivedMessage,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  setMessages(prevMessages => [...prevMessages, messageWithTime]);
  setSentMessages(prevSentMessages => ({ ...prevSentMessages, [messageWithTime.time]: true }));
};


// Función para enviar mensajes
const sendMessage = (event) => {
 event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
 if (!message) return; // No hacer nada si no hay mensaje

 // Crear un nuevo mensaje
 const newMessage = {
   body: message,
   from: name,
   time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
 };

 setMessages(prevMessages => [...prevMessages, newMessage]); // Agregar el nuevo mensaje al estado de mensajes
 setSentMessages(prevSentMessages => ({ ...prevSentMessages, [newMessage.time]: false, })); // Marcar el mensaje como enviado
 setMessage(''); // Limpiar el campo de mensaje
 socket.emit('message', newMessage.body); // Emitir el mensaje a través del socket
};

// Obtener los datos del contacto cuando se carga el componente

  return (
    <div className="chat-window">
  <header className="chat-header">
    <h1 className="contact-name">Chat</h1>
    {isConnected ? (
      <span className="online-status">Online</span>
    ) : (
      <span className="offline-status">Offline</span>
    )}
  </header>
  <main className="chat-body">
  <ul className="message-list">
  {messages.map((message, index) => (
    <li
      key={index}
      className={`message-item ${
        message.from === name ? 'outgoing-message' : 'incoming-message'
      }`}
    >
      <div className="message-content">
        {message.from !== name && (
          <span className="sender-name">{message.from}</span>
        )}
        <p className="message-text">
          {message.body}
        </p>
        <span className="message-timestamp">{message.time}</span>
        {message.from === name && sentMessages[message.time] && (
          <MdDone className="message-status-icon" />
        )}
      </div>
    </li>
  ))}
</ul>
  </main>
  <footer className="chat-input">
    <form className="message-form" onSubmit={sendMessage}>
      <input
        type="text"
        placeholder="Mensaje"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="message-input"
      />
      <button type="submit" className="send-button">
        <IoMdSend className="send-icon" />
      </button>
    </form>
  </footer>
</div>
  );
}
