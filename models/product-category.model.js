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
        createdBy: { 
            account_id: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        },
        deletedBy: { 
            account_id: String,
            deletedAt: Date
        },
        updatedBy: [{ 
            account_id: String,
            updatedAt: Date
        }],
        deleted: {
            type: Boolean,
            default: false
        },
        // deletedAt: Date
    },
    {
        timestamps: true
    }
)

const ProductCategory = mongoose.model('ProductCategory', ProductCategorySchema, 'Products-category')

module.exports = ProductCategory;