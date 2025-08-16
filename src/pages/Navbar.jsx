import React, { useState, useContext, useRef, useEffect } from "react";
import { FcBusinessman } from "react-icons/fc";
import { FaHeart } from "react-icons/fa";
import { IoBagOutline } from "react-icons/io5";
import { HiMenu, HiX } from "react-icons/hi"; 
import { logoutUser } from "../services/apiServices";
import { useNavigate } from "react-router-dom";
import { UserContext } from '../context/UserContext';

const RoleDisplayType = {
  CUSTOMER: "customer",
  SELLER: "seller",
  DEFAULT: "default", 
};

const Navbar = ({ roleDisplay = RoleDisplayType.DEFAULT }) => {
  const navigate = useNavigate();
  const { user, role, cartItemCount, loading } = useContext(UserContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null); 

  const handleLogout = async () => {
    const success = await logoutUser();
    if (success) {
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading) return <p>Loading user...</p>;

  const getTitleSuffix = () => {
    switch (roleDisplay) {
      case RoleDisplayType.SELLER:
        return role === 'seller' ? 'Seller' : '.Com';
      case RoleDisplayType.CUSTOMER:
        return role === 'customer' ? 'Customer' : '.Com';
      case RoleDisplayType.DEFAULT:
      default:
        return role === 'seller' ? 'Seller' : '.Com';
    }
  };

  return (
    <>
      <nav className="w-full bg-[#FBFBFB] shadow-md px-4 py-3 flex items-center justify-between gap-4 relative">
        <div onClick={() => navigate('/')} className="text-2xl font-bold text-gray-800 cursor-pointer">
          <h2>
            Fatse<sup className="text-sm">{getTitleSuffix()}</sup>
          </h2>
        </div>

        <div className="sm:hidden flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-2xl text-gray-700 focus:outline-none"
          >
            {isMobileMenuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>
        <div className="hidden sm:block w-full sm:w-1/2 md:w-1/3">
          <input
            type="search"
            placeholder="Search Here"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="hidden sm:flex relative items-center">
          <ul className="flex items-center gap-3 text-gray-700">
            <li onClick={() => navigate("/wishlist")} className="cursor-pointer hover:text-blue-600 text-xl">
              <FaHeart />
            </li>
            {role === 'customer' && (
              <li onClick={() => navigate("/ProductCart")} className="relative cursor-pointer text-xl">
                <IoBagOutline />
                <sup className="absolute -top-2 -right-2 w-5 h-5 bg-green-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </sup>
              </li>
            )}
            <li className="nav-item relative" ref={dropdownRef}>
              <a
                href="#"
                className="nav-link flex items-center gap-1"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <FcBusinessman className="text-xl" />
                Hi, {user?.username}
              </a>
              {isDropdownOpen && user ? (
                <ul className="dropdown-menu absolute right-0 mt-2 bg-white border rounded shadow-lg py-2 w-40 z-50">
                  {role === 'customer' ? (
                    <li
                      onClick={() => { navigate('/customer_profile'); setIsDropdownOpen(false); }}
                      className="dropdown-item px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Profile
                    </li>
                  ) : (
                    <li
                      onClick={() => { navigate('/profile'); setIsDropdownOpen(false); }}
                      className="dropdown-item px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      Profile
                    </li>
                  )}
                  <li className="dropdown-item px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    Settings
                  </li>
                  <li
                    className="dropdown-item px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              ) : (
                isDropdownOpen && (
                  <ul className="dropdown-menu absolute right-0 mt-2 bg-white border rounded shadow-lg py-2 w-40 z-50">
                    <li
                      className="dropdown-item px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => { navigate("/login"); setIsDropdownOpen(false); }}
                    >
                      Login
                    </li>
                  </ul>
                )
              )}
            </li>
          </ul>
        </div>
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="sm:hidden absolute top-full left-0 w-full bg-[#fffefe] shadow-lg py-4 z-40 flex flex-col items-center gap-4 animate-slide-down"
          >
             <div className="w-full px-4">
              <input
                type="search"
                placeholder="Search Here"
                className="w-full px-4 py-2 font-[outfit] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <ul className="flex flex-col items-center gap-4 text-gray-700 w-full">
              <li
                onClick={() => { navigate("/wishlist"); setIsMobileMenuOpen(false); }}
                className="cursor-pointer hover:text-blue-600 text-xl flex items-center gap-2 w-full text-center justify-center py-2"
              >
                <FaHeart /> Wishlist
              </li>
              {role === 'customer' && (
                <li
                  onClick={() => { navigate("/ProductCart"); setIsMobileMenuOpen(false); }}
                  className="relative cursor-pointer text-xl flex items-center gap-2 w-full text-center justify-center py-2"
                >
                  <IoBagOutline /> Cart
                  <sup className="ml-1 w-5 h-5 bg-green-600 text-white text-xs font-semibold rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </sup>
                </li>
              )}
              <li className="relative w-full text-center">
                <a
                  href="#"
                  className="nav-link flex items-center gap-1 justify-center"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <FcBusinessman className="text-xl" />
                  Hi, {user?.username}
                </a>
                {isDropdownOpen && user ? (
                  <ul className="mt-2 bg-white border rounded shadow-lg py-2 w-3/4 mx-auto text-base">
                    {role === 'customer' ? (
                      <li
                        onClick={() => { navigate('/customer_profile'); setIsMobileMenuOpen(false); setIsDropdownOpen(false); }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Profile
                      </li>
                    ) : (
                      <li
                        onClick={() => { navigate('/profile'); setIsMobileMenuOpen(false); setIsDropdownOpen(false); }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      >
                        Profile
                      </li>
                    )}
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Settings
                    </li>
                    <li
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    >
                      Logout
                    </li>
                  </ul>
                ) : (
                  isDropdownOpen && (
                    <ul className="mt-2 bg-white border rounded shadow-lg py-2 w-3/4 mx-auto text-base">
                      <li
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); setIsDropdownOpen(false); }}
                      >
                        Login
                      </li>
                    </ul>
                  )
                )}
              </li>
              {/* Additional mobile-specific navigation items if needed */}
              {role === 'customer' && (
                <>
                  <li
                    onClick={() => { navigate("/"); setIsMobileMenuOpen(false); }}
                    className="cursor-pointer font-[outfit] hover:text-blue-600 py-2 w-full text-center"
                  >
                    Home
                  </li>
                  <li
                    onClick={() => { navigate("/shop"); setIsMobileMenuOpen(false); }}
                    className="cursor-pointer hover:text-blue-600 py-2 w-full font-[outfit] text-center"
                  >
                    Shop
                  </li>
                  <li
                    onClick={() => { navigate("/order-track"); setIsMobileMenuOpen(false); }}
                    className="cursor-pointer font-[outfit] hover:text-blue-600 py-2 w-full text-center"
                  >
                    Order
                  </li>
                  <li
                    onClick={() => { navigate("/customer_profile"); setIsMobileMenuOpen(false); }}
                    className="cursor-pointer font-[outfit] hover:text-blue-600 py-2 w-full text-center"
                  >
                    Manage
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </nav>

      {/* Customer header navigation - Conditionally rendered only on non-mobile screens */}
      {role === 'customer' && (
        <header className="hidden sm:block w-full bg-[#E3F6FF] shadow-sm px-6 py-4">
          <ul className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm md:text-lg">
            <li
              onClick={() => navigate("/")}
              className="cursor-pointer hover:text-blue-600"
            >
              Home
            </li>
            <li
              onClick={() => navigate("/shop")}
              className="cursor-pointer hover:text-blue-600"
            >
              Shop
            </li>
            <li
              onClick={() => navigate("/order-track")}
              className="cursor-pointer hover:text-blue-600"
            >
              Order
            </li>
            <li
              onClick={() => navigate("/customer_profile")}
              className="cursor-pointer hover:text-blue-600"
            >
              Manage
            </li>
          </ul>
        </header>
      )}
    </>
  );
};

export default Navbar;