<template>
  <el-dialog
    title="添加封面背景"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="60%">
    <el-scrollbar class="scrollbar">
      <div class="background-list">
        <div class="list-item">
          <img src="../../../../common/images/icon/qq.png" alt="">
        </div>
        <!-- <div class="list-item">

        </div> -->
      </div>
    </el-scrollbar>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      advertisement: {}
    };
  },
};
</script>
<style lang="less" scoped>
  .background-list{
     border: 1px solid #ccc;
     .list-item{
       width: 120px;
       height: 200px;
       img{
         width: auto;
       }
     }
   }
</style>

