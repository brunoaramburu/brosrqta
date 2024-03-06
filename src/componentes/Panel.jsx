import React, { useContext, useEffect, useState } from "react";
import { useLoggedContext } from "./contexts/LoggedContext"; // Adjust the path accordingly

function Panel() {
    
  const [isLogged, setIsLogged] = useContext(useLoggedContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch products if logged in
    if (isLogged) {
      fetch("http://localhost:8000/api/productos/")
        .then((response) => response.json())
        .then((data) => setProducts(data))
        .catch((error) => console.error(error));
    }
  }, [isLogged]); // Run effect when isLoggedIn changes

  // Redirect to /admin if not logged in
  if (!isLogged) {
    return window.location.replace('/admin');
  }

  return (
    <div>
      <h2>Product List</h2>
      <ul>
        {products.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} - ${producto.precio}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Panel;
