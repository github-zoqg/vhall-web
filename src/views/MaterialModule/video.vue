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
    <div class="head-operat">
      <el-button class="set-upload">上传 <input ref="upload" class="set-input" type="file" @change="tirggerFile($event)"> </el-button>
    </div>
    <table-list :manageTableData="tableData" :tabelColumnLabel="tabelColumn" :tableRowBtnFun="tableRowBtnFun"
      :isCheckout="isCheckout" :isHandle="true" :totalNum="total" @onHandleBtnClick='operating' @getTableList="getTableList">
    </table-list>
    <!-- 预览功能 -->
    <template v-if="showDialog">
      <el-dialog class="vh-dialog" title="预览" :visible.sync="showDialog" :before-close='closeBefore' width="30%" center>
        <video-preview ref="videoPreview" :videoParam='videoParam'></video-preview>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import pageTitle from '../LiveModule/components/pageTitle';
import VideoPreview from './VideoPreview/index.vue';
export default {
  name: 'video.vue',
  data() {
    return {
      total: 100,
      currentPage: 1,
      showDialog: false,
      videoParam: {},
      tableData: [],
      isCheckout: false,
      tableRowBtnFun: [{name:'预览', methodName: 'preview'},{name:'编辑', methodName: 'update'},{name:'删除', methodName: 'del'}],
      tabelColumn: [
        {
          label: '音视频名称',
          key: 'file_name',
        },
        {
          label: '上传时间',
          key: 'create_time',
        },
        {
          label: '时长',
          key: 'duration',
        },
        {
          label: '进度',
          key: 'transcode_status_text',
        }
      ],
      UploadSDK: null,
      uploadId: 1000
    };
  },
  components: {
    pageTitle,
    VideoPreview,
  },
  created() {
    this.getList();
    this.initUpload();
  },
  methods: {
    getTableList(){},
    tirggerFile(event){
      let file = event.target.files[0];
      let beforeName = event.target.files[0].name.toLowerCase();
      console.log(beforeName, '上传前的name');
      if(beforeName.indexOf('.mp')==-1){
        this.$message({
          type: 'error',
          message: '请选择Mp4和Mp3格式的视频'
        });
        return;
      }
      let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{0,10}$/;
      let name = beforeName.split('.m')[0];
      let onlyId = this.uploadId++;
      file.id = onlyId;
      window.mom = this.$moment;
      console.log(this.$moment(file.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss'));
      if(!reg.test(name)){
        this.$message({
          type: 'warning',
          message: '请确认上传的文件是否为中文、英文、数字和下划线组成'
        });
        return;
      }
      let param = {
        create_time: this.$moment(file.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss'),
        file_name: name,
        duration: '',
        uploadProgress: 0,
        id: onlyId
      };
      this.tableData.unshift(param);
      this.UploadSDK.upload([file],(progress)=>{
        console.log(progress, '进度', file, file.lastModifiedDate);
        this.tableData.forEach(ele=>{
          if(ele.id == file.id){
            ele.uploadProgress = Math.floor(progress*100) + '%';
          }
        });
      },res=>{
        console.log(res, '成功');
        this.createVod(file, name);
      },err=>{
        console.log(err, '失败');
      });
    },
    createVod(_file,name){
      this.UploadSDK.createDemand({ file: _file, fileName: name},(res)=>{
        console.warn(res);
        this.$fetch('dataVideoAdd', {video_id: res.recordId, user_id: 1333, filename: name, file_type: _file.type, file_size: _file.size}).then(res=>{
          console.log(res, '上传成功');
        });
      },err=>{
        console.warn(err, '上传失败');
      });
    },
    initUpload(){
      let option = {
        appId: "d317f559", // appId
        accountId: "zx", // 第三方用户id
        token: "access:d317f559:75107dced08acdb1", // token
      };
      window.VhallUpload.createInstance(option, (res) => {
        this.UploadSDK = res.interface; // 创建成功
      },err=>{
        console.warn(err, '上传demo初始化失败');
      });
    },
    getList(){
      let data = {
        user_id: '1333',
        pos: 0,
        limit: 12,
        title: ''
      };
      this.$fetch('dataVideoList', data).then(res=>{
        if(res.code == 200){
          this.total = res.data.total;
          // 转码状态:0新增排队中 1转码成功 2转码失败 3转码中
          res.data.list.forEach(ele => {
            switch (ele.transcode_status) {
              case 0:
                ele.transcode_status_text = '转码完成';
                break;
              default:
                ele.transcode_status_text = '转码完成';
                break;
            }
          });
          this.tableData = res.data.list;
        }
      });
    },
    operating(_data){
      console.log('列表操作',_data);
       if(_data.type == 'update'){
         this.$prompt('', '编辑',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入名称'
        }).then(({ value }) => {
          let flag = Boolean(value.match(/^[ ]*$/));
          if(!flag && value!=null){
            this.$fetch('dataVideoupdate', {video_id: _data.rows.id, user_id: '1333', file_name: value}).then(res=>{
              console.warn('成功', res);
                this.$message({
                  type: 'success',
                  message: '修改成功'
                });
            });
          }
        }).catch(() => {});
       }else if(_data.type == 'del'){
          this.$confirm('该文件已被关联，删除将导致相关文件无法播放且不可恢复，确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            this.$fetch('dataVideoDel', {video_ids: _data.rows.id, user_id: '1333'}).then(res=>{
              console.warn('成功', res);
                this.$message({
                  type: 'success',
                  message: '删除成功'
                });
            });
          }).catch(() => {});
       }else if(_data.type == 'preview'){
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
    },
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
  ::v-deep.set-upload{
    position: relative;
    span{
      input{
        position: absolute;
        left: 0;
        top: 0;
        opacity: 0;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
