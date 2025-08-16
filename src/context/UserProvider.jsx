import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ACCESS_TOKEN } from '../constants';
import { UserContext } from './UserContext';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [cart, setCart] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    const fetchUserAndCart = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const userRes = await axios.get('http://localhost:8000/auth/users/', { headers });
        const userData = userRes.data?.user || userRes.data;

        setUser(userData);
        const extractedRole = userData?.role;
        setRole(extractedRole);


        if (extractedRole === 'customer') {
          const cartRes = await axios.get('http://localhost:8005/api/carts/', { headers });
          const cartData = cartRes.data;

          setCart(cartData);

          const count = cartData.length||0;
          setCartItemCount(count);
        } else {
          setCart(null);
          setCartItemCount(0);
        }

      } catch (error) {
        console.error('Failed to fetch user/cart:', error);
        setUser(null);
        setRole(null);
        setCart(null);
        setCartItemCount(0);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUserAndCart();
    } else {
      setLoading(false);
    }
  }, [token]);


  return (
    <UserContext.Provider value={{ user, role, cart, cartItemCount, loading }}>
      {children}
    </UserContext.Provider>
  );
};
