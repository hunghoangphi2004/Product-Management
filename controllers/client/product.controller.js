    const Products = require("../../models/product.model.js");

    // [GET] /admin/products
    module.exports.index = async (req, res) => {
        const products = await Products.find({ status: "active", deleted: false }).sort({ position: "desc" });
        console.log(products);

        const newProducts = products.map(item => {
            item.priceNew = item.price - (item.price * item.discountPercentage / 100).toFixed(1);
            return item;
        })

        res.render("clients/pages/products/index.pug", { title: "Trang danh sách sản phẩm", products: newProducts })
    }

    module.exports.detail = async (req, res) => {
        try {
            const find = {
                deleted: false,
                slug: req.params.slug,
                status: active
            };
            const product = await Products.findOne(find);
            console.log(product)
            res.render("clients/pages/products/detail", { title: "Chi tiết sản phẩm", product: product })
        }
        catch (err) {
            res.redirect(`/products`);
        }
    }