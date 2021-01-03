<template>
  <div class="video-wrap">
    <pageTitle title="音视频">
      <div slot="content">
        1.上传单个文件最大2G，文件标题不能带有特殊字符和空格
        <br>
        2.上传视频格式支持RMVB、MP4、AVI、WMV、MKV、FLV、MOV；上传音频格式支持MP3、WAV
        <br>
        3.上传的视频，不支持剪辑和下载
      </div>
    </pageTitle>
    <div class="head-operat" v-show="total || isSearch">
      <el-button size="medium" type="primary" round class="length104 head-btn set-upload">上传 <input ref="upload" class="set-input" type="file" @change="tirggerFile($event)" accept=".mp4,.mp3,.rmvb,.avi,.mkv,.flv,.mov,.mav,.wmv"> </el-button>
      <el-button size="medium" round class="length104 head-btn batch-del" @click="allDelete(null)" :disabled="!checkedList.length">批量删除</el-button>
      <div class="inputKey">
        <el-input v-model.trim="keyword" suffix-icon="el-icon-search" placeholder="请输入音视频名称" clearable @change="getTableList"></el-input>
      </div>
    </div>
    <div class="video-list" v-show="total">
      <table-list ref="tableList" :manageTableData="tableData" :tabelColumnLabel="tabelColumn" :tableRowBtnFun="tableRowBtnFun"
       @changeTableCheckbox="changeTableCheckbox" :isHandle="true" :width="150" :totalNum="total" @onHandleBtnClick='operating' @getTableList="getTableList">
      </table-list>
    </div>
    <div class="no-live" v-show="!total">
      <noData :nullType="nullText" :text="text">
        <el-button type="primary" round class="head-btn set-upload" v-if="nullText==='nullData'">
          上传
          <input ref="upload" class="set-input" type="file" @change="tirggerFile($event)">
        </el-button>
      </noData>
    </div>
    <!-- 预览功能 -->
    <template v-if="showDialog">
      <el-dialog class="vh-dialog" title="预览" :visible.sync="showDialog" :before-close='closeBefore' width="30%" center>
      <video-preview ref="videoPreview" :videoParam='videoParam'></video-preview>
      </el-dialog>
    </template>
    <!-- 编辑功能 -->
    <template v-if="editShowDialog">
      <el-dialog title="编辑" :visible.sync="editShowDialog" width="300px" center>
        <div class="main-edit">
          <VhallInput v-model.trim="videoName" maxlength="30" show-word-limit  type="text" style="width:220px" placeholder="请输入名称" oninput="this.value=this.value.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi, '')"></VhallInput>
          <p v-show="errorText">请输入正确的格式文件</p>
        </div>
        <div class="dialog-footer">
          <el-button size="medium" type="primary" @click="sureMaterialVideo" v-preventReClick round>确 定</el-button>
          <el-button size="medium"  @click="editShowDialog=false"  round>取 消</el-button>
       </div>
      </el-dialog>
    </template>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import VideoPreview from './VideoPreview/index.vue';
