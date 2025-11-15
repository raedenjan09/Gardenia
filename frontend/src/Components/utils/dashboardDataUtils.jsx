/**
 * Utility functions for generating dashboard data from API responses
 */

// Sample data generation functions (fallback when API data is not available)
export const generateMonthlyData = () => {
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

export const generateUserGrowthData = (totalUsers) => {
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

export const generateTopProductsData = (products) => {
  return products.slice(0, 5).map((product, index) => ({
    name: product.name,
    sales: Math.floor(Math.random() * 100) + 50,
    revenue: (product.price || 0) * (Math.floor(Math.random() * 50) + 10)
  }));
};

export const generateOrderStatusData = (orders) => {
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
export const generateMonthlyDataFromOrders = (orders) => {
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

export const generateUserGrowthDataFromUsers = (users) => {
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

export const generateTopProductsDataFromProducts = (products) => {
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

// Chart colors for consistent theming
export const CHART_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Calculate revenue from completed orders
export const calculateRevenueFromOrders = (orders) => {
  return orders
    .filter(order => order.status === 'completed')
    .reduce((total, order) => total + (order.totalAmount || 0), 0);
};