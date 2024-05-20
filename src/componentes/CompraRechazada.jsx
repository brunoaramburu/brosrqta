import './css/CompraUala.css';
import Navbar from "./Navbar";
import Footer from "./Footer";
import React from 'react';

function CompraRechazada () {

    return(
        <div className='padding-top-navbar'>
            <Navbar/>
                <div className='container-compra-realizada'>
                    <h2 className='texto-compra'>TU PAGO HA SIDO RECHAZADO</h2>
                    <p>Intenta nuevamente</p>
                    <a href='/checkout'>
                    <button className="boton-agregar-carrito boton-compra-uala">
                        IR AL CHECKOUT
                    </button>
                    </a>
                </div>            
        </div>
    );
};

export default CompraRechazada;