const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const productHelper = require("../../helpers/products")
const Order = require("../../models/order.model")

// [GET] /checkout
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({ _id: cartId })
    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id;
            const productInfo = await Product.findOne({
                _id: productId
            }).select("title thumbnail slug price discountPercentage")
            // console.log(productInfo)

            productInfo.priceNew = productHelper.priceNewProduct(productInfo)

            item.productInfo = productInfo;

            item.totalPrice = productInfo.priceNew * item.quantity;
        }

    }
    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0)

    res.render("clients/pages/checkout/index", { title: "Trang đặt hàng", cartDetail: cart })
}

// [POST] /checkout/order
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;

    const cart = await Cart.findOne({ _id: cartId });
    const products = [];
    for (const product of cart.products) {
        const objectProduct = {
            product_id: product.product_id,
            price: 0,
            quantity: product.quantity,
            discountPercentage: 0
        };
        const productInfo = await Product.findOne({ _id: product.product_id }).select("price discountPercentage");
        objectProduct.price = productInfo.price;
        objectProduct.discountPercentage = productInfo.discountPercentage;

        products.push(objectProduct)
    }

    const orderInfo = {
        cart_id: cartId,
        userInfo: userInfo,
        products: products
    }
    const order = new Order(orderInfo)
    order.save();

    await Cart.updateOne({ _id: cartId }, {
        products: []
    })

    res.redirect(`/checkout/success/${order.id}`)
}

// [POST] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    console.log(req.params.orderId);
    res.render("clients/pages/checkout/success", { title: "Đặt hàng thành công" })
}