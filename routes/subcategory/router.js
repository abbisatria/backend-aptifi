const express = require('express')
const { getListSubcategory, createSubcategory, updateSubcategory, deleteSubcategory, getDetailSubcategory } = require('./controller')
const { authCheck } = require('../../helpers/auth')
const route = express.Router()

route.get('', getListSubcategory)
route.get('/:id', getDetailSubcategory)
route.post('', authCheck, createSubcategory)
route.put('/:id', authCheck, updateSubcategory)
route.delete('/:id', authCheck, deleteSubcategory)

module.exports = route
