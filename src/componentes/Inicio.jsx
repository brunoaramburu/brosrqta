import "./css/Inicio.css";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import React, { useEffect, useState } from 'react';

function Inicio() {

    const [productos, setProductos] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/productosconcolores/') 
        .then(response => response.json())
        .then(data => setProductos(data))
        .then(console.log(productos))
        .catch(error => console.error(error));
    }, []);

    return(
        <div>
            <Navbar/>
            <div className="carousel">

            </div>
            <div className="destacados">
                <div className="categoria">
                    <div className="row-categoria">
                        <div className="tarjeta-categoria">
                            <p className="texto-categoria">BUZOS</p>
                        </div>
                        <div className="tarjeta-categoria">
                            <p className="texto-categoria">REMERAS</p>    
                        </div> 
                        <div className="tarjeta-categoria">
                            <p className="texto-categoria">PANTALONES</p>    
                        </div>  
                    </div>
                </div>
                <h3 className="titulo-destacados">DESTACADOS</h3>
                <div className="Productos">
                    <div className="row">
                    {productos.filter(producto => producto.destacado).map(producto => (
                        <a href={`/producto/${producto.id}`} style={{ textDecoration: 'none', color: 'black'}}>
                            <span key={producto.id}>
                            <div className="tarjeta-producto">
                                <img src={"http://localhost:8000/media/" + producto.img} className="img-tarjeta-Productos" alt={producto.nombre} />
                                <p className="titulo-tarjeta-Productos">{producto.nombre}</p>
                                <div className="color-circles">
                                    {producto.colores.map(color => (
                                        <div key={color.nombre} className="color-circle" style={{ backgroundColor: color.rgb_value }}></div>
                                    ))}
                                </div>
                                <p className="precio-tarjeta-Productos">${producto.precio}</p>
                                <button className="ver-producto-button">VER PRODUCTO</button>
                            </div>
                            </span>
                        </a>
                    ))}
                    </div>
                </div>
                <div className="row-btn-ver-todos">
                    <button className="btn-ver-todos">VER TODOS</button>
                </div>
                <div className="container-suscripcion">
                    <p className="texto-suscripcion">SUSCRIBITE PARA RECIBIR NOVEDADES</p>
                    <div>
                        <input className="input-suscripcion" type="email"></input>
                        <button className="boton-suscripcion">ENVIAR</button>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Inicio