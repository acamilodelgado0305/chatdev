import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { IoMdSend } from "react-icons/io";
import { MdDone } from "react-icons/md";
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactEmoji from 'react-emoji-render';

const socket = io.connect(import.meta.env.VITE_BACKEND_URL)

export default function Chat() {
  const {name} = useParams();

  
  /// Creamos los estados necesarios para mensaje(s), mensaje, y contact
const [messages, setMessages] = useState([]); // Estado para almacenar los mensajes
const [message, setMessage] = useState(''); // Estado para almacenar el mensaje actual
const [contact, setContact] = useState({ name: "" }); // Estado para almacenar los datos del contacto
const [isConnected, setIsConnected] = useState(false); // Estado para rastrear si el socket está conectado
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
const receiveMessage = (message) => {
 setMessages(prevMessages => [...prevMessages, message]); // Agregar el mensaje recibido al estado de mensajes
 setSentMessages(prevSentMessages => ({ ...prevSentMessages, [message.time]: true, })); // Marcar el mensaje como recibido
};

// Función para enviar mensajes
const sendMessage = (event) => {
 event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario
 if (!message) return; // No hacer nada si no hay mensaje

 // Crear un nuevo mensaje
 const newMessage = {
   body: message,
   from: 'Me',
   time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
 };

 setMessages(prevMessages => [...prevMessages, newMessage]); // Agregar el nuevo mensaje al estado de mensajes
 setSentMessages(prevSentMessages => ({ ...prevSentMessages, [newMessage.time]: false, })); // Marcar el mensaje como enviado
 setMessage(''); // Limpiar el campo de mensaje
 socket.emit('message', newMessage.body); // Emitir el mensaje a través del socket
};

// Obtener los datos del contacto cuando se carga el componente

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>{contact.name}</h1>
        {isConnected ? <span style={{ color: 'green' }}>Online</span> : <span style={{ color: 'red' }}>Offline</span>}
      </header>
      <main className="chat-main">
        <ul className="message-list">
          {messages.map((message, index) => (
            <li
              key={index}
              className={`message ${message.from === 'Me' ? 'sent' : 'received'}`}
            >
              <div className="message-content">
                {message.from !== 'Me' && (
                  <span className="message-sender">{message.from}</span>
                )}
                <p className="message-body">
                  <ReactEmoji>{message.body}</ReactEmoji>
                </p>
                <span className="message-time">{message.time}</span>
                {message.from === 'Me' && sentMessages[message.time] && (
                  <MdDone style={{ marginLeft: '5px', color: 'blue' }} />
                )}
              </div>
            </li>
          ))}
        </ul>
      </main>
      <footer className="chat-footer">
        <form className="message-form" onSubmit={sendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="message-input"
          />
          <button type="submit" className="send-button">
            <i className="fas fa-paper-plane"></i>
            <IoMdSend />
          </button>
        </form>
      </footer>
    </div>
  );
}