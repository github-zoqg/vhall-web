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
      <el-button round class="head-btn batch-del" @click="allDelete(null)">批量删除</el-button>
      <search-area class="head-btn fr search"
        ref="searchArea"
        :placeholder="`请输入音视频名称`"
        :isExports='false'
        :searchAreaLayout="searchAreaLayout"
        @onSearchFun="getTableList('search')"
        >
      </search-area>
    </div>
    <el-card class="video-list">
      <table-list ref="tableList" :manageTableData="tableData" :tabelColumnLabel="tabelColumn" :tableRowBtnFun="tableRowBtnFun"
       @changeTableCheckbox="changeTableCheckbox" :isHandle="true" :width="240" :totalNum="total" @onHandleBtnClick='operating' @getTableList="getTableList">
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
import { sessionOrLocal } from '@/utils/utils';
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
      checkedList: [],
      tableRowBtnFun: [{name:'预览', methodName: 'preview'},{name:'编辑', methodName: 'update'},{name:'删除', methodName: 'del'}],
      tabelColumn: [
        {
          label: '音视频名称',
          key: 'name',
        },
        {
          label: '上传时间',
          key: 'created_at',
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
          key: "title",
        }
      ],
    };
  },
  components: {
    PageTitle,
    VideoPreview,
  },
  mounted() {
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
    this.getTableList();
    this.getVideoAppid();
  },
  methods: {
    getTableList(params){
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let formParams = this.$refs.searchArea.searchParams; //获取搜索参数
      if (params === 'search') {
        pageInfo.pageNum= 1;
        pageInfo.pos= 0;
        // 如果搜索是有选中状态，取消选择
        this.$refs.tableList.clearSelect();
      }
      let obj = Object.assign({}, pageInfo, formParams);
      this.getList(obj);
    },
    getVideoList() {
      // this.getTableList('search')
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
      // let name = beforeName.split('.m')[0];
      // console.log(name, beforeName,  '22222222222222222222222222');
      let onlyId = this.uploadId--;
      file.id = onlyId;
      // if(!reg.test(name)){
      //   this.$message({
      //     type: 'warning',
      //     message: '请确认上传的文件是否为中文、英文、数字和下划线组成'
      //   });
      //   return;
      // }
      let param = {
        create_time: this.$moment(file.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss'),
        file_name: beforeName,  //后端要求名称带上后缀名  如xxx 改成 xxx.mp4
        duration: '',
        uploadObj: {}, // type：1   上传视频     2创建点播
        id: onlyId
      };
      console.log(param, '33333333333333333');
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
        console.log(res, '本地上传成功');
        console.log(res, 11111);
        this.createVod(res.file);
      },err=>{
        console.log(err, '失败');
        this.tableData.shift();
        this.uploadList.shift();
        this.$message.error('本地上传失败');
      });
    },
    createVod(_file){
      this.UploadSDK.createDemand({ file: _file, fileName: 'name'},(res)=>{
        // this.tableData.forEach((ele)=>{
        //   if(ele.id == _file.id){
        //     ele.uploadObj = {
        //       type: 2,
        //       test: '创建点播',
        //       num: 100
        //     };
        //   }
        // });
        // console.warn(res);
        this.$fetch('createVideo', {paas_id: res.recordId, user_id: this.userId, filename: _file.name}).then(res=>{
          this.tableData.splice(0, 1);
          console.log(this.tableData, this.uploadList, '000000000000000000')
          this.$message.success('上传视频成功');
          this.getTableList();
        });
      },err=>{
        this.tableData.shift();
        this.uploadList.shift();
        this.$message.error('创建点播失败');
      });
    },
    initUpload(id, token){
      let option = {
        appId: id, // appId
        accountId: this.userId, // 第三方用户id
        token: token, // token
      };
      window.VhallUpload.createInstance(option, (res) => {
        this.UploadSDK = res.interface; // 创建成功
        console.log(this.UploadSDK, '111111111111111')
      },err=>{
        console.warn(err, '上传demo初始化失败');
      });
    },
    getVideoAppid() {
      this.$fetch('getAppid').then(res => {
        // this.appId = res.data.app_id;
        this.initUpload(res.data.app_id, res.data.access_token);
      })
    },
    getList(obj){
      obj.user_id = this.userId;
      this.$fetch('dataVideoList', this.$params(obj)).then(res=>{
        if(res.code == 200){
          this.total = res.data.total;
          // 转码状态:0新增排队中 1转码成功 2转码失败 3转码中
          res.data.list.forEach(ele => {
            switch (ele.transcode_status) {
              case '0':
                ele.transcode_status_text = '新增排队中';
                ele.duration = '——';
                break;
              case '1':
                ele.transcode_status_text = '转码成功';
                break;
              case '2':
                ele.transcode_status_text = '转码失败';
                ele.duration = '——'
                break;
              case '3':
                ele.transcode_status_text = '转码中';
                ele.duration = '——'
                break;
              default:
                ele.transcode_status_text = '新增排队中';
                ele.duration = '——'
                break;
            }
          });
          if (res.data.total === 1) {
            this.$refs.tableList.clearSelect();
          }
          this.tableData = res.data.list;
          // this.checkedList = [];
          // if(this.uploadList.length!=0){
          //   this.tableData =this.uploadList.concat(this.tableData);
          // }
        }
      });
    },
    // 编辑
    update(that, { rows }) {
      that.$prompt('', '编辑',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入名称',
          inputErrorMessage: '名字格式不正确'
        }).then(({ value }) => {
          let flag = Boolean(value.match(/[ ]*$/));
          if(!flag && value!=null){
            that.$fetch('dataVideoupdate', {video_id: rows.id, user_id: this.userId, filename: value}).then(res=>{
              that.$message.success('修改成功');
              that.getTableList();
            });
          }
        }).catch(() => {});
    },
    confirmDelete(id) {
      this.$confirm('确定要删除此视频或音频吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'zdy-message-box',
        center: true
      }).then(() => {
        this.$fetch('dataVideoDel', {video_ids: id, user_id:  this.userId}).then(res=>{
          if (res.code == 200) {
            this.getTableList();
            this.$message.success('删除成功');
          } else {
            this.$message.error(res.msg);
          }

        });
      }).catch(() => {});
    },
    del(that, { rows }) {
      that.checkedList = [];
      that.confirmDelete(rows.id);
    },
    // 批量删除
    allDelete() {
      if(this.checkedList.length <= 0) {
          this.$message.error('请至少选择一条视频删除');
          return;
        } else {
          let id = this.checkedList.join(',');
          this.confirmDelete(id);
        }
    },
    preview(that, { rows }) {
      //  this.videoParam 进本信息
      if (rows.transcode_status == 1) {
        that.showDialog = true;
        that.videoParam = rows;
      } else {
        that.$message.warning('只有转码成功才能查看');
      }
    },
    operating(val){
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    changeTableCheckbox(item) {
      this.checkedList = item.map(val => val.id);
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
