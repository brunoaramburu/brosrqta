import React, { createContext, useState, useEffect } from 'react';

// Create a context
export const ProductosContext = createContext();

// Create a provider component
export const ProductosProvider = ({ children }) => {
  const [productos, setProductos] = useState([]);
  const apiUrl = 'http://localhost:8000/productos/';

  useEffect(() => {
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <ProductosContext.Provider value={productos}>
      {children}
    </ProductosContext.Provider>
  );
};
