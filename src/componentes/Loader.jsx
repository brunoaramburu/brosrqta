import React, { useState, useEffect } from 'react';
import './css/Loader.css';
import gif from './img/loader.gif';

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <div className="loader-container">
      <img src={gif} alt="Loading" />
    </div>
  ) : null;
};

export default Loader;