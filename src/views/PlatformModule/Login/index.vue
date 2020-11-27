<template>
  <div class="login-container">
    <el-button type="primary" @click.native.prevent="handleLogin">点击登录</el-button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  methods: {
    handleLogin() {
      this.$router.push({ path: this.redirect || '/' });
    }
  }
};
</script>

<style lang="less" scoped>
</style>
