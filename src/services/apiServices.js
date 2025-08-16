/* eslint-disable no-unused-vars */
import { toast } from 'react-toastify';
import axiosInstance from './axiosInstances'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

const getData = async (url) => {
  try {
    const response = await axiosInstance.get(url);
    return response?.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const postData = async (url, data) => {
  try {
    const response = await axiosInstance.post(url, data);
    return response;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

const updateData = async (url, data) => {
  try {
    const response = await axiosInstance.patch(url, data);
    return response.data;
  } catch (error) {
    console.error('Error updating data:', error);
    throw error;
  }
};

const deleteData = async (url, config) => {
  try {
    const response = await axiosInstance.delete(url, config);
    return response.data;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};



export const submitSellerStore = async (data) => {
  try {
    const response = await updateData(`api/seller/`, data);
    return response;
  } catch (error) {
    console.log("something went wrong", error)
  }
}

// Example for fetching address
export const fetchUserAddresses = async () => {
  try {
    const response = await getData(`/api/shipping-addresses/`)
    return response;
  } catch (error) {
    console.log("Error", error)
    throw error
  }
};


export const underPrice = async () => {
  try {
    const response = await getData(`/api/under-price/`)
    return response;
  } catch (error) {
    console.log("Error", error)
    throw error
  }
};
// Optional: Save address
export const saveUserAddress = async (address) => {
  try {
    const response = await postData(`/api/shipping-addresses/`, address)
    return response;
  } catch (error) {
    console.log("Error", error)
    throw error
  }
};

export const doPayment = async (data) => {
  try {
    const response = await postData(`/api/payments/`, data)
    return response;
  } catch (error) {
    console.log("Error", error)
    throw error
  }
};


export const verifyPayment = async (data) => {
  try {
    const response = await postData(`/api/verify-payment/`, data)
    return response;
  } catch (error) {
    console.log("Error", error)
    throw error
  }
};

export const getOrders = async () => {
  try {
    const response = await getData(`/api/orders/`);
    return response;
  } catch (error) {
    console.error("API Error:", error);
    toast.error("Something went wrong while fetching user");
    console.log(error)
    throw error;
  }
}

export const getSellerOrders = async () => {
  try {
    const response = await getData(`/api/seller-orders/`);
    return response;
  } catch (error) {
    console.error("API Error:", error);
    toast.error("Something went wrong while fetching user");
    console.log(error)
    throw error;
  }
}

export const getVendors = async () => {
  try {
    const response = await getData(`/api/vendors/`);
    return response;
  } catch (error) {
    console.error("API Error:", error);
    toast.error("Something went wrong while fetching user");
  }
}

// Product functions
export const addProduct = async (productData) => {
  try {
    const response = await postData('/api/productslist/', productData);
    toast.success('Product added successfully');
    return response;
  } catch (error) {
    console.error('Error adding product:', error);
    toast.error('Failed to add product');
    throw error;
  }
};

export const addToCart = async (data) => {
  try {
    const response = await postData(`/api/carts/`, data);
    return response;
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getProducts = async () => {
  try {
    const response = await getData('/api/productslist/');
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    toast.error('Failed to fetch products');
    throw error;
  }
};

export const getProduct = async () => {
  try {
    const data = await getData('/api/products/');
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    toast.error('Failed to fetch products');
    throw error;
  }
};


export const getProductBySeller = async () => {
  try {
    const data = await getData('/api/vendors/');
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    toast.error('Failed to fetch products');
    throw error;
  }
};


export const fetchProducts = async (page, itemsPerPage) => {
  try {
    const response = await getData(`/api/products/?page=${page + 1}`);
    console.log("response",response)
    return response;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error; // Let caller decide how to handle error
  }
};



export const getCategories = async () => {
  try {
    const data = await getData('/api/categories/');
    return data;
  } catch (error) {
    console.error("API Error:", error);
    toast.error("Something went wrong while fetching user");
    throw error;
  }
};


export const getRelatedProducts = async (id) => {
  try {
    const response = await getData(`/api/products/${id}/related/`);
    return response;
  } catch (error) {
    console.log('Something went wrong')
    throw error
  }
};


export const deleteAddress = async (id) => {
  try {
    const response = await deleteData(`/api/shipping-addresses/${id}/`);
    return response;
  } catch (error) {
    console.log('Something went wrong')
    throw error
  }
};


export const fetchProductById = async (id) => {
  try {
    const response = await getData(`/api/products/${id}/`);
    return response;
  } catch (error) {
    console.log(error)
    throw error
  }
}
// Sales Data
export const getSalesData = async () => {
  try {
    const response = await getData(`/api/sales-summary/`);
    return response;
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getCategoryProduct = async () => {
  try {
    const response = await getData(`/api/category/`);
    return response;
  } catch (error) {
    console.error("API Error:", error);
    toast.error("Something went wrong while fetching user");
    throw error;
  }
};



export const getCart = async () => {
  try {
    const response = await getData(`/api/carts/`);
    return response;
  } catch (error) {
    console.error("API Error:", error);
    toast.error("Something went wrong while fetching user");
    throw error;
  }
};

import axios from 'axios';

async function onUserLogin() {
  const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
  if (guestCart.length > 0) {
    await axios.post('/api/merge-cart/', { guest_cart: guestCart });
    localStorage.removeItem('guest_cart');
  }
  // Reload user cart from backend if needed
}


export const getProductDetail = async (id) => {
  try {
    const response = await getData(`/api/products/${id}/`);
    return response;
  } catch (error) {
    console.error("API Error:", error);
    toast.error("Something went wrong while fetching user");
    throw error;
  }
};

export const updateCustomerProfile = async () => {
  try {
    const response = await getData(`/auth/user/update/`);
    return response;
  } catch (error) {
    console.error("API Error:", error);
    toast.error("Something went wrong while fetching Order");
    throw error;
  }
};

export const searchProduct = async (query) => {
  try {
    const response = await getData(`/api/search/?query=${query}`);
    return response;
  } catch (error) {
    console.error("API Error", error);
    toast.error("Something went wrong while fetching user");
    throw error;
  }
};


// services/apiServices.js

export const filterProducts = async (params) => {
  try {
    const queryString = params.toString();
    const response = await getData(`/api/filter-product/?${queryString}`);
    return response;
  } catch (error) {
    console.error('getProducts error:', error);
    throw error;
  }
};




export const getSellers = async () => {
  try {
    const response = await getData(`/api/admin/sellers/`);
    return response;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};


// export const filterProduct = async ({ searchQuery, category, minPrice, maxPrice, sortBy, currentPage }) => {
//   try {
//     const response = await getData(`/api/filter-product/`, {
//       params: {
//         query: searchQuery,
//         category,
//         minPrice,
//         maxPrice,
//         sortBy,
//         page: currentPage,
//         limit: 12,
//       },
//     });
//     return response;
//   } catch (error) {
//     console.log("Error",error);
//     throw error;
//   }
// };









export const analyticData = async () => {
  try {
    const response = await getData(`/api/sales-analytic/`);
    console.log("response", response)
    return response;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

export const getAllSellers = async () => {
  try {
    const response = await getData(`/api/admin/all-sellers/`);
    console.log("response", response)
    return response;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

export const getSellerById = async (id) => {
  try {
    const response = await getData(`/api/admin/sellers/${id}/`);
    return response;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

export const updateSeller = async (id, data) => {
  try {
    const response = await updateData(`/api/admin/sellers/${id}/`, data);
    return response;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};


export const updateProducts = async (id, data) => {
  try {
    const response = await updateData(`/api/products/${id}/`, data);
    console.log(response)
    return response;
  } catch (error) {
    console.log("Error", error);
    throw error;
  }
};

const registerData = async (url, data) => {
  try {
    const response = await postData(url, data);
    return response.data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const Signup = async (data) => {
  try {
    return await registerData(`/auth/register/`, data);
  } catch (error) {
    console.log("Signup error", error);
    throw error;
  }
};


export const Login = async (data) => {
  try {
    const response = await postData(`/auth/login/`, data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    toast.error("Invalid credentials!");
    throw error;
  }
};


export const tokenRefresh = async (data) => {
  try {
    return await postData(`/auth/token/refresh/`, data);
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    const refresh = sessionStorage.getItem('refreshToken');

    await postData('/auth/logout/', {
      refresh,
    });
    sessionStorage.removeItem(ACCESS_TOKEN);
    sessionStorage.removeItem(REFRESH_TOKEN);

    return true;
  } catch (error) {
    console.error('Logout failed', error);
    return false;
  }
};



// Current Location
export const getCurrentLocationDetails = async () => {
  try {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
      }

      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        const data = await response.json();

        const location = {
          city: data.address.city || data.address.town || data.address.village || 'Unknown City',
          country: data.address.country || 'Unknown Country',
        };

        resolve(location);
      }, (error) => {
        reject(error);
      });
    });
  } catch (err) {
    console.error('Error fetching location:', err);
    throw err;
  }
};
