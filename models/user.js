'use strict'
const {
  Model
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    fullname: DataTypes.STRING,
    organization_number: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    mobile_number: DataTypes.STRING,
    branch: DataTypes.STRING,
    email: DataTypes.STRING,
    nik: DataTypes.STRING,
    city_birth: DataTypes.STRING,
    birthday: DataTypes.DATE,
    gender: DataTypes.STRING,
    religion: DataTypes.STRING,
    prefix_title: DataTypes.STRING,
    suffix_title: DataTypes.STRING,
    street_address: DataTypes.STRING,
    city: DataTypes.STRING,
    postal_code: DataTypes.INTEGER,
    membership_status: DataTypes.STRING,
    university: DataTypes.STRING,
    first_concentration: DataTypes.STRING,
    second_concentration: DataTypes.STRING,
    start_periode: DataTypes.DATE,
    end_periode: DataTypes.DATE,
    ijazah: DataTypes.STRING,
    work_place: DataTypes.STRING,
    work_address: DataTypes.STRING,
    work_city: DataTypes.STRING,
    employee_status: DataTypes.STRING,
    work_position: DataTypes.STRING,
    office_phone_number: DataTypes.STRING,
    proof_payment: DataTypes.STRING,
    user_status: DataTypes.BOOLEAN,
    role: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User'
  })
  return User
}
