<template>
  <div class="video-wrap">
    <pageTitle pageTitle="插播文件">
      <!-- <span class="video-text">音视频中的文件内容应用于暖场视频和点播</span> -->
      <div slot="content">
        1.上传单个文件最大5G
        <br>
        2.上传视频格式支持RMVB、MP4、AVI、WMV、MKV、FLV、MOV；上传音频格式支持MP3、WAV
        <br>
        3.上传的视频，不支持剪辑和下载
        <br>
        4.视频直播、互动直播支持上传音视频文件，音频直播仅支持上传音频文件
        <br>
        5.为不影响观看，建议文件分辨率在1280*720p及以下
      </div>
    </pageTitle>
    <div class="head-operat" v-show="total || isSearch">
      <el-button size="medium" type="primary" round class="length104 head-btn set-upload">上传 <input ref="uploads" class="set-input" type="file" @change="tirggerFile($event)" accept=".mp4,.mp3,.rmvb,.avi,.mkv,.flv,.mov,.mav,.wmv"> </el-button>
      <el-button size="white-medium" round class="transparent-btn" @click="choiceVideo">资料库</el-button>
      <el-button size="medium" round class="transparent-btn" @click="allDelete(null)" :disabled="!checkedList.length">批量删除</el-button>
      <VhallInput
        class="search-tag"
        placeholder="请输入视频文件名称"
        v-model="keyword"
        clearable
        v-clearEmoij
        @clear="searchTableList"
        @keyup.enter.native="searchTableList">
        <i
          class="el-icon-search el-input__icon"
          slot="prefix"
          @click="searchTableList">
        </i>
      </VhallInput>
    </div>
    <div class="video-list" v-if="total || isSearch">
      <el-table
            @cell-mouse-enter="handleCellMouseEnter"
            @cell-mouse-leave="handleCellMouseLeave"
            :data="tableData"
            @selection-change="changeTableCheckbox"
            :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
           >
            <el-table-column
              type="selection"
              width="52"
              align="left"
              :selectable="checkSelectable"
            />
            <el-table-column
              label="音视频名称"
            >
              <template slot-scope="scope">
                <el-tooltip placement="top" :disabled="!isTextOverflow" :content="scope.row.video_name == '' ? '- -' : scope.row.video_name">
                  <div class="videoName custom-tooltip-content">
                    <i class="iconfont-v3 saasyinpinwenjian" v-if="scope.row.file_type == '.mp3' || scope.row.file_type == '.mav'"></i>
                    <i class="iconfont-v3 saasshipinwenjian" v-else></i>
                    {{ scope.row.video_name  || '- -'}}
                  </div>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column
              width="200"
              prop="created_at"
              label="上传时间">
            </el-table-column>
            <el-table-column
              width="200"
              prop="duration"
              label="时长">
            </el-table-column>
            <el-table-column
              prop="transcode_status_text"
              width="200"
              label="进度">
              <template slot-scope="scope">
                <div>
                  <p v-if="scope.row.uploadObj">
                    <!-- 上传 -->
                    <span>{{
                      scope.row.uploadObj.num == 100
                        ? '上传已完成'
                        : '文件上传中'
                    }}</span>
                    <el-progress
                      :percentage="scope.row.uploadObj.num"
                    ></el-progress>
                  </p>
                  <!-- {{scope.row}} -->
                  <p v-if="scope.row.transcode_status_text">
                    <!-- 列表 -->
                    <span class="statusTag" :class="scope.row.transcode_status == 1 ? 'success' : scope.row.transcode_status == 0 ? 'wating' : 'failer'">{{ scope.row.transcode_status_text }}</span>
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="150"
              label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  @click="preview(scope.row)"
                  v-if="scope.row.transcode_status == 1"
                  >预览</el-button
                >
                <el-button
                  type="text"
                  @click="update(scope.row)"
                  v-if="scope.row.transcode_status >= 0 && scope.row.transcode_status != 2"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  @click="del(scope.row)"
                  v-if="scope.row.transcode_status >= 0"
                  >删除</el-button
                >
              </template>
            </el-table-column>
            <div slot="empty"><noData :nullType="'search'" v-if="!total"></noData></div>
      </el-table>
      <SPagination
        :total="total"
        v-if="total > pageInfo.limit"
        :currentPage="pageInfo.pageNum"
        @current-change="currentChangeHandler"
        align="center"
      >
      </SPagination>
    </div>
    <div class="no-live" v-else>
      <noData :nullType="'nullData'" :text="'暂未上传音视频'">
        <el-button type="primary" round class="head-btn set-upload">
          上传
          <input ref="upload" class="set-input" type="file" accept=".mp4,.mp3,.rmvb,.avi,.mkv,.flv,.mov,.mav,.wmv" @change="tirggerFile($event)">
        </el-button>
        <el-button size="white-primary" class="transparent-btn" round  @click="choiceVideo" v-preventReClick>资料库</el-button>
      </noData>
    </div>
    <!-- 资料库选择组件 -->
    <selectMedia ref="selecteMedia" @selected='mediaSelected' :videoType="videoSetType"></selectMedia>
    <!-- 预览功能 -->
    <template v-if="showDialog">
      <el-dialog class="vh-saas-dialog" :visible.sync="showDialog" :before-close='closeBefore' width="30%" center
      :close-on-click-modal=true
      :close-on-press-escape=false>
      <video-preview ref="videoPreview" :videoParam='videoParam'></video-preview>
      </el-dialog>
    </template>
    <!-- 编辑功能 -->
    <template v-if="editShowDialog">
      <VhallDialog title="编辑" :visible.sync="editShowDialog" width="420px" center
      :close-on-click-modal=false
      :close-on-press-escape=false>
      <div class="edit-contianer">
        <div class="main-edit">
          <VhallInput v-model="videoName" v-clearEmoij :maxlength="100" autocomplete="off" show-word-limit  type="text" style="width:356px" placeholder="请输入名称"></VhallInput>
          <p v-show="errorText">请输入正确的格式文件</p>
        </div>
        <div class="dialog-footer">
          <el-button size="medium" type="primary" round class="length104" @click="sureMaterialVideo" v-preventReClick>确定</el-button>
          <el-button size="medium" round class="length104"  @click="editShowDialog=false" >取消</el-button>
       </div>
      </div>
      </VhallDialog>
    </template>
    <!-- 同步功能 -->
    <VhallDialog
      title="提示"
      :visible.sync="dialogTongVisible"
      class="zdy-async-dialog"
      :show-close="false"
      width="400px"
    >
      <div class="async__body">
        <div class="async__ctx">
          <p>上传文件同时共享至资料管理，便于其他活动使用？</p>
          <el-checkbox v-model="sureChecked">共享到资料管理</el-checkbox>
        </div>
        <div class="async__footer">
          <el-button type="primary" size="medium" v-preventReClick @click="comfirmMaterialVideo" round>确 定</el-button>
          <el-button size="medium" v-preventReClick  @click="cancelMaterialVideo"  round>取 消</el-button>
        </div>
      </div>
    </VhallDialog>
    <begin-play :webinarId="$route.params.str"></begin-play>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import VideoPreview from '../../MaterialModule/VideoPreview/index.vue';
