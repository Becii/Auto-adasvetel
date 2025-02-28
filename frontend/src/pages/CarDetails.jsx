import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Kiválasztott kép állapota

  // Felhasználói adatok betöltése
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:8000/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCurrentUserEmail(response.data.email);
        }
      } catch (err) {
        console.error('Hiba a felhasználói adatok betöltésekor:', err);
        localStorage.removeItem('token');
      }
    };
    checkAuth();
  }, []);

  // Autó adatainak betöltése
  useEffect(() => {
    const fetchCarDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8000/cars/${id}`);
        const fetchedCar = response.data;
        setCar(fetchedCar);
        // Alapértelmezett kép beállítása: image_url vagy az images tömb első eleme
        setSelectedImage(fetchedCar.image_url || (fetchedCar.images && fetchedCar.images[0]));
        setLoading(false);
      } catch (err) {
        console.error('Hiba az autó adatainak betöltésekor:', err);
        setError(err);
        setLoading(false);
        if (err.response && err.response.status === 404) {
          setTimeout(() => navigate('/cars'), 3000);
        }
      }
    };
    fetchCarDetails();
  }, [id, navigate]);

  // Autó törlése
  const handleDeleteCar = async () => {
    if (window.confirm('Biztosan törölni szeretné ezt az autót?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('A törléshez be kell jelentkezni!');
          navigate('/login');
          return;
        }
        await axios.delete(`http://localhost:8000/cars/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Az autó sikeresen törölve!');
        navigate('/cars');
      } catch (err) {
        console.error('Hiba az autó törlésekor:', err);
        alert(
          err.response?.status === 404
            ? 'Az autó nem található vagy nincs jogosultsága a törléshez.'
            : 'Hiba történt az autó törlésekor.',
        );
      }
    }
  };

  // Kép kiválasztása
  const handleImageSelect = (image) => {
    setSelectedImage(image);
  };

  if (loading) return <div className="loading">Betöltés...</div>;
  if (error)
    return (
      <div className="error">
        <h2>Hiba történt</h2>
        <p>Az autó nem található vagy hiba történt az adatok betöltésekor.</p>
        <p>Átirányítás a főoldalra...</p>
      </div>
    );
  if (!car) return <div className="error">Az autó nem található.</div>;

  const isOwner = currentUserEmail && car.owner_email === currentUserEmail;
  // Összegyűjtjük az összes elérhető képet: image_url + images tömb
  const allImages = [car.image_url, ...(car.images || [])].filter(Boolean);

  return (
    <div className="car-details-page">
      <div className="page-container">
        <div className="breadcrumbs">
          <Link to="/">Főoldal</Link>
          <Link to="/cars">Autók</Link>
          <span>{car.brand} {car.model}</span>
        </div>

        <h1>
          {car.brand} {car.model}
        </h1>

        <div className="car-details-container">
          <div className="car-main">
            <div className="car-gallery">
              <div className="main-image">
                {selectedImage ? (
                  <img src={selectedImage} alt={`${car.brand} ${car.model}`} />
                ) : (
                  <div className="no-image">Nincs kép</div>
                )}
              </div>
              {allImages.length > 1 && (
                <div className="thumbnail-gallery">
                  {allImages.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${car.brand} ${car.model} ${index + 1}`}
                      className={`thumbnail ${image === selectedImage ? 'active' : ''}`}
                      onClick={() => handleImageSelect(image)}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="car-price-section">
              <span className="car-price">{car.price.toLocaleString()} Ft</span>
              <div className="car-actions">
                <button className="action-button">Érdeklődés</button>
                <button className="action-button">Tesztvezetés</button>
              </div>
            </div>

            <div className="car-main-specs">
              <div className="spec-item">
                <span className="spec-label">Évjárat</span>
                <span className="spec-value">{car.year}</span>
              </div>
              {car.mileage && (
                <div className="spec-item">
                  <span className="spec-label">Kilométer</span>
                  <span className="spec-value">{car.mileage.toLocaleString()} km</span>
                </div>
              )}
              {car.fuel_type && (
                <div className="spec-item">
                  <span className="spec-label">Üzemanyag</span>
                  <span className="spec-value">{car.fuel_type}</span>
                </div>
              )}
              {car.transmission && (
                <div className="spec-item">
                  <span className="spec-label">Váltó</span>
                  <span className="spec-value">{car.transmission}</span>
                </div>
              )}
            </div>

            {car.description && (
              <div className="car-description">
                <h3>Leírás</h3>
                <p>{car.description}</p>
              </div>
            )}

            {(car.engine_size || car.horsepower || car.color || car.doors || car.seats) && (
              <div className="car-detailed-specs">
                <h3>További specifikációk</h3>
                <div className="spec-grid">
                  {car.engine_size && (
                    <div className="spec-item">
                      <span className="spec-label">Motor méret</span>
                      <span className="spec-value">{car.engine_size} cm³</span>
                    </div>
                  )}
                  {car.horsepower && (
                    <div className="spec-item">
                      <span className="spec-label">Lóerő</span>
                      <span className="spec-value">{car.horsepower} LE</span>
                    </div>
                  )}
                  {car.color && (
                    <div className="spec-item">
                      <span className="spec-label">Szín</span>
                      <span className="spec-value">{car.color}</span>
                    </div>
                  )}
                  {car.doors && (
                    <div className="spec-item">
                      <span className="spec-label">Ajtók</span>
                      <span className="spec-value">{car.doors}</span>
                    </div>
                  )}
                  {car.seats && (
                    <div className="spec-item">
                      <span className="spec-label">Ülések</span>
                      <span className="spec-value">{car.seats}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {car.features && car.features.length > 0 && (
              <div className="car-features">
                <h3>Felszereltség</h3>
                <ul>
                  {car.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="car-sidebar">
            <div className="seller-info">
              <h3>Kapcsolat</h3>
              {car.owner_email && (
                <p>
                  <span className="seller-name">Email:</span>{' '}
                  <span className="seller-contact">{car.owner_email}</span>
                </p>
              )}
              {car.owner_phone && (
                <p>
                  <span className="seller-name">Telefon:</span>{' '}
                  <span className="seller-contact">{car.owner_phone}</span>
                </p>
              )}
              <button className="seller-contact-button">Érdeklődés</button>
              {isOwner && (
                <button className="seller-contact-button delete-button" onClick={handleDeleteCar}>
                  Autó törlése
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;