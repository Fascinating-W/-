// 登录和注册的路由
const express = require('express')
const router = express.Router()
// 引入第三方加密插件
const bcrypt = require('bcrypt')
// 头像
const gravatar = require('gravatar')
// token
const jwt = require('jsonwebtoken')
const passport = require('passport')

//
const key = require('../../config/key')

// 引入 User 表
const User = require('../../models/User')

/**
 * $route GET api/users/test
 * @desc 返回请求的json数据
 * @access(公开or私有接口，返回一个token的是私有) public
 */


/**
 * $route POST api/users/register
 * @desc 返回请求的json数据
 * @access public
 */
router.post('/register', (req, res) => {
  // 查询数据库中是否拥有邮箱
  User.findOne({
    email: req.body.email
  }).then(user => {
    if (user) {
      return res.status(400).json('邮箱已被注册！')
    } else {
      //设置头像
      const avator = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      })

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avator,
        password: req.body.password,
        identity: req.body.identity
      })
      bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          //箭头函数中hash就是加密后的密码
          if (err) throw err

          newUser.password = hash

          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err))
        })
      })
    }
  })
})

/**
 * $route POST api/users/login
 * @desc 返回token jwt(json web token)
 * @access privacy
 */
router.post('/login', (req, res) => {
  const email = req.body.email
  const password = req.body.password
  //查询数据库
  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json('用户不存在')
    }
    //密码匹配

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        /* jwt.sign('规则','加密名字','过期时间','箭头函数') */
        const rule = {
          id: user.id, 
          name: user.name,
          identity: user.identity,
          avator: user.avator
        } //定义规则
        jwt.sign(rule, key.secretKey, {expiresIn: 3600}, (err, token) => {
          if(err) throw err
          res.json({
            success: true,
            token: "Bearer " + token
          })
        })
      } else {
        return res.status(400).json('密码错误！')
      }
    })
  })
})

/**
 * $route GET api/users/current  当前用户请求的信息
 * @desc return current user
 * @access privacy
 */
// 请求current的目的是为了拿到数据库的某条数据，而拿数据必须要验证token(通过passport)
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  // 返回用户的信息
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    identity: req.user.identity
  })
})

module.exports = router
