const crypto = require("crypto");
const qs = require("qs");


const vnp_TmnCode = process.env.VNP_TMN_CODE;
const vnp_HashSecret = process.env.VNP_HASH_SECRET;
const vnp_Url = process.env.VNP_URL;
const vnp_ReturnUrl = process.env.VNP_RETURN_URL;

// Sắp xếp object đúng chuẩn VNPay
function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
        sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    }
    return sorted;
}

// Tạo URL thanh toán
function createPaymentUrl(req, res) {
    const ipAddr =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);

    const pad = (n) => (n < 10 ? '0' + n : n);
    const date = new Date();
    const createDate =
        date.getFullYear().toString() +
        pad(date.getMonth() + 1) +
        pad(date.getDate()) +
        pad(date.getHours()) +
        pad(date.getMinutes()) +
        pad(date.getSeconds());

    const orderId =
        pad(date.getHours()) +
        pad(date.getMinutes()) +
        pad(date.getSeconds());


    const tmnCode = vnp_TmnCode;
    const secretKey = vnp_HashSecret;
    const vnpUrl = vnp_Url;
    const returnUrl = vnp_ReturnUrl;

    const amount = req.body.amount;
    const bankCode = req.body.bankCode || "";
    const orderInfo = "Thanh toan don hang " + orderId;
    const orderType = req.body.orderType || "other";
    const locale = req.body.language || "vn";
    const currCode = "VND";

    let vnp_Params = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: tmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: currCode,
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: orderType,
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: returnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: createDate,
    };

    if (bankCode !== "") vnp_Params["vnp_BankCode"] = bankCode;

    vnp_Params = sortObject(vnp_Params);

    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
    vnp_Params["vnp_SecureHash"] = signed;

    const paymentUrl = vnpUrl + "?" + qs.stringify(vnp_Params, { encode: false });
    return paymentUrl;
}

// Xác thực callback từ VNPAY
function verifyReturnUrl(query) {
    let vnp_Params = { ...query };
    const secureHash = vnp_Params["vnp_SecureHash"];

    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha512", vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    const isValid = secureHash === signed;
    const responseCode = vnp_Params["vnp_ResponseCode"];
    const orderId = vnp_Params["vnp_TxnRef"];

    return { isValid, orderId, responseCode };
}

module.exports = { createPaymentUrl, verifyReturnUrl };
