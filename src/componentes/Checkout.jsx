import React, { useContext, useState, useEffect } from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CarritoContext } from './contexts/CarritoContext';
// import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import "./css/Checkout.css";
import toast, { Toaster } from 'react-hot-toast';

function Checkout() {

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [costoEnvioSucursal, setCostoEnvioSucursal] = useState();
    const [costoEnvioDomicilio, setCostoEnvioDomicilio] = useState();
    const [envio, setEnvio] = useState(0);
    const [envioGratis, setEnvioGratis] = useState();
    const [envioGratisHabilitado, setEnvioGratisHabilitado] = useState(false);
    const [descuentoTransferencia, setDescuentoTransferencia] = useState();
    const [descuentoTransferenciaHabilitado, setDescuentoTransferenciaHabilitado] = useState(false);
    const [selectedEnvioMethod, setSelectedEnvioMethod] = useState('');
    const [carrito, setCarrito] = useContext(CarritoContext);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalPriceOriginal, setTotalPriceOriginal] = useState(0);
    const [totalPriceReady, setTotalPriceReady] = useState(false);
    const [step, setStep] = useState(1); // Use step to determine which part of the modal to show
    const [customerData, setCustomerData] = useState({
        nombre: "",
        apellido: "",
        email: "",
        telefono: {
            numero: ""
        },
        identificacion: {
            tipo: "DNI",
            numero: ""
        },
        direccion: {
            nombre_calle: "",
            numero_calle: "",
            piso: "",
            codigo_postal: "",
            provincia: "",
            ciudad: ""
        }
    });

    useEffect(() => {
        setTotalPrice(carrito.reduce((total, item) => total + (item.price * item.quantity), 0));
        setTotalPriceOriginal(carrito.reduce((total, item) => total + (item.price * item.quantity), 0));
        setTotalPriceReady(true);
        setSelectedPaymentMethod();
        setSelectedEnvioMethod();
    }, [carrito]);

    useEffect(() => {
        if (selectedPaymentMethod === 'transferencia' && descuentoTransferenciaHabilitado) {
            const descuento = Math.floor(totalPrice * (descuentoTransferencia / 100));
            const nuevoTotalPrice = totalPrice - descuento;
            setTotalPrice(nuevoTotalPrice);
            if (envioGratis >= nuevoTotalPrice){
                setSelectedEnvioMethod();
            }
        }
        else if (selectedPaymentMethod === 'uala'){
            setTotalPrice(totalPriceOriginal);
        }
    }, [selectedPaymentMethod]);
    
    useEffect(() => {
        if (totalPriceReady && envioGratis !== undefined && totalPrice >= envioGratis) {
            setEnvioGratisHabilitado(true);
            setEnvio(0);
        } else {
            setEnvioGratisHabilitado(false);
        }
    }, [envioGratis, totalPrice, totalPriceReady]);


    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/envio/`) 
        .then(response => response.json())
        .then(data => {
            setCostoEnvioSucursal(data[0].aSucursal);
            setCostoEnvioDomicilio(data[0].aDomicilio);
        })
        .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/enviogratis/`) 
        .then(response => response.json())
        .then(data => {
            if(data[0].activo == true) {
                setEnvioGratis(data[0].compraminima);
            }
        })
        .catch(error => console.error(error));
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/descuentotransferencia/`) 
        .then(response => response.json())
        .then(data => {
            if(data[0].activo == true) {}
            setDescuentoTransferencia(data[0].porcentaje);
            setDescuentoTransferenciaHabilitado(true);
        })
        .catch(error => console.error(error));
    }, []);

    // const [idMP, setIdMP] = useState(null);

    // initMercadoPago('APP_USR-57cfda65-c921-4b9b-bca3-33d643b378ee', {locale: 'es'});

    // Calculate total quantity of items in the cart

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const numIdentificacionRegex = /^[0-9]+$/;
    const numTelefonoRegex = /^[0-9+]+$/;
    const codigoPostalRegex = /^[0-9]+$/;
    const numeroCalleRegex = /^[0-9]+$/;

    const totalQuantity = carrito.reduce((total, item) => total + item.quantity, 0);

    // const handleMP = (e) => {
    //     e.preventDefault();
    
    //     // Create an object that includes both carrito and customerData
    //     const requestData = {
    //         carrito: carrito,
    //         customerData: customerData,
    //     };
    
    //     fetch("http://localhost:8000/create_preference/", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(requestData), // Send both carrito and customerData
    //     })
    //         .then(function (response) {
    //             return response.json();
    //         })
    //         .then(function (preference) {
    //             setIdMP(preference.id);
    //             console.log(preference.id);
    //             console.log("preference: " + JSON.stringify(preference));
    //         })
    //         .catch(function () {
    //             alert("Unexpected error");
    //         });
    // };

    // const customization = {
    //     visual: {
    //         buttonBackground: 'black',
    //         borderRadius: '6px',
    //     },
    //     texts: {
    //         action: 'pay',
    //         valueProp: 'security_safety',
    //     },
    // }

    const argentineProvinces = [
        "Buenos Aires",
        "Catamarca",
        "Chaco",
        "Chubut",
        "Córdoba",
        "Corrientes",
        "Entre Ríos",
        "Formosa",
        "Jujuy",
        "La Pampa",
        "La Rioja",
        "Mendoza",
        "Misiones",
        "Neuquén",
        "Río Negro",
        "Salta",
        "San Juan",
        "San Luis",
        "Santa Cruz",
        "Santa Fe",
        "Santiago del Estero",
        "Tierra del Fuego",
        "Tucumán"
    ];

    const postUALA = async () => {
        
        
        

        
        try {
          // Obtener el token
          const tokenResponse = await fetch("https://auth.prod.ua.la/1/auth/token", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_name: 'agustinmar7inez',
              client_id: 'dquzqeURm4HRXaUrD3Ujffxw2OZYNqS6',
              client_secret_id: 'xhDAxH_KrauKJmebMLCA-NSAsjKm71zjhm7VegDQV6HD_WMIW60O95_LZBr1dNUP',
              grant_type: 'client_credentials'
            })
          });
      
          if (!tokenResponse.ok) {
            throw new Error('Error al obtener el token');
          }
      
          const { access_token } = await tokenResponse.json();
          console.log('Token:', access_token);
      
          // Hacer la llamada para generar el pago con el token
          const paymentResponse = await fetch("https://checkout.prod.ua.la/1/checkout", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`
            },
            body: JSON.stringify({
              amount: totalPriceWithShipping.toString(),
              //amount: '50',
              description: 'BROS. tienda online',
              userName: 'agustinmar7inez',
              callback_fail: `${process.env.REACT_APP_API_URL}/pago-rechazado`,
              callback_success: `${process.env.REACT_APP_API_URL}/pago-exitoso`,
              notification_url: 'https://www.brosrqta.com.ar/api/actualizarestado/'
            })
          });
      
          if (!paymentResponse.ok) {
            throw new Error('Error al generar el pago');
          }
      
          const paymentResult = await paymentResponse.json();
          console.log('Resultado del pago:', paymentResult);
      
          // Check if the response has a checkoutLink
          if (paymentResult.links && paymentResult.links.checkoutLink) {
            // Open a new window with the checkout link
            const requestData = {
                datoscliente: customerData,
                productos: carrito,
                estado: 'pendiente',
                medio: 'uala',
                preciototal: totalPriceWithShipping,
                precioproductos: totalPrice,
                precioenvio: envio,
                medioenvio: selectedEnvioMethod,
                idtransferencia: paymentResult.uuid,
            };
    
            // Make an HTTP POST request to the Django API endpoint
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/crearorden/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });
    
            if (!response.ok) {
                throw new Error('Error creating order');
            }
    
            const orderResult = await response.json();
            console.log('Order created successfully:', orderResult);
            window.location.href=(paymentResult.links.checkoutLink);
          } else {
            console.error('El resultado del pago no contiene un enlace de pago');
          }
        } catch (err) {
          console.error(err);
        }
    };

    const transferenciaCheckout = async () => {
        if (!selectedEnvioMethod) {
            toast.error('Debe seleccionar un medio de envio.');
            return; // Exit the function if any required field is missing
        }
        
        else if (
            !customerData.nombre ||
            !customerData.apellido ||
            !customerData.identificacion.tipo ||
            !customerData.identificacion.numero ||
            !customerData.email ||
            !customerData.telefono.numero ||
            !customerData.direccion.provincia ||
            !customerData.direccion.ciudad ||
            !customerData.direccion.nombre_calle ||
            !customerData.direccion.numero_calle ||
            !customerData.direccion.codigo_postal
        ) {
            toast.error('Por favor, completa todos los campos requeridos del formulario.');
            return; // Exit the function if any required field is missing
        }

        else if (!emailRegex.test(customerData.email)) {
            toast.error('Por favor ingresa un correo electrónico válido.');
            return; // Salir de la función si el correo electrónico no es válido
        }
    
        // Verificar si el número de identificación contiene solo números
        else if (!numIdentificacionRegex.test(customerData.identificacion.numero)) {
            toast.error('El número de identificación debe contener solo números.');
            return; // Salir de la función si el número de identificación no contiene solo números
        }
    
        // Verificar si el número de teléfono contiene solo números y puede incluir el signo "+"
        else if (!numTelefonoRegex.test(customerData.telefono.numero)) {
            toast.error('El número de teléfono debe contener solo números y puede incluir el signo "+".');
            return; // Salir de la función si el número de teléfono no cumple con el formato especificado
        }
    
        // Verificar si el código postal contiene solo números
        else if (!codigoPostalRegex.test(customerData.direccion.codigo_postal)) {
            toast.error('El código postal debe contener solo números.');
            return; // Salir de la función si el código postal no contiene solo números
        }
    
        // Verificar si el número de calle contiene solo números
        else if (!numeroCalleRegex.test(customerData.direccion.numero_calle)) {
            toast.error('El número de calle debe contener solo números.');
            return; // Salir de la función si el número de calle no contiene solo números
        }

        else{
        
        toast.loading('Generando orden de transferencia...');

        try {
            // Prepare the data to be sent to the Django backend
            const requestData = {
                datoscliente: customerData,
                productos: carrito,
                estado: 'pendiente',
                medio: 'transferencia',
                preciototal: totalPriceWithShipping,
                precioproductos: totalPrice,
                precioenvio: envio,
                medioenvio: selectedEnvioMethod,
                idtransferencia: ".",
            };
    
            // Make an HTTP POST request to the Django API endpoint
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/crearorden/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestData),
            });
    
            if (!response.ok) {
                throw new Error('Error creating order');
            }
    
            const orderResult = await response.json();
            console.log('Order created successfully:', orderResult);
    
            // Redirect to the specified URL
            window.location.href = `${process.env.REACT_APP_API_URL}/ordentransferencia/${orderResult.id}`;
    
            // Your additional logic after creating the order goes here
    
        } catch (error) {
            console.error('Error during transferenciaCheckout:', error);
        }

        }
    };

    useEffect(() => {
        if (selectedEnvioMethod === 'sucursal' && !envioGratisHabilitado) {
            setEnvio(costoEnvioSucursal);
        } else if (selectedEnvioMethod === 'domicilio' && !envioGratisHabilitado) {
            setEnvio(costoEnvioDomicilio);
        } else if (selectedEnvioMethod === 'retiro' && !envioGratisHabilitado) {
            setEnvio(0);
        }
        console.log(envio);
    }, [selectedEnvioMethod, costoEnvioSucursal, costoEnvioDomicilio]);    

    const totalPriceWithShipping = totalPrice + (envio || 0);

    const postUALAWithRetry = async () => {
        let maxRetries = 10; // Número máximo de intentos
        let retries = 0;
        let success = false;
    
        if (!selectedEnvioMethod) {
            toast.error("Debe seleccionar un medio de envio.");
            return;
        }
        else if (
            !customerData.nombre ||
            !customerData.apellido ||
            !customerData.identificacion.tipo ||
            !customerData.identificacion.numero ||
            !customerData.email ||
            !customerData.telefono.numero ||
            !customerData.direccion.provincia ||
            !customerData.direccion.ciudad ||
            !customerData.direccion.nombre_calle ||
            !customerData.direccion.numero_calle ||
            !customerData.direccion.codigo_postal
        ) {
            toast.error('Por favor, completa todos los campos requeridos del formulario.');
            return; // Exit the function if any required field is missing
        }
        else if (!emailRegex.test(customerData.email)) {
            toast.error('Por favor ingresa un correo electrónico válido.');
            return; // Salir de la función si el correo electrónico no es válido
        }
    
        // Verificar si el número de identificación contiene solo números
        else if (!numIdentificacionRegex.test(customerData.identificacion.numero)) {
            toast.error('El número de identificación debe contener solo números.');
            return; // Salir de la función si el número de identificación no contiene solo números
        }
    
        // Verificar si el número de teléfono contiene solo números y puede incluir el signo "+"
        else if (!numTelefonoRegex.test(customerData.telefono.numero)) {
            toast.error('El número de teléfono debe contener solo números y puede incluir el signo "+".');
            return; // Salir de la función si el número de teléfono no cumple con el formato especificado
        }
    
        // Verificar si el código postal contiene solo números
        else if (!codigoPostalRegex.test(customerData.direccion.codigo_postal)) {
            toast.error('El código postal debe contener solo números.');
            return; // Salir de la función si el código postal no contiene solo números
        }
    
        // Verificar si el número de calle contiene solo números
        else if (!numeroCalleRegex.test(customerData.direccion.numero_calle)) {
            toast.error('El número de calle debe contener solo números.');
            return; // Salir de la función si el número de calle no contiene solo números
        }
        else{
            toast.loading('Generando orden de pago...');
            
            while (retries < maxRetries && !success) {
                retries++;
                
                try {
                    await postUALA(); // Intentar realizar el pago
                    success = true; // El pago se realizó con éxito
                } catch (error) {
                    console.error('Error al intentar realizar el pago con Ualá:', error);
        
                    if (retries < maxRetries) {
                        console.log('Reintentando el pago en 5 segundos...');
                        await new Promise(resolve => setTimeout(resolve, 50));
                    } else {
                        console.log('Se alcanzó el número máximo de intentos. Deteniendo el reintento.');
                    }
                }
            }
        }
    };

    const errorMetodos = () => toast.error("Debe seleccionar un medio de pago y envio.");

    return(
        <div className="padding-top-navbar">
            <Navbar/>
            {carrito.length === 0 ? (
            <div className="container-no-productos">
                <h2>No hay productos en el carrito</h2>
                <p className='texto-no-productos'>¡Agrega algunos productos a tu carrito antes de proceder con el pago!</p>
                <a href='/tienda'>
                <button className="boton-agregar-carrito boton-tienda">
                    IR A LA TIENDA
                </button>
                </a>
            </div>
            ) : (
            
            <span className='container-checkout-1'>
            <Toaster 
            position="bottom-center"
            reverseOrder={false}
            toastOptions={{ 
            className: '',
            style: {
                borderRadius: "0px",
                border: "1px solid rgb(25, 25, 25)",
                textAlign: "center",
            }}}
            />
            <div className='customer-form-container'>    
                <h2>DETALLES DE FACTURACIÓN</h2>
                <p>{'(*) Campos obligatorios.'}</p>
                <form className="customer-form">
                        <div className="form-section section-nombre section-nombre-cel">
                        <span className='span-nombre'>
                        <label for="name">* Nombre:</label>
                        <input
                            className='input-form-checkout'
                            type="text"
                            value={customerData.nombre}
                            onChange={(e) =>
                                setCustomerData({ ...customerData, nombre: e.target.value })
                            }
                        />
                        </span>
                        <span className='span-nombre span-apellido'>
                        <label for="surname">* Apellido:</label>
                        <input
                            className='input-form-checkout'
                            type="text"
                            value={customerData.apellido}
                            onChange={(e) =>
                                setCustomerData({ ...customerData, apellido: e.target.value })
                            }
                        />
                        </span>        
                    </div>
                    <div className="form-section">
                        <div className="section-nombre">
                            <span className='span-id'>
                            <label for="identificationType">* Tipo:</label>
                            <select
                                className='input-form-checkout'
                                value={customerData.identificacion.tipo} // Aquí estás estableciendo el valor seleccionado en el estado
                                onChange={(e) =>
                                    setCustomerData({
                                        ...customerData,
                                        identificacion: { ...customerData.identificacion, tipo: e.target.value },
                                    })
                                }
                            >
                                <option value="DNI">DNI</option> {/* Aquí está el valor para DNI */}
                                <option value="Passport">Pasaporte</option> {/* Aquí está el valor para Pasaporte */}
                                {/* Add more identification types as needed */}
                            </select>
                            </span>
                            <span className='span-id-number'>
                            <label for="identificationNumber">* Número de Identificación:</label>
                            <input
                                className='input-form-checkout'
                                type="text"
                                value={customerData.identificacion.numero}
                                onChange={(e) =>
                                    setCustomerData({
                                        ...customerData,
                                        identificacion: { ...customerData.identificacion, numero: e.target.value },
                                    })
                                }
                            />
                            </span>
                        </div> 
                    </div>
                    <div className="form-section">
                        <label for="email">* Email:</label>
                        <input
                            className='input-form-checkout'
                            type="email"
                            value={customerData.email}
                            onChange={(e) =>
                                setCustomerData({ ...customerData, email: e.target.value })
                            }
                        />
                    </div>
                    <div className="form-section">
                        <div className="section-nombre">
                            <span className='span-telefono'>
                            <label for="phone">* Teléfono:</label>
                            <input
                                className='input-form-checkout'
                                type="text"
                                value={customerData.telefono.numero}
                                onChange={(e) =>
                                    setCustomerData({
                                        ...customerData,
                                        telefono: { ...customerData.telefono, numero: e.target.value },
                                    })
                                }
                            />
                            </span>
                        </div>
                    </div>
                    <div className="form-section">
                        <div className="section-nombre">
                            <span className='span-id'>
                            <label for="identificationType">* Provincia:</label>
                            <select
                                className='input-form-checkout'
                                value={customerData.direccion.provincia}
                                onChange={(e) =>
                                    setCustomerData({
                                        ...customerData,
                                        direccion: { ...customerData.direccion, provincia: e.target.value },
                                    })
                                }
                            >
                                <option value="" disabled>Seleccione una provincia</option>
                                {argentineProvinces.map((province) => (
                                    <option key={province} value={province}>
                                        {province}
                                    </option>
                                ))}
                            </select>
                            </span>
                            <span className='span-id-number'>
                            <label for="identificationNumber">* Localidad:</label>
                            <input
                                className='input-form-checkout'
                                type="text"
                                value={customerData.direccion.ciudad}
                                onChange={(e) =>
                                    setCustomerData({
                                        ...customerData,
                                        direccion: { ...customerData.direccion, ciudad: e.target.value },
                                    })
                                }
                            />
                            </span>
                        </div> 
                    </div>
                    <div className="form-section">
                        <label for="streetName">Dirección:</label>
                        <input
                            className='input-direccion input-form-checkout'
                            type="text"
                            placeholder="* Nombre de la calle"
                            value={customerData.direccion.nombre_calle}
                            onChange={(e) =>
                                setCustomerData({
                                    ...customerData,
                                    direccion: { ...customerData.direccion, nombre_calle: e.target.value },
                                })
                            }
                        />
                        <input
                            className='input-direccion input-form-checkout'
                            type="text"
                            placeholder="* Número"
                            value={customerData.direccion.numero_calle}
                            onChange={(e) =>
                                setCustomerData({
                                    ...customerData,
                                    direccion: { ...customerData.direccion, numero_calle: e.target.value },
                                })
                            }
                        />
                        <input
                            className='input-direccion input-form-checkout'
                            type="text"
                            placeholder="Departamento / Piso"
                            value={customerData.direccion.piso}
                            onChange={(e) =>
                                setCustomerData({
                                    ...customerData,
                                    direccion: { ...customerData.direccion, piso: e.target.value },
                                })
                            }
                        />
                        <input
                            className='input-direccion input-form-checkout'
                            type="text"
                            placeholder="* Código postal"
                            value={customerData.direccion.codigo_postal}
                            onChange={(e) =>
                                setCustomerData({
                                    ...customerData,
                                    direccion: { ...customerData.direccion, codigo_postal: e.target.value },
                                })
                            }
                        />
                    </div>
                </form>
            </div>
            <div className='container-tabla-carrito-checkout'>
                <h2 className='titulo-tu-pedido'>TU PEDIDO</h2>
                <table className='tabla-carrito-checkout'>
                    <tbody>
                        {carrito.map((item, index) => (
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
                        <tr className='img-items-checkout'>
                            <td className='total-precio-items'>Total {'('}{totalQuantity}{')'} items:</td>
                            <td></td>
                            <td className='total-precio-items'>${totalPrice}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="payment-method-container">
                    <div className="separacion-checkout"></div>
                    <label className='titulo-checkout'>
                        MEDIO DE PAGO:
                    </label>
                    <select
                    value={selectedPaymentMethod}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="input-form-checkout select-checkout"
                  >
                    <option value="" disabled>Seleccione una opción</option>
                    <option value="uala">Tarjeta de debito / credito</option>
                    <option value="transferencia">Transferencia bancaria{descuentoTransferenciaHabilitado && <span>{' ('}{descuentoTransferencia}% de descuento{')'}</span>}</option>
                  </select>
                </div>
                <div className="payment-method-container">
                    <div className='separacion-checkout'></div>
                    <label className='titulo-checkout'>
                        ENVIO:
                    </label>
                    <select
                        value={selectedEnvioMethod}
                        onChange={(e) => setSelectedEnvioMethod(e.target.value)}
                        className="input-form-checkout select-checkout"
                    >
                        <option value="" disabled>Seleccione una opción</option>
                        <option value="domicilio">
                        Envío a domicilio - {envioGratisHabilitado ? "GRATIS" : <strong>${costoEnvioDomicilio}</strong>}
                        </option>
                        <option value="sucursal">
                        Retiro en sucursal - {envioGratisHabilitado ? "GRATIS" : <strong>${costoEnvioSucursal}</strong>}
                        </option>
                        <option value="retiro">
                        Retiro en <a href="https://maps.app.goo.gl/aCG18yCDpEiqVXTh9" target='_blank' className='label-retiro'>San Martín 771, Reconquista, Santa Fe</a>
                        </option>
                    </select>
                </div>
                {envio != 0 && (
                    <span>
                        <div className='separacion-checkout'></div>
                            <span className='costo-total-checkout'><p>Costo total con envio: </p>&nbsp;<h3> ${totalPriceWithShipping}</h3></span>
                    </span>
                )}
                
                {/* <div className="container-boton-agregar-carrito">
                    {selectedPaymentMethod === 'mercadopago' && (
                    <Wallet initialization={{ preferenceId: idMP, redirectMode: 'modal' }} customization={customization} />
                    )}
                </div> */}
                <div className="container-boton-agregar-carrito">
                    {selectedPaymentMethod != 'uala' && selectedPaymentMethod != 'transferencia' && (
                    <button className="boton-cel boton-pagar-checkout" onClick={errorMetodos}>PAGAR</button>
                    )}
                </div>
                
                <div className="container-boton-agregar-carrito">
                    {selectedPaymentMethod === 'uala' && (
                    <button className='boton-cel boton-pagar-checkout' onClick={postUALAWithRetry}>PAGAR</button>
                    )}
                </div>
                <div className="container-boton-agregar-carrito">
                {selectedPaymentMethod === 'transferencia' && (
                    <button className='boton-cel boton-pagar-checkout' onClick={() => transferenciaCheckout()}>PAGAR</button>
                )}
                </div>
            </div>
            </span>
            )}
        </div>
    )
}

export default Checkout;