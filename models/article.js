const Joi = require('joi')
const mongoose = require('mongoose')

const Article = mongoose.model(
  'Article',
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 50
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 250
    },
    content: {
      type: String,
      required: true,
      trim: true,
      minlength: 5
    },
    time: {
      type: Date,
      required: true,
      default: new Date()
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    category: {
      type: Array,
      required: true
    },
    likes: {
      type: Number,
      required: true,
      default: 0
    },
    comments: {
      type: Number,
      required: true,
      default: 0
    },
    watchers: {
      type: Number,
      required: true,
      default: 0
    },
    img: {
      type: String,
      default: ''
    }
  })
)

function validateArticle(article) {
  const schema = {
    title: Joi.string().min(5).max(50).required(),
    description: Joi.string().min(5).max(250).required(),
    content: Joi.string().min(25).required(),
    author: Joi.string().min(5).max(50).required(),
    category: Joi.array().required()
  }

  return Joi.validate(article, schema)
}

exports.Article = Article
exports.validate = validateArticle
