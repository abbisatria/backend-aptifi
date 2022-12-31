const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')

const userRouter = require('./routes/user/router')
const identityRouter = require('./routes/identity/router')
const newsRouter = require('./routes/news/router')
const publicationRouter = require('./routes/publication/router')
const regulationRouter = require('./routes/regulation/router')
const downloadRouter = require('./routes/download/router')
const categoryRouter = require('./routes/category/router')
const subCategoryRouter = require('./routes/subcategory/router')

const app = express()
app.use(cors())

const URL = '/api/v1'

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(`${URL}/user`, userRouter)
app.use(`${URL}/identity`, identityRouter)
app.use(`${URL}/news`, newsRouter)
app.use(`${URL}/publication`, publicationRouter)
app.use(`${URL}/regulation`, regulationRouter)
app.use(`${URL}/download`, downloadRouter)
app.use(`${URL}/category`, categoryRouter)
app.use(`${URL}/subcategory`, subCategoryRouter)

app.use('/', (req, res) => {
  return res.status(200).json({
    status: 200,
    message: 'Server Is Running Well'
  })
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
