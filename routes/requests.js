const express = require('express');
const router = express.Router();
const Request = require('../models/request');
const Movement = require('../models/movement');
const Item = require('../models/item');

router.post('/', async (req, res) => {
  const { user, item, quantity, fromWarehouse, toWarehouse } = req.body;

  // Створення нової заявки
  const newRequest = new Request({
    user,
    item,
    quantity,
    date: new Date(),
    status: 'в опрацюванні',
    fromWarehouse,
    toWarehouse
  });

  await newRequest.save();
  res.send(newRequest);
});

router.post('/approve/:requestId', async (req, res) => {
  const { requestId } = req.params;
  try {
      const request = await Request.findById(requestId).populate('item user');
      if (!request) {
          return res.status(404).send({ message: 'Request not found' });
      }
      const { item, quantity, fromWarehouse, toWarehouse } = request;

      const fromItem = await Item.findOne({ _id: item._id, warehouse: fromWarehouse });
      if (!fromItem) {
          return res.status(404).send({ message: 'Item not found in the source warehouse' });
      }
      if (fromItem.quantity < quantity) {
          return res.status(400).send({ message: 'Not enough quantity in the source warehouse' });
      }

      fromItem.quantity -= quantity;
      await fromItem.save();

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

      const newMovement = new Movement({
          item: fromItem._id,
          quantity,
          fromWarehouse,
          toWarehouse,
          type: 'transfer',
          user: request.user._id
      });
      await newMovement.save();

      request.status = 'прийнята';
      try {
        await request.save();
        console.log('Request status updated:', request);
      } catch (error) {
        console.error('Error saving request:', error);
      }
      
      res.status(200).send(newMovement);
  } catch (error) {
      res.status(500).send({ message: 'Server error, unable to approve request' });
  }
});

router.post('/reject/:requestId', async (req, res) => {
  const { requestId } = req.params;
  try {
      const request = await Request.findById(requestId);
      if (!request) {
          return res.status(404).send({ message: 'Request not found' });
      }

      request.status = 'відмова';
      await request.save();
      res.status(200).send({ message: 'Request has been rejected' });
  } catch (error) {
      res.status(500).send({ message: 'Server error, unable to reject request' });
  }
});

module.exports = router;


/**
 * @swagger
 * components:
 *   schemas:
 *     Request:
 *       type: object
 *       required:
 *         - user
 *         - item
 *         - quantity
 *         - fromWarehouse
 *         - toWarehouse
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the request
 *         user:
 *           type: string
 *           description: The id of the user who submitted the request
 *         item:
 *           type: string
 *           description: The id of the item being requested
 *         quantity:
 *           type: number
 *           description: The quantity of the item being requested
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date of the request
 *         status:
 *           type: string
 *           description: The status of the request (прийнята, відмова, в опрацюванні)
 *         fromWarehouse:
 *           type: string
 *           description: The id of the source warehouse
 *         toWarehouse:
 *           type: string
 *           description: The id of the destination warehouse
 *       example:
 *         user: 60b8d295f531123456789abc
 *         item: 60b8d295f531123456789def
 *         quantity: 10
 *         fromWarehouse: 60b8d295f531123456789ghi
 *         toWarehouse: 60b8d295f531123456789jkl
 */

/**
 * @swagger
 * /requests:
 *   post:
 *     summary: Submit a request for items
 *     tags: [Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Request'
 *     responses:
 *       200:
 *         description: The request was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Request'
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /requests/approve/{requestId}:
 *   post:
 *     summary: Approve a request and execute the item transfer
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               toWarehouse:
 *                 type: string
 *                 description: The id of the destination warehouse
 *     responses:
 *       200:
 *         description: The request was successfully approved and the item transfer executed
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

/**
 * @swagger
 * /requests/reject/{requestId}:
 *   post:
 *     summary: Reject a request
 *     tags: [Requests]
 *     parameters:
 *       - in: path
 *         name: requestId
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the request
 *     responses:
 *       200:
 *         description: The request was successfully rejected
 *       404:
 *         description: Request not found
 *       500:
 *         description: Some server error
 */
