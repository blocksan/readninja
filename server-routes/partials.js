var express = require('express');
var router = express.Router();

/* GET partials . */

router.get('/header', (req, res, next) => {
    res.render('partials/header');
});
router.get('/footer', (req, res, next) => {
    res.render('partials/footer');
});
router.get('/postsTabs', (req, res, next) => {
    res.render('partials/posts--tabs--container');
});
router.get('/settings', (req, res, next) => {
    res.render('partials/basic--info');
});
router.get('/home', (req, res, next) => {
    res.render('partials/home--author--container');
});
module.exports = { router };