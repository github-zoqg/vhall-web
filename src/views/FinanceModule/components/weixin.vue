<template>
  <div class="binding">
    {{ bindingText }}
  </div>
</template>
<script>
export default {
  data() {
    return {
      bindingText: ''
    };
  },
  created() {
    this.getUserInfo();
    if (this.$route.query.user_auth_key) {
      this.getUserInfo();
    } else {
      this.goBindingWeiXin();
    }
  },
  methods: {
    goBindingWeiXin() {
      let params = {
        jump_url: 'https://t-saas-dispatch.vhall.com/code'
      };
      this.$fetch('weixinBinding', params).then(res => {
        console.log(res);
      });
    },
    getUserInfo(){
      let params = {
        key: this.$route.query.user_auth_key,
        scene_id: 2
      };
      this.$fetch('callbackUserInfo', params).then(res => {
        this.bindingText = '绑定成功';
        console.log(res);
      });
    }
  }
};
</script>
<style lang="less" scoped>
  .binding{
    font-size: 24px;
    color: aqua;
  }
</style>
