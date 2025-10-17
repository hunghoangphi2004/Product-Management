const Account = require("../../models/account.model")
const systemConfig = require("../../config/system.js")
const md5 = require("md5")
// [GET] /admin/auth/login

module.exports.login = (req, res) => {
    if(req.cookies.token){
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } else {
        res.render("admin/pages/auth/login", { title: "Trang đăng nhập" })
    }
}

module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body
    const user = await Account.findOne({
        email: email,
        deleted: false,
    })

    if (!user) {
        req.flash("error", "Email không tồn tại")
        res.redirect(req.get("referer"));
        return
    } else {

    }
    if (md5(password) != user.password) {
        req.flash("error", "Mật khẩu không chính xác")
        res.redirect(req.get("referer"));
        return
    }


    if (user.status != "active") {
        req.flash("error", "Tài khoản đã bị khoá")
        res.redirect(req.get("referer"));
        return
    }

    res.cookie("token", user.token)
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

module.exports.logout = (req, res) => {
    res.clearCookie("token")
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}