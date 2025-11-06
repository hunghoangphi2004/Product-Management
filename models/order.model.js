const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        // user_id: String,
        cart_id: String,
        userInfo: {
            fullname: String,
            phone: String,
            address: String
        },
        products: [
            {
                product_id: String,
                price: Number,
                quantity: Number,
                discountPercentage: Number
            }
        ],
        deleted: {
            type: Boolean,
            default: false
        },
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending'
        },
        deletedBy: { 
            account_id: String,
            deletedAt: Date
        },
        updatedBy: [{ 
            account_id: String,
            updatedAt: Date
        }],
        deletedAt: Date
    },
    {
        timestamps: true
    }
)

const Order = mongoose.model('Order', OrderSchema, 'Orders')

module.exports = Order;