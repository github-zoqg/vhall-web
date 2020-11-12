<template>
  <div class="vh-doc-tool">
    <!-- 画笔部分 ---------------------------------------------------------------------------------->
    <div class="vh-doc-tool__item">
      <div class="vh-iconfont vh-icon-pen"></div>
      <div class="vh-doc-tool--size">
        <div v-for="(item, index) in sizeArr" :key="item" class="vh-doc-tool--size-item" :class="{'is-active': active.hb == index}" @click="handleControlBar('hb', item, index)">
          <div class="circle" :style="{ width: item + 'px', height: item + 'px' }"></div>
        </div>
      </div>
    </div>
    <!-- 荧光笔部分 ---------------------------------------------------------------------------------->
    <div class="vh-doc-tool__item">
      <!-- <div class="ygb box-item"> -->
      <div class="vh-iconfont vh-icon-highlighter"></div>
      <!-- </div> -->
      <div class="vh-doc-tool--size">
        <div v-for="(item, index) in sizeArr" :key="item" class="vh-doc-tool--size-item" :class="{'is-active': active.ygb == index}" @click="handleControlBar('ygb', item, index)">
          <div class="circle" :style="{ width: item + 'px', height: item + 'px' }"></div>
        </div>
      </div>
    </div>

    <!-- 设置颜色部分 ---------------------------------------------------------------------------------->
    <div class="vh-doc-tool__item">
      <div class="vh-iconfont vh-icon-doc-color"></div>
      <div class="vh-doc-tool--size">
        <div
          :class="{'is-active': active.setColor == index}"
          class="vh-doc-tool--size-item color-item"
          v-for="(item, index) in colorArr"
          :key="item"
          @click="handleControlBar('setColor', item, index)"
        >
          <div :style="{ backgroundColor: item }"></div>
        </div>
      </div>
    </div>
    <!-- 设置文字部分，TODO ---------------------------------------------------------------------------------->
    <div class="box" v-if="showText">
      <!-- <div class="vh-doc-tool__item"> -->
      <div class="vh-iconfont vh-icon-doc-color" @click="handleControlBar('font')"></div>
    </div>
    <!-- 设置图形 ---------------------------------------------------------------------------------->
    <!-- <div class="vh-doc-tool__item"> -->
    <div class="box" v-if="showGraph">
      <div class="vh-iconfont vh-icon-doc-color"></div>
      <div class="vh-doc-tool--size">
        <div
          class="vh-doc-tool--size-item graph-item"
          v-for="item in graph"
          :key="item.value"
          @click="handleControlBar('graph', item.value)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
    <!-- 橡皮擦 ---------------------------------------------------------------------------------->
    <div class="vh-doc-tool__item">
      <div class="vh-iconfont vh-icon-eraser" @click="handleControlBar('eraser')"></div>
    </div>
    <!-- 全部清除 ---------------------------------------------------------------------------------->
    <div class="vh-doc-tool__item">
      <div class="vh-iconfont vh-icon-delete" @click="handleControlBar('clear')"></div>
    </div>
  </div>
</template>
<script>
export default {
  /**
   * 文档相关
   * @author xiaohai.ren
   */
  name: 'docPencilControlBar',
  props: {
    /**
     * 画笔粗细
     */
    sizeArr: {
      required: false
    },
    /**
     * 颜色集合
     */
    colorArr: {
      required: false
    },
    /**
     * 是否显示图形
     */
    showGraph: {
      required: false
    },
    /**
     * 是否显示文字
     */
    showText: {
      required: false
    }
  },
  data () {
    return {
      graph: [
        {
          text: this.单向箭头,
          value: 'setSingleArrow'
        },
        {
          text: this.双向箭头,
          value: 'setDoubleArrow'
        },
        {
          text: this.四边形,
          value: 'setSquare'
        },
        {
          text: this.圆形,
          value: 'setCircle'
        },
        {
          text: this.直角三角,
          value: 'setRightTriangle'
        },
        {
          text: this.等腰三角,
          value: 'setIsoscelesTriangle'
        }
      ],
      active: {
        hb: 0,
        ygb: -1,
        setColor: -1
      }
    };
  },
  methods: {
    /**
     * 画笔设置
     * @param type {String} - 设置的类型
     * @param value {String} - 设置的值
     */
    handleControlBar (type, value = null, index) {
      console.log('测试设置文字');
      this.active[type] = index;
      this.$emit('handleControlBar', { type, value });
    },
    t(name){
      return name;
    }
  }
};
</script>
<style lang="less">
.vh-doc-tool {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  z-index: 5;
  height: 40px;
  padding: 0 25px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 24px;
  transition: all 0.3s;
  .vh-iconfont {
    padding-bottom: 10px;
    font-size: 20px;
    color: #F7F7F7;
    cursor: pointer;
    &:hover {
      color: #1bc7c4;
    }
    &.vh-icon-delete {
      &:hover {
        color: #ff1c1f;
      }
    }
  }
  &.vh-doc-tool--mini {
    transform: translate3d(-50%, -48px, 0);
  }
  &__item {
    position: relative;
    display: inline-block;
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    &:hover {
      & > .vh-doc-tool--size {
        display: grid;
      }
    }

  }
  .vh-doc-tool__item + .vh-doc-tool__item {
    margin-left: 22px;
  }
  &--size {
    display: none;
    place-items: center;
    width: 42px;
    padding: 6px 0px;
    position: absolute;
    left: -10px;
    top: 40px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 21px;
    margin-top: 3px;
    z-index: 99999;
    overflow: hidden;
    text-align: center;
    &-item {
      display: grid;
      place-items: center;
      height: 30px;
      width: 30px;
      border-radius: 50%;
      border: 1px solid transparent;
      cursor: pointer;
      &.is-active {
        border: 1px  solid #1E90FF;
        .circle {
          background: #1AD5CE;
        }
      }
      &.color-item {
        div {
          vertical-align: middle;
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 2px;
          border: 1px solid #fff;
        }
      }
      .circle {
        display: inline-block;
        background: #FFf;
        border-radius: 50%;
      }
      &:hover {
        background: rgba(14,14,14, 1);
        .circle {
          background: #fff;
        }
      }
    }
  }
}
</style>
