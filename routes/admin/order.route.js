const express = require('express');
const controller = require('../../controllers/admin/order.controller.js');
const router = express.Router();

router.get('/', controller.index)

router.patch("/change-status/:status/:id", controller.changeStatus)


router.delete("/delete/:id", controller.deleteItem)

router.get("/detail/:id", controller.detail)

module.exports = router