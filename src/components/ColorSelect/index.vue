<template>
  <div class="color--select">
    <div class="theme--box">
      <i
        v-for="item in themeKeys"
        :key="'themes__' + item"
        :class="
          'themes__' +
          item +
          ' ' +
          ('#' + item.toUpperCase() === colors.toUpperCase() ? 'active' : '')
        "
        @click.prevent.stop="setColorsValue('#' + item)"
      ></i>
      <div class="theme--select-main" v-if="isShowMain">
        <i
          class="themes__select"
          v-if="openSelect"
          @click.prevent.stop="openSelectPanel"
          key="themes__ul"
          :style="`background:${colors}`"
        ></i>
        <div class="div__sketch" v-show="selectPanelShow">
          <sketch-picker
            :value="colors"
            :preset-colors="presetColors"
            @input="updateValue"
          ></sketch-picker>
          <div class="footer_sure">
            <span @click="cancleColor">取消</span>
            <span @click="submitColor">确定</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Sketch } from 'vue-color'; //有6中风格，用哪种直接引用对应的名字就行
  export default {
    name: 'index.vue',
    components: {
      'sketch-picker': Sketch
    },
    props: {
      themeKeys: {
        type: Array,
        default() {
          return [];
        }
      },
      openSelect: {
        type: Boolean,
        default: false
      },
      colorDefault: {
        type: String,
        default: ''
      },
      isShowMain: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        selectPanelShow: false,
        presetColors: [
          '#CF030F',
          '#F0A500',
          '#FBE70A',
          '#875729',
          '#78D403',
          '#3F7400',
          '#BA0DDB',
          '#9700FF',
          '#4D90E9',
          '#47E1C5',
          '#B2E683',
          '#000105',
          '#484848',
          '#FFFFFF'
        ],
        colors: '',
        resetColor: ''
        /*colors: {
        hex: '#194d33',
        hsl: { h: 150, s: 0.5, l: 0.2, a: 1 },
        hsv: { h: 150, s: 0.66, v: 0.30, a: 1 },
        rgba: { r: 25, g: 77, b: 51, a: 1 },
        a: 1
      }*/
      };
    },
    methods: {
      openSelectPanel() {
        this.selectPanelShow = !this.selectPanelShow;
      },
      updateValue(tab) {
        console.log(tab);
        this.colors = tab.hex;
        console.log(this.colors, '当前样式2');
        this.$emit('color', this.colors);
        // 值设置成功，关闭浮层
        // this.selectPanelShow = false;
      },
      setColorsValue(tab) {
        this.colors = tab;
        this.$emit('color', this.colors);
        console.log(this.colors, '当前样式1');
      },
      cancleColor() {
        this.selectPanelShow = false;
        this.colors = this.resetColor;
        this.$emit('color', this.colors);
      },
      submitColor() {
        this.selectPanelShow = false;
        this.$emit('color', this.colors);
      },
      initColor(color) {
        this.colors = color || '';
      }
    },
    watch: {
      colorDefault() {
        this.colors = this.colorDefault;
      }
    },
    created() {
      this.colors = this.colorDefault || '';
      this.resetColor = this.colorDefault || '';
    }
  };
</script>

