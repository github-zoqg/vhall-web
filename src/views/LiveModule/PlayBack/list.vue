<template>
  <div class="listBox">
    <pageTitle :title="isDemand? '点播管理' : '回放管理'"></pageTitle>
    <div v-if="!isDemand" class="operaBlock">
      <el-button size="medium" type="primary" round @click="toCreate">创建回放</el-button>
      <el-button size="medium" plain round @click="toRecord">录制</el-button>
      <el-button size="medium" round @click="settingHandler">回放设置</el-button>
      <el-button size="medium" round :disabled="selectDatas.length < 1" @click="deletePlayBack(selectDatas.map(item=>item.id).join(','))">批量删除</el-button>
      <el-input
        @keyup.enter.native="getList"
        placeholder="请输入内容标题"
        v-model="keyWords">
        <i
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="getList">
        </i>
      </el-input>
    </div>
    <div class="tableBox" v-loading="loading">
      <el-table
        ref="playBackTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="内容标题">
          <template slot-scope="scope">
            {{ scope.row.date }}
            <div class="content">
              <div class="imageBox">
                <el-image :src='scope.row.img_url'>
                  <div slot="error" class="image-slot">
                    <img @click="preview(scope.row)" :src="defaultImg" alt="">
                  </div>
                </el-image>
                <span v-if="!isDemand" class="defaultSign"><i @click="setDefault(scope.row)" :class="{active: scope.row.type == 6}"></i>默认回放</span>
              </div>
              <div class="info">
                <p class="name">{{ scope.row.name }}</p>
                <p class="create-time">{{ scope.row.created_at }}</p>
                <!-- <span class="tag">章节</span> -->
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          width="180">
          <template slot-scope="{ column, $index }" slot="header">
            <el-select v-model="recordType" @change="typeChange(column, $index)">
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
          <template slot-scope="scope">{{scope.row.source | soruceTotext}}</template>
        </el-table-column>

        <el-table-column
          label="时长"
          width="180"
          show-overflow-tooltip>
          <template slot-scope="scope">{{scope.row.duration}}</template>
        </el-table-column>

        <el-table-column
          prop="save_time"
          label="暂存至"
          width="180"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column
          label="操作"
          width="200"
          show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.date }}
            <el-button type="text" @click="editDialog(scope.row)">编辑</el-button>
            <el-button :disabled="!!scope.row.transcoding" v-if="!isDemand" type="text" @click="downPlayBack(scope.row)">{{ !!scope.row.transcoding ? '转码中' : '下载' }}</el-button>
            <el-button type="text" @click="toChapter(scope.row.id)">章节</el-button>
            <el-dropdown v-if="!isDemand" @command="handleCommand">
              <el-button type="text">更多</el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="{command: 'tailoring', data: scope.row}">剪辑</el-dropdown-item>
                <el-dropdown-item :command="{command: 'publish', data: scope.row}">发布</el-dropdown-item>
                <el-dropdown-item :command="{command: 'delete', data: scope.row}">删除</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <SPagination :total="totalElement" :page-size='pageSize' :current-page='pageNum' @current-change="currentChangeHandler" align="center"></SPagination>
    </div>
    <!-- 编辑弹窗 -->
    <el-dialog
      title="编辑内容标题"
      v-loading="editLoading"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
      width="480px">
      <el-input placeholder="请输入标题" maxlength="100" :autosize="{ minRows: 3 }" resize=none show-word-limit v-model="titleEdit" class="input-with-select" type="textarea"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmEdit" :disabled="editLoading" round size="medium">确 定</el-button>
        <el-button @click="editDialogVisible = false" :disabled="editLoading" round size="medium">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 预览功能 -->
    <template v-if="showDialog">
      <el-dialog custom-class="dialog-padding_playbackpreview" class="vh-dialog" title="预览" :visible.sync="showDialog" :before-close='closeBefore' width="30%" center>
      <video-preview ref="videoPreview" :videoParam='videoParam'></video-preview>
      </el-dialog>
    </template>
  </div>
</template>

<script>
import VideoPreview from '@/views/MaterialModule/VideoPreview/index.vue';
import PageTitle from '@/components/PageTitle';
import { sessionOrLocal } from '@/utils/utils';
export default {
  data(){
    return {
      // 预览
      showDialog: false,
      videoParam: {},
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
      isDemand: false,
      chatSDK: '',
      handleMsgTimer: '',
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
        this.videoParam = data;
      } else {
        this.$message.warning('只有转码成功才能查看');
      }
    },
    closeBefore(done){
      this.$refs.videoPreview.destroy();
      done();
    },
    // 获取当前活动基本信息 判断是点播还是直播回放
    getLiveDetail() {
      this.$fetch('getWebinarInfo', {webinar_id: this.webinar_id}).then(res=>{
        this.liveDetailInfo = res.data;
        this.isDemand = this.liveDetailInfo.is_demand == 1;
        if (this.isDemand) {
          this.typeOptions = [
            { label: '上传', value: '2' }
          ]
        } else {
          this.typeOptions = [
            { label: '来源', value: '-1' },
            { label: '回放', value: '0' },
            { label: '录制', value: '1' },
            { label: '上传', value: '2' },
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
        type: 'warning'
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
      this.keyWords && (param.name = this.keyWords)
      this.loading = true;
      this.$fetch('playBackList', param).then(res=>{
        res.data.list.forEach(item => (item.transcoding = false))
        this.tableData = res.data.list;
        this.totalElement = res.data.total;
        console.log(res);
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
        customClass: 'zdy-message-box'
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
    },
    toRecord() {
      this.$router.push({path: `/live/recordvideo/${this.webinar_id}`});
    },
    toTailoring(recordId, recordName){
      this.$router.push({path: `/videoTailoring/${this.webinar_id}`, query: {recordId, recordName}});
    },
    toChapter(recordId){
      if (this.isDemand) {
        this.$router.push({path: `/live/chapter/${this.webinar_id}`, query: {recordId, isDemand: this.isDemand}});
        return false
      }
      this.$fetch('getDocInfo', {
        record_id: recordId
      }).then(res => {
        console.log(res)
        if (res.data.doc_titles.length) {
          this.$router.push({path: `/live/chapter/${this.webinar_id}`, query: {recordId, isDemand: this.isDemand}});
        } else {
          this.$message.warning('当前回放内容未演示PPT格式的文案，不支持使用章节功能')
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
          name: recordData.name
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
          str = "打点";
          break;

        case 3:
          str = "上传";
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
    VideoPreview
  }
};
</script>

<style lang="less">
  .dialog-padding_playbackpreview{
    padding: 0px 0px 30px;
  }
</style>
<style lang="less" scoped>
  .listBox{
    min-width: 1020px;
  }
  .tableBox{
    padding: 32px 24px;
    background: #fff;
    /deep/ .cell{
      color: #666;
    }
    .el-table{
      margin-bottom: 40px;
    }
  }
  /deep/ .el-table__header{
    th{
      background: #F7F7F7;
    }
  }
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
  }
  .input-with-select{
    vertical-align: text-top;
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
