<template>
  <VhallDialog :visible.sync="showSign" title="签到" width="468px" class="sign" >
    <CountDown :duration="60" :consume="sign_time" class="sign-counter"></CountDown>
    <div class="sign-title">设计师的信息觅食指南第三讲</div>
    <el-button type="danger" class="sign-btn" @click="signin">立即签到</el-button>
  </VhallDialog>
</template>

<script>
import CountDown from './components/countDown';
export default {
  name: 'WatchSignin',
  components: {
    CountDown
  },
  data() {
    return {
      showSign: false,
      sign_id: '',
      sign_time: 0
    };
  },
  created() {
    this.sign_time = 0
    this.bindEvents()
  },
  props: {
    vss_token: {
      required: true
    },
    room_id: {
      required: true
    },
    masterEnd: {
      required: true
    }
  },
  methods: {
    bindEvents () {
      this.$EventBus.$on('sign_in_push', e => {
        console.log('监听到这个');
        console.log('处理签到信令');
        this.sign_id = e.data.sign_id
        this.showSign = true;
        this.sign_time = Number(e.data.sign_show_time)
        this.countDownTime()
      });
    },
    signin () {
      this.$fetch('userSingin', {
        room_id: this.room_id,
        sign_id: this.sign_id
      }).then(res => {
        if (res.code == 200) {
          clearInterval(this.timer)
          this.showSign = false;
          this.sign_time = 0
        }
      })
      this.$message({
        type: 'success',
        message: '签到成功！'
      });
    },
    countDownTime () {
      this.timer = setInterval(() => {
        if (this.sign_time == 0) {
          clearInterval(this.timer)
          return
        }
        this.sign_time --
      }, 1000)
    }
  }
};
</script>

<style lang="less" scoped>
.sign {
  text-align: center;
  ::v-deep.el-dialog__header{
    padding: 0;
    margin-bottom: 34px;
    box-shadow: 0px 1px 0px 0px #E2E2E2;
    .el-dialog__headerbtn{
      top: 20px;
    }
    .el-dialog__title{
      font-size: 16px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      height: 48px;
      line-height: 48px;
      color: #222222;
    }
  }
  &-counter {
    margin: 0 auto;
  }
  &-title {
    font-size: 16px;
    font-weight: bold;
    color: #222;
    margin-top: 18px;
    margin-bottom: 20px;
  }
  &-btn {
    width: 160px;
    color: #fff;
    background-color: #f56c6c;
    border-color: #f56c6c;
    margin-bottom: 32px;
  }
}
</style>
