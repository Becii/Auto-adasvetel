import React from 'react';
import { Link } from 'react-router-dom';

const SimilarCars = ({ cars = [], currentCarId }) => {
  // Kiszűrjük a jelenlegi autót a hasonló autók közül
  const filteredCars = cars.filter(car => car.id !== currentCarId).slice(0, 4);

  if (!filteredCars.length) {
    return null;
  }

  return (
    <div className="similar-cars">
      <h3>Hasonló járművek</h3>
      
      <div className="similar-cars-grid">
        {filteredCars.map(car => (
          <div key={car.id} className="similar-car-card">
            <Link to={`/car/${car.id}`}>
              <div className="car-image">
                <img src={car.mainImage || car.images[0]} alt={car.title} />
              </div>
              <div className="car-info">
                <h4>{car.make} {car.model}</h4>
                <p className="car-price">{car.price.toLocaleString()} Ft</p>
                <p className="car-year-mileage">{car.year} | {car.mileage} km</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SimilarCars;