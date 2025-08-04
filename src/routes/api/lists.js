const express = require('express')
const router = express.Router()
const listController = require('../../controllers/listController')
const authenticateToken = require('../../middleware/authenticateToken')

// GET
router.get('', authenticateToken, listController.getUserLists)
router.get('/:id', authenticateToken, listController.getUserListById)

// POST
router.post('', authenticateToken, listController.createList)

// PATCH
// router.patch('/:id', authenticateToken, listController.updateList)

module.exports = router