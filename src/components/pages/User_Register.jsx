//REACT
import React, { useState } from "react";
//Bootstrap
import { Form, Button, Container, Row, Col } from "react-bootstrap";
// ES6 Modules or TypeScript
import Swal from "sweetalert2";
//CSS
import "../../css_components/user_register.css";
//Logo
import logo_user from "../../assets/male_user.png";
//GlobalContext
import { useGlobalContext } from "../context";
//ICONS
import { FaBars } from "react-icons/fa";
//Navigate
import { useNavigate } from "react-router-dom";

const UserRegistrationForm = () => {
  const [user, setUser] = useState({
    user_name: "",
    user_lastname: "",
    user_email: "",
    user_password: "",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    // const navigate = useNavigate();
    e.preventDefault();

    try {
      // Hacer la petición POST al servidor para registrar el usuario
      const response = await fetch(
        "https://ucvpppix.net/iadocs/users/register.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
        }
      );

      // Convertir la respuesta a JSON
      const data = await response.json();

      // Manejar la respuesta del servidor
      if (response.ok) {
        // Validación básica para comprobar si todos los campos están llenos
        if (
          !user.user_name ||
          !user.user_lastname ||
          !user.user_email ||
          !user.user_password
        ) {
          alert("Todos los campos son obligatorios.");
          return;
        }
        console.log("Usuario registrado:", data);
        // alert("Usuario registrado con éxito!");
        Swal.fire("¡Todo bien!", "Usuario registrado", "success");
        // Restablecer el estado del usuario para limpiar el formulario
        setUser({
          user_name: "",
          user_lastname: "",
          user_email: "",
          user_password: "",
        });
      } else {
        console.error("Error al registrar el usuario:", data.message);
        Swal.fire({
          icon: "error",
          title: "Oh noo...",
          text: "¡Ocurrió un error!",
        });
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error al realizar la petición: " + error);
    }
  };

  //Constante del Contexto Global
  const { openSidebar, openModal } = useGlobalContext();

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col xs lg="7">
          <h1 className="title text-center mt-5">Registro de Usuario</h1>
          <div className="text-center">
            <img
              src={logo_user}
              alt="Logo"
              className="my-4"
              style={{ maxWidth: "100px" }}
            />
          </div>
          <Form
            onSubmit={handleSubmit}
            className="user-form mt-5 p-5 rounded-5 border border-dark"
          >
            <Form.Group className="mb-2" controlId="formUserName">
              <Form.Label style={{ fontWeight: "bold" }}>Nombre</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Ingresa tu nombre"
                name="user_name"
                value={user.user_name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="formUserLastName">
              <Form.Label style={{ fontWeight: "bold" }}>Apellido</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Ingresa tu apellido"
                name="user_lastname"
                value={user.user_lastname}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="formUserEmail">
              <Form.Label style={{ fontWeight: "bold" }}>Email</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Ingresa tu email"
                name="user_email"
                value={user.user_email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-2" controlId="formUserPassword">
              <Form.Label style={{ fontWeight: "bold" }}>Contraseña</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Contraseña"
                name="user_password"
                value={user.user_password}
                onChange={handleChange}
              />
            </Form.Group>

            <Button type="submit" className="submit-button">
              Registrarse
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserRegistrationForm;
