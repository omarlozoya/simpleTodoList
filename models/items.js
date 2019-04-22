const mongoose = require('mongoose');

const itemSchema = mongoose.Schema({
    name: String
});

const Item = module.exports = mongoose.model('Item', itemSchema);