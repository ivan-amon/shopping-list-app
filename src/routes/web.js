const express = require('express')
const path = require('path')

const router = express.Router()


router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'views', 'home.html'))
})

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