const Product = require("../../models/product.model.js");
const productsHelper = require("../../helpers/products")

module.exports.index = async (req, res) => {
    const keyword = req.query.keyword;

    let newProducts = [];

    if (keyword) {
        const regex = new RegExp(keyword, "i");
        const products = await Product.find({
            title: regex, deleted: false,
            status: "active"
        });
        newProducts = productsHelper.priceNewProducts(products)
    }

    res.render("clients/pages/search/index", {
        title: "Kết quả tìm kiếm",
        keyword: keyword,
        products: newProducts
    })
}