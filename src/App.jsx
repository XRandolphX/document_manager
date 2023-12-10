//REACT
import React from "react";
//Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
//BrowserRouter
import { BrowserRouter, Routes, Route } from "react-router-dom";
//Components
import Modal from "./components/Modal";
import Sidebar from "./components/sidebar/Sidebar";
//PAGES
import Home from "./components/pages/Home";
import Documents from "./components/pages/Documents";
import Add from "./components/pages/Add";
import Update from "./components/pages/Update";
import NotFound from "./components/pages/NotFound";
import Register from "./components/pages/User_Register";
import Login from "./components/pages/Login";
//Style
import "./styleApp.css";

function App() {
  return (
    <BrowserRouter>
      <Modal />
      <Sidebar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/docs" element={<Documents />} />
        <Route path="/add" element={<Add />} />
        <Route path="/update/:id" element={<Update />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
