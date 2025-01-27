const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: String
});

const Warehouse = mongoose.model('Warehouse', warehouseSchema);

module.exports = Warehouse;
