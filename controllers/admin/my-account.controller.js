const Account = require("../../models/account.model")
const systemConfig = require("../../config/system.js")
const md5 = require('md5')

module.exports.index = (req, res) => {
    res.render("admin/pages/my-account/index", { title: "Thông tin cá nhân" })
}

module.exports.edit = (req, res) => {
    res.render("admin/pages/my-account/edit", { title: "Chỉnh sửa thông tin cá nhân" })
}

module.exports.editPatch = async(req, res) => {
    const id = res.locals.user.id
    const emailExist = await Account.findOne({_id:{$ne: id}, email: req.body.email, deleted: false })
    if (emailExist) {
        req.flash('error', `Email ${req.body.email} đã tồn tại`);
    } else {
        if (req.body.password) {
            req.body.password = md5(req.body.password)
        } else {
            delete req.body.password
        }
        await Account.updateOne({ _id: id }, req.body)
        req.flash("success", "Cập nhật thành công")
    }

    res.redirect(req.get("referer"));
}
