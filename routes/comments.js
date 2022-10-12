const moment = require('moment')
const express = require('express')
const router = express.Router()
const { Comment, validateComment } = require('../models/comment')
const { Article } = require('../models/article')
const auth = require('../midwares/auth')
const admin = require('../midwares/admin')

router.get('/:id', async (req, res) => {
  const comment = await Comment.find({ articleId: req.params.id })
    .populate('comment_uid', '-password')
    .populate('to_uid', '-password')
    .select('-articleId')
  if (!comment) return

  res.send(comment)
})

router.post('/:id', [auth], async (req, res) => {
  const { error } = validateComment(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  if (!req.body.comment_parent) {
    let comment = new Comment({
      articleId: req.params.id,
      comment_content: req.body.comment_content,
      comment_uid: req.body.comment_uid,
      comment_datetime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      comment_parent: '0'
    })

    comment = await comment.save()

    let article = await Article.findById(req.params.id).select('-__v')

    article = await Article.findByIdAndUpdate(
      req.params.id,
      { $inc: { comments: 1 } },
      { new: true }
    )

    return res.send(comment)
  }

  let comment = new Comment({
    articleId: req.params.id,
    comment_content: req.body.comment_content,
    comment_uid: req.body.comment_uid,
    comment_datetime: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    comment_parent: req.body.comment_parent,
    to_uid: req.body.to_uid
  })

  comment = await comment.save()

  let article = await Article.findById(req.params.id).select('-__v')

  article = await Article.findByIdAndUpdate(req.params.id, { $inc: { comments: 1 } }, { new: true })

  res.send(comment)
})

// router.put("/:id", [auth], async (req, res) => {
//   // const { error } = validateReply(req.body);
//   // if (error) return res.status(400).send(error.details[0].message);

//   const comment = await Comment.findByIdAndUpdate(
//     req.params.id,
//     {
//       reply_content: req.body.reply_content,
//       reply_uid: req.body.reply_uid,
//       replyt_datetime: moment(new Date()).format("YYYY-MM-DD HH:mm:ss"),
//     },
//     { new: true }
//   );

//   if (!comment)
//     return res.status(404).send("The comment with the given ID was not found.");

//   res.send(comment);
// });

module.exports = router
