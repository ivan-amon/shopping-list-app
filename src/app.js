require('dotenv').config()

const express = require('express')
const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(express.json())

// API endpoints
const authRoutes = require('./routes/api/users')
const listRoutes = require('./routes/api/lists')

app.use('/api/auth', authRoutes)
app.use('/api/lists', listRoutes)

// Server display
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})