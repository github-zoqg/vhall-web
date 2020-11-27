<template>
  <Dialogs :visible.sync="showSign" title="签到" width="468px" class="sign">
    <CountDown :duration="60" :consume="30" class="sign-counter"></CountDown>
    <div class="sign-title">设计师的信息觅食指南第三讲</div>
    <el-button type="danger" class="sign-btn" @click="signin">立即签到</el-button>
  </Dialogs>
</template>

<script>
import EventBus from '../../utils/Events';
import Dialogs from './components/dialogs/custom.vue';
import CountDown from './components/countDown';
export default {
  name: 'WatchSignin',
  components: {
    CountDown,
    Dialogs
  },
  data() {
    return {
      showSign: false
    };
  },
  created() {
    EventBus.$on('sign_in_push', e => {
      console.log('处理签到信令');
      this.showSign = true;
    });
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
    signin () {
      console.log('执行签到');
      this.$message({
        type: 'success',
        message: '签到成功！'
      });
    }
  }
};
</script>

<style lang="less" scoped>
.sign {
  text-align: center;
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
  }
}
</style>
