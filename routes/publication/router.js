const express = require('express')
const { getListPublication, createPublication, updatePublication, deletePublication, getDetailPublication } = require('./controller')
const { authCheck } = require('../../helpers/auth')
const route = express.Router()
const multer = require('multer')
const os = require('os')

route.get('', getListPublication)
route.get('/:id', getDetailPublication)
route.post('', authCheck, multer({ dest: os.tmpdir() }).single('image'), createPublication)
route.put('/:id', authCheck, multer({ dest: os.tmpdir() }).single('image'), updatePublication)
route.delete('/:id', authCheck, deletePublication)

module.exports = route
