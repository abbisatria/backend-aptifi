const express = require('express')
const { getListRegulation, createRegulation, updateRegulation, deleteRegulation } = require('./controller')
const { authCheck } = require('../../helpers/auth')
const route = express.Router()

route.get('', getListRegulation)
route.post('', authCheck, createRegulation)
route.put('/:id', authCheck, updateRegulation)
route.delete('/:id', authCheck, deleteRegulation)

module.exports = route
