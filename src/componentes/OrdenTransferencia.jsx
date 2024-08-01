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

                if (data.estado == 'cancelada')
                    {
                        setOrdenExpirada(true);
                    }
                // Verificar si la orden ha expirado
                // const currentDate = new Date();
                // const orderDate = new Date(data.fecha);
                // if (currentDate > orderDate) {
                //     setOrdenExpirada(true);
                // }
            })
            .catch(error => console.error(error));
    }, [id]); // Include id as a dependency to useEffect    

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    
    return(
        <div className='padding-top-navbar margin-block-auto'>
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
                <span className='span-orden-2'>
                <div className='customer-form-container width-100'>
                    <h2 className="titulo-checkout">RESUMEN DE TU PEDIDO</h2>
                    <span className='container-orden'>
                    <table className='tabla-carrito-checkout tabla-orden-80'>
                        <thead>
                            <tr>
                                <th>NÚMERO DE ORDEN</th>
                                <th>FECHA</th>
                                <th>MEDIO DE PAGO</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{orden.id}</td>
                                <td>{formatDate(orden.fecha)}</td>
                                <td>{orden.medio}</td>
                            </tr>
                        </tbody>
                    </table>
                    </span>
                    <span className='container-orden'>
                    <table className='tabla-carrito-checkout tabla-orden-80'>
                        <thead>
                            <tr>
                                <th>PRECIO PRODUCTOS</th>
                                <th>MEDIO DE ENVIO</th>
                                <th>PRECIO TOTAL</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${orden.precioproductos}</td>
                                <td>{orden.medioenvio}{' ('}${orden.precioenvio}{')'}</td>
                                <td>${orden.preciototal}</td>
                            </tr>
                        </tbody>
                    </table>
                    </span>
                </div>
                <div className='customer-form-container width-100'>
                    <h2 className="titulo-checkout">
                    PRODUCTOS
                    </h2>
                    <span className='container-orden'>
                    <table className='tabla-carrito-checkout tabla-orden-50'>
                        <tbody>
                            {productos.map((item, index) => (
                                <tr className='img-items-checkout' key={index}>
                                    <td className='td-img-item'><img className='img-items-checkout' src={`${process.env.REACT_APP_API_URL}${item.img}`} width="70px" height="70px" alt={item.description} />
                                    <div className='texto-item-checkout'>
                                    <strong>{item.description +'(x' + item.quantity + ')'}</strong><br />
                                    Talle: {item.talle} <br />
                                    Color: {item.color}
                                    </div>
                                    </td>
                                    <td></td>
                                    <td>${item.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    </span>
                </div>
                </span>
                <div className='container-tabla-carrito-checkout pasos-a-seguir-container'>
                    <h2 className="titulo-checkout">
                        PASOS A SEGUIR
                    </h2>
                    <div className='margin-block-auto'>
                    <table className='tabla-carrito-checkout table-orden'>
                        <tr>
                            <td>
                            Realiza tu pago directamente en nuestra cuenta bancaria. 
                            Por favor, usa el número de orden como referencia de pago. 
                            </td>
                        </tr>
                    </table>
                    <table className='tabla-carrito-checkout tabla-pasos-medio table-orden'>    
                        <tr>
                            <td>
                            <div>
                                <p className='texto-pasos-a-seguir'>
                                Alias: brosrqta
                                </p>
                                <p className='texto-pasos-a-seguir'>
                                CBU/CVU n°: 0000003100058502843249
                                </p>
                            </div>
                            </td>
                        </tr>
                    </table>
                    <table className='tabla-carrito-checkout table-orden'>    
                        <tr>
                            <td>
                            Enviá el comprobante de transferencia con el número de orden a nuestro WhatsApp: +5493482250138.
                            El pedido no sera preparado hasta que se complete este paso.
                            </td>
                        </tr>
                    </table>
                    </div>
                </div>
            </span>
            )}
        </div>
    );
};

export default OrdenTransferencia;
