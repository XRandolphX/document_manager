//React
import { React, useState, useRef } from "react";
//Axios
import axios from "axios";
//Navigate
import { useNavigate } from "react-router-dom";
//GlobalContext
import { useGlobalContext } from "../../components/context";
//ICONS
import { FaBars } from "react-icons/fa";
//Styles
import styles from "../../components/styles/styles";
import "../../css_components/add_update.css";
//IMG
import add_file_img from "../../assets/add-file.png";
//FIREBASE
import { uploadFile } from "../../../firebase/config";
//Spinner
import ClockLoader from "react-spinners/ClockLoader";
//Bootstrap
import { Modal, Container, Row, Col, Button, Card } from "react-bootstrap";

const Add = () => {
  //Constante del Contexto Global
  const { openSidebar } = useGlobalContext();
  // Navegación
  const navigate = useNavigate();

  //ESTADO DE CARGA
  const [isLoading, setIsLoading] = useState(false);

  //MANEJO DE ARCHIVOS CON FIREBASE
  const [file, setFile] = useState(null);
  const [document, setDocument] = useState({
    doc_name: "",
    doc_autor: "",
    doc_description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDocument((prev) => {
      const updatedDoc = { ...prev, [name]: value };
      console.log(updatedDoc); // Esto imprimirá el estado actualizado
      return updatedDoc;
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  //SUBIDA DE LOS DATOS
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar si todos los datos del formulario están disponibles
      if (
        !document.doc_name ||
        !document.doc_description ||
        !document.doc_autor ||
        !file
      ) {
        console.error("Faltan datos obligatorios");
        setIsLoading(false);
        return;
      }

      // Subir el archivo a Firebase con la extensión
      let fileUrl = "";
      const fileName = file.name;
      const fileExtension = fileName.split(".").pop(); // Obtener la extensión

      try {
        const fileUploadResult = await uploadFile(file, fileExtension);
        fileUrl = fileUploadResult; // Asegurarse de que sea una URL
        console.log("Archivo subido a Firebase:", fileUrl);
      } catch (uploadError) {
        console.error("Error subiendo el archivo a Firebase:", uploadError);
        setIsLoading(false);
        return;
      }

      // Crear un objeto FormData y agregar los datos del formulario
      const formData = new FormData();
      Object.entries(document).forEach(([key, value]) => {
        formData.append(key, value);
      });
      // Agregar la URL del archivo de Firebase a formData
      if (fileUrl) {
        formData.append("doc_file", fileUrl);
      }
      // Inspeccionar el contenido de formData (solo para depuración)
      formData.forEach((value, key) => {
        console.log(key, value); // Esto muestra qué se enviará
      });

      // Realizar la solicitud para subir los datos al servidor PHP
      const response = await axios.post(
        "https://ucvpppix.net/iadocs/docs/upload.php",
        formData
      );
      setIsLoading(false);
      navigate("/docs");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div>
        <Row className="justify-content-between align-items-center my-3">
          <Col xs="auto">
            <Button variant="primary" onClick={openSidebar}>
              <FaBars />
            </Button>
          </Col>
          <Col xs="auto"></Col>
        </Row>
      </div>
      <div className="form">
        <div className="d-flex justify-content-between align-items-center">
          <h1>Nuevo documento</h1>
          <img src={add_file_img} style={{ width: "20%" }} alt="Descripción" />
        </div>
        <div>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre del documento"
              onChange={handleChange}
              name="doc_name"
            />
            <input
              type="text"
              placeholder="Autor"
              onChange={handleChange}
              name="doc_autor"
            />
            <input
              type="text"
              placeholder="Descripcion"
              onChange={handleChange}
              name="doc_description"
            />
            <input
              type="file"
              placeholder="Archivo"
              onChange={handleFileChange}
              name="doc_file"
            />
            <button className="btn_add" type="submit">
              Agregar
            </button>
          </form>
          {isLoading && <ClockLoader />}
        </div>
      </div>
    </div>
  );
};

export default Add;
