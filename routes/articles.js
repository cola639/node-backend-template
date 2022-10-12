const express = require('express')
const router = express.Router()
const auth = require('../midwares/auth')
const admin = require('../midwares/admin')
const { Article, validate } = require('../models/article')
const validateObjectId = require('../midwares/validateObjectId')

router.get('/', async (req, res) => {
  const articles = await Article.find().limit(9).populate('author', '-password').select('-content')

  res.send(articles)
})

router.get('/all', async (req, res) => {
  const articles = await Article.find().populate('author', 'name -_id').select('-content')

  res.send(articles)
})

router.post('/more', async (req, res) => {
  const articles = await Article.find()
    .skip(req.body.pageNumber * 9)
    .limit(9)

  res.send(articles)
})

router.get('/search', async (req, res) => {
  const query = req.query.name

  const articles = await Article.find()
    .or([
      {
        title: new RegExp('.*' + query + '.*', 'i')
      },
      { description: new RegExp('.*' + query + '.*', 'i') }
    ])
    .populate('author', 'name -_id')
  if (!articles) return res.send({ msg: '没有对应文章' })

  res.send(articles)
})

router.post('/', [auth], async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  let article = new Article({
    title: req.body.title,
    description: req.body.description,
    content: req.body.content,
    author: req.body.author,
    category: req.body.category
  })

  article = await article.save()

  res.send(article)
})

router.put('/:id', [auth], async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  article = await Article.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      description: req.body.description,
      content: req.body.content,
      author: req.body.author
    },
    { new: true } //返回新的文章给客户端
  )

  article = await article.save()

  if (!article) return res.status(404).send('The article with the given ID was not found.')

  res.send(article)
})

router.put('/img/:id', [auth], async (req, res) => {
  article = await Article.findByIdAndUpdate(
    req.params.id,
    {
      img: req.body.url
    },
    { new: true } //返回新的文章给客户端
  )

  article = await article.save()

  if (!article) return res.status(404).send('The article with the given ID was not found.')

  res.send({ msg: '更换成功' })
})

router.delete('/:id', async (req, res) => {
  const article = await Article.findByIdAndRemove(req.params.id)

  if (!article) return res.status(404).send('The article with the given ID was not found.')

  res.send(article)
})

router.get('/:id', [validateObjectId], async (req, res) => {
  let article = await Article.findByIdAndUpdate(
    req.params.id,
    { $inc: { watchers: 1 } },
    { new: true }
  )

  article = await Article.findById(req.params.id).populate('author', 'name').select('-__v')

  if (!article) return res.status(404).send('文章不存在')

  res.send(article)
})

router.get('/category/:id', async (req, res) => {
  const article = await Article.find({
    category: { $elemMatch: { $eq: `${req.params.id}` } }
  })
    .populate('author', '-password')
    .select('-__v')
  res.send(article)
})

module.exports = router
