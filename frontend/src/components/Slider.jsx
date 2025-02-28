import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/slider.css'; // Feltételezem, hogy külön CSS fájlban lesz a stílus

const Slider = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatikus lejátszás
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 másodpercenként vált
    return () => clearInterval(interval);
  }, [slides.length]);

  // Kézi navigáció
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="slider">
      <div className="slider-wrapper">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slider-slide ${index === currentSlide ? 'active' : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="slider-content">
              <h1 className="slider-title">{slide.title}</h1>
              <p className="slider-description">{slide.description}</p>
              <Link to={slide.ctaLink} className="slider-cta">
                {slide.ctaText}
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="slider-dots">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;