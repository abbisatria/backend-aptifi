const express = require('express')
const { authCheck } = require('../../helpers/auth')
const { getListUser, createUser, updateUser, deleteUser, login } = require('./controller')
const route = express.Router()

route.get('', authCheck, getListUser)
route.post('', createUser)
route.post('/login', login)
route.put('', authCheck, updateUser)
route.delete('/:id', authCheck, deleteUser)

module.exports = route
