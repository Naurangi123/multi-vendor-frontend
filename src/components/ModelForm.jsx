import React, { useState } from 'react';

const ModalForm = ({ user, onClose, onSubmit }) => {
  const [address, setAddress] = useState(user.address || '');
  const [city, setCity] = useState(user.city || '');
  const [state, setState] = useState(user.state || '');
  const [zipCode, setZipCode] = useState(user.zip_code || '');
  const [country, setCountry] = useState(user.country || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ address, city, state, zip_code: zipCode, country, phone_number: phoneNumber });
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-1/2">
        <h2 className="text-xl font-semibold mb-4">Enter Your Address</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium">Address</label>
            <input
              id='address'
              name='address'
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 p-2 border border-gray-300 w-full rounded"
            />
          </div>

          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium">City</label>
              <input
                type="text"
                id='city'
                name='city'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 p-2 border border-gray-300 w-full rounded"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium">State</label>
              <input
                id='state'
                name='state'
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="mt-1 p-2 border border-gray-300 w-full rounded"
              />
            </div>
          </div>

          <div className="mb-4 flex gap-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium">Zip Code</label>
              <input
                id='zip_code'
                name='zip_code'
                type="text"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                className="mt-1 p-2 border border-gray-300 w-full rounded"
              />
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium">Country</label>
              <input
                id='country'
                name='country'
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 p-2 border border-gray-300 w-full rounded"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium">Phone Number</label>
            <input
              id='phone_number'
              name='phone_number'
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 p-2 border border-gray-300 w-full rounded"
            />
          </div>

          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-black rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded">
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalForm;
