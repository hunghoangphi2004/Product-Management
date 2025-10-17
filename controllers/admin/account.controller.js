const Account = require('../../models/account.model.js')
const Role = require("../../models/role.model.js")
const systemConfig = require("../../config/system.js")
const md5 = require('md5')
const mongoose = require("mongoose")

// [GET] /admin/dashboard

module.exports.index = async (req, res) => {

    let find = {
        deleted: false,
    }

    const records = await Account.find(find).select("-password -token")
    for (const record of records) {
        const role = await Role.findOne({
            _id: record.roleId,
            deleted: false
        })
        record.role = role;
    }
    res.render("admin/pages/accounts/index", { title: "Danh sách tài khoản", records: records })
}

module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false,
    })

    res.render("admin/pages/accounts/create", { title: "Tạo mới tài khoản", roles: roles })
}

module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({ email: req.body.email, deleted: false })

    if (emailExist) {
        req.flash('error', 'Email đã tồn tại');
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    } else {
        req.body.password = md5(req.body.password)
        let newAccount = new Account(req.body)
        await newAccount.save();
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

module.exports.edit = async (req, res) => {
    try {
        let find = {
            _id: req.params.id,
            deleted: false,
            
        }
        const data = await Account.findOne(find)
        const roles = await Role.find({ deleted: false })
        res.render("admin/pages/accounts/edit", { title: "Chỉnh sửa tài khoản", data: data, roles: roles })
    } catch (err) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

module.exports.editPatch = async (req, res) => {
    const id = req.params.id
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