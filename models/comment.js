const Joi = require('joi')
const mongoose = require('mongoose')

const Comment = mongoose.model(
  'Comment',
  new mongoose.Schema({
    articleId: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 50
    },
    comment_content: {
      type: String,
      required: true
    },
    comment_uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment_datetime: {
      type: Date,
      required: true
    },
    comment_parent: {
      type: String,
      required: true
    },
    to_uid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  })
)

function validateComment(comment) {
  const schema = {
    comment_content: Joi.string().required(),
    comment_uid: Joi.string().required(),
    comment_parent: Joi.string(),
    to_uid: Joi.string()
  }

  return Joi.validate(comment, schema)
}

exports.Comment = Comment
exports.validateComment = validateComment
