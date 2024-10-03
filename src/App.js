import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Inicio from "./componentes/Inicio.jsx";
import Productos from "./componentes/Productos.jsx";
import AdminLogin from "./componentes/AdminLogin.jsx";
import DetalleProducto from "./componentes/DetalleProducto.jsx";
import { CarritoProvider } from "./componentes/contexts/CarritoContext.jsx";
import { ProductosProvider } from "./componentes/contexts/ProductosContext.jsx";
import { LoggedProvider } from "./componentes/contexts/LoggedContext.jsx";
import Panel from "./componentes/Panel.jsx";
import Checkout from "./componentes/Checkout.jsx";
import Footer from "./componentes/Footer.jsx";
import Categorias from "./componentes/Categorias.jsx";
import CategoriaProductos from "./componentes/CategoriaProductos.jsx";
import BotonWsp from "./componentes/BotonWsp.jsx";
import OrdenTransferencia from "./componentes/OrdenTransferencia.jsx";
import Loader from "./componentes/Loader.jsx";
import CompraUala from "./componentes/CompraUala.jsx";
import CompraRechazada from "./componentes/CompraRechazada.jsx";
import Logo from "./componentes/img/logo3.png";
import WebDesactivada from "./componentes/WebDesactivada.jsx";

function App() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [hasAccess, setHasAccess] = useState(localStorage.getItem('accessGranted') === 'true'); // Verifica si ya tiene acceso

  useEffect(() => {
    const checkMaintenanceStatus = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/inhabilitar`);
        const data = await response.json();
        setIsMaintenance(data.Inhabilitada);
      } catch (error) {
        console.error("Error al comprobar el estado de mantenimiento:", error);
      }
    };
    checkMaintenanceStatus();
  }, []);

  const grantAccess = () => {
    setHasAccess(true);  // Actualiza el estado local para permitir acceso
  };

  useEffect(() => {
    const checkAccessExpiration = () => {
      const expiracionGuardada = localStorage.getItem('accessExpires');
      const ahora = new Date().getTime();
  
      if (expiracionGuardada && ahora > expiracionGuardada) {
        // Si el tiempo actual supera la expiración, remover el acceso
        localStorage.removeItem('accessGranted');
        localStorage.removeItem('accessGrantedTime');
        localStorage.removeItem('accessExpires');
        setHasAccess(false);  // Quitar el acceso
      } else if (localStorage.getItem('accessGranted') === 'true') {
        setHasAccess(true); // Mantener el acceso si no ha expirado
      }
    };
  
    checkAccessExpiration();
  }, []);

  if (isMaintenance && !hasAccess) {
    return (
      <span>
        <Loader />
        <WebDesactivada onAccessGranted={grantAccess} />
      </span>
    );
  }

  return (
    <div className="body">
      <div className="content">
        <Loader />
        <Router>
          <ProductosProvider>
            <CarritoProvider>
              <LoggedProvider>
                <Routes>
                  <Route exact={true} path="/" element={<Inicio />} />
                  <Route exact={true} path="/categorias" element={<Categorias />} />
                  <Route exact={true} path="/categoria/:id" element={<CategoriaProductos />} />
                  <Route exact={true} path="/tienda" element={<Productos />} />
                  <Route exact={true} path="/producto/:id" element={<DetalleProducto />} />
                  <Route exact={true} path="/checkout" element={<Checkout />} />
                  <Route exact={true} path="/pago-exitoso" element={<CompraUala />} />
                  <Route exact={true} path="/pago-rechazado" element={<CompraRechazada />} />
                  <Route exact={true} path="/ordentransferencia/:id" element={<OrdenTransferencia />} />
                </Routes>
              </LoggedProvider>
            </CarritoProvider>
          </ProductosProvider>
        </Router>
      </div>
      <Footer />
    </div>
  );
}

export default App;
