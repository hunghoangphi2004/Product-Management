const User = require("../../models/user.model")
const Cart = require("../../models/cart.model")
const ForgotPassword = require("../../models/forgot-password.model")
const md5 = require("md5")
const generatHelper = require("../../helpers/generate")
const sendMailHelper = require("../../helpers/sendMail")

// [GET] /user/register
module.exports.register = async (req, res) => {
    res.render("clients/pages/user/register", { title: "Đăng ký tài khoản" })
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({ email: req.body.email })

    if (existEmail) {
        req.flash("error", "Email đã tồn tại")
        res.redirect(req.get("referer"));
        return;
    }

    req.body.password = md5(req.body.password)
    const user = new User(req.body);
    await user.save();

    res.cookie("tokenUser", user.tokenUser)

    res.redirect("/")
}

// [GET] /user/login
module.exports.login = async (req, res) => {
    res.render("clients/pages/user/login", { title: "Đăng nhập tài khoản" })
}

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await User.findOne({ email: email, deleted: false })

    if (!user) {
        req.flash("error", "Email không tồn tại")
        res.redirect(req.get("referer"));
        return;
    }

    if (md5(password) !== user.password) {
        req.flash("error", "Sai mật khẩu")
        res.redirect(req.get("referer"));
        return;
    }

    if (user.status === "inactive") {
        req.flash("error", "Tài khoản đang bị khoá")
        res.redirect(req.get("referer"));
        return;
    }

    const cart = await Cart.findOne({
        user_id: user.id
    });

    if (cart) {
        res.cookie("cartId", cart.id);
    } else {
        await Cart.updateOne({
            _id: req.cookies.cartId
        }, {
            user_id: user.id
        })
    }

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser")
    res.clearCookie("cartId")
    res.redirect("/");
}

// [GET] /user/password/forgot
module.exports.forgotPassword = async (req, res) => {
    res.render("clients/pages/user/forgot-password", { title: "Lấy lại mật khẩu" })
}

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;

    const user = await User.findOne({ email: email, deleted: false })

    if (!user) {
        req.flash("error", "Email không tồn tại")
        res.redirect(req.get("referer"));
        return;
    }

    const otp = generatHelper.generateRandomNumber(6);

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: new Date()
    };
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save();


    //gửi otp qua email
    const subject = "Mã otp xác minh lấy lại mật khẩu";
    const html = `Mã otp để lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 3 phút`
    sendMailHelper.sendMail(email, subject, html);

    res.redirect(`/user/password/otp?email=${email}`)
}

// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;

    res.render("clients/pages/user/otp-password", { title: "Nhập mã otp", email: email })
}

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;

    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    });
S
    if (!result) {
        req.flash("error", "OTP không hợp lệ");
        res.redirect(req.get("referer"));
        return;
    }

    const user = await User.findOne({ email: email });
    res.cookie("tokenUser", user.tokenUser)

    res.redirect(`/user/password/reset`)
}


// [GET] /user/password/resetPassword
module.exports.resetPassword = async (req, res) => {
    res.render("clients/pages/user/reset-password", { title: "Nhập mã otp" })
}

// [POST] /user/password/resetPassword
module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;

    await User.updateOne({ tokenUser: tokenUser }, { password: md5(password) })
    req.flash("success", "Đổi mật khẩu thành công")
    res.redirect("/")
}

// [GET] /user/info
module.exports.info = async (req, res) => {
    res.render("clients/pages/user/info", { title: "Thông tin tài khoản" })
}