var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var postSchema = new Schema({
    "heading": {
        type: String,
        //"required": true,
        "trim": true,
        //"minlength": 1
    },
    "alias": String,
    "body": {
        "type": String,
        //"required": true,
        "trim": true,
        //"minlength": 1
    },
    "tags": {
        type: Array,
        "default": []
    },

    "banner": {
        "type": String,
        //"required": true,
        "trim": true,
        //"minlength": 1
    },
    "difficulty": {
        "type": String,
        //"required": true,
        "trim": true,
        //"minlength": 1
    },
    "likes": {
        "type": Number,
        default: 0
    },
    "shares": {
        "type": Number,
        default: 0
    },
    "views": {
        "type": Number,
        default: 0
    },
    "claps": {
        "type": Number,
        default: 0
    },
    "type": {
        "type": String
    },
    "readtime": {
        "type": Number,
        //"required": true
    },
    "dateadded": {
        "type": String,
        //"required": true
    },
    "status": {
        "type": String
    },
    "user": {
        type: Schema.ObjectId,
        ref: 'users'
    },
    "codeurl": {
        "type": String
    },
    "comments": [{
        "author": {
            type: String
        },
        "comment": {
            type: String
        },
        "timestamp": {
            type: String
        }
    }]

});

var posts = mongoose.model('posts', postSchema)
module.exports = {
    posts: posts
}