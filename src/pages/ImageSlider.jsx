import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ImageSlider = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsToShow = 5; // Number of cards to show in a row

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:8005/api/products');
        const products = res.data.results;

       
        const urls = products.flatMap(product =>
          product.images.map(img => `http://localhost:8005${img.image}`)
        );

        setImageUrls(urls);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(imageUrls.length / cardsToShow));
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [imageUrls]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + Math.ceil(imageUrls.length / cardsToShow)) % Math.ceil(imageUrls.length / cardsToShow));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % Math.ceil(imageUrls.length / cardsToShow));
  };

  return (
    <div className="relative w-full lg:w- max-w-5xl mx-auto overflow-hidden ">
      <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${currentIndex * (100 / cardsToShow)}%)` }}>
        {imageUrls.map((image, index) => (
          <div className="flex-shrink-0 w-1/5 p-2" key={index}>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={image} alt={`Slide ${index}`} className="w-full h-32 object-cover" />
            </div>
          </div>
        ))}
      </div>
      <button className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white text-2xl p-2 rounded-full" onClick={goToPrevious}>
        ❮
      </button>
      <button className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white text-2xl p-2 rounded-full" onClick={goToNext}>
        ❯
      </button>
    </div>
  );
};

export default ImageSlider;
