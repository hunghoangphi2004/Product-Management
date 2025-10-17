const productRoutes = require('./products.route.js')
const homeRoutes = require('./home.route.js')
const controller = require('../../controllers/client/home.controller.js')
const categoryMiddleware = require("../../middlewares/clients/category.middleware.js")

module.exports = (app) => {
    app.use(categoryMiddleware.category)
    app.use('/products',  productRoutes)
    app.use('/', homeRoutes)
}