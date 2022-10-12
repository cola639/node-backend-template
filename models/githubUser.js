const config = require('config')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')

const githubUserSchema = new mongoose.Schema({
  githubId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  avatar: {
    type: String,
    required: true
  },
  agreement: {
    type: Boolean,
    default: true
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isAuthor: {
    type: Boolean,
    default: false
  }
})

githubUserSchema.methods.generateAuthToken = function () {
  //jwt.sign(payload,jwtPrivateKey)
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      isAdmin: this.isAdmin,
      isAuthor: this.isAuthor
    },
    config.get('jwtPrivateKey')
  )
  return token
}

const GithubUser = mongoose.model('GithubUser', githubUserSchema)

exports.githubUserSchema = githubUserSchema
exports.GithubUser = GithubUser
