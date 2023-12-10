//REACT
import React, { useState } from "react";
//Navegación
import { useNavigate } from "react-router-dom";
//Imagen
import Image from "react-bootstrap/Image";
//Login Css
import "../../css_components/login.css";
// ES6 Modules or TypeScript Sweetalert
import Swal from "sweetalert2";
//Logo
import logo_ricardo_palma from "../../assets/logo_ricardo_palma.png";

export default function Login() {
  const [values, setValues] = useState({
    user_email: "",
    user_password: "",
  });

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // 'values' objeto con los datos del formulario
    if (!values.user_email || !values.user_password) {
      Swal.fire("Por favor, llena todos los campos antes de iniciar sesión.");
      return; // Detiene la función aquí si algún campo está vacío
    }

    fetch("https://ucvpppix.net/iadocs/users/login.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Agrega aquí otros encabezados si son necesarios
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (!response.ok) {
          // Si el servidor responde con un código de estado HTTP que no es 2xx, se considera un error
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((res) => {
        console.log("Credenciales correctas, respuesta del servidor:", res);
        if (res.status === "Success") {
          navigate("/home");
        } else {
          alert(res.message);
        }
      })
      .catch((error) => {
        console.error("Error en la solicitud:", error);
        Swal.fire({
          icon: "error",
          title: "Error en la solicitud",
          text: "Ingrese las credenciales adecuadamente",
        });
      });
  };

  return (
    <div className="bg-image d-flex justify-content-center align-items-center vh-100">
      <div className="bg-white p-5 rounded-5 border border-dark">
        <div className="logo-RP">
          <h2>Login</h2>
          <img src={logo_ricardo_palma} width={"20%"} />
        </div>
        <div className="d-flex justify-content-center">
          <Image
            src="https://icons.veryicon.com/png/o/miscellaneous/two-color-icon-library/user-286.png"
            className="img-fluid"
            alt="Responsive image"
            width={"30%"}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">
            <strong>Email</strong>
          </label>
          <div className="mb-1 input-group">
            <div className="input-group-text">
              <img
                src="https://icons.veryicon.com/png/o/internet--web/prejudice/user-128.png"
                alt="Responsive image"
                height={"30rem"}
              ></img>
            </div>
            <input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              name="email"
              autoComplete="off"
              id="email" // Agrega un id; asegurarse de que coincida con el htmlFor del label
              onChange={(e) =>
                setValues({ ...values, user_email: e.target.value })
              }
              className="form-control"
            ></input>
          </div>
          <label htmlFor="password">
            <strong>Password</strong>
          </label>
          <div className="mb-1 input-group">
            <div className="input-group-text">
              <img
                src="https://icons.veryicon.com/png/o/internet--web/web-3/user-login-2-enter-password-copy.png"
                alt="Responsive image"
                height={"30rem"}
              ></img>
            </div>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              name="password"
              id="password"
              onChange={(e) =>
                setValues({ ...values, user_password: e.target.value })
              }
              className="form-control"
            ></input>
          </div>

          <button type="submit" className="btn btn-primary w-100 rounded-3">
            Log in
          </button>

          <div className="d-flex gap-1 justify-content-center mt-1">
            <div>¿No tienes una cuenta?</div>
            <a
              href="/register"
              className="text-decoration-none text-primary fw-semibold"
            >
              Registrate
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
