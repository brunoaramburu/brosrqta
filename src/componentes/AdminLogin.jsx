import React, { useState, useContext } from "react";
import { useLoggedContext } from "./contexts/LoggedContext"; 
import "./css/AdminLogin.css";

function AdminLogin() {
  const [isLogged, setIsLogged] = useContext(useLoggedContext);
  const [password, setPassword] = useState("");
  const correctPassword = "aaa"; // Replace with your actual correct password

  const handleLogin = () => {
    if (password === correctPassword) {
      setIsLogged(true);
      window.location.replace('/panel');
    } else {
      alert("Contraseña incorrecta.");
    }
  };

  return (
    <div>
      <div className="container-form-login">
        <div className="form-login">
          <div className="logo-form">logo</div>
          <p className="titulo-form">INGRESO AL PANEL DE ADMINISTRACIÓN</p>
          <input
            className="input-contraseña"
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="boton-ingresar" onClick={handleLogin}>
            INGRESAR
          </button>
          {isLogged && <p className="token-display">Logged in!</p>}
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
