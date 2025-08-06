const express = require('express')
const router = express.Router({ mergeParams: true })
const itemController = require('../../controllers/itemController')
const authenticateToken = require('../../middleware/authenticateToken')


router.get('', authenticateToken, itemController.getListItems)
router.get('/:id', authenticateToken, itemController.getListItemById)

router.post('', authenticateToken, itemController.createListItem)

router.patch('/:id', authenticateToken, itemController.updateListItemById)

router.delete('/:id', authenticateToken, itemController.deleteListItemById)

module.exports = router