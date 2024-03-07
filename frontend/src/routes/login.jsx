import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  return (
    <div className="chat-container">
      <h1 className="chat-title">Bienvenido al Chat</h1>
      <input
        type="text"
        placeholder="Ingresa tu nombre"
        value={name}
        onChange={handleNameChange}
        className="username-input"
      />
      
      <button className="join-button">
        <Link to={`/chat/=${encodeURIComponent(name)}`}>Unirse al chat</Link>
      </button>
    </div>
  );
}

