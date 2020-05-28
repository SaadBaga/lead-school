import jwt from 'jsonwebtoken'
import express from 'express'
const app = express()

const router = express.Router()

const constant = require('../config/constant')

const Cryptr = require('cryptr')
const cryptr = new Cryptr(constant.apiTokenSecret)

export const checkUserToken = (req, res, next) => {
  const decryptedString = cryptr.decrypt(req.get('Authorization'))
  jwt.verify(decryptedString, constant.apiJwtSecret, function (err, decoded) {
    if (err) {
      res.status(403).json({ error: 'Sorry you are unauthorized' })
    } else {
      req.body.userId = decoded.userId
      req.body.roleId = decoded.roleId
      next()
    }
  })
}
