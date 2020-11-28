<template>
    <VhallDialog class="sign-wrap" :visible.sync="showSignin" width="468px" center title="签到" append-to-body ref="dialog" >
      <!-- <div class="sign-wrap"> -->
        <Counter
          @close-sign="closeAutoSignin"
          :autoSign="signInfo.autoSign"
          :title="signInfo.signTip"
          :total="total"
          :remaining="remaining"
          v-if="starting"
          ref="counter"
        ></Counter>
        <template v-solt='footer'>
          <SigninSet v-if="showSet" @start="startSign"></SigninSet>
        </template>
        <signinResult v-if="showResult" @restartsign="resetSignState"></signinResult>
      <!-- </div> -->
    </VhallDialog>
</template>

<script>
import SigninSet from './components/signinSet';
import Counter from './components/counter';
import signinResult from './components/signinResult';
export default {
  name: 'NewSignin',
  components: { SigninSet, Counter, signinResult },
  data() {
    return {
      showSignin: false,
      signInfo: null,
      remaining: 0,
      timer: null
    };
  },
  methods: {
    testClosed() {
      console.log('closed');
    },
    openSignIn() {
      this.showSignin = true;
    },
    closeAutoSignin() {
      this.$confirm('您将取消自动签到，确认关闭？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        this.showSignin = false;
        this.$refs.dialog.$children[0].$once('closed', () =>
          this.resetSignState()
        );
      }).catch(() => {});
    },
    startSign(state) {
      this.$vhallFetch('signin', {
        vss_token: this.vss_token,
        show_time: '30',
        room_id: this.room_id
      }).then(res => {
          this.setSignState({
            signInfo: state
          });
          this.setIntervalAction();
        });
    },
    // 设置状态
    setSignState(state) {
      this.signInfo = state.signInfo;
      this.remaining = state.remaining ? state.remaining : this.total;
    },
    // 重置状态
    resetSignState() {
      this.signInfo = null;
      this.remaining = 0;
    },
    setIntervalAction() {
      clearInterval(this.timer);
      this.timer = setInterval(() => {
        if (--this.remaining <= 0) {
          clearInterval(this.timer);
        }
      }, 1000);
      this.$once('hook:beforeDestory', () => {
        clearInterval(this.timer);
      });
    }
  },
  computed: {
    total() {
      const { duration, autoSign, interval } = this.signInfo;
      return autoSign ? interval : duration;
    },
    starting() {
      return this.signInfo !== null && !!this.remaining;
    },
    showSet() {
      return this.signInfo === null;
    },
    showResult() {
      return (
        this.signInfo !== null && !this.remaining && !this.signInfo.autoSign
      );
    }
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
  }
};
</script>

<style lang="less" scoped>
 .sign-wrap{
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
  ::v-deep.el-dialog__body{
    padding: 0 32px 34px;
  }
  ::v-deep.el-message-box--center .el-message-box__header{
    padding-top: 15px;
  }
}
</style>
