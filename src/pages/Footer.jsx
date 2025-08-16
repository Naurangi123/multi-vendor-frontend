import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
 import { useNavigate } from 'react-router-dom';

const Footer = () => {
   const navigate = useNavigate();
  return (
    <footer className="bg-[#E3F6FF] text-black py-12">
      <div className="container mx-auto px-6">
        {/* Newsletter Subscription */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold mb-4 font-[outfit]">Subscribe to our newsletter</h2>
          <p className="mb-4 font-[outfit]">Stay updated with exclusive deals and promotions.</p>
          <form className="flex justify-center">
            <input
              type="email"
              placeholder="Your email"
              className="px-4 py-2 rounded-l-md text-gray-800"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-r-md hover:bg-blue-700"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-semibold mb-4 font-[outfit]">About Us</h3>
            <ul>
              <li onClick={()=> navigate('/login')}> Company /Seller Resigter</li>
              <li><a href="#" className="hover:underline font-[outfit]">Press</a></li>
              <li><a href="#" className="hover:underline font-[outfit]">Careers</a></li>
              <li><a href="#" className="hover:underline font-[outfit]">Blog</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 font-[outfit]">Customer Support</h3>
            <ul>
              <li><a href="#" className="hover:underline font-[outfit]">Help Center</a></li>
              <li><a href="#" className="hover:underline font-[outfit]">Track Your Order</a></li>
              <li><a href="#" className="hover:underline font-[outfit]">Shipping Information</a></li>
              <li onClick={()=> navigate('/Return')}>Return Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 font-[outfit]">Information</h3>
            <ul>
              <li><a href="#" className="hover:underline font-[outfit]">FAQs</a></li>
              <li><a href="#" className="hover:underline font-[outfit]">Contact Us</a></li>
              <li><a href="#" className="hover:underline font-[outfit]">Shops & Outlets</a></li>
              <li><a href="#" className="hover:underline font-[outfit]">Feedback</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4 font-[outfit]">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-600 hover:text-blue-800"><FaFacebook size={24} /></a>
              <a href="#" className="text-blue-400 hover:text-blue-600"><FaTwitter size={24} /></a>
              <a href="#" className="text-pink-600 hover:text-pink-800"><FaInstagram size={24} /></a>
              <a href="#" className="text-blue-700 hover:text-blue-900"><FaLinkedin size={24} /></a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center text-sm">
          <p className='font-[outfit]'>© 2025 Your Company Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
