import * as courseController from '../controller/v1/course.js'

import express from 'express'
const router = express.Router()

router.post('/course/add', courseController.apiInsertCourse)
router.post('/course/delete', courseController.apiDeleteCourse)
router.post('/course/update', courseController.apiUpdateCourseData)

export default router
