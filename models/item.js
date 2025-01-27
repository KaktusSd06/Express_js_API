const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  quantity: Number,
  price: Number,
  category: String
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
