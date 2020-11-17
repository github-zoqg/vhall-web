<template>
  <div class="pageBox">
    <el-pagination
      v-bind="$props"
      @size-change="sizeChangeHandler"
      @current-change="currentChangeHandler"
      @prev-click="prevClickHandler"
      @next-click="nextClickHandler">
    </el-pagination>
  </div>
</template>

<script>
import { Pagination } from 'element-ui';
export default {
  props: {
    ...Object.assign(
      Pagination.props,
      {
        background: {
          type: Boolean,
          default: true
        },
        layout: {
          type: String,
          default: 'total, prev, pager, next, jumper'
        }
      }
    )
  },
  methods: {
    sizeChangeHandler(pageSize) {
      this.$emit('size-change', pageSize);
    },
    currentChangeHandler(current) {
      this.$emit('current-change', current);
    },
    prevClickHandler(current) {
      this.$emit('prev-click', current);
    },
    nextClickHandler(current) {
      this.$emit('next-click', current);
    }
  }
};
</script>

<style lang="less" scoped>
  .pageBox{
    /deep/.el-pagination.is-background .btn-next, /deep/.el-pagination.is-background .btn-prev, /deep/.el-pagination.is-background .el-pager li{
      background-color: #fff;
    }
    /deep/ .el-pager{
      .number{
        border: 1px solid #CCCCCC;
        &:not(.disabled).active{
          background-color: #FB3A32;
          border-color: transparent;
        }
      }

    }
    /deep/ .btn-next,/deep/ .btn-prev{
      border: 1px solid #CCCCCC;
    }
  }
</style>
