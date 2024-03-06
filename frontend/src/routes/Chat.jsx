import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { IoMdSend } from "react-icons/io";
import { useParams } from 'react-router-dom';
import axios from 'axios'; // Importa axios para realizar solicitudes HTTP

const socket = io('/');

export default function Chat () {
  const { _id } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [contact, setContact] = useState({
    name: "",
    picture: "",
  });

  useEffect(() => {
    socket.on('message', receiveMessage);

    return () => socket.off('message', receiveMessage);
  }, []);

  const receiveMessage = (message) => setMessages(prevMessages => [...prevMessages, message]);

  const sendMessage = (event) => {
    event.preventDefault();
    if (!message) return; // Prevent sending empty messages

    const newMessage = {
      body: message,
      from: 'Me',
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setMessage('');
    socket.emit('message', newMessage.body);
  };

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/contact/${_id}`);
        setContact(response.data);
      } catch (error) {
        // Handle error (e.g., display error message)
      }
    };

    if (_id) {
      fetchContact();
    }
  }, [_id]);


  return (
    <div className="chat-container">
      <header className="chat-header">
        <h1>{contact.name}</h1>
        <img src={contact.picture} alt={contact.name} className="contact-picture" />
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
                <p className="message-body">{message.body}</p>
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
};
