import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import { underPrice } from '../services/apiServices';
import { toast } from 'react-toastify';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: false,
  slidesToShow: 4,
  slidesToScroll: 1,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 768, settings: { slidesToShow: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1 } },
  ],
};

const ProductCard = ({ product, linkType = 'product' }) => {
  const isProduct = linkType === 'product';

  const path = isProduct
    ? `/product/${product.id}`
    : `/category/${product.category?.id || product.id}`;

  return (
    <div className="p-2 group">
      <Link to={path}>
        <div className="relative rounded-lg shadow-sm hover:shadow-lg transition bg-gray-200 overflow-hidden h-52">
          <div
            className="h-full w-full bg-contain bg-no-repeat bg-center"
            style={{
              backgroundImage: `url(http://localhost:8005${product.images?.[0]?.image || ''})`,
            }}
          >
            <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
              {product.brand || 'NL'}
            </div>

            {product.price && isProduct && (
              <div className="absolute bottom-2 left-2 bg-green-500 text-gray-800 text-xs px-2 py-1 rounded shadow">
                ₹{product.price}
              </div>
            )}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-transparent bg-opacity-80 px-2 py-1 text-center">
            <h3 className="font-medium text-sm truncate">
              {product.name?.substring(0, 10)}...
            </h3>
          </div>
        </div>
      </Link>
    </div>
  );
};

const GridSection = ({ title, products, linkType }) => (
  <div className="my-8">
    <h2 className="text-xl font-bold mb-4">{title}</h2>
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} linkType={linkType} />
      ))}
    </div>
  </div>
);

const EcommerceShowcase = () => {
  const [data, setData] = useState({
    under499: [],
    beauty: [],
    home: [],
    wellness: [],
    medical: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const fetchedData = await underPrice();
      setData(fetchedData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="p-10 text-center">Loading products...</div>;

  return (
    <div className="min-h-screen mx-auto p-6 bg-gray-300">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Deals Under ₹499</h2>
        <Slider {...sliderSettings}>
          {data.under499.map((product) => (
            <ProductCard key={product.id} product={product} linkType="product" />
          ))}
        </Slider>
      </div>

      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Beauty Products & More</h2>
        <Slider {...sliderSettings}>
          {data.beauty.map((product) => (
            <ProductCard key={product.id} product={product} linkType="category" />
          ))}
        </Slider>
      </div>

      <GridSection title="Home & Furnishing" products={data.home} linkType="category" />
      <GridSection title="Beauty & Wellness" products={data.wellness} linkType="category" />
      <GridSection title="Medicines & More" products={data.medical} linkType="category" />

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-inner">
        <div className="flex justify-around text-sm text-gray-700 p-3">
          <div className="flex flex-col items-center">
            <i className="fas fa-home"></i>
            <span>Home</span>
          </div>
          <div className="flex flex-col items-center">
            <i className="fas fa-th-large"></i>
            <span>Categories</span>
          </div>
          <div className="flex flex-col items-center">
            <i className="fas fa-bell"></i>
            <span>Alerts</span>
          </div>
          <div className="flex flex-col items-center">
            <i className="fas fa-user"></i>
            <span>Account</span>
          </div>
          <div className="flex flex-col items-center">
            <i className="fas fa-shopping-cart"></i>
            <span>Cart</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EcommerceShowcase;
