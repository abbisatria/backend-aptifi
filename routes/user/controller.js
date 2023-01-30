const response = require('../../helpers/response')
const { User } = require('../../models')
const { Op } = require('sequelize')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')
const fs = require('fs')

module.exports = {
  createUser: async (req, res) => {
    try {
      const payload = req.body

      const existingUser = await User.findOne({ where: { username: payload.username } })

      if (!existingUser) {
        const salt = await bcrypt.genSalt()
        const encryptedPassword = payload.password ? await bcrypt.hash(payload.password, salt) : ''
        if (req.files) {
          let proofPayment
          let ijazah
          if (req.files.ijazah) {
            const tmpPathIjazah = req.files.ijazah[0].path
            const originalExtIjazah = req.files.ijazah[0].originalname.split('.')[req.files.ijazah[0].originalname.split('.').length - 1]
            ijazah = req.files.ijazah[0].filename + '.' + originalExtIjazah
            const targetPathIjazah = path.resolve(path.resolve(__dirname, '../../'), `public/images/ijazah/${ijazah}`)

            const srcIjazah = fs.createReadStream(tmpPathIjazah)
            const destIjazah = fs.createWriteStream(targetPathIjazah)

            srcIjazah.pipe(destIjazah)
          }
          if (req.files.proof_payment) {
            const tmpPathPhoto = req.files.proof_payment[0].path
            const originalExtPhoto = req.files.proof_payment[0].originalname.split('.')[req.files.proof_payment[0].originalname.split('.').length - 1]
            proofPayment = req.files.proof_payment[0].filename + '.' + originalExtPhoto
            const targetPathPhoto = path.resolve(path.resolve(__dirname, '../../'), `public/images/photo/${proofPayment}`)

            const srcPhoto = fs.createReadStream(tmpPathPhoto)
            const destPhoto = fs.createWriteStream(targetPathPhoto)

            srcPhoto.pipe(destPhoto)
          }

          const result = await User.create({ ...payload, ijazah, proof_payment: proofPayment, password: encryptedPassword })
          if (result) {
            return response(res, 200, true, 'User berhasil dibuat')
          } else {
            return response(res, 400, false, 'User gagal dibuat')
          }
        } else {
          const result = await User.create({ ...payload, password: encryptedPassword })
          if (result) {
            return response(res, 200, true, 'User berhasil register')
          } else {
            return response(res, 400, false, 'User gagal register')
          }
        }
      } else {
        return response(res, 400, false, 'User sudah terdaftar')
      }
    } catch (err) {
      console.log('err', err)
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  updateUser: async (req, res) => {
    try {
      let payload = req.body
      const { id } = req.params

      const isExists = await User.findOne({ where: { id } })

      if (isExists) {
        if (payload.password) {
          const salt = await bcrypt.genSalt()
          const encryptedPassword = await bcrypt.hash(payload.password, salt)
          payload = { ...payload, password: encryptedPassword }
        }
        if (req.files) {
          let proofPayment
          let ijazah
          if (req.files.ijazah) {
            const tmpPathIjazah = req.files.ijazah[0].path
            const originalExtIjazah = req.files.ijazah[0].originalname.split('.')[req.files.ijazah[0].originalname.split('.').length - 1]
            ijazah = req.files.ijazah[0].filename + '.' + originalExtIjazah
            const targetPathIjazah = path.resolve(path.resolve(__dirname, '../../'), `public/images/ijazah/${ijazah}`)

            const srcIjazah = fs.createReadStream(tmpPathIjazah)
            const destIjazah = fs.createWriteStream(targetPathIjazah)

            payload = { ...payload, ijazah }
            srcIjazah.pipe(destIjazah)
            srcIjazah.on('end', () => {
              const currentImage = path.resolve(path.resolve(__dirname, '../../'), `public/images/ijazah/${isExists.ijazah}`)
              if (fs.existsSync(currentImage)) {
                fs.unlinkSync(currentImage)
              }
            })
          }
          if (req.files.proof_payment) {
            const tmpPathPhoto = req.files.proof_payment[0].path
            const originalExtPhoto = req.files.proof_payment[0].originalname.split('.')[req.files.proof_payment[0].originalname.split('.').length - 1]
            proofPayment = req.files.proof_payment[0].filename + '.' + originalExtPhoto
            const targetPathPhoto = path.resolve(path.resolve(__dirname, '../../'), `public/images/photo/${proofPayment}`)

            const srcPhoto = fs.createReadStream(tmpPathPhoto)
            const destPhoto = fs.createWriteStream(targetPathPhoto)

            payload = { ...payload, proof_payment: proofPayment }
            srcPhoto.pipe(destPhoto)
            srcPhoto.on('end', () => {
              const currentImage = path.resolve(path.resolve(__dirname, '../../'), `public/images/photo/${isExists.proof_payment}`)
              if (fs.existsSync(currentImage)) {
                fs.unlinkSync(currentImage)
              }
            })
          }

          const result = await User.update(payload, { where: { id } })
          if (result) {
            return response(res, 200, true, 'User Berhasil diupdate')
          } else {
            return response(res, 400, false, 'User gagal diupdate')
          }
        } else {
          const result = await User.update(payload, { where: { id } })
          if (result) {
            return response(res, 200, true, 'User Berhasil diupdate')
          } else {
            return response(res, 400, false, 'User gagal diupdate')
          }
        }
      } else {
        return response(res, 400, false, 'User tidak ditemukan')
      }
    } catch (err) {
      console.log('err', err)
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  getListUser: async (req, res) => {
    try {
      const { page, limit = 10, search = '', all = false } = req.query

      const offset = (Number(page) > 1) ? (Number(page) * limit) - limit : 0

      if (all) {
        const result = await User.findAll()

        return response(res, 200, true, 'List User', result)
      } else {
        const result = await User.findAndCountAll({
          where: {
            fullname: {
              [Op.like]: `%${search}%`
            }
          },
          order: [['id', 'DESC']],
          limit: Number(limit),
          offset: Number(offset)
        })

        const finalResult = {
          count: result.count,
          pageCount: Math.ceil(result.count / Number(limit)) || 0,
          data: result.rows
        }

        return response(res, 200, true, 'List User', finalResult)
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params

      const existingUser = await User.findOne({ where: { id } })

      if (existingUser) {
        await User.destroy({ where: { id } })
        const currentIjazah = path.resolve(path.resolve(__dirname, '../../'), `public/images/ijazah/${existingUser.ijazah}`)
        if (fs.existsSync(currentIjazah)) {
          fs.unlinkSync(currentIjazah)
        }

        const currentPhoto = path.resolve(path.resolve(__dirname, '../../'), `public/images/photo/${existingUser.proof_payment}`)
        if (fs.existsSync(currentPhoto)) {
          fs.unlinkSync(currentPhoto)
        }

        return response(res, 200, true, 'User berhasil dihapus')
      } else {
        return response(res, 404, false, 'User tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  login: async (req, res) => {
    try {
      const { username, password } = req.body

      const existingUser = await User.findOne({ where: { username } })

      if (existingUser) {
        const compare = bcrypt.compareSync(password, existingUser.password)
        const token = jwt.sign(existingUser.dataValues, process.env.APP_KEY)
        if (compare) {
          return response(res, 200, true, 'Login berhasil', { token })
        } else {
          return response(res, 401, false, 'Password yang anda masukan salah')
        }
      } else {
        return response(res, 400, true, 'Username tidak terdaftar')
      }
    } catch (err) {
      console.log('err', err)
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  }
}
