<template>
  <div class="color--select">
    <div class="theme--box">
      <i v-for="item in themeKeys" :key="'themes__' + item" :class="'themes__' + item + ' ' + ('#'+item.toUpperCase() === colors.toUpperCase() ? 'active' : '')" @click.prevent.stop="setColorsValue('#' + item)"></i>
      <div class="theme--select-main">
        <i  class="themes__select" v-if="openSelect" @click.prevent.stop="openSelectPanel" key="themes__ul"></i>
        <div class="div__sketch" v-show="selectPanelShow">
          <sketch-picker :value="colors" :preset-colors="presetColors"  @input="updateValue"
          ></sketch-picker>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Sketch } from 'vue-color';//有6中风格，用哪种直接引用对应的名字就行
export default {
  name: "index.vue",
  components: {
    'sketch-picker': Sketch,
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
      this.selectPanelShow = false;
    },
    setColorsValue(tab) {
      this.colors = tab;
      console.log(this.colors, '当前样式1');
      this.$emit('color', this.colors);
    },
    initColor(color) {
      this.colors = color || '';
    }
  },
  created() {
    this.colors = this.colorDefault || '';
  }
};
</script>

<style lang="less" scoped>
.theme--box {
  i {
    display: inline-block;
    width: 34px;
    height: 34px;
    border-radius: 2px;
    margin-right: 12px;
    cursor: pointer;
    &.active {
      transform: scale(1.2);
      -webkit-transform: scale(1.2);
      -o-transform: scale(1.2);
      -ms-transform: scale(1.2);
      -moz-transform: scale(1.2);
    }
  }
}
.themes__FFFFFF {
  background: #FFFFFF;
  border: 1px solid #DADADA;
}
.themes__F2F2F2 {
  background: #F2F2F2;
  border: 1px solid #E6E6E6;
}
.themes__1A1A1A {
  background: #1A1A1A;
  border: 1px solid #333333;
}
.themes__FB3A32 {
  background: #FB3A32;
  border: 1px solid #FB3A32;
}
.themes__FFB201 {
  background: #FFB201;
  border: 1px solid #FFB201;
}
.themes__16C973 {
  background: #16C973;
  border: 1px solid #16C973;
}
.themes__3562FA {
  background: #3562FA;
  border: 1px solid #3562FA;
}
.themes__DC12D2 {
  background: #DC12D2;
  border: 1px solid #DC12D2;
}
/*样式选择器重置*/
.theme--select-main {
  display: inline-block;
  width: 34px;
  height: 34px;
  position: relative;
}
.themes__select {
  background: #FFFFFF;
  border-radius: 2px;
  border: 1px dashed #D2D2D2;
  &:after {
    display: block;
    content: '';
    width: 18px;
    height: 18px;
    background: url("../../common/images/icon/color_icon.png") no-repeat 50% 50%;
    right: 0;
    bottom: 0;
    position: absolute;
  }
}
.div__sketch {
  position: absolute;
  bottom: 0;
  margin-bottom: 40px;
  z-index: 99;
}
/deep/.vc-sketch {
  background: #FFFFFF;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  border: 1px solid #CCCCCC;
  padding: 6px 6px;
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
/deep/.vc-sketch-active-color{
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
/deep/div[aria-label="Color:#FFFFFF"] {
  border: 1px solid #E6E6E6;
}
</style>
