import db from '../helper/mongo'
const { ObjectId } = require('mongodb')

const Course = {}

Course.insertCourseData = async (params) => {
  try {
    const collection = db.get().collection('courses')
    const data = await collection.insertOne(params)
    return { data: data }
  } catch (err) {
    return err
  }
}

Course.getAllCourses = async (params) => {
  try {
    const res = await db.get().collection('courses').find({ isActive: 1 }).toArray()
    return res
  } catch (err) {
    return err
  }
}

Course.checkCategoryExistByName = async (categoryName) => {
  try {
    const res = await db.get().collection('categories').find({ categoryName: { $in: categoryName } }).toArray()
    return res
  } catch (err) {
    return err
  }
}

Course.insertCategoryData = async (params) => {
  try {
    const collection = db.get().collection('categories')
    const data = await collection.insertOne(params)
    return { data: data }
  } catch (err) {
    return err
  }
}

Course.updateCourseData = async (params) => {
  params.courseId ? params._id = ObjectId(params.courseId) : ''
  delete params.courseId
  try {
    const updateCourse = await db.get().collection('courses').updateOne(
      { _id: ObjectId(params._id) },
      { $set: { userId: ObjectId(params.userId), popularity: params.popularity, author: params.author, category: params.category, difficulty_level: params.difficulty_level } }
    )
    return updateCourse
  } catch (err) {
    return err
  }
}

Course.deleteCourseById = async (CourseId, userId) => {
  try {
    const collection = db.get().collection('courses')
    const inActiveData = await collection.updateOne(
      { _id: ObjectId(CourseId) },
      { $set: { isActive: 0, userId: ObjectId(userId) } }
    )
    return { message: 'Course successfully deleted' }
  } catch (err) {
    return err
  }
}

Course.listAllCourse = async (params) => {
  params.search.author ? params.search.author = new RegExp(params.search.author, 'i') : ''
  params.search.name ? params.search.name = new RegExp(params.search.name, 'i') : ''
  params.search.category ? params.search.category = { $in: params.search.category } : ''
  params.search.isActive = 1
  try {
    const res = await db.get().collection('courses').find(params.search).sort(params.sort).toArray()
    return { data: res }
  } catch (err) {
    return err
  }
}

export default Course
