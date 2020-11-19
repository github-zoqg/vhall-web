<template>
  <div class="vhall-dialog-wrap" v-show="visible">
    <div class="vhall-popup-dialog" :style="{width}">
      <div class="header" v-if="headerShow" :style="{background:headerBackgroundColor}">
        <h3>{{title}}</h3>
        <span class="close" @click="onClose">
          <i class="iconfont iconguanbi"></i>
        </span>
      </div>
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'popup',
  props: {
    headerShow: {
      type: Boolean,
      default: function () {
        return true;
      }
    },
    onClose: {
      required: false
    },
    visible: {
      required: true
    },
    width: {
      required: false
    },
    title: {
      required: false
    },
    headerBackgroundColor: {
      required: false,
      default: 'white'
    }
  },
  methods: {
    onCancel () {
      this.$emit('onClose');
    }
  }
};
</script>
<style lang="less">
.vhall-dialog-wrap {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1200;
  align-items: center;
  display: flex;
  justify-content: center;
  * {
    box-sizing: border-box;
  }
  .vhall-popup-dialog {
    font-family: '微软雅黑';
    /*background-color: white;*/
    position: relative;
    border-radius: 6px !important;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    overflow: hidden;
    & > div:nth-child(2) {
      /*flex: 1;*/
    }
    & > .header {
      width: 100%;
      height: 40px;
      border-bottom: 1px solid #dfdfdf;
      margin-bottom: 0;
      text-align: center;
      line-height: 40px;
      h3 {
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        font-weight: 500;
        display: inline-block;
        font-size: 14px;
      }
      .close {
        margin-right: 11px;
        margin-top: 11px;
        cursor: pointer;
        width: 20px;
        height: 20px;
        opacity: 0.8;
        position: absolute;
        right: 0px;
        & > i {
          font-size: 10px;
          float: right;
          line-height: 20px;
        }
      }
    }
  }
  .vhall-dialog-content {
    height: 100%;
    width: 100%;
  }
}
</style>
