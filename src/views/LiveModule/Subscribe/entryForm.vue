<template>
  <div class="openlink-wrap">
    <sign-form v-if="formOpenLinkStatus"></sign-form>
    <div class="no-open" v-else>
      <p>
        该页面已停止提供服务
        <br>
        如有问题请咨询链接提供方
      </p>
    </div>
  </div>
</template>

<script>
  import SignForm from './signUpForm'
  export default {
    components: {
      SignForm
    },
    data() {
      return {
        webinar_id: this.$route.params.id,
        formOpenLinkStatus: false,
      }
    },
    created() {
      this.getFormOpenLinkStatus();
    },
    methods: {
      // 报名表单独立链接是否有效
      getFormOpenLinkStatus() {
        this.$fetch('verifyOpenLink', {
          webinar_id: this.webinar_id
        }).then(res => {
          if(res.data.available == 0) return;
          this.formOpenLinkStatus = true;
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .openlink-wrap {
    width: 100%;
    height: 100%;
  }
  .no-open {
    width: 100%;
    height: 100%;
    background: url(../../../common/images/webinar.png) no-repeat center;
    background-size: cover;
    display: flex;
    align-items: center;
    justify-content: center;
    p {
      color: #fff;
      font: 18px/2 'Microsoft Yahei';
      text-align: center;
    }
  }
</style>
