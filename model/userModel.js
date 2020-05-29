import db from '../helper/mongo'
const { ObjectId } = require('mongodb')

const User = {}

User.getUserDataByEmailId = async (params) => {
  try {
    const res = await db.get().collection('users').find({ emailId: params }).toArray()
    return res
  } catch (err) {
    return err
  }
}

User.updateApiTokenUser = async (params) => {
  try {
    const updateApiToken = await db.get().collection('users').updateOne(
      { _id: ObjectId(params._id) },
      { $set: { apiToken: params.apiToken } }
    )
    return updateApiToken
  } catch (err) {
    return err
  }
}

export default User
