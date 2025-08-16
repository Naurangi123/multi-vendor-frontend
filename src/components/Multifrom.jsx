import React, { useState } from 'react';

const Multifrom = () => {
    i 
      const [addresses, setAddresses] = useState([
        {
          address: '',
          city: '',
          state: '',
          zipCode: '',
          country: '',
          phoneNumber: '',
        },
      ]);
    
      const handleInputChange = (index, e) => {
        const { name, value } = e.target;
        const updatedAddresses = [...addresses];
        updatedAddresses[index][name] = value;
        setAddresses(updatedAddresses);
      };
    
      const handleAddAddress = () => {
        setAddresses([
          ...addresses,
          {
            address: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
            phoneNumber: '',
          },
        ]);
      };
    
      const handleRemoveAddress = (index) => {
        const updatedAddresses = addresses.filter((_, i) => i !== index);
        setAddresses(updatedAddresses);
      };
    
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', addresses);
        // Backend API call can be made here
      };
    
      return (
        <form onSubmit={handleSubmit}>
          <h2>Dynamic Address Form</h2>
          {addresses.map((address, index) => (
            <div key={index} className="address-form">
              <input
                type="text"
                name="address"
                value={address.address}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Address"
              />
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="City"
              />
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="State"
              />
              <input
                type="text"
                name="zipCode"
                value={address.zipCode}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Zip Code"
              />
              <input
                type="text"
                name="country"
                value={address.country}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Country"
              />
              <input
                type="text"
                name="phoneNumber"
                value={address.phoneNumber}
                onChange={(e) => handleInputChange(index, e)}
                placeholder="Phone Number"
              />
              {addresses.length > 1 && (
                <button type="button" onClick={() => handleRemoveAddress(index)}>
                  Remove Address
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddAddress}>
            Add Another Address
          </button>
          <button type="submit">Submit</button>
        </form>
      );
    };
    
    
    

export default  Multifrom;
