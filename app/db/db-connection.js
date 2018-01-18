var mongoose = require('mongoose');
require('dotenv').config();
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/Products');

//mongodb://<dbuser>:<dbpassword>@ds123752.mlab.com:23752/heroku_1dgc81k5
mongoose.connect(process.env.MONGODB_URL_LOC);

//createConnection is used when multiple connection is made
//connect is used for single connection
//mongoose.connect('mongodb://localhost:27017/bangg');
module.exports = {
    mongoose: mongoose
};