<template>
  <div class="video-wrap">
    <pageTitle title="文档">
      <div slot="content">
        1.支持的文档格式: doc/docx，xls/xlsx，ppt/pptx，pdf，jpeg/jpg，png，bmp
        <br>
        2.上传的文档内容不能超过200页，不超过100M
        <br>
        3.如果ppt格式转换失败或文档打开失败请尝试用office转为pdf后上传
        <br>
        4.直播过程中发现ppt自动翻页，请检查源文件是否设置自动放映
        <br>
        5.文档转换较慢，请于直播前提前上传
      </div>
    </pageTitle>
    <div class="head-operat">
      <el-upload
        :accept="accept"
        inputName="file"
        class="upload-demo"
        action="https://t.e.vhall.com/account/docupload"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
    <!-- 预览功能 -->
    <template v-if="showDialog">
      <el-dialog class="vh-dialog" title="预览" :visible.sync="showDialog" :before-close='closeBefore' width="30%" center>
        <doc-preview ref="videoPreview" :docParam='docParam'></doc-preview>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import pageTitle from '../LiveModule/components/pageTitle';
import DocPreview from './DocPreview/index.vue';
export default {
  name: 'word.vue',
  data() {
    return {
      total: 100,
      currentPage: 1,
      tableData: [
        {
          date: '2016-04-06',
          name: '王',
          address: '上区金沙江路 1518 弄',
        },
        {
          date: '2016-05-03',
          name: '小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
      ],
      fileList: [],
      accept: 'png|jpg|jpeg|bmp|gif|doc|mp4',
      showDialog: false,
      docParam: {}
    };
  },
  components: {
    pageTitle,
    DocPreview
  },
  methods: {
    operating(item) {
      console.log('列表操作', item);
      if(item.name == '删除'){
        this.$confirm('该文件已被关联，删除将导致相关文件无法播放且不可恢复，确认删除？', '提示', {
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
      }else if(item.name == '预览'){
        console.log();
        this.showDialog = true;
      }
    },
    select(item) {
      console.log('列表选中', item);
    },
    pageSizeChange(page) {
      console.log(page);
    },
    uploadSucess(msg) {
      console.log('上传成功', msg);
    },
    before(file) {
      console.log(file, 999);
      this.$fetch('test', { file: file })
        .then((res) => {
          console.log(res, 7);
        })
        .catch((err) => {
          console.log(err, 8);
        });
    },
    closeBefore(done){
      done();
    }
  },
};
</script>
<style lang="less" scoped>
.video-wrap {
  height: 100%;
  ::v-deep .vh-dialog{
    .el-dialog{
      width: 960px!important;
      height: 623px;
      .el-dialog__body{
        height: calc(100% - 44px);
      }
      .el-dialog__header{
        padding-top: 10px;
      }
      .el-dialog__headerbtn{
        top: 15px;
      }
      .el-dialog--center .el-dialog__body{
        padding: 0px 10px 10px;
      }
    }
    }
}
</style>
