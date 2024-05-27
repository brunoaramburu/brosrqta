import React from 'react';
import './css/BotonWsp.css';
import telefono from './img/telefono.png';
import instagram from './img/instagram.png';

function BotonWsp() {
    
    return (
    <span>
        <div className='container-etiquetas'>
            <a href="https://www.whatsapp.com/catalog/5493482250138/?app_absent=0" className="float" target="_blank">
                <img className='img-etiquetas' src={telefono}></img>
            </a>
        </div>
        <div className='container-etiquetas'>
            <a href="https://www.instagram.com/brosrqta/" className="float2" target="_blank">
                <img className='img-etiquetas' src={instagram}></img>
            </a>
        </div>
    </span>
    );
}

export default BotonWsp