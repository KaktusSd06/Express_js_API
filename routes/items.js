const express = require('express');
const router = express.Router();
const Item = require('../models/item');

// Додавання нового товару
router.post('/', async (req, res) => {
  const newItem = new Item(req.body);
  await newItem.save();
  res.send(newItem);
});

// Оновлення товару
router.put('/:id', async (req, res) => {
  const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(item);
});

// Видалення товару
router.delete('/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.send({ message: 'Item deleted' });
});

// Пошук товарів за категорією або назвою
router.get('/', async (req, res) => {
  const { category, name } = req.query;
  const items = await Item.find({
    $or: [
      { category: new RegExp(category, 'i') },
      { name: new RegExp(name, 'i') }
    ]
  }).populate('warehouse');
  res.send(items);
});

module.exports = router;
