const express = require('express')
const path = require('path')
const userController = require('../controllers/userController')

const router = express.Router()

// GET
router.get('/register', (req, res) => { res.render('auth/register')})
router.get('/login', (req, res) => { res.render('auth/login')})

// POST
router.post('/register', userController.register)
router.post('/login', userController.login)
router.post('/logout', userController.logout)


module.exports = router;

