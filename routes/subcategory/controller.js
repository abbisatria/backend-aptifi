const response = require('../../helpers/response')
const { Subcategory, Category } = require('../../models')
const { Op } = require('sequelize')

module.exports = {
  createSubcategory: async (req, res) => {
    try {
      const payload = req.body

      const existingSubcategory = await Subcategory.findOne({ where: { name: payload.name } })

      if (!existingSubcategory) {
        const result = await Subcategory.create(payload)
        if (result) {
          return response(res, 200, true, 'Sub Kategori berhasil dibuat')
        } else {
          return response(res, 400, false, 'Sub Kategori gagal dibuat')
        }
      } else {
        return response(res, 400, false, 'Sub Kategori sudah terdaftar')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  updateSubcategory: async (req, res) => {
    try {
      const payload = req.body
      const { id } = req.params

      const existingSubcategory = await Subcategory.findOne({ where: { id } })

      if (existingSubcategory) {
        const result = await Subcategory.update(payload, { where: { id } })
        if (result) {
          return response(res, 200, true, 'Sub Kategori berhasil diupdate')
        } else {
          return response(res, 400, false, 'Sub Kategori gagal diupdate')
        }
      } else {
        return response(res, 404, false, 'Sub Kategori tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  getListSubcategory: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = '', all = false } = req.query

      const offset = (Number(page) > 1) ? (Number(page) * limit) - limit : 0

      if (all) {
        const result = await Subcategory.findAll({
          include: [{ model: Category, attributes: ['name'] }]
        })

        return response(res, 200, true, 'List Sub Kategori', result)
      } else {
        const result = await Subcategory.findAndCountAll({
          where: {
            name: {
              [Op.iLike]: `%${search}%`
            }
          },
          include: [{ model: Category, attributes: ['name'] }],
          order: [['id', 'DESC']],
          limit: Number(limit),
          offset: Number(offset)
        })

        const finalResult = {
          count: result.count,
          pageCount: Math.ceil(result.count / Number(limit)) || 0,
          data: result.rows
        }

        return response(res, 200, true, 'List Sub Kategori', finalResult)
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  getDetailSubcategory: async (req, res) => {
    try {
      const { id } = req.params

      const existingNews = await Subcategory.findOne({ where: { id } })

      if (existingNews) {
        return response(res, 200, true, 'Detial Sub Kategori', existingNews)
      } else {
        return response(res, 404, false, 'Sub Kategori tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  deleteSubcategory: async (req, res) => {
    try {
      const { id } = req.params

      const existingSubcategory = await Subcategory.findOne({ where: { id } })

      if (existingSubcategory) {
        await Subcategory.destroy({ where: { id } })

        return response(res, 200, true, 'Sub Kategori berhasil dihapus')
      } else {
        return response(res, 404, false, 'Sub Kategori tidak ditemukan')
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  }
}
