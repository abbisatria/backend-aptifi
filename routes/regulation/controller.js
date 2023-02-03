const response = require('../../helpers/response')
const { Regulation, Subcategory } = require('../../models')
const { Op } = require('sequelize')

module.exports = {
  createRegulation: async (req, res) => {
    try {
      const payload = req.body

      const existingRegulation = await Regulation.findOne({ where: { name: payload.name } })

      if (!existingRegulation) {
        const result = await Regulation.create(payload)
        if (result) {
          return response(res, 200, true, 'Regulasi berhasil dibuat')
        } else {
          return response(res, 400, false, 'Regulasi gagal dibuat')
        }
      } else {
        return response(res, 400, false, 'Regulasi sudah terdaftar')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  updateRegulation: async (req, res) => {
    try {
      const payload = req.body
      const { id } = req.params

      const existingRegulation = await Regulation.findOne({ where: { id } })

      if (existingRegulation) {
        const result = await Regulation.update(payload, { where: { id } })
        if (result) {
          return response(res, 200, true, 'Regulasi berhasil diupdate')
        } else {
          return response(res, 400, false, 'Regulasi gagal diupdate')
        }
      } else {
        return response(res, 404, false, 'Regulasi tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  getListRegulation: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', all = false } = req.query

      const offset = (Number(page) > 1) ? (Number(page) * limit) - limit : 0

      if (all) {
        const result = await Subcategory.findAll({ include: [{ model: Regulation }], where: { id_category: 1 }, attributes: ['name'] })

        return response(res, 200, true, 'List Regulasi', result)
      } else {
        const result = await Subcategory.findAndCountAll({
          where: {
            name: {
              [Op.iLike]: `%${search}%`
            },
            id_category: 1
          },
          include: [{ model: Regulation }],
          attributes: ['name'],
          order: [['id', 'DESC']],
          limit: Number(limit),
          offset: Number(offset)
        })

        const finalResult = {
          count: result.count,
          pageCount: Math.ceil(result.count / Number(limit)) || 0,
          data: result.rows
        }

        return response(res, 200, true, 'List Regulasi', finalResult)
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  getDetailRegulation: async (req, res) => {
    try {
      const { id } = req.params

      const existingNews = await Regulation.findOne({ where: { id } })

      if (existingNews) {
        return response(res, 200, true, 'Detial Regulasi', existingNews)
      } else {
        return response(res, 404, false, 'Regulasi tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  deleteRegulation: async (req, res) => {
    try {
      const { id } = req.params

      const existingRegulation = await Regulation.findOne({ where: { id } })

      if (existingRegulation) {
        await Regulation.destroy({ where: { id } })

        return response(res, 200, true, 'Regulasi berhasil dihapus')
      } else {
        return response(res, 404, false, 'Regulasi tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  }
}
