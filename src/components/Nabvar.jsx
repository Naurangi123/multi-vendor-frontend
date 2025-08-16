import { Link,useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useUser';
import { ACCESS_TOKEN } from '../constants';
import { useState } from 'react';

const Navbar = () => {
  const { role, user } = useCurrentUser();
  const navigate=useNavigate()
  const [isAuthenticated,setIsAuthenticated]=useState(false)

  const handleLogout = () => {
      sessionStorage.removeItem(ACCESS_TOKEN);
      setIsAuthenticated(false);
      navigate('/login');
    };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-blue-600">
        MultiVendor
      </Link>

      <ul className="flex items-center space-x-6 text-gray-700 font-medium">
        {role === 'customer' && (
          <>
            <li><Link to="/products">Products</Link></li>
            <li><Link to="/cart">Cart</Link></li>
            <li><Link to="/profile">{user.username} Account </Link></li>
          </>
        )}

        {role === 'vendor' && (
          <>
            <li><Link to="/products/manage-product">Manage Products</Link></li>
            <li><Link to="/products/create">Add Product</Link></li>
            <li><Link to="/vendor-profile">Profile</Link></li>
          </>
        )}

        {role === 'super_admin' && (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/analytics">Analytics</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </>
        )}

        {!isAuthenticated && user ? (
          <li>
            <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
