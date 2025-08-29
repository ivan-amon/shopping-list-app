const express = require('express')
const path = require('path')
const listController = require('../controllers/listController')
const itemController = require('../controllers/itemController')
const { auth } = require('../middleware/webAuth')

const router = express.Router()

// GET
router.get('/home', auth, listController.getUserLists)
router.get('/lists/new', auth, listController.getCreateListForm)
router.get('/lists/delete/:id', auth, listController.deleteListById)
router.get('/lists/edit/:id', auth, listController.getUpdateListForm)
router.get('/lists/:listId/items', auth, itemController.getListItems)
router.get('/lists/:listId/items/new', auth, itemController.getCreateItemForm)
router.get('/lists/:listId/items/delete/:id', auth, itemController.deleteListItemById)

// POST
router.post('/lists/new', auth, listController.createList)
router.post('/lists/edit/:id', auth, listController.updateList)
router.post('/lists/:listId/items/new', auth, itemController.createListItem)


module.exports = router;