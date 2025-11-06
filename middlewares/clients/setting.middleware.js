const systemConfig = require("../../config/system.js");
const SettingGeneral = require("../../models/settings-general.model.js");

module.exports.settingGeneral = async (req, res, next) => {
    const settingGeneral = await SettingGeneral.findOne({});

    res.locals.settingGeneral = settingGeneral

    next()
}