const express = require('express')
const router = express.Router()
const userController = require('../../controllers/userController')
const authenticateToken = require('../../middleware/authenticateToken')

router.post('/register', userController.register)
router.post('/login', userController.login)

router.get('/action', authenticateToken, (req, res) => {
    res.json( {message: 'You are authorized to perform this action', userId: req.user.userId})
})

module.exports = router
