import React, { createContext, useState, useEffect } from "react";

export const CarritoContext = createContext(null);

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(
    JSON.parse(localStorage.getItem("carrito")) || []
  );

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  return (
    <CarritoContext.Provider value={[carrito, setCarrito]}>
      {children}
    </CarritoContext.Provider>
  );
};





