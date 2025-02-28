import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaRegHeart, FaExchangeAlt } from 'react-icons/fa';
import '../styles/cars.css';

const CarCard = ({ 
  car, 
  isFavorite = false, 
  isInComparison = false,
  onToggleFavorite,
  onToggleComparison
}) => {
  if (!car) return null;
  
  const {
    id,
    make,
    model,
    year,
    price,
    mileage,
    fuel,
    transmission,
    mainImage,
    images
  } = car;

  const displayImage = mainImage || (images && images.length > 0 ? images[0] : '');

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(car);
    }
  };

  const handleComparisonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleComparison) {
      onToggleComparison(car);
    }
  };

  return (
    <div className="car-card">
      <Link to={`/car/${id}`} className="car-card-link">
        <div className="car-image">
          {displayImage ? (
            <img src={displayImage} alt={`${make} ${model}`} />
          ) : (
            <div className="no-image">Nincs kép</div>
          )}
        </div>
        
        <div className="car-details">
          <h3 className="car-title">{make} {model}</h3>
          <p className="car-price">{price.toLocaleString()} Ft</p>
          
          <div className="car-specs">
            <span className="car-year">{year}</span>
            <span className="car-mileage">{mileage.toLocaleString()} km</span>
            <span className="car-fuel">{fuel}</span>
            <span className="car-transmission">{transmission}</span>
          </div>
        </div>
        
        <div className="car-actions">
          {onToggleFavorite && (
            <button 
              className={`favorite-button ${isFavorite ? 'active' : ''}`}
              onClick={handleFavoriteClick}
              title={isFavorite ? "Eltávolítás a kedvencekből" : "Hozzáadás a kedvencekhez"}
            >
              {isFavorite ? <FaHeart /> : <FaRegHeart />}
            </button>
          )}
          
          {onToggleComparison && (
            <button 
              className={`comparison-button ${isInComparison ? 'active' : ''}`}
              onClick={handleComparisonClick}
              title={isInComparison ? "Eltávolítás az összehasonlításból" : "Hozzáadás az összehasonlításhoz"}
            >
              <FaExchangeAlt />
            </button>
          )}
        </div>
      </Link>
    </div>
  );
};

export default CarCard;