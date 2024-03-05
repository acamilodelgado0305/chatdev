import React, { useState, useEffect } from 'react';
import { useNavigate, Form } from 'react-router-dom';
import axios from 'axios';

export default function FormContacts() {
  const navigate = useNavigate();
  const [contact, setContact] = useState({
    name: "",
    picture: "",
  });

  const handleInputChange = (e) => {
    setContact({
      ...contact,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const createContact = { ...contact };

    try {
        await axios.post('http://localhost:8080/contact', createContact);
        navigate("/")
      setClient({
        name:"",
        picture:""
      });
    } catch (error) {
    }
  };

  return (
    <div className="col4">
      <h2>Agregar Cliente</h2>
      <Form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Datos de Contacto</legend>
          <p>
            <span>Name</span>
            <input
              placeholder="First"
              aria-label="First name"
              type="text"
              name="name"
              defaultValue={contact.name}
              onChange={handleInputChange}
              required
            />
          </p>
          <label>
            <span>Picture URL</span>
            <input
              placeholder="https://example.com/avatar.jpg"
              aria-label="Avatar URL"
              type="text"
              name="picture"
              defaultValue={contact.picture}
              onChange={handleInputChange}
            />
          </label>
          <p></p>
          <button type="submit">Save</button>
            <button
              type="button"
            >
              Cancel
            </button>
        </fieldset>
      </Form>
    </div>
  );
}
