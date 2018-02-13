var express = require('express');
var router = express.Router();
/* GET templates pages. */


router.get('/dashboard', (req, res, next) => {
    res.render('templates/dashboard');
});

router.get('/content', (req, res, next) => {
    res.render('templates/content');
});

router.get('/filter', (req, res, next) => {
    res.render('templates/filter-content');
});
router.get('/writer', (req, res, next) => {
    res.render('templates/writer');
});
/* router.get('/dashboard-author', function(req, res, next) {
    res.render('templates/dashboard-author');
}); */


module.exports = { router };