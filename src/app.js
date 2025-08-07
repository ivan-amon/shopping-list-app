require('dotenv').config()

const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

// API endpoints
const authRoutes = require('./routes/api/users')
const listRoutes = require('./routes/api/lists')

app.use('/api/auth', authRoutes)
app.use('/api/lists', listRoutes)

// App endpoints
const webRoutes = require('./routes/web')

app.use('/', webRoutes)

// Server display
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})