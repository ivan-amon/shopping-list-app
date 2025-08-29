const express = require('express')
const path = require('path')
const userController = require('../controllers/userController')

const router = express.Router()

// GET
router.get('/register', userController.getRegisterForm)
router.get('/login', userController.getLoginForm)

// POST
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)


module.exports = router;

