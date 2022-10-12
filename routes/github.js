const express = require('express')
const router = express.Router()
const querystring = require('querystring')
const axios = require('axios')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const { User } = require('../models/user')

const config = {
  client_id: '2b1ecf2a5335ff97b985',
  client_secret: '0210faae9b2ad2ab29c5072153114b6a3cf14a22'
}

//在前端实现
// router.get("/login", async (req, res) => {
//   console.log("login");
//   // 重定向到GitHub认证接口，并配置参数
//   let path =
//     "https://github.com/login/oauth/authorize?client_id=" + config.client_id;
//   // 转发到授权服务器
//   res.redirect(path);
// });

router.post('/callback', async (req, res) => {
  const code = req.body.code
  const params = {
    client_id: config.client_id,
    client_secret: config.client_secret,
    code
  }

  // 申请令牌token
  try {
    let result = await axios.post('https://github.com/login/oauth/access_token', params)
    const access_token = querystring.parse(result.data).access_token

    //获取用户数据
    result = await axios.get(`https://api.github.com/user`, {
      headers: {
        Authorization: 'token ' + access_token
      }
    })

    //获取用户信息或创建用户
    let user = await User.findOne({ githubId: result.data.id }).select('-password -__v')

    if (user) {
      const token = user.generateAuthToken()

      return res
        .status(200)
        .header('x-auth-token', token)
        .header('access-control-expose-headers', 'x-auth-token')
        .send(_.pick(user, ['_id', 'name', 'avatar', 'isAdmin', 'isAuthor']))
    }

    let userObj = {
      githubId: result.data.id,
      name: result.data.login,
      email: `${result.data.id}@x-github.com`,
      password: result.data.login,
      avatar: result.data.avatar_url
    }

    user = new User(userObj)
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
    await user.save()

    const token = user.generateAuthToken()

    res
      .header('x-auth-token', token)
      .header('access-control-expose-headers', 'x-auth-token')
      .send(_.pick(user, ['_id', 'name', 'avatar', 'isAdmin', 'isAuthor']))
  } catch (error) {
    res.status(404).send('github login error,try it again')
  }
})

module.exports = router
