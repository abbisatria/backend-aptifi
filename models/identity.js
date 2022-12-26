'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Identity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  Identity.init({
    name: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    email: DataTypes.STRING,
    website: DataTypes.STRING,
    address: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.TEXT,
    visi: DataTypes.TEXT,
    misi: DataTypes.TEXT,
    information_adrt: DataTypes.TEXT,
    board_management: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Identity'
  })
  return Identity
}
