const systemConfig = require("../../config/system.js");
const Account = require("../../models/account.model");
const Role = require("../../models/role.model.js")

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) {
        return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    } else {
        const user = await Account.findOne({ token: req.cookies.token }).select("-password")
        if (!user) {
            return res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
        } else {
            const role = await Role.findOne({_id: user.roleId}).select("title permissions")

            res.locals.user = user
            res.locals.role = role;
            next()
        }
       
    }
}