import courseModel from '../../model/courseModel'
import _ from 'lodash'
const { ObjectId } = require('mongodb')

export const apiInsertCourse = async (req, res) => {
  if (req.body.roleId === 1) {
    if ((!req.body.name ||
            (!req.body.difficulty_level) ||
            (!req.body.category) || !(req.body.author) || !(req.body.popularity))) {
      res.status(400).json({
        error: 'malformed data'
      })
      return
    }
    const insertData = {
      name: req.body.name,
      difficulty_level: req.body.difficulty_level,
      category: req.body.category,
      author: req.body.author,
      popularity: req.body.popularity,
      userId: ObjectId(req.body.userId)
    }

    try {
      const result = await courseModel.insertCourseData(insertData)
      if (result instanceof Error) {
        res.status(400).json({ error: result.message })
      } else {
        res.status(200).json({ message: 'Course Added to the List.' })
      }
    } catch (err) {
      res.status(400).json({ error: err })
    }
  } else {
    res.status(403).json({ error: 'Access Denied. Please contact Administrator.' })
  }
}

export const apiDeleteCourse = async (req, res) => {
  if (req.body.roleId === 1) {
    if (!req.body.courseId && !req.body.userId) {
      res.status(400).json({
        error: 'malformed data'
      })
      return
    }
    try {
      const result = await courseModel.deleteCourseById(req.body.courseId, req.body.userId)
      if (result instanceof Error) { res.status(400).json({ error: result.message }) } else { res.status(200).json({ message: 'Course Successfully Removed' }) }
    } catch (err) {
      res.status(400).json(err)
    }
  } else {
    res.status(403).json({ error: 'Access Denied. Please contact Administrator.' })
  }
}

export const apiGetAllCourseList = async (req, res) => {
  req.body.search = req.body.search ? req.body.search : {}
  try {
    const result = await courseModel.listAllCourse(req.body)
    if (result instanceof Error) { res.status(400).json({ error: result.message }) } else { res.status(200).json({ data: result.data }) }
  } catch (err) {
    res.status(400).json(err)
  }
}

export const apiUpdateCourseData = async (req, res) => {
  if (req.body.roleId === 1) {
    if (!req.body.courseId) {
      res.status(400).json({
        error: 'malformed data'
      })
      return
    }
    try {
      const updateData = {
        popularity: req.body.popularity,
        author: req.body.author,
        category: req.body.category,
        difficulty_level: req.body.difficulty_level,
        userId: ObjectId(req.body.userId),
        courseId: ObjectId(req.body.courseId)
      }

      const checkCategory = await courseModel.checkCategoryExistByName(req.body.category)

      if (checkCategory.length > 0) {
        const checkDiff = _.difference(req.body.category, _.map(checkCategory, 'categoryName'))
        checkDiff.map(async (ele) => {
          const insertNewCategory = await courseModel.insertCategoryData({ categoryName: ele })
        })
      } else {
        req.body.category.map(async (item) => {
          const insertNewCategory = await courseModel.insertCategoryData({ categoryName: item })
        })
      }
      const result = await courseModel.updateCourseData(updateData)
      if (result instanceof Error) { res.status(400).json({ error: result.message }) } else { res.status(200).json({ message: 'Course Data Successfully Updated' }) }
    } catch (err) {
      res.status(400).json(err)
    }
  } else {
    res.status(403).json({ error: 'Access Denied. Please contact Administrator.' })
  }
}
