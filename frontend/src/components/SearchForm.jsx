import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchForm = ({ className }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    make: '',
    model: '',
    priceMin: '',
    priceMax: '',
    yearMin: '',
    yearMax: '',
  });

  const makes = ['Audi', 'BMW', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Mercedes', 'Opel', 'Renault', 'Skoda', 'Toyota', 'Volkswagen'];
  
  // Ez egy egyszerű példa, a valós implementációban a modellek a kiválasztott márkától függenének
  const models = {
    Audi: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
    BMW: ['1-es', '3-as', '5-ös', 'X1', 'X3', 'X5'],
    // Többi márka modelljei...
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Eltávolítjuk az üres paramétereket
    const filteredParams = Object.entries(searchParams)
      .filter(([_, value]) => value !== '')
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});
    
    // Létrehozzuk a query paramétert
    const queryString = new URLSearchParams(filteredParams).toString();
    
    // Átirányítjuk a felhasználót a keresési eredmények oldalra
    navigate(`/cars?${queryString}`);
  };

  return (
    <div className={`search-form ${className || ''}`}>
      <form onSubmit={handleSubmit}>
        <div className="search-row">
          <div className="search-field">
            <label htmlFor="make">Márka</label>
            <select
              id="make"
              name="make"
              value={searchParams.make}
              onChange={handleInputChange}
            >
              <option value="">Összes</option>
              {makes.map(make => (
                <option key={make} value={make}>{make}</option>
              ))}
            </select>
          </div>
          
          <div className="search-field">
            <label htmlFor="model">Modell</label>
            <select
              id="model"
              name="model"
              value={searchParams.model}
              onChange={handleInputChange}
              disabled={!searchParams.make || !models[searchParams.make]}
            >
              <option value="">Összes</option>
              {searchParams.make && models[searchParams.make] && 
                models[searchParams.make].map(model => (
                  <option key={model} value={model}>{model}</option>
                ))
              }
            </select>
          </div>
        </div>
        
        <div className="search-row">
          <div className="search-field">
            <label htmlFor="priceMin">Ár (Ft) - tól</label>
            <input
              type="number"
              id="priceMin"
              name="priceMin"
              value={searchParams.priceMin}
              onChange={handleInputChange}
              placeholder="Min. ár"
            />
          </div>
          
          <div className="search-field">
            <label htmlFor="priceMax">Ár (Ft) - ig</label>
            <input
              type="number"
              id="priceMax"
              name="priceMax"
              value={searchParams.priceMax}
              onChange={handleInputChange}
              placeholder="Max. ár"
            />
          </div>
        </div>
        
        <div className="search-row">
          <div className="search-field">
            <label htmlFor="yearMin">Évjárat - tól</label>
            <input
              type="number"
              id="yearMin"
              name="yearMin"
              value={searchParams.yearMin}
              onChange={handleInputChange}
              placeholder="Min. év"
            />
          </div>
          
          <div className="search-field">
            <label htmlFor="yearMax">Évjárat - ig</label>
            <input
              type="number"
              id="yearMax"
              name="yearMax"
              value={searchParams.yearMax}
              onChange={handleInputChange}
              placeholder="Max. év"
            />
          </div>
        </div>
        
        <div className="search-actions">
          <button type="submit" className="search-button">Keresés</button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;