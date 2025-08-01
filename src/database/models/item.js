'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class Item extends Model {
    static associate(models) {
      this.belongsTo(models.List, {
        foreignKey: 'listId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });
    }
  }

  Item.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    listId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(512),
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Item',
  });

  return Item;
};