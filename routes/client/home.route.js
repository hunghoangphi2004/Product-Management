const express = require('express');
const router = express.Router();
router.get('/', async (req, res) => {
    res.render("clients/pages/home/index.pug")
})

module.exports = router