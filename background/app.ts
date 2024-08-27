// const createError = require('http-errors')
import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import bp from 'body-parser'
import indexRouter from './routes/index'
import childRouter from './routes/child'
import uploadImage from './routes/uploadImage'
import typesRouter from './routes/types'
import javascriptManger from './routes/javascriptManger'
const app = express()
// 解决跨域问题
app.all('*', function (req, res, next) {
  // 设置允许跨域的域名,*代表允许任意域名跨域
  res.header('Access-Control-Allow-Origin', '*')
  // 允许的header类型
  res.header('Access-Control-Allow-Headers', 'content-type')
  // 跨域允许的请求方式
  res.header('Access-Control-Allow-Methods', 'DELETE,PUT,POST,GET,OPTIONS')
  if (req.method.toLowerCase() === 'options') { res.send(200) } // 让options 尝试请求快速结束
  else { next() }
})

// view engine setup
// app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev') as any)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser() as any)
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/', childRouter)
app.use('/', uploadImage)
app.use('/', typesRouter)
app.use('/', javascriptManger)
// app.use('/users', usersRouter)

// 使用包
// 使用bp包之前需要先进行配置，因为bp默认采用的是qs包进行url编码转换
// 如果希望使用核心模块进行处理，必须进行以下设置：
// 下面这句话的含义为：使用核心模块querystring进行处理操作
app.use(bp.urlencoded({ extended: false }))

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
app.use((err:any, req, res:any) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})
module.exports = app
