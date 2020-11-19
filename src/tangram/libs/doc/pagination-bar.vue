<template>
  <div class="vhall-doc-pager" id="doc-pager">
    <!-- <div class="first-page" title="上一页" @click="handlePage('prePage')"></div> -->
    <div v-if="!disablePagechange" class="iconfont iconzuofanye" title="上一步" @click="handlePage('prevStep')"></div>
    <div class="page-number">
      <span class="page-index">{{pageInfo.pageIndex}}</span>
      <span class="page-split">/</span>
      <span class="page-total">{{pageInfo.total}}</span>
    </div>
    <div v-if="!disablePagechange" class="iconfont iconyoufanye" title="下一步" @click="handlePage('nextStep')"></div>
    <div
      class="iconfont iconfangda"
      title="放大"
      :class="{active:docToolActive == 'zoomIn'}"
      @click="handlePage('zoomIn')"
    ></div>
    <div
      class="iconfont iconsuoxiao"
      title="缩小"
      :class="{active:docToolActive == 'zoomOut'}"
      @click="handlePage('zoomOut')"
    ></div>
    <div
      class="iconfont iconhuanyuan"
      title="还原"
      :class="{active:docToolActive == 'zoomReset'}"
      @click="handlePage('zoomReset')"
    ></div>
    <div
      class="iconfont iconyidong"
      title="移动"
      :class="{active:docToolActive == 'move'}"
      @click="handlePage('move')"
    ></div>
    <!-- <div class="last-page" title="下一页" @click="handlePage('nextPage')"></div> -->
  </div>
</template>
<script>
export default {
  inject: ['docToolStatus'],
  props: {
    pageInfo: {
      default () {
        return {
          pageIndex: 1,
          total: 1
        };
      }
    },
    disablePagechange: {
      required: false,
      default: false
    }
  },
  computed: {
    docToolActive () {
      return this.docToolStatus.docToolActive;
    }
  },
  methods: {
    handlePage (type) {
      if (['zoomIn', 'zoomOut', 'zoomReset', 'move'].includes(type)) {
        this.docToolStatus.docToolActive = type;
        this.$emit('handlePage', type);
      } else if (!(
        (this.pageInfo.pageIndex <= 1 && type == 'prevStep') ||
        (this.pageInfo.pageIndex >= this.pageInfo.total && type == 'nextStep')
      )) {
        this.$emit('handlePage', type);
      }
    }
  }
};
</script>
<style lang="less">
.vhall-doc-pager {
  user-select: none;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 20px;
  padding: 7px 16px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #f4f4f4;
  line-height: 1;
  font-size: 14px;
  & > div {
    padding: 7px 10px;
    &.active {
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
      color: #fc5659;
    }
  }
  .iconfont {
    cursor: pointer;
    &:hover{
      color: #fc5659;
    }
  }
  // .first-page {
  //   width: 10px;
  //   height: 10px;
  //   background: url('../../assets/images/publish/doc-pager-first-page.png')
  //     no-repeat;
  //   background-size: 10px 10px;
  //   cursor: pointer;
  // }
  // .prev-page {
  //   width: 10px;
  //   height: 10px;
  //   background: url('../../assets/images/publish/doc-pager-prev-page.png')
  //     no-repeat;
  //   background-size: 10px 10px;
  //   cursor: pointer;
  // }
  .page-number {
    .page-index {
    }
    .page-split {
    }
    .page-total {
    }
  }
  // .next-page {
  //   width: 10px;
  //   height: 10px;
  //   background: url('../../assets/images/publish/doc-pager-next-page.png')
  //     no-repeat;
  //   background-size: 10px 10px;
  //   cursor: pointer;
  // }
  // .last-page {
  //   width: 10px;
  //   height: 10px;
  //   background: url('../../assets/images/publish/doc-pager-last-page.png')
  //     no-repeat;
  //   background-size: 10px 10px;
  //   cursor: pointer;
  // }
}
</style>
