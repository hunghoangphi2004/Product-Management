const express = require('express');
const router = express.Router();
const multer = require('multer');
const controller = require('../../controllers/admin/user.controller');

const upload = multer()
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js")
const validate = require('../../validates/admin/account.validate.js')


router.get('/', controller.index )
router.patch("/change-status/:status/:id", controller.changeStatus)
// router.get('/create', controller.create )
// router.post('/create',upload.single('avatar'), uploadCloud.upload ,validate.createPost, controller.createPost )
// router.get('/edit/:id', controller.edit )
// router.patch('/edit/:id',upload.single('avatar'), uploadCloud.upload ,validate.editPatch, controller.editPatch )
router.delete("/delete/:id", controller.deleteItem)
router.get("/detail/:id", controller.detail)

module.exports = router