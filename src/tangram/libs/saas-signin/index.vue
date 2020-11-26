<template>
    <VhallDialog :visible.sync="showSignin" width="468px" center title="签到" append-to-body ref="dialog" >
      <div class="sign-wrap">
        <Counter
          @close-sign="showConfirm = true"
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
      </div>
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
      showConfirm: false,
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
      this.showConfirm = false;
      this.showSignin = false;
      this.$refs.dialog.$children[0].$once('closed', () =>
        this.resetSignState()
      );
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
.sign-wrap {
  width: 360px;
  margin: 32px auto 0;
  padding-bottom: 32px;
}
</style>
