<template>
<div class="had-envelope-wrap" >
    <div class="title">
      <span class="iconfont iconguanbi" @click="cancelSendRed"></span>
    </div>
  <div class="popbody text-center">
    <p>当前红包还未被领完，若您继续发红包，未被领取的金额则会在直播结束后自动进入发红包者的收益账户，可在<a href="/account/redpacket" target="_blank">微吼收益管理-红包收益</a>中提现</p>
    <p class="btnsbox">
      <a class="btn btn-light-red confirm" @click="ContinueSendRed">继续发红包</a>
      <a class="btn btn-cancel" @click="cancelSendRed" >等等再发</a>
    </p>
  </div>
</div>
</template>
<script>
// import EventBus from '@/utils/Events'

export default {
  name: 'redcoupon',
  data () {
    return {

    };
  },
  watch: {

  },
  created () {

  },
  mounted () {

  },
  props: {
    room_id: {
      required: true
    }
  },
  methods: {
    ContinueSendRed () {
      this.$emit('ContinueSendRed');
    },
    cancelSendRed () {
      this.$emit('cancelSendRed');
    }
  }
};
</script>
<style lang="less" scoped>
.had-envelope-wrap {
  width: 500px;
  height: 276px;
  .title {
    background: #edecec;
    height: 42px;
    line-height: 42px;
    color: #383838;
    border-bottom: 1px solid #dfdfdf;
    text-align: center;
    font-weight: 500;
    font-size: 16px;
      span {
        cursor: pointer;
        float: right;
        margin-right: 10px;
        display: inline-block;
        width: 24px;
        height: 18px;
      }
  }
  .popbody {
    background: #fff;
    border-radius: 0 0 4px 4px;
    padding: 40px;
    font-size: 14px;
    text-align: left;
    color: #444;
    a {
      color: #5da6fc;
      margin: 0 3px;
    }
  }
  .btnsbox {
    padding-top: 50px;
    text-align: center;
    .btn {
      text-decoration: none;
      display: inline-block;
      width: 140px;
      height: 40px;
      line-height: 40px;
      margin: 0px 10px;
      cursor: pointer;
    }
    .btn-light-red {
      background: #f34b46;
      color: #fff;
      border: none;
      border-radius: 2px;
      &:hover {
        background: #c51f1d;
        color: #fff;
      }
    }
    .btn-cancel {
      background-color: #eee;
      height: 38px;
      line-height: 38px;
      border: 1px solid #e1e1e1;
      width: 138px;
      margin-left: 5px;
    }
  }

}
</style>
