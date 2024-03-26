import React, { useContext, useState, useEffect } from 'react';
import Navbar from "./Navbar";
import Footer from "./Footer";
import { CarritoContext } from './contexts/CarritoContext';
// import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import "./css/Checkout.css";

function Checkout() {

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [costoEnvioSucursal, setCostoEnvioSucursal] = useState();
    const [costoEnvioDomicilio, setCostoEnvioDomicilio] = useState();
    const [envio, setEnvio] = useState(0);
    const [selectedEnvioMethod, setSelectedEnvioMethod] = useState();
    const [carrito, setCarrito] = useContext(CarritoContext);
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
        fetch(`${process.env.REACT_APP_API_URL}/api/envio/`) 
        .then(response => response.json())
        .then(data => {
            setCostoEnvioSucursal(data[0].aSucursal);
            setCostoEnvioDomicilio(data[0].aDomicilio);
        })
        .catch(error => console.error(error));
    }, []);

    // const [idMP, setIdMP] = useState(null);

    // initMercadoPago('APP_USR-57cfda65-c921-4b9b-bca3-33d643b378ee', {locale: 'es'});

    // Calculate total quantity of items in the cart
    const totalQuantity = carrito.reduce((total, item) => total + item.quantity, 0);

    const totalPrice = carrito.reduce((total, item) => total + (item.price * item.quantity), 0);

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
        if (!selectedEnvioMethod) {
            alert('Por favor selecciona una opción de envío.');
            return; // Exit the function if no shipping option is selected
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
            alert('Por favor completa todos los campos requeridos del formulario.');
            return; // Exit the function if any required field is missing
        }

        else{
        
        try {
          // Obtener el token
          const tokenResponse = await fetch("https://auth.stage.ua.la/1/auth/token", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              user_name: 'new_user_1631906477',
              client_id: '5qqGKGm4EaawnAH0J6xluc6AWdQBvLW3',
              client_secret_id: 'cVp1iGEB-DE6KtL4Hi7tocdopP2pZxzaEVciACApWH92e8_Hloe8CD5ilM63NppG',
              grant_type: 'client_credentials'
            })
          });
      
          if (!tokenResponse.ok) {
            throw new Error('Error al obtener el token');
          }
      
          const { access_token } = await tokenResponse.json();
          console.log('Token:', access_token);
      
          // Hacer la llamada para generar el pago con el token
          const paymentResponse = await fetch("https://checkout.stage.ua.la/1/checkout", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access_token}`
            },
            body: JSON.stringify({
              amount: totalPriceWithShipping.toString(),
              description: 'Venta',
              userName: 'new_user_1631906477',
              callback_fail: 'https://www.google.com/search?q=failed',
              callback_success: 'https://www.google.com/search?q=success',
              notification_url: 'https://www.notificationurl.com'
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
            window.open(paymentResult.links.checkoutLink, '_blank');
            const requestData = {
                datoscliente: customerData,
                productos: carrito,
                estado: 'pendiente',
                medio: 'uala',
                preciototal: totalPriceWithShipping,
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
          } else {
            console.error('El resultado del pago no contiene un enlace de pago');
          }
        } catch (err) {
          console.error(err);
        }
        
        }
    };

    const transferenciaCheckout = async () => {
        if (!selectedEnvioMethod) {
            alert('Por favor selecciona una opción de envío.');
            return; // Exit the function if no shipping option is selected
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
            alert('Por favor completa todos los campos requeridos del formulario.');
            return; // Exit the function if any required field is missing
        }

        else{
        
        
        try {
            // Prepare the data to be sent to the Django backend
            const requestData = {
                datoscliente: customerData,
                productos: carrito,
                estado: 'pendiente',
                medio: 'transferencia',
                preciototal: totalPriceWithShipping,
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
            window.location.href = `${process.env.REACT_APP_API_URL}/api/ordentransferencia/${orderResult.id}`;
    
            // Your additional logic after creating the order goes here
    
        } catch (error) {
            console.error('Error during transferenciaCheckout:', error);
        }

        }
    };

    useEffect(() => {
        if (selectedEnvioMethod === 'sucursal') {
            setEnvio(costoEnvioSucursal);
        } else if (selectedEnvioMethod === 'domicilio') {
            setEnvio(costoEnvioDomicilio);
        } else if (selectedEnvioMethod === 'retiro') {
            setEnvio(0);
        }
        console.log(envio);
    }, [selectedEnvioMethod, costoEnvioSucursal, costoEnvioDomicilio]);    

    const totalPriceWithShipping = totalPrice + (envio || 0);

    return(
        <div>
            <Navbar/>
                {step === 1 && (
                // Part 2: Display customer data form
                <span className='container-checkout-1'>
                <div className='customer-form-container'>    
                    <h2>DETALLES DE FACTURACIÓN</h2>
                    <p>{'(*) Campos obligatorios.'}</p>
                    <form className="customer-form">
                            <div className="form-section section-nombre">
                            <span className='span-nombre'>
                            <label for="name">* Nombre:</label>
                            <input
                                type="text"
                                value={customerData.nombre}
                                onChange={(e) =>
                                    setCustomerData({ ...customerData, nombre: e.target.value })
                                }
                            />
                            </span>
                            <span className='span-nombre'>
                            <label for="surname">* Apellido:</label>
                            <input
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
                                    value={customerData.identificacion.tipo}
                                    onChange={(e) =>
                                        setCustomerData({
                                            ...customerData,
                                            identification: { ...customerData.identificacion, tipo: e.target.value },
                                        })
                                    }
                                >
                                    <option value="DNI">DNI</option>
                                    <option value="Passport">Pasaporte</option>
                                    {/* Add more identification types as needed */}
                                </select>
                                </span>
                                <span className='span-id-number'>
                                <label for="identificationNumber">* Número de Identificación:</label>
                                <input
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
                                    value={customerData.direccion.provincia}
                                    onChange={(e) =>
                                        setCustomerData({
                                            ...customerData,
                                            direccion: { ...customerData.direccion, provincia: e.target.value },
                                        })
                                    }
                                >
                                    <option value="">Selecciona una provincia</option>
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
                                className='input-direccion'
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
                                className='input-direccion'
                                type="text"
                                placeholder="* Número de la calle"
                                value={customerData.direccion.numero_calle}
                                onChange={(e) =>
                                    setCustomerData({
                                        ...customerData,
                                        direccion: { ...customerData.direccion, numero_calle: e.target.value },
                                    })
                                }
                            />
                            <input
                                className='input-direccion'
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
                                className='input-direccion'
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
                    <h2>TU PEDIDO</h2>
                    <table className='tabla-carrito-checkout'>
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
                            {carrito.map((item, index) => (
                                <tr key={index}>
                                    <td><img src={`${process.env.REACT_APP_API_URL}${item.img}`} width="50px" height="50px" alt={item.description} /></td>
                                    <td>{item.description + '(x' + item.quantity + ')'}</td>
                                    <td>{item.talle}</td>
                                    <td>{item.color}</td>
                                    <td>${item.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='carrito-space-between'>
                        <p>Total {'('}{totalQuantity}{')'} items: </p><h3>${totalPrice}</h3>
                    </div>
                    <div className="payment-method-container">
                        <label className='titulo-checkout'>
                            Envio:
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="domicilio"
                                checked={selectedEnvioMethod === 'domicilio'}
                                onChange={() => setSelectedEnvioMethod('domicilio')}
                            />
                            Envio a domicilio por Correo Argentino {'('}${costoEnvioDomicilio}{')'}
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="sucursal"
                                checked={selectedEnvioMethod === 'sucursal'}
                                onChange={() => setSelectedEnvioMethod('sucursal')}
                            />
                            Envio a sucursal de Correo Argentino {'('}${costoEnvioSucursal}{')'}
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="retiro"
                                checked={selectedEnvioMethod === 'retiro'}
                                onChange={() => setSelectedEnvioMethod('retiro')}
                            />
                            Retiro en ~direccion de bros~
                        </label>
                    </div>
                    {envio != 0 && (
                        <div className='carrito-space-between'>
                            <p>Costo total con envio: </p><h3>${totalPriceWithShipping}</h3>
                        </div>
                    )}
                    <div className="payment-method-container">
                        <label className='titulo-checkout'>
                            Medio de pago:
                        </label>
                        <label>
                            <input
                                className='input-radio'
                                type="radio"
                                value="uala"
                                checked={selectedPaymentMethod === 'uala'}
                                onChange={() => setSelectedPaymentMethod('uala')}
                            />
                            Pagar con tarjeta de credito / debito
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="transferencia"
                                checked={selectedPaymentMethod === 'transferencia'}
                                onChange={() => setSelectedPaymentMethod('transferencia')}
                            />
                            Pagar con transferencia bancaria
                        </label>
                    </div>
                    {/* <div className="container-boton-agregar-carrito">
                        {selectedPaymentMethod === 'mercadopago' && (
                        <Wallet initialization={{ preferenceId: idMP, redirectMode: 'modal' }} customization={customization} />
                        )}
                    </div> */}
                    <div className="container-boton-agregar-carrito">
                        {selectedPaymentMethod === 'uala' && (
                        <button className='boton-agregar-carrito' onClick={postUALA}>PAGAR CON TARJETA DE CREDITO / DEBITO</button>
                        )}
                    </div>
                    <div className="container-boton-agregar-carrito">
                    {selectedPaymentMethod === 'transferencia' && (
                        <button className='boton-agregar-carrito' onClick={() => transferenciaCheckout()}>PAGAR CON TRANSFERENCIA</button>
                    )}
                    </div>
                </div>
                </span>
                )}
                {step === 2 && (
                    <span></span>
                )}
            <Footer/>
        </div>
    )
}

export default Checkout;