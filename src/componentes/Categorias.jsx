import "./css/Colecciones.css";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import React, { useEffect, useState } from 'react';

function Categorias() {

    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/categorias/`) 
        .then(response => response.json())
        .then(data => setCategorias(data))
        .then(console.log(categorias))
        .catch(error => console.error(error));
    }, []);

    return(
        <div className="padding-top-navbar productos-component">
            <Navbar/>
            <h3 className="titulo-colecciones">CATEGORIAS</h3>
            <div className="Productos">
                <div className="row">
                {categorias.map(categoria => (
                    <a href={`/categoria/${categoria.id}`} style={{ textDecoration: 'none', color: 'black'}}>
                    <span key={categoria.id}>
                    <div className="tarjeta-producto">
                        <img src={`${process.env.REACT_APP_API_URL}${categoria.img}`} className="img-tarjeta-Productos" alt={categoria.nombre} />
                        <p className="titulo-tarjeta-Productos titulo-categoria">{categoria.nombre}</p>
                        <span className="ver-producto-span"></span>
                        <button className="ver-producto-button">VER CATEGORIA</button>
                    </div>
                    </span>
                    </a>
                ))}
                </div>
            </div>
        </div>
    );
}

export default Categorias