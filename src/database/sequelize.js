const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('shopping_list_app', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
})

module.exports = sequelize