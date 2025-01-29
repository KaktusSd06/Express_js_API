const express = require('express');
const router = express.Router();
const Warehouse = require('../models/warehouse');
const Item = require('../models/item');

/**
 * @swagger
 * components:
 *   schemas:
 *     Warehouse:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the warehouse
 *         name:
 *           type: string
 *           description: The name of the warehouse
 *       example:
 *         name: Main Warehouse
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ItemQuantity:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the item
 *         quantity:
 *           type: number
 *           description: The quantity of the item
 *       example:
 *         name: Example Item
 *         quantity: 100
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WarehouseDetails:
 *       type: object
 *       properties:
 *         warehouse:
 *           $ref: '#/components/schemas/Warehouse'
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ItemQuantity'
 *       example:
 *         warehouse:
 *           id: d5fE_asz
 *           name: Main Warehouse
 *         items:
 *           - name: Example Item
 *             quantity: 100
 */

/**
 * @swagger
 * tags:
 *   name: Warehouses
 *   description: The warehouses managing API
 */

/**
 * @swagger
 * /warehouses:
 *   post:
 *     summary: Create a new warehouse
 *     tags: [Warehouses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Warehouse'
 *     responses:
 *       200:
 *         description: The warehouse was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warehouse'
 *       500:
 *         description: Some server error
 */
router.post('/', async (req, res) => {
  try {
    const newWarehouse = new Warehouse(req.body);
    await newWarehouse.save();
    res.status(201).send(newWarehouse);
  } catch (error) {
    res.status(500).send({ message: 'Server error, unable to create warehouse' });
  }
});

/**
 * @swagger
 * /warehouses/{id}:
 *   put:
 *     summary: Update a warehouse by the id
 *     tags: [Warehouses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The warehouse id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Warehouse'
 *     responses:
 *       200:
 *         description: The warehouse was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warehouse'
 *       404:
 *         description: The warehouse was not found
 *       500:
 *         description: Some error happened
 */
router.put('/:id', async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!warehouse) {
      return res.status(404).send({ message: 'Warehouse not found' });
    }
    res.send(warehouse);
  } catch (error) {
    res.status(500).send({ message: 'Server error, unable to update warehouse' });
  }
});

/**
 * @swagger
 * /warehouses/{id}:
 *   delete:
 *     summary: Delete a warehouse by the id
 *     tags: [Warehouses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The warehouse id
 *     responses:
 *       200:
 *         description: The warehouse was deleted
 *       404:
 *         description: The warehouse was not found
 *       500:
 *         description: Some error happened
 */
router.delete('/:id', async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);
    if (!warehouse) {
      return res.status(404).send({ message: 'Warehouse not found' });
    }
    res.send({ message: 'Warehouse deleted' });
  } catch (error) {
    res.status(500).send({ message: 'Server error, unable to delete warehouse' });
  }
});

/**
 * @swagger
 * /warehouses/{id}:
 *   get:
 *     summary: Get a warehouse by id
 *     tags: [Warehouses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The warehouse id
 *     responses:
 *       200:
 *         description: The warehouse details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Warehouse'
 *       404:
 *         description: The warehouse was not found
 *       500:
 *         description: Some error happened
 */
router.get('/:id', async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);
    if (!warehouse) {
      return res.status(404).send({ message: 'Warehouse not found' });
    }
    res.send(warehouse);
  } catch (error) {
    res.status(500).send({ message: 'Server error, unable to fetch warehouse' });
  }
});

/**
 * @swagger
 * /warehouses:
 *   get:
 *     summary: Get all warehouses
 *     tags: [Warehouses]
 *     responses:
 *       200:
 *         description: List of all warehouses
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Warehouse'
 *       500:
 *         description: Some error happened
 */
router.get('/', async (req, res) => {
  try {
    const warehouses = await Warehouse.find();
    res.send(warehouses);
  } catch (error) {
    res.status(500).send({ message: 'Server error, unable to fetch warehouses' });
  }
});

/**
 * @swagger
 * /warehouses/{id}/items:
 *   get:
 *     summary: Get warehouse details and all items with their quantities by warehouse id
 *     tags: [Warehouses]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The warehouse id
 *     responses:
 *       200:
 *         description: Warehouse details and list of items with their quantities in the warehouse
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WarehouseDetails'
 *       404:
 *         description: The warehouse or items were not found
 *       500:
 *         description: Some error happened
 */
router.get('/:id/items', async (req, res) => {
  try {
    const warehouseId = req.params.id;
    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).send({ message: 'Warehouse not found' });
    }
    const items = await Item.find({ warehouse: warehouseId }).select('name quantity');
    res.send({
      warehouse,
      items
    });
  } catch (error) {
    res.status(500).send({ message: 'Server error, unable to fetch warehouse items' });
  }
});

module.exports = router;
