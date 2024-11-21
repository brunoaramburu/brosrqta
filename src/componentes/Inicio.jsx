import "./css/Inicio.css";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import React, { useEffect, useState } from 'react';
import Carousel from "./img/carousel.png";
import CarouselCel from "./img/carousel-cel.jpg";

function Inicio() {
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/productosconcolores/`) 
        .then(response => response.json())
        .then(data => setProductos(data))
        .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        console.log(productos);
    }, [productos]);

    return(
        <div className="padding-top-navbar productos-component">
            <span className="z-index-1"><Navbar/></span>
            <div className="carousel carousel-pc">
                <img className="img-carousel" src={Carousel} alt="Carousel" />
                <div className="carousel-content">
                    <h2 className="slogan-carousel">SE AUTÉNTICO CON BROS.</h2>
                    <a href="/tienda">
                        <button className="carousel-button">IR A LA TIENDA</button>
                    </a>
                </div>
            </div>
            <div className="carousel carousel-cel">
                <img className="img-carousel" src={CarouselCel} alt="Carousel" />
                <div className="carousel-content">
                    <h2 className="slogan-carousel">SE AUTÉNTICO CON BROS.</h2>
                    <a href="/tienda">
                        <button className="carousel-button">IR A LA TIENDA</button>
                    </a>
                </div>
            </div>
            <div className="destacados">
                <div className="categoria">
                    <div className="row-categoria">
                        <a href="/categoria/1">
                        <div className="tarjeta-categoria categoria-buzos">
                            <p className="texto-categoria">BUZOS</p>
                        </div>
                        </a>
                        <a href="/categoria/2">
                        <div className="tarjeta-categoria categoria-remeras">
                            <p className="texto-categoria">REMERAS</p>    
                        </div> 
                        </a>
                        <a href="/categoria/8">
                        <div className="tarjeta-categoria categoria-pantalones">
                            <p className="texto-categoria">PANTALONES</p>    
                        </div> 
                        </a>
                    </div>
                </div>
                <h3 className="titulo-destacados">DESTACADOS</h3>
                <div className="Productos">
                    <div className="row">
                        {productos.filter(producto => producto.destacado).map(producto => (
                            <a key={producto.id} href={`/producto/${producto.id}`} style={{ textDecoration: 'none', color: 'black'}}>
                                <div className="tarjeta-producto">
                                    <img src={`${process.env.REACT_APP_API_URL}/media/${producto.img}`} className="img-tarjeta-Productos" alt={producto.nombre} />
                                    <span className="padding-contenido-tarjeta-productos">
                                        <p className="titulo-tarjeta-Productos">{producto.nombre}</p>
                                        <div className="color-circles">
                                            {producto.colores.map(color => (
                                                <div key={color.nombre} className="color-circle" style={{ backgroundColor: color.rgb_value }}></div>
                                            ))}
                                        </div>
                                        {producto.precio_transferencia && (
                                            <p className="precio-transferencia">
                                                TRANSFERENCIA ${producto.precio_transferencia}
                                            </p>
                                        )}
                                        <p className="precio-tarjeta-Productos">${producto.precio}</p>
                                    </span>
                                    <span className="ver-producto-span"></span>
                                    <button className="ver-producto-button">VER PRODUCTO</button>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Inicio;
