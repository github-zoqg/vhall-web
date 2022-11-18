<template>
  <div class="interaction-data">
    <pageTitle pageTitle="互动统计"></pageTitle>
    <title-data :liveDetailInfo="liveDetailInfo"></title-data>
    <base-data
      :isStatus="liveDetailInfo.webinar_state"
      :webinarType="liveDetailInfo.webinar_type"
    ></base-data>
  </div>
</template>
<script>
  import titleData from './components/title';
  import baseData from './components/baseData';
  import PageTitle from '@/components/PageTitle';
  export default {
    components: {
      PageTitle,
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
      window.scrollTo(0, 0);
    },
    methods: {
      //获取直播详情
      getLiveDetail() {
        // webinar/info调整-正常的信息展示使用 0
        this.$fetch('getWebinarInfo', { webinar_id: this.$route.params.str, is_rehearsal: 0 })
          .then(res => {
            this.liveDetailInfo = res.data;
          })
          .catch(res => {
            this.$message({
              message: res.msg || `获取信息失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            console.log(res);
          });
      }
    }
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
