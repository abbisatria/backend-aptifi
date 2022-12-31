const response = require('../../helpers/response')
const { Category } = require('../../models')
const { Op } = require('sequelize')

module.exports = {
  createCategory: async (req, res) => {
    try {
      const payload = req.body

      const existingCategory = await Category.findOne({ where: { name: payload.name } })

      if (!existingCategory) {
        const result = await Category.create(payload)
        if (result) {
          return response(res, 200, true, 'Kategori berhasil dibuat')
        } else {
          return response(res, 400, false, 'Kategori gagal dibuat')
        }
      } else {
        return response(res, 400, false, 'Kategori sudah terdaftar')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  updateCategory: async (req, res) => {
    try {
      const payload = req.body
      const { id } = req.params

      const existingCategory = await Category.findOne({ where: { id } })

      if (existingCategory) {
        const result = await Category.update(payload, { where: { id } })
        if (result) {
          return response(res, 200, true, 'Kategori berhasil diupdate')
        } else {
          return response(res, 400, false, 'Kategori gagal diupdate')
        }
      } else {
        return response(res, 404, false, 'Kategori tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  getListCategory: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', all = false } = req.query

      const offset = (Number(page) > 1) ? (Number(page) * limit) - limit : 0

      if (all) {
        const result = await Category.findAll()

        return response(res, 200, true, 'List Kategori', result)
      } else {
        const result = await Category.findAndCountAll({
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

        return response(res, 200, true, 'List Kategori', finalResult)
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params

      const existingCategory = await Category.findOne({ where: { id } })

      if (existingCategory) {
        await Category.destroy({ where: { id } })

        return response(res, 200, true, 'Kategori berhasil dihapus')
      } else {
        return response(res, 404, false, 'Kategori tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  }
}
