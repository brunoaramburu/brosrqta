import "./css/Productos.css";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import React, { useEffect, useState } from 'react';


function Productos() {
    
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/productos/') 
        .then(response => response.json())
        .then(data => setProductos(data))
        .then(console.log(productos))
        .catch(error => console.error(error));
    }, []);

    return(
        <div>
            <Navbar/>
            <h3 className="titulo-Productos">PRODUCTOS</h3>
            <div className="Productos">
                <div className="row">
                {productos.map(producto => (
                    <div className="tarjeta-Productos" key={producto.id}>
                    <img src={"http://localhost:8000" + producto.img} className="img-tarjeta-Productos"></img>
                    <p className="titulo-tarjeta-Productos">{producto.nombre}</p>
                    <p className="precio-tarjeta-Productos">${producto.precio}</p>
                    <a href={`/producto/${producto.id}`} className="boton-tarjeta-Productos">VER PRODUCTO</a>
                    </div>
                ))}
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Productos