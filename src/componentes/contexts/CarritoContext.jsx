import React, { createContext, useState, useEffect } from "react";

export const CarritoContext = createContext(null);

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(
    JSON.parse(localStorage.getItem("carrito")) || []
  );

  const limpiarCarrito = () => {
    setCarrito([]);
  };

  const limpiarCarritoSiExpirado = () => {
    const currentTime = new Date().getTime();
    const storedTime = localStorage.getItem("carritoTimestamp");
    const timeDifference = currentTime - storedTime;
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

    if (timeDifference > twentyFourHours) {
      setCarrito([]);
      localStorage.removeItem("carrito");
      localStorage.removeItem("carritoTimestamp");
    }
  };

  useEffect(() => {
    limpiarCarritoSiExpirado();
  }, []);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    localStorage.setItem("carritoTimestamp", new Date().getTime());
  }, [carrito]);

  return (
    <CarritoContext.Provider value={[carrito, setCarrito, limpiarCarrito]}>
      {children}
    </CarritoContext.Provider>
  );
};





