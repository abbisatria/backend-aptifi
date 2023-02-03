const express = require('express')
const { getListCategory, createCategory, updateCategory, deleteCategory, getDetailCategory } = require('./controller')
const { authCheck } = require('../../helpers/auth')
const route = express.Router()

route.get('', getListCategory)
route.get('/:id', getDetailCategory)
route.post('', authCheck, createCategory)
route.put('/:id', authCheck, updateCategory)
route.delete('/:id', authCheck, deleteCategory)

module.exports = route
