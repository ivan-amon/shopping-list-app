const express = require('express')
const path = require('path')
const listController = require('../controllers/listController')
const itemController = require('../controllers/itemController')

const router = express.Router()

// GET
router.get('/home', listController.getUserLists)
router.get('/lists/new', (req, res) => { res.render('addList') })
router.get('/lists/delete/:id', listController.deleteListById)
router.get('/lists/edit/:id', listController.getUpdateListForm)
router.get('/lists/:listId/items', itemController.getListItems)
router.get('/lists/:listId/items/new', itemController.getCreateItemForm)
router.get('/lists/:listId/items/delete/:id', itemController.deleteListItemById)

// POST
router.post('/lists/new', listController.createList)
router.post('/lists/edit/:id', listController.updateList)
router.post('/lists/:listId/items/new', itemController.createListItem)

module.exports = router;