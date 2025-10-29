const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/products")

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
    // console.log(cart)
    res.render("clients/pages/cart/index", { title: "Giỏ hàng", cartDetail: cart })
}

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
    const productId = req.params.productId;
    const quantity = parseInt(req.body.quantity);
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({
        _id: cartId
    })

    // console.log(cart)


    //ham find cua js
    const existProductInCart = await cart.products.find(item => item.product_id === productId)
    if (existProductInCart) {
        const quantityNew = quantity + existProductInCart.quantity;
        await Cart.updateOne(
            {
                _id: cartId,
                "products.product_id": productId
            },
            {
                $set: {
                    "products.$.quantity": quantityNew
                }
            }
        )
    } else {
        const objectCart = {
            product_id: productId,
            quantity: quantity
        }

        await Cart.updateOne(
            {
                _id: cartId
            },
            {
                $push: { products: objectCart }
            }
        )
    }
    // console.log(productId, quantity, cartId)
    req.flash("success", "Đã thêm sản phẩm vào giỏ hàng")
    res.redirect(req.get("referer"));
}

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
    const productId = req.params.productId;
    const cartId = req.cookies.cartId;

    await Cart.updateOne({ _id: cartId }, {
        $pull: {
            products: {
                product_id: productId
            }
        }
    })

    req.flash("success", "Đã xoá sản phẩm thành công")
    res.redirect(req.get("referer"));
}

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
    const cartId = req.cookies.cartId;
    const productId = req.params.productId;
    const quantity = req.params.quantity

    await Cart.updateOne(
        {
            _id: cartId,
            "products.product_id": productId
        },
        {
            $set: {
                "products.$.quantity": quantity
            }
        }
    )

    req.flash("success", "Đã cập nhật phẩm thành công")
    res.redirect(req.get("referer"));
}