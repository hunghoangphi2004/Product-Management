
// [GET] /admin/products
const filterStatusHelper = require("../../helpers/filterStatus.js")
const searchHelper = require("../../helpers/search.js");
const paginationHelper = require("../../helpers/pagination.js");
const systemConfig = require("../../config/system.js")

const Product = require("../../models/product.model.js");

module.exports.index = async (req, res) => {
    // console.log(req.query.status)

    //Đoạn bộ lọc
    const filterStatus = filterStatusHelper(req.query);


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


    //Đoạn phân trang
    const countProducts = await Product.countDocuments(find);
    let objectPagination = await paginationHelper({
        limitItems: 4,
        currentPage: 1
    }, req.query, countProducts);

    //    await objectPagination(req, find);

    const products = await Product.find(find).sort({ position: "desc" }).limit(objectPagination.limitItems).skip(objectPagination.skip)
    // console.log(products);

    res.render("admin/pages/products/index", { title: "Trang sản phẩm", products: products, filterStatus: filterStatus, query: req.query, keyword: objectSearch.keyword, pagination: objectPagination });
}

// [PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    // console.log(req.params);
    const status = req.params.status;
    const id = req.params.id;

    await Product.updateOne({ _id: id }, { status: status })

    req.flash('success', 'Cập nhật trạng thái thành công');

    res.redirect(req.get("referer"));
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    console.log("req.body:", req.body);

    switch (type) {
        case "active":
            console.log(ids)
            await Product.updateMany({ _id: { $in: ids } }, { status: "active" });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);

            break;
        case "inactive":
            console.log(ids)
            await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);
            break;
        case "delete-all":
            console.log(ids)
            await Product.updateMany({ _id: { $in: ids } }, { deleted: true, deletedAt: new Date() });
            req.flash('success', `Xoá thành công ${ids.length} sản phẩm`);
            break;
        case "change-position":
            console.log(ids);
            for (const item of ids) {
                let [id, position] = item.split('-');
                position = parseInt(position);
                await Product.updateOne({ _id: id }, { position: position });
                req.flash('success', `Cập nhật vị trí thành công ${ids.length} sản phẩm`);
            }
            break;
        default:
            break;
    }

    res.redirect(req.get("referer"));
}

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await Product.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
    req.flash('success', `Xoá thành công 1 sản phẩm`);
    res.redirect(req.get("referer"));
}

// [GET] /admin/products/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/products/create", { title: "Thêm sản phẩm" });
}

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);
    if (req.body.position == "") {
        const countProducts = await Product.countDocuments();
        req.body.position = countProducts + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }

    // if (req.file) {
    //     req.body.thumbnail = `/uploads/${req.file.filename}`;

    // }

    const product = new Product(req.body, deleted = false);

    await product.save();

    res.redirect(`${systemConfig.prefixAdmin}/products`);
}

// [GET] /admin/products/edit/:id
module.exports.edit = async (req, res) => {

    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const product = await Product.findOne(find)
        console.log(product);
        res.render("admin/pages/products/edit", { title: "Chỉnh sửa sản phẩm", product: product });
    } catch (error) {
        req.flash('error', 'Không tìm thấy sản phẩm');
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }

}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {

    const id = req.params.id;

    req.body.price = parseInt(req.body.price);
    req.body.discountPercentage = parseInt(req.body.discountPercentage);
    req.body.stock = parseInt(req.body.stock);

    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`;

    }
    try {
        await Product.updateOne({ _id: id }, req.body);
        req.flash('success', 'Cập nhật sản phẩm thành công');
        res.redirect(req.get("referer"));
    } catch (error) {
        req.flash('error', 'Cập nhật sản phẩm thất bại');
        res.redirect(req.get("referer"));
    }
}

module.exports.detail = async(req,res)=>{
    try{
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const product = await Product.findOne(find);
        console.log(product)
        res.render("admin/pages/products/detail", { title: product.title, product: product });
    }
    catch(err){
        req.flash('error', 'Không tìm thấy sản phẩm');
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}