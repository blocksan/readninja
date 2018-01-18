var express = require('express');
var router = express.Router();

/* GET partials . */

router.get('/header', function(req, res, next) {

    res.render('partials/header');
});
router.get('/footer', function(req, res, next) {

    res.render('partials/footer');
});
router.get('/postsTabs', function(req, res, next) {

    res.render('partials/posts--tabs--container');
});
router.get('/settings', function(req, res, next) {

    res.render('partials/basic--info--container');
});
router.get('/home', function(req, res, next) {

    res.render('partials/home--author--container');
});
module.exports = { router: router };