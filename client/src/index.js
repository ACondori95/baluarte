import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import {AuthProvider} from "./auth/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* Envolver toda la app con el proveedor de autenticación */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
