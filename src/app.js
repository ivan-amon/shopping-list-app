require('dotenv').config()

const express = require('express')
const path = require('path')
const { engine } = require('express-handlebars')
const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.urlencoded())
app.use(express.static(path.join(__dirname, 'public')))

// API endpoints
const authRoutes = require('./routes/api/users')
const listRoutes = require('./routes/api/lists')

app.use('/api/auth', authRoutes)
app.use('/api/lists', listRoutes)

// App endpoints
const webRoutes = require('./routes/web')

app.use('/', webRoutes)

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