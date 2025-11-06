const filterStatusHelper = require("../../helpers/filterStatus.js")
const searchHelper = require("../../helpers/search.js");
const paginationHelper = require("../../helpers/pagination.js");
const systemConfig = require("../../config/system.js")
const createTreeHelper = require("../../helpers/createTree.js");
const ProductCategory = require("../../models/product-category.model.js");
const Account = require("../../models/account.model.js")

// [GET] /admin/products-category/index
module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelper(req.query);
  let find = { deleted: false };

  if (req.query.status) {
    find.status = req.query.status;
  } else {
  }

  // Đoạn tìm kiếm
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  // Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // End Sort

  // Đoạn phân trang
  const countProductCategory = await ProductCategory.countDocuments(find);
  let objectPagination = await paginationHelper(
    {
      limitItems: 4,
      currentPage: 1,
    },
    req.query,
    countProductCategory
  );

  const records = await ProductCategory.find(find)
    .sort(sort)
    // .limit(objectPagination.limitItems)
    // .skip(objectPagination.skip);

  for (const record of records) {
    // Lấy ra thông tin người tạo
    const user = await Account.findOne({
      _id: record.createdBy.account_id,
    });
    if (user) {
      record.accountFullName = user.fullname;
    }

    // Lấy ra thông tin người cập nhật gần nhất
    const updatedBy = record.updatedBy[record.updatedBy.length - 1];
    if (updatedBy) {
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id,
      });
      updatedBy.accountFullName = userUpdated.fullname;
    }
  }

  const newRecords = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/index", {
    title: "Trang danh mục sản phẩm",
    records: newRecords,
    filterStatus: filterStatus,
    query: req.query,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};


// [GET] /admin/products-category/create
module.exports.create = async (req, res) => {

    let find = {
        deleted: false,
    }

    const records = await ProductCategory.find(find).sort({ position: 'desc' });
    const newRecords = createTreeHelper.tree(records)

    res.render("admin/pages/products-category/create", { title: "Tạo danh mục sản phẩm", records: newRecords });
}

// [POST] /admin/products-category/create
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
    req.flash('success', `Tạo thành công 1 danh mục`);
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
}

// [PATCH] /admin/products-category//change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    // console.log(req.params);
    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await ProductCategory.updateOne({ _id: id }, { status: status, $push: { updatedBy: updatedBy } })

    req.flash('success', 'Cập nhật trạng thái thành công');

    res.redirect(req.get("referer"));
}

// [PATCH] /admin/products-category/change-multi
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    // console.log("req.body:", req.body);
    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    switch (type) {
        case "active":
            // console.log(ids)
            await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "active", $push: { updatedBy: updatedBy } });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);

            break;
        case "inactive":
            // console.log(ids)
            await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "inactive", $push: { updatedBy: updatedBy } });
            req.flash('success', `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);
            break;
        case "delete-all":
            // console.log(ids)
            await ProductCategory.updateMany({ _id: { $in: ids } }, {
                deleted: true,
                //  deletedAt: new Date(), 
                deletedBy: { account_id: res.locals.user.id, deletedAt: new Date() }
            });
            req.flash('success', `Xoá thành công ${ids.length} sản phẩm`);
            break;
        case "change-position":
            // console.log(ids);
            for (const item of ids) {
                let [id, position] = item.split('-');
                position = parseInt(position);
                await ProductCategory.updateOne({ _id: id }, { position: position, $push: { updatedBy: updatedBy } });
                req.flash('success', `Cập nhật vị trí thành công ${ids.length} sản phẩm`);
            }
            break;
        default:
            break;
    }

    res.redirect(req.get("referer"));
}

// [GET] /admin/products-category/edit/:id
module.exports.edit = async (req, res) => {
    console.log(req.params.id)
    try {
        const id = req.params.id;
        // console.log(id)
        const find = {
            deleted: false,
            _id: id
        }

        const productCategory = await ProductCategory.findOne(find)

        const records = await ProductCategory.find({
            deleted: false
        })
        const newRecords = createTreeHelper.tree(records)

        res.render("admin/pages/products-category/edit", { title: "Chỉnh sửa sản phẩm", productCategory: productCategory, records: newRecords });
    } catch (error) {
        req.flash('error', 'Không tìm thấy danh mục sản phẩm');
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }

}

// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {
    try {
        const id = req.params.id;
        req.body.position = parseInt(req.body.position)
        await ProductCategory.updateOne({ _id: id }, req.body);
        req.flash('success', 'Cập nhật sản phẩm thành công');
        res.redirect(req.get("referer"));
    } catch (error) {
        S(error)
        req.flash('error', 'Cập nhật sản phẩm thất bại');
        res.redirect(req.get("referer"));
    }
}

// [DELETE] /admin/products-category/delete/:id
module.exports.deleteItem = async (req, res) => {
    const id = req.params.id;
    await ProductCategory.updateOne({ _id: id }, { deleted: true, deletedBy: { account_id: res.locals.user.id, deletedAt: new Date() } });
    req.flash('success', `Xoá thành công 1 sản phẩm`);
    res.redirect(req.get("referer"));
}

// [GET] /admin/products-category/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            _id: req.params.id,
            deleted: false
        };

        const productCategory = await ProductCategory.findOne(find);
        console.log(productCategory)
        let parentCategory = null;
        if (productCategory.parent_id && productCategory.parent_id.trim() !== "") {
            parentCategory = await ProductCategory.findOne({ _id: productCategory.parent_id });
        }

        productCategory.parent = parentCategory ? parentCategory.title : "Không có";
        res.render("admin/pages/products-category/detail", { productCategory: productCategory });
    }
    catch (err) {
        console.log(err)
        req.flash('error', 'Không tìm thấy danh mục sản phẩm');
        res.redirect(`${systemConfig.prefixAdmin}/products-category`);
    }
}