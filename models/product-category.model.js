const mongoose = require('mongoose');
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug)

const ProductCategorySchema = new mongoose.Schema(
    {

        title: String,
        description: String,
        parent_id: {
            type: String,
            default: ""
        },
        thumbnail: String,
        status: String,
        position: Number,
        slug: { type: String, slug: "title", unique: true },
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
)

const Product = mongoose.model('ProductCategory', ProductCategorySchema, 'Products-category')

module.exports = Product;