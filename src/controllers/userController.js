const passport = require('../config/passport')
const bcrypt = require('bcrypt')
const { User } = require('../database/models')
const { loginUserSchema, registerUserSchema } = require('../validations/userValidation')

const register = async (req, res) => {

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
        validationError: 'Email alerady registered'
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = User.create({name, email, password: passwordHash})

    req.login(user, (err) => {
      if(err) {
        return res.status(500).render('auth/register', {
          error: true,
          validationError: 'Internal server error'
        })
      }
      return res.redirect('home')
    })

  } catch (err) {
    res.status(500).json('Error 500: Internal server error')
  }
}

const login = (req, res, next) => {
  
  const { error } = loginUserSchema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).render('auth/login', {
      error: true,
      validationError: error.details.map(e => e.message),
    });
  }

  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).render('auth/login', {
        error: true,
        validationError: info?.message || 'Invalid Credentials',
      });
    }

    req.login(user, err => {
      if (err) return next(err);
      req.session.regenerate(err => {
        if (err) return next(err);
        req.login(user, err => {
          if (err) return next(err);
          req.session.save(() => res.redirect('/home'));
        })
      })
    })
  })(req, res, next)
}

const logout = (req, res) => {
  req.logout(() => {
    req.session.destroy(() => {
      res.clearCookie('connect.sid')
      res.redirect('/login')
    })
  })
}

module.exports = { register, login, logout }