import { sessionOrLocal } from '@/utils/utils';
import noData from '@/views/PlatformModule/Error/nullPage';
export default {
  name: 'video.vue',
  data() {
    return {
      total: 0,
      // 预览
      showDialog: false,
      isSearch: false,
      errorText: false,
      videoName: '',
      lowName: '',
      videoId: '',
      keyword: '',
      editShowDialog: false,
      nullText: 'nullData',
      text: '暂未上传音视频',
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
    noData
  },
  mounted() {
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
    this.getTableList();
    this.getVideoAppid();
  },
  methods: {
    getTableList(){
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      if (this.keyword) {
        pageInfo.pageNum= 1;
        pageInfo.pos= 0;
        // 如果搜索是有选中状态，取消选择
        this.$refs.tableList.clearSelect();
      }
      let formParams = {
        title: this.keyword,
        user_id: this.userId,
        ...pageInfo
      }
      this.getList(formParams);
    },
    tirggerFile(event){
      const typeList = ['rmvb','mp4','avi','wmv','mkv','flv','mov','mp3','mav'];
      let file = event.target.files[0];
      console.log(file, '111111111111');
      let beforeName = event.target.files[0].name.toLowerCase();
      let videoArr = beforeName.toLowerCase().split('.');
      const videoType = typeList.includes(videoArr[videoArr.length - 1]);
      if (!videoType) {
        this.$message.error(`您上传的文件格式不正确`);
        return false;
      }
      if (file.size > 2147483648) {
        this.$message.error(`您上传的文件不能大于2G`);
        return false;
      }
      // if(beforeName.indexOf('.mp')==-1){
      //   this.$message({
      //     type: 'error',
      //     message: '您上传的文件格式不正确'
      //   });
      //   return;
      // }
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
      console.log(this.tableData, '??????????????????')
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
          this.tableData.splice(0, 1, this.uploadList);
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
      },err=>{
        console.warn(err, '上传demo初始化失败');
      });
    },
    getVideoAppid() {
      this.$fetch('getAppid').then(res => {
        this.initUpload(res.data.app_id, res.data.access_token);
      })
    },
    getList(obj){
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
          if (this.keyword) {
            this.isSearch = true;
            this.nullText = 'search';
            this.text = '';
          } else {
            this.isSearch = false;
            this.nullText = 'nullData';
            this.text = '暂未上传音视频';
          }
          // this.checkedList = [];
          // if(this.uploadList.length!=0){
          //   this.tableData =this.uploadList.concat(this.tableData);
          // }
        }
      });
    },
    // 编辑
    update(that, { rows }) {
      that.editShowDialog = true;
      that.errorText = false;
      that.videoName = rows.name
      that.videoId = rows.id;
      // that.$prompt('', '编辑',{
      //     confirmButtonText: '确定',
      //     cancelButtonText: '取消',
      //     showInput: true,
      //     value: rows.name,
      //     inputPlaceholder: '请输入名称'
      //   }).then(({ value }) => {
      //     let regStr = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi;
      //     value = value.replace(regStr, "");
      //     if(value){
      //       that.$fetch('dataVideoupdate', {video_id: rows.id, user_id: that.userId, filename: value}).then(res=>{
      //         if (res.code == 200) {
      //           that.$message.success('修改成功');
      //           that.getTableList();
      //         }
      //       });
      //     } else {
      //       that.$message.error('名称格式不正确');
      //       return
      //     }
      //   }).catch(() => {});
    },
    sureMaterialVideo() {
     if (!this.videoName) {
       this.errorText = true;
       return;
     } else {
       let name = `${this.videoName}${this.lowName}`
      this.$fetch('dataVideoupdate', {video_id: this.videoId, user_id: this.userId, filename: name}).then(res=>{
        if (res.code == 200) {
          this.editShowDialog = false;
          this.$message.success('修改成功');
          this.getTableList();
        }
      });
     }
    },
    confirmDelete(id) {
      this.$confirm('是否删除该视频？', '提示', {
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
      console.log(rows, '????????')
      if (!rows.transcode_status) {
        that.getList();
        // this.$message.error('正在转码的文件不能删除');
        return;
      }
      if (that.audit_status) {
          this.$confirm('该文件已被关联，删除将导致相关文件无法播放且不可恢复，确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'zdy-message-box',
          center: true
        }).then(() => {
          that.confirmDelete(rows.id);
        }).catch(() => {});
      } else {
        that.confirmDelete(rows.id);
      }

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
.video-list{
  width: 100%;
  .layout--right--main();
  .padding-table-list();
  .min-height();
}
.inputKey{
      float: right;
      height: 35px;
      width: 220px;
      /deep/.el-input__inner{
        border-radius: 18px;
      }
    }
.video-wrap{
  height: 100%;
  width: 100%;
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
      padding-bottom: 30px;
      .el-dialog__body{
        height: calc(100% - 44px);
      }
    }
  }
  .head-operat, .no-live{
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
.main-edit{
  margin-bottom: 20px;
  padding-left: 20px;
  p{
    font-size: 12px;
    padding-top: 5px;
    color: #FB3A32;
  }
}
.dialog-footer{
  text-align: center;
}
</style>
