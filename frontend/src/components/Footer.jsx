import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>AutoKereskedés</h3>
          <p>Találd meg álmaid autóját nálunk!</p>
          <div className="social-icons">
            <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer">
              <img src="/icons/facebook-icon.png" alt="Facebook" />
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noopener noreferrer">
              <img src="/icons/instagram-icon.png" alt="Instagram" />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer">
              <img src="/icons/twitter-icon.png" alt="Twitter" />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Navigáció</h3>
          <ul>
            <li><Link to="/">Főoldal</Link></li>
            <li><Link to="/cars">Autók</Link></li>
            <li><Link to="/sell-car">Autó hirdetése</Link></li>
            <li><Link to="/login">Bejelentkezés</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Kapcsolat</h3>
          <p>Email: info@autokereskedes.hu</p>
          <p>Telefon: +36 1 234 5678</p>
          <p>Cím: 1234 Budapest, Autó utca 123.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} AutoKereskedés. Minden jog fenntartva.</p>
      </div>
    </footer>
  );
};

export default Footer;