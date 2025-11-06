
// [GET] /admin/products
const orderfilterStatusHelper = require("../../helpers/orderFilterStatus.js")
const searchHelper = require("../../helpers/search.js");
const productHelper = require("../../helpers/products")
const paginationHelper = require("../../helpers/pagination.js");
const systemConfig = require("../../config/system.js")
const Order = require("../../models/order.model.js");
const Account = require("../../models/account.model.js")
const Product = require("../../models/product.model.js")

module.exports.index = async (req, res) => {
    // console.log(req.query.status)

    //Đoạn bộ lọc
    const filterStatus = orderfilterStatusHelper(req.query);


    let find = {
        deleted: false,
    };

    if (req.query.status) {
        find.status = req.query.status
    } else {

    }

    //Đoạn tìm kiếm
    const objectSearch = searchHelper(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }

    //Sort
    let sort = {}

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    else {
        sort.position = "desc"
    }
    //End Sort


    //Đoạn phân trang
    const countOrder = await Order.countDocuments(find);
    let objectPagination = await paginationHelper({
        limitItems: 4,
        currentPage: 1
    }, req.query, countOrder);

    //    await objectPagination(req, find);
    const orders = await Order.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip)
    for (const order of orders) {
        //Lấy ra thông tin người tạo
        // const user = await Account.findOne({ _id: product.createdBy.account_id })
        // if (user) {
        //     product.accountFullName = user.fullname;
        // }

        //Lấy ra thông tin người cập nhật gần nhất
        const updatedBy = order.updatedBy[order.updatedBy.length - 1];
        if (updatedBy) {
            const userUpdated = await Account.findOne({ _id: updatedBy.account_id })
            if (userUpdated) {
                updatedBy.accountFullName = userUpdated.fullname;
            } else {
                updatedBy.accountFullName = "Không tồn tại";
            }

        }

    }

    res.render("admin/pages/orders/index", { title: "Trang đơn hàng", orders: orders, filterStatus: filterStatus, query: req.query, keyword: objectSearch.keyword, pagination: objectPagination });
}

// [PATCH] /admin/orders/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    // console.log(req.params);
    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await Order.updateOne({ _id: id }, { status: status, $push: { updatedBy: updatedBy } })

    req.flash('success', 'Cập nhật trạng thái thành công');

    res.redirect(req.get("referer"));
}

// [GET] /admin/orders/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            _id: req.params.id,
            deleted: false
        };

        let order = await Order.findOne(find);
        if (!order) {
            req.flash('error', 'Không tìm thấy đơn hàng');
            return res.redirect(`${systemConfig.prefixAdmin}/orders`);
        }

        // order = order.toObject();

        for (const product of order.products) {
            const productInfo = await Product.findOne({ _id: product.product_id }).select("title thumbnail");
            if (productInfo) {
                product.title = productInfo.title;
                product.thumbnail = productInfo.thumbnail;
            } else {
                product.title = "Sản phẩm không tồn tại";
                product.thumbnail = "";
            }
            product.priceNew = productHelper.priceNewProduct(product)
            product.totalPrice = product.priceNew * product.quantity
        }
        order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0)

        res.render("admin/pages/orders/detail", { order });
    } catch (err) {
        console.error(err);
        req.flash('error', 'Không tìm thấy đơn hàng');
        res.redirect(`${systemConfig.prefixAdmin}/orders`);
    }
};

// [DELETE] /admin/orders/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Order.updateOne({ _id: id }, { deleted: true, deletedBy: { account_id: res.locals.user.id, deletedAt: new Date() } });
    req.flash('success', `Xoá thành công 1 đơn hàng`);
    res.redirect(req.get("referer"));
}