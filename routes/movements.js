const express = require('express');
const router = express.Router();
const Movement = require('../models/movement');
const Item = require('../models/item');

/**
 * @swagger
 * components:
 *   schemas:
 *     Movement:
 *       type: object
 *       required:
 *         - itemId
 *         - quantity
 *         - fromWarehouse
 *         - toWarehouse
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the movement
 *         itemId:
 *           type: string
 *           description: The id of the item being moved
 *         quantity:
 *           type: number
 *           description: The quantity of the item being moved
 *         fromWarehouse:
 *           type: string
 *           description: The id of the source warehouse
 *         toWarehouse:
 *           type: string
 *           description: The id of the destination warehouse
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date of the movement
 *         type:
 *           type: string
 *           description: The type of the movement
 *       example:
 *         itemId: 60b8d295f531123456789abc
 *         quantity: 50
 *         fromWarehouse: 60b8d295f531123456789def
 *         toWarehouse: 60b8d295f531123456789ghi
 *         date: 2025-01-27T18:17:00.000Z
 *         type: transfer
 */

/**
 * @swagger
 * tags:
 *   name: Movements
 *   description: The movements managing API
 */

/**
 * @swagger
 * /movements/transfer:
 *   post:
 *     summary: Register a transfer of items between warehouses
 *     tags: [Movements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movement'
 *     responses:
 *       200:
 *         description: The movement was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movement'
 *       404:
 *         description: Item not found in the source warehouse
 *       400:
 *         description: Not enough quantity in the source warehouse
 *       500:
 *         description: Some server error
 */
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

  // Додати або створити товар на складі-отримувачі
  let toItem = await Item.findOne({ name: fromItem.name, warehouse: toWarehouse });
  if (!toItem) {
    toItem = new Item({
      name: fromItem.name,
      description: fromItem.description,
      price: fromItem.price,
      category: fromItem.category,
      quantity: 0,
      warehouse: toWarehouse
    });
  }
  toItem.quantity += quantity;
  await toItem.save();

  // Реєстрація переміщення
  const newMovement = new Movement({
    item: fromItem._id,
    quantity,
    fromWarehouse,
    toWarehouse,
    type: 'transfer'
  });

  await newMovement.save();
  res.send(newMovement);
});

/**
 * @swagger
 * /movements/report/{warehouseId}:
 *   get:
 *     summary: Generate reports of item movements involving a specific warehouse
 *     tags: [Movements]
 *     parameters:
 *       - in: path
 *         name: warehouseId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the warehouse
 *     responses:
 *       200:
 *         description: List of movements involving the warehouse
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movement'
 *       500:
 *         description: Some error happened
 */
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
