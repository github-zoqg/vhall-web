<template>
  <div class="pagination-list">
    <el-pagination
      class="content"
      @current-change="handleCurrentChange"
      :current-page.sync="localCurrentPage"
      :page-size="10"
      layout="total, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      localCurrentPage: this.currentPage,
      localTotal: this.total,
      currentPage1: 5
    };
  },
  props: {
    total: {
      type: Number,
      default: 1000
    },
    currentPage: {
      type: Number,
      default: 10
    },
    mounted() {
      console.log('data', this.total, this.localCurrentPage);
    },
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit('pageSizeChange', val);
    }
  }
};
</script>
<style lang="less" scoped>
.pagination-list{
  min-height: 60px;
  background: #fff;
  position: relative;
  .content{
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-15px);
  }
}
</style>
