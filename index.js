const express = require('express')
const app = express()
const config = require('config')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const users = require('./routes/users')
const articles = require('./routes/articles')
const comments = require('./routes/comments')
const login = require('./routes/login')
const liked = require('./routes/liked')
const github = require('./routes/github')
const upload = require('./routes/upload')

// mongoose
//   .connect('mongodb://localhost:27017') // mongodb://test:123@107.182.25.151/mybase?authSource=admin
//   .then(() => console.log('Connected to MongoDB...'))
//   .catch((err) => console.error('Could not connect to MongoDB...'))

app.use(cors()) // 方法cors中间件跨域问题
app.use(express.json({ limit: '10000kb' })) // solve big file

app.use('/static', express.static(path.join(__dirname, './public')))
// 访问地址:http://localhost:3100/static/imgs/filename.png
app.use('/api/github', github)
app.use('/api/users', users)
app.use('/api/auth', login)
app.use('/api/articles', articles)
app.use('/api/comments', comments)
app.use('/api/likes', liked)
app.use('/api/upload', upload)

const port = process.env.PORT || config.get('port')
app.listen(port, () => console.log(`Listening on port ${port}...`))
