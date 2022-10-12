const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
//上传图片的模板
var multer = require('multer')

//上传缓存64位文件放入uploads文件夹下
var upload = multer({ dest: 'uploads/' })

// router.get("/", (req, res) => {
//   const des_file = path.join(__dirname, "../public/imgs" + "\\");
//   console.log(__dirname);
//   console.log(des_file);
//   console.log(path.join(__dirname, "../../static/img/"));
//   D:\ReactBlog\backend\routes
//   D:\ReactBlog\backend\public\imgs\
//   D:\ReactBlog\static\img\
// });

// router.post("/", (req, res) => {
//   const file = req.file;

//   console.log(file);
// });

router.post('/', upload.single('file'), (req, res) => {
  const file = req.file

  fs.readFile(file.path, (err, data) => {
    if (err) {
      return res.send('上传失败')
    }
    //声明图片名字为时间戳和随机数拼接成的，确保唯一性
    let time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222)
    let extname = file.mimetype.split('/')[1]
    //拼接成图片名
    let keepname = time + '.' + extname
    const des_file = path.join(__dirname, '../public/imgs/' + keepname)

    //三个参数
    //1.图片的绝对路径
    //2.写入的内容
    //3.回调函数
    fs.writeFile(des_file, data, err => {
      if (err) {
        return res.send('写入失败')
      }
      res.send({ err: 0, msg: '上传ok', url: keepname })
    })
  })
})

module.exports = router
