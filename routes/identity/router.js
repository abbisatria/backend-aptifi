const express = require('express')
const multer = require('multer')
const { authCheck } = require('../../helpers/auth')
const { createIdentity, detailIdentity } = require('./controller')
const route = express.Router()
const os = require('os')

route.post('', authCheck, multer({ dest: os.tmpdir() }).single('image'), createIdentity)
route.get('', authCheck, detailIdentity)

module.exports = route
