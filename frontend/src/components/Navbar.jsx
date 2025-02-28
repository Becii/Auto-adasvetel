import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCars } from "../context/CarContext";


const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { compareList } = useCars();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?term=${searchTerm}`);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          AutoKereskedés
        </Link>

        <div className="navbar-search">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Keresés..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Keresés</button>
          </form>
        </div>

        <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
          <i className={mobileMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
        </div>

        <ul className={mobileMenuOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Főoldal
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/cars" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
              Autók
            </Link>
          </li>
          {compareList.length > 0 && (
            <li className="nav-item">
              <Link to="/compare" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Összehasonlítás ({compareList.length})
              </Link>
            </li>
          )}
          {isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/favorites" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Kedvencek
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/sell-car" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Autó hirdetése
                </Link>
              </li>
              <li className="nav-item dropdown">
                <div className="nav-link dropdown-toggle">
                  {user?.name || "Felhasználó"}
                </div>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>
                    Profil
                  </Link>
                  {user?.role === "admin" && (
                    <Link to="/admin" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>
                      Admin
                    </Link>
                  )}
                  <button className="dropdown-item" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                    Kijelentkezés
                  </button>
                </div>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Bejelentkezés
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                  Regisztráció
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;