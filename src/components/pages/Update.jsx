//REACT
import { React, useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
//Axios
import axios from "axios";
//GlobalContext
import { useGlobalContext } from "../context";
//FIREBASE
import { uploadFile } from "../../../firebase/config";
//ICONS
import { FaBars } from "react-icons/fa";
//Styles
import styles from "../styles/styles";
import "../../css_components/add_update.css";
//IMG
import update_file_img from "../../assets/update_file.png";
//Spinner
import ClockLoader from "react-spinners/ClockLoader";

import { Modal, Container, Row, Col, Button, Card } from "react-bootstrap";

const Update = () => {
  let { id } = useParams();
  const fetchDocumentById = async (id) => {
    try {
      const res = await axios.get(
        `https://ucvpppix.net/iadocs/docs/byId.php?document_id=${id}`
      );
      // Suponiendo que 'res.data' es un objeto con la información del documento
      setDocument({
        doc_name: res.data.doc_name,
        doc_autor: res.data.doc_autor,
        doc_file: res.data.doc_file,
        doc_description: res.data.doc_description,
      });
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchDocumentById(id);
  }, [id]);

  const { openSidebar, openModal } = useGlobalContext();

  const [file, setFile] = useState(null);
  const [document, setDocument] = useState({
    doc_name: "",
    doc_autor: "",
    doc_file: "",
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

  //Navegación y Obtención del ID del URL
  const navigate = useNavigate();
  // const location = useLocation();
  // const documentId = location.pathname.split("/")[2];
  //ESTADO DE CARGA
  const [isLoading, setIsLoading] = useState(false);

  //ACTUALIZACIÓN  DE LOS DATOS
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

      // Inicializar formData
      const formData = new FormData();
      Object.entries(document).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append("document_id", id);

      // Subir el archivo a Firebase
      let fileUrl = "";
      let fileExtension = "";

      const fileName = file.name;
      fileExtension = fileName.split(".").pop();

      try {
        const fileUploadResult = await uploadFile(file, fileExtension);
        fileUrl = fileUploadResult; // Asegúrate de que esto es una URL
        console.log("Archivo subido a Firebase:", fileUrl);
      } catch (uploadError) {
        console.error("Error subiendo el archivo a Firebase:", uploadError);
        setIsLoading(false);
        return; // No continúes si falla la subida
      }

      // Añadir la URL del archivo de Firebase a formData
      if (fileUrl) {
        formData.append("doc_file", fileUrl);
      }

      // Enviar los datos del formulario al servidor PHP
      const response = await axios.post(
        "https://ucvpppix.net/iadocs/docs/update.php",
        formData
      );

      if (response.status === 200) {
        console.log("Archivo actualizado con éxito");
        navigate("/docs");
      } else {
        console.error("Error al actualizar el archivo:", response.data.message);
      }
    } catch (error) {
      console.error("Error: ", error);
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
          <h1>Actualización del documento</h1>
          <img
            src={update_file_img}
            style={{ width: "20%" }}
            alt="Descripción"
          />
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre del documento"
            onChange={handleChange}
            name="doc_name"
            value={document.doc_name}
          />
          <input
            type="text"
            placeholder="Autor"
            onChange={handleChange}
            name="doc_autor"
            value={document.doc_autor}
          />
          <input
            type="text"
            placeholder="Descripcion"
            onChange={handleChange}
            name="doc_description"
            value={document.doc_description}
          />
          <input
            type="file"
            placeholder="Archivo"
            onChange={handleFileChange}
            name="doc_file"
          />
          <input
            type="hidden"
            name="document_id"
            value={id}
            onChange={handleChange}
          />
          <button className="btn_add" type="submit">
            Actualizar
          </button>
        </form>
        {isLoading && <ClockLoader />}
      </div>
    </div>
  );
};

export default Update;
