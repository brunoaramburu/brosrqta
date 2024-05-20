import "./css/Productos.css";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import React, { useEffect, useState } from 'react';


function Productos() {
    
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/productosconcolores/`) 
        .then(response => response.json())
        .then(data => setProductos(data))
        .then(console.log(productos))
        .catch(error => console.error(error));
    }, []);

    return(
        <div className="padding-top-navbar">
            <Navbar/>
            <h3 className="titulo-Productos">PRODUCTOS</h3>
            <div className="Productos">
                <div className="row">
                {productos.map(producto => (
                    <a href={`/producto/${producto.id}`} style={{ textDecoration: 'none', color: 'black'}}>
                        <span key={producto.id}>
                        <div className="tarjeta-producto">
                            <img src={`${process.env.REACT_APP_API_URL}/media/${producto.img}`} className="img-tarjeta-Productos" alt={producto.nombre} />
                            <span className="padding-contenido-tarjeta-productos">
                            <p className="titulo-tarjeta-Productos">{producto.nombre}</p>
                            <div className="color-circles">
                                {producto.colores.map(color => (
                                    <div key={color.nombre} className="color-circle" style={{ backgroundColor: color.rgb_value }}></div>
                                ))}
                            </div>
                            <p className="precio-tarjeta-Productos">${producto.precio}</p>
                            </span>
                            <span className="ver-producto-span"></span>
                            <button className="ver-producto-button">VER PRODUCTO</button>
                        </div>
                        </span>
                    </a>
                ))}
                </div>
            </div>
        </div>
    );
}

export default Productos