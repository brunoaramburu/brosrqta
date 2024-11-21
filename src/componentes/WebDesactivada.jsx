import React, { useState, useEffect } from 'react';
import Logo from "./img/logo3.png";
import './css/WebDesactivada.css';
import closeIcon from "./img/close.png";
import toast, { Toaster } from 'react-hot-toast';

function WebDesactivada({ onAccessGranted }) {
    const [codigos, setCodigos] = useState([]);
    const [codigoIngresado, setCodigoIngresado] = useState("");
    const [email, setEmail] = useState("");
    const [isCodigoOpen, setIsCodigoOpen] = useState(false);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/codigos/`) 
            .then(response => response.json())
            .then(data => {
                const codigosArray = data.map(item => item.codigo);  // Extraer el campo .codigo
                setCodigos(codigosArray);
            })
            .catch(error => console.error("Error fetching codes:", error));
    }, []);

    const verificarCodigo = () => {
        if (codigos.includes(codigoIngresado)) {
            const ahora = new Date().getTime(); // Tiempo actual en milisegundos
            const tiempoExpiracion = 24 * 60 * 60 * 1000; // 24 horas en milisegundos
            localStorage.setItem('accessGranted', 'true');
            localStorage.setItem('accessGrantedTime', ahora); // Guardar el tiempo actual
            localStorage.setItem('accessExpires', ahora + tiempoExpiracion); // Guardar el tiempo de expiración
            onAccessGranted();  // Llamar a la función para habilitar el acceso
        } else {
            toast.error('Código invalido.');
        }
    };

    const handlerCodigo = () => {
        setIsCodigoOpen(!isCodigoOpen);
    };

    const validarEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const enviarEmail = () => {
        if (!validarEmail(email)) {
            toast.error("Por favor ingresa un correo electrónico válido.");
            return;
        }
        // Enviar email al endpoint /api/emailsuscripcion
        fetch(`${process.env.REACT_APP_API_URL}/api/emailsuscripcion/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email }),  // Enviamos el email como JSON
        })
        .catch(error => {
            console.error("Error enviando el correo:", error);
        });
        toast.success("Correo electrónico suscripto.");
        setEmail("");  // Limpiar el input después de enviar
    };

    const styles = {
        maintenanceContainer: {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: '95vh',
            backgroundColor: '#191919',
            color: '#e1ffff',
            textAlign: 'center',
            padding: '20px',
        },
    };

    return (
        <div style={styles.maintenanceContainer}>
            {!isCodigoOpen && (

                <Toaster
                   position="bottom-center"
                   reverseOrder={false}
                   toastOptions={{
                   className: '',
                   style: {
                      borderRadius: "5px",
                      border: "2px solid gray",
                      textAlign: "center",
                   }
                   }}
                />
            )}
            <button onClick={handlerCodigo} className="btn-codigo">Ingresar con código</button>
            <span>
                <img src={Logo} alt="Estamos trabajando..." height="80px" />
            </span>
            <div className="form-section">
                <h2 className="texto-mantenimiento">Ingresa tu correo electrónico para obtener acceso antes que nadie.</h2>
                <input
                    className='input-email-desac'
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}  // Guardar el email ingresado
                />
                <button className="btn-enviar-email" onClick={enviarEmail}>ENVIAR</button>
            </div>
            {isCodigoOpen && (
                <div className="modal-background">
                    <div className="modal-content">
                        <img className='boton-cerrar-carrito close-button' onClick={handlerCodigo} src={closeIcon} alt="close" />
                        <div className="form-section">
                            <label className='label-codigo' htmlFor="codigo">Ingresa un código de acceso:</label>
                            <input
                                className='input-email-desac'
                                type="text"
                                value={codigoIngresado}
                                onChange={(e) => setCodigoIngresado(e.target.value)}
                            />
                            <button className="btn-enviar-email" onClick={verificarCodigo}>INGRESAR</button>
                        </div>
                        <Toaster
                            position="bottom-center"
                            reverseOrder={false}
                            toastOptions={{
                                className: '',
                                style: {
                                    borderRadius: "5px",
                                    border: "2px solid gray",
                                    textAlign: "center",
                                }
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default WebDesactivada;
