import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
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

function App() {
  return (
    <div className="body">
        <div className="content">
        <Loader/>
        <Router>
          <ProductosProvider>
          <CarritoProvider>
          <LoggedProvider>
            <Routes>
              <Route exact={true} path="/" element={<Inicio/>}/>
              {/* <Route exact={true} path="/admin" element={<AdminLogin/>}/> */}
              {/* <Route exact={true} path="/panel" element={<Panel/>}/> */}
              <Route exact={true} path="/categorias" element={<Categorias/>}/>
              <Route exact={true} path="/categoria/:id" element={<CategoriaProductos/>}/>
              <Route exact={true} path="/tienda" element={<Productos/>}/>
              <Route exact={true} path="/producto/:id" element={<DetalleProducto/>}/>
              <Route exact={true} path="/checkout" element={<Checkout/>}/>
              <Route exact={true} path="/pago-exitoso" element={<CompraUala/>}/>
              <Route exact={true} path="/pago-rechazado" element={<CompraRechazada/>}/>
              <Route exact={true} path="/ordentransferencia/:id" element={<OrdenTransferencia/>}/>
            </Routes>
          </LoggedProvider>
          </CarritoProvider>
          </ProductosProvider>
        </Router>
        </div>
        <Footer/>
    </div>
  );
}

export default App;
