const response = require('../../helpers/response')
const { Identity } = require('../../models')
const path = require('path')
const fs = require('fs')

module.exports = {
  createIdentity: async (req, res) => {
    try {
      const payload = req.body

      const existingIdentity = await Identity.findAll()

      if (existingIdentity.length === 0) {
        if (req.file) {
          const tmpPathPhoto = req.file.path
          const originalExtPhoto = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
          const photo = req.file.filename + '.' + originalExtPhoto
          const targetPathPhoto = path.resolve(path.resolve(__dirname, '../../'), `public/images/image/${photo}`)

          const srcPhoto = fs.createReadStream(tmpPathPhoto)
          const destPhoto = fs.createWriteStream(targetPathPhoto)

          srcPhoto.pipe(destPhoto)
          srcPhoto.on('end', async () => {
            const result = await Identity.create({ ...payload, image: photo })
            if (result) {
              return response(res, 200, true, 'Identitas berhasil dibuat')
            } else {
              return response(res, 400, false, 'Identitas gagal dibuat')
            }
          })
        } else {
          const result = await Identity.create(payload)
          if (result) {
            return response(res, 200, true, 'Identitas berhasil dibuat')
          } else {
            return response(res, 400, false, 'Identitas gagal dibuat')
          }
        }
      } else {
        if (req.file) {
          const tmpPathPhoto = req.file.path
          const originalExtPhoto = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1]
          const photo = req.file.filename + '.' + originalExtPhoto
          const targetPathPhoto = path.resolve(path.resolve(__dirname, '../../'), `public/images/image/${photo}`)

          const srcPhoto = fs.createReadStream(tmpPathPhoto)
          const destPhoto = fs.createWriteStream(targetPathPhoto)

          srcPhoto.pipe(destPhoto)
          srcPhoto.on('end', async () => {
            const currentImage = path.resolve(path.resolve(__dirname, '../../'), `public/images/image/${existingIdentity[0].image}`)
            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage)
            }
            const result = await Identity.update({ ...payload, image: photo }, { where: { id: existingIdentity[0].id } })
            if (result) {
              return response(res, 200, true, 'Identitas Berhasil diupdate')
            } else {
              return response(res, 400, false, 'Identitas gagal diupdate')
            }
          })
        } else {
          const result = await Identity.update(payload, { where: { id: existingIdentity[0].id } })
          if (result) {
            return response(res, 200, true, 'Identitas Berhasil diupdate')
          } else {
            return response(res, 400, false, 'Identitas gagal diupdate')
          }
        }
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  },
  detailIdentity: async (req, res) => {
    try {
      const result = await Identity.findAll()

      if (result.length > 0) {
        return response(res, 200, true, 'Detail Identity', result[0])
      } else {
        return response(res, 200, true, 'Detail Identity', null)
      }
    } catch (err) {
      return response(res, 400, false, `${err.message || 'Bad Request'}`)
    }
  }
}
