import React, { useState } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import Select from "react-select";
//Axios
import axios from "axios";
//ICONS
import { FaBars } from "react-icons/fa";
//Styles
import styles from "../../components/styles/styles";
//GlobalContext
import { useGlobalContext } from "../../components/context";
//CSS
import "../../css_components/home.css";
// GIF
import loading from "../../assets/loading.gif";
import load_file from "../../assets/load_file.gif";
// firestore
import { buscarArchivosPorPalabrasClave } from "../../../firebase/config";

const DocumentGenerator = () => {
  //Constante del Contexto Global
  const { openSidebar, openModal } = useGlobalContext();
  //Entrada Principal de texto
  const [inputValue, setInputValue] = useState("");
  //PDFinput
  const [pdfPath, setPdfPath] = useState(null); // ruta del PDF
  // const fileUrl = "/back_end/AI/src/generated_doc.pdf";
  //Estado de carga
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0); // Nuevo estado para el progreso
  //Estados de las Opciones
  const [selectedOptionValue, setselectedOptionValue] = useState("");
  const [inputOptionValue, setinputOptionValue] = useState("");
  //Keywords
  const [keywordsArray, setKeywordsArray] = useState([]); // Estado para el array de palabras clave

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // const URL = () => {
  //   obtenerURLDeArchivo(inputValue)
  //     .then((url) => {
  //       console.log("URL del archivo:", url);
  //     })
  //     .catch((error) => {
  //       console.error("Error al obtener la URL del archivo:", error);
  //     });
  // };

  const handleInputChangeKeywords = (e) => {
    const inputValue = e.target.value;
    setInputValue(inputValue);
    const newKeywordsArray = inputValue.split(" "); // Dividir la cadena en un array usando espacios como delimitador
    setKeywordsArray(newKeywordsArray); // Actualizar el estado de keywordsArray
    // console.log(newKeywordsArray); // Esto mostrará el nuevo array de palabras clave en la consola
  };

  // const Keyword = async () => {
  //   try {
  //     setIsLoading(true);
  //     console.log("keywordsArray:", keywordsArray);
  //     // Realizar la búsqueda de archivos por palabras clave
  //     const urls = await buscarArchivosPorPalabrasClave(keywordsArray);
  //     console.log("URLs de archivos coincidentes:", urls);
  //     // Supongamos que urls es un arreglo que contiene la URL del archivo que deseas descargar
  //     const archivoParaDescargar = urls[0]; // Puedes seleccionar la URL que necesitas

  //     // Retrasar la descarga abriendo una nueva pestaña después de un tiempo de espera
  //     const tiempoDeEsperaEnMilisegundos = 7000; // 10 segundos (puedes ajustar este valor)
  //     await retrasarDescarga(
  //       archivoParaDescargar,
  //       tiempoDeEsperaEnMilisegundos
  //     );
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.error(
  //       "Error al buscar archivos por palabras clave FRONTED:",
  //       error.message
  //     );
  //     setIsLoading(false);
  //   }
  // };

  const retrasarDescarga = (archivoURL, tiempoDeEsperaEnMilisegundos) => {
    return new Promise((resolve, reject) => {
      // Verificación básica de la URL
      if (!archivoURL) {
        reject("URL del archivo no proporcionada o no válida.");
        return;
      }

      setTimeout(() => {
        try {
          const a = document.createElement("a");
          document.body.appendChild(a); // Añadir al DOM
          a.href = archivoURL;
          a.target = "_blank"; // Abre en una nueva pestaña
          a.download = archivoURL.split("/").pop(); // Opcional: Asignar un nombre de archivo
          a.click();

          // Limpiar: eliminar el elemento 'a' después de la descarga
          document.body.removeChild(a);
          resolve();
        } catch (error) {
          reject("Error al intentar descargar el archivo: " + error.message);
        }
      }, tiempoDeEsperaEnMilisegundos);
    });
  };

  const palabrasClaveInteres = [
    "computo",
    "osos",
    "ambiente",
    "software",
    "movil",
    "filosofia",
  ];

  const extraerPalabraClave = (arrayPalabras) => {
    // Encuentra la primera palabra clave de interés que esté en el array
    return arrayPalabras.find((palabra) =>
      palabrasClaveInteres.includes(palabra.toLowerCase())
    );
  };

  const filtrarUrlsPorPalabrasClave = (urls, palabraClave) => {
    // Esta función devuelve todas las URLs que contienen la palabra clave
    const palabraClaveMinuscula = palabraClave.toLowerCase();
    return urls.filter((url) =>
      url.toLowerCase().includes(palabraClaveMinuscula)
    );
  };

  const Keyword = async () => {
    try {
      setIsLoading(true);
      console.log("keywordsArray:", keywordsArray);

      // Extraer la palabra clave de interés
      const palabraClave = extraerPalabraClave(keywordsArray);
      if (!palabraClave) {
        // console.log("No se encontró ninguna palabra clave de interés.");
        console.log("No se pudo generar el documento por problemas de quota.");
        setIsLoading(false);
        return;
      }

      const urls = await buscarArchivosPorPalabrasClave([palabraClave]);
      console.log("URLs de archivos coincidentes:", urls);

      // Filtrar las URLs con la palabra clave
      const urlsFiltradas = filtrarUrlsPorPalabrasClave(urls, palabraClave);
      console.log("URLs filtradas:", urlsFiltradas);

      // Seleccionar la primera URL filtrada
      const archivoParaDescargar = urlsFiltradas[0];

      const tiempoDeEsperaEnMilisegundos = 7000;
      await retrasarDescarga(
        archivoParaDescargar,
        tiempoDeEsperaEnMilisegundos
      );
      setIsLoading(false);
    } catch (error) {
      console.error(
        "Error al buscar archivos por palabras clave:",
        error.message
      );
      setIsLoading(false);
    }
  };

  // Asignación del valor seleccionado para el cambio del estado.
  const assignValue = (optionSelected) => {
    setselectedOptionValue(optionSelected);
    setinputOptionValue("");
    console.log(optionSelected);
  };

  //Opciones para los filtros dependiendo de les estructura y composición del documento
  const options = [
    { value: "", label: "Selecciona una opción" },
    { value: "competencias_capacidades", label: "Competencias" },
    { value: "desempeno", label: "Desempeño" },
    { value: "criterio", label: "Criterio" },
    { value: "instrumento_evaluacion", label: "Instrumento de Evaluación" },
    { value: "evidencia", label: "Evidencia" },
    { value: "purpose", label: "Propósito" },
    { value: "actitudes", label: "Actitudes" },
    { value: "antes_session", label: "Preparación de la Sesión" },
    { value: "recursos", label: "Materiales de la Sesión" },
    { value: "inicio", label: "Inicio" },
    { value: "situation_problem", label: "Planteamiento del problema" },
    {
      value: "preguntas_situation",
      label: "Preguntas de la situación problemática",
    },
    { value: "pregunta_investigation", label: "Pregunta de investigación" },
    { value: "hypothesis", label: "Hipótesis" },
    { value: "preguntas_tema", label: "Preguntas acerca del tema" },
  ];

  //Generar input para el prompt independiente GENERAL.
  const [showNewInputPrompt, setShowNewInputPrompt] = useState(false);
  const [inputNewPromptValue, setInputNewPromptValue] = useState("");
  const [buttonPromptText, setButtonPromptText] = useState("Mostrar Input");

  const showNewPromptButtonClick = () => {
    setShowNewInputPrompt(!showNewInputPrompt); //Alternar entre mostrar y ocultar
    setButtonPromptText(showNewInputPrompt ? "Mostrar Input" : "Ocultar");
  };

  const handleInputChangeNewPrompt = (e) => {
    setInputNewPromptValue(e.target.value);
  };
  //Muestra del contenido de los FILTROS
  const [showAllContent, setShowAllContent] = useState(false);
  const [allContentButtonText, setAllContentButtonText] =
    useState("Aplicar Filtros");

  const showAllContentButtonClick = () => {
    setShowAllContent(!showAllContent);
    setAllContentButtonText(
      showAllContent ? "Aplicar Filtros" : "Descartar Filtros"
    );
  };

  const onUploadProgress = (progressEvent) => {
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    );
    setLoadingProgress(percentCompleted);
  };

  return (
    <Container fluid className="d-flex flex-column vh-100 custom-container">
      <Row className="mt-3 mb-3">
        <Col xs={12} className="d-flex justify-content-start">
          <Button className="btn-custom" variant="outline-secondary" onClick={openSidebar}>
            <FaBars />
          </Button>
        </Col>
      </Row>
      <Row className="align-items-center justify-content-center text-center">
        <Col>
          <h1 className="mb-4">Generador de Documentos</h1>
          {/* <img src={load_file} alt="Cargando" className="img-fluid" /> */}
        </Col>
      </Row>

      <Row>
        <Col lg={6} className="mx-auto">
          {/* Input del usuario */}
          <Form.Control
            type="text"
            placeholder="Ingrese su petición"
            value={inputValue}
            // onChange={handleInputChange}
            onChange={handleInputChangeKeywords}
            className="form-input mt-4 mb-3"
          />

          {/* Botón para mostrar y activar los Filtros */}
          <Button
            variant="outline-primary"
            onClick={showAllContentButtonClick}
            className="w-100 mb-4"
          >
            {allContentButtonText}
          </Button>

          {/* Contenedor de Filtros */}
          {showAllContent && (
            <div className="mb-4">
              <h4 className="mb-3">Filtros</h4>
              <Select
                defaultValue={options[0]}
                options={options}
                value={selectedOptionValue}
                onChange={assignValue}
                className="mb-3"
              />
              {selectedOptionValue && selectedOptionValue.value && (
                <Form.Control
                  type="text"
                  value={inputOptionValue}
                  onChange={(e) => setinputOptionValue(e.target.value)}
                  placeholder="Ingrese su prompt"
                  className="mb-3"
                />
              )}
              <Button
                variant="info"
                onClick={showNewPromptButtonClick}
                className="w-100 mb-3"
              >
                {buttonPromptText}
              </Button>
              {showNewInputPrompt && (
                <Form.Control
                  type="text"
                  value={inputNewPromptValue}
                  onChange={handleInputChangeNewPrompt}
                  placeholder="Ingrese algo"
                  className="mb-3"
                />
              )}
            </div>
          )}

          {/* boton para generar el documento */}
          <Button
            variant="primary"
            // onClick={URL}
            onClick={Keyword}
            disabled={isLoading}
            className="w-100 mb-2"
          >
            Generar Documento
          </Button>

          {isLoading && (
            <div className="text-center">
              <img src={load_file} alt="Cargando..." />
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default DocumentGenerator;
