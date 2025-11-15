const axios = require('axios');

async function testCategoryStats() {
  try {
    // Replace with a valid admin token from your system
    const token = 'wMqmVwmB8Y4uZ6iU0zsVCd97BHIzlAgR';
    
    const response = await axios.get('http://localhost:4001/api/v1/admin/products/category-stats', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    console.log('Category stats response:', response.data);
  } catch (error) {
    console.error('Error testing category stats:', error.response?.data || error.message);
  }
}

testCategoryStats();