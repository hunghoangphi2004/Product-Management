
// [GET] /admin/
module.exports.index = (req, res) => {
    res.render("clients/pages/home/index", { title: "Trang chủ" })
}