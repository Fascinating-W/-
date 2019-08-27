const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000
// 引第三方token验证插件
const passport = require('passport')

// 引入user.js
const users = require('./routers/api/users')
// 引入profile.js
const profiles = require('./routers/api/profiles')

//使用body-parse中间件
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//初始化passport
app.use(passport.initialize())
// passport 配置
require('./config/passport')(passport)



const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/admin-restful-api', {
  useFindAndModify: true,
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => {
  console.log('数据库连接成功')
}).catch(err => {
  console.log(err)
})


app.get('/', (req, res) => {
  res.send('hellow')
})

// 使用 routes
app.use('/api/users', users)
app.use('/api/profiles', profiles)

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});