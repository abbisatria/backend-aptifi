'use strict'
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      fullname: {
        type: Sequelize.STRING
      },
      organization_number: {
        type: Sequelize.STRING
      },
      phone_number: {
        type: Sequelize.STRING
      },
      mobile_number: {
        type: Sequelize.STRING
      },
      branch: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      nik: {
        type: Sequelize.STRING
      },
      city_birth: {
        type: Sequelize.STRING
      },
      birthday: {
        type: Sequelize.DATE
      },
      gender: {
        type: Sequelize.STRING
      },
      religion: {
        type: Sequelize.STRING
      },
      prefix_title: {
        type: Sequelize.STRING
      },
      suffix_title: {
        type: Sequelize.STRING
      },
      street_address: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      postal_code: {
        type: Sequelize.INTEGER
      },
      membership_status: {
        type: Sequelize.STRING
      },
      university: {
        type: Sequelize.STRING
      },
      first_concentration: {
        type: Sequelize.STRING
      },
      second_concentration: {
        type: Sequelize.STRING
      },
      start_periode: {
        type: Sequelize.DATE
      },
      end_periode: {
        type: Sequelize.DATE
      },
      ijazah: {
        type: Sequelize.STRING
      },
      work_place: {
        type: Sequelize.STRING
      },
      work_address: {
        type: Sequelize.STRING
      },
      work_city: {
        type: Sequelize.STRING
      },
      employee_status: {
        type: Sequelize.STRING
      },
      work_position: {
        type: Sequelize.STRING
      },
      office_phone_number: {
        type: Sequelize.STRING
      },
      proof_payment: {
        type: Sequelize.STRING
      },
      user_status: {
        type: Sequelize.BOOLEAN
      },
      role: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Users')
  }
}
