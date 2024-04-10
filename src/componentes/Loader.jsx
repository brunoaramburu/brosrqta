import React, { useState, useEffect } from 'react';
import './css/Loader.css';
import video from './img/loader.mp4';

const Loader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
     //  }, 50);
     }, 6000);

    return () => clearTimeout(timer);
  }, []);

  return loading ? (
    <div className="loader-container">
      <video autoPlay loop muted className="video">
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  ) : null;
};

export default Loader;
