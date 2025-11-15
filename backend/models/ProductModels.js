const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        maxLength: [5, 'Product price cannot exceed 5 characters'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            },
        }
    ],
    category: {
        type: String,
        required: [true, 'Please select category for this product'],
        // enum: {
        //     values: [
        //         'Plants - Roses',
        //         'Plants - Orchids',
        //         'Plants - Succulents',
        //         'Farming Tools - Shovels',
        //         'Farming Tools - Pruners',
        //         'Farming Tools - Rakes',
        //         'Farming Essentials - Fertilizers',
        //         'Farming Essentials - Soil Mixes',
        //         'Farming Essentials - Gardening Gloves'
        //     ],
        //     message: 'Please select correct category for product'
        // }
    },
    supplier: {
        type: mongoose.Schema.ObjectId,
        ref: 'Supplier',
        required: false // CHANGE FROM true TO false
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength: [5, 'Product stock cannot exceed 5 characters'],
        default: 0
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
reviews: [
    {
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            required: true
        },
        name: {
            type: String,
            required: true
        },
        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },
        comment: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        isActive: {
            type: Boolean,
            default: true
        }
    }
],

        isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
})

module.exports = mongoose.model('Product', productSchema);