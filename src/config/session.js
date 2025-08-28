const session = require('express-session')
const SequelizeStoreFactory = require('connect-session-sequelize')
const sequelize = require('../database/sequelize')


const SequelizeStore = SequelizeStoreFactory(session.Store);

const sessionStore = new SequelizeStore({
  db: sequelize,
  tableName: 'Sessions'
})

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 24 * 3600 * 1000,
    httpOnly: true,
    sameSite: 'lax'
  }
})

module.exports = { sessionStore, sessionMiddleware }
