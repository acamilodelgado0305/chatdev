import React, { useEffect, useState, useRef } from "react";
import { IoMdSend } from "react-icons/io";

export default function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const messageInputRef = useRef(null);

  const sendMessage = async () => {
    if (username && currentMessage) {
      const info = {
        message: currentMessage,
        room,
        author: username,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", info);
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
      setMessagesList((list) => [...list, info]);
      setCurrentMessage("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  useEffect(() => {
    const messageHandle = (data) => {
      setMessagesList((list) => [...list, data]);
    };
    socket.on("receive_message", messageHandle);
    return () => socket.off("receive_message", messageHandle);
  }, [socket]);

  return (
    <div className="chat-window">
      <header className="chat-header">
        Chat en vivo | Sala: {room}
        <span className="online-status">Online</span>
      </header>
      <main className="chat-body">
        <ul className="message-list">
          {messagesList.map((item, i) => (
            <li
              key={i}
              className={`message-item ${
                username === item.author ? "outgoing-message" : "incoming-message"
              }`}
            >
              <div className="message-content">
                <p className="message-text">{item.message}</p>
                <span className="message-timestamp">
                  Enviado por: <strong>{item.author}</strong>, a las{" "}
                  <i>{item.time}</i>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </main>
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
          <button type="submit" className="send-button">
            <IoMdSend className="send-icon" />
          </button>
        </form>
      </footer>
    </div>
  );
}
