<template>
 <VhallDialog
    title="资料库"
    :visible.sync="dataBaseVisible"
    :close-on-click-modal="false"
    width="50%">
    <div class="data-base">
      <div class="data-search">
        <el-input v-model="searchData" suffix-icon="el-icon-search" placeholder="搜索问卷名称" style="width: 200px"></el-input>
      </div>
      <el-scrollbar>
        <div class="data-list">
        </div>
      </el-scrollbar>
    </div>
  </VhallDialog>
</template>
<script>
export default {
  data() {
    return {
      dataBaseVisible: false,
      searchData: ''
    };
  },
};
</script>
<style lang="less" scoped>

</style>
