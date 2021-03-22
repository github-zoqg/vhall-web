<template>
  <div class="listBox">
    <pageTitle :pageTitle="title"></pageTitle>
    <div class="noData" v-if="no_show === true">
      <null-page text="暂未创建回放" nullType="noAuth">
        <el-button class="length152" round type="primary" @click="toCreate">创建回放</el-button>
        <el-button v-if="WEBINAR_PES.btn_record" class="length152 transparent-btn" round type="white-primary" @click="toRecord">录制</el-button>
        <!-- <el-button type="white-primary" class="length152" round @click="openCheckWord" v-if="$route.params.str">资料库</el-button> -->
      </null-page>
    </div>
    <template v-if="no_show === false">
      <div v-if="!isDemand" class="operaBlock">
        <el-button size="medium" type="primary" round @click="toCreate">创建回放</el-button>
        <el-button v-if="WEBINAR_PES.btn_record"  class="transparent-btn" size="medium" plain round @click="toRecord">录制</el-button>
        <el-button size="medium"  class="transparent-btn" round @click="settingHandler">回放设置</el-button>
        <el-button size="medium" class="transparent-btn" round :disabled="selectDatas.length < 1" @click="deletePlayBack(selectDatas.map(item=>item.id).join(','))">批量删除</el-button>
        <VhallInput
          clearable
          @keyup.enter.native="getList"
          placeholder="请输入内容标题"
          autocomplete="off"
          v-clearEmoij
          class="resetRightBrn"
          @clear="getList"
          v-model="keyWords">
          <i
            class="el-icon-search el-input__icon"
            slot="prefix"
            @click="getList">
          </i>
        </VhallInput>
      </div>
      <div :class="['tableBox', isDemand === true ? '' : 'recordTableBox']" v-loading="loading">
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
            :width="isBidScreen ? 55 : 52">
          </el-table-column>
          <el-table-column
            :width="isDemand === true ? 375 : 365"
            label="内容标题">
            <template slot-scope="scope">
              {{ scope.row.date }}
              <div class="content">
                <div class="imageBox">
                  <div class="imageWrap" v-if="scope.row.transcode_status != 1">

                    <p v-if="scope.row.transcode_status == 2" class="statusDesc" @click="reTranscode(scope.row)">转码失败</p>
                    <p v-else class="statusDesc">{{ scope.row.transcode_status == 0 || scope.row.transcode_status == 3 ? '生成中...' : '' }}</p>
                  </div>
                  <img @click="preview(scope.row)" :src="scope.row.img_url" alt="" style="cursor: pointer">
                  <span v-if="!isDemand" class="defaultSign"><i @click="setDefault(scope.row)" :class="{active: scope.row.type == 6}"></i>默认回放</span>
                </div>
                <div class="info">
                  <p class="name">{{ scope.row.name }}</p>
                  <p class="create-time">{{ scope.row.created_at }}</p>
                  <span v-if="scope.row.doc_status && WEBINAR_PES['ui.record_chapter']" class="tag">章节</span>
                  <span v-if="scope.row.layout != 0" class="tag">重制</span>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column :width="recordType != 3 && recordType != -1 ? 78 : 106">
            <template slot-scope="{ column, $index }" slot="header">
              <el-select popper-class="playback-list-popper" v-if="!isDemand" v-model="recordType" @change="typeChange(column, $index)">
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
            :width="isBidScreen ? '' : 91"
            show-overflow-tooltip>
            <span class="playpackSource" slot-scope="scope">{{scope.row.duration}}</span>
          </el-table-column>

          <el-table-column
            label="布局"
            :width="isBidScreen ? '' : 78"
            show-overflow-tooltip>
            <span class="playpackSource" slot-scope="scope">{{scope.row.layout | layoutFilter}}</span>
          </el-table-column>

          <el-table-column
            v-if="!isDemand"
            label="暂存至"
            :width="isBidScreen ? '' : 108"
            show-overflow-tooltip>
            <span class="playpackSource" slot-scope="scope">{{scope.row.save_time}}</span>
          </el-table-column>

          <el-table-column
            :width="isBidScreen ? 190 : 176"
            label="操作"
            align="left"
          >
            <template slot-scope="scope">
              {{ scope.row.date }}
              <el-button type="text" @click="editDialog(scope.row)">编辑</el-button>
              <el-button v-if="scope.row.source != 2" type="text" @click="downPlayBack(scope.row)">下载</el-button>
              <el-button v-if="WEBINAR_PES['ui.record_chapter'] &&  !scope.row.layout" type="text" @click="toChapter(scope.row)">章节</el-button>
              <el-dropdown v-if="!isDemand" @command="handleCommand">
                <el-button type="text">更多</el-button>
                <el-dropdown-menu style="width: 160px;" slot="dropdown">
                  <el-dropdown-item v-if="WEBINAR_PES['reset_record'] && !scope.row.layout" :command="{command: 'vodreset', data: scope.row}">重制</el-dropdown-item>
                  <el-dropdown-item :command="{command: 'tailoring', data: scope.row}">剪辑</el-dropdown-item>
                  <el-dropdown-item v-if="WEBINAR_PES['publish_record']" :command="{command: 'publish', data: scope.row}">发布</el-dropdown-item>
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
      title="编辑"
      v-loading="editLoading"
      :visible.sync="editDialogVisible"
      :close-on-click-modal=false
      :close-on-press-escape=false
      width="480px">
      <VhallInput
        placeholder="请输入标题"
        :maxlength="100"
        autocomplete="off"
        v-clearEmoij
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
import EventBus from "@/utils/Events";
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
        { label: '全部来源', value: '-1' },
        { label: '回放', value: '0' },
        { label: '录制', value: '1' },
        { label: '上传', value: '2' },
        { label: '打点录制', value: '3' }
      ],
      // 权限配置
      WEBINAR_PES: {},
      isBidScreen: false,
      versionExpired: false, // 用户套餐是否过期
      // WEBINAR_PES: sessionOrLocal.get('WEBINAR_PES', 'localStorage') && JSON.parse(sessionOrLocal.get('WEBINAR_PES', 'localStorage')) || {},
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
    this.getList();
    this.getLiveDetail();
    EventBus.$on('record_download', this.handleDownload)
    this.getPermission(this.$route.params.str)
    this.calcScreenWidth()
    this.getVersion()
  },
  mounted(){
    window.addEventListener('resize', this.calcScreenWidth)
  },
  beforeDestroy(){
    if (!this.WEBINAR_PES['forbid_delrecord'] || !this.WEBINAR_PES['publish_record']) {
      this.tipMsg && this.tipMsg.close();
    }
    if (this.chatSDK) {
      this.chatSDK.destroy()
      this.chatSDK = null
    }
    EventBus.$off('record_download', this.handleDownload)
    window.removeEventListener('resize', this.calcScreenWidth)
  },
  methods: {
    getVersion() {
      const userId = JSON.parse(sessionOrLocal.get("userId"));
      this.$fetch('getVersionInfo', { user_id: userId}).then(res => {
        this.versionExpired = res.data.expired == 1;
      }).catch(e=>{
        console.log(e);
      });
    },
    calcScreenWidth() {
      const clientWidth = document.body.clientWidth
      if (clientWidth < 1920) {
        this.isBidScreen = false
      } else {
        this.isBidScreen = true
      }
    },
    handleTipMsgVisible() {
      if (!this.WEBINAR_PES['forbid_delrecord']) {
        this.tipMsg = this.$message({
          dangerouslyUseHTMLString: true,
          message: `
            ${this.WEBINAR_PES['forbid_delrecord'] ? '' : '<span class="msgGray">非默认回放暂存15天</span>'}
            ${!this.WEBINAR_PES['forbid_delrecord'] && !this.WEBINAR_PES['publish_record'] ? '，' : ''}
            ${this.WEBINAR_PES['publish_record'] ? "" : "<a href='http://webim.qiao.baidu.com/im/index?siteid=113762&ucid=2052738' target='_blank' class='msgBlue'>开通点播服务</a>"}
          `,
          showClose: true,
          duration: 0
        });
      }
    },
    getPermission(id) {
      let userId = JSON.parse(sessionOrLocal.get('userId'));
      // 活动权限
      this.$fetch('planFunctionGet', {webinar_id: id, webinar_user_id: userId, scene_id: 1}).then(res => {
        if(res.code == 200) {
          if(res.data.permissions) {
            sessionOrLocal.set('WEBINAR_PES', res.data.permissions, 'localStorage');
            this.WEBINAR_PES = JSON.parse(res.data.permissions)
            this.handleTipMsgVisible()
          } else {
            sessionOrLocal.removeItem('WEBINAR_PES');
          }
        }
      }).catch(e => {
        console.log(e);
        sessionOrLocal.removeItem('SAAS_VS_PES');
      });
    },
    preview(data) {
      //  this.videoParam 进本信息
      if (data.transcode_status == 1) {
        this.showDialog = true;
        this.videoParamId = data.id;
      } else {
        this.$message.warning('只有转码成功才能查看');
      }
    },
    reTranscode(data) {
      if (data.transcode_status == 2 && data.layout != 0) {
        this.$message({
          message: `检测到当前视频未演示文档导致课件重制功能无法正常使用，请使用其他视频`,
          showClose: true,
          type: 'error',
          customClass: 'zdy-info-box'
        })
        return false
      }
      this.$fetch('recordReTranscode', {
        paas_record_id: data.paas_record_id,
        webinar_id: this.webinar_id
      }).then(res => {
        this.$message({
          message: `正在重新生成，请稍后...`,
          showClose: true,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.getList()
      })
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
            { label: '全部来源', value: '-1' },
            { label: '回放', value: '0' },
            { label: '录制', value: '1' },
            { label: '打点录制', value: '3' }
          ]
        }
      }).catch(res=>{
        this.$message({
          message: res.msg || `获取活动信息失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
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
      } else if (param.command == 'vodreset') {
        this.toVodreset(param.data)
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
      }).catch(res=>{
        this.$message({
          message: res.msg || `获取回放列表失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
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
    handleDownload(data) {
      console.log('视频转码完成了')
      // 消息会下发三次，只处理第一次
      if (!this.handleMsgTimer) {
        this.transcodingArr = this.transcodingArr.filter(item => {
          if(item.id == data.record_id) {
            item.transcoding = false;
            return false;
          }
        })
        window.open(data.download_url)
        this.handleMsgTimer = setTimeout(() => {
          this.handleMsgTimer = ''
        }, 2000)
      }
    },
    // 下载回放
    downPlayBack(data) {
      const fetchCb = () => {
        this.$fetch('playBackDownUrlGet', {
          record_id: data.id
        }).then(res => {
          console.log(res)
          if (res.data.has_download_url == 0) {
            data.transcoding = true;
            this.transcodingArr.push(data);
            this.$message({
              message: `正在转码，请稍侯...`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            return false;
          }
          window.open(res.data.download_url);
        })
      }
      this.checkTransStatus(data.id, fetchCb)
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
          this.$message({
            message: `已删除`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          this.getList();
        }).catch(res=>{
          this.$message({
            message: res.msg ||  `删除失败`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          this.loading = false;
        });
      }).catch(() => {});

    },
    confirmEdit(){
      if(!this.titleEdit.trim()) return this.$message({
          message: `请输入标题`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      this.editLoading =true;
      this.$fetch('playBackEdit', { record_id: this.editRecord.id, name: this.titleEdit}).then(res=>{
        this.$message({
          message: `修改成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.getList();
        this.editDialogVisible = false;
      }).catch(res=>{
        this.$message({
          message: res.msg ||  `修改失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      }).finally(()=>{
        this.editLoading = false;
      });
    },
    settingHandler(){
      this.$router.push({path: `/live/planFunction/${this.webinar_id}`});
    },
    toVodreset(data) {
      if (this.versionExpired) {
        this.$confirm('尊敬的用户，您的账号已到期。为了保证正常使用，请联系您的客户经理或专属售后，也可拨打400-888-9970转2咨询', '提示', {
          confirmButtonText: '我知道了',
          // cancelButtonText: '暂不关闭',
          showCancelButton: false,
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {}).catch(() => {});
        return false
      }
      const routerPush = () => {
        this.$router.push({
          path: `/live/vodreset/${this.webinar_id}`,
          query: {
            paas_record_id: data.paas_record_id
          }
        });
      }
      this.checkTransStatus(data.id, routerPush)
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
      const routerPush = () => {
        this.$router.push({path: `/videoTailoring/${this.webinar_id}`, query: {recordId, recordName}});
      }
      this.checkTransStatus(recordId, routerPush)
    },
    checkTransStatus(recordId, cb) {
      this.$fetch('recordInfo', {
        record_id: recordId
      }).then(res => {
        if (res.data.transcode_status == 0 || res.data.transcode_status == 3) {
          this.$message({
            message:  '视频生成中，请在成功后使用',
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
          cb && cb()
        }
      })
    },
    async toChapter(row){
      const recordId = row.id
      const chapterType = this.isDemand ? 'recordchapter' : 'chapter'
      // 如果回放转码完成，并且支持章节功能或者是点播活动，直接跳转
      if (this.isDemand || (row.transcode_status == 1 && row.doc_status)) {
        await this.checkChapterSave(recordId, chapterType)
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
              this.checkChapterSave(recordId, chapterType)
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
    checkChapterSave(recordId, chapterType) {
      return this.$fetch('checkChapterSave', {
        record_id: recordId
      }).then(res => {
        if (res.data && res.data.chatper_callbanck_status == 0) {
          this.$message({
            message:  '当前视频与文档正在关联中，请稍后再试',
            showClose: true, // 是否展示关闭按钮
            type: 'warning', //  提示类型
            customClass: 'zdy-info-box' // 样式处理
          });
        } else {
          this.$router.push({path: `/${chapterType}/${this.webinar_id}`, query: {recordId, isDemand: this.isDemand}});
          // const routeData = this.$router.resolve({path: `/${chapterType}/${this.webinar_id}`, query: {recordId, isDemand: this.isDemand}});
          // window.open(routeData.href, '_blank');
        }
      })
    },
    // 发布
    toCreateDemand(recordData) {
      const routerPush = () => {
        this.$router.push({
          path: `/live/vodEdit`,
          query: {
            record_id: recordData.id,
            paas_record_id: recordData.paas_record_id,
            name: recordData.name,
            webinar_id: this.webinar_id
          }
        })
      }
      this.checkTransStatus(recordData.id, routerPush)
    }
  },
  filters: {
    layoutFilter: function(layout) {
      if(layout == 0) {
        return '-';
      } else if (layout == 1) {
        return '三分屏';
      } else if (layout == 2) {
        return '纯文档';
      } else if (layout == 3) {
        return '画中画';
      }
    },
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
  }
  .tableBox{
    padding: 24px 24px;
    background: #fff;
    /deep/ .el-table__empty-block {
      display: none;
    }
    /deep/ .cell{
      color: #666;
    }
    /deep/ .el-table__row td:nth-child(2) .cell{
      padding-left: 10px;
    }
    /deep/&.recordTableBox .el-table__row td:nth-child(3) .cell{
      padding-left: 10px;
    }
    /deep/ thead th:nth-child(2) .cell{
      padding-left: 10px;
    }
    /deep/&.recordTableBox thead th:nth-child(3) .cell{
      padding-left: 10px;
    }
    .el-table{
      margin-bottom: 40px;
    }
    .playpackSource{
      color: #1a1a1a;
    }
    .el-button.is-disabled{
      border: 0;
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
      width: 140px;
      height: 79px;
      border-radius: 4px;
      background-color: #1a1a1a;
      .imageWrap{
        width: 100%;
        height: 100%;
        cursor: not-allowed;
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 2;
        border-radius: 4px;
        .statusDesc{
          width: 80px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          color: #fff;
          font-size: 12px;
          background: #FB3A32;
          border-radius: 15px;
          cursor: pointer;
        }
      }
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
      width: 187px;
      color: #1A1A1A;
      float: left;
      .name{
        line-height: 20px;
        // height: 40px;
        word-break: break-all;
        text-overflow: ellipsis;
        display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
        -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        -webkit-line-clamp: 1; /** 显示的行数 **/
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
      border-radius: 4px;
      object-fit: scale-down;
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
      /deep/ .el-input__prefix{
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
  .playback-list-popper {
    width: 120px;
  }
  .msgGray{
    color: #1A1A1A;
  }
  .msgBlue{
    color: #3562FA;
  }
</style>
