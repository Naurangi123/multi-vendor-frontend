import { Route, Routes, Navigate } from 'react-router-dom';
import { useContext, useState, lazy, Suspense } from 'react';
import { UserContext } from './context/UserContext.jsx';
import AdminSellerProfile from './pages/AdminProfile.jsx';
import Return from './pages/Return.jsx';
import Inventory from './components/SellerComponent/Inventory.jsx';
import OrderList from './components/OrderList.jsx';
import ReturnComponent from './components/SellerComponent/OrderReturn.jsx';
import RefundComponent from './components/SellerComponent/OrderRefund.jsx';
import OrderManagement from './components/SellerComponent/OrderManage.jsx';
import SellerOrderTracking from './components/SellerComponent/OrderTrack.jsx';
import SalesDashboard from './components/SellerComponent/SalesDashboard.jsx';
import WalletDashboard from './components/SellerComponent/WithDrawDashboard.jsx';

// Lazy-loaded core components
const Sidebar = lazy(() => import('./components/Sidebar'));
const Navbar = lazy(() => import('./pages/Navbar.jsx'));

// Lazy-loaded auth
const Login = lazy(() => import('./components/Auth/Login'));
const Register = lazy(() => import('./components/Auth/Register'));
const ForgotPassword = lazy(() => import('./components/Auth/ForgotPassword.jsx'));

// Lazy-loaded pages and components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const DashboardHome = lazy(() => import('./pages/DashboardHome.jsx'));
const Employees = lazy(() => import('./pages/Employee'));
const Settings = lazy(() => import('./pages/Settings'));
const UpdateProfile = lazy(() => import('./pages/ProfileUpdate.jsx'));
const Analytics = lazy(() => import('./pages/Analytics'));
const SellerAnalytic = lazy(() => import('./pages/SellerAnalytic'));
const AllSellerAnalytic = lazy(() => import('./pages/AllSellerAnalytic'));
const ProductAnalytics = lazy(() => import('./components/ProductRanking'));
const CreateProduct = lazy(() => import('./components/AddProduct'));
const UpdateProduct = lazy(() => import('./components/UpdateProduct'));
const ManageProductsPage = lazy(() => import('./components/ManageProducts'));
const ProductListing = lazy(() => import('./components/ProductList'));
const ProductDetails = lazy(() => import('./components/ProductDetails'));
const VendorProfile = lazy(() => import('./components/VendorProfile'));
const VendorHomeCard = lazy(() => import('./Elements/VendorHomeCard.jsx'));
const HomePage = lazy(() => import('./pages/HomePage'));
const Shop = lazy(() => import('./pages/Shop.jsx'));
const Viewcategory = lazy(() => import('./pages/Viewcategory.jsx'));
const ProductC = lazy(() => import('./components/ProductC'));
const PaymentPage = lazy(() => import('./components/Payment'));
const OrderTracking = lazy(() => import('./components/OrderTracking'));
const CustomerProfile = lazy(() => import('./pages/CustomerProfile.jsx'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailPage.jsx'));
const ResigterSeller = lazy(() => import('./Elements/ResigterSeller.jsx'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Checkout = lazy(() => import('./components/CheckOut.jsx'));
const CheckOutBuyNow = lazy(() => import('./pages/CheckOutForBuyNow.jsx'));
const ThankYou = lazy(() => import('./pages/ThankYou.jsx'));
const Wishlist = lazy(() => import('./pages/WishlistPage.jsx'));
const Footer = lazy(() => import('./pages/Footer.jsx'));

const App = () => {
  const { role } = useContext(UserContext);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const showSidebar = role === 'super_admin' || role === 'seller';
  const showNavbar = !role || role === 'customer';


  return (
    <div className="flex h-screen overflow-hidden">
      {showSidebar && <Sidebar isCollapsed={isCollapsed} toggleCollapse={toggleCollapse} />}
      <div className="flex-1 flex flex-col overflow-hidden">
        {showNavbar && <Navbar />}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-2">
          <Suspense fallback={<div className="text-center p-8">Loading...</div>}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route
                path="/" element={showNavbar ? <HomePage /> : role === 'seller' ? <DashboardHome /> : role === 'super_admin' ? <Dashboard /> :
                  <Navigate to="/login" />
                }
              />
              <Route path="/shop" element={<Shop />} />
              <Route path="/category/:category" element={<Viewcategory />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/productCart" element={<ProductC />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/thank-you" element={<ThankYou />} />
              <Route path="/product/:id" element={<ProductDetailsPage />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/employees/new" element={<Employees />} />
              <Route path="/seller-analytics" element={<SellerAnalytic />} />
              <Route path="/sellers-analytics" element={<AllSellerAnalytic />} />
              <Route path='/seller/inventory' element={<Inventory/>}/>
              <Route path='/seller/orders' element={<OrderList/>}/>
              <Route path='/seller/order-manage' element={<OrderManagement/>}/>
              <Route path='/seller/order-track' element={<OrderTracking/>}/>
              <Route path='/seller/returns' element={<ReturnComponent/>}/>
              <Route path='/seller/refunds' element={<RefundComponent/>}/>
              <Route path='/seller/sales' element={<SalesDashboard/>}/>
              <Route path='/seller/payments' element={<WalletDashboard/>}/>
              <Route path="/analytics" element={<Analytics />} /> 
              <Route path="/analytic" element={<ProductAnalytics />} />
              <Route path="/products/create" element={<CreateProduct />} />
              <Route path="/products/edit/:id" element={<UpdateProduct />} />
              <Route path="/products/manage-product" element={<ManageProductsPage />} />
              <Route path="/products" element={<ProductListing />} />
              <Route path="/profile" element={<VendorProfile />} />
              <Route path="/vendor_profile" element={<VendorHomeCard />} />
              <Route path="/admin_profile" element={<AdminSellerProfile />} />
              <Route path="/customer_profile" element={<CustomerProfile />} />
              <Route path="/order-track" element={<OrderTracking />} />
              <Route path="/resigterseller" element={<ResigterSeller />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/checkoutbuy" element={<CheckOutBuyNow />} />
              <Route path='/return' element={<Return />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            {role !== 'seller' && role!=='super_admin' && <Footer />}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default App;
