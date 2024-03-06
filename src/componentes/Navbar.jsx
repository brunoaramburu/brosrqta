import React, { useState, useContext, useEffect } from 'react';
import CarritoModal from './CarritoModal';
import { ProductosContext } from './contexts/ProductosContext';
import './css/Navbar.css';
import closeIcon from "./img/close.png";
import Logo from "./img/logo.png";

function Navbar() {
  const [isCarritoModalOpen, setIsCarritoModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
  const productos = useContext(ProductosContext);
  const [avisos, setAvisos] = useState([]);
  const [avisoIndex, setAvisoIndex] = useState(0);
  const [animationKey, setAnimationKey] = useState(0); // Add a state for animation key

  useEffect(() => {
    fetch('http://localhost:8000/api/avisos/') 
      .then(response => response.json())
      .then(data => setAvisos(data))
      .catch(error => console.error(error));
  }, []);

  useEffect(() => {
    const intervaloAviso = setInterval(() => {
      setAvisoIndex(prevIndex => (prevIndex + 1) % avisos.length);
      setAnimationKey(prevKey => prevKey + 1); // Increment animation key to reset animation
    }, 7000);

    return () => clearInterval(intervaloAviso);
  }, [avisos]);

  const toggleCarritoModal = () => {
    setIsCarritoModalOpen(!isCarritoModalOpen);
  };

  const toggleSearchInput = () => {
    setIsSearchInputVisible(!isSearchInputVisible);
    setSearchQuery('');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="navbar-container">
      <div className="aviso">
        <p key={animationKey} className={`texto-aviso fade-in-out`} style={{ animationDuration: '7s' }}>
          {avisos.length > 0 && avisos[avisoIndex].aviso}
        </p>
      </div>
      <div className="navbar">
        <div className="nav-izquierda">
          <a className='link' href="/"><p className="tienda item-nav">TIENDA</p></a>
          <a className='link' href="/categorias"><p className="item-nav">CATEGORIAS</p></a>
          <a className='link' href="/acercade"><p className="item-nav">ACERCA DE</p></a>
        </div>
        <div className="logo-nav">
          <a className='container-logo-nav' href="/"><img className='logo' src={Logo} alt="BROS" width='50px' height='50px'/></a>
        </div>
        <div className="nav-derecha">
          <p className="item-nav buscar-text link" onClick={toggleSearchInput}>BUSCAR</p>
          <span className='carrito-text link'><CarritoModal isOpen={isCarritoModalOpen} onClose={toggleCarritoModal} /></span>
        </div>
      </div>
      {isSearchInputVisible && (
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="BUSCAR PRODUCTOS..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="barra-busqueda"
            />
            <span className="close-link" onClick={toggleSearchInput}>
              <img src={closeIcon} alt="Close" />
            </span>
          </div>
        </div>
      )}
      {isSearchInputVisible && searchQuery.length > 0 && (
        <div className="search-container">
          <div className="search-results">
            {filteredProductos.slice(0, 10).map(producto => (
              <a href={`/producto/${producto.id}`} key={producto.id}>
                <div className="product-item">
                  <img src={"http://localhost:8000" + producto.img} alt={producto.nombre} />
                  <p className="product-name">{producto.nombre}</p>
                  <p className="product-price">${producto.precio}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Navbar;
