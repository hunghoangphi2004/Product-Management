const Cart = require("../../models/cart.model")
const Product = require("../../models/product.model")
const productHelper = require("../../helpers/products")
const Order = require("../../models/order.model")
const vnpayHelper = require("../../helpers/vnpay")

// [GET] /checkout
module.exports.index = async (req, res) => {
    const cartId = req.cookies.cartId;

    const cart = await Cart.findOne({ _id: cartId })
    if (!cart) {
        return res.redirect("/cart");
    }
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
        objectProduct.priceNew = productHelper.priceNewProduct(objectProduct)

        products.push(objectProduct)
    }

    const totalPrice = products.reduce((sum, item) => sum + item.priceNew * item.quantity, 0)
    console.log(totalPrice)

    // Kiểm tra xem đã có đơn "pending" cho giỏ hàng này chưa
    let order = await Order.findOne({ cart_id: cartId, status: "pending" });

    if (order) {
        // Cập nhật lại thông tin (tránh tạo đơn trùng)
        order.userInfo = userInfo;
        order.products = products;
        order.updatedAt = new Date();
        await order.save();
    } else {
        // Nếu chưa có, tạo mới
        const orderInfo = {
            cart_id: cartId,
            userInfo,
            products,
            status: "pending",
        };
        order = await new Order(orderInfo).save();
    }

    req.body.amount = totalPrice;
    req.body.orderType = "billpayment";
    req.body.bankCode = "";
    req.body.language = "vn";

    const paymentUrl = vnpayHelper.createPaymentUrl(req, res)
    console.log(paymentUrl)

    // await Cart.updateOne({ _id: cartId }, {
    //     products: []
    // })

    res.redirect(paymentUrl)
}

// // [GET] /checkout/vnpay_return
// module.exports.vnpayReturn = async (req, res) => {
//     try {
//         const result = vnpayHelper.verifyReturnUrl(req.query);
//         const pendingOrder = req.session.pendingOrder;

//         if (!result.isValid) {
//             return res.send("Chữ ký không hợp lệ!");
//         }

//         // Nếu mã phản hồi = "00" nghĩa là thanh toán thành công
//         if (result.responseCode === "00") {
//             const order = await Order.findOneAndUpdate(
//                 { status: "pending" },  // tìm đơn đang chờ
//                 { status: "paid" },  // cập nhật thành công
//                 { sort: { createdAt: -1 }, new: true }
//             );

//             if (order) {
//                 // Xóa giỏ hàng sau khi thanh toán
//                 await Cart.updateOne({ _id: order.cart_id }, { products: [] });

//                 // Chuyển đến trang thành công
//                 return res.redirect(`/checkout/success/${order._id}`);
//             } else {
//                 return res.send("Không tìm thấy đơn hàng phù hợp!");
//             }
//         } else {
//             return res.send(`❌ Thanh toán thất bại (Mã lỗi: ${result.responseCode})`);
//         }
//     } catch (error) {
//         console.error("VNPay Return Error:", error);
//         res.status(500).send("Lỗi xử lý callback từ VNPay!");
//     }
// };
// [GET] /checkout/vnpay_return
module.exports.vnpayReturn = async (req, res) => {
    try {
        const result = vnpayHelper.verifyReturnUrl(req.query);

        if (!result.isValid) {
            return res.send("Chữ ký không hợp lệ!");
        }

        // Nếu thanh toán thành công
        if (result.responseCode === "00") {
            const order = await Order.findOneAndUpdate(
                { status: "pending" },
                { status: "paid" },
                { sort: { createdAt: -1 }, new: true }
            );

            if (order) {
                await Cart.updateOne({ _id: order.cart_id }, { products: [] });
                return res.redirect(`/checkout/success/${order._id}`);
            } else {
                return res.send("Không tìm thấy đơn hàng phù hợp!");
            }
        } else {
            return res.send(`Thanh toán thất bại (Mã lỗi: ${result.responseCode})`);
        }
    } catch (error) {
        console.error("VNPay Return Error:", error);
        res.status(500).send("Lỗi xử lý callback từ VNPay!");
    }
};




// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
    console.log(req.params.orderId);

    const order = await Order.findOne({ _id: req.params.orderId })


    for (const product of order.products) {
        const productInfo = await Product.findOne({ _id: product.product_id }).select("title thumbnail")
        product.productInfo = productInfo
        product.priceNew = productHelper.priceNewProduct(product)
        product.totalPrice = product.priceNew * product.quantity
    }

    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0)

    res.render("clients/pages/checkout/success", { title: "Đặt hàng thành công", order: order })
}