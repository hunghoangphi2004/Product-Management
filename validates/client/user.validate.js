module.exports.registerPost = (req, res, next) => {
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

module.exports.loginPost = (req, res, next) => {
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

module.exports.forgotPasswordPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash('error', 'Email không được để trống');
        res.redirect(req.get("referer"));
        return;
    }

    next();
}

module.exports.resetPasswordPost = (req, res, next) => {
    if (!req.body.password) {
        req.flash('error', 'Vui lòng nhập mật khẩu');
        res.redirect(req.get("referer"));
        return;
    }

    if (!req.body.confirmPassword) {
        req.flash('error', 'Vui lòng xác nhận mật khẩu');
        res.redirect(req.get("referer"));
        return;
    }

    if(req.body.password != req.body.confirmPassword){
        req.flash('error', 'Mật khẩu không khớp');
        res.redirect(req.get("referer"));
        return;
    }

    next();
}