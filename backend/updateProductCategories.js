const mongoose = require('mongoose');
const Product = require('./models/ProductModels');
require('./config/db');

async function updateProductCategories() {
  try {
    console.log('Connecting to database...');
    
    // Wait for connection
    await mongoose.connection.asPromise();
    
    console.log('Updating product categories...');
    
    // Update all products to use the first Gardenia category
    const result = await Product.updateMany(
      {}, 
      { $set: { category: 'Plants - Roses' } }
    );
    
    console.log('Successfully updated', result.modifiedCount, 'products');
    process.exit(0);
  } catch (error) {
    console.error('Error updating categories:', error);
    process.exit(1);
  }
}

updateProductCategories();