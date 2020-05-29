import * as userController from '../controller/v1/user.js'
import * as courseController from '../controller/v1/course.js'

import express from 'express'
const router = express.Router()

router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

router.post('/admin/login', userController.apiCheckUserLogin)
router.post('/course/list', courseController.apiGetAllCourseList)

module.exports = router
