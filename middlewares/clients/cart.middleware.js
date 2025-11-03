// const Cart = require("../../models/cart.model.js")

// module.exports.cartId = async (req, res, next) => {
//     if (!req.cookies.cartId) {
//         const cart = new Cart();
//         await cart.save();

//         const expiresCookie = 1000 * 60 * 60 * 24 * 365;

//         res.cookie("cartId", cart._id, {
//             expires: new Date(Date.now() + expiresCookie)
//         });
//     } else {
//         const cart = await Cart.findOne({
//             _id: req.cookies.cartId
//         })

//         cart.totalQuantity = cart.products.reduce((sum, item)=> sum + item.quantity, 0);
//         res.locals.miniCart = cart
//     }
//     next()
// }
const Cart = require("../../models/cart.model.js");

module.exports.cartId = async (req, res, next) => {
    try {
        if (!req.cookies.cartId) {
            // Tạo giỏ hàng mới nếu chưa có cookie
            const cart = new Cart();
            await cart.save();

            const expiresCookie = 1000 * 60 * 60 * 24 * 30; // 1 tháng

            res.cookie("cartId", cart._id, {
                expires: new Date(Date.now() + expiresCookie),
            });

            res.locals.miniCart = cart;
        } else {
            // Tìm giỏ hàng theo cookie
            const cart = await Cart.findOne({ _id: req.cookies.cartId });

            // Nếu không tìm thấy giỏ hàng => tạo lại
            if (!cart) {
                const newCart = new Cart();
                await newCart.save();

                res.cookie("cartId", newCart._id, {
                    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
                });

                res.locals.miniCart = newCart;
            } else {
                // Nếu giỏ hàng tồn tại
                cart.totalQuantity = cart.products.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                );

                res.locals.miniCart = cart;
            }
        }

        next();
    } catch (error) {
        console.error("Lỗi trong cartId middleware:", error);
        next(error);
    }
};
