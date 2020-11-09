<template>
  <el-dialog
    title="选择广告推荐"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="60%">
    <div class="advertise-main">
       <el-input v-model="advertisementTitle" suffix-icon="el-icon-search" style="width: 180px"></el-input>
       <div class="advertise-list">
         <div class="list-item" @click="changeChecked">
           <img src="../../../../common/images/v35-webinar.png" alt="">
           <p>这里是广告标题</p>
           <span v-show="checked">
             <el-checkbox v-model="checked"></el-checkbox>
           </span>
         </div>
       </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      advertisementTitle: '',
      checked: false
    };
  },
  methods: {
    changeChecked() {
      this.checked = !this.checked;
    }
  }
};
</script>
<style lang="less" scoped>
   .advertise-main{
     /deep/.el-checkbox__inner {
       width: 30px;
       height: 20px;
       &::after{
         height: 12px;
         left: 10px;
         width: 6px;
       }
     }
     .advertise-list{
       border: 1px solid #ccc;
       margin-top: 30px;
       .list-item{
         width: 300px;
         border: 1px solid #ccc;
         padding:10px;
         position: relative;
         img{
           width: 120px;
           height: 120px;
         }
         p{
           float: right;
          margin: 20px 45px 0 0;
         }
         span{
           position: absolute;
           top:0;
           right:0;
         }
       }
     }
   }
</style>
