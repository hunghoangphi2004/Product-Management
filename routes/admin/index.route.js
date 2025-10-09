const dashboardRoutes = require('./dashboard.route.js');
const systemConfig = require('../../config/system');
const productRoutes = require('./product.route.js');
const productCategoryRoutes = require('./products-category.route.js')
const rolesRoutes =require('./roles.route.js')

module.exports = (app) => {
    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard", dashboardRoutes)
    app.use(PATH_ADMIN + "/products", productRoutes)
    app.use(PATH_ADMIN + "/products-category", productCategoryRoutes)
    app.use(PATH_ADMIN + "/roles", rolesRoutes)
}