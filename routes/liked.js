const express = require('express')
const router = express.Router()
const _ = require('lodash')
const { Article } = require('../models/article')
const auth = require('../midwares/auth')
const { ArticleLiked } = require('../models/articleLiked')

router.get('/:id', async (req, res) => {
  const likes = await ArticleLiked.find({ articleId: req.params.id })
    .populate('users', '-password')
    .select('users')

  res.send(likes)
})

router.post('/:id', [auth], async (req, res) => {
  const articleLikes = await ArticleLiked.find({
    articleId: req.params.id
  })
  if (articleLikes.length > 0) return res.send('likes already declared')
  const newLikes = new ArticleLiked({
    articleId: req.params.id
  })
  await newLikes.save()
  res.send('likes done')
})

router.put('/:id', [auth], async (req, res) => {
  if (req.body.liked) {
    await ArticleLiked.update({ _id: req.body._id }, { $pull: { users: req.body.userId } })

    await Article.findByIdAndUpdate(req.body.articleId, { $inc: { likes: -1 } }, { new: true })

    return res.send('操作成功')
  }

  await ArticleLiked.update({ _id: req.body._id }, { $addToSet: { users: req.body.userId } })

  await Article.findByIdAndUpdate(req.body.articleId, { $inc: { likes: 1 } }, { new: true })

  res.send('操作成功')
})

router.delete('/:id', async (req, res) => {
  const likes = await ArticleLiked.deleteOne({ articleId: req.params.id })
  if (!likes) return res.status(404).send('The likes with the given ID was not found.')

  res.send(likes)
})

module.exports = router
