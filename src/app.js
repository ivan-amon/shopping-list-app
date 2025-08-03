const express = require('express')
const app = express()
const port = 3000

app.use(express.json())

const userRoutes = require('./routes/api/users')
app.use('/api/users', userRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})