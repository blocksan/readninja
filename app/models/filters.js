var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var filterSchema = new Schema({
    "tags": {
        "type": Array,
        default: []
    },
    "category": {
        "type": Array,
        default: []
    },
    "difficulty": {
        "type": Array,
        default: []
    },
    "readtime": {
        "type": Array,
        default: []
    }
});

var filters = mongoose.model('filters', filterSchema)
module.exports = {
    filters: filters
}