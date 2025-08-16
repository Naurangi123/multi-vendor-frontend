import React from 'react';

const products = [
  {
    id: 1,
    name: 'Product A',
    category: 'Electronics',
    price: 299.99,
    rating: 4.5,
    sales: 120,
  },
  {
    id: 2,
    name: 'Product B',
    category: 'Electronics',
    price: 199.99,
    rating: 3.8,
    sales: 200,
  },
  {
    id: 3,
    name: 'Product C',
    category: 'Fashion',
    price: 49.99,
    rating: 4.7,
    sales: 150,
  },
  {
    id: 4,
    name: 'Product D',
    category: 'Fashion',
    price: 79.99,
    rating: 4.2,
    sales: 180,
  },
  {
    id: 5,
    name: 'Product E',
    category: 'Home',
    price: 29.99,
    rating: 4.0,
    sales: 90,
  },
  {
    id: 6,
    name: 'Product F',
    category: 'Home',
    price: 129.99,
    rating: 4.8,
    sales: 220,
  },
];

const getCategoryDetails = () => {
  const categories = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = {
        count: 0,
        highestPriceProduct: product,
        lowestPriceProduct: product,
        totalSales: 0,
        highestRating: product.rating,
        lowestRating: product.rating,
      };
    }
    acc[product.category].count += 1;
    acc[product.category].totalSales += product.sales;
    if (product.price > acc[product.category].highestPriceProduct.price) {
      acc[product.category].highestPriceProduct = product;
    }
    if (product.price < acc[product.category].lowestPriceProduct.price) {
      acc[product.category].lowestPriceProduct = product;
    }
    if (product.rating > acc[product.category].highestRating) {
      acc[product.category].highestRating = product.rating;
    }
    if (product.rating < acc[product.category].lowestRating) {
      acc[product.category].lowestRating = product.rating;
    }
    return acc;
  }, {});

  return categories;
};

const ProductAnalytics = () => {
  const categoryDetails = getCategoryDetails();

  return (
    <div className="space-y-8 p-8 bg-gradient-to-r from-indigo-50 via-gray-100 to-indigo-50 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-gray-800">Product Analytics</h2>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2">Products by Category</h3>
        <div className="space-y-6 mt-6">
          {Object.keys(categoryDetails).map((category) => {
            const categoryData = categoryDetails[category];
            const productsInCategory = products.filter((product) => product.category === category);

            return (
              <div key={category} className="space-y-4 bg-gradient-to-r from-blue-50 via-purple-50 to-blue-50 p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold text-gray-800">{category} ({categoryData.count} products)</h4>

                <div className="space-y-2 mt-2">
                  {productsInCategory.map((product) => (
                    <div key={product.id} className="flex justify-between text-sm text-gray-600">
                      <span>{product.name}</span>
                      <span>₹{product.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 mt-4 bg-gradient-to-r from-teal-50 via-green-50 to-teal-50 p-4 rounded-md">
                  <p><strong>Highest Price:</strong> {categoryData.highestPriceProduct.name} - ₹{categoryData.highestPriceProduct.price}</p>
                  <p><strong>Lowest Price:</strong> {categoryData.lowestPriceProduct.name} - ₹{categoryData.lowestPriceProduct.price}</p>
                  <p><strong>Highest Rating:</strong> {categoryData.highestRating} (Product: {categoryData.highestPriceProduct.name})</p>
                  <p><strong>Lowest Rating:</strong> {categoryData.lowestRating} (Product: {categoryData.lowestPriceProduct.name})</p>
                  <p><strong>Total Sales:</strong> {categoryData.totalSales}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-2 mt-8">Top Products by Rating, Sales, and Price</h3>

        <div className="mt-4 bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-800">Top Rated Products</h4>
          <div className="space-y-2">
            {products
              .sort((a, b) => b.rating - a.rating)
              .map((product) => (
                <div key={product.id} className="flex justify-between text-sm text-gray-600">
                  <span>{product.name}</span>
                  <span>{product.rating} stars</span>
                </div>
              ))}
          </div>
        </div>
        <div className="mt-4 bg-gradient-to-r from-red-50 via-pink-50 to-red-50 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-800">Top Selling Products</h4>
          <div className="space-y-2">
            {products
              .sort((a, b) => b.sales - a.sales)
              .map((product) => (
                <div key={product.id} className="flex justify-between text-sm text-gray-600">
                  <span>{product.name}</span>
                  <span>{product.sales} sales</span>
                </div>
              ))}
          </div>
        </div>

        {/* By Price */}
        <div className="mt-4 bg-gradient-to-r from-green-50 via-teal-50 to-green-50 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold text-gray-800">Most Expensive Products</h4>
          <div className="space-y-2">
            {products
              .sort((a, b) => b.price - a.price)
              .map((product) => (
                <div key={product.id} className="flex justify-between text-sm text-gray-600">
                  <span>{product.name}</span>
                  <span>₹{product.price.toFixed(2)}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAnalytics;
