<template>
  <div class="interaction-data">
    <div class="title-data">
      <span>互动统计</span>
    </div>
    <title-data :liveDetailInfo="liveDetailInfo"></title-data>
    <base-data :isStatus="liveDetailInfo.webinar_state" :webinarType="liveDetailInfo.webinar_type"></base-data>
  </div>
</template>
<script>
import titleData from './components/title';
import baseData from './components/baseData';
export default {
  components: {
    titleData,
    baseData
  },
  data() {
    return {
      liveDetailInfo: {}
    };
  },
  created() {
    this.getLiveDetail();
  },
  methods: {
    //获取直播详情
    getLiveDetail() {
      this.$fetch('getWebinarInfo', {webinar_id: this.$route.params.str}).then(res=>{
        this.liveDetailInfo = res.data;
      }).catch(error=>{
        this.$message.error(`获取信息失败,${error.errmsg || error.message}`);
        console.log(error);
      });
    }
  },
};
</script>
<style lang="less" scoped>
.interaction-data {
  .title-data {
    margin: 20px 0;
    text-align: left;
    line-height: 30px;
    span {
      font-size: 22px;
      font-family: @fontSemibold;
      font-weight: 600;
      color: #1a1a1a;
    }
  }
}
</style>
