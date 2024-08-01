import React, { useState, useContext, useEffect } from 'react';
import CarritoModal from './CarritoModal';
import CarritoModalCel from './CarritoModalCel';
import { ProductosContext } from './contexts/ProductosContext';
import './css/Navbar.css';
import closeIcon from "./img/close-nav.png";
import Logo from "./img/logo3.png";
import SearchWhite from "./img/search2.png";
import Menu from "./img/menu.png";

function Navbar() {
  const [isCarritoModalOpen, setIsCarritoModalOpen] = useState(false);
  const [isCarritoModalCelOpen, setIsCarritoModalCelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchInputVisible, setIsSearchInputVisible] = useState(false);
  const [categoriasVisible, setCategoriasVisible] = useState(false);
  const productos = useContext(ProductosContext);
  const [avisos, setAvisos] = useState([]);
  const [currentAvisoIndex, setCurrentAvisoIndex] = useState(0);
  const [animationTrigger, setAnimationTrigger] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/avisos/`)
      .then(response => response.json())
      .then(data => setAvisos(data))
      .catch(error => console.error(error));

  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAvisoIndex(prevIndex => (prevIndex + 1) % avisos.length);
      setAnimationTrigger(true);
    }, 8000); // Cambiar el aviso cada 8 segundos

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar el componente
  }, [avisos]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/categorias/`)
      .then(response => response.json())
      .then(data => setCategorias(data))
      .catch(error => console.error(error));
  }, []);

  const toggleCarritoModal = () => {
    setIsCarritoModalOpen(!isCarritoModalOpen);
  };

  const toggleCarritoModalCel = () => {
    setIsCarritoModalCelOpen(!isCarritoModalCelOpen);
  };

  const toggleCarritoModalCelClose = () => {
    setIsSearchInputVisible(false);
    setMenuOpen(false);
  };

  const toggleSearchInput = () => {
    setIsSearchInputVisible(!isSearchInputVisible);
    setSearchQuery('');
    console.log(searchQuery);
    console.log(filteredProductos);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    console.log(searchQuery);
    console.log(filteredProductos);
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMouseEnter = () => {
    setCategoriasVisible(true);
  };

  const handleMouseLeave = () => {
    setTimeout(() => {
      setCategoriasVisible(false);
    }, 100);
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <span>
    <span className='navbar-pc'>
    <div className="navbar-container">
      <div className="aviso-container">
        <div className="aviso">
          {avisos.length > 0 && (
            <p className={`texto-aviso ${animationTrigger ? 'fade-in-out' : ''}`}>
              {avisos[currentAvisoIndex].aviso}
            </p>
          )}
        </div>
      </div>
      <div className="navbar">
        <div className="nav-derecha" onMouseLeave={handleMouseLeave}>
          <a className='link' href="/tienda"><p className="tienda item-nav">TIENDA</p></a>
          <a onMouseEnter={handleMouseEnter}>
            <span className='link'><p className="item-nav" >CATEGORIAS</p></span>
            <div className={`categorias-dropdown ${categoriasVisible ? 'show' : ''}`}>
              <ul>
                {categorias.map(categoria => (
                  <li className='link-dropdown'>
                    <a href={`/categoria/${categoria.id}`} style={{ textDecoration: 'none', color: 'black'}}>
                      <span className='container-cat-nav'>
                        <img src={`${process.env.REACT_APP_API_URL}${categoria.img}`} alt={categoria.nombre} className='img-categoria-navbar'/>
                        <p className='texto-categorias-navbar'>{categoria.nombre}</p>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </a>
        </div>
        <div className="logo-nav">
          <a className='container-logo-nav' href="/"><img className='logo' src={Logo} alt="BROS" width='120px'/></a>
        </div>
        <div className="nav-derecha">
          <p className="item-nav buscar-text link" onClick={toggleSearchInput}>BUSCAR</p>
          <span><CarritoModal isOpen={isCarritoModalOpen} onClose={toggleCarritoModal} /></span>
        </div>
      </div>
      <div className={`search-container ${isSearchInputVisible ? 'show' : ''}`}>
        <div className="search-bar">
          <input
            type="text"
            placeholder="BUSCAR PRODUCTOS..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="barra-busqueda"
          />
          <span className="close-link" onClick={toggleSearchInput}>
            <img className='img-cerrar-nav' src={closeIcon} alt="Close" />
          </span>
        </div>
      </div>
      <div className="search-results">
          {isSearchInputVisible && searchQuery.length > 0 && filteredProductos.slice(0, 10).map(producto => (
            <a href={`/producto/${producto.id}`} key={producto.id}>
              <div className="product-item">
                <img src={`${process.env.REACT_APP_API_URL}${producto.img}`} alt={producto.nombre} />
                <p className="product-name">{producto.nombre}</p>
                <p className="product-price">${producto.precio}</p>
              </div>
            </a>
          ))}
        </div>
    </div>
    </span>
      <span className='navbar-cel'>
      <div className="navbar-container">
        <div className="navbar">
          <div className="nav-derecha nav-derecha-cel" onMouseLeave={handleMouseLeave}>
            <img src={Menu} alt="" width="25px" height="25px" onClick={handleMenuToggle}/>
          </div>
          <div className="logo-nav">
            <a className='container-logo-nav' href="/"><img className='logo' src={Logo} alt="BROS" width='90px'/></a>
          </div>
          <div className="nav-derecha nav-derecha-cel">
            <span><img src={SearchWhite} alt="buscar" width="25px" height="25px" onClick={toggleSearchInput}/></span>
            <span onClick={toggleCarritoModalCelClose}><CarritoModalCel isOpen={isCarritoModalCelOpen} onClose={toggleCarritoModalCel}/></span>
          </div>
        </div>
        <div className={`sidebar-menu ${menuOpen ? 'show' : ''}`}>
          <ul className="category-list">
            {categorias.map(categoria => (
              <a className='link-dropdown' key={categoria.id} href={`/categoria/${categoria.id}`} style={{ textDecoration: 'none', color: 'black'}}>
                <span className='container-cat-nav'>
                  <img src={`${process.env.REACT_APP_API_URL}${categoria.img}`} alt={categoria.nombre} className='img-categoria-navbar'/>
                  <p className='texto-categorias-navbar'>{categoria.nombre}</p>
                </span>
              </a>
            ))}
          </ul>
        </div>
        <div className={`search-container ${isSearchInputVisible ? 'show' : ''}`}>
          <div className="search-bar">
            <input
              type="text"
              placeholder="BUSCAR PRODUCTOS..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="barra-busqueda"
            />
            <span className="close-link" onClick={toggleSearchInput}>
              <img className='img-cerrar-nav' src={closeIcon} alt="Close" />
            </span>
          </div>
        </div>
        <div className="search-results">
            {isSearchInputVisible && searchQuery.length > 0 && filteredProductos.slice(0, 10).map(producto => (
              <a href={`/producto/${producto.id}`} key={producto.id}>
                <div className="product-item">
                  <img src={`${process.env.REACT_APP_API_URL}${producto.img}`} alt={producto.nombre} />
                  <p className="product-name">{producto.nombre}</p>
                  <p className="product-price">${producto.precio}</p>
                </div>
              </a>
            ))}
          </div>
      </div>
      </span>
      
    </span>
  );
}

export default Navbar;
