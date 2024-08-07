import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { CarritoContext } from './contexts/CarritoContext';
import "./css/CarritoModal.css";
import closeIcon from "./img/close-blanco.png";
import { Link } from 'react-router-dom';
import Borrar from "./img/borrar.png";
import Sumar from "./img/add-white.png";
import Restar from "./img/substract-white.png";

Modal.setAppElement('#root'); // Set the app root element for accessibility

function CarritoModal({ isOpen, onClose }) {

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
            top: '25%',
            left: '25%',
            transform: 'translate(0%, 0%)',
            width: '50%',
            height: 'min-content',
            maxHeight: '65%',
            border: '0',
            borderRadius: '5px',
            padding: '25px',
            paddingTop: '10px',
            paddingBottom: '25px',
            boxShadow: '2px 2px 5px 0px rgba(0,0,0,0.5)',
            backgroundColor: 'rgb(25, 25, 25)',
        },
    };

    return (
        <span>
            <p className="item-nav carrito-text link" onClick={onClose}>
                CARRITO ({totalQuantity})
            </p>
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
                    <div className="carrito-modal-content">
                        <div className='width-100-carrito'>
                            <div className='carrito-space-between'>
                                <h2 className='titulo-carrito texto-carrito-2'>CARRITO</h2>
                                <img className='boton-cerrar-carrito' onClick={onClose} src={closeIcon} alt="close" />
                            </div>
                            <span className='margin-carrito'>
                            <div className='tabla-container'>
                                <table className='tabla-carrito-pc'>
                                    <tbody className='tbody-carrito'>
                                        {carrito.map((item, index) => (
                                            <tr key={index}>
                                                <td className='td-carrito td-imagen-carrito'><img className='img-item-carrito' src={`${process.env.REACT_APP_API_URL}${item.img}`} width="80px" height="80px" alt={item.description} /></td>
                                                <td className='td-carrito-center'><span className='titulo-item-carrito texto-carrito-2'>{item.description}{" ("}{item.talle}{")"}</span></td>
                                                <td className='td-carrito'><span className='texto-carrito'>{item.color}</span></td>
                                                <td className='td-carrito'>
                                                    <div className='cantidad-carrito texto-carrito'>
                                                        <img src={Restar} className='btn-quantity' onClick={() => {
                                                            // Check if quantity is equal to 1 before subtracting one
                                                            if (item.quantity === 1) {
                                                                // If quantity is 1, delete the item
                                                                handleDeleteItem(index);
                                                            } else {
                                                                // If quantity is greater than 1, subtract one
                                                                handleSubtractOne(index);
                                                            }
                                                        }}>
                                                            
                                                        </img>
                                                        {item.quantity}
                                                        <img src={Sumar} className='btn-quantity' onClick={() => handleAddOne(index)}></img>
                                                    </div>
                                                </td>
                                                <td className='texto-carrito precio-carrito'>${item.price}</td>
                                                <td className='td-borrar'><img className='imagen-borrar-carrito-cel' width="25px" height="25px" src={Borrar} alt="" onClick={() => handleDeleteItem(index)}/></td>                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {totalQuantity === 1 ? (
                                <p className='total-carrito texto-carrito-2'>Total ({totalQuantity}) item: <strong>&nbsp;${totalPrice}</strong></p>
                            ) : (
                                <p className='total-carrito texto-carrito-2'>Total ({totalQuantity}) items:<strong>&nbsp;${totalPrice}</strong></p>
                            )}
                            <span className='width-boton-carrito'>
                            <a href='/checkout'>
                            <button className="boton-agregar-carrito-carrito">
                                INICIAR COMPRA
                            </button>
                            </a>
                            </span>
                            </span>
                        </div>
                    </div>
                )}
            </Modal>
        </span>
    );
}

export default CarritoModal;
