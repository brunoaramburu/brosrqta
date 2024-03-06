import React, { useContext, useState } from 'react';
import Modal from 'react-modal';
import { CarritoContext } from './contexts/CarritoContext';
import "./css/CarritoModal.css";
import closeIcon from "./img/close.png";
import { Link } from 'react-router-dom'; 

Modal.setAppElement('#root'); // Set the app root element for accessibility

function CarritoModalDetalle({ isOpen, onClose }) {
    
    const [carrito, setCarrito] = useContext(CarritoContext);
    // Calculate total quantity of items in the cart
    const totalQuantity = carrito.reduce((total, item) => total + item.quantity, 0);

    const totalPrice = carrito.reduce((total, item) => total + (item.price * item.quantity), 0);

    const handleDeleteItem = (index) => {
        const updatedCarrito = carrito.filter((item, i) => i !== index);
        setCarrito(updatedCarrito);
    };

    const handleCheckout = () => {
        
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
            <button onClick={onClose} className="boton-agregar-carrito">AGREGAR AL CARRITO</button>
            <Modal isOpen={isOpen} onRequestClose={onClose} style={customStyles} contentLabel="Cart Modal">
                <div className="carrito-modal-content">
                    <div>
                        <div>
                            <div className='carrito-space-between'>
                                <h2>CARRITO</h2>    
                                <button className='boton-cerrar-carrito' onClick={onClose}><img src={closeIcon} alt="close" /></button>
                            </div>
                            <div className='tabla-container'>
                                <table className='tabla-carrito'>
                                    <tbody>
                                        {carrito.map((item, index) => (
                                            <tr key={index}>
                                                <td><img src={"http://localhost:8000" + item.img} width="100px" height="100px" alt={item.description} /></td>
                                                <div>{item.description}</div>
                                                <div>{item.talle}</div>
                                                <div>Color {item.color}</div>
                                                <div className='cantidad-carrito'>
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
                                                <div>${item.price}</div>
                                                <div><button className='boton-eliminar' onClick={() => handleDeleteItem(index)}>Eliminar</button></div>    
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
            </Modal>
        </span>
    );
}

export default CarritoModalDetalle;
