import React, { useEffect, useRef } from 'react';
import '../../../../css/components/BrandCarousel.css'; 
//заглушка
const brands = [
  'brand1-logo.png',
  'brand2-logo.png',
  'brand3-logo.png',
  'brand4-logo.png',
  'brand5-logo.png',
  'brand6-logo.png',
  'brand4-logo.png',
  'brand5-logo.png',
  'brand6-logo.png',

];

const BrandCarousel = () => {
  const carouselRef = useRef(null);

  return (
    <div className="carousel-container">
      <div className="carousel-track" ref={carouselRef}>
       
        {[...brands, ...brands].map((brand, index) => (
          <div key={index} className="carousel-item">
            <div className='brand'></div>
            {/* <img src={brand} alt={`Brand ${index}`} /> потом сделать выгрузку логотипов брендов*/} 
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandCarousel;