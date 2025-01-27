const express = require('express');
const router = express.Router();
const User = require('../models/user');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         email:
 *           type: string
 *           description: The user's email
 *         password:
 *           type: string
 *           description: The user's password (hashed)
 *       example:
 *         id: 60b8d295f531123456789abc
 *         firstName: John
 *         lastName: Doe
 *         email: john.doe@example.com
 *         password: $2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36nESa51fLbgHqknFbcwK7S
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by the id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send({ message: 'User deleted' });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
