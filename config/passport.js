const keys = require('../config/key')

// passport 配置
const JwtStrategy = require('passport-jwt').Strategy, 
ExtractJwt = require('passport-jwt').ExtractJwt
const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = keys.secretKey
//-----------

const mongoose = require('mongoose')
const User = mongoose.model('users')

module.exports = passport => {
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    //console.log(jwt_payload)
    User.findById(jwt_payload.id).then(user => {
      //如果当前用户存在，将当前用户返回
      if(user){
        return done(null, user)
      }
      return done(null, false)
    }).catch(err => console.log(err))
  }))
}