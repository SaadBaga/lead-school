import * as userController from '../controller/v1/user.js'

import express from 'express'
const router = express.Router()

router.post('/admin/login', userController.apiCheckUserLogin)

module.exports = router
