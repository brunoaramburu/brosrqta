import "./css/Colecciones.css";
import Navbar from "./Navbar.jsx";
import Footer from "./Footer.jsx";
import React, { useEffect, useState } from 'react';

function Categorias() {

    const [categorias, setCategorias] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8000/api/categorias/') 
        .then(response => response.json())
        .then(data => setCategorias(data))
        .then(console.log(categorias))
        .catch(error => console.error(error));
    }, []);

    return(
        <div>
            <Navbar/>
            <h3 className="titulo-colecciones">CATEGORIAS</h3>
            <div className="Productos">
                <div className="row">
                {categorias.map(categoria => (
                    <div className="tarjeta-Productos" key={categoria.id}>
                    <img src={"http://localhost:8000" + categoria.img} className="img-tarjeta-Productos"></img>
                    <p className="titulo-tarjeta-Productos titulo-categoria">{categoria.nombre}</p>
                    <a href={`/categoria/${categoria.id}`} className="boton-tarjeta-Productos ">VER CATEGORIA</a>
                    </div>
                ))}
                </div>
            </div>
            <Footer/>    
        </div>
    );
}

export default Categorias