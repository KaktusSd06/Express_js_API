const express = require('express');
const router = express.Router();
const Movement = require('../models/movement');
const Item = require('../models/item');

// Реєстрація переміщення товарів між складами
router.post('/transfer', async (req, res) => {
  const { itemId, quantity, fromWarehouse, toWarehouse } = req.body;

  // Відняти кількість товару зі складу-відправника
  const fromItem = await Item.findOne({ _id: itemId, warehouse: fromWarehouse });
  if (!fromItem) {
    return res.status(404).send('Item not found in the source warehouse');
  }
  if (fromItem.quantity < quantity) {
    return res.status(400).send('Not enough quantity in the source warehouse');
  }
  fromItem.quantity -= quantity;
  await fromItem.save();

  // Додати кількість товару на склад-отримувач
  const toItem = await Item.findOne({ _id: itemId, warehouse: toWarehouse });
  if (!toItem) {
    return res.status(404).send('Item not found in the destination warehouse');
  }
  toItem.quantity += quantity;
  await toItem.save();

  // Реєстрація переміщення
  const newMovement = new Movement({
    item: itemId,
    quantity,
    fromWarehouse,
    toWarehouse,
    type: 'transfer'
  });

  await newMovement.save();
  res.send(newMovement);
});

// Генерація звітів по переміщенню товарів
router.get('/report/:warehouseId', async (req, res) => {
  const { warehouseId } = req.params;
  const movements = await Movement.find({
    $or: [
      { fromWarehouse: warehouseId },
      { toWarehouse: warehouseId }
    ]
  }).populate('item fromWarehouse toWarehouse');
  res.send(movements);
});

module.exports = router;
