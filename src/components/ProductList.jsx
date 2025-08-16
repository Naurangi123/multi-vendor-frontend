import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProduct } from '../services/apiServices';
import { toast } from 'react-toastify';
const ProductListing = () => {
  const navigate=useNavigate()
  const [products,setProducts]=useState([])


  const fetchProducts=async()=>{
    try {
      const data=await getProduct();
      setProducts(data)
    } catch (error) {
      toast.error("Something Went Error",error)
    }
  }
    
  useEffect(()=>{
    fetchProducts()
  },[])

  const productDetail = (id) => {
    if (!id) {
      toast.error("Invalid ID passed to menuDetail: " + id);
      return;
    }
    navigate(`/product-detail/${id}`);
  };

  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.isArray(products) && products.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-lg shadow-md hover:shadow-lg transition duration-300"
          >
            <img
              src={product.image}
              alt={product.name}
              loading='lazy'
              placeholder="blur"
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4" onClick={(e) => {
                    e.stopPropagation();
                    productDetail(product.id);
                  }}>
              <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
              <p className="text-sm text-gray-500 truncate">{product.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-xl font-bold text-gray-900">₹{product.price}</span>
                <button className="bg-gray-500 text-white py-2 px-4 border border-black rounded-lg hover:bg-green-600 hover:text-black transition duration-200">
                  Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    </>

  );

};

export default ProductListing;
