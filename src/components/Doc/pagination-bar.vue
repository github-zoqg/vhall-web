<template>
  <div class="vh-doc-pager" id="doc-pager">
    <!-- <div class="first-page" title="上一页" @click="handlePage('prePage')"></div> -->
    <div class="vh-iconfont  vh-icon-previous" :title="'上一步'" @click="handlePage('prevStep')"></div>
    <div class="vh-doc-pager--number">
      <span class="vh-doc-pager--index">{{ pageInfo.pageIndex }}</span>
      <span class="vh-doc-pager-split">/</span>
      <span class="vh-doc-pager--total">{{ pageInfo.total }}</span>
    </div>
    <div class="vh-iconfont  vh-icon-next" :title="'下一步'" @click="handlePage('nextStep')"></div>
    <div
      class="vh-iconfont vh-icon-zoom-in"
      :title="'放大'"
      :class="{ active: docToolActive == 'zoomIn' }"
      @click="handlePage('zoomIn')"
    ></div>
    <div
      class="vh-iconfont  vh-icon-zoom-out"
      :title="'缩小'"
      :class="{ active: docToolActive == 'zoomOut' }"
      @click="handlePage('zoomOut')"
    ></div>
    <div
      class="vh-iconfont vh-icon-zoom-reset"
      :title="'还原'"
      :class="{ active: docToolActive == 'zoomReset' }"
      @click="handlePage('zoomReset')"
    ></div>
    <div
      class="vh-iconfont  vh-icon-move"
      :title="'移动'"
      :class="{ active: docToolActive == 'move' }"
      @click="handlePage('move')"
    ></div>
    <!-- <div class="last-page" title="下一页" @click="handlePage('nextPage')"></div> -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      docToolActive: ''
    };
  },
  props: {
    pageInfo: {
      default () {
        return {
          pageIndex: 1,
          total: 1
        };
      }
    },
    isKeyEvent: { // 翻页是否监听键盘事件
      type: Boolean,
      default: true,
      required: false
    }
  },
  methods: {
    handlePage (type) {
      if (['zoomIn', 'zoomOut', 'zoomReset', 'move'].includes(type)) {
        this.docToolActive = type;
        this.$emit('handlePage', type);
      } else if (!(
        (this.pageInfo.pageIndex <= 1 && type == 'prevStep') ||
        (this.pageInfo.pageIndex >= this.pageInfo.total && type == 'nextStep')
      )) {
        this.$emit('handlePage', type);
      }
    },
  }
};
</script>
<style lang="less">
.vh-doc-pager {
  display: flex;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
  padding: 3px 16px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 30px;
  justify-content: space-between;
  align-items: center;
  color: #F7F7F7;
  line-height: 1;
  font-size: 14px;
  user-select: none;
  z-index: 5;
  .vh-iconfont {
    font-size: 20px;
    color: #F7F7F7;
    padding: 7px 10px;
    cursor: pointer;
    &:hover {
      color: #1E90FF;
    }
  }
}
</style>
