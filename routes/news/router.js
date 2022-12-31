const express = require('express')
const { getListNews, createNews, updateNews, deleteNews, getDetailNews } = require('./controller')
const { authCheck } = require('../../helpers/auth')
const route = express.Router()

route.get('', getListNews)
route.get('/:id', getDetailNews)
route.post('', authCheck, createNews)
route.put('/:id', authCheck, updateNews)
route.delete('/:id', authCheck, deleteNews)

module.exports = route
