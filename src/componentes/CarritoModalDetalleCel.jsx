import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { CarritoContext } from './contexts/CarritoContext';
import "./css/CarritoModal.css";
import closeIcon from "./img/close.png";
import { Link } from 'react-router-dom';
import Carrito from "./img/carrito.png";
import Borrar from "./img/borrar.png";

Modal.setAppElement('#root'); // Set the app root element for accessibility

function CarritoModalDetalleCel({ isOpen, onClose }) {

    const [carrito, setCarrito] = useContext(CarritoContext);
    // Calculate total quantity of items in the cart
    const totalQuantity = carrito.reduce((total, item) => total + item.quantity, 0);

    const totalPrice = carrito.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handleDeleteItem = (index) => {
        const updatedCarrito = carrito.filter((item, i) => i !== index);
        setCarrito(updatedCarrito);
    };

    const handleSubtractOne = (index) => {
        const updatedCarrito = [...carrito];
        if (updatedCarrito[index].quantity > 1) {
            updatedCarrito[index].quantity -= 1;
            setCarrito(updatedCarrito);
        }
    };

    const handleAddOne = (index) => {
        const updatedCarrito = [...carrito];
        updatedCarrito[index].quantity += 1;
        setCarrito(updatedCarrito);
    };

    const customStyles = {
        content: {
            top: '0%',
            left: '0%',
            transform: 'translate(0%, 0%)',
            width: '100%',
            height: '100%',
            border: '1px solid #888888',
            borderRadius: '0',
            padding: '0px',
            paddingTop: '60px',
            paddingBottom: '0px',
        },
    };

    return (
        <div>
            <button onClick={onClose} className="boton-agregar-carrito">AGREGAR AL CARRITO</button>
            <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles} contentLabel="Cart Modal">
                {totalQuantity === 0 ? (
                    <div className='padding-carrito-vacio-cel'>
                        <div className='carrito-space-between'>
                            <h2 className='titulo-carrito texto-carrito-2'>CARRITO</h2>
                            <img className='boton-cerrar-carrito' onClick={onClose} src={closeIcon} alt="close" />
                        </div>
                        <h3 className='texto-no-productos-carrito'>El carrito está vacío...</h3>
                        <p className='texto-no-productos texto-no-productos-carrito'>¡Agrega algunos productos!</p>
                        <a href='/tienda'>
                        <button className="boton-tienda-carrito-vacio">
                            IR A LA TIENDA
                        </button>
                        </a>
                    </div>
                ) : (
                    <div className="carrito-modal-content padding-carrito-cel">
                        <div>
                            <div>
                                <div className='carrito-space-between'>
                                    <h2 className='titulo-carrito'>CARRITO</h2>
                                    <img className='boton-cerrar-carrito' onClick={onClose} src={closeIcon} alt="close" />
                                </div>
                                <div className='tabla-container tabla-carrito-cel'>
                                    <table className='tabla-carrito-cel'>
                                        <tbody className='tbody-carrito tabla-carrito-cel'>
                                            {carrito.map((item, index) => (
                                                <tr key={index}>
                                                    <td className='td-carrito-left'><img className='img-item-carrito' src={`${process.env.REACT_APP_API_URL}${item.img}`} width="80px" height="80px" alt={item.description} /></td>
                                                    <td className='td-carrito-left'><span className='titulo-item-carrito'>{item.description}{"("}{item.talle}{")"}</span></td>
                                                    <td className='td-carrito'>
                                                        <div className='cantidad-carrito texto-carrito texto-carrito-3'>
                                                            <button className='btn-quantity-2' onClick={() => {
                                                                // Check if quantity is equal to 1 before subtracting one
                                                                if (item.quantity === 1) {
                                                                    // If quantity is 1, delete the item
                                                                    handleDeleteItem(index);
                                                                } else {
                                                                    // If quantity is greater than 1, subtract one
                                                                    handleSubtractOne(index);
                                                                }
                                                            }}>
                                                                -
                                                            </button>
                                                            {item.quantity}
                                                            <button className='btn-quantity-2' onClick={() => handleAddOne(index)}>+</button>
                                                        </div>
                                                    </td>
                                                    <td className='texto-carrito precio-carrito texto-carrito-3'>${item.price}</td>
                                                    <td className='td-borrar'><img className='imagen-borrar-carrito-cel' width="25px" height="25px" src={Borrar} alt="" onClick={() => handleDeleteItem(index)}/></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className='margen-tabla-carrito'></div>
                                <div className='borde-tabla-carrito'></div>
                                    {totalQuantity === 1 ? (
                                        <p className='total-carrito'>Total ({totalQuantity}) item: <strong>&nbsp;${totalPrice}</strong></p>
                                    ) : (
                                        <p className='total-carrito'>Total ({totalQuantity}) items:<strong>&nbsp;${totalPrice}</strong></p>
                                    )}
                                    <div className='borde-tabla-carrito'></div>
                                <div className="container-boton-agregar-carrito">
                                    <a href='/checkout'>
                                    <button className="boton-cel">
                                        INICIAR COMPRA
                                    </button>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

export default CarritoModalDetalleCel;
