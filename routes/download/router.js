const express = require('express')
const { getListDownload, createDownload, updateDownload, deleteDownload } = require('./controller')
const { authCheck } = require('../../helpers/auth')
const route = express.Router()

route.get('', getListDownload)
route.post('', authCheck, createDownload)
route.put('/:id', authCheck, updateDownload)
route.delete('/:id', authCheck, deleteDownload)

module.exports = route
