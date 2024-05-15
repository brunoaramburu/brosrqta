import './css/CompraUala.css';
import Navbar from "./Navbar";
import Footer from "./Footer";
import React, { useContext } from 'react';
import { CarritoContext } from "./contexts/CarritoContext";

function CompraUala () {
    const [carrito, setCarrito] = useContext(CarritoContext); // Accediendo a la función limpiarCarrito desde el contexto

    setCarrito([]);

    return(
        <div className='padding-top-navbar'>
            <Navbar/>
                <div className='container-compra-realizada'>
                    <h2>¡TU COMPRA HA SIDO REALIZADA CON ÉXITO!</h2>
                    <p>Enviamos los detalles a tu email</p>
                    <a href="/">
                    <button className="boton-agregar-carrito boton-compra-uala">
                        VOLVER A LA TIENDA
                    </button>
                    </a>
                </div>            
            <Footer/>
        </div>
    );
};

export default CompraUala;
