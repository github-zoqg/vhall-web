<template>
    <VhallDialog class="sign-wrap" :visible.sync="showSignin" width="468px" center title="签到" append-to-body ref="dialog" >
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
        <signinResult v-if="showResult" @restartsign="resetSignState" :room_id='room_id' :signId='signId'></signinResult>
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
      remaining: 0, // 总时长
      timer: null,
      signId: '', // 签到ID
      nowSignObj: '' // 当前自动签到信息
    };
  },
  methods: {
    testClosed() {
      console.log('closed');
    },
    openSignIn() {
      let localAuto = window.sessionStorage.isAutoSign
      console.warn('localAuto-----', localAuto, localAuto == 'false' || localAuto == undefined);
      if(localAuto == 'false' || localAuto == undefined){
        // 当获取的存储值为false 或者  根本取不到值的时候  都进行获取一次当前活动是含有签到信息
        this.showSignin = true;
      }else{
        this.$fetch('v3GetCurrentSign', {
          room_id: this.room_id
        }).then(res=>{
          console.warn('获取当前签到信息',res)
          if(res.code == 200){
            if(res.data.id){
              this.showSignin = true;
              this.signInfo = res.data
              this.nowSignObj = res.data
              this.signInfo.autoSign = res.data.is_auto_sign == 1 ? true : false
              this.remaining = res.data.auto_sign_time_ttl
              this.setIntervalAction()
              console.warn('this.starting',this.starting, 'remaining', this.remaining, !!this.remaining)
            }else{
              this.showSignin = true;
            }
          } else {
            this.$message.warning(res.msg)
          }
        }).catch(err=>{
          console.warn('获取当前签到的失败----', err)
        })
      }
    },
    closeAutoSignin() {
      this.$confirm('您将取消自动签到，确认关闭？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        this.endSignServe()
      }).catch(() => {});
    },
    endSignServe(){
      this.$fetch('v3StopSign', {
        room_id: this.room_id,
        sign_id: this.nowSignObj.id
      }).then(res=>{
        console.log('结束当前房间的签到成功-----',res)
        if(res.code == 200){
          this.$message('关闭签到成功')
          window.sessionStorage.removeItem('isAutoSign')
          this.showSignin = false;
          this.$refs.dialog.$children[0].$once('closed', () =>
            this.resetSignState()
          );
        }else{
          this.$message.warning(res.msg)
        }
      }).catch(err=>{
        console.warn('结束当前房间的签到失败-----',err)
      })
    },
    startSign(state) {
      let _data = {
        room_id: this.room_id,
        sign_tips: state.signTip, // 签到提示语
        show_time: state.duration, // 签到显示的时间，单位秒，默认30
        is_auto_sign: Number(state.autoSign), // 是否自动发起签到，1自动，0取消自动，默认0
        auto_sign_time: state.interval // 自动发起签到的轮询定时时间，单位秒
      }
      console.warn('签到satte-----',state, this.signInfo)
      this.$fetch('v3CreateSifn', _data).then(res => {
        console.warn('创建签到',res)
        if(res.code == 200){
          if(state.autoSign){
            window.sessionStorage.setItem('isAutoSign', 'true')
          }
          this.signId = res.data.id
          this.setSignState({signInfo: state});
          this.setIntervalAction();
        } else if(res.code == 13204){
          this.endSignServe()
        }else{
          this.$message.warning(res.msg)
        }
      }).catch(err=>{
        console.warn('创建签到错误----', err)
      })
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
