var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var likeSchema = new Schema({
    "post": {
        type: Schema.ObjectId,
        ref: 'posts'
    },
    "author": {
        type: Schema.ObjectId,
        ref: 'users'
    },
    "like": {
        type: Boolean,
        default: false
    }
});

var likes = mongoose.model('likes', likeSchema)
module.exports = {
    likes: likes
}