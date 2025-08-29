const express = require('express')
const router = express.Router()
const listController = require('../../controllers/api/listController')
const authenticateToken = require('../../middleware/authenticateToken')
const itemRoutes = require('./items')

// List routes
router.get('', authenticateToken, listController.getUserLists)
router.get('/:id', authenticateToken, listController.getUserListById)

router.post('', authenticateToken, listController.createList)

router.patch('/:id', authenticateToken, listController.updateList)

router.delete('/:id', authenticateToken, listController.deleteListById)

// Nested routes (items)
router.use('/:listId/items', itemRoutes)

module.exports = router