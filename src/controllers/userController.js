const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../database/models')
const { registerUserSchema, loginUserSchema } = require('../validations/userValidation')

const register = async (req, res) => {

    const { error, value } = registerUserSchema.validate(req.body, { abortEarly: false })
    if(error) {
        return res.status(400).json({ 
            'Invalid fields': error.details.map(e => e.message)
        })
    }
    
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

    const { error, value } = loginUserSchema.validate(req.body, { abortEarly: false })
    if(error) {
        return res.status(400).json({ 
            'Invalid fields': error.details.map(e => e.message)
        })
    }
    
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ where: {email: email}})
        const isPasswordValid = await bcrypt.compare(password, user.password)

        if(!user || !isPasswordValid)
            return res.status(400).json({error: 'Invalid credentials'})

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '1h'}
        )
    
        res.status(200).json({ token })

    } catch(err) {
        res.status(500).json({error: 'Error logging in'})
    }
}

module.exports = { register, login }
