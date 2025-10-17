module.exports.createPost = (req,res,next) => {
    if (!req.body.fullname) {
        req.flash('error', 'Họ tên không được để trống');
        res.redirect(req.get("referer"));
        return;
    }

    if (!req.body.email) {
        req.flash('error', 'Email không được để trống');
        res.redirect(req.get("referer"));
        return;
    }

    if (!req.body.password) {
        req.flash('error', 'Mật khẩu không được để trống');
        res.redirect(req.get("referer"));
        return;
    }

    next();
}

module.exports.editPatch = (req,res,next) => {
    if (!req.body.fullname) {
        req.flash('error', 'Họ tên không được để trống');
        res.redirect(req.get("referer"));
        return;
    }

    if (!req.body.email) {
        req.flash('error', 'Email không được để trống');
        res.redirect(req.get("referer"));
        return;
    }

    next();
}

