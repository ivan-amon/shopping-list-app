'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

  class List extends Model {
    static associate(models) {

      this.belongsTo(models.User, {
        foreignKey: 'userId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      });

      this.hasMany(models.Item, {
        foreignKey: 'listId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })

    }
  }

  List.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    notes: {
      type: DataTypes.STRING(512),
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'List',
  });

  return List;
};