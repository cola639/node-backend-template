const Joi = require('joi')
const mongoose = require('mongoose')

const ArticleLiked = mongoose.model(
  'ArticleLiked',
  new mongoose.Schema({
    articleId: {
      type: String,
      required: true,
      trim: true
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ]
  })
)

function validate(liked) {
  const schema = {
    articleId: Joi.string().required(),
    liked_uid: Joi.string().required()
  }

  return Joi.validate(liked, schema)
}

exports.ArticleLiked = ArticleLiked
exports.validate = validate
