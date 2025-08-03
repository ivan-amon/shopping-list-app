const bcrypt = require('bcrypt')
const { User } = require('../database/models')

const register = async (req, res) => {
    
    try {
        const { name, email, password} = req.body

        const existingUser = await User.findOne({where: {email: email}})
        if(existingUser) {
            return res.status(400).json({error: 'That user is already registered'})
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({ name, email, password: hashedPassword })
        res.status(201).json({message: 'User registered', userId: newUser.id})

    } catch(err) {
        console.log(err)
        res.status(500).json({error: 'Error registering user'})
    }
}

const login = async (req, res) => {
    
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: {email: email}})
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!user || !isPasswordValid) {
            return res.status(400).json({error: 'Invalid credentials'})
        }

        res.status(200).json({message: 'Login succesful', userId: user.id})

    } catch(err) {
        res.status(500).json({error: 'Error logging user'})
    }
}

module.exports = { register, login }
