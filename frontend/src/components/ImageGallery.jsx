import React, { useState } from 'react';

const ImageGallery = ({ images = [] }) => {
  const [mainImage, setMainImage] = useState(images[0] || '');

  if (!images.length) {
    return <div className="image-gallery-placeholder">Nincsenek képek</div>;
  }

  return (
    <div className="image-gallery">
      <div className="main-image">
        <img src={"mainImage"} alt="Autó fő képe" />
      </div>
      <div className="thumbnail-container">
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`thumbnail ${mainImage === image ? 'active' : ''}`}
            onClick={() => setMainImage(image)}
          >
            <img src={image} alt={`Autó kép ${index + 1}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;