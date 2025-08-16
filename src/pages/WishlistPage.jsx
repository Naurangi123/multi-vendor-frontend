import React from 'react';

const Wishlist = () => {
  const wishlistItems = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 99.99,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: 2,
      name: 'Smart Watch',
      price: 199.99,
      image: 'https://via.placeholder.com/100',
    },
    {
      id: 3,
      name: 'Bluetooth Speaker',
      price: 59.99,
      image: 'https://via.placeholder.com/100',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">My Wishlist</h2>
      <ul className="space-y-4">
        {wishlistItems.map((item) => (
          <li
            key={item.id}
            className="flex items-center bg-white border rounded-lg p-4 shadow-sm"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-md mr-4"
            />
            <div className="flex-1">
              <h3 className="text-lg font-medium">{item.name}</h3>
              <p className="text-gray-600">${item.price.toFixed(2)}</p>
            </div>
            <button className="text-sm text-red-500 font-semibold hover:underline" disabled>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Wishlist;
