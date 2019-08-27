<template>
  <div class="login">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">在线后台管理系统</span>
        <el-form
          :model="loginUser"
          :rules="rules"
          ref="loginForm"
          label-width="60px"
          class="loginForm"
        >
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="loginUser.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginUser.password" placeholder="请输入密码" type="password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="submitForm('loginForm')" type="primary" class="submit_btn">登录</el-button>
          </el-form-item>
          <div class="tip">
            <p>还没有账号？现在<router-link to="/register">注册</router-link></p>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>
<script>
import jwt_decode from 'jwt-decode'
export default {
  name: 'login',
  components: {},
  data() {
    return {
      loginUser: {
        email: '',
        password: '',
      },
      rules: {
        email: [{
          type: 'email',
          required: true,
          message: '邮箱格式不正确',
          trigger: 'blur'
        }],
        password: [
          {
            required: true,
            message: '密码不能为空',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 30,
            message: '长度在6到30之间',
            trigger: 'blur'
          },
        ],
      },

    }
  },
  methods: {
    submitForm(formName) {
      //也可不传参时，则调用时 this.$refs['registerForm'] 直接使用表单的ref值
      this.$refs[formName].validate(valid => {
        if(valid) {
          this.$axios.post('/api/users/login', this.loginUser).then(res => {
            //拿 token
            const { token } = res.data
            //存储到ls
            localStorage.setItem('eleToken', token)

            //解析token 
            // decoded为空表示未授权，否则有授权
            const decoded = jwt_decode(token)
            //console.log(decoded)
            // 将解析后的token存储到vuex中
            //1.判断是否授权
            this.$store.dispatch('setAuthenticated', !this.isEmpty(decoded))
            this.$store.dispatch('setUser', decoded)
            
            this.$router.push('/index')
          })
        }
      })
    },
    // 判断值为空的方法，为空返回true
    isEmpty(value) {
      return (
        value === undefined || 
        value === null ||
        (typeof value === 'object' && Object.keys(value).length === 0) ||
        (typeof value === 'string' && value.trim().length === 0)

      )
    }
  },
}
</script>
<style scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/img/bg.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 20%;
  left: 34%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form_container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}

.loginForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #ccc
}
.submit_btn {
  width: 100%;
}
.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
}
.tiparea p a{
  color: #409eff;
}
</style>