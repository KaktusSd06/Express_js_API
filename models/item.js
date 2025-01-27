const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  description: String,
  quantity: Number,
  price: Number,
  category: String,
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
