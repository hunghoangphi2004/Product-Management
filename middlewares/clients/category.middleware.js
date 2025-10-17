const ProductCategory = require("../../models/product-category.model.js")
const createTreeHelper = require("../../helpers/createTree.js");

module.exports.category = async (req, res, next) => {
    const productsCategory = await ProductCategory.find({ deleted: false });
    const newProductsCategory = createTreeHelper.tree(productsCategory)
    res.locals.layoutProductsCategory = newProductsCategory
    next()
}