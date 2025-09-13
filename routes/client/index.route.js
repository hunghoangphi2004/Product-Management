const productRoutes = require('./products.route.js')
const homeRoutes = require('./home.route.js')
const controller = require('../../controllers/client/home.controller.js')
module.exports = (app) => {
    app.get('/', controller.index)

    app.use('/products', productRoutes)
    app.use('/home', homeRoutes)
}