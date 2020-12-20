<template>
  <div>
    <section v-for="(item, index) in operas" :key="index">
      <p class="subject">{{index}}</p>
      <div class="subjectOuter">
        <div class="sunjectInner" v-for="opera in item" :key='opera.title' @click="blockHandler(opera)">
          <icon class="icon" :icon-class="opera.icon"></icon>
          <div class="desc">
            <p class="mainText">{{opera.title}}</p>
            <p class="subText">{{opera.subText}}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "index.vue",
  props: {
    operas: {
      type: Object
    }
  },
  // computed: {
  //   operas() {
  //     if (this.status != 4) {
  //       return;
  //     } else {
  //       console.log(this.operas);
  //       return;
  //     }
  //   }
  // },
  methods: {
    blockHandler(item) {
      this.$emit('blockHandler', item);
    }
  }
};
</script>

<style lang="less" scoped>
.subject{
  font-size: 20px;
  color: #333333;
  border-left: 4px solid #FB3A32;
  line-height: 16px;
  height: 18px;
  margin-top: 32px;
  margin-bottom: 12px;
  padding-left: 5px;
}
.subjectOuter{
  display: flex;
  flex-wrap: wrap;
  margin-right: -24px;
// justify-content: space-between;
}
.sunjectInner{
  display: flex;
  background: #fff;
  width: 330px;
  height: 110px;
  align-items: center;
  margin-bottom: 24px;
  margin-right: 18px;
  box-sizing: border-box;
  background-clip: content-box;
  cursor: pointer;
  border-radius: 4px;
  border: 2px solid transparent;
  &:nth-child(3n) {
    margin-right: 0;
  }
  &:nth-child(4n) {
    margin-right: 18px;
  }
  &:hover{
    box-shadow: 0 6px 12px 0 rgba(251, 58, 50, 0.16);
    border: 1px solid #FB3A32;
  }
  .icon{
    width: 56px;
    height: 56px;
    // background: #FB3A32;
    margin-right: 15px;
    border-radius: 50%;
    margin-left: 35px;
    // border: 1px solid #ccc;
  }
  /deep/.svg-icon{
    text-align: center;
    font-size: 50px;
    vertical-align: top;
    color: #FB3A32;
  }
  .desc{
    .mainText{
      font-size: 20px;
      color: #1A1A1A;
      margin-bottom: 12px;
    }
    .subText{
      font-size: 14px;
      color: #666666;
    }
  }
}
@media screen and (min-width: 1920px) {
  .sunjectInner {
    &:nth-child(3n) {
      margin-right: 18px;
    }
    &:nth-child(4n) {
      margin-right: 0;
    }
  }
}
</style>
