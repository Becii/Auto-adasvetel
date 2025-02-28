import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const CarContext = createContext();

export const useCars = () => useContext(CarContext);

export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [featuredCars, setFeaturedCars] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [compareList, setCompareList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    brand: "",
    model: "",
    yearFrom: "",
    yearTo: "",
    priceFrom: "",
    priceTo: "",
    fuelType: "",
    transmission: "",
    condition: "",
    page: 1,
    limit: 12,
  });

  // Autók lekérése
  const fetchCars = async (filterParams = filters) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = { ...filterParams };
      Object.keys(params).forEach(key => !params[key] && delete params[key]);
      
      const response = await axios.get("http://localhost:8000/api/cars", { params });
      setCars(response.data.items);
      return response.data;
    } catch (err) {
      setError("Nem sikerült betölteni az autókat");
      return { items: [], total: 0 };
    } finally {
      setLoading(false);
    }
  };

  // Kiemelt autók lekérése
  const fetchFeaturedCars = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/cars/featured");
      setFeaturedCars(response.data);
    } catch (err) {
      console.error("Nem sikerült betölteni a kiemelt autókat:", err);
    }
  };

  // Egy konkrét autó lekérése ID alapján
  const getCarById = async (id) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`http://localhost:8000/api/cars/${id}`);
      return response.data;
    } catch (err) {
      setError("Nem sikerült betölteni az autót");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Autó hozzáadása a kedvencekhez
  const addToFavorites = async (carId) => {
    try {
      await axios.post("http://localhost:8000/api/users/favorites", { car_id: carId });
      setFavorites([...favorites, carId]);
    } catch (err) {
      console.error("Nem sikerült hozzáadni a kedvencekhez:", err);
    }
  };

  // Autó eltávolítása a kedvencekből
  const removeFromFavorites = async (carId) => {
    try {
      await axios.delete(`http://localhost:8000/api/users/favorites/${carId}`);
      setFavorites(favorites.filter(id => id !== carId));
    } catch (err) {
      console.error("Nem sikerült eltávolítani a kedvencekből:", err);
    }
  };

  // Autó hozzáadása az összehasonlításhoz
  const addToCompare = (car) => {
    if (compareList.length < 3 && !compareList.some(c => c.id === car.id)) {
      setCompareList([...compareList, car]);
    }
  };

  // Autó eltávolítása az összehasonlításból
  const removeFromCompare = (carId) => {
    setCompareList(compareList.filter(car => car.id !== carId));
  };

  // Új autó hirdetése
  const addCar = async (carData) => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      
      // Adatok hozzáadása a formData-hoz
      Object.keys(carData).forEach(key => {
        if (key === 'images') {
          for (let i = 0; i < carData.images.length; i++) {
            formData.append('images', carData.images[i]);
          }
        } else {
          formData.append(key, carData[key]);
        }
      });
      
      const response = await axios.post("http://localhost:8000/api/cars", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || "Nem sikerült hozzáadni az autót");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Szűrők frissítése
  const updateFilters = (newFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  // Oldal váltása
  const changePage = (page) => {
    setFilters({ ...filters, page });
  };

  useEffect(() => {
    fetchCars();
    fetchFeaturedCars();
    // Kedvencek lekérése, ha a felhasználó be van jelentkezve
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:8000/api/users/favorites")
        .then(response => {
          setFavorites(response.data.map(car => car.id));
        })
        .catch(err => {
          console.error("Nem sikerült betölteni a kedvenceket:", err);
        });
    }
  }, []);

  return (
    <CarContext.Provider
      value={{
        cars,
        featuredCars,
        favorites,
        compareList,
        loading,
        error,
        filters,
        fetchCars,
        getCarById,
        addToFavorites,
        removeFromFavorites,
        addToCompare,
        removeFromCompare,
        addCar,
        updateFilters,
        changePage,
        isFavorite: (carId) => favorites.includes(carId),
        isInCompare: (carId) => compareList.some(car => car.id === carId)
      }}
    >
      {children}
    </CarContext.Provider>
  );
};

export default CarContext;