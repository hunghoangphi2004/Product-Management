const express = require('express');
const router = express.Router();
const userController = require("../../controllers/client/user.controller")
const validate = require("../../validates/client/user.validate")

router.get('/register', userController.register)

router.post('/register',validate.registerPost, userController.registerPost)

router.get('/login', userController.login)

router.post('/login',validate.loginPost, userController.loginPost)

router.get('/logout', userController.logout)

router.get('/password/forgot', userController.forgotPassword)

router.post('/password/forgot',validate.forgotPasswordPost, userController.forgotPasswordPost)

module.exports = router