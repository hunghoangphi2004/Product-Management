const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/products")

// [GET] /
module.exports.index = async (req, res) => {
    const productsFeatured = await Product.find({ deleted: false, featured: "1", status: "active" }).limit(6);
    const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured)

    const productsNew    = await Product.find({ deleted: false, status: "active" }).sort({position: "desc"}).limit(6);
    const newProductsNew = productsHelper.priceNewProducts(productsNew)


    res.render("clients/pages/home/index", { title: "Trang chủ", productsFeatured: newProductsFeatured, productsNew: newProductsNew })
}