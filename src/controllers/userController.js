const bcrypt = require('bcrypt')
const { User } = require('../database/models')
const { loginUserSchema, registerUserSchema } = require('../validations/userValidation')

const register = async (req, res, next) => {

  try {

    const { error, value } = registerUserSchema.validate(req.body, { abortEarly: false })
    if (error) {
      return res.status(400).render('auth/register', {
        error: true,
        validationError: error.details.map(e => e.message)
      })
    }

    const { name, email, password } = req.body

    const exists = await User.findOne({ where: { email } })
    if (exists) {
      return res.status(409).render('auth/register', {
        error: true,
        validationError: 'Email already registered'
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({name, email, password: passwordHash})

    //log user
    req.session.regenerate(err => {
      if(err) {
        return res.status(500).render('auth/register', {
          error: true,
          validationError: 'Internal Server Error'
        })
      }
      req.session.userId = user.id
      req.session.save(() => res.redirect('/home'))
    })

  } catch (err) {
      return res.status(500).render('auth/register', {
        error: true,
        validationError: 'Internal Server Error'
      })
  }
}

const login = async (req, res) => {
  
  const { error } = loginUserSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).render('auth/login', {
      error: true,
      validationError: error.details.map(e => e.message),
    });
  }

  try {

    const { email, password } = req.body

    const user = await User.findOne({ where: { email }})


    if(!user) {
      return res.status(401).render('auth/login', {
        error: true,
        validationError: 'Invalid credentials'
      })
    }

    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword) {
      return res.status(401).render('auth/login', {
        error:true,
        validationError: 'Invalid credentials'
      })
    }

    req.session.regenerate(err => {
      if(err) {
        return res.status(500).render('auth/register', {
          error: true,
          validationError: 'Internal Server Error'
        })
      }
      req.session.userId = user.id
      req.session.save(() => res.redirect('/home'))
    })

  } catch(err) {
    return res.status(500).render('auth/login', {
      error: true,
      validationError: 'Internal Server Error'
    })
  }
}

const logout = (req, res) => {

  try {

    req.session.destroy(() => {
      res.clearCookie('connect.sid')
      res.redirect('/')
    })

  } catch(err) {
    return res.status(500).render('auth/register', {
      error: true,
      validationError: 'Internal Server Error'
    })
  }
}

const getWelcomePage = (req, res) => {
  if(req.session.userId) {
    return res.redirect('/home')
  }

  res.render('index')
}

const getLoginForm = (req, res) => {

  if(req.session.userId) {
    return res.redirect('/home')
  }

  res.render('auth/login')
}

const getRegisterForm = (req, res) => {
  res.render('auth/register')
}

module.exports = { 
  register, 
  login, 
  logout, 
  getLoginForm,
  getRegisterForm,
  getWelcomePage
}