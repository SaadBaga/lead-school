import express from 'express'
import path from 'path'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import morganBody from 'morgan-body'
import config from './config/index'
import mongodb from './helper/mongo'
import { checkUserToken } from './middleware/authentication'
import route from './routes/index'
import openRoute from './routes/openRoute'
import compression from 'compression'
import cors from 'cors'
import rateLimit from 'express-rate-limit'
import MongoStore from 'rate-limit-mongo'
import passport from 'passport'

const app = express()
const router = express.Router()
// compress all responses
app.use(compression())
app.use(cors())

const mongoConfig = config[process.env.ENV || 'development'].mongo
const mongoUrl = 'mongodb+srv://' + mongoConfig.user + ':' + mongoConfig.password + '@' + mongoConfig.url + '/' + mongoConfig.database

const limiter = rateLimit({
  store: new MongoStore({
    uri: mongoUrl
    // see Configuration
  }),
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

app.use(limiter)

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

app.use(logger('dev'))
app.use(bodyParser.json({ limit: '5mb' }))
morganBody(app)
app.use(bodyParser.urlencoded({
  extended: false,
  limit: '5mb'
}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/api', checkUserToken)
app.use('/api', route)
app.use('/', openRoute)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  return res.status(404).json({ message: err })
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

mongodb.connect(mongoUrl, function (err) {
  if (err) {
    console.log('Unable to connect to Mongo.', err)
  } else {
    app.listen(8000, function () {
      console.log('MongoDB Connected')
      console.log('API server listening on port 8000!')
      console.log('API server started in ' + process.env.ENV)
    })
  }
})

module.exports = app
