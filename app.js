var express = require('express');
var cors = require('cors')
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
//var datadump = require('./server-routes/datadump').router;

var app = express();
app.use(compression());
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', '/favicons/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//CORS
app.all("/*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
    return next();
});

var routes = require('./server-routes/index').router;
var templates = require('./server-routes/templates').router;
var partials = require('./server-routes/partials').router;
var apidata = require('./server-routes/apidata').router;
var apiauth = require('./server-routes/apiauth').router;



app.use('/', routes);
app.use('/templates', templates);
app.use('/partials', partials);
app.use('/apidata', apidata);
app.use('/apiauth', apiauth);


app.use(function(req, res, next) {
    res.render('index');
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;