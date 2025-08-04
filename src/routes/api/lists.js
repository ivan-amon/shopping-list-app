const express = require('express')
const router = express.Router()
const listController = require('../../controllers/listController')
const authenticateToken = require('../../middleware/authenticateToken')

router.get('', authenticateToken, listController.getUserLists)
router.post('', authenticateToken, listController.createList)

module.exports = router