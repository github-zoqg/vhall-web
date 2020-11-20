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
      <el-button type="primary" round class="head-btn set-upload">上传 <input ref="upload" class="set-input" type="file" @change="tirggerFile($event)"> </el-button>
      <el-button round class="head-btn batch-del">批量删除</el-button>
      <search-area class="head-btn fr search"
        ref="searchArea"
        :isExports='false'
        :searchAreaLayout="searchAreaLayout"
        @onSearchFun="getTableList('search')"
        >
      </search-area>
    </div>
    <el-card class="video-list">
      <table-list ref="tableList" :manageTableData="tableData" :tabelColumnLabel="tabelColumn" :tableRowBtnFun="tableRowBtnFun"
        :isCheckout="isCheckout" :isHandle="true" :totalNum="total" @onHandleBtnClick='operating' @getTableList="getTableList">
      </table-list>
    </el-card>
    <!-- 预览功能 -->
    <template v-if="showDialog">
      <el-dialog class="vh-dialog" title="预览" :visible.sync="showDialog" :before-close='closeBefore' width="30%" center>
        <video-preview ref="videoPreview" :videoParam='videoParam'></video-preview>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import VideoPreview from './VideoPreview/index.vue';
export default {
  name: 'video.vue',
  data() {
    return {
      total: 100,
      // 预览
      showDialog: false,
      videoParam: {},
      // 表格
      tableData: [],
      isCheckout: true,
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
      uploadId: -1,
      uploadList: [],
      searchAreaLayout: [
        {
          type: "",
          key: "searchTitle",
        }
      ],
    };
  },
  components: {
    PageTitle,
    VideoPreview,
  },
  created() {
    this.getList();
    this.initUpload();
  },
  methods: {
    getTableList(params){
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let formParams = this.$refs.searchArea.searchParams; //获取搜索参数
      if (params === 'search') {
        pageInfo.pageNum= 1;
        pageInfo.pos= 0;
        // 如果搜索是有选中状态，取消选择
        // this.$refs.tableList.clearSelect();
      }
      let obj = Object.assign({}, pageInfo, formParams);
      this.getList(obj);
    },
    tirggerFile(event){
      let file = event.target.files[0];
      let beforeName = event.target.files[0].name.toLowerCase();
      if(beforeName.indexOf('.mp')==-1){
        this.$message({
          type: 'error',
          message: '请选择Mp4和Mp3格式的视频'
        });
        return;
      }
      let reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]{0,10}$/;
      let name = beforeName.split('.m')[0];
      let onlyId = this.uploadId--;
      file.id = onlyId;
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
        uploadObj: {}, // type：1   上传视频     2创建点播
        id: onlyId
      };
      this.uploadList.unshift(param);
      this.tableData.unshift(param);
      this.UploadSDK.upload([file],(pro)=>{
        this.tableData.forEach((ele)=>{
          if(ele.id == file.id){
            ele.uploadObj = {
              type: 1, // 上传类型
              text: '视频正在上传中',
              num: Math.floor(pro.progress*100)
            };
          }
        });
      },res=>{
        console.log(res, '成功');
        // this.createVod(file, 'name');
      },err=>{
        console.log(err, '失败');
        this.tableData.shift();
        this.uploadList.shift();
        this.$message.error('本地上传失败');
      });
    },
    createVod(_file,name){
      this.UploadSDK.createDemand({ file: _file, fileName: name},(res)=>{
        this.tableData.forEach((ele)=>{
          if(ele.id == _file.id){
            ele.uploadObj = {
              type: 2,
              test: '创建点播',
              num: 100
            };
          }
        });
        console.warn(res);

        // this.$fetch('dataVideoAdd', {video_id: res.recordId, user_id: 1333, filename: name, file_type: _file.type, file_size: _file.size}).then(res=>{
        //   console.log(res, '上传成功');
        // });
      },err=>{
        console.warn(err, '上传失败');
        this.tableData.shift();
        this.uploadList.shift();
        this.$message.error('创建点播失败');
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
                ele.transcode_status_text = '新增排队中';
                break;
              case 1:
                ele.transcode_status_text = '转码成功';
                break;
              case 2:
                ele.transcode_status_text = '转码失败';
                break;
              case 3:
                ele.transcode_status_text = '转码中';
                break;
              default:
                ele.transcode_status_text = '新增排队中';
                break;
            }
          });
          this.tableData = res.data.list;
          if(this.uploadList.length!=0){
            this.tableData =this.uploadList.concat(this.tableData);
          }
        }
      });
    },
    // 编辑
    update(that, { rows }) {
      that.$prompt('', '编辑',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入名称'
        }).then(({ value }) => {
          let flag = Boolean(value.match(/^[ ]*$/));
          if(!flag && value!=null){
            that.$fetch('dataVideoupdate', {video_id: _data.rows.id, user_id: '1333', file_name: value}).then(res=>{
              console.warn('成功', res);
                that.$message({
                  type: 'success',
                  message: '修改成功'
                });
            });
          }
        }).catch(() => {});
    },
    del(that, { rows }) {
      that.$confirm('该文件已被关联，删除将导致相关文件无法播放且不可恢复，确认删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }).then(() => {
            that.$fetch('dataVideoDel', {video_ids: _data.rows.id, user_id: '1333'}).then(res=>{
              console.warn('成功', res);
                that.$message({
                  type: 'success',
                  message: '删除成功'
                });
            });
          }).catch(() => {});
    },
    preview(that, { rows }) {
      //  this.videoParam 进本信息
      this.showDialog = true;
    },
    operating(val){
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
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
  width: 100%;
  .video-list{
    width: 100%;
  }
  /deep/.el-card__body{
    padding: 0 0 30px 0;
  }
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
  .head-operat{
    margin-bottom: 20px;
    .head-btn{
      display: inline-block;
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
}
</style>
