var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var authorSchema = new Schema({
    "name": {
        "type": String,
        "trim": true,
        "minlength": 1
    },
    "avatar": {
        "type": String,
        "trim": true,
        "minlength": 1
    },
    "tagline": {
        "type": String,
        "trim": true
    },
    "username": {
        "type": String
    },
    "email": {
        "type": String,
        "trim": true
    },
    "password": {
        "type": String
    },
    "website": {
        "type": String
    },
    "bio": {
        "type": String
    },
    "gitU": {
        "type": String
    },
    "instaU": {
        "type": String
    },
    "fbU": {
        "type": String
    },
    "twitU": {
        "type": String
    },
    "numberposts": {
        "type": Number,
        default: 0
    },
    "likes": {
        "type": Number,
        default: 0
    },
    "claps": {
        "type": Number,
        default: 0
    },
    "tags": {
        type: Array,
        default: []
    }

});

var authors = mongoose.model('authors', authorSchema)
module.exports = {
    authors: authors
}