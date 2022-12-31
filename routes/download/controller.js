const response = require('../../helpers/response')
const { Download, Subcategory } = require('../../models')
const { Op } = require('sequelize')

module.exports = {
  createDownload: async (req, res) => {
    try {
      const payload = req.body

      const existingDownload = await Download.findOne({ where: { name: payload.name } })

      if (!existingDownload) {
        const result = await Download.create(payload)
        if (result) {
          return response(res, 200, true, 'Download berhasil dibuat')
        } else {
          return response(res, 400, false, 'Download gagal dibuat')
        }
      } else {
        return response(res, 400, false, 'Download sudah terdaftar')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  updateDownload: async (req, res) => {
    try {
      const payload = req.body
      const { id } = req.params

      const existingDownload = await Download.findOne({ where: { id } })

      if (existingDownload) {
        const result = await Download.update(payload, { where: { id } })
        if (result) {
          return response(res, 200, true, 'Download berhasil diupdate')
        } else {
          return response(res, 400, false, 'Download gagal diupdate')
        }
      } else {
        return response(res, 404, false, 'Download tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  getListDownload: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', all = false } = req.query

      const offset = (Number(page) > 1) ? (Number(page) * limit) - limit : 0

      if (all) {
        const result = await Subcategory.findAll({ include: [{ model: Download }], where: { id_category: 2 }, attributes: ['name'] })

        return response(res, 200, true, 'List Download', result)
      } else {
        const result = await Subcategory.findAndCountAll({
          where: {
            name: {
              [Op.iLike]: `%${search}%`
            },
            id_category: 2
          },
          include: [{ model: Download }],
          order: [['id', 'DESC']],
          attributes: ['name'],
          limit: Number(limit),
          offset: Number(offset)
        })

        const finalResult = {
          count: result.count,
          pageCount: Math.ceil(result.count / Number(limit)) || 0,
          data: result.rows
        }

        return response(res, 200, true, 'List Download', finalResult)
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  deleteDownload: async (req, res) => {
    try {
      const { id } = req.params

      const existingDownload = await Download.findOne({ where: { id } })

      if (existingDownload) {
        await Download.destroy({ where: { id } })

        return response(res, 200, true, 'Download berhasil dihapus')
      } else {
        return response(res, 404, false, 'Download tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  }
}
