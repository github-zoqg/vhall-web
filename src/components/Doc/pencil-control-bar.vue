<template>
  <div :class="['doc-ctrl-bar',miniBar? 'mini-bar':'']">
    <div :class="['slide-bar',miniBar?'down':'']" @click="toggleSlide"></div>
    <!-- 荧光笔部分 ---------------------------------------------------------------------------------->
    <div class="box">
      <div class="ygb box-item">
        <div class="icon"></div>
      </div>
      <div class="arrow"></div>
      <div class="size-box">
        <div
          v-for="item in sizeArr"
          :key="item"
          class="size-item"
          @click="handleControlBar('ygb',item)"
        >
          <div class="circle" :style="{width:item+'px',height:item+'px'}"></div>
        </div>
      </div>
    </div>
    <!-- 画笔部分 ---------------------------------------------------------------------------------->
    <div class="box">
      <div class="hb box-item">
        <div class="icon"></div>
      </div>
      <div class="arrow"></div>
      <div class="size-box">
        <div
          v-for="item in sizeArr"
          :key="item"
          class="size-item"
          @click="handleControlBar('hb',item)"
        >
          <div class="circle" :style="{width:item+'px',height:item+'px'}"></div>
        </div>
      </div>
    </div>
    <!-- 设置颜色部分 ---------------------------------------------------------------------------------->
    <div class="box">
      <div class="ys box-item">
        <div class="icon"></div>
      </div>
      <div class="arrow"></div>
      <div class="size-box color-box">
        <div
          class="size-item"
          v-for="item in colorArr"
          :key="item"
          @click="handleControlBar('setColor',item)"
        >
          <div :style="{backgroundColor:item}"></div>
        </div>
      </div>
    </div>
    <!-- 设置文字部分，TODO ---------------------------------------------------------------------------------->
    <div class="box" v-if="showText">
      <div class="wz box-item">
        <div class="icon"></div>
      </div>
      <div class="item-input">
        <input class="txt" placeholder="这里输入文字" type="text">
        <a class="line"></a>
        <button class="sure-btn" id="pencil-text-sure">确定</button>
      </div>
    </div>
    <!-- 设置图形 ---------------------------------------------------------------------------------->
    <div class="box" v-if="showGraph">
      <div class="box-item">
        <div>形</div>
      </div>
      <div class="size-box size-box">
        <div
          class="size-item graph-item"
          v-for="item in graph"
          :key="item.value"
          @click="handleControlBar('graph',item.value)"
        >{{item.text}}</div>
      </div>
    </div>
    <!-- 橡皮擦 ---------------------------------------------------------------------------------->
    <div class="box">
      <div class="xpc box-item" @click="handleControlBar('eraser')">
        <div class="icon"></div>
      </div>
    </div>
    <!-- 全部清除 ---------------------------------------------------------------------------------->
    <div class="box">
      <div class="qc box-item" @click="handleControlBar('clear')">
        <div class="icon"></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: ['sizeArr', 'colorArr', 'showGraph', 'showText'],
  data () {
    return {
      miniBar: false,
      graph: [
        {
          text: '单向箭头',
          value: 'setSingleArrow'
        },
        {
          text: '双向箭头',
          value: 'setDoubleArrow'
        },
        {
          text: '四边形',
          value: 'setSquare'
        },
        {
          text: '圆形',
          value: 'setCircle'
        },
        {
          text: '直角三角',
          value: 'setRightTriangle'
        },
        {
          text: '等腰三角',
          value: 'setIsoscelesTriangle'
        }
      ]
    };
  },
  methods: {
    handleControlBar (type, value = null) {
      this.$emit('handleControlBar', { type, value });
    },
    /**
         * 控制控制条上下滑动
         */
    toggleSlide () {
      console.log(this.miniBar);
      this.miniBar = !this.miniBar;
    }
  }
};
</script>
<style lang="less" scoped>
.doc-ctrl-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate3d(-50%, 0, 0);
  z-index: 5;
  width: 400px;
  height: 40px;
  padding: 0 50px;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 0 0 10px 10px;
  transition: all 0.3s;
  &.mini-bar {
    transform: translate3d(-50%, -40px, 0);
  }
  .slide-bar {
    width: 72px;
    height: 18px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 0 0 5px 5px;
    position: absolute;
    left: 50%;
    bottom: -18px;
    margin-left: -36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &::before {
      content: '';
      width: 12px;
      height: 12px;
      background-image: url('../../common/images/arrow-top.png');
      background-size: cover;
    }
    &.down {
      &::before {
        background-image: url('../../common/images/arrow-down.png');
      }
    }
  }
  .box {
    display: inline-block;
    height: 40px;
    padding-top: 7px;
    box-sizing: border-box;
    .item-input {
      display: none;
      width: 281px;
      height: 36px;
      line-height: 36px;
      background: rgba(0, 0, 0, 0.3);
      // border: 1px solid #3E3E4B;
      // box-shadow: 0 2px 4px 0 rgba(0,0,0,0.50);
      border-radius: 4px;
      position: absolute;
      z-index: 99999;
      margin: 3px 0px;
      .txt {
        width: 180px;
        height: 20px;
        padding: 8px 10px;
        border: none;
        outline: none;
        font-size: 14px;
        color: #b8bbca;
        border-radius: 4px;
        background: transparent;
        margin-right: 10px;
      }
      .line {
        display: inline-block;
        width: 1px;
        height: 20px;
        background: #e2e2e2;
        vertical-align: middle;
        // margin-top: -12px;
      }
      .sure-btn {
        padding: 12px 14px;
        border: none;
        margin-left: 6px;
        color: #fff;
        // vertical-align: middle;
        margin-top: -12px;
        font-size: 12px;
        box-sizing: border-box;
        background: transparent;
      }
    }
    &:hover {
      & > .size-box {
        display: block;
      }
      & > .arrow {
        background-image: url('../../common/images/doc-ctrl-bar-arrow-hover.png');
      }
      & > .box-item {
        background-color: rgba(0, 0, 0, 0.5);
      }
    }
    .box-item {
      width: 26px;
      height: 26px;
      cursor: pointer;
      padding: 4px;
      box-sizing: border-box;
      background: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      display: inline-block;
      .icon {
        margin: 0 auto;
        width: 18px;
        height: 18px;
        line-height: 18px;
        background-image: url('../../common/images/doc-ctrl-bar-ygb.png');
        background-size: 18px 18px;
      }
    }
    .ygb {
      .icon {
        background-image: url('../../common/images/doc-ctrl-bar-ygb.png');
      }
    }
    .hb {
      .icon {
        background-image: url('../../common/images/doc-ctrl-bar-hb.png');
      }
    }

    .ys {
      .icon {
        background-image: url('../../common/images/doc-ctrl-bar-ys.png');
      }
    }
    .wz {
      .icon {
        background-image: url('../../common/images/doc-ctrl-bar-wz.png');
      }
    }
    .xpc {
      .icon {
        background-image: url('../../common/images/doc-ctrl-bar-xpc.png');
      }
    }
    .qc {
      .icon {
        background-image: url('../../common/images/doc-ctrl-bar-qc.png');
      }
    }

    .arrow {
      display: inline-block;
      width: 6px;
      height: 4px;
      background-image: url('../../common/images/doc-ctrl-bar-arrow.png');
      background-size: 6px 4px;
      background-repeat: no-repeat;
    }

    .color-box {
      .size-item {
        height: 30px;
        box-sizing: border-box;
        text-align: center;
        line-height: 30px;
        cursor: pointer;
        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        div {
          vertical-align: middle;
          display: inline-block;
          width: 40px;
          height: 18px;
          border: 1px solid #fff;
          box-sizing: border-box;
        }
      }
    }
  }
  .size-box {
    width: 77px;
    height: auto;
    position: absolute;
    display: none;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 4px;
    margin-top: 3px;
    z-index: 99999;
    padding: 6px 0px;
    .size-item {
      height: 30px;
      box-sizing: border-box;
      text-align: center;
      cursor: pointer;
      line-height: 30px;
      .circle {
        display: inline-block;
        background: #a9bac8;
        border-radius: 50%;
      }
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        .circle {
          background: #fff;
        }
      }
      &.graph-item {
        color: #a9bac8;
      }
    }
  }
}
</style>
