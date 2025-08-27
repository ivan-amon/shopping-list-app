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

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'auth', 'register.html'))
})

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'auth', 'login.html'))
})

// POST
router.post('/lists/new', listController.createList)
router.post('/lists/edit/:id', listController.updateList)

module.exports = router;