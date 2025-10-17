const Products = require("../../models/product.model.js");
const ProductsCategory = require("../../models/product-category.model.js");
const productsHelper = require("../../helpers/products")
const productsCategoryHelper = require("../../helpers/products-category.js")

// [GET] /admin/products
module.exports.index = async (req, res) => {
    const products = await Products.find({ status: "active", deleted: false }).sort({ position: "desc" });
    const newProducts = productsHelper.priceNewProducts(products)
    console.log(newProducts)

    res.render("clients/pages/products/index.pug", { title: "Trang danh sách sản phẩm", products: newProducts })
}

module.exports.detail = async (req, res) => {
    try {
        console.log(req.params.slugProduct)
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active"
        };
        const product = await Products.findOne(find);
        if(product.product_category_id){
            const category = await ProductsCategory.findOne({
                _id: product.product_category_id,
                status: "active",
                deleted: false,
            })
            product.category = category
        }

       product.priceNew =  productsHelper.priceNewProduct(product)

        res.render("clients/pages/products/detail", { title: "Chi tiết sản phẩm", product: product })
    }
    catch (err) {
        console.log(err)
        res.redirect(`/products`);
    }
}

module.exports.category = async (req, res) => {
    const category = await ProductsCategory.findOne({ slug: req.params.slugCategory, deleted: false })
    if (!category) {
        return res.redirect("/products")
    }

    const listSubCategory = await productsCategoryHelper.getSubCategory(category.id)
    const listSubCategoryIds = listSubCategory.map(item => item.id)

    const productsByCategory = await Products.find({ product_category_id: { $in: [category.id, ...listSubCategoryIds] }, status: "active", deleted: false }).sort({ position: "desc" });
    res.render("clients/pages/products/index.pug", { title: `${category.title}`, products: productsByCategory })
}