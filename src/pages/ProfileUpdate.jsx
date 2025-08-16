import React, { useState } from 'react';

// Sample user data (this could be fetched from an API)
const sampleUserData = {
  name: 'John Doe',
  email: 'johndoe@example.com',
  role: 'vendor',  // Can be 'vendor' or 'customer'
  shopName: 'John\'s Shop',
  shopDescription: 'A variety of products for everyone.',
  phone: '123-456-7890',
  address: '123 Main St, City, Country',
};

const ProfileUpdate = () => {
  const [userData, setUserData] = useState(sampleUserData);
  const [isSaving, setIsSaving] = useState(false);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);

    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      alert('Profile updated successfully!');
    }, 1000);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Update Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Profile Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
          />
        </div>

        {/* Conditional Fields for Vendor Role */}
        {userData.role === 'vendor' && (
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="shopName">
              Shop Name
            </label>
            <input
              type="text"
              id="shopName"
              name="shopName"
              value={userData.shopName}
              onChange={handleInputChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
            />
          </div>
        )}
        {userData.role === 'vendor' && (
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="shopDescription">
              Shop Description
            </label>
            <textarea
              id="shopDescription"
              name="shopDescription"
              value={userData.shopDescription}
              onChange={handleInputChange}
              className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
              rows="4"
            />
          </div>
        )}

        {/* Common Fields */}
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="phone">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={userData.phone}
            onChange={handleInputChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700" htmlFor="address">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={userData.address}
            onChange={handleInputChange}
            className="mt-2 p-3 border border-gray-300 rounded-lg w-full"
          />
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className={`mt-4 py-2 px-6 rounded-lg text-white ${isSaving ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileUpdate;
