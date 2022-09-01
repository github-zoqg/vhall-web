<template>
  <div :class="`privacy-select scene_${scene}`">
    <el-checkbox v-model.trim="isCheck" v-if="scene != 'default'" @change="emitCheckboxVal"></el-checkbox>
    <div>阅读并同意<a :href="privacyUrl" target="_blank" rel="noopener noreferrer">《微吼隐私政策》</a>及<a :href="privacyUPoUrl" target="_blank" rel="noopener noreferrer">《微吼用户服务协议》</a></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isCheck: false,
      privacyUrl: `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/privacyPolicy`,
      privacyUPoUrl: `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/privacyUPo`,
    }
  },
  props: {
    scene: {
      type: String,
      default: 'default'
    }
  },
  methods: {
    emitCheckboxVal(val) {
      this.$emit('check', {
        checked: val,
        scene: this.scene
      });
    }
  }
}
</script>
<style lang="less" scoped>
.privacy-select {
  text-align: left;
  /* 登录：展开其它登录方式 */
  &.scene_login, &.scene_loginDynamic {
    margin-top: 24px;
  }
  /* 登录：未展开其它登录方式 */
  &.scene_login_normal {
    margin-top: 4px;
  }
  /* 注册 */
  &.scene_register {
    margin-top: 70px;
  }
  div {
    display: inline-block;
    vertical-align: middle;
    font-style: normal;
    font-weight: 400;
    font-size: 12px;
    line-height: 17px;
    height: 17px;
    color: #8C8C8C;
    margin-left: 8px;
  }
  a {
    color: #3562FA;
    text-decoration: none;
    &:hover {
      color: #3562FA;
    }
  }
}
</style>
