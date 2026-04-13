import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuth, selectUserRole } from '../store/authSlice'

import ScrollToTop from '../components/common/ScrollToTop'

// Layouts
import PublicLayout from '../components/common/PublicLayout'
import DashboardLayout from '../components/common/DashboardLayout'

// Public pages
import Landing        from '../pages/public/Landing'
import Features       from '../pages/public/Features'
import AboutUs        from '../pages/public/AboutUs'
import ProductListing from '../pages/public/ProductListing'
import ProductDetail  from '../pages/public/ProductDetail'
import VendorStore    from '../pages/public/VendorStore'
import Cart           from '../pages/public/Cart'
import Checkout       from '../pages/public/Checkout'
import CheckoutVerify from '../pages/public/CheckoutVerify'
import ContactUs      from '../pages/public/ContactUs'

// Auth pages
import Login    from '../pages/auth/Login'
import Register from '../pages/auth/Register'

// Shared pages
import Messages       from '../pages/shared/Messages'
import Notifications  from '../pages/shared/Notifications'
import Settings       from '../pages/shared/Settings'

// Buyer pages
import BuyerDashboard from '../pages/buyer/BuyerDashboard'
import MyOrders       from '../pages/buyer/MyOrders'
import OrderDetail    from '../pages/buyer/OrderDetail'
import Wishlist       from '../pages/buyer/Wishlist'

// Vendor pages
import VendorDashboard  from '../pages/vendor/VendorDashboard'
import MyProducts       from '../pages/vendor/MyProducts'
import AddProduct       from '../pages/vendor/AddProduct'
import EditProduct      from '../pages/vendor/EditProduct'
import VendorOrders     from '../pages/vendor/VendorOrders'
import VendorWallet     from '../pages/vendor/VendorWallet'
import VendorAnalytics  from '../pages/vendor/VendorAnalytics'
import MyStore          from '../pages/vendor/MyStore'

// Admin pages
import AdminDashboard from '../pages/admin/AdminDashboard'
import DisputeList    from '../pages/admin/DisputeList'
import DisputeDetail  from '../pages/admin/DisputeDetail'
import UserManagement from '../pages/admin/UserManagement'
import AdminVendors   from '../pages/admin/AdminVendors'
import AdminBuyers    from '../pages/admin/AdminBuyers'
import AdminWallet    from '../pages/admin/AdminWallet'

function ProtectedRoute({ children, roles }) {
  const isAuth = useSelector(selectIsAuth)
  const role   = useSelector(selectUserRole)
  if (!isAuth) return <Navigate to="/login" replace />
  if (roles && !roles.includes(role)) return <Navigate to="/" replace />
  return children
}

function AppRouter() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route element={<PublicLayout />}>
          <Route path="/"           element={<Landing />} />
          <Route path="/features"   element={<Features />} />
          <Route path="/about"      element={<AboutUs />} />
          <Route path="/contact"    element={<ContactUs />} />
          <Route path="/products"   element={<ProductListing />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/store/:slug" element={<VendorStore />} />
          <Route path="/cart"       element={<Cart />} />
          <Route path="/checkout"        element={<ProtectedRoute roles={['buyer']}><Checkout /></ProtectedRoute>} />
          <Route path="/checkout/verify" element={<ProtectedRoute roles={['buyer']}><CheckoutVerify /></ProtectedRoute>} />
        </Route>

        {/* Auth */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Buyer Dashboard */}
        <Route path="/buyer" element={<ProtectedRoute roles={['buyer']}><DashboardLayout role="buyer" /></ProtectedRoute>}>
          <Route index element={<BuyerDashboard />} />
          <Route path="orders"      element={<MyOrders />} />
          <Route path="orders/:id"  element={<OrderDetail />} />
          <Route path="wishlist"    element={<Wishlist />} />
          <Route path="messages"    element={<Messages />} />
          <Route path="notifs"      element={<Notifications />} />
          <Route path="settings"    element={<Settings />} />
        </Route>

        {/* Vendor Dashboard */}
        <Route path="/vendor" element={<ProtectedRoute roles={['vendor']}><DashboardLayout role="vendor" /></ProtectedRoute>}>
          <Route index element={<VendorDashboard />} />
          <Route path="products"          element={<MyProducts />} />
          <Route path="products/new"      element={<AddProduct />} />
          <Route path="products/:id/edit" element={<EditProduct />} />
          <Route path="orders"            element={<VendorOrders />} />
          <Route path="wallet"            element={<VendorWallet />} />
          <Route path="analytics"         element={<VendorAnalytics />} />
          <Route path="my-store"          element={<MyStore />} />
          <Route path="messages"          element={<Messages />} />
          <Route path="notifs"            element={<Notifications />} />
          <Route path="settings"          element={<Settings />} />
        </Route>

        {/* Admin Dashboard */}
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><DashboardLayout role="admin" /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="users"         element={<UserManagement />} />
          <Route path="vendors"       element={<AdminVendors />} />
          <Route path="buyers"        element={<AdminBuyers />} />
          <Route path="wallet"        element={<AdminWallet />} />
          <Route path="disputes"      element={<DisputeList />} />
          <Route path="disputes/:id"  element={<DisputeDetail />} />
          <Route path="notifs"        element={<Notifications />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
export default AppRouter;