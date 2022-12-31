'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Regulation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      Regulation.belongsTo(models.Subcategory, { foreignKey: 'type' })
    }
  }
  Regulation.init({
    type: DataTypes.INTEGER,
    name: DataTypes.STRING,
    link: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Regulation'
  })
  return Regulation
}
