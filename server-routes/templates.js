var express = require('express');
var router = express.Router();
/* GET templates pages. */


router.get('/dashboard', function(req, res, next) {
    res.render('templates/dashboard');
});

router.get('/content', function(req, res, next) {
    res.render('templates/content');
});

router.get('/filter', function(req, res, next) {
    res.render('templates/filter-tutorials');
});
/* router.get('/dashboard-author', function(req, res, next) {
    res.render('templates/dashboard-author');
}); */


module.exports = { router: router };