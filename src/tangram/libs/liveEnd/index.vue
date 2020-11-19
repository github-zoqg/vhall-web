<template>
  <div class="liveend-warp">
      <div>
        <h2>直播已结束</h2>
        <p v-if="tooTimeFew">{{this.layout!=2?'视频':'音频'}}时长过短，不支持生成回放</p>
        <span @click="page">返回管理页面</span>
      </div>
  </div>
</template>
<script>

export default {
  props: {
    tooTimeFew: {
      type: Boolean
    },
    layout: {
      required: true
    }
  },
  data () {
    return {
    };
  },
  created () {

  },
  mounted () {

  },
  filters: {
  },
  methods: {
    page () {
      location.href = `/mywebinar/recordpart/${this.$route.params.il_id}`;
    }
  }
};
</script>
<style lang="less">
.liveend-warp {
  width: 100%;
  height: 100%;
  background: url(https://t-alistatic01.e.vhall.com/static/images/interact/endcover.jpg?v=%2BrM3tCz1%2BRV%2BsxuP6fa7Bg%3D%3D) no-repeat;
  background-size: cover;
  background-position: center;
  display: flex;
  color: #fff;
  align-items: center;
  justify-content: center;
  div {
    width: 300px;
    text-align: center;
  }
  span,p{
    color: #fff;
    text-align: center;
    line-height: 50px;
  }
  span{
    cursor: pointer;
  }
}
</style>
