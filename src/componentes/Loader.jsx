import React, { useState, useEffect } from 'react';
import './css/Loader.css';
import loaderGif from './img/loader.gif';

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 50);
    //}, 4000);

    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <div className="loader-container">
      <img src={loaderGif} alt="Loading..." className="loader-gif" height="120px"/>
    </div>
  ) : null;
};

export default Loader;
