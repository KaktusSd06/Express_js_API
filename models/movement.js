const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  quantity: Number,
  date: { type: Date, default: Date.now },
  fromWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  toWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  type: String
});

const Movement = mongoose.model('Movement', movementSchema);

module.exports = Movement;
