const Cart = require("../../models/cart.model")

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