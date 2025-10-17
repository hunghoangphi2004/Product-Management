
// [GET] /admin/products
const filterStatusHelper = require("../../helpers/filterStatus.js")
const searchHelper = require("../../helpers/search.js");
const paginationHelper = require("../../helpers/pagination.js");
const systemConfig = require("../../config/system.js")
const createTreeHelper = require("../../helpers/createTree.js");

const ProductCategory = require("../../models/product-category.model.js");

module.exports.index = async (req, res) => {
    let find = {
        deleted: false,
    };

    const records = await ProductCategory.find(find).sort({ position: 'desc' });
    const newRecords = createTreeHelper.tree(records)
    console.log(newRecords)
    res.render("admin/pages/products-category/index", { title: "Trang danh mục sản phẩm", records: newRecords });
}

module.exports.create = async (req, res) => {

    let find = {
        deleted: false,
    }

    const records = await ProductCategory.find(find).sort({ position: 'desc' });
    const newRecords = createTreeHelper.tree(records)

    res.render("admin/pages/products-category/create", { title: "Tạo danh mục sản phẩm", records: newRecords });
}
module.exports.createPost = async (req, res) => {
    // console.log(req.body)
    if (req.body.position == "") {
        const count = await ProductCategory.countDocuments();
        req.body.position = count + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    const record = new ProductCategory(req.body, deleted = false);

    await record.save();

    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {

    try {
        const id = req.params.id;
        // console.log(id)
        const find = {
            deleted: false,
            _id: req.params.id
        }

        const productCategory = await ProductCategory.findOne(find)

        const records = await ProductCategory.find({
            deleted: false
        })
        const newRecords = createTreeHelper.tree(records)

        res.render("admin/pages/products-category/edit", { title: "Chỉnh sửa sản phẩm", productCategory: productCategory, records: newRecords });
    } catch (error) {
        req.flash('error', 'Không tìm thấy sản phẩm');
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }

}

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        req.body.position = parseInt(req.body.position)
        await ProductCategory.updateOne({ _id: id }, req.body);
        req.flash('success', 'Cập nhật sản phẩm thành công');
        res.redirect(req.get("referer"));
    } catch (error) {
        req.flash('error', 'Cập nhật sản phẩm thất bại');
        res.redirect(req.get("referer"));
    }
}