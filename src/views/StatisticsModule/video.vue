<template>
  <div class="video-wrap">
    <div class="list-head">
       <el-upload
        class="upload-demo"
        action="http://t.e.vhall.com/account/docupload"
        :on-success='uploadSucess'
        :limit="1"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <video-list :type='2' :operatingArray="['编辑','预览', '删除']" @operating='operating' :tableData='tableData' @select='select'></video-list>
    <pagination-list :total='total' :currentPage='currentPage' @pageSizeChange='pageSizeChange'></pagination-list>
  </div>
</template>
<script>
import VideoList from '@/components/DataList/index.vue';
import PaginationList from '@/components/Pagination/index.vue';
export default {
  data() {
    return {
      total: 100,
      currentPage: 1,
      tableData: [{
        date: '2016-04-06',
        name: '王',
        address: '上区金沙江路 1518 弄'
      },{
        date: '2016-05-03',
        name: '小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }],
      fileList:[]
    };
  },
  components: {
    VideoList,
    PaginationList
  },
  methods: {
    operating(item){
      console.log('列表操作',item);
    },
    select(item){
      console.log('列表选中', item);
    },
    pageSizeChange(page){
      console.log(page);
    },
    uploadSucess(msg){
      console.log('上传成功', msg);
    }
  },
};
</script>
<style lang="less" scoped>
.video-wrap{
  height: 100%;
}
</style>
