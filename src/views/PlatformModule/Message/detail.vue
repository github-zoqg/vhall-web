<template>
  <div>
    <pageTitle title='消息详情'></pageTitle>
    <div class="msg__detail">
      <h1>{{msgDao && msgDao.title ? msgDao.title : ''}}</h1>
      <p><span>接收时间：{{msgDao && msgDao.created_at ? msgDao.created_at : ''}}</span></p>
      <hr />
      <div class="msg_ctx">
        {{msgDao && msgDao.content ? msgDao.content : ''}}
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
export default {
  name: 'msgDetail.vue',
  components: {
    PageTitle,
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
        msg_id: this.$route.params.str,
      }).then(res =>{
        this.msgDao = res && res.code === 200 && res.data ? res.data : {};
      }).catch(e=>{
        console.log(e);
        this.msgDao = {};
      });
    },
  },
  created() {
    this.getMsgInfo();
  }
};
</script>

<style lang="less" scoped>
.msg__detail {
  .layout--right--main();
  .padding41-40();
  .min-height();
  text-align: center;
  line-height: 2.5;
}
h1 {
  font-weight: bold;
  font-size: 18px;
}
.msg_ctx {
  text-align: left;
}
</style>
