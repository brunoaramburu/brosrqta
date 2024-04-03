import BotonWsp from "./BotonWsp";
import "./css/Footer.css";
import Mail from "./img/mail.png";
import Telefono from "./img/telefono.png";

function Footer() {

    return(
        <div>
            <BotonWsp/>
            <h3 className="titulo-clientes">CONFIARON EN NOSOTROS</h3>
            <div className="footer-items">
                <div className="footer-cliente">

                </div>
                <div className="footer-cliente">

                </div>
                <div className="footer-cliente">

                </div>
                <div className="footer-cliente">

                </div>
                <div className="footer-cliente">

                </div>
            </div>
            <div className="footer-bros">
                {/* <div>
                    <img className="logo-redes" src={LogoIg} alt="Instagram"></img>
                    <img className="logo-redes" src={LogoWsp} alt="Whatsapp"></img>
                </div> */}
                {/* <div className="container-footer">
                    <img className="icono-footer" src={Telefono} alt="telefono"></img>
                    <p className="texto-copyright">+5493482250138</p>
                </div> */}
                <div>
                    <p className="texto-copyright">©BROS</p>
                </div>
                {/* <div className="container-footer">
                    <img className="icono-footer" src={Mail} alt="email"></img>
                    <p className="texto-copyright">brosemail@email.com</p>
                </div> */}
            </div>
        </div> 
    );
}

export default Footer