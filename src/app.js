require('dotenv').config()

const express = require('express')
const { engine } = require('express-handlebars')
const { sessionMiddleware, sessionStore } = require('./config/session')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000


// Middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(sessionMiddleware)
sessionStore.sync()
app.use((req, res, next) => {
  res.locals.isAuth = Boolean(req.session.userId);
  res.locals.currentUser = req.session.user || null;
  next();
});


// API endpoints
const authRoutes = require('./routes/api/auth')
const listRoutes = require('./routes/api/lists')

app.use('/api/auth', authRoutes)
app.use('/api/lists', listRoutes)


// SSR App endpoints
const webRoutes = require('./routes/web')
const usersWebRoutes = require('./routes/auth')

app.use('/', webRoutes)
app.use('/', usersWebRoutes)


//Handlebars
app.engine('.hbs', engine({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials'),
  defaultLayout: 'main',
}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));


// Server display
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})