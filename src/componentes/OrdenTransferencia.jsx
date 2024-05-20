import './css/OrdenTransferencia.css';
import Navbar from "./Navbar";
import Footer from "./Footer";
import React, { useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

function OrdenTransferencia () {

    const {id} = useParams()  

    const [orden, setOrden] = useState([]);
    const [productos, setProductos] = useState([]);
    const [ordenExpirada, setOrdenExpirada] = useState(false); // Estado para indicar si la orden ha expirado

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/obtenerorden?id=${id}`)
            .then(response => response.json())
            .then(data => {
                setOrden(data);
                setProductos(data.productos);

                // Verificar si la orden ha expirado
                const currentDate = new Date();
                const orderDate = new Date(data.fecha);
                if (currentDate > orderDate) {
                    setOrdenExpirada(true);
                }
            })
            .catch(error => console.error(error));
    }, [id]); // Include id as a dependency to useEffect    

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    
    return(
        <div className='padding-top-navbar'>
            <Navbar/>
            {ordenExpirada ? ( 
                <div className='container-compra-realizada'>
                <h2>¡SU ORDEN HA EXPIRADO!</h2>
                <a href='/'>
                <button className="boton-agregar-carrito boton-compra-uala">
                    VOLVER A LA TIENDA
                </button>
                </a>
                </div>
            ) : (
            <span className='container-checkout-1'>
                <div className='customer-form-container'>
                    
                            <h2 className="titulo-orden-transferencia">RESUMEN DE TU PEDIDO</h2>
                            <span className='container-orden'>
                            <table className='tabla-carrito-checkout'>
                                <thead>
                                    <tr>
                                        <th>NÚMERO DE ORDEN</th>
                                        <th>FECHA</th>
                                        <th>MEDIO DE PAGO</th>
                                        <th>TOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{orden.id}</td>
                                        <td>{formatDate(orden.fecha)}</td>
                                        <td>{orden.medio}</td>
                                        <td>${orden.preciototal}</td>
                                    </tr>
                                </tbody>
                            </table>

                            </span>
                            <div className='separacion-checkout'></div>
                            <h2 className="titulo-orden-transferencia">
                            PRODUCTOS
                            </h2>
                            <table className='tabla-carrito-checkout'>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>NOMBRE</th>
                                        <th>TAMAÑO</th>
                                        <th>COLOR</th>
                                        <th>PRECIO UNIDAD</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map((item, index) => (
                                        <tr className='item-tabla-orden' key={index}>
                                            <td><img src={`${process.env.REACT_APP_API_URL}${item.img}`} width="50px" height="50px" alt={item.description} /></td>
                                            <td>{item.description + '(x' + item.quantity + ')'}</td>
                                            <td>{item.talle}</td>
                                            <td>{item.color}</td>
                                            <td>${item.price}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className='separacion-checkout'></div>
                </div>
                <div className='container-tabla-carrito-checkout'>
                    <h2 className="titulo-orden-transferencia">
                        PASOS A SEGUIR
                    </h2>
                    <table className='tabla-carrito-checkout table-orden'>
                        <tr>
                            <td className='td-numero-paso'>1.</td>
                            <td>
                            Realiza tu pago directamente en nuestra cuenta bancaria. 
                            Por favor, usa el número de orden como referencia de pago. 
                            </td>
                        </tr>
                    </table>
                    <table className='tabla-carrito-checkout tabla-pasos-medio table-orden'>    
                        <tr>
                            <td className='td-numero-paso'>2.</td>
                            <td>
                            <div>
                                <p className='texto-pasos-a-seguir'>
                                Alias: bros.mp
                                </p>
                                <p className='texto-pasos-a-seguir'>
                                CBU/CVU n°: 0000003100071795533792
                                </p>
                            </div>
                            </td>
                        </tr>
                    </table>
                    <table className='tabla-carrito-checkout table-orden'>    
                        <tr>
                            <td className='td-numero-paso'>3.</td>
                            <td>
                            Enviá el comprobante de transferencia con el número de orden a nuestro WhatsApp: +5493482250138.
                            El pedido no sera preparado hasta que se complete este paso.
                            </td>
                        </tr>
                    </table>
                </div>
            </span>
            )}
        </div>
    );
};

export default OrdenTransferencia;
