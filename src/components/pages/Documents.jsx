import { React, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Modal, Container, Row, Col, Button, Card } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import Select from "react-select";
import axios from "axios";
import { useGlobalContext } from "../../components/context";
import "../../components/styles/styles2.css";
import "../../css_components/documents.css";
import file_img from "../../assets/file_image.png";

function Documents() {
  //Estado global del sidebar
  const { openSidebar } = useGlobalContext();
  //Estado del documento
  const [documents, setDocuments] = useState([]);

  //Estados de búsqueda
  const [searchField, setSearchField] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllDocuments = async () => {
    try {
      const res = await axios.get("https://ucvpppix.net/iadocs/docs/get.php");
      const unsortedDocuments = res.data;

      const sortedDocuments = unsortedDocuments.sort((a, b) => {
        const dateA = a.update_date || a.upload_date;
        const dateB = b.update_date || b.upload_date;
        return new Date(dateB) - new Date(dateA);
      });

      setDocuments(sortedDocuments);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.get(
        `https://ucvpppix.net/iadocs/docs/delete.php?document_id=${id}`
      );
      if (response.status === 200) {
        // El documento se eliminó con éxito
        console.log(response.data.message);
        // window.location.reload();
        fetchAllDocuments();
      } else {
        // Ocurrió un error al eliminar el documento
        console.log("Error al eliminar el documento");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFilteredDocuments = async () => {
    setIsLoading(true);
    const url = `https://ucvpppix.net/iadocs/docs/search.php?field=${searchField}&value=${searchValue}`;
    try {
      const res = await axios.get(url);
      if (res.status === 200) {
        setDocuments(res.data);
      } else {
        // Manejar situaciones donde la respuesta no es un éxito
        console.error("Respuesta del servidor no exitosa:", res.status);
      }
    } catch (err) {
      // Manejo más detallado de errores
      if (err.response) {
        // El servidor respondió con un estado fuera del rango 2xx
        console.error(
          "Error en la respuesta del servidor:",
          err.response.status,
          err.response.data
        );
      } else if (err.request) {
        // La solicitud fue hecha pero no hubo respuesta
        console.error("No hubo respuesta del servidor:", err.request);
      } else {
        // Algo ocurrió al configurar la solicitud
        console.error("Error al configurar la solicitud:", err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  //Opciones estáticas
  const options = [
    { value: "doc_autor", label: "Autor" },
    { value: "doc_name", label: "Titulo" },
  ];

  // Función para reiniciar el Select
  const resetSelect = () => {
    setSearchField("");
  };

  const assignValue = (valueSelectedOption) => {
    setSearchField(valueSelectedOption.value);
    console.log(valueSelectedOption.value);
  };

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
    console.log(event.target.value);
  };

  const handleClickSelect = () => {
    resetSelect();
    fetchAllDocuments();
  };

  useEffect(() => {
    fetchAllDocuments();
  }, []);

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
      <Container>
        <Row>
          <Col>
            <h1 className="text-center mb-2">Documentos</h1>

            <div>
              <h4>Buscar documentos</h4>
              <div style={{ width: "30%" }}>
                <Select
                  className="mt-3"
                  defaultValue={{ label: "Seleccionan una opción", value: "" }}
                  value={
                    options.find((option) => option.value === searchField) || ""
                  }
                  options={options}
                  onChange={assignValue}
                />
              </div>

              {searchField && ( // Conditionally render the text field based on searchField
                <div style={{ width: "100%", marginTop: "20px" }}>
                  <input
                    className="custom-input"
                    type="text"
                    value={searchValue}
                    onChange={handleInputChange}
                    placeholder="Ingresa el valor de búsqueda"
                  />
                </div>
              )}
              <button
                className="mt-3 me-2 btn-custom"
                onClick={fetchFilteredDocuments}
                disabled={isLoading}
              >
                {isLoading ? "Cargando..." : "Buscar"}
              </button>

              <button
                className="mt-3 me-2 btn-custom"
                onClick={handleClickSelect}
              >
                Limpiar Selector
              </button>
              <div className="add_doc mt-2 mb-2">
                <Link to="/add" className="btn-add">
                  Agregar nuevo documento
                </Link>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-4">
          {documents.map((document) => (
            <Col
              lg={4}
              md={6}
              sm={12}
              className="mb-4"
              key={document.document_id}
            >
              <Card>
                <Card.Body>
                  <Card.Body className="d-flex justify-content-between align-items-center">
                    <span
                      style={{
                        fontFamily: "Times New Roman, sans-serif",
                        fontSize: "22px",
                      }}
                    >
                      {document.doc_name}
                    </span>
                    <img src={file_img} width={"20%"} alt="Descripción" />
                  </Card.Body>
                  <div className="mb-3">
                    <Card.Title className="custom-title">
                      <strong>Fecha de creación:</strong>
                      <br />
                      <i>
                        {new Date(document.upload_date).toLocaleString(
                          "es-ES",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          }
                        )}
                      </i>
                    </Card.Title>
                    <Card.Title className="custom-title">
                      <strong>Fecha de modificación:</strong>
                      <br />
                      <i>
                        {
                          document.update_date
                            ? new Date(document.update_date).toLocaleString(
                                "es-ES",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                }
                              )
                            : "No modificada aún" // O cualquier otro texto o manejo que prefieras
                        }
                      </i>
                    </Card.Title>
                  </div>
                  <Card.Title className="custom-title">
                    {document.tipo_documento}
                  </Card.Title>
                  <div className="mb-4">
                    <Card.Text
                      className="mb-3 custom-text"
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "16px",
                      }}
                    >
                      <strong>Autor: </strong> <em>{document.doc_autor}</em>{" "}
                    </Card.Text>
                    <Card.Text
                      className="mb-3 custom-text"
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "16px",
                      }}
                    >
                      {/* <strong>Título: </strong> {document.doc_name} */}
                    </Card.Text>
                    <Card.Text
                      className="ustom-text"
                      style={{
                        fontFamily: "Arial, sans-serif",
                        fontSize: "16px",
                      }}
                    >
                      <strong>Descripción: </strong> {document.doc_description}
                    </Card.Text>
                  </div>
                  <div className="button-container">
                    <div className="button-container">
                      <button
                        className="btn-custom"
                        onClick={() =>
                          window.open(
                            `https://ucvpppix.net/iadocs/docs/download.php?document_id=${document.document_id}`,
                            "_blank"
                          )
                        }
                      >
                        Descargar
                      </button>
                    </div>

                    <Link
                      to={`/update/${document.document_id}`}
                      className="btn-custom"
                    >
                      Actualizar
                    </Link>
                    <button
                      className="btn-custom"
                      variant="danger"
                      onClick={() => handleDelete(document.document_id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Documents;
