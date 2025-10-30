const User = require("../../models/user.model")
const ForgotPassword = require("../../models/forgot-password.model")
const md5 = require("md5")
const generatHelper = require("../../helpers/generate")

// [GET] /user/register
module.exports.register = async (req, res) => {
    res.render("clients/pages/user/register", { title: "Đăng ký tài khoản" })
}

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
    console.log(req.body)
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

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
}

// [GET] /user/logout
module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser")
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

    const otp = generatHelper.generateRandomNumber(6)

    const objectForgotPassword = {
        email: email,
        otp: otp,
        expireAt: new Date()
    };
    const forgotPassword = new ForgotPassword(objectForgotPassword)
    await forgotPassword.save();

    res.send("OK")
}
