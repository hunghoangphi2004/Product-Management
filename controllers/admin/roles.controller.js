const Role = require('../../models/role.model')
const systemConfig = require("../../config/system.js")


// [GET] /admin/dashboard

module.exports.index = async (req, res) => {

    let find = {
        deleted: false,
    }

    const records = await Role.find(find)
    res.render("admin/pages/roles/index", { title: "Nhóm quyền", records: records })
}

module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create", { title: "Tạo nhóm quyền" })
}

module.exports.createPost = async (req, res) => {
    const record = new Role(req.body, deleted = false);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
}

module.exports.edit = async (req, res) => {
    try {
        const id = req.params.id;
        let find = { deleted: false, _id: id }

        const role = await Role.findOne(find)

        res.render("admin/pages/roles/edit", { title: "Chỉnh sửa nhóm quyền", role: role })
    } catch (err) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }

}

module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(req.body)

        await Role.updateOne({ _id: id }, req.body)
        req.flash('success', 'Cập nhật nhóm quyền thành công');
        res.redirect(req.get("referer"));
    } catch (err) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }

}

module.exports.permissions = async(req, res) => {
    let find = {
        deleted: false
    }

    const records = await Role.find(find);
    res.render("admin/pages/roles/permissions", { title: "Phân quyền", records: records })
}

module.exports.permissionsPatch = async(req, res) => {
    const permissions = JSON.parse(req.body.permissions)
    
    for(const item of permissions){
        await Role.updateOne({_id: item.id},{permissions: item.permissions})
    }
    req.flash('success', 'Cập nhật phân quyền thành công');
    res.redirect(`${systemConfig.prefixAdmin}/roles/permissions`);
}
