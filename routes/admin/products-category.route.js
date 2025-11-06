const express = require('express');
const multer = require('multer');
const router = express.Router();
const validate = require('../../validates/admin/product-category.validate.js')

const upload = multer()

const controller = require('../../controllers/admin/products-category.controller');

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware.js")

router.get('/', controller.index)
router.get('/create', controller.create)
router.post(
    "/create", upload.single('thumbnail'), uploadCloud.upload,
    validate.createPost,
    controller.createPost
)

router.patch("/change-status/:status/:id", controller.changeStatus)

router.patch("/change-multi", controller.changeMulti)

router.get('/edit/:id', controller.edit)
router.patch(
    "/edit/:id", upload.single('thumbnail'), uploadCloud.upload,
    validate.createPost,
    controller.editPatch
)

router.delete("/delete/:id", controller.deleteItem)
router.get("/detail/:id", controller.detail)

module.exports = router