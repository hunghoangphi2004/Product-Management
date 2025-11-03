const mongoose = require('mongoose');
const generate = require("../helpers/generate")

const AccountSchema = new mongoose.Schema(
    {
        fullname: String,
        email: String,
        password: String,
        token: {
            type: String,
            default: () => generate.generateRandomString(20)
        },
        phone: String,
        avatar: String,
        roleId: String,
        status: String,
        deleted: {
            type: Boolean,
            default: false
        },
        deletedAt: Date
    },
    {
        timestamps: true
    }
)

const Account = mongoose.model('Account', AccountSchema, 'Accounts')

module.exports = Account;