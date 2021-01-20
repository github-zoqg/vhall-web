<template>
  <div class="listBox">
    <pageTitle :title="title"></pageTitle>
    <div class="noData" v-if="no_show === true">
      <null-page text="暂未创建回放" nullType="noAuth">
        <el-button class="length152" round type="primary" @click="toCreate">创建回放</el-button>
        <el-button class="length152 recordbtn" round type="white-primary" @click="toRecord">录制</el-button>
        <!-- <el-button type="white-primary" class="length152" round @click="openCheckWord" v-if="$route.params.str">资料库</el-button> -->
      </null-page>
    </div>
    <template v-if="no_show === false">
      <div v-if="!isDemand" class="operaBlock">
        <el-button size="medium" type="primary" round @click="toCreate">创建回放</el-button>
        <el-button size="medium" plain round @click="toRecord">录制</el-button>
        <el-button size="medium" round @click="settingHandler">回放设置</el-button>
        <el-button size="medium" round :disabled="selectDatas.length < 1" @click="deletePlayBack(selectDatas.map(item=>item.id).join(','))">批量删除</el-button>
        <VhallInput
          clearable
          @keyup.enter.native="getList"
          placeholder="请输入内容标题"
          autocomplete="off"
          class="resetRightBrn"
          @clear="getList"
          v-model="keyWords">
          <i
            class="el-icon-search el-input__icon"
            slot="suffix"
            @click="getList">
          </i>
        </VhallInput>
      </div>
      <div class="tableBox" v-loading="loading">
        <el-table
          :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
          v-if="isDemand !== ''"
          ref="playBackTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            v-if="!isDemand"
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            width="430"
            label="内容标题">
            <template slot-scope="scope">
              {{ scope.row.date }}
              <div class="content">
                <div class="imageBox">
                  <img @click="preview(scope.row)" :src="scope.row.img_url" alt="" style="cursor: pointer">
                  <span v-if="!isDemand" class="defaultSign"><i @click="setDefault(scope.row)" :class="{active: scope.row.type == 6}"></i>默认回放</span>
                </div>
                <div class="info">
                  <p class="name">{{ scope.row.name }}</p>
                  <p class="create-time">{{ scope.row.created_at }}</p>
                  <span v-if="scope.row.doc_status" class="tag">章节</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column width="120">
            <template slot-scope="{ column, $index }" slot="header">
              <el-select v-if="!isDemand" v-model="recordType" @change="typeChange(column, $index)">
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <span v-else>视频来源</span>
            </template>
            <span class="playpackSource" slot-scope="scope">{{scope.row.source | soruceTotext}}</span>
          </el-table-column>

          <el-table-column
            label="时长"
            show-overflow-tooltip>
            <span class="playpackSource" slot-scope="scope">{{scope.row.duration}}</span>
          </el-table-column>

          <el-table-column
            v-if="!isDemand"
            label="暂存至"
            show-overflow-tooltip>
            <span class="playpackSource" slot-scope="scope">{{scope.row.save_time}}</span>
          </el-table-column>

          <el-table-column
            width="176"
            label="操作"
            show-overflow-tooltip
            align="left"
          >
            <template slot-scope="scope">
              {{ scope.row.date }}
              <el-button type="text" @click="editDialog(scope.row)">编辑</el-button>
              <el-button :disabled="!!scope.row.transcoding" v-if="scope.row.source != 2" type="text" @click="downPlayBack(scope.row)">{{ !!scope.row.transcoding ? '转码中' : '下载' }}</el-button>
              <el-button type="text" @click="toChapter(scope.row)">章节</el-button>
              <el-dropdown v-if="!isDemand" @command="handleCommand">
                <el-button type="text">更多</el-button>
                <el-dropdown-menu style="width: 160px;" slot="dropdown">
                  <el-dropdown-item :command="{command: 'tailoring', data: scope.row}">剪辑</el-dropdown-item>
                  <el-dropdown-item :command="{command: 'publish', data: scope.row}">发布</el-dropdown-item>
                  <el-dropdown-item :command="{command: 'delete', data: scope.row}">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <SPagination
          v-show="totalElement > pageSize"
          :total="totalElement"
          :page-size='pageSize'
          :current-page='pageNum'
          @current-change="currentChangeHandler"
          align="center"
        ></SPagination>
        <null-page text="未搜索到相关内容" nullType="search" v-if="totalElement === 0"></null-page>
      </div>
    </template>

    <!-- 编辑弹窗 -->
    <el-dialog
      title="编辑内容标题"
      v-loading="editLoading"
      :visible.sync="editDialogVisible"
      :close-on-click-modal=false
      :close-on-press-escape=false
      width="480px">
      <VhallInput
        placeholder="请输入标题"
        :maxlength="100"
        autocomplete="off"
        :autosize="{ minRows: 3 }"
        resize=none
        show-word-limit
        v-model="titleEdit"
        class="input-with-select"
        type="textarea"
      >
      </VhallInput>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmEdit" :disabled="editLoading" round size="medium">确定</el-button>
        <el-button @click="editDialogVisible = false" :disabled="editLoading" round size="medium">取消</el-button>
      </span>
    </el-dialog>
    <!-- 预览功能 -->
    <template v-if="showDialog">
      <el-dialog custom-class="dialog-padding_playbackpreview" class="vh-dialog" :visible.sync="showDialog" width="1010px" :before-close='closeBefore' center
      :close-on-click-modal=false
      :close-on-press-escape=false>
      <video-preview ref="videoPreview" :recordId='videoParamId' :webinarId="webinar_id"></video-preview>
      </el-dialog>
    </template>
    <begin-play :webinarId="$route.params.str" v-if="webinarState!=4"></begin-play>
  </div>
