import userModel from '../../model/userModel'
import bcrypt from 'bcrypt-nodejs'
import constant from '../../config/constant'
import _ from 'lodash'
import jwt from 'jsonwebtoken'
const Cryptr = require('cryptr')
const cryptr = new Cryptr(constant.apiTokenSecret)

export const apiCheckUserLogin = async (req, res) => {
  req.body.email ? req.body.email = _.trim(req.body.email.toLowerCase()) : ''
  if (!req.body.email || !req.body.password) {
    res.status(400).json({
      error: 'malformed data'
    })
    return
  }

  try {
    const result = await userModel.getUserDataByEmailId(req.body.email)
    if (result instanceof Error) {
      res.status(400).json({ error: result.message })
    } else {
      if (result && result.length > 0 && (!_.isEmpty(result[0].password))) {
        if (!bcrypt.compareSync(req.body.password, result[0].password)) {
               	 res.status(400).json({ error: 'improper email id or password' })
          return
        }
        delete result[0].password
        result[0].apiToken = jwt.sign({ userId: result[0]._id, roleId: result[0].roleId }, constant.apiJwtSecret, { expiresIn: constant.token_expire })
        const encryptedString = cryptr.encrypt(result[0].apiToken)
        result[0].apiToken = encryptedString
        const updatedTokenResult = await userModel.updateApiTokenUser(result[0])
        res.status(200).json({ data: result[0] })
      } else {
        res.status(400).json({ error: 'User Not found' })
        return
      }
    }
  } catch (err) {
    res.status(400).json(err)
  }
}
