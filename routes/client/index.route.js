const productRoutes = require('./products.route.js')
const homeRoutes = require('./home.route.js')
const categoryMiddleware = require("../../middlewares/clients/category.middleware.js")
const cartMiddleware = require("../../middlewares/clients/cart.middleware.js")
const searchRoutes = require("./search.route.js")
const cartRoutes = require("./cart.route.js")

module.exports = (app) => {
    app.use(categoryMiddleware.category)
    app.use(cartMiddleware.cartId)
    app.use('/products',  productRoutes)
    app.use('/', homeRoutes)
    app.use('/search', searchRoutes)
    app.use('/cart', cartRoutes)
}