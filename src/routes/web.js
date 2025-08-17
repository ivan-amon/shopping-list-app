const express = require('express')
const path = require('path')
const listController = require('../controllers/listController')

const router = express.Router()


router.get('/home', listController.getUserLists)

router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'auth', 'register.html'))
})

router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'auth', 'login.html'))
})

router.get('/lists/new', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'addList.html'))
})

module.exports = router;