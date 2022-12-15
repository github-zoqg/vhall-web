<template>
  <div class="container-box">
    <div class="flex-item">
      <div class="box-item">
        <img :src="liveDetailInfo.img_url" alt="" />
      </div>
      <div class="box-title">
        <div class="title-status padlr8" v-if="liveDetailInfo.webinar_state == 1">
          <img src="../../../../common/images/live/lives.gif" alt="" />
          <b>
            直播
            <span v-if="liveDetailInfo.webinar_type == 5">| 定时直播</span>
            <span
              v-if="
                hasDelayPermission &&
                liveDetailInfo.no_delay_webinar &&
                liveDetailInfo.webinar_type != 6
              "
            >
              | 无延迟
            </span>
            <span v-if="webinarDirector && liveDetailInfo.is_director === 1">| 云导播</span>
            <span v-if="liveDetailInfo.webinar_show_type == 0">| 竖屏</span>
          </b>
        </div>
        <div class="title-status grayColor" v-else>
          <b>
            {{ liveDetailInfo | actionTextTag }}
            <span
              v-if="
                liveDetailInfo.webinar_type != 6 &&
                hasDelayPermission &&
                liveDetailInfo.no_delay_webinar
              "
            >
              | 无延迟
            </span>
            <span v-if="webinarDirector && liveDetailInfo.is_director === 1">| 云导播</span>
            <span v-if="liveDetailInfo.webinar_show_type == 0">| 竖屏</span>
          </b>
        </div>
        <div class="title-text">
          <p>
            {{ liveDetailInfo.subject }}
          </p>
        </div>
        <div class="box-time">直播时间：{{ liveDetailInfo.start_time }}</div>
      </div>
    </div>
  </div>
</template>
<script>
  import { sessionOrLocal } from '@/utils/utils';

  export default {
    props: ['liveDetailInfo'],
    data() {
      return {
        hasDelayPermission: false
      };
    },
    computed: {
      // admin无云导播活动权限
      webinarDirector() {
        //  webinar.director 1:有无延迟权限  0:无权限
        if (
          JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))['webinar.director'] == '1'
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    mounted() {
      const SAAS_VS_PES = sessionOrLocal.get('SAAS_VS_PES', 'localStorage');
      this.hasDelayPermission = SAAS_VS_PES
        ? JSON.parse(SAAS_VS_PES)['no.delay.webinar'] == '1'
        : false;
    }
  };
</script>
<style lang="less" scoped>
  .container-box {
    height: 114px;
    background: #fff;
    border-radius: 4px;
    margin-bottom: 30px;
  }
  .flex-item {
    display: flex;
  }
  .box-item {
    width: 146px;
    height: 82px;
    margin: 16px 21px 17px 16px;
    border-radius: 4px;
    background: #1a1a1a;
    img {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      object-fit: scale-down;
    }
  }
  .box-title {
    margin-top: 18px;
    flex: 1;
    width: 70%;
    .title-status {
      // min-width: 52px;
      display: inline-block;
      height: 18px;
      line-height: 18px;
      text-align: center;
      background: linear-gradient(180deg, #ff584b 0%, #ff2820 100%);
      border-radius: 25px;
      padding: 3 8px;
      img {
        height: 8px;
        width: 8px;
        vertical-align: top;
        margin: 5px 3px 5px 0;
      }
      b {
        display: inline-block;
        font-size: 12px;
        font-family: @fontRegular;
        color: #fff;
        vertical-align: top;
        font-style: normal;
        font-weight: normal;
        // line-height: 18px;
      }
    }
    .grayColor {
      // width: 46px;
      padding: 0 8px;
      background: #000000;
      opacity: 0.6;
      text-align: center;
    }
    .title-text {
      p {
        font-size: 20px;
        font-weight: 400;
        font-family: @fontRegular;
        color: #1a1a1a;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        padding: 12px 24px 5px 0;
      }
    }
    .box-time {
      height: 20px;
      font-size: 14px;
      font-family: @fontRegular;
      color: #555;
      line-height: 20px;
    }
  }
  .padlr8 {
    padding: 0 8px;
  }
</style>
