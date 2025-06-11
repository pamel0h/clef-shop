import React, { useEffect, useRef } from 'react';
import '../../../../css/components/BrandCarousel.css';

const BrandCarousel = ({ brands }) => {
  const carouselRef = useRef(null);

  return (
    <div className="carousel-container">
      <div className="carousel-track" ref={carouselRef}>
        {[...brands, ...brands].map((brand, index) => (
          <div key={index} className="carousel-item">
            <div
              className="brand"
              style={{ backgroundImage: `url(${brand.image})` }}
            ></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandCarousel;