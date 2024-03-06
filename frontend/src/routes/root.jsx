import React, { Component } from "react";
import { Outlet, Link } from "react-router-dom";
import axios from "axios";
import { FiRefreshCcw } from "react-icons/fi";


const URL= import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

//usamos class extendida a componente para manejar para manejar estados y componentdidmount de manera directa
export default class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
    };
  }
//creamos una funcion que llama esos datos para actualizar manualmente su estado 
  componentDidMount() {
    this.fetchContacts();
  }
//obetenemos los contactos de la API de contactos y los almacenamos en el estado de contacts
  async fetchContacts() {
    try {
      const res = await axios.get(`${URL}/contact`);
      this.setState({ contacts: res.data });
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  }

  render() {
    const { contacts } = this.state;

    return (
      <>
        <div id="sidebar">
          <h1>
            Chat Prueba
            <button
              type="button"
              className="btn refresh"
              onClick={this.fetchContacts.bind(this)}
            >
              <FiRefreshCcw />
            </button>
          </h1>
          <div>
            <form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
              <div className="sr-only" aria-live="polite"></div>
            </form>
            <div className="Buttons">
              <Link to="/contact/new">
                <button type="button" className="btn btn-primary">
                  New
                </button>
              </Link>
            </div>
          </div>
          <nav>
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <Link to={"/chat/" + contact._id}>{contact.name}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div id="detail">
          <Outlet />
        </div>
      </>
    );
  }
}
