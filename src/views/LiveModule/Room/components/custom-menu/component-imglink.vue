<template>
  <div class="qrcode-wrapbox">
    <div class="qr-previewbox">
      <div class="qrbox">
        <img :src="info.imageSrc" alt="" @click="jump">
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'component-line',
  props: {
    info: {
      required: false
    }
  },
  mounted() {
    console.log(99, this.info)
  },
  data() {
    return {}
  },

  methods: {
    jump () {
      if (!this.info.src) return
      window.location.href = this.info.src
    }
  }
}
</script>
<style lang="less" scoped>
  .qr-previewbox{
    .qrbox {
      position: relative;
      width: 100%;
      min-height: 240px;
      overflow: hidden;
      text-align: left;
      margin: 20px auto 0px;
      background: #fff;
      img {
        width: 420px;
        height: 240px;
      }
    }
  }
</style>
