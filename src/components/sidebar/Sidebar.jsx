import React, {useEffect} from "react";
import logo from "../../assets/logo_ricardo_palma.png";
import { useGlobalContext } from "../context";
import { FaTimes } from "react-icons/fa";
import { social, links } from "./data";
//Links
import { Link } from "react-router-dom";
//CSS
import "../../css_components/sidebar.css";

const Sidebar = () => {
  const { isSidebarOpen, closeSidebar } = useGlobalContext();

  // Agregar un manejador de eventos para cerrar la barra lateral cuando se hace clic fuera de ella
  useEffect(() => {
    const handleCloseSidebarOnOutsideClick = (e) => {
      if (isSidebarOpen && !e.target.closest(".sidebar")) {
        // Si la barra lateral está abierta y se hace clic fuera de ella
        closeSidebar();
      }
    };

    // Agregar el manejador de eventos al cuerpo de la página
    document.body.addEventListener("click", handleCloseSidebarOnOutsideClick);

    // Retirar el manejador de eventos al desmontar el componente
    return () => {
      document.body.removeEventListener(
        "click",
        handleCloseSidebarOnOutsideClick
      );
    };
  }, [isSidebarOpen, closeSidebar]);

  return (
    <aside className={`${isSidebarOpen ? "sidebar show-sidebar" : "sidebar"}`}>
      <div className="sidebar-header">
        <img
          src={logo}
          className="logo"
          alt="Logo IEP Ricardo Palma"
          style={{ width: "100px", height: "100px" }} // Considera mover estos estilos al CSS
        />
        <p className="font-weight-bold text-dark">IEP Ricardo Palma</p>{" "}
        {/* Agrega clases para el color del texto si es necesario */}
        <button className="close-btn" onClick={closeSidebar}>
          <FaTimes />
        </button>
      </div>
      <ul className="links">
        {links.map((link) => {
          const { id, url, text, icon } = link;
          return (
            <li key={id}>
              <Link to={url}>
                {icon}
                {text}
              </Link>
            </li>
          );
        })}
      </ul>
      <ul className="social-icons">
        {social.map((link) => {
          const { id, url, icon } = link;
          return (
            <li key={id}>
              <a href={url}>{icon}</a>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
