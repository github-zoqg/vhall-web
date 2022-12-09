<template>
  <div class="binding">
    {{ bindingText }}
  </div>
</template>
<script>
  import { sessionOrLocal, getQueryString } from '@/utils/utils';
  export default {
    data() {
      return {
        bindingText: ''
      };
    },
    created() {
      this.getUserInfo();
    },
    methods: {
      getUserInfo() {
        let params = {
          key: getQueryString('user_auth_key'),
          scene_id: 2
        };
        this.$fetch('callbackUserInfo', params).then(res => {
          this.bindingText = '绑定成功';
          sessionOrLocal.set('userInfo', JSON.stringify(res.data));
          sessionOrLocal.set('userId', JSON.stringify(res.data.user_id));
          // this.$router.push({path: '/finance/income'})
        });
      }
    }
  };
</script>
<style lang="less" scoped>
  .binding {
    font-size: 24px;
    color: #3b67f9;
  }
</style>