</template>

<script>
import VideoPreview from './components/previewVideo';
import PageTitle from '@/components/PageTitle';
import { sessionOrLocal } from '@/utils/utils';
import NullPage from '../../PlatformModule/Error/nullPage.vue';
import beginPlay from '@/components/beginBtn';
export default {
  data(){
    return {
      // 预览
      showDialog: false,
      webinarState: JSON.parse(sessionOrLocal.get("webinarState")),
      videoParamId: '',
      tableData: [],
      defaultImg: require('../../../common/images/v35-webinar.png'),
      keyWords: '',
      pageSize: 10,
      pageNum: 1,
      loading: false,
      totalElement: 0,
      editDialogVisible: false,
      titleEdit: '',
      editRecord: {},
      editLoading: false,
      selectDatas: [],
      transcodingArr: [],
      recordType: '-1',
      liveDetailInfo: {},
      isDemand: '',
      chatSDK: '',
      handleMsgTimer: '',
      no_show: '',
      typeOptions: [
        { label: '来源', value: '-1' },
        { label: '回放', value: '0' },
        { label: '录制', value: '1' },
        { label: '上传', value: '2' },
        { label: '打点录制', value: '3' }
      ]
    };
  },
  computed: {
    pos(){
      return (this.pageNum - 1) * this.pageSize;
    },
    webinar_id(){
      return this.$route.params.str;
    },
    title(){
      if (this.isDemand === '') {
        return ''
      } else if (this.isDemand) {
        return '点播管理'
      } else {
        return '回放管理'
      }
    }
  },
  created(){
    this.getInitMsgInfo();
    this.getList();
    this.getLiveDetail();
  },
  mounted(){
    this.tipMsg = this.$message({
      dangerouslyUseHTMLString: true,
      message: '<span class="msgGray">非默认回放暂存15天。</span><a href="http://webim.qiao.baidu.com/im/index?siteid=113762&ucid=2052738" target="_blank" class="msgBlue">开通点播服务</a>',
      showClose: true,
      duration: 0
    });
  },
  beforeDestroy(){
    this.tipMsg.close();
    if (this.chatSDK) {
      this.chatSDK.destroy()
      this.chatSDK = null
    }
  },
  methods: {
    preview(data) {
      //  this.videoParam 进本信息
      if (data.transcode_status == 1) {
        this.showDialog = true;
        this.videoParamId = data.id;
      } else {
        this.$message.warning('只有转码成功才能查看');
      }
    },
    closeBefore(done){
      // this.$refs.videoPreview.destroy();
      done();
    },
    // 获取当前活动基本信息 判断是点播还是直播回放
    getLiveDetail() {
      this.$fetch('getWebinarInfo', {webinar_id: this.webinar_id}).then(res=>{
        this.liveDetailInfo = res.data;
        this.isDemand = this.liveDetailInfo.is_demand == 1;
        if (this.isDemand) {
          this.recordType = '上传'
          this.typeOptions = [
            { label: '上传', value: '2' }
          ]
        } else {
          this.typeOptions = [
            { label: '来源', value: '-1' },
            { label: '回放', value: '0' },
            { label: '录制', value: '1' },
            { label: '打点录制', value: '3' }
          ]
        }
      }).catch(error=>{
        this.$message.error(`获取信息失败,${error.errmsg || error.message}`);
        console.log(error);
      }).finally(()=>{
        this.loading = false;
      });
    },
    typeChange(column, index) {
      this.getList()
    },
    setDefault(row) {
      const confirmTitle = row.type === 6 ? '取消默认回放后，回放将不能观看' : '设置为默认回放后，将无法进行预约'
      this.$confirm(confirmTitle, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        this.$fetch('defaultRecord', {
          webinar_id: this.webinar_id,
          record_id: row.id,
          type: row.type === 6 ? 0 :1
        }).then(res => {
          console.log(res)
          // TODO: 刷新列表
          this.getList()
        })
      })
    },
    handleSelectionChange(val){
      this.selectDatas = val;
    },
    handleCommand(param){
      if(param.command == 'delete'){
        this.deletePlayBack(param.data.id);
      }else if(param.command == 'tailoring'){
        this.toTailoring(param.data.id, param.data.name);
      } else if (param.command == 'publish') {
        this.toCreateDemand(param.data);
      }
    },
    currentChangeHandler(num){
      this.pageNum = num;
      this.getList();
    },
    getList(){
      let param = {
        webinar_id: this.webinar_id,
        user_id: window.sessionStorage.getItem('userId'),
        pos: this.pos,
        limit: this.pageSize,
        source: this.recordType,
      };
      param.source == '上传' && (param.source = -1)
      this.keyWords && (param.name = this.keyWords)
      this.loading = true;
      this.$fetch('playBackList', param).then(res=>{
        res.data.list.forEach(item => (item.transcoding = false))
        this.tableData = res.data.list;
        this.totalElement = res.data.total;
        if(this.no_show === '') {
          this.no_show = res.data.total == 0 ? true : false
        }
      }).catch(error=>{
        this.$message.error(`获取回放列表失败，${error.msg || error.message}`);
      }).finally(()=>{
        this.loading = false;
      });
      // playBackList
    },
    editDialog(data){
      this.titleEdit = data.name;
      this.editDialogVisible = true;
      this.editRecord = data;
    },
    // 初始化消息
    getInitMsgInfo() {
      this.$fetch('msgInitConsole').then(res => {
        this.initChat(res.data);
      })
    },
    initChat (params) {
      let opt = {
        appId: params.paasAppId,
        accountId: params.accountId,
        channelId: params.channelId,
        token: params.paasAccessToken
      };
      VhallChat.createInstance(
        opt,
        chat => {
          this.chatSDK = chat.message;
          console.log('成功了居然', this.chatSDK)
          // TODO: 监听消息,判断 userId 获取playbackInfo
          // 自定义消息
          this.chatSDK.onCustomMsg(msg => {
            if (typeof msg !== 'object') {
              msg = JSON.parse(msg);
            }
            try {
              if (msg.data && typeof msg.data !== 'object') {
                msg.data = JSON.parse(msg.data);
              }
            } catch (e) {
              console.log(e);
            }

            Object.assign(msg, msg.data);
              console.log('==========自定义消息==========', msg)
            if (msg.type == "record_download" && msg.user_id == sessionOrLocal.get('userId')) {
              console.log('视频转码完成了')
              // 消息会下发三次，只处理第一次
              if (!this.handleMsgTimer) {
                this.transcodingArr = this.transcodingArr.filter(item => {
                  if(item.id == msg.data.record_id) {
                    item.transcoding = false;
                    return false;
                  }
                })
                window.open(msg.data.download_url)
                this.handleMsgTimer = setTimeout(() => {
                  this.handleMsgTimer = ''
                }, 2000)
              }
            }
          })
        },
        err => {
          console.error('聊天SDK实例化失败', err);
        }
      )
    },
    // 下载回放
    downPlayBack(data) {
      console.log(data);
      this.$fetch('playBackDownUrlGet', {
        record_id: data.id
      }).then(res => {
        console.log(res)
        if (res.data.has_download_url == 0) {
          data.transcoding = true;
          this.transcodingArr.push(data);
          this.$message.success('正在转码，请稍等...');
          return false;
        }
        window.open(res.data.download_url);
      })
    },
    deletePlayBack(ids){
      this.$confirm('删除回放会导致目前已生成回放的数据丢失，请谨慎操作，确定要删除这段回放么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        this.loading = true;
        this.$fetch('playBackDelete', { record_ids: ids}).then(res=>{
          if(res.code === 200){
            this.$message.success('已删除');
            this.getList();
          }else{
            this.$message.error(`删除失败，${res.msg}`);
          }
        }).catch(error=>{
          this.$message.error(`删除失败，${error.msg || error.message}`);
          this.loading = false;
        });
      }).catch(() => {});

    },
    confirmEdit(){
      if(!this.titleEdit.trim()) return this.$message.error('请输入标题');
      this.editLoading =true;
      this.$fetch('playBackEdit', { record_id: this.editRecord.id, name: this.titleEdit}).then(res=>{
        if(res.code === 200){
          this.$message.success('修改成功');
          this.getList();
          this.editDialogVisible = false;
        }else{
          this.$message.error(`修改失败，${res.msg}`);
        }

      }).catch(error=>{
        this.$message.error(`修改失败，${error.msg || error.message}`);
      }).finally(()=>{
        this.editLoading = false;
      });
    },
    settingHandler(){
      this.$router.push({path: `/live/planFunction/${this.webinar_id}`});
    },
    toCreate() {
      this.$router.push({path: `/videoTailoring/${this.webinar_id}`});
      // const routeData = this.$router.resolve({path: `/videoTailoring/${this.webinar_id}`});
      // window.open(routeData.href, '_blank');
    },
    toRecord() {
      this.$fetch('recordCheck', {
        webinar_id: this.webinar_id
      }).then(res => {
        if (res.code == 200) {
          // this.$router.push({path: `/live/recordvideo/${this.webinar_id}`});
          window.location.href = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/lives/recordvideo/${this.webinar_id}`;
        }
      }).catch(err => {
        if (err.code == 12550) {
          this.$message.warning('该活动正在直播或录制中，无法重复发起')
        } else {
          this.$message.warning(err.msg)
        }
      })
    },
    toTailoring(recordId, recordName){
      this.$router.push({path: `/videoTailoring/${this.webinar_id}`, query: {recordId, recordName}});
      // const routeData = this.$router.resolve({path: `/videoTailoring/${this.webinar_id}`, query: {recordId, recordName}});
      // window.open(routeData.href, '_blank');
    },
    toChapter(row){
      const recordId = row.id
      const chapterType = this.isDemand ? 'recordchapter' : 'chapter'
      // 如果回放转码完成，并且支持章节功能或者是点播活动，直接跳转
      if (this.isDemand || (row.transcode_status == 1 && row.doc_status)) {
        this.$router.push({path: `/live/${chapterType}/${this.webinar_id}`, query: {recordId, isDemand: this.isDemand}});
        return false
      }
      // 如果回放未转码完成，点击的时候需要获取最新的转码状态和是否支持章节功能
      this.$fetch('recordInfo', {
        record_id: recordId
      }).then(res => {
        if (res.data.transcode_status == 0 || res.data.transcode_status == 3) {
          this.$message({
            message:  '视频转码中，请稍后再试',
            showClose: true, // 是否展示关闭按钮
            type: 'warning', //  提示类型
            customClass: 'zdy-info-box' // 样式处理
          });
        } else if (res.data.transcode_status == 2){
          this.$message({
            message:  '视频转码失败',
            showClose: true, // 是否展示关闭按钮
            type: 'error', //  提示类型
            customClass: 'zdy-info-box' // 样式处理
          });
        } else {
          this.$fetch('getDocInfo', {
            record_id: recordId
          }).then(res => {
            console.log(res)
            if (res.data.doc_titles.length) {
              this.$router.push({path: `/live/${chapterType}/${this.webinar_id}`, query: {recordId, isDemand: this.isDemand}});
            } else {
              this.$message({
                message:  '当前回放内容未演示PPT格式的文档，不支持使用章节功能',
                showClose: true, // 是否展示关闭按钮
                type: 'warning', //  提示类型
                customClass: 'zdy-info-box' // 样式处理
              });
            }
          })
        }
      })
    },
    // 发布
    toCreateDemand(recordData) {
      this.$router.push({
        path: `/live/vodEdit`,
        query: {
          record_id: recordData.id,
          paas_record_id: recordData.paas_record_id,
          name: recordData.name,
          webinar_id: this.webinar_id
        }
      });
    }
  },
  filters: {
    secondsFormmat(val){
      val = Number(val);
      if(isNaN(val)) return val;
      const hours = parseInt(val/3600);
      const minutes = parseInt(val/60) - (hours*60);
      const seconds = val % 60;
      return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    },
    soruceTotext(val){
      //  0回放 1录制 2打点 3上传
      val = Number(val);
      let str = val;
      switch (val) {
        case 0:
          str = "回放";
          break;

        case 1:
          str = "录制";
          break;

        case 2:
          str = "上传";
          break;

        case 3:
          str = "打点";
          break;

        default:
          str = val;
          break;
      }
      return str;
    }
  },
  components: {
    PageTitle,
    VideoPreview,
    NullPage,
    beginPlay
  }
};
</script>

<style lang="less" scoped>
  .listBox{
    /deep/ .dialog-footer {
      .el-button {
        padding: 4px 23px;
      }
    }
    /deep/ .el-textarea__inner {
      font-family: PingFangSC-Regular, PingFang SC;
    }
    .btn-list .el-button:last-child {
      margin-right: 0;
      margin-left: 0;
    }
    min-width: 1020px;
    .noData {
      /deep/.recordbtn {
        background: transparent;
        border-color: #ccc;
        color: #666;
        &:hover {
          background: #FB3A32;
          border: 1px solid #FB3A32;
        }
        &:active {
          background: #E2332C;
          border: 1px solid #E2332C;
        }
        &.is-disabled {
          border: 1px solid #E6E6E6;
          background: transparent;
          color: #B3B3B3;
          &:hover,&:active {
            background: transparent;
          }
        }
      }
    }
  }
  .tableBox{
    padding: 32px 24px;
    background: #fff;
    /deep/ .el-table__empty-block {
      display: none;
    }
    /deep/ .cell{
      color: #666;
    }
    .el-table{
      margin-bottom: 40px;
    }
    .playpackSource{
      color: #1a1a1a;
    }
    /deep/ thead .el-select {
      .el-input__inner {
        border: none;
        color: #666;
        padding-left: 0;
      }
      .el-input__suffix {
        .el-icon-arrow-up {
          color: #666;
          line-height: 36px;
          // height: 14px;
        }
      }
    }
  }
  /* /deep/ .el-table__header{
    th{
      background: #F7F7F7;
    }
  } */
  .el-dropdown{
    margin-left: 10px;
  }
  .content{
    .imageBox{
      position: relative;
      float: left;
      width: 160px;
      height: 90px;
      .defaultSign{
        position: absolute;
        bottom: 0;
        right: 0;
        width: 80px;
        height: 22px;
        background: rgba(0,0,0,.6);
        border-radius: 12px 0px 4px 0px;
        color: #fff;
        font-size: 12px;
        padding-left: 8px;
        i{
          display: inline-block;
          width: 12px;
          height: 12px;
          border-radius: 8px;
          border: 1px solid #FFFFFF;
          margin-right: 4px;
          margin-bottom: -2px;
          cursor: pointer;
          &.active{
            border: 3px solid #FB3A32;
            background: #fff;
          }
        }
        // opacity: 0.66;
      }
      .image-slot img {
        cursor: pointer;
      }
    }
    .info{
      margin-left: 12px;
      font-size: 14px;
      width: 222px;
      color: #1A1A1A;
      float: left;
      .name{
        line-height: 20px;
        height: 40px;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        -webkit-line-clamp: 2; /** 显示的行数 **/
        overflow: hidden;  /** 隐藏超出的内容 **/
      }
      .create-time{
        padding-top: 5px;
      }
      .tag{
        display: inline-block;
        width: 40px;
        height: 20px;
        line-height: 20px;
        background: #EBEFFF;
        border-radius: 14px;
        font-size: 12px;
        text-align: center;
        color: #3562FA;
      }
    }
    img{
      width: 100%;
      height: 100%;
      border-radius: 6px;
    }
  }
  .operaBlock{
    margin-bottom: 20px;
    .el-button.el-button--medium.el-button--default {
      background: transparent;
      &:hover {
        background: #FB3A32;
        border: 1px solid #FB3A32;
      }
      &:active {
        background: #E2332C;
        border: 1px solid #E2332C;
      }
      &.is-disabled {
        border: 1px solid #E6E6E6;
        background: transparent;
        color: #B3B3B3;
        &:hover,&:active {
          background: transparent;
        }
      }
    }
    .el-input{
      width: 220px;
      float: right;
      /deep/ .el-input__inner{
        border-radius: 20px;
        height: 36px;
      }
      /deep/ .el-input__suffix{
        cursor: pointer;
        /deep/ .el-input__icon{
          line-height: 36px;
        }
      }
    }
    .resetRightBrn {
      /deep/ .el-input__inner {
        border-radius: 20px;
        height: 36px;
        padding-right: 50px!important;
      }

      /deep/ .el-input__suffix {
        cursor: pointer;

        /deep/ .el-input__icon {
          width: auto;
          margin-right: 5px;
          line-height: 36px;
        }
      }
    }
  }
  .input-with-select{
    vertical-align: text-top;
  }
  /deep/ .dialog-padding_playbackpreview{
    padding: 0px 0px 30px;
    background: transparent!important;
    border: none;
    box-shadow: none;
    .el-dialog__headerbtn {
      top: 24px;
      margin-bottom: 8px;
      .el-dialog__close {
        color: #FFFFFF;
      }
    }
  }
</style>
<style lang="less">
  .msgGray{
    color: #1A1A1A;
  }
  .msgBlue{
    color: #3562FA;
  }
</style>
