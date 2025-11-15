import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./Components/layouts/Header";
import Login from "./Components/user/Login";
import Register from "./Components/user/Register";
import Profile from "./Components/user/Profile";
import UpdateProfile from "./Components/user/UpdateProfile";
import ForgotPassword from "./Components/user/ForgotPassword";
import ResetPassword from "./Components/user/ResetPassword";
import Home from "./Components/user/Home";
import Cart from "./Components/user/Cart";
import OrderHistory from "./Components/user/OrderHistory";
import Review from "./Components/user/Review";
import CheckoutConfirmation from "./Components/user/CheckoutConfirmation";
import AdminDashboard from "./Components/admin/AdminDashboard";
import AdminRoutes from "./Components/admin/AdminRoutes";
import AdminLayout from "./Components/layouts/AdminLayout";
import { getUser } from "./Components/utils/helper";

// Product Management
import ProductList from "./Components/admin/productmanagement/ProductList";
import CreateProduct from "./Components/admin/productmanagement/CreateProduct";
import UpdateProduct from "./Components/admin/productmanagement/UpdateProduct";
import ViewProduct from "./Components/admin/productmanagement/ViewProduct";

// Supplier Management
import SupplierList from "./Components/admin/suppliermanagement/SupplierList";
import CreateSupplier from "./Components/admin/suppliermanagement/CreateSupplier";
import UpdateSupplier from "./Components/admin/suppliermanagement/UpdateSupplier";
import ViewSupplier from "./Components/admin/suppliermanagement/ViewSupplier";

// User Management
import UserList from "./Components/admin/usermanagement/UserList";
import CreateUser from "./Components/admin/usermanagement/CreateUser";
import ViewUser from "./Components/admin/usermanagement/ViewUser";

// Order Management
import OrderList from "./Components/admin/ordermanagement/OrderList";
import ViewOrder from "./Components/admin/ordermanagement/ViewOrder";

// Review Management (NEW)
import ReviewList from "./Components/admin/reviewmanagement/ReviewList";

// Layout component that includes the header (for user routes)
const Layout = ({ children }) => {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
};

// Layout component for admin routes with sidebar
const AdminLayoutWrapper = ({ children }) => {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
};

const App = () => {
  const token = localStorage.getItem("token");
  const user = getUser();

  const getDefaultRoute = () => {
    if (!token) return "/login";
    if (user && user.role === "admin") return "/admin/dashboard";
    return "/home";
  };

  return (
    <Router>
      <Routes>
        {/* Default Route */}
        <Route path="/" element={<Navigate to={getDefaultRoute()} />} />

        {/* Public Routes (without header) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* User Protected Routes (with header) */}
        <Route path="/home" element={token ? <Layout><Home /></Layout> : <Navigate to="/login" />} />
        <Route path="/products" element={token ? <Layout><Home /></Layout> : <Navigate to="/login" />} />
        <Route path="/profile" element={token ? <Layout><Profile /></Layout> : <Navigate to="/login" />} />
        <Route path="/update-profile" element={token ? <Layout><UpdateProfile /></Layout> : <Navigate to="/login" />} />
        <Route path="/cart" element={token ? <Layout><Cart /></Layout> : <Navigate to="/login" />} />
        <Route path="/checkout-confirmation" element={token ? <Layout><CheckoutConfirmation /></Layout> : <Navigate to="/login" />} />
        <Route path="/order-history" element={token ? <Layout><OrderHistory /></Layout> : <Navigate to="/login" />} /> 
        <Route path="/review/:productId" element={token ? <Layout><Review /></Layout> : <Navigate to="/login" />} />

        {/* Admin Routes (with sidebar) */}
        <Route path="/admin/dashboard" element={<AdminRoutes><AdminLayoutWrapper><AdminDashboard /></AdminLayoutWrapper></AdminRoutes>} />

        {/* Product Management */}
        <Route path="/admin/products" element={<AdminRoutes><AdminLayoutWrapper><ProductList /></AdminLayoutWrapper></AdminRoutes>} />
        <Route path="/admin/products/new" element={<AdminRoutes><AdminLayoutWrapper><CreateProduct /></AdminLayoutWrapper></AdminRoutes>} />
        <Route path="/admin/products/edit/:id" element={<AdminRoutes><AdminLayoutWrapper><UpdateProduct /></AdminLayoutWrapper></AdminRoutes>} />
        <Route path="/admin/products/view/:id" element={<AdminRoutes><AdminLayoutWrapper><ViewProduct /></AdminLayoutWrapper></AdminRoutes>} />

        {/* Supplier Management */}
        <Route path="/admin/suppliers" element={<AdminRoutes><AdminLayoutWrapper><SupplierList /></AdminLayoutWrapper></AdminRoutes>} />
        <Route path="/admin/suppliers/new" element={<AdminRoutes><AdminLayoutWrapper><CreateSupplier /></AdminLayoutWrapper></AdminRoutes>} />
        <Route path="/admin/suppliers/edit/:id" element={<AdminRoutes><AdminLayoutWrapper><UpdateSupplier /></AdminLayoutWrapper></AdminRoutes>} />
        <Route path="/admin/suppliers/view/:id" element={<AdminRoutes><AdminLayoutWrapper><ViewSupplier /></AdminLayoutWrapper></AdminRoutes>} />

        {/* User Management */}
        <Route path="/admin/users" element={<AdminRoutes><AdminLayoutWrapper><UserList /></AdminLayoutWrapper></AdminRoutes>} />
        <Route path="/admin/users/create" element={<AdminRoutes><AdminLayoutWrapper><CreateUser /></AdminLayoutWrapper></AdminRoutes>} />
        <Route path="/admin/users/view/:id" element={<AdminRoutes><AdminLayoutWrapper><ViewUser /></AdminLayoutWrapper></AdminRoutes>} />

        {/* Order Management */}
        <Route path="/admin/orders" element={<AdminRoutes><AdminLayoutWrapper><OrderList /></AdminLayoutWrapper></AdminRoutes>} />
        <Route path="/admin/orders/view/:orderId" element={<AdminRoutes><AdminLayoutWrapper><ViewOrder /></AdminLayoutWrapper></AdminRoutes>} />

        {/* Review Management (NEW) */}
        <Route path="/admin/reviews" element={<AdminRoutes><AdminLayoutWrapper><ReviewList /></AdminLayoutWrapper></AdminRoutes>} />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to={getDefaultRoute()} />} />
      </Routes>
    </Router>
  );
};

export default App;
