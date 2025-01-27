const express = require('express');
const router = express.Router();
const Warehouse = require('../models/warehouse');

// Додавання нового складу
router.post('/', async (req, res) => {
  const newWarehouse = new Warehouse(req.body);
  await newWarehouse.save();
  res.send(newWarehouse);
});

// Оновлення складу
router.put('/:id', async (req, res) => {
  const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(warehouse);
});

// Видалення складу
router.delete('/:id', async (req, res) => {
  await Warehouse.findByIdAndDelete(req.params.id);
  res.send({ message: 'Warehouse deleted' });
});

// Отримання усіх складів
router.get('/', async (req, res) => {
  const warehouses = await Warehouse.find();
  res.send(warehouses);
});

module.exports = router;
