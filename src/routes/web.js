const express = require('express')
const path = require('path')
const listController = require('../controllers/listController')

const router = express.Router()

// GET
router.get('/home', listController.getUserLists)
router.get('/lists/new', (req, res) => { res.render('addList') })

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'auth', 'register.html'))
})

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'auth', 'login.html'))
})


// POST
router.post('/lists/new', listController.createList)

module.exports = router;