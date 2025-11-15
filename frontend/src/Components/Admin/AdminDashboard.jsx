import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getUser } from "../utils/helper";
import Loader from "../layouts/Loader";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const AdminDashboard = () => {
  const user = getUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    products: 0,
    suppliers: 0,
    users: 0,
    orders: 0,
    reviews: 0,
    revenue: 0,
    categories: [],
    monthlyData: [],
    userGrowth: [],
    topProducts: [],
    orderStatus: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeRange, setTimeRange] = useState('monthly');

  const API_BASE = "http://localhost:4001/api/v1";

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [
        productsRes,
        suppliersRes,
        usersRes,
        ordersRes,
        reviewsRes
      ] = await Promise.all([
        axios.get(`${API_BASE}/products`, config),
        axios.get(`${API_BASE}/suppliers`, config),
        axios.get(`${API_BASE}/users`, config),
        axios.get(`${API_BASE}/admin/orders`, config),
        axios.get(`${API_BASE}/admin/reviews`, config)
      ]);

      const products = productsRes.data.products || productsRes.data || [];
      const suppliers = suppliersRes.data.suppliers || suppliersRes.data || [];
      const users = usersRes.data.users || [];
      const orders = ordersRes.data.orders || [];
      const reviews = reviewsRes.data.reviews || [];

      // Debug: Log the actual data structure
      console.log('Products:', products);
      console.log('Orders:', orders);
      console.log('Users:', users);

      // Calculate revenue from completed orders
      const revenue = orders
        .filter(order => order.status === 'completed')
        .reduce((total, order) => total + (order.totalAmount || 0), 0);

      // Generate real data from API responses
      const monthlyData = generateMonthlyDataFromOrders(orders);
      const userGrowth = generateUserGrowthDataFromUsers(users);
      const topProducts = generateTopProductsDataFromProducts(products);
      const orderStatus = generateOrderStatusData(orders);

      // Debug: Log the generated data
      console.log('Generated Monthly Data:', monthlyData);
      console.log('Generated User Growth Data:', userGrowth);
      console.log('Generated Top Products:', topProducts);
      console.log('Generated Order Status:', orderStatus);

      setStats({
        products: products.length,
        suppliers: suppliers.length,
        users: users.length,
        orders: orders.length,
        reviews: reviews.length,
        revenue: revenue,
        monthlyData,
        userGrowth,
        topProducts,
        orderStatus
      });
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load dashboard statistics.");
    } finally {
      setLoading(false);
    }
  };

  // Sample data generation functions (replace with real data from backend)
  const generateMonthlyData = () => {
    return [
      { month: 'Jan', sales: 12000, orders: 45, users: 25 },
      { month: 'Feb', sales: 15000, orders: 52, users: 32 },
      { month: 'Mar', sales: 18000, orders: 61, users: 38 },
      { month: 'Apr', sales: 22000, orders: 78, users: 45 },
      { month: 'May', sales: 25000, orders: 85, users: 52 },
      { month: 'Jun', sales: 28000, orders: 92, users: 58 },
      { month: 'Jul', sales: 31000, orders: 105, users: 65 },
      { month: 'Aug', sales: 35000, orders: 118, users: 72 },
      { month: 'Sep', sales: 38000, orders: 125, users: 78 },
      { month: 'Oct', sales: 42000, orders: 138, users: 85 },
      { month: 'Nov', sales: 48000, orders: 155, users: 92 },
      { month: 'Dec', sales: 52000, orders: 168, users: 98 }
    ];
  };

  const generateUserGrowthData = (totalUsers) => {
    return [
      { month: 'Jan', users: Math.round(totalUsers * 0.1) },
      { month: 'Feb', users: Math.round(totalUsers * 0.2) },
      { month: 'Mar', users: Math.round(totalUsers * 0.3) },
      { month: 'Apr', users: Math.round(totalUsers * 0.4) },
      { month: 'May', users: Math.round(totalUsers * 0.5) },
      { month: 'Jun', users: Math.round(totalUsers * 0.6) },
      { month: 'Jul', users: Math.round(totalUsers * 0.7) },
      { month: 'Aug', users: Math.round(totalUsers * 0.8) },
      { month: 'Sep', users: Math.round(totalUsers * 0.9) },
      { month: 'Oct', users: totalUsers }
    ];
  };

  const generateTopProductsData = (products) => {
    return products.slice(0, 5).map((product, index) => ({
      name: product.name,
      sales: Math.floor(Math.random() * 100) + 50,
      revenue: (product.price || 0) * (Math.floor(Math.random() * 50) + 10)
    }));
  };

  const generateOrderStatusData = (orders) => {
    const statusCount = orders.reduce((acc, order) => {
      const status = order.status || 'Unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      value: count
    }));
  };

  // Real data generation functions using actual API data
  const generateMonthlyDataFromOrders = (orders) => {
    try {
      const monthlyData = {};
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Check if orders is an array and has data
      if (!Array.isArray(orders) || orders.length === 0) {
        console.warn('No orders data available, using sample data');
        return generateMonthlyData();
      }
      
      orders.forEach(order => {
        const createdAt = order.createdAt || order.dateCreated || order.orderDate;
        console.log('Order createdAt:', order._id, createdAt, 'totalAmount:', order.totalAmount, 'itemsPrice:', order.itemsPrice);
        if (createdAt) {
          const date = new Date(createdAt);
          if (!isNaN(date.getTime())) {
            const month = date.getMonth();
            const monthKey = monthNames[month];
            
            if (!monthlyData[monthKey]) {
              monthlyData[monthKey] = { month: monthKey, sales: 0, orders: 0 };
            }
            
            monthlyData[monthKey].sales += order.totalAmount || order.itemsPrice || order.amount || order.price || 0;
            monthlyData[monthKey].orders += 1;
          }
        }
      });

      // Fill in missing months with zero values
      return monthNames.map(month => monthlyData[month] || { month, sales: 0, orders: 0 });
    } catch (error) {
      console.error('Error generating monthly data:', error);
      return generateMonthlyData(); // Fallback to sample data
    }
  };

  const generateUserGrowthDataFromUsers = (users) => {
    try {
      const monthlyData = {};
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Check if users is an array and has data
      if (!Array.isArray(users) || users.length === 0) {
        console.warn('No users data available, using sample data');
        return generateUserGrowthData(50); // Default to 50 users
      }
      
      users.forEach(user => {
        const createdAt = user.createdAt || user.dateCreated || user.registrationDate;
        console.log('User createdAt:', user._id, createdAt);
        if (createdAt) {
          const date = new Date(createdAt);
          if (!isNaN(date.getTime())) {
            const month = date.getMonth();
            const monthKey = monthNames[month];
            
            if (!monthlyData[monthKey]) {
              monthlyData[monthKey] = { month: monthKey, users: 0 };
            }
            
            monthlyData[monthKey].users += 1;
          }
        }
      });

      // Calculate cumulative users
      let cumulativeUsers = 0;
      return monthNames.map(month => {
        const monthData = monthlyData[month] || { month, users: 0 };
        cumulativeUsers += monthData.users;
        return { month, users: cumulativeUsers };
      });
    } catch (error) {
      console.error('Error generating user growth data:', error);
      return generateUserGrowthData(50); // Fallback to sample data
    }
  };

  const generateTopProductsDataFromProducts = (products) => {
    try {
      // Check if products is an array and has data
      if (!Array.isArray(products) || products.length === 0) {
        console.warn('No products data available, using sample data');
        return generateTopProductsData([{name: 'Sample Product', price: 100}]);
      }
      
      // Sort products by sales or popularity (using stock movement as proxy)
      return products
        .sort((a, b) => (b.stockSold || b.salesCount || 0) - (a.stockSold || a.salesCount || 0))
        .slice(0, 5)
        .map(product => ({
          name: product.name || 'Unknown Product',
          sales: product.stockSold || product.salesCount || Math.floor(Math.random() * 50) + 10,
          revenue: (product.price || 0) * (product.stockSold || product.salesCount || Math.floor(Math.random() * 50) + 10)
        }));
    } catch (error) {
      console.error('Error generating top products data:', error);
      return generateTopProductsData([{name: 'Sample Product', price: 100}]);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading)
    return (
      <div className="loader-container">
        <Loader />
      </div>
    );

  return (
    <div className="admin-dashboard page-container">
      {/* Admin Header Banner */}
      <div className="admin-header-banner">
        <div className="banner-content">
          <h1>Admin Dashboard</h1>
          <p>Manage your store efficiently with comprehensive tools and insights</p>
        </div>
      </div>

      {error && <div className="alert alert-warning">{error}</div>}

      {/* User Info Card with Enhanced Design */}
      <div className="user-info-card">
        <div className="user-avatar-large">
          <img
            src={user?.avatar?.url || '/images/default-avatar.png'}
            alt={user?.name}
          />
        </div>
        <div className="user-details">
          <h3>Welcome back, {user?.name}!</h3>
          <div className="user-meta">
            <span className="meta-item">
              <strong>Email:</strong> {user?.email}
            </span>
            <span className="role-badge">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Stats Grid with Enhanced Design */}
      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Products</h3>
            <p className="stat-number">{stats.products}</p>
            <Link to="/admin/products" className="stat-action-btn">
              Manage Products →
            </Link>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">🏢</div>
          <div className="stat-content">
            <h3>Suppliers</h3>
            <p className="stat-number">{stats.suppliers}</p>
            <Link to="/admin/suppliers" className="stat-action-btn">
              Manage Suppliers →
            </Link>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Users</h3>
            <p className="stat-number">{stats.users}</p>
            <Link to="/admin/users" className="stat-action-btn">
              Manage Users →
            </Link>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Orders</h3>
            <p className="stat-number">{stats.orders}</p>
            <Link to="/admin/orders" className="stat-action-btn">
              View Orders →
            </Link>
          </div>
        </div>

        <div className="dashboard-stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-content">
            <h3>Reviews</h3>
            <p className="stat-number">{stats.reviews}</p>
            <Link to="/admin/reviews" className="stat-action-btn">
              Manage Reviews →
            </Link>
          </div>
        </div>

        <div className="dashboard-stat-card quick-actions">
          <div className="stat-icon">⚡</div>
          <div className="stat-content">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <Link to="/admin/products/create" className="btn btn-primary btn-sm">
                Add Product
              </Link>
              <Link to="/admin/suppliers/create" className="btn btn-secondary btn-sm">
                Add Supplier
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-row">
          {/* Sales Overview Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Monthly Sales & Orders</h3>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="chart-filter"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#8884d8" name="Sales ($)" />
                  <Bar dataKey="orders" fill="#82ca9d" name="Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Growth Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>User Growth</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stats.userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#ff7300" name="Users" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="chart-row">
          {/* Top Products Chart */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Top Selling Products</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.topProducts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={80} />
                  <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']} />
                  <Legend />
                  <Bar dataKey="revenue" fill="#0088FE" name="Revenue">
                    {stats.topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Order Status Distribution */}
          <div className="chart-card">
            <div className="chart-header">
              <h3>Order Status Distribution</h3>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.orderStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {stats.orderStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>


      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="action-buttons-grid">
          <Link to="/admin/products/create" className="action-button">
            <span className="action-icon">➕</span>
            <span>Add Product</span>
          </Link>
          <Link to="/admin/suppliers/create" className="action-button">
            <span className="action-icon">🏢</span>
            <span>Add Supplier</span>
          </Link>
          <Link to="/admin/users/create" className="action-button">
            <span className="action-icon">👥</span>
            <span>Add User</span>
          </Link>
          <Link to="/admin/orders" className="action-button">
            <span className="action-icon">📋</span>
            <span>View Orders</span>
          </Link>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="recent-activity-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon">📊</div>
            <div className="activity-content">
              <p>Dashboard statistics updated</p>
              <span className="activity-time">Just now</span>
            </div>
          </div>
          <div className="activity-item">
            <div className="activity-icon">ℹ️</div>
            <div className="activity-content">
              <p>Welcome to your admin dashboard</p>
              <span className="activity-time">Today</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
