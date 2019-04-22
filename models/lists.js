const mongoose = require('mongoose');
const Item = require('./items');

const listSchema = mongoose.Schema({
    name: String,
    items: []
});

const List = module.exports = mongoose.model('List', listSchema);