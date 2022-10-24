<template>
  <div class="begin-play" v-if="baseInfo&&baseInfo.webinar_show_type==1">
    <el-tooltip class="item" effect="dark" v-tooltipMove content="发起直播" placement="top">
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
  data() {
    return {
      userId: '',
      baseInfo:null
    }
  },
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
    // 判断是否欠费
    getAppersInfo() {
      this.$fetch('getVersionInfo', { user_id: this.userId}).then(res => {
        if (res.data.arrears.total_fee > 0) {
          this.$confirm(`尊敬的微吼会员，您的${res.data.type == 1 ? '流量' : res.data.type == 2 ? '时长资源' : '并发套餐'}已用尽，${ res.data.type == 2 ? '请联系客服充值' : '请充值'}`, '提示', {
            confirmButtonText: res.data.type == 2 ? '知道了' : '去充值',
            cancelButtonText: '知道了',
            customClass: 'zdy-message-box',
            lockScroll: false,
            showCancelButton: res.data.type == 2 ? false : true,
            cancelButtonClass: 'zdy-confirm-cancel',
          }).then(() => {
            if (res.data.type == 2) return
            this.$router.push({path:'/finance/info'});
          }).catch(() => {});
        } else {
          this.toLive();
        }
      }).catch(e=>{
        console.log(e);
      });
    },
    toLive() {
      // 判断是否有权限发起
      this.$fetch('checkLive', this.$params({
        webinar_id: this.webinarId
      })).then((res) => {
        this.getOpenLive()
      }).catch(res => {
        this.$message({
          message: res.msg || '校验失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    toRoom(){
      // 跳转至发起页面
      this.userId = JSON.parse(sessionOrLocal.get('userId'));
      debounce(async () => {
        await this.getAppersInfo();
      }, 500)
    },
    getLiveBaseInfo() {
      // webinar/info调整-与活动状态无关的调用
      this.$fetch('getWebinarInfo', { webinar_id: this.$route.params.str })
        .then((res) => {
          if (res.code != 200) {
            return this.$message.warning(res.msg)
          }
          this.baseInfo = res.data
        })
        .catch((res) => {
          this.$message({
            message: res.msg || '获取信息失败',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box',
          })
          console.log(res)
        })
    },
  },
  mounted(){
    this.getLiveBaseInfo()
  }
}
</script>
<style lang="less" scoped>
  .begin-play{
    position: fixed;
    right: 60px;
    bottom: 100px;
    z-index: 100;
    .begin-btn{
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #FB3A32;
      text-align: center;
      cursor: pointer;
      position: relative;
      z-index: 10;
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