<style lang="less" scoped>
  .color--select {
    padding-left: 4px;
  }
  .theme--box {
    i {
      display: inline-block;
      width: 34px;
      height: 34px;
      border-radius: 2px;
      margin-right: 12px;
      cursor: pointer;
      &:last-child {
        margin-right: 0;
      }
      &.active {
        // border: 1px solid #FB3A32;
        transform: scale(1.2);
        -webkit-transform: scale(1.2);
        -o-transform: scale(1.2);
        -ms-transform: scale(1.2);
        -moz-transform: scale(1.2);
      }
    }
  }
  .themes__FFFFFF {
    background: #ffffff;
    border: 1px solid #dadada;
  }
  .themes__F2F2F2 {
    background: #f2f2f2;
    border: 1px solid #f2f2f2;
  }
  .themes__1A1A1A {
    background: #1a1a1a;
    border: 1px solid #1a1a1a;
  }
  .themes__FB2626 {
    background: #fb2626;
    border: 1px solid #fb2626;
  }
  .themes__D9A90B {
    background: #d9a90b;
    border: 1px solid #d9a90b;
  }
  .themes__1E4EDC {
    background: #1e4edc;
    border: 1px solid #1e4edc;
  }
  .themes__FB3A32 {
    background: #fb3a32;
    border: 1px solid #fb3a32;
  }
  .themes__FFB201 {
    background: #ffb201;
    border: 1px solid #ffb201;
  }
  .themes__16C973 {
    background: #16c973;
    border: 1px solid #16c973;
  }
  .themes__3562FA {
    background: #3562fa;
    border: 1px solid #3562fa;
  }
  .themes__DC12D2 {
    background: #dc12d2;
    border: 1px solid #dc12d2;
  }
  .themes__000000 {
    background: #000000;
    border: 1px solid #000000;
  }
  .themes__262626 {
    background: #262626;
    border: 1px solid #262626;
  }
  .themes__595959 {
    background: #595959;
    border: 1px solid #595959;
  }
  .themes__8C8C8C {
    background: #8c8c8c;
    border: 1px solid #8c8c8c;
  }
  .themes__F5F5F5 {
    background: #f5f5f5;
    border: 1px solid #d9d9d9;
  }
  .themes__BFBFBF {
    background: #bfbfbf;
    border: 1px solid #bfbfbf;
  }
  /*样式选择器重置*/
  .theme--select-main {
    display: inline-block;
    width: 34px;
    height: 34px;
    position: relative;
  }
  .themes__select {
    background: #ffffff;
    border-radius: 2px;
    border: 1px dashed #d2d2d2;
    &:after {
      display: block;
      content: '';
      width: 18px;
      height: 18px;
      background: url('../../common/images/icon/color_icon.png') no-repeat 50% 50%;
      right: 0;
      bottom: 0;
      position: absolute;
      border: 1px solid #fff;
    }
  }
  .div__sketch {
    position: absolute;
    bottom: 0;
    margin-bottom: 40px;
    z-index: 99;
    .footer_sure {
      position: absolute;
      bottom: 0;
      right: 6px;
      span {
        display: inline-block;
        // padding: 2px 8px;
        border: 1px solid #ccc;
        font-size: 12px;
        margin-left: 4px;
        border-radius: 4px;
        width: 40px;
        height: 27px;
        text-align: center;
        line-height: 27px;
        cursor: pointer;
        & {
          -webkit-transform: scale(0.875);
          transform: scale(0.875);
        }
      }
    }
  }
  /deep/.vc-sketch {
    background: #ffffff;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    border: 1px solid #cccccc;
    padding: 6px 6px;
    padding-bottom: 28px;
    box-sizing: border-box;
  }
  /deep/.vc-sketch-saturation-wrap {
    height: 96px;
    padding-bottom: 0;
  }
  /deep/.vc-sketch-sliders {
    padding: 6px 0 0 0;
  }
  /deep/.vc-sketch-color-wrap {
    width: 14px;
    height: 14px;
    margin-top: 6px;
    border-radius: 100%;
  }
  /deep/.vc-sketch-active-color {
    border-radius: 100%;
  }
  /deep/.vc-sketch-field {
    padding-top: 5px;
  }
  /deep/.vc-editable-input {
    line-height: 20px;
  }
  /deep/.vc-sketch-presets {
    margin-right: 0;
    margin-left: 0;
    padding-left: 0;
    padding-top: 3px;
    border-top: 0;
    line-height: 1;
  }
  /deep/.vc-sketch-presets-color {
    width: 14px;
    height: 14px;
    border-radius: 2px;
    box-shadow: unset;
    &:nth-child(8n) {
      margin-right: 0;
    }
  }
  /deep/div[aria-label='Color:#FFFFFF'] {
    border: 1px solid #e6e6e6;
  }
</style>
