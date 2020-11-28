<template>
  <div class="counter" functional>
    <h3>{{ title || '主持人发起了签到' }}</h3>
    <p>{{ tip }}</p>
    <CountDown class="counter-down" :duration="total" :consume="remaining" :redius="94"></CountDown>
    <div class="end" v-if="autoSign">
      <el-button type="danger" class="end-btn" @click="$emit('close-sign')">结束签到</el-button>
      <p>设置自动签到，请在控制台-信息收集-签到，查看数据</p>
    </div>
  </div>
</template>

<script>
import CountDown from './countDown';
export default {
  name: 'signinCounter',
  components: { CountDown },
  props: {
    total: {
      type: Number,
      default: 30
    },
    remaining: {
      type: Number,
      default: 0
    },
    autoSign: Boolean,
    title: String
  },
  computed: {
    tip() {
      return this.autoSign ? '正在签到中，距下一次签到还剩' : '正在签到中…';
    }
  }
};
</script>

<style lang="less" scoped>
.counter {
  text-align: center;
  &-down {
    margin: 0 auto;
  }
  > h3 {
    font-size: 18px;
  }
  > p {
    font-size: 14px;
    color: #fc5659;
    margin: 8px 0 25px;
  }
}
.end {
  margin-top: 26px;
  &-btn {
    width: 160px;
    margin-bottom: 39px;
    background: #FC5659;
    color: #fff;
  }
  > p {
    font-size: 12px;
    color: #888;
  }
}
</style>
