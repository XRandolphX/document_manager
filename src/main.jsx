import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import { AppProvider } from "./components/context.jsx";
import "./index.css";

ReactDOM.render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
