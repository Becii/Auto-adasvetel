import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/sellcar.css';

const SellCar = () => {
  const { user } = useAuth();
  const [car, setCar] = useState({
    brand: '',
    model: '',
    price: '',
    year: '',
    mileage: '',
    fuel_type: '',
    transmission: '',
    engine_size: '',
    horsepower: '',
    color: '',
    doors: '',
    seats: '',
    features: '',
    top_speed: '',
    acceleration: '',
    fuel_consumption: '',
    description: '',
    condition: '',
    service_history: '',
    vin: '',
    owner_email: user?.email || '',
    owner_phone: user?.phone || '',
    image_url: '',
    images: ''
  });
  const [carBrands, setCarBrands] = useState([]);
  const [fuelTypes, setFuelTypes] = useState([]);
  const [transmissions, setTransmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandsResponse, fuelResponse, transResponse] = await Promise.all([
          fetch('http://localhost:8000/carBrands'),
          fetch('http://localhost:8000/fuelTypes'),
          fetch('http://localhost:8000/transmissions')
        ]);
        const brandsData = await brandsResponse.json();
        const fuelData = await fuelResponse.json();
        const transData = await transResponse.json();
        setCarBrands(brandsData);
        setFuelTypes(fuelData);
        setTransmissions(transData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing ${name} to ${value}`); // Debug üzenet
    setCar(prevCar => ({ ...prevCar, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const carData = {
        ...car,
        features: car.features.split(',').map(item => item.trim()),
        images: car.images.split(',').map(item => item.trim())
      };
      const response = await fetch('http://localhost:8000/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(carData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      console.log('Success:', data);
      setCar({
        brand: '',
        model: '',
        price: '',
        year: '',
        mileage: '',
        fuel_type: '',
        transmission: '',
        engine_size: '',
        horsepower: '',
        color: '',
        doors: '',
        seats: '',
        features: '',
        top_speed: '',
        acceleration: '',
        fuel_consumption: '',
        description: '',
        condition: '',
        service_history: '',
        vin: '',
        owner_email: user?.email || '',
        owner_phone: user?.phone || '',
        image_url: '',
        images: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  if (loading) return <div>Betöltés...</div>;

  const selectedBrand = carBrands.find(b => b.brand === car.brand);

  return (
    <div className="sellcar-page">
      <h1>Adja el autóját:</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-columns">
          <div className="column-left">
            <div className="form-field">
              <label htmlFor="brand">Márka:</label>
              <select id="brand" name="brand" value={car.brand} onChange={handleChange}>
                <option value="">Válassz...</option>
                {carBrands.map((brand, index) => (
                  <option key={index} value={brand.brand}>{brand.brand}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="model">Modell:</label>
              <select id="model" name="model" value={car.model} onChange={handleChange} disabled={!car.brand}>
                <option value="">Válassz...</option>
                {selectedBrand && selectedBrand.models.map((model, index) => (
                  <option key={index} value={model}>{model}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="price">Ár:</label>
              <input id="price" type="number" name="price" value={car.price} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="year">Gyártás éve:</label>
              <input id="year" type="number" name="year" value={car.year} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="mileage">Kilométer óra állása:</label>
              <input id="mileage" type="number" name="mileage" value={car.mileage} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="fuel_type">Üzemanyag típusa:</label>
              <select id="fuel_type" name="fuel_type" value={car.fuel_type} onChange={handleChange}>
                <option value="">Válassz...</option>
                {fuelTypes.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="transmission">Sebességváltó:</label>
              <select id="transmission" name="transmission" value={car.transmission} onChange={handleChange}>
                <option value="">Válassz...</option>
                {transmissions.map((trans, index) => (
                  <option key={index} value={trans}>{trans}</option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="engine_size">Hengerűrtartalom:</label>
              <input id="engine_size" type="number" name="engine_size" value={car.engine_size} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="horsepower">Lóerő:</label>
              <input id="horsepower" type="number" name="horsepower" value={car.horsepower} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="color">Szín:</label>
              <input id="color" type="text" name="color" value={car.color} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="doors">Ajtók száma:</label>
              <input id="doors" type="number" name="doors" value={car.doors} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="seats">Ülések száma:</label>
              <input id="seats" type="number" name="seats" value={car.seats} onChange={handleChange} />
            </div>
          </div>

          <div className="column-right">
            <div className="form-field">
              <label htmlFor="features">Felszereltség (vesszővel elválasztva):</label>
              <textarea id="features" name="features" value={car.features} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="top_speed">Végsebesség:</label>
              <input id="top_speed" type="number" name="top_speed" value={car.top_speed} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="acceleration">Gyorsulás:</label>
              <input id="acceleration" type="number" name="acceleration" value={car.acceleration} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="fuel_consumption">Üzemanyag fogyasztás:</label>
              <input id="fuel_consumption" type="number" name="fuel_consumption" value={car.fuel_consumption} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="description">Leírás:</label>
              <textarea id="description" name="description" value={car.description} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="condition">Állapot:</label>
              <input id="condition" type="text" name="condition" value={car.condition} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="service_history">Szerviztörténet:</label>
              <input id="service_history" type="text" name="service_history" value={car.service_history} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="vin">Alvázszám (VIN):</label>
              <input id="vin" type="text" name="vin" value={car.vin} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="owner_email">Tulajdonos email:</label>
              <input id="owner_email" type="email" name="owner_email" value={car.owner_email} onChange={handleChange} disabled={!!user} />
            </div>
            <div className="form-field">
              <label htmlFor="owner_phone">Tulajdonos telefonszáma:</label>
              <input id="owner_phone" type="tel" name="owner_phone" value={car.owner_phone} onChange={handleChange} disabled={!!user} />
            </div>
            <div className="form-field">
              <label htmlFor="image_url">Fő kép URL:</label>
              <input id="image_url" type="text" name="image_url" value={car.image_url} onChange={handleChange} />
            </div>
            <div className="form-field">
              <label htmlFor="images">További képek URL-jei (vesszővel elválasztva):</label>
              <textarea id="images" name="images" value={car.images} onChange={handleChange} />
            </div>
          </div>
        </div>
        <div className="submit-button">
          <button type="submit">Feladás</button>
        </div>
      </form>
    </div>
  );
};

export default SellCar;