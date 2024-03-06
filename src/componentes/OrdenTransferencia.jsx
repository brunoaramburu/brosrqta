import './css/OrdenTransferencia.css';
import Navbar from "./Navbar";
import Footer from "./Footer";
import React, { useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

function OrdenTransferencia () {

    const {id} = useParams()  

    const [orden, setOrden] = useState([]);

    const [productos, setProductos] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8000/api/obtenerorden?id=${id}`)
            .then(response => response.json())
            .then(data => {
                setOrden(data);
                setProductos(data.productos);
            })
            .catch(error => console.error(error));
    }, [id]); // Include id as a dependency to useEffect    

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    
    return(
        <div>
            <Navbar/>
            <h3 className="titulo-Productos">GRACIAS, RECIBIMOS TU PEDIDO.</h3>
            <span className='container-orden'>
            <div className='detalle-orden'>
                <div>
                    <p>NÚMERO DE ORDEN:</p>
                    <p>{orden.id}</p>
                </div>
                <div>
                    <p>FECHA:</p>
                    <p>{formatDate(orden.fecha)}</p>
                </div>
                <div>
                    <p>MEDIO DE PAGO:</p>
                    <p>{orden.medio}</p>
                </div>
                <div>
                    <p>TOTAL:</p>
                    <p>${orden.preciototal}</p>
                </div>
            </div>
            </span>
            <h3 className="titulo-Productos">
                PASOS A SEGUIR:
            </h3>
            <span className='container-pasos'>
                <div className='pasos-a-seguir'>
                    <p className='texto-pasos-a-seguir'>Realiza tu pago directamente en nuestra cuenta bancaria. 
                    Por favor, usa el número del pedido como referencia de pago. 
                    Tu pedido no se procesará hasta que se haya recibido el importe en nuestra cuenta.
                    </p>
                </div>
                <div className='pasos-a-seguir'>
                    <p className='texto-pasos-a-seguir'>IMPORTANTE: el pedido no sera preparado hasta que no se envie el 
                    comprobante de pago por WHATSAPP al +54 9 2215 54-8273 con el número de pedido correspondiente.
                    </p>
                </div>
                <div className='pasos-a-seguir cuenta-bancaria'>
                    <p className='texto-pasos-a-seguir'>
                    Nombre: BROS
                    </p>
                    <p className='texto-pasos-a-seguir'>
                    Alias: bros.mp
                    </p>
                    <p className='texto-pasos-a-seguir'>
                    CBU/CVU n°: 0000003100071795533792
                    </p>
                </div>
                <h3 className="titulo-Productos">
                PRODUCTOS:
                </h3>
                <table className='tabla-carrito-checkout tabla-orden-transferencia'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Nombre</th>
                            <th>Tamaño</th>
                            <th>Color</th>
                            <th>Precio unitario</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productos.map((item, index) => (
                            <tr className='item-tabla-orden' key={index}>
                                <td><img src={"http://localhost:8000" + item.img} width="50px" height="50px" alt={item.description} /></td>
                                <td>{item.description + '(x' + item.quantity + ')'}</td>
                                <td>{item.talle}</td>
                                <td>{item.color}</td>
                                <td>${item.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </span>
            <Footer/>
        </div>
    );
};

export default OrdenTransferencia;