import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { ACCESS_TOKEN } from '../constants';
import {
  MdDashboard,
  MdApartment,
  MdPeople,
  MdBarChart,
  MdOutlineInventory,
  MdOutlineManageAccounts,
  MdPerson,
  MdOutlineAppRegistration,
  MdAdminPanelSettings 
} from 'react-icons/md';
import {
  FaPlusSquare,
  FaBoxOpen,
  FaTruckMoving,
  FaMoneyBillWave,
} from "react-icons/fa";
import { GiVendingMachine,GiReturnArrow } from "react-icons/gi";
import { IoIosLogIn } from "react-icons/io";
import { RiLogoutCircleRLine,RiRefundFill  } from "react-icons/ri";
import { AiFillProduct } from "react-icons/ai";
import { UserContext } from '../context/UserContext';
import { logoutUser } from '../services/apiServices';

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
  const { pathname } = useLocation();
  const { user, role, loading } = useContext(UserContext);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem(ACCESS_TOKEN));
  const navigate = useNavigate();

  const toggleDropdown = (name) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleLogout = async () => {
    await logoutUser();
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) return <p>Loading...</p>
  if (!user) return <p>User Not Found</p>

  let navLinks = [];

  if (!isAuthenticated) {
    navLinks = [
      { name: 'Home', path: '/', icon: <MdApartment size={20} /> },
      { name: 'Login', path: '/login', icon: <IoIosLogIn size={20} /> },
      { name: 'Register', path: '/register', icon: <MdOutlineAppRegistration size={20} /> },
    ];
  } else if (role === 'seller') {
    navLinks = [
      { name: 'Home', path: '/vendor_profile', icon: <MdApartment size={20} /> },
      { name: 'Account', path: '/profile', icon: <MdPerson size={20} /> },
      { name: 'Seller Analytics', path: '/seller-analytics', icon: <MdBarChart size={20} /> },
      { name: 'Add Product', path: '/products/create', icon: <FaPlusSquare size={20} /> },
      {
        name: 'Returns & Refunds',
        path: '#',
        icon: <GiReturnArrow size={20} />,
        children: [
          { name: "Return", icon: <GiReturnArrow size={20}/>, path: "/seller/returns" },
          { name: "Refund", icon: <RiRefundFill size={20} />, path: "/seller/refunds" },
        ],
      },
      { name: 'Manage Product', path: '/products/manage-product', icon: <MdOutlineManageAccounts size={20} /> },
      { name: 'Inventory', path: '/seller/inventory', icon: <MdOutlineInventory size={20} /> },
      { name: 'Orders', path: '/seller/orders', icon: <FaBoxOpen size={20} /> },
      { name: 'Order Manage', path: '/seller/order-manage', icon: <FaTruckMoving size={20} /> },
      { name: 'Sales Dashboard', path: '/seller/sales', icon: <FaTruckMoving size={20} /> },
      { name: 'Payments', path: '/seller/payments', icon: <FaMoneyBillWave size={20} /> },
    ];
  } else if (role === 'super_admin') {
    navLinks = [
      { name: 'Dashboard', path: '/', icon: <MdDashboard size={20} /> },
      { name: 'Admin Accounts', path: '/admin_profile', icon: <MdPerson size={20} /> },
      {
        name: 'Admin Accounts',
        path: '#',
        icon: <MdAdminPanelSettings size={20} />,
        children: [
          { name: 'Account', path: '/admin_profile' },
          { name: "Products", icon: "📦", path: "/admin/products" },
          { name: "Product Categories", icon: "🗂️", path: "/admin/categories" },
          { name: "Brands", icon: "🏷️", path: "/admin/brands" },
          { name: "Product Reviews", icon: "⭐", path: "/admin/reviews" },
          { name: "Inventory Management", icon: "📊", path: "/admin/inventory" },
          { name: "Orders", icon: "🧾", path: "/admin/orders" },
          { name: "Shipments", icon: "🚚", path: "/admin/shipments" },
          { name: "Payments", icon: "💳", path: "/admin/payments" },
          { name: "Vendor Payouts", icon: "💸", path: "/admin/payouts" },
          { name: "Transactions", icon: "📁", path: "/admin/transactions" },
          { name: "Taxes", icon: <MdOutlineInventory size={20} />, path: "/admin/taxes" },
        ],
      },
      
      {
        name: 'Employees',
        path: '#',
        icon: <MdPeople size={20} />,
        children: [
          { name: 'All Employees', path: '/employees' },
          { name: "Manage Users", icon: "👥", path: "/admin/users" },
          { name: "Roles & Permissions", icon: "🔐", path: "/admin/roles" },
        ],
      },

      {
        name: 'Analytics',
        path: '#',
        icon: <MdBarChart size={20} />,
        children: [
          { name: 'Sellers Analytics', path: '/sellers-analytics', icon: <MdBarChart size={20} /> },
          { name: 'Analytics', path: '/analytics', icon: <MdBarChart size={20} /> },
        ],
      },

      

      {
        name: 'Vendors',
        path: '#',
        icon: <GiVendingMachine size={20} />,
        children: [
          { name: "Vendors", icon: <MdBarChart size={20}/>, path: "/admin/vendors" },
          { name: "Vendor Applications", icon: <MdBarChart size={20}/>, path: "/admin/vendor-applications" },
          { name: "Vendor Categories", icon: "📂", path: "/admin/vendor-categories" },
        ],
      },

      {
        name: "Reports",
        path: "#",
        icon: "📊",
        children: [
          { name: "Sales Reports", path: "/admin/reports/sales" },
          { name: "User Reports", path: "/admin/reports/users" },
          { name: "Inventory Reports", path: "/admin/reports/inventory" },
        ],
      },

      { name: "Coupons", icon: "🏷️", path: "/admin/coupons" },
      { name: "Banners", icon: "🖼️", path: "/admin/banners" },
      { name: "Promotions", icon: "📢", path: "/admin/promotions" },
      { name: "Newsletter", icon: "📰", path: "/admin/newsletter" },
      { name: "Pages", icon: "📄", path: "/admin/pages" },
      { name: "Blog", icon: "✍️", path: "/admin/blog" },
      { name: "FAQs", icon: "❓", path: "/admin/faqs" },
      { name: "Support Tickets", icon: "🎫", path: "/admin/tickets" },
      { name: "Contact Messages", icon: "💬", path: "/admin/messages" },

      {
        name: "General Settings",
        path: "#",
        icon: "⚙️",
        children: [
          { name: "Main Settings", path: "/admin/settings" },
          { name: "Email Settings", icon: "📧", path: "/admin/settings/email" },
          { name: "Payment Gateways", icon: "💳", path: "/admin/settings/payment" },
          { name: "Shipping Settings", icon: "🚛", path: "/admin/settings/shipping" },
          { name: "Localization", icon: "🌐", path: "/admin/settings/localization" },
        ],
      },

      { name: "System Logs", icon: "🧾", path: "/admin/logs" },
      { name: "Backups", icon: "🗃️", path: "/admin/backups" },
      { name: "API Access", icon: "🔌", path: "/admin/api" },
    ];
  }

  return (
    <div className={`h-screen hide-scrollbar overflow-y-auto ${isCollapsed ? 'w-20' : 'w-64'} bg-inherit text-white flex-shrink-0 transition-all duration-300`}>
      <div className="flex justify-between items-center p-4 relative">
        {!isCollapsed && <h2 onClick={() => navigate('/')} className="text-xl text-black font-semibold">ACS Platform</h2>}
        <button onClick={toggleCollapse} className="text-xl text-black">
          {isCollapsed ? '→' : '←'}
        </button>
      </div>

      <ul className="space-y-1">
        {navLinks.map((link) => (
          <li key={link.name}>
            <div className="relative px-2">
              <Link
                to={link.path}
                onClick={() => link.children && toggleDropdown(link.name)}
                className={`flex items-center justify-between px-4 py-2 rounded-md dark:hover:bg-gray-700 ${pathname === link.path ? 'bg-green-600 text-white' : 'text-gray-900'}`}
              >
                <div className="flex items-center gap-3">
                  {link.icon}
                  {!isCollapsed && <span>{link.name}</span>}
                </div>
                {link.children && !isCollapsed && (
                  <span>{openDropdown === link.name ? '▲' : '▼'}</span>
                )}
              </Link>

              {link.children && openDropdown === link.name && !isCollapsed && (
                <ul className="pl-6 mt-1 space-y-1">
                  {link.children.map((child) => (
                    <li key={child.name}>
                      <Link
                        to={child.path}
                        className={`flex items-center gap-2 px-2 py-1 rounded-md text-sm dark:hover:bg-gray-600 ${pathname === child.path ? 'bg-green-500 text-white' : 'text-gray-500'}`}
                      >
                        {child.icon && <span>{child.icon}</span>}<span>{child.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        ))}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full pl-6 pr-4 py-2 hover:bg-red-100 hover:text-red-500 text-left"
        >
          <RiLogoutCircleRLine color="black" />
          {!isCollapsed && <span className="text-black">LogOut</span>}
        </button>
      </ul>
    </div>
  );
};

export default Sidebar;
