<template>
  <div class="begin-play">
    <el-tooltip class="item" effect="dark" content="发起直播" placement="top">
      <div class="begin-btn" @click="toRoom">
        <i class="iconfont-v3 saasicon_kaibo"></i>
      </div>
    </el-tooltip>

  </div>
</template>
<script>
import { sessionOrLocal, debounce } from '@/utils/utils';
export default {
  props: ['webinarId'],
  methods: {
    // 判断是否有起直播的权限
    getOpenLive() {
      let webinarType = JSON.parse(sessionOrLocal.get("webinarType"));
      if (webinarType == 1) {
          let href = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/lives/room/${this.webinarId}`;
          window.open(href, '_blank');
        } else {
          const { href } = this.$router.resolve({path: `/live/chooseWay/${this.webinarId}/1?type=ctrl`});
          window.open(href, '_blank');
        }
    },
    toRoom(){
      // 跳转至发起页面
      debounce(async () => {
        let status = JSON.parse(sessionOrLocal.get("arrears")).total_fee;
        if (status) {
          this.$confirm('尊敬的微吼会员，您的流量已用尽，请充值', '提示', {
            confirmButtonText: '去充值',
            cancelButtonText: '知道了',
            customClass: 'zdy-message-box',
            lockScroll: false,
            cancelButtonClass: 'zdy-confirm-cancel',
          }).then(() => {
            this.$router.push({path:'/finance/info'});
          }).catch(() => {});
        } else {
          this.$fetch('checkLive', this.$params({
            webinar_id: this.webinarId
          })).then((res) => {
            if(res && res.code === 200) {
              this.getOpenLive()
            } else {
              this.$message.error(res.msg)
            }
          }).catch(res => {
            this.$message.error(res.msg)
          });
        }

      }, 500)


    },
  }
}
</script>
<style lang="less" scoped>
  .begin-play{
    position: fixed;
    right: 60px;
    bottom: 100px;
    .begin-btn{
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #FB3A32;
      text-align: center;
      cursor: pointer;
      position: relative;
      box-shadow: 0px 2px 12px 0px rgba(207, 45, 48, 0.7), 0px 1px 2px 0px rgba(220, 64, 66, 0.5);
      i{
        position: absolute;
        top:50%;
        left: 50%;
        transform: translate(-50%,-50%);
        color: #fff;
        font-size: 30px;
      }
    }
  }
</style>
