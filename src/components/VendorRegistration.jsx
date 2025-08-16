// src/components/VendorRegistration.js
import React, { useState } from "react";
import axios from "axios";

const VendorRegistration = () => {
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vendorData = { storeName, description, contactInfo };
    try {
      const response = await axios.post("http://localhost:8000/api/vendor/register/", vendorData);
      console.log("Vendor registered successfully", response);
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 space-y-4 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700">Vendor Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Store Name"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
          />
          <textarea
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Contact Info"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Register Vendor
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorRegistration;
