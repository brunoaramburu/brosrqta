import Navbar from "./Navbar";
import Footer from "./Footer";
import React, { useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

function CategoriaProductos () {

    const {id} = useParams()  

    const [productos, setProductos] = useState([]);

    const [categoria, setCategoria] = useState([]);

    const [productosconcolores, setProductosConColores] = useState([]);
    
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/categoriaproductos?categoria=${id}`) 
        .then(response => response.json())
        .then(data => setProductos(data))
        .then(console.log(productos))
        .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/categoria?id=${id}`) 
        .then(response => response.json())
        .then(data => setCategoria(data))
        .then(console.log(categoria))
        .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/productosconcolores/`) 
        .then(response => response.json())
        .then(data => setProductosConColores(data))
        .then(console.log(productosconcolores))
        .catch(error => console.error(error));
    }, []);

    return(
        <div className="padding-top-navbar productos-component">
            <Navbar/>
            <h3 className="titulo-Productos">{categoria.nombre}</h3>
            <div className="Productos">
                <div className="row">
                {productosconcolores
                .filter(producto => producto.categoria == categoria.nombre)
                .map(producto => (
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
};

export default CategoriaProductos;