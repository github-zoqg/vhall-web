<template>
  <div class="video-wrap">
    <pageTitle title="音视频">
      <div slot="content">
        1.上传单个文件最大2G，文件标题不能带有特殊字符和空格
        <br>
        2.上蔟韩视频格式支持RMVB、MP4、AVI、WMV、MKV、FLV、MOV；上传音频格式支持MP3、WAV
        <br>
        3.上传的视频，不支持剪辑和下载
      </div>
    </pageTitle>
    <div>
      <el-button>上传</el-button>
      <el-button>批量删除</el-button>
    </div>
    <video-list :type='2' :operatingArray="['编辑', '预览', '删除']" @operating='operating' :tableData='tableData' @select='select'></video-list>
    <pagination-list :total='total' :currentPage='currentPage' @pageSizeChange='pageSizeChange'></pagination-list>
    <!-- 预览功能 -->
    <template v-if="showDialog">
      <el-dialog class="vh-dialog" title="预览" :visible.sync="showDialog" :before-close='closeBefore' width="30%" center>
        <video-preview ref="videoPreview" :videoParam='videoParam'></video-preview>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import VideoList from '@/components/DataList/index.vue';
import PaginationList from '@/components/Pagination/index.vue';
import pageTitle from '../LiveModule/components/pageTitle';
import VideoPreview from './VideoPreview/index.vue';
export default {
  name: 'video.vue',
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
      fileList:[],
      showDialog: true,
      videoParam: {}
    };
  },
  components: {
    VideoList,
    PaginationList,
    pageTitle,
    VideoPreview
  },
  methods: {
    operating(_data){
      console.log('列表操作',_data);
       if(_data.name == '编辑'){
         this.$prompt('', '编辑',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入名称'
        }).then(({ value }) => {
          let flag = Boolean(value.match(/^[ ]*$/));
          if(!flag && value!=null){
            this.$message({
              type: 'success',
              message: '修改成功'
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
       }else if(_data.name == '删除'){
          this.$confirm('该文件已被关联，删除将导致相关文件无法播放且不可恢复，确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
       }else if(_data.name == '预览'){
        //  this.videoParam 进本信息
         this.showDialog = true;
       }
    },
    select(item){
      console.log('列表选中', item);
    },
    pageSizeChange(page){
      console.log(page);
    },
    uploadSucess(msg){
      console.log('上传成功', msg);
    },
    closeBefore(done){
      this.$refs.videoPreview.destroy();
      done();
    }
  },
};
</script>
<style lang="less" scoped>
.video-wrap{
  height: 100%;
  ::v-deep .el-dialog__header{
    padding-top: 10px;
  }
  ::v-deep .el-dialog__headerbtn{
    top: 15px;
  }
  ::v-deep .el-dialog--center .el-dialog__body{
    padding: 0px 10px 10px;
  }
  ::v-deep .vh-dialog{
    .el-dialog{
      width: 960px!important;
      height: 623px;
      .el-dialog__body{
        height: calc(100% - 44px);
      }
    }
  }
}
</style>
