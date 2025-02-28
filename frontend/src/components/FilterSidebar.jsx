import React, { useState, useEffect } from 'react';

const FilterSidebar = ({ onFilterChange, initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    price: { min: '', max: '' },
    year: { min: '', max: '' },
    mileage: { min: '', max: '' },
    make: '',
    model: '',
    fuel: '',
    transmission: '',
    ...initialFilters
  });

  const fuelTypes = ['Benzin', 'Dízel', 'Elektromos', 'Hybrid', 'LPG'];
  const transmissionTypes = ['Manuális', 'Automata', 'Félautomata'];
  const makes = ['Audi', 'BMW', 'Ford', 'Honda', 'Hyundai', 'Kia', 'Mercedes', 'Opel', 'Renault', 'Skoda', 'Toyota', 'Volkswagen'];
  
  // Ez egy egyszerű példa, a valós implementációban a modellek a kiválasztott márkától függenének
  const models = {
    Audi: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
    BMW: ['1-es', '3-as', '5-ös', 'X1', 'X3', 'X5'],
    // Többi márka modelljei...
  };

  const handleInputChange = (category, field, value) => {
    if (category) {
      setFilters({
        ...filters,
        [category]: {
          ...filters[category],
          [field]: value
        }
      });
    } else {
      setFilters({
        ...filters,
        [field]: value
      });
    }
  };

  const handleReset = () => {
    setFilters({
      price: { min: '', max: '' },
      year: { min: '', max: '' },
      mileage: { min: '', max: '' },
      make: '',
      model: '',
      fuel: '',
      transmission: ''
    });
  };

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  return (
    <div className="filter-sidebar">
      <h3>Szűrők</h3>
      
      <div className="filter-section">
        <h4>Ár (Ft)</h4>
        <div className="range-inputs">
          <input 
            type="number" 
            placeholder="Min" 
            value={filters.price.min}
            onChange={(e) => handleInputChange('price', 'min', e.target.value)}
          />
          <span>-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={filters.price.max}
            onChange={(e) => handleInputChange('price', 'max', e.target.value)}
          />
        </div>
      </div>
      
      <div className="filter-section">
        <h4>Évjárat</h4>
        <div className="range-inputs">
          <input 
            type="number" 
            placeholder="Min" 
            value={filters.year.min}
            onChange={(e) => handleInputChange('year', 'min', e.target.value)}
          />
          <span>-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={filters.year.max}
            onChange={(e) => handleInputChange('year', 'max', e.target.value)}
          />
        </div>
      </div>
      
      <div className="filter-section">
        <h4>Kilométeróra állás</h4>
        <div className="range-inputs">
          <input 
            type="number" 
            placeholder="Min" 
            value={filters.mileage.min}
            onChange={(e) => handleInputChange('mileage', 'min', e.target.value)}
          />
          <span>-</span>
          <input 
            type="number" 
            placeholder="Max" 
            value={filters.mileage.max}
            onChange={(e) => handleInputChange('mileage', 'max', e.target.value)}
          />
        </div>
      </div>
      
      <div className="filter-section">
        <h4>Márka</h4>
        <select 
          value={filters.make} 
          onChange={(e) => handleInputChange(null, 'make', e.target.value)}
        >
          <option value="">Összes</option>
          {makes.map(make => (
            <option key={make} value={make}>{make}</option>
          ))}
        </select>
      </div>
      
      {filters.make && models[filters.make] && (
        <div className="filter-section">
          <h4>Modell</h4>
          <select 
            value={filters.model} 
            onChange={(e) => handleInputChange(null, 'model', e.target.value)}
          >
            <option value="">Összes</option>
            {models[filters.make].map(model => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
      )}
      
      <div className="filter-section">
        <h4>Üzemanyag</h4>
        <select 
          value={filters.fuel} 
          onChange={(e) => handleInputChange(null, 'fuel', e.target.value)}
        >
          <option value="">Összes</option>
          {fuelTypes.map(fuel => (
            <option key={fuel} value={fuel}>{fuel}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-section">
        <h4>Sebességváltó</h4>
        <select 
          value={filters.transmission} 
          onChange={(e) => handleInputChange(null, 'transmission', e.target.value)}
        >
          <option value="">Összes</option>
          {transmissionTypes.map(transmission => (
            <option key={transmission} value={transmission}>{transmission}</option>
          ))}
        </select>
      </div>
      
      <div className="filter-actions">
        <button 
          className="reset-button" 
          onClick={handleReset}
        >
          Szűrők törlése
        </button>
      </div>
    </div>
  );
};

export default FilterSidebar;