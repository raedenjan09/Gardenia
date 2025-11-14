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

// Layout component that includes the header
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

        {/* Admin Routes (with header) */}
        <Route path="/admin/dashboard" element={<AdminRoutes><Layout><AdminDashboard /></Layout></AdminRoutes>} />

        {/* Product Management */}
        <Route path="/admin/products" element={<AdminRoutes><Layout><ProductList /></Layout></AdminRoutes>} />
        <Route path="/admin/products/new" element={<AdminRoutes><Layout><CreateProduct /></Layout></AdminRoutes>} />
        <Route path="/admin/products/edit/:id" element={<AdminRoutes><Layout><UpdateProduct /></Layout></AdminRoutes>} />
        <Route path="/admin/products/view/:id" element={<AdminRoutes><Layout><ViewProduct /></Layout></AdminRoutes>} />

        {/* Supplier Management */}
        <Route path="/admin/suppliers" element={<AdminRoutes><Layout><SupplierList /></Layout></AdminRoutes>} />
        <Route path="/admin/suppliers/new" element={<AdminRoutes><Layout><CreateSupplier /></Layout></AdminRoutes>} />
        <Route path="/admin/suppliers/edit/:id" element={<AdminRoutes><Layout><UpdateSupplier /></Layout></AdminRoutes>} />
        <Route path="/admin/suppliers/view/:id" element={<AdminRoutes><Layout><ViewSupplier /></Layout></AdminRoutes>} />

        {/* User Management */}
        <Route path="/admin/users" element={<AdminRoutes><Layout><UserList /></Layout></AdminRoutes>} />
        <Route path="/admin/users/create" element={<AdminRoutes><Layout><CreateUser /></Layout></AdminRoutes>} />
        <Route path="/admin/users/view/:id" element={<AdminRoutes><Layout><ViewUser /></Layout></AdminRoutes>} />

        {/* Order Management */}
        <Route path="/admin/orders" element={<AdminRoutes><Layout><OrderList /></Layout></AdminRoutes>} />
        <Route path="/admin/orders/view/:orderId" element={<AdminRoutes><Layout><ViewOrder /></Layout></AdminRoutes>} />

        {/* Review Management (NEW) */}
        <Route path="/admin/reviews" element={<AdminRoutes><Layout><ReviewList /></Layout></AdminRoutes>} />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to={getDefaultRoute()} />} />
      </Routes>
    </Router>
  );
};

export default App;
