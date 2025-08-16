import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Pagination from './Pagination';
import Features from './Features'
import { getCategories } from '../services/apiServices';

const HomePage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-yellow-200 to-yellow-400 text-center py-20 px-4">
        <h3 className="text-xl text-gray-800 font-medium mb-2 font-[outfit]">Just for you</h3>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 font-[outfit]">Online Shopping</h1>
        <p className="text-lg text-gray-700 mb-6 font-[outfit]">Free Pickup and Delivery Available</p>
        <button onClick={()=>navigate('/shop')} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">Shop now</button>
      </div>
      <div className="py-12 px-4 md:px-10 bg-white">
        <h1 className="text-3xl md:text-4xl font-[outfit] font-bold text-center text-gray-900 mb-10">
          Popular Categories
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className="cursor-pointer border border-gray-100 rounded-ms shadow-sm hover:shadow-md transition bg-white p-2 text-center"
            >
              <img
                src={`http://localhost:8005${category.category_image}`}
                alt={category.name}
                className="w-full h-28 object-contain mx-auto mb-2 transform duration-300 hover:scale-105"
              />
              <span className="text-sm font-medium font-[outfit] text-gray-800">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      <hr className="my-8 border-gray-300" />
      {/* <Pagination /> */}
      <Features/>
    </>
  );
};

export default HomePage;
