const Account = require('../../models/account.model.js')
const filterStatusHelper = require("../../helpers/filterStatus.js")
const searchHelper = require("../../helpers/search.js");
const paginationHelper = require("../../helpers/pagination.js");
const Role = require("../../models/role.model.js")
const systemConfig = require("../../config/system.js")
const md5 = require('md5')
const mongoose = require("mongoose")

// [GET] /admin/dashboard
module.exports.index = async (req, res) => {

    //Đoạn bộ lọc
    const filterStatus = filterStatusHelper(req.query);

    let find = {
        deleted: false,
    }

    if (req.query.status) {
        find.status = req.query.status
    } else {

    }

    //Đoạn tìm kiếm
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.fullname = objectSearch.regex;
    }

    //Sort
    // let sort = {}

    // if (req.query.sortKey && req.query.sortValue) {
    //     sort[req.query.sortKey] = req.query.sortValue;
    // }
    // else {
    //     sort.position = "desc"
    // }
    //End Sort

    //Đoạn phân trang
    const countAccounts = await Account.countDocuments(find);
    let objectPagination = await paginationHelper({
        limitItems: 4,
        currentPage: 1
    }, req.query, countAccounts);

    const records = await Account.find(find).select("-password -token").limit(objectPagination.limitItems).skip(objectPagination.skip)
    for (const record of records) {
        const role = await Role.findOne({
            _id: record.roleId,
            deleted: false
        })
        record.role = role;
        const user = await Account.findOne({ _id: record.createdBy.account_id })
        if (user) {
            record.accountFullName = user.fullname;
        }

        //Lấy ra thông tin người cập nhật gần nhất
        const updatedBy = record.updatedBy[record.updatedBy.length - 1];
        if (updatedBy) {
            const userUpdated = await Account.findOne({ _id: updatedBy.account_id })
            updatedBy.accountFullName = userUpdated.fullname;
        }
    }
    res.render("admin/pages/accounts/index", { title: "Danh sách tài khoản", records: records, keyword: objectSearch.keyword, filterStatus: filterStatus, query: req.query, keyword: objectSearch.keyword, pagination: objectPagination })
}

// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await Account.updateOne({ _id: id }, { status: status, $push: { updatedBy: updatedBy } })

    req.flash('success', 'Cập nhật trạng thái thành công');

    res.redirect(req.get("referer"));
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
        res.redirect(req.get("referer"));
    } else {
        req.body.password = md5(req.body.password)
        req.body.createdBy = {
            account_id: res.locals.user.id
        }
        let newAccount = new Account(req.body)
        await newAccount.save();
        req.flash('success', 'Tạo tài khoản thành công');
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
    const emailExist = await Account.findOne({ _id: { $ne: id }, email: req.body.email, deleted: false })
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

// [DELETE] /admin/accounts/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Account.updateOne({ _id: id }, { deleted: true, deletedBy: { account_id: res.locals.user.id, deletedAt: new Date() } });
    req.flash('success', `Xoá thành công 1 tài khoản`);
    res.redirect(req.get("referer"));
}

// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const account = await Account.findOne(find);
        const role = await Role.findOne({ _id: account.roleId, deleted: false })
        account.role = role.title
        res.render("admin/pages/accounts/detail", {account: account});
    }
    catch (err) {
        req.flash('error', 'Không tìm thấy sản phẩm');
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}