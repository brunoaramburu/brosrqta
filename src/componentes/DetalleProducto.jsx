import Navbar from "./Navbar";
import Footer from "./Footer";
import "./css/DetalleProducto.css";
import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { CarritoContext } from "./contexts/CarritoContext";
import CarritoModalDetalle from './CarritoModalDetalle';
import "react-responsive-carousel/lib/styles/carousel.min.css";

function DetalleProducto() {
  const { id } = useParams();

  const [producto, setProducto] = useState([]);
  const [fotoTalle, setFotoTalle] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [productoTamanosColores, setProductoTamanosColores] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [isSelectionValid, setIsSelectionValid] = useState(false);
  const [allImages, setAllImages] = useState([]);
  const [uniqueColors, setUniqueColors] = useState([]); // New state to store unique colors

  const validateSelection = () => {
    setIsSelectionValid(selectedColor !== null && selectedTalle !== null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await fetch(`http://localhost:8000/api/producto/${id}/`);
        const productData = await productResponse.json();
        setProducto(productData);
        setImagenes([{ image_url: productData.img }]);
        
        const productColoresTamanosResponse = await fetch(`http://localhost:8000/api/producto/${id}/detalle`);
        const productColoresTamanosData = await productColoresTamanosResponse.json();
        setProductoTamanosColores(productColoresTamanosData);

        const imagenesResponse = await fetch(`http://localhost:8000/api/imagenesproducto/${id}`);
        const imagenesData = await imagenesResponse.json();
        setAllImages(imagenesData); // Store all images

        const relatedProductsResponse = await fetch(`http://localhost:8000/api/productosconcolores`);
        const relatedProductsData = await relatedProductsResponse.json();
        setRelatedProducts(relatedProductsData);

        const fotoTalleResponse = await fetch(`http://localhost:8000/api/fototalle/${productData.fototalle}`);
        const fotoTalleData = await fotoTalleResponse.json();
        setFotoTalle(fotoTalleData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  const [productoTamanos, setProductoTamanos] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:8000/api/talles/${id}/`)
      .then(response => response.json())
      .then(data => {
        const updatedData = data.map(async productoTamano => {
          const tamanoResponse = await fetch(`http://localhost:8000/api/talle/${productoTamano.tamaño}/`);
          const tamanoData = await tamanoResponse.json();
          return { ...productoTamano, tamaño_nombre: tamanoData.nombre };
        });

        Promise.all(updatedData).then(updatedProductTamanos => {
          setProductoTamanos(updatedProductTamanos);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const toggleCarritoModal = () => {
    setIsCarritoModalOpen(!isCarritoModalOpen);
  };

  const [isCarritoModalOpen, setIsCarritoModalOpen] = useState(false);
  const [carrito, setCarrito] = useContext(CarritoContext);

  const addToCarrito = () => {
    if (!selectedTalle) {
      alert("Por favor, seleccione un talle antes de agregar el producto al carrito.");
      return;
    }

    if (!selectedColor) {
      alert("Por favor, seleccione un color antes de agregar el producto al carrito.");
      return;
    }

    const existingItemIndex = carrito.findIndex(
      item =>
        item.description === producto.nombre &&
        item.price === producto.precio &&
        item.talle === selectedTalle &&
        item.color === selectedColor
    );

    if (existingItemIndex !== -1) {
      const updatedCart = carrito.map((item, index) => {
        if (index === existingItemIndex) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
      setCarrito(updatedCart);
    } else {
      const productToAdd = {
        quantity: 1,
        description: producto.nombre,
        price: producto.precio,
        talle: selectedTalle,
        color: selectedColor,
        img: producto.img,
      };
      const updatedCart = [...carrito, productToAdd];
      setCarrito(updatedCart);
    }
    console.log(carrito);
  };

  const [selectedTalle, setSelectedTalle] = useState(null);
  const handleSizeButtonClick = (tamaño_nombre) => {
    setSelectedTalle(tamaño_nombre);
    validateSelection();
  };

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [colorData, setColorData] = useState([]);

  const handleColorSelection = (color) => {
    setSelectedTalle(null);
    setSelectedColor(color);
  
    const sizesWithSelectedColor = productoTamanosColores
      .filter(productoTamano => productoTamano.color === color && productoTamano.stock > 0)
      .map(productoTamano => productoTamano.tamaño);
  
    setAvailableSizes(sizesWithSelectedColor);
  
    // Find the images URLs for the selected color
    const imagesWithSelectedColor = allImages.filter(image => image.color === color);
  
    // Update the product images
    if (imagesWithSelectedColor.length > 0) {
      setImagenes(imagesWithSelectedColor);
    } else {
      // If no images are found, show only the default product image
      setImagenes([{ image_url: producto.img }]);
    }
  
    // Auto-select size if only one is available
    if (sizesWithSelectedColor.length === 1) {
      setSelectedTalle(sizesWithSelectedColor[0]);
      validateSelection();
    }
  
    validateSelection();
  };

  useEffect(() => {
    const fetchProductColors = async () => {
      try {
        const colorResponse = await fetch(`http://localhost:8000/api/productocolores?id=${id}`);
        const colorData = await colorResponse.json();
        setColorData(colorData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductColors();
  }, [id, selectedColor]);

  useEffect(() => {
    // Create a unique list of colors with RGB values
    const uniqueColorsSet = new Set(
      productoTamanosColores
        .filter(productoTamano => productoTamano.stock > 0)
        .map(productoTamano => ({ color: productoTamano.color, rgb: productoTamano.rgb }))
        .map(JSON.stringify) // Convert each object to a JSON string
    );
  
    // Convert JSON strings back to objects when creating the array
    setUniqueColors(Array.from(uniqueColorsSet, JSON.parse));
    if (uniqueColors.length === 1) {
      handleColorSelection(uniqueColors[0].color);
    }
  }, [productoTamanosColores]);

  useEffect(() => {
    setIsSelectionValid(selectedColor !== null && selectedTalle !== null);
  }, [selectedColor, selectedTalle]);

  return (
    <div>
      <Navbar />
      <span className="margin-producto">
      <div className="row-destacados">
        <div className="col-imagenes">
          {imagenes.map(image => (
            <img className="imagen-producto" key={image.image_url} src={"http://localhost:8000" + image.image_url} alt={producto.nombre} />
          ))}
        </div>
        <div className="col-informacion">
          <p className="nombre-producto padding-10-left">{producto.nombre}</p>
          <p className="precio-producto padding-10-left">${producto.precio}</p>
          <p className="descripcion-producto padding-10-left">{producto.descripcion}</p>
          <p className="padding-10-left">Color:</p>
          <div className="talles-producto padding-10-left">
            {uniqueColors.map((color) => (
              <div className={selectedColor === color.color ? 'color-option-container selected-color-container' : 'color-option-container'}>
                <button
                key={color.color}
                className={selectedColor === color.color ? 'color-option selected-color' : 'color-option'}
                style={{ backgroundColor: color.rgb }}
                onClick={() => handleColorSelection(color.color)}
              ></button>
              </div>
            ))}
          </div>
          {availableSizes.length > 0 && (
            <span>
            <p className="padding-10-left">Talle:</p>
            <div className="talles-producto padding-10-left">
              {availableSizes.map((size) => (
                <div className={selectedTalle === size ? 'selected-container-talle container-talle' : 'container-talle'} key={size}>
                  <button
                    onClick={() => handleSizeButtonClick(size)}
                    className={selectedTalle === size ? 'selected-talle' : 'boton-talle'}
                  >
                    {size}
                  </button>
                </div>
              ))}
            </div>
            </span>
          )}
          <div className="container-boton-agregar-carrito">
          {!isSelectionValid && (
            <p className="error-message">*Debe seleccionar color y talle para agregar el producto al carrito.</p>
          )}
          {fotoTalle.img && (
          <span>
            <a href={"http://localhost:8000/media/" + fotoTalle.img} target="_blank" style={{ textDecoration: 'underline'}}><p>VER GUÍA DE TALLES</p></a>
          </span>
          )}
          {isSelectionValid && (
              <span onClick={() => {
                if (isCarritoModalOpen !== true) {
                  addToCarrito();
                }
              }}>
                <CarritoModalDetalle isOpen={isCarritoModalOpen} onClose={toggleCarritoModal} />
              </span>
            )}
          </div>
        </div>
      </div>
      </span>
      <div className="productos-relacionados">
        <h3 className="titulo-relacionados">PRODUCTOS RELACIONADOS</h3>
        <div className="row-destacados">
          {relatedProducts
            .filter(relatedProduct => relatedProduct.grupo == producto.grupo)
            .slice(0, 4)
            .map(relatedProduct => (
              <a href={`/producto/${relatedProduct.id}`} style={{ textDecoration: 'none', color: 'black'}}>
                <span key={producto.id}>
                <div className="tarjeta-producto">
                    <img src={"http://localhost:8000/media/" + relatedProduct.img} className="img-tarjeta-Productos" alt={relatedProduct.nombre} />
                    <p className="titulo-tarjeta-Productos">{relatedProduct.nombre}</p>
                    <div className="color-circles">
                        {relatedProduct.colores.map(color => (
                          <div key={color.nombre} className="color-circle" style={{ backgroundColor: color.rgb_value }}></div>
                        ))}
                    </div>
                    <p className="precio-tarjeta-Productos">${relatedProduct.precio}</p>
                    <button className="ver-producto-button">VER PRODUCTO</button>
                </div>
                </span>
              </a>
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default DetalleProducto;
