const express = require('express')
const multer = require('multer')
const { authCheck } = require('../../helpers/auth')
const { getListUser, createUser, updateUser, deleteUser, login, getDetailUser } = require('./controller')
const route = express.Router()
const os = require('os')

route.get('', authCheck, getListUser)
route.get('/:id', authCheck, getDetailUser)
route.post('', multer({ dest: os.tmpdir() }).fields([{ name: 'ijazah' }, { name: 'proof_payment' }]), createUser)
route.post('/login', login)
route.put('/:id', authCheck, multer({ dest: os.tmpdir() }).fields([{ name: 'ijazah' }, { name: 'proof_payment' }]), updateUser)
route.delete('/:id', authCheck, deleteUser)

module.exports = route