import selectMedia from '../selecteMedia.vue';
import beginPlay from '@/components/beginBtn';
import { sessionOrLocal } from '@/utils/utils';
import noData from '@/views/PlatformModule/Error/nullPage';
import EventBus from "@/utils/Events";
import { formateSeconds } from '@/utils/general';
import tableCellTooltip from '@/components/TableList/mixins/tableCellTooltip'
export default {
  name: 'videoSet.vue',
  mixins: [tableCellTooltip],
  data() {
    return {
      total: 0,
      // 预览
      showDialog: false,
      isSearch: false,
      errorText: false,
      isLeave: false,
      videoName: '',
      lowName: '',
      videoId: '',
      keyword: '',
      loading: true,
      editShowDialog: false,
      pageInfo: {
        pageNum: 1,
        pos: 0,
        limit: 10
      },
      webinarType: JSON.parse(sessionOrLocal.get('webinarType')),
      videoSetType: '',
      videoParam: {},
      // 表格
      tableData: [],
      checkedList: [],
      UploadSDK: null,
      uploadId: -1,
      uploadList: [],
      vm: null,
      paramsCreate: {},
      dialogTongVisible: false,
      sureChecked: true
    };
  },
  components: {
    PageTitle,
    VideoPreview,
    noData,
    selectMedia,
    beginPlay
  },
  created() {
    // 初始化聊天SDK
    // this.initChat();
    if (this.webinarType == 1) {
      this.videoSetType = 'MP3, MAV'
    } else {
      this.videoSetType = ''
    }
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
    this.webinarId = this.$route.params.str;
    this.getVideoAppid();
    this.getTableList();
    this.loading = false;
  },
  mounted() {
    EventBus.$on('waiting_sign_trans_code', res => { // 转码状态
      console.log(res, '监听到waiting_sign_trans_code未读消息提示事件');
      this.tableData.map(item => {
        if (res.waiting_id == item.id) {
          if (res.status == 1) {
            item.transcode_status = 1;
            item.duration = formateSeconds(res.duration);
            item.transcode_status_text = '转码成功';
          } else {
            item.transcode_status = 2;
            item.duration = '——';
            item.transcode_status_text = '转码失败';
          }
        }
      })
    });
  },
  methods: {
    checkSelectable(row) {
      if (row.transcode_status_text) {
        return true;
      } else {
        return false;
      }
    },
    searchTableList() {
      // if (this.keyword) {
      //   this.$vhall_paas_port({
      //     k: 100524,
      //     data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      //   })
      // }
      this.getTableList('search');
    },
    mediaSelected(val) {
      console.log(val, '1233')
      val = val.join(',')
      let params = {
        video_ids: val,
        webinar_id: this.webinarId
      }
      this.$fetch('waitingVideoFile', params).then(res=>{
        if (res.code == 200) {
          this.getTableList('search');
        }
      });
    },
    initPayMessage() {
      this.vm = this.$message({
        showClose: true,
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: '上传过程中请勿关闭或刷新浏览器',
        type: 'warning'
      });
    },
    getTableList(params){
      // let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      if (params == 'search') {
        this.pageInfo.pageNum= 1;
        this.pageInfo.pos= 0;
      }
      let formParams = {
        name: this.keyword,
        get_no_trans: 0,
        webinar_id: this.webinarId,
        ...this.pageInfo
      }
      this.isSearch = this.keyword ? true : false;
      this.getList(formParams);
    },
    tirggerFile(event){
      // this.$vhall_paas_port({
      //   k: 100518,
      //   data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      // })
      const typeList = ['rmvb','mp4','avi','wmv','mkv','flv','mov','mp3','mav'];
      const videoList = ['mp3','mav']
      let file = event.target.files[0];
      let beforeName = event.target.files[0].name.toLowerCase();
      let videoArr = beforeName.toLowerCase().split('.');
      const listType = this.webinarType == 1 ? videoList : typeList
      const videoType = listType.includes(videoArr[videoArr.length - 1]);
      if (!videoType) {
        this.$message({
          message: this.webinarType == 1 ? '音频直播仅支持上传音频文件' : '您上传的文件格式不正确',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      if (file.size > 5.3638709e9) {
        // 2147483648
        this.$message({
          message: `您上传的文件不能大于5G`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
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
      if (this.vm) {
        this.vm.close()
        this.initPayMessage()
      } else {
        this.initPayMessage()
      }
      let param = {
        create_time: this.$moment(file.lastModifiedDate).format('YYYY-MM-DD HH:mm:ss'),
        file_name: beforeName,  //后端要求名称带上后缀名  如xxx 改成 xxx.mp4
        duration: '',
        video_name: beforeName,
        file_type: `.${videoArr[videoArr.length - 1]}`,
        uploadObj: {}, // type：1   上传视频     2创建点播
        id: onlyId
      };
      console.log(param, '33333333333333333');
      this.uploadList.unshift(param);
      this.tableData.unshift(param);
      if (!this.total) {
        this.total = 1;
      }
      this.UploadSDK.upload([file],(pro)=>{
        this.tableData.forEach((ele)=>{
          if(ele.id == file.id){
            ele.uploadObj = {
              type: 1, // 上传类型
              text: '文件正在上传中',
              num: Math.floor(pro.progress*100)
            };
          }
        });
      },res=>{
        if (!this.isLeave) {
          console.log(res, '本地上传成功');
          console.log(res, 11111);
          this.vm.close()
          this.createVod(res.file);
        }
      },err=>{
        console.log(err, '失败');
        this.tableData.shift();
        this.uploadList.shift();
        this.$message({
          message: `本地上传失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    // 页码改变按钮事件
    currentChangeHandler(current) {
      this.pageInfo.pageNum = current;
      this.pageInfo.pos = parseInt((current - 1) * this.pageInfo.limit);
      this.getTableList();
    },
    comfirmMaterialVideo() {
      this.dialogTongVisible = false
      if (this.sureChecked) {
        this.waitingVideoCreate()
        this.createVideo()
      } else {
        this.waitingVideoCreate()
      }
    },
    cancelMaterialVideo() {
      this.dialogTongVisible = false
      this.waitingVideoCreate()
    },
    waitingVideoCreate() {
      this.paramsCreate.webinar_id = this.webinarId
      this.paramsCreate.paas_record_id = this.paramsCreate.paas_id
      this.$fetch('waitingVideoCreate', this.paramsCreate).then(res=>{
        this.tableData.splice(0, 1, this.uploadList);
        this.$message({
          message: `上传视频成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.getTableList();
      });
    },
    createVideo() {
      this.$fetch('createVideo', this.paramsCreate).then(res=>{
        this.$message({
          message: `视频同步资料库成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
      });
    },
    createVod(_file){
      this.paramsCreate = {}
      this.UploadSDK.createDemand({ file: _file, fileName: 'name'},(res)=>{
        this.dialogTongVisible = true
        this.paramsCreate = {
          paas_id: res.recordId,
          user_id: this.userId,
          filename: _file.name
        }
      },err=>{
        this.tableData.shift();
        this.uploadList.shift();
        this.$message({
          message: `创建音视频失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      })
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
      this.$fetch('waitingVideoList', this.$params(obj)).then(res=>{
        if(res.code == 200){
          this.total = res.data.total;
          // 转码状态:0新增排队中 1转码成功 2转码失败 3转码中
          res.data.list.forEach(ele => {
            ele.video_name = ele.name;
            ele.file_type = ele.file_type.toLowerCase();
            switch (ele.transcode_status) {
              case 0:
                ele.transcode_status_text = '转码中';
                ele.duration = '——';
                break;
              case 1:
                ele.transcode_status_text = '转码成功';
                break;
              case 2:
                ele.transcode_status_text = '转码失败';
                ele.duration = '——'
                break;
              case 3:
                ele.transcode_status_text = '转码中';
                ele.duration = '——'
                break;
              default:
                ele.transcode_status_text = '转码中';
                ele.duration = '——'
                break;
            }
          });
          this.tableData = res.data.list;
          // this.checkedList = [];
          // if(this.uploadList.length!=0){
          //   this.tableData =this.uploadList.concat(this.tableData);
          // }
        }
      }).finally(()=>{
        this.loading = false;
      });
    },
    // 编辑
    update(rows) {
      this.editShowDialog = true;
      this.errorText = false;
      this.videoName = rows.name
      this.videoId = rows.id;
      // this.$vhall_paas_port({
      //   k: 100522,
      //   data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      // })
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
      let params = {
        webinar_id: this.webinarId,
        id: this.videoId,
        name: name
      }
      this.$fetch('waitingVideoEdit', params).then(res=>{
        if (res.code == 200) {
          // this.$vhall_paas_port({
          //   k: 100521,
          //   data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
          // })
          this.editShowDialog = false;
          this.$message({
            message: `修改成功`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          this.getTableList();
        }
      });
     }
    },
    confirmDelete(id, index) {
      this.$confirm('删除后将会影响视频的演示和观看，确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        this.$fetch('waitingVideoDelete', {ids: id}).then(res=>{
          if (res.code == 200) {
            // this.$vhall_paas_port({
            //   k: index == 1 ? 100520 : 100519,
            //   data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
            // })
            this.$refs.uploads.value = null
            this.checkedList = []
            this.getTableList('search');
            this.$message({
              message: `删除成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
          }
        }).catch(res => {
          this.$message({
            message: res.msg || `删除失败`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        });
      }).catch(() => {});
    },
    del(rows) {
      this.confirmDelete(rows.id, 2);
    },
    // 批量删除
    allDelete() {
      let id = this.checkedList.join(',');
      this.confirmDelete(id, 1);
    },
    preview(rows) {
      //  this.videoParam 进本信息
      if (rows.transcode_status == 1) {
        this.showDialog = true;
        this.videoParam = rows;
        // this.$vhall_paas_port({
        //   k: 100523,
        //   data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        // })
      } else {
        this.$message.warning('只有转码成功才能查看');
      }
    },
    choiceVideo() {
       this.$refs.selecteMedia.dialogVisible = true
    },
    // operating(val){
    //   let methodsCombin = this.$options.methods;
    //   methodsCombin[val.type](this, val);
    // },
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
  beforeDestroy() {
    this.isLeave = true
    if (this.vm) {
      this.vm.close()
      this.vm = null
    }
    // if (this.UploadSDK) {
    //   this.UploadSDK.destroy()
    //   this.UploadSDK = null;
    // }
    EventBus.$off("waiting_sign_trans_code");
  }
};
</script>
<style lang="less">
 .el-tooltip__popper {
    max-width: 390px;
    // line-height: 17px;
  }
</style>
<style lang="less" scoped>
.video-list{
  width: 100%;
  .layout--right--main();
  .padding-table-list();
  .min-height();
  /deep/ .el-table__body .el-table__row td:nth-child(2) .cell{
    padding-left: 10px;
  }
  /deep/ thead tr th:nth-child(2) .cell{
    padding-left: 10px;
  }
  /deep/.el-table__row:hover{
   .el-button{
      color: #FB3A32;
    }
  }
}
// /deep/.el-input__inner{
//     padding: 0 12px;
//   }
  /deep/.el-table td{
    padding: 15px 0;
  }
  .pageBox{
    margin-top: 30px;
  }
.search-tag{
  float: right;
  width: 220px;
  /* /deep/.el-input__inner{
    border-radius: 18px;
    padding: 0 12px;
  } */
  /deep/ .el-input__icon{
    line-height: 36px;
  }
   /deep/.el-input__inner {
      border-radius: 50px;
      user-select: none;
      height: 36px;
      line-height: 36px;
      padding-right: 30px!important;
    }
    /deep/ .el-input__prefix {
      cursor: pointer;
    }
}
.videoName{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .iconfont-v3{
      font-size: 20px;
      vertical-align: middle;
    }
    .saasyinpinwenjian{
      color: #10d3a8;
      padding-right: 3px;
    }
    .saasshipinwenjian{
      color: #ff733c;
      padding-right: 3px;
    }
  }
  /deep/.el-progress-bar__inner {
   background-color: #14BA6A;
  }
  .statusTag{
    font-size: 14px;
    &::before{
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 6px;
    }
    &.wating::before{
      background:#FA9A32;
    }
    &.success::before{
      background:#14BA6A;
    }
    &.failer::before{
      background:#FB3A32;
    }
    .iconContainer {
      padding-left: 10px;
      cursor: pointer;
    }
    /deep/ .saasicon-reset {
      color: #FB3A32;
    }
  }
.video-wrap{
  height: 100%;
  width: 100%;
  .video-text{
    padding-left: 5px;
    color: #999;
    font-size: 14px;
  }
  /deep/.el-card__body{
    padding: 0 0 30px 0;
  }
  ::v-deep .el-dialog__header{
    padding-top: 24px;
    text-align: left;
  }
  ::v-deep .el-dialog__headerbtn{
    top: 30px;
  }
  ::v-deep .el-dialog--center .el-dialog__body{
    padding: 0px 10px 10px;
  }
  .vh-saas-dialog{
    /deep/ .el-dialog {
      width: 624px!important;
      background: transparent!important;
      border:none;
      box-shadow: none;
    }
    /deep/ .el-dialog__header {
      width: 642px!important;
      padding: 0px;
      height: 55px;
      background: transparent!important;
      border:none;
      color: #fff;
    }
    /deep/ .el-dialog__headerbtn{
      top: 30px;
      right:-18px;
      .el-dialog__close {
        color: #fff;
      }
    }
    /deep/ .el-dialog__body{
      width: 642px;
      height: 361px;
      border-top: 4px solid #000;
      border-bottom: 4px solid #000;
      background: #000;
      border-radius: 4px;
      padding: 0 4px;
    }
  }
  .head-operat, .no-live{
    margin-bottom: 20px;
    .head-btn{
      display: inline-block;
    }
    ::v-deep.set-upload{
      position: relative;
      cursor: pointer;
      span{
        cursor: pointer;
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
.edit-contianer{
  padding-bottom: 14px;
}
.main-edit{
  margin-bottom: 24px;
  padding-left: 20px;
  p{
    font-size: 12px;
    padding-top: 5px;
    color: #FB3A32;
  }
}
.dialog-footer{
  text-align: right;
  margin-right: 20px;
  /deep/.button.el-button.el-button--medium{
    padding: 4px 23px;
  }
}
</style>
