import React from 'react';
import SearchForm from '../components/SearchForm';
import CarCard from '../components/CarCard';
import Slider from '../components/Slider';

const Home = () => {
  const sliderData = [
    {
      image: 'https://via.placeholder.com/1200x400',
      title: 'Fedezze fel prémium kínálatunkat',
      description: 'Minőségi használt és új autók széles választéka',
      ctaLink: '/cars',
      ctaText: 'Böngésszen most'
    },
    {
      image: 'https://via.placeholder.com/1200x400',
      title: 'Finanszírozási lehetőségek',
      description: 'Kedvező hitelek és lízing ajánlatok',
      ctaLink: '/financing',
      ctaText: 'Részletek'
    },
    {
      image: 'https://via.placeholder.com/1200x400',
      title: 'Cserélje le autóját',
      description: 'Beszámítási lehetőségek és értékbecslés',
      ctaLink: '/sell-car',
      ctaText: 'Értékbecslés'
    }
  ];

  const featuredCars = [
    {
      id: 1,
      make: 'Audi',
      model: 'A4',
      year: 2019,
      price: 8990000,
      mileage: 45000,
      fuel: 'Dízel',
      transmission: 'Automata',
      mainImage: '/images/audia4.jpg', // Helyi kép a public mappából
      images: ['/images/audia4.jpg'] // Ugyanaz a kép az images tömbben is
    },
    {
      id: 2,
      make: 'BMW',
      model: '320i',
      year: 2020,
      price: 9990000,
      mileage: 35000,
      fuel: 'Benzin',
      transmission: 'Automata',
      mainImage: '/images/bmw320i.jpg',
      images: ['/images/bmw320i.jpg']
    },
    {
      id: 3,
      make: 'Mercedes',
      model: 'C200',
      year: 2018,
      price: 8490000,
      mileage: 55000,
      fuel: 'Dízel',
      transmission: 'Automata',
      mainImage: '/images/mercedesc200.jpg',
      images: ['/images/mercedesc200.jpg']
    }
  ];

  const toggleFavorite = (car) => {
    console.log('Toggle favorite:', car);
  };

  return (
    <div className="home-page">
      <Slider slides={sliderData} />
      
      <div className="page-container">
        <div className="search-section">
          <h2>Keresse meg álmai autóját</h2>
          <SearchForm className="home-search-form" />
        </div>
        
        <div className="featured-section">
          <h2>Kiemelt ajánlataink</h2>
          <div className="featured-cars">
            {featuredCars.map(car => (
              <CarCard 
                key={car.id} 
                car={car} 
                onToggleFavorite={toggleFavorite} 
              />
            ))}
          </div>
        </div>
        
        <div className="info-section">
          <h2>Miért válasszon minket?</h2>
          <div className="info-grid">
            <div className="info-card">
              <h3>Minőségi autók</h3>
              <p>Minden járművünk alapos átvizsgáláson esik át.</p>
            </div>
            <div className="info-card">
              <h3>Megbízhatóság</h3>
              <p>10+ éves tapasztalat a használtautó piacon.</p>
            </div>
            <div className="info-card">
              <h3>Garancia</h3>
              <p>12 hónap garancia minden autónkra.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;