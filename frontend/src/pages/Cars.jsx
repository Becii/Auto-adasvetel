import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Cars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Autók listájának betöltése
  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/cars');
        setCars(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Hiba az autók betöltésekor:', err);
        setError(err);
        setLoading(false);
      }
    };
    
    fetchCars();
  }, []);
  
  if (loading) {
    return <div className="loading">Betöltés...</div>;
  }
  
  if (error) {
    return <div className="error">Hiba történt az autók betöltésekor: {error.message}</div>;
  }
  
  if (cars.length === 0) {
    return <div className="no-cars">Jelenleg nincs elérhető autó.</div>;
  }
  
  return (
    <div className="cars-page">
      <div className="page-container">
        <div className="breadcrumbs">
          <Link to="/">Főoldal</Link> &gt; 
          <span>Autók</span>
        </div>
        
        <h1>Elérhető autók</h1>
        
        <div className="filter-section">
          {/* Itt lehetne szűrő és rendezési lehetőségeket hozzáadni */}
        </div>
        
        <div className="cars-grid">
          {cars.map(car => (
            <Link to={`/cars/${car.id}`} key={car.id} className="car-card">
              <div className="car-image">
                {car.image_url ? (
                  <img src={car.image_url} alt={`${car.brand} ${car.model}`} />
                ) : (
                  <img src="src/images/corolla.jpg" alt="Kép leírása"/>
                )}
              </div>
              <div className="car-info">
                <h3 className="car-title">{car.brand} {car.model}</h3>
                <p className="car-price">{car.price.toLocaleString()} Ft</p>
                <div className="car-specs">
                  <span className="car-year">{car.year}</span>
                  {car.mileage && (
                    <span className="car-mileage">{car.mileage.toLocaleString()} km</span>
                  )}
                  {car.fuel_type && (
                    <span className="car-fuel">{car.fuel_type}</span>
                  )}
                  {car.transmission && (
                    <span className="car-transmission">{car.transmission}</span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        <div className="pagination">
          {/* Itt lehetne lapozás lehetőségeket hozzáadni */}
        </div>
      </div>
    </div>
  );
};

export default Cars;