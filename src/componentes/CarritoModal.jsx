import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { CarritoContext } from './contexts/CarritoContext';
import "./css/CarritoModal.css";
import closeIcon from "./img/close.png";
import { Link } from 'react-router-dom'; 

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
          top: '0%',
          left: 'auto',
          right: '0%',
          bottom: 'auto',
          transform: 'translate(0%, 0%)',
          width: '20%',
          height: '100%',
          borderLeft: '2px solid black',
          borderRadius: '0',
        },
    };

    return (
        <span>
            <p className="item-nav carrito-text link" onClick={onClose}>
                CARRITO ({totalQuantity})
            </p>
            <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles} contentLabel="Cart Modal">
                {totalQuantity === 0 ? (
                    <span>
                    <div className='carrito-space-between'>
                    <h2 className='titulo-carrito'>CARRITO</h2>    
                    <img className='boton-cerrar-carrito' onClick={onClose} src={closeIcon} alt="close" />
                    </div>
                    <div className="carrito-modal-content">
                        <p>El carrito está vacío...</p>
                    </div>
                    </span>
                ) : (
                    <div className="carrito-modal-content">
                        <div>
                            <div>
                                <div className='carrito-space-between'>
                                    <h2 className='titulo-carrito'>CARRITO</h2>    
                                    <img className='boton-cerrar-carrito' onClick={onClose} src={closeIcon} alt="close" />
                                </div>
                                <div className='tabla-container'>
                                    <table className='tabla-carrito'>
                                        <tbody>
                                            {carrito.map((item, index) => (
                                                <tr key={index}>
                                                    <td><img className='img-item-carrito' src={`${process.env.REACT_APP_API_URL}${item.img}`} width="100px" height="100px" alt={item.description} /></td>
                                                    <div className='titulo-item-carrito texto-carrito'>{item.description}<span className='color-carrito'>{"("}{item.color}{")"}</span></div>
                                                    <div className='texto-carrito'>{item.talle}</div>
                                                    <div className='cantidad-carrito texto-carrito'>
                                                        <button className='btn-quantity' onClick={() => {
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
                                                        <button className='btn-quantity' onClick={() => handleAddOne(index)}>+</button>
                                                    </div>
                                                    <div className='texto-carrito precio-carrito'>${item.price}</div>
                                                    <div className='texto-carrito'><button className='boton-eliminar texto-carrito' onClick={() => handleDeleteItem(index)}>Eliminar</button></div>    
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className='carrito-space-between'>
                                    <p>Total {'('}{totalQuantity}{')'} items: </p><h3>${totalPrice}</h3>
                                </div>
                                <div className="container-boton-agregar-carrito">
                                <Link to={'/checkout'}>
                                    <button className="boton-agregar-carrito">
                                        CHECKOUT
                                    </button>
                                </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </span>
    );
}

export default CarritoModal;
