<template>
  <div id="app">
    
    <router-view/>
  </div>
</template>
<script>
import jwt_decode from 'jwt-decode'
export default {
  name: 'app',
  created() {
    // 防止刷新页面，丢失数据
    if(localStorage.eleToken) {
      const decoded = jwt_decode(localStorage.eleToken)
      // 将解析后的token存储到vuex中
      this.$store.dispatch('setAuthenticated', !this.isEmpty(decoded))
      this.$store.dispatch('setUser', decoded)
    }
  },
  methods: {
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
<style>
html,
body,
#app {
  width: 100%;
  height: 100%;
}

</style>
