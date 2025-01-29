const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
  quantity: Number,
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['прийнята', 'відмова', 'в опрацюванні'], default: 'в опрацюванні' },
  fromWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' },
  toWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse' }
});

const Request = mongoose.model('Request', requestSchema);

module.exports = Request;
