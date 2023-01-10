const response = require('../../helpers/response')
const { News } = require('../../models')
const { Op } = require('sequelize')
const path = require('path')
const fs = require('fs')

module.exports = {
  createNews: async (req, res) => {
    try {
      const payload = req.body

      const existingNews = await News.findOne({ where: { title: payload.title } })

      if (!existingNews) {
        if (req.file) {
          const tmpPathPhoto = req.file.path
          const originalExtPhoto = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
          const photo = req.file.filename + '.' + originalExtPhoto
          const targetPathPhoto = path.resolve(path.resolve(__dirname, '../../'), `public/images/berita/${photo}`)

          const srcPhoto = fs.createReadStream(tmpPathPhoto)
          const destPhoto = fs.createWriteStream(targetPathPhoto)

          srcPhoto.pipe(destPhoto)
          srcPhoto.on('end', async () => {
            const result = await News.create({ ...payload, image: photo })
            if (result) {
              return response(res, 200, true, 'Berita berhasil dibuat')
            } else {
              return response(res, 400, false, 'Berita gagal dibuat')
            }
          })
        } else {
          const result = await News.create(payload)
          if (result) {
            return response(res, 200, true, 'Berita berhasil dibuat')
          } else {
            return response(res, 400, false, 'Berita gagal dibuat')
          }
        }
      } else {
        return response(res, 400, false, 'Berita sudah terdaftar')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  updateNews: async (req, res) => {
    try {
      const payload = req.body
      const { id } = req.params

      const existingNews = await News.findOne({ where: { id } })

      if (existingNews) {
        if (req.file) {
          const tmpPathPhoto = req.file.path
          const originalExtPhoto = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
          const photo = req.file.filename + '.' + originalExtPhoto
          const targetPathPhoto = path.resolve(path.resolve(__dirname, '../../'), `public/images/berita/${photo}`)

          const srcPhoto = fs.createReadStream(tmpPathPhoto)
          const destPhoto = fs.createWriteStream(targetPathPhoto)

          srcPhoto.pipe(destPhoto)
          srcPhoto.on('end', async () => {
            const currentImage = path.resolve(path.resolve(__dirname, '../../'), `public/images/berita/${existingNews.image}`)
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage)
            }
            const result = await News.update({ ...payload, image: photo }, { where: { id } })
            if (result) {
              return response(res, 200, true, 'Berita Berhasil diupdate')
            } else {
              return response(res, 400, false, 'Berita gagal diupdate')
            }
          })
        } else {
          const result = await News.update(payload, { where: { id } })
          if (result) {
            return response(res, 200, true, 'Berita berhasil diupdate')
          } else {
            return response(res, 400, false, 'Berita gagal diupdate')
          }
        }
      } else {
        return response(res, 404, false, 'Berita tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  getDetailNews: async (req, res) => {
    try {
      const { id } = req.params

      const existingNews = await News.findOne({ where: { id } })

      if (existingNews) {
        return response(res, 200, true, 'Detial Berita', existingNews)
      } else {
        return response(res, 404, false, 'Berita tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  getListNews: async (req, res) => {
    try {
      const { page = 1, limit = 4, search = '', all = false } = req.query

      const offset = (Number(page) > 1) ? (Number(page) * limit) - limit : 0

      if (all) {
        const result = await News.findAll({ attributes: ['title', 'sub_title', 'news_date', 'image'] })

        return response(res, 200, true, 'List Berita', result)
      } else {
        const result = await News.findAndCountAll({
          where: {
            title: {
              [Op.iLike]: `%${search}%`
            }
          },
          order: [['id', 'DESC']],
          limit: Number(limit),
          offset: Number(offset),
          attributes: ['title', 'sub_title', 'news_date']
        })

        const finalResult = {
          count: result.count,
          pageCount: Math.ceil(result.count / Number(limit)) || 0,
          data: result.rows
        }

        return response(res, 200, true, 'List Berita', finalResult)
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  deleteNews: async (req, res) => {
    try {
      const { id } = req.params

      const existingNews = await News.findOne({ where: { id } })

      if (existingNews) {
        await News.destroy({ where: { id } })

        const currentPhoto = path.resolve(path.resolve(__dirname, '../../'), `public/images/berita/${existingNews.image}`)
        if (fs.existsSync(currentPhoto)) {
          fs.unlinkSync(currentPhoto)
        }

        return response(res, 200, true, 'Berita berhasil dihapus')
      } else {
        return response(res, 404, false, 'Berita tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  }
}
