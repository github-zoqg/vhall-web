<template>
  <div>
    <pageTitle pageTitle="消息详情"></pageTitle>
    <div class="msg__detail">
      <h1>{{ msgDao && msgDao.title ? msgDao.title : '' }}</h1>
      <p class="msg__date">
        <span>接收时间：{{ msgDao && msgDao.created_at ? msgDao.created_at : '' }}</span>
      </p>
      <hr />
      <div class="msg_ctx">
        {{ msgDao && msgDao.content ? msgDao.content : '' }}
      </div>
    </div>
  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle';
  export default {
    name: 'msgDetail.vue',
    components: {
      PageTitle
    },
    data() {
      return {
        msgDao: null
      };
    },
    methods: {
      // 获取消息中心详情数据
      getMsgInfo() {
        this.$fetch('getMsgInfo', {
          msg_id: this.$route.params.str
        })
          .then(res => {
            this.msgDao = res && res.code === 200 && res.data ? res.data : {};
          })
          .catch(e => {
            console.log(e);
            this.msgDao = {};
          });
      }
    },
    created() {
      this.getMsgInfo();
      // 通知右上角导航，需要更新未度消息
      this.$EventBus.$emit('saas_vs_msg_count', true);
    }
  };
</script>

<style lang="less" scoped>
  .msg__detail {
    .layout--right--main();
    .min-height();
    padding: 48px 200px 0 200px;
    text-align: center;
    line-height: 2.5;
  }
  h1 {
    font-size: 20px;
    font-weight: 400;
    color: #1a1a1a;
    line-height: 28px;
    text-align: center;
    margin-bottom: 8px;
  }
  .msg__date {
    font-size: 14px;
    font-weight: 400;
    color: #555555;
    line-height: 20px;
    text-align: center;
  }
  hr {
    border-width: 1px 0 0 0;
    border-color: #e6e6e6;
    border-radius: 2px;
    margin: 16px 0 0 0;
  }
  .msg_ctx {
    padding-top: 24px;
    font-size: 14px;
    text-align: left;
    word-break: break-all;
  }
</style>
