/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

const CarouselShop = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const scrollAmount = useRef(0);
  const intervalRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const activeCategory = queryParams.get('category');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:8005/api/categories/");
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    startAutoScroll();
    return () => stopAutoScroll();
  }, [categories]);

  const startAutoScroll = () => {
    const scrollStep = 1;
    intervalRef.current = setInterval(() => {
      if (sliderRef.current) {
        scrollAmount.current += scrollStep;
        sliderRef.current.scrollLeft = scrollAmount.current;
        if (scrollAmount.current >= sliderRef.current.scrollWidth / 2) {
          scrollAmount.current = 0;
        }
      }
    }, 20);
  };

  const stopAutoScroll = () => {
    clearInterval(intervalRef.current);
  };

  const handleScroll = (direction) => {
    if (sliderRef.current) {
      const scrollDistance = 200;
      sliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollDistance : scrollDistance,
        behavior: 'smooth',
      });
    }
  };

  const handleClickCategory = (categoryName) => {
    navigate(`/category/${encodeURIComponent(categoryName)}`);
  };
  

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleScroll('right'),
    onSwipedRight: () => handleScroll('left'),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  return (
    <div className="relative w-full flex justify-center py-1 bg-gray-100">
      <button
        onClick={() => handleScroll('left')}
      >
        &#8592;
      </button>

      <div
        {...swipeHandlers}
        ref={sliderRef}
        className="flex overflow-x-auto space-x-6 px-2 py-2 hide-scrollbar"
        onMouseEnter={stopAutoScroll}
        onMouseLeave={startAutoScroll}
        style={{ scrollBehavior: 'smooth', maxWidth: '90%' }}
      >
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[120px] h-[140px] rounded-lg p-2 flex flex-col items-center animate-pulse"
              >
                <div className="w-20 h-20 bg-gray-300 rounded-full mb-2" />
                <div className="w-16 h-4 bg-gray-300 rounded" />
              </div>
            ))
          : [...categories, ...categories].map((category, index) => {
              const isActive =
                category.name.toLowerCase() === activeCategory?.toLowerCase();
              return (
                <motion.div
                  key={`${category.name}-${index}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleClickCategory(category.name)}
                  className={`min-w-[120px] flex-shrink-0 cursor-pointer rounded-lg transition-all border ${
                    isActive ? 'border-blue-600' : 'border-transparent'
                  } p-3 flex flex-col items-center`}
                >
                  <img
                    src={`http://localhost:8005${category.category_image}`}
                    alt={category.name}
                    loading="lazy"
                    placeholder="blur"
                    className="w-20 h-20 object-cover rounded-full mb-2"
                  />
                  <p className="text-sm font-medium text-gray-800 text-center truncate w-full">
                    {category.name}
                  </p>
                </motion.div>
              );
            })}
      </div>

      {/* Right Arrow */}
      <button
        onClick={() => handleScroll('right')}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10 hover:bg-gray-200"
      >
        &#8594;
      </button>
    </div>
  );
};

export default CarouselShop;
