const express = require('express');
const router = express.Router();
const Item = require('../models/item');

/**
 * @swagger
 * components:
 *   schemas:
 *     Item:
 *       type: object
 *       required:
 *         - name
 *         - quantity
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the item
 *         name:
 *           type: string
 *           description: The name of the item
 *         description:
 *           type: string
 *           description: The description of the item
 *         quantity:
 *           type: number
 *           description: The quantity of the item
 *         price:
 *           type: number
 *           description: The price of the item
 *         category:
 *           type: string
 *           description: The category of the item
 *         warehouse:
 *           type: string
 *           description: The id of the warehouse where the item is stored
 *       example:
 *         name: Example Item
 *         description: This is an example item
 *         quantity: 100
 *         price: 10.50
 *         category: Example Category
 *         warehouse: 60b8d295f531123456789abc
 */

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: The items managing API
 */

/**
 * @swagger
 * /items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: The item was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       500:
 *         description: Some server error
 */
router.post('/', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).send(newItem);
  } catch (error) {
    res.status(500).send({ message: 'Server error, unable to create item' });
  }
});

/**
 * @swagger
 * /items/{id}:
 *   put:
 *     summary: Update an item by the id
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The item id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: The item was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: The item was not found
 *       500:
 *         description: Some error happened
 */
router.put('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).send({ message: 'Item not found' });
    }
    res.send(item);
  } catch (error) {
    res.status(500).send({ message: 'Server error, unable to update item' });
  }
});

/**
 * @swagger
 * /items/{id}:
 *   delete:
 *     summary: Delete an item by the id
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The item id
 *     responses:
 *       200:
 *         description: The item was deleted
 *       404:
 *         description: The item was not found
 *       500:
 *         description: Some error happened
 */
router.delete('/:id', async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).send({ message: 'Item not found' });
    }
    res.send({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).send({ message: 'Server error, unable to delete item' });
  }
});

/**
 * @swagger
 * /items:
 *   get:
 *     summary: Get items by category or name
 *     tags: [Items]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: The category of the item
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: The name of the item
 *     responses:
 *       200:
 *         description: List of items matching the category or name
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       500:
 *         description: Some error happened
 */
router.get('/', async (req, res) => {
  const { category, name } = req.query;
  try {
    const items = await Item.find({
      $or: [
        { category: new RegExp(category, 'i') },
        { name: new RegExp(name, 'i') }
      ]
    }).populate('warehouse');
    res.send(items);
  } catch (error) {
    res.status(500).send({ message: 'Server error, unable to fetch items' });
  }
});

/**
 * @swagger
 * /items/{id}:
 *   get:
 *     summary: Get an item by id
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The item id
 *     responses:
 *       200:
 *         description: The item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       404:
 *         description: The item was not found
 *       500:
 *         description: Some error happened
 */
router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('warehouse');
    if (!item) {
      return res.status(404).send({ message: 'Item not found' });
    }
    res.send(item);
  } catch (error) {
    res.status(500).send({ message: 'Server error, unable to fetch item' });
  }
});

module.exports = router;
