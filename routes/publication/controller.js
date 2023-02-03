const response = require('../../helpers/response')
const { Publication } = require('../../models')
const { Op } = require('sequelize')
const path = require('path')
const fs = require('fs')

module.exports = {
  createPublication: async (req, res) => {
    try {
      const payload = req.body

      const existingPublication = await Publication.findOne({ where: { name: payload.name } })

      if (!existingPublication) {
        if (req.file) {
          const tmpPathPhoto = req.file.path
          const originalExtPhoto = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
          const photo = req.file.filename + '.' + originalExtPhoto
          const targetPathPhoto = path.resolve(path.resolve(__dirname, '../../'), `public/images/publication/${photo}`)

          const srcPhoto = fs.createReadStream(tmpPathPhoto)
          const destPhoto = fs.createWriteStream(targetPathPhoto)

          srcPhoto.pipe(destPhoto)
          srcPhoto.on('end', async () => {
            const result = await Publication.create({ ...payload, image: photo })
            if (result) {
              return response(res, 200, true, 'Publikasi berhasil dibuat')
            } else {
              return response(res, 400, false, 'Publikasi gagal dibuat')
            }
          })
        } else {
          const result = await Publication.create(payload)
          if (result) {
            return response(res, 200, true, 'Publikasi berhasil dibuat')
          } else {
            return response(res, 400, false, 'Publikasi gagal dibuat')
          }
        }
      } else {
        return response(res, 400, false, 'Publikasi sudah terdaftar')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  updatePublication: async (req, res) => {
    try {
      const payload = req.body
      const { id } = req.params

      const existingPublication = await Publication.findOne({ where: { id } })

      if (existingPublication) {
        if (req.file) {
          const tmpPathPhoto = req.file.path
          const originalExtPhoto = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
          const photo = req.file.filename + '.' + originalExtPhoto
          const targetPathPhoto = path.resolve(path.resolve(__dirname, '../../'), `public/images/publication/${photo}`)

          const srcPhoto = fs.createReadStream(tmpPathPhoto)
          const destPhoto = fs.createWriteStream(targetPathPhoto)

          srcPhoto.pipe(destPhoto)
          srcPhoto.on('end', async () => {
            const currentImage = path.resolve(path.resolve(__dirname, '../../'), `public/images/publication/${existingPublication.image}`)
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage)
            }
            const result = await Publication.update({ ...payload, image: photo }, { where: { id } })
            if (result) {
              return response(res, 200, true, 'Publikasi berhasil diupdate')
            } else {
              return response(res, 400, false, 'Publikasi gagal diupdate')
            }
          })
        } else {
          const result = await Publication.update(payload, { where: { id } })
          if (result) {
            return response(res, 200, true, 'Publikasi berhasil diupdate')
          } else {
            return response(res, 400, false, 'Publikasi gagal diupdate')
          }
        }
      } else {
        return response(res, 404, false, 'Publikasi tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  getListPublication: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', all = false } = req.query

      const offset = (Number(page) > 1) ? (Number(page) * limit) - limit : 0

      if (all) {
        const result = await Publication.findAll()

        return response(res, 200, true, 'List Publikasi', result)
      } else {
        const result = await Publication.findAndCountAll({
          where: {
            name: {
              [Op.iLike]: `%${search}%`
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

        return response(res, 200, true, 'List Publikasi', finalResult)
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  getDetailPublication: async (req, res) => {
    try {
      const { id } = req.params

      const existingNews = await Publication.findOne({ where: { id } })

      if (existingNews) {
        return response(res, 200, true, 'Detial Publikasi', existingNews)
      } else {
        return response(res, 404, false, 'Publikasi tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  deletePublication: async (req, res) => {
    try {
      const { id } = req.params

      const existingPublication = await Publication.findOne({ where: { id } })

      if (existingPublication) {
        await Publication.destroy({ where: { id } })
        const currentNews = path.resolve(path.resolve(__dirname, '../../'), `public/images/publication/${existingPublication.image}`)
        if (fs.existsSync(currentNews)) {
          fs.unlinkSync(currentNews)
        }

        return response(res, 200, true, 'Publikasi berhasil dihapus')
      } else {
        return response(res, 404, false, 'Publikasi tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  }
}
