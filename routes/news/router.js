const express = require('express')
const { getListNews, createNews, updateNews, deleteNews, getDetailNews } = require('./controller')
const { authCheck } = require('../../helpers/auth')
const route = express.Router()
const multer = require('multer')
const os = require('os')

route.get('', getListNews)
route.get('/:id', getDetailNews)
route.post('', authCheck, multer({ dest: os.tmpdir() }).single('image'), createNews)
route.put('/:id', authCheck, multer({ dest: os.tmpdir() }).single('image'), updateNews)
route.delete('/:id', authCheck, deleteNews)

module.exports = route
