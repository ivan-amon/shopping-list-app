const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { User } = require('../database/models')
const bcrypt = require('bcrypt')

passport.use(new LocalStrategy(
  { usernameField: 'email', passwordField: 'password'},
  async (email, password, done) => {

  const user = await User.findOne({ where: { email }})
  if(!user) {
    return done(null, false, { message: 'User not found' })
  }
  const valid = await bcrypt.compare(password, user.password)
  if(!valid) {
    return done(null, false, { message: 'Invalid password' })
  }
  
  return done(null, user)
}))

passport.serializeUser((user, done) => { //First loging
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => { //After each req
  try {
    const user = await User.findByPk(id)
    done(null, user) // -> req.user
  } catch(err) {
    done(err)
  }
})

module.exports = passport;