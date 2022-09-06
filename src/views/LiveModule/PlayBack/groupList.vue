<template>
  <div class="listBox">
    <pageTitle :pageTitle="title"></pageTitle>
    <template v-if="no_show === false">
      <div v-if="!isDemand" class="operaBlock">
        <el-button size="medium" class="transparent-btn" round :disabled="selectDatas.length < 1" @click="deletePlayBack(selectDatas.map(item=>item.id).join(','), 1)">批量删除</el-button>
        <VhallInput
          clearable
          @keyup.enter.native="getSearchList"
          placeholder="请输入内容标题"
          autocomplete="off"
          v-clearEmoij
          class="resetRightBrn"
          @clear="getList"
          v-model="keyWords">
          <i
            class="el-icon-search el-input__icon"
            slot="prefix"
            @click="getSearchList">
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
                <div class="info" @click="preview(scope.row)" style="cursor: pointer;">
                  <p class="name">{{ scope.row.name }}</p>
                  <p>第{{scope.row.group_switch_num}}次分组：{{scope.row.group_name}}
                    <span v-if="scope.row.doc_status && WEBINAR_PES['ui.record_chapter']" class="tag">章节</span>
                    <span v-if="scope.row.layout != 0" class="tag">重制</span>
                  </p>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="状态"
            :width="isBidScreen ? '' : 91"
            show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.encrypt_status == 2">加密</div>
              <div v-else-if="scope.row.encrypt_status == 1">加密中</div>
              <div v-else-if="scope.row.transcode_status == 1">-</div>
              <div v-else>
                <p v-if="scope.row.transcode_status == 2" class="statusDesc" @click="reTranscode(scope.row)">生成失败</p>
                <p v-else class="statusDesc disabled">{{ scope.row.transcode_status == 0 || scope.row.transcode_status == 3 ? '生成中...' : '' }}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            label="时长"
            :width="isBidScreen ? '' : 91"
            show-overflow-tooltip>
            <span class="playpackSource" slot-scope="scope">{{scope.row.duration}}</span>
          </el-table-column>

          <el-table-column
            v-if="!isDemand"
            label="布局"
            :width="isBidScreen ? '' : 78"
            show-overflow-tooltip>
            <span class="playpackSource" slot-scope="scope">{{scope.row.layout | layoutFilter}}</span>
          </el-table-column>

          <el-table-column
            v-if="!isDemand"
            label="暂存至"
            :width="isBidScreen ? '' : 108"
            class-name="deltime"
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
              <el-button v-if="is_rehearsal" type="text" @click="deletePlayBack(scope.row.id, 2)">删除</el-button>
              <el-button v-if="WEBINAR_PES['ui.record_chapter'] && !is_rehearsal" type="text" @click="toChapter(scope.row)">章节</el-button>
              <el-button type="text" v-if="($route.meta.name == 'recordplayback' || $route.meta.name == 'publishplayback')  && !is_rehearsal" @click="encryption(scope.row)">加密</el-button>
              <el-dropdown v-if="!isDemand && !is_rehearsal" @command="handleCommand">
                <el-button type="text">更多</el-button>
                <el-dropdown-menu style="width: 160px;" slot="dropdown">
                  <el-dropdown-item v-if="WEBINAR_PES['reset_record'] && !scope.row.layout" :command="{command: 'vodreset', data: scope.row}">重制</el-dropdown-item>
                  <el-dropdown-item v-if="!scope.row.layout" :command="{command: 'tailoring', data: scope.row}">剪辑</el-dropdown-item>
                  <el-dropdown-item v-if="WEBINAR_PES['publish_record'] && !scope.row.layout" :command="{command: 'publish', data: scope.row}">发布</el-dropdown-item>
                  <el-dropdown-item v-if="!scope.row.layout || scope.row.layout != 0" :command="{command: 'record.encrypt', data: scope.row}">加密</el-dropdown-item>
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

    <!-- 发布弹窗 -->
    <el-dialog
      title="发布回放"
      :visible.sync="publishDialogVisible"
      :close-on-click-modal=false
      :close-on-press-escape=false
      width="580px">
      <div class="publish-container">
        <div class="item" :class="activeIndex == 1 ? 'active' : 'unactive'" @click="activeIndex=1">
          <p class="item-img"><img src="./images/vod@2x.png" alt=""></p>
          <div class="item-text">
            <p>发布为点播</p>
            <span>不支持定时直播和不支持助理的管理权限</span>
          </div>
        </div>
        <div class="item" :class="activeIndex == 2 ? 'active' : 'unactive'" @click="activeIndex=2">
          <p class="item-img"><img src="./images/timing@2x.png" alt=""></p>
          <div class="item-text">
            <p>发布为定时直播</p>
            <span>支持定时直播和助理的管理权限</span>
          </div>
        </div>
      </div>
      <div class="dialog-publish-footer">
        <el-button type="primary" round size="medium" @click="publishVideo">立即发布</el-button>
      </div>
    </el-dialog>
    <!-- 预览功能 -->
    <template v-if="showDialog">
      <el-dialog custom-class="dialog-padding_playbackpreview" class="vh-saas-dialog" :visible.sync="showDialog" width="1010px" :before-close='closeBefore' center
      :close-on-press-escape=false>
      <video-preview ref="videoPreview" :recordId='videoParamId' :webinarId="webinar_id"></video-preview>
      </el-dialog>
    </template>
    <begin-play :webinarId="$route.params.str" v-if="webinarState!=4 && $route.query.type!=5"></begin-play>
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
      lowerGradeInterval:null,
      // 预览
      showDialog: false,
      webinarState: JSON.parse(sessionOrLocal.get("webinarState")),
      videoParamId: '',
      userId: JSON.parse(sessionOrLocal.get("userId")),
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
      encryptingArr: [],
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
      OLDWEBINAR_PES: {},
      isBidScreen: true,
      versionExpired: false, // 用户套餐是否过期
      publishDialogVisible: false,
      activeIndex: 1,  //默认激活点播
      recordData: {}  //发布时数据
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
    switch_id(){
      return this.$route.params.switch_id;
    },
    title(){
      if (this.isDemand === '') {
        return ''
      } else if (this.isDemand) {
        return this.liveDetailInfo.webinar_type == 5 ? '视频管理' : '点播管理'
      } else {
        return '小组视频'
      }
    }
  },
  created(){
    this.getList();
    this.getLiveDetail();
    EventBus.$on('record_download', this.handleDownload)
    EventBus.$on('encrypt_complete', this.handleEncryptCallback)
    this.getPermission(this.$route.params.str)
    this.getVersion()
    this.is_rehearsal = this.$route.query.is_rehearsal
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
    if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval)
    EventBus.$off('record_download', this.handleDownload)
    EventBus.$off('encrypt_complete', this.handleEncryptCallback)
    window.removeEventListener('resize', this.calcScreenWidth)
  },
  methods: {
    getVersion() {
      this.$fetch('getVersionInfo', { user_id: this.userId}).then(res => {
        this.versionExpired = res.data.expired == 1;
      }).catch(e=>{
        console.log(e);
      });
    },
    handleLowerGradeHeart() {
      this.getLowerGradeConfig()
      this.lowerGradeInterval = setInterval(() => {
        this.getLowerGradeConfig();
      }, (Math.random() * 5 + 5) * 1000);
    },
    getLowerGradeConfig() {
      this.$fetch('lowerGrade', {}).then(res => {
      }).catch(res => {
        // 降级没有code吗
        const { activity, user, global } = res;
        // 优先顺序：互动 > 用户 > 全局
        const activityConfig = activity && activity.length > 0 ? activity.find(option => option.audience_id == this.$route.params.str) : null;
        const userConfig = user && user.length > 0 ? user.find(option => option.audience_id == this.userId) : null;
        if (activityConfig) {
          this.setLowerGradeConfig(activityConfig.permissions, activityConfig.tip_message)
        } else if (userConfig) {
          this.setLowerGradeConfig(userConfig.permissions, userConfig.tip_message)
        } else if (global && global.permissions) {
          this.setLowerGradeConfig(global.permissions, global.tip_message)
        }
      });
    },
    setLowerGradeConfig(val, tipMessage) {
      if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval)
      const perssionInfo = Object.assign(this.WEBINAR_PES, val)
      sessionOrLocal.set('WEBINAR_PES', perssionInfo, 'localStorage');
      console.log(perssionInfo, '========1111222=======')
      this.WEBINAR_PES = perssionInfo
      // TODO 黄金链路-击中提示
      this.$message.warning(tipMessage);
    },
    calcScreenWidth() {
      const clientWidth = document.body.clientWidth
      if (this.isDemand) return;
      if (clientWidth < 1900) {
        this.isBidScreen = false
      } else {
        this.isBidScreen = true
      }
    },
    handleTipMsgVisible() {
      let that = this;
      if (!this.WEBINAR_PES['forbid_delrecord']) {
        this.tipMsg = this.$message({
          dangerouslyUseHTMLString: true,
          message: `
            ${this.WEBINAR_PES['forbid_delrecord'] ? '' : '<span class="msgGray">非默认回放暂存15天</span>'}
            ${!this.WEBINAR_PES['forbid_delrecord'] && !this.WEBINAR_PES['publish_record'] ? '，' : ''}
            ${this.WEBINAR_PES['publish_record'] ? "" : "<span class='msgBlue' id='msgBlue'>开通点播服务</span>"}
          `,
          showClose: true,
          duration: 0
        });
        let open = document.querySelector('#msgBlue');
        open && open.addEventListener('click', function(e){
          let url = 'https://vhall.s4.udesk.cn/im_client/?web_plugin_id=15038'
          that.$vhall_paas_port({
            k: 100017,
            data: {business_uid: that.userId, user_id: '', webinar_id: that.$route.params.str, s: '', refer: 2, report_extra: {}, ref_url: '', req_url: ''}
          })
          window.open(url, "_blank");
        });
      }
    },
    goReportData() {
      this.$vhall_paas_port({
        k: 100017,
        data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, s: '', refer: 2, report_extra: {}, ref_url: '', req_url: ''}
      })
    },
    getPermission(id) {
      // 活动权限
      this.$fetch('planFunctionGet', {webinar_id: id, webinar_user_id: this.userId, scene_id: 1}).then(res => {
        if(res.code == 200) {
          if(res.data.permissions) {
            sessionOrLocal.set('WEBINAR_PES', res.data.permissions, 'localStorage');
            this.WEBINAR_PES = JSON.parse(res.data.permissions)
            console.log('之前旧的权限', this.WEBINAR_PES)
            // this.handleLowerGradeHeart();
          } else {
            sessionOrLocal.removeItem('WEBINAR_PES');
          }
        } else {
          sessionOrLocal.removeItem('WEBINAR_PES');
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
        this.$message.warning('只有生成成功才能查看');
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
      // webinar/info调整-与活动状态无关的调用
      this.$fetch('getWebinarInfo', {webinar_id: this.webinar_id}).then(res=>{
        this.liveDetailInfo = res.data;
        console.log('this.liveDetailInfo:',this.liveDetailInfo)
        if (this.liveDetailInfo.webinar_type == 5 && !this.liveDetailInfo.is_demand) {
          this.isDemand = true
        } else {
          this.isDemand = this.liveDetailInfo.is_demand == 1;
        }

        this.calcScreenWidth()
        if (this.isDemand) {
          this.recordType = '上传'
          this.typeOptions = [
            { label: '上传', value: '2' }
          ]
        } else {
          // this.handleTipMsgVisible()
          this.typeOptions = [
            { label: '全部来源', value: '-1' },
            { label: '回放', value: '0' },
            { label: '录制', value: '1' },
            { label: '打点录制', value: '3' }
          ]
        }
      }).catch(res=>{
        this.$message({
          message: res.msg,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      }).finally(()=>{
        this.loading = false;
      });
    },
    typeChange(column, index) {
      this.getList()
    },
    setDefault(row) {
      console.log(row)
      // 判断视频是否为加密中
      if(row.encrypt_status == '1'){
        let msg = '视频加密中，请加密完成后使用此功能';
        this.$message.warning(msg);
        return;
      }
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
      // 判断是否为加密视频
      if(param.data.encrypt_status == '2' && param.command != 'delete' && param.command != 'record.encrypt'){
        let msg = '加密视频不支持使用此功能';
        this.$message.warning(msg);
        return;
      }
      // 判断视频是否为加密中
      if(param.data.encrypt_status == '1' && param.command != 'delete'){
        let msg = '视频加密中，请加密完成后使用此功能';
        this.$message.warning(msg);
        return;
      }
      // 判断视频是否为转码中
      if(!param.data.transcode_status && param.command != 'delete'){
        let msg = '视频转码中，不支持使用加密功能';
        this.$message.warning(msg);
        return;
      }
      if(param.command == 'delete'){
        this.deletePlayBack(param.data.id, 2);
      }else if(param.command == 'tailoring'){
        this.$vhall_paas_port({
          k: 100411,
          data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, s: '', refer: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        this.toTailoring(param.data.id, param.data.name);
      } else if (param.command == 'publish') {
        this.$vhall_paas_port({
          k: 100413,
          data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, s: '', refer: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        this.toCreateDemand(param.data);
      } else if (param.command == 'vodreset') {
        this.$vhall_paas_port({
          k: 100415,
          data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, s: '', refer: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        this.toVodreset(param.data)
      }
      // 加密按钮
      if(param.command == 'record.encrypt'){
        this.encryption(param.data)
      }
    },
    currentChangeHandler(num){
      this.pageNum = num;
      this.getList();
    },
    getSearchList() {
      if (this.keyWords) {
        this.$vhall_paas_port({
          k: 100418,
          data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, s: '', refer: '', report_extra: {}, ref_url: '', req_url: ''}
        })
      }
      this.getList();
    },
    getList(){
      let param = {
        webinar_id: this.webinar_id,
        pos: this.pos,
        limit: this.pageSize,
        switch_id: this.switch_id,
      };
      this.keyWords && (param.name = this.keyWords)
      console.log('param:',param)
      this.loading = true;
      // 获取小组回放列表
      this.$fetch('getGroupRecordList', param).then(res=>{
        res.data.list.forEach(item => {
          item.transcoding = false
        })
        this.tableData = res.data.list;
        console.log('this.tableData:',this.tableData);
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
    handleEncryptCallback(data) {
      // data
      // 'type'      => 'entry_trans',
      // 'user_id'   => 视频资源对应用户id,
      // 'status'    => 1 成功 2:失败,
      // 'record_id' => 视频资源id
      console.log('视频加密完成')
      this.encryptingArr = this.encryptingArr.filter(item => {
        if(item.id == data.record_id) {
          item.encrypt_status = '2';
          return false
        }
      })
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
      // 判断视频是否为加密中
      if(data.encrypt_status == '1'){
        let msg = '视频加密中，请加密完成后使用此功能';
        this.$message.warning(msg);
        return;
      }
      if (this.versionExpired) {
        this.$confirm('尊敬的用户，您的账号已到期。为了保证正常使用，请联系您的客户经理或专属售后，也可拨打400-888-9970转2咨询', '提示', {
          confirmButtonText: '我知道了',
          showCancelButton: false,
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {}).catch(() => {});
        return false
      }

      const fetchCb = () => {
        this.$fetch('playBackDownUrlGet', {
          record_id: data.id
        }).then(res => {
          console.log(res)
          this.$vhall_paas_port({
            k: 100409,
            data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, s: '', refer: '', report_extra: {}, ref_url: '', req_url: ''}
          })
          if (res.data.has_download_url == 0) {
            data.transcoding = true;
            this.transcodingArr.push(data);
            this.$message({
              message: `正在生成，请稍侯...`,
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
    deletePlayBack(ids, index){
      this.$confirm('删除回放会导致目前已生成回放的数据丢失，请谨慎操作，确定要删除这段回放么？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        this.loading = true;
        this.$fetch('playBackDelete', { record_ids: ids}).then(res=>{
          this.$vhall_paas_port({
            k: index === 1 ? 100416 : 100417,
            data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, s: '', refer: '', report_extra: {}, ref_url: '', req_url: ''}
          })
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
        this.$vhall_paas_port({
          k: 100408,
          data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, s: '', refer: '', report_extra: {}, ref_url: '', req_url: ''}
        })
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
      this.$vhall_paas_port({
        k: 100407,
        data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, s: '', refer: '', report_extra: {}, ref_url: '', req_url: ''}
      })
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
            record_id: data.id,
            switch_id:this.switch_id
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
        if (err.code == 512550) {
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
            message:  '视频生成失败',
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
      // 判断视频是否为加密中
      if(row.encrypt_status == '1'){
        let msg = '视频加密中，请加密完成后使用此功能';
        this.$message.warning(msg);
        return;
      }
      this.$vhall_paas_port({
        k: 100410,
        data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, s: '', refer: '', report_extra: {}, ref_url: '', req_url: ''}
      })
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
            message:  '视频生成中，请稍后再试',
            showClose: true, // 是否展示关闭按钮
            type: 'warning', //  提示类型
            customClass: 'zdy-info-box' // 样式处理
          });
        } else if (res.data.transcode_status == 2){
          this.$message({
            message:  '视频生成失败',
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
          this.$router.push({path: `/${chapterType}/${this.webinar_id}`, query: {recordId, isDemand: this.isDemand, pageKey: this.$route.meta.name, type: this.liveDetailInfo.webinar_type, switch_id: this.switch_id}});

          // const routeData = this.$router.resolve({path: `/${chapterType}/${this.webinar_id}`, query: {recordId, isDemand: this.isDemand}});
          // window.open(routeData.href, '_blank');
        }
      })
    },
    // 发布
    toCreateDemand(recordData) {
      this.recordData = recordData
      if (this.WEBINAR_PES['webinar.timing'] == 1) {
        this.publishDialogVisible = true
      } else {
        this.publishVodTiming(recordData, 1)
      }
    },

    // 发布为点播或定时直播
    publishVodTiming(recordData, index) {
      console.log('----this.recordData---');
      console.log(recordData);
      const url = index == 1 ? '/live/vodEdit' : '/live/timeEdit'
      const routerPush = () => {
        this.$router.push({
          path: url,
          query: {
            record_id: recordData.id,
            paas_record_id: recordData.paas_record_id,
            name: recordData.name,
            webinar_id: this.webinar_id
          }
        })
      }
      this.checkTransStatus(recordData.id, routerPush)
    },
    // 点击弹窗中的“立即发布”按钮
    publishVideo() {
      this.publishDialogVisible = false
      this.publishVodTiming(this.recordData, this.activeIndex)
    },
    // 加密
    encryption(data){
      // 判断视频是否为转码失败
      if(data.transcode_status == '2'){
        let msg = '视频转码失败，不支持使用加密功能';
        this.$message.warning(msg);
        return;
      }
      // 判断是否有加密权限
      if (this.WEBINAR_PES['record.encrypt'] != 1) {
        this.$confirm('尊敬的用户：您的账号未开通视频加密功能，请联系您的专属售后或拨打400-888-9970转2咨询', '提示', {
          confirmButtonText: '我知道了',
          showCancelButton: false,
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {}).catch(() => {});
        return false;
      }
      // 判断视频是否已加密
      if(data.encrypt_status == '2'){
        let msg = '当前视频已是加密视频';
        this.$message.warning(msg);
        return;
      }
      // 判断视频是否为加密中
      if(data.encrypt_status == '1'){
        let msg = '视频加密中，请加密完成后使用此功能';
        this.$message.warning(msg);
        return;
      }
      this.$confirm('视频一旦加密不支持取消加密，且不支持使用重制、剪辑、发布等功能，确定生成加密视频？', '提示', {
        confirmButtonText: '确定',
        cancelButton: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        this.$fetch('checkChapterSave', {
          record_id: data.id
        }).then(res => {
          if (res.data && res.data.chatper_callbanck_status == 0) {
            this.$message({
              message:  '当前视频与文档正在关联中，请稍后再试',
              showClose: true, // 是否展示关闭按钮
              type: 'warning', //  提示类型
              customClass: 'zdy-info-box' // 样式处理
            });
          } else {
            this.encrypyStart(data)
          }
        })

      }).catch(() => {});
    },
    encrypyStart(data) {
      this.$fetch('recordEncrypt', {
        paas_record_id: data.paas_record_id
      }).then(res => {
        if(res.code == 200) {
          data.encrypt_status = '1';
          this.encryptingArr.push(data);
        }
      })
    },
    // 加密介绍
    openTip(){
      window.open('https://saas-doc.vhall.com/docs/show/1417')
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
    /deep/ .deltime .cell{
      padding-left: 22px;
    }
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
          &.disabled {
            cursor: default;
          }
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
      // width: 227px;
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
        padding-right: 30px!important;
      }
       /deep/ .el-input__icon {
        line-height: 36px;
      }
      /deep/ .el-input__prefix {
        cursor: pointer;
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
  .ps{
    position: absolute;
  }
  .jiami{
    text-align: center;
    font-size: 12px;
    color: white;
    width: 40px;
    height: 22px;
    background: #FB3A32;
    border-radius: 4px 0px 12px 2px;
    top: 0;
    left: 0;
  }
  .jiamizhong{
    text-align: center;
    // font-size: 12px;
    color: white;
    width: 72px;
    height: 23px;
    background: #FB3A32;
    border-radius: 12px;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
  }
  .color999{
    color: #999;
    font-size: 14px;
  }
  .jiami_zhezhao{
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 4px;
  }
  .publish-container{
    padding: 0 40px;
    display: flex;
    flex-direction: column;
    .item{
      display: flex;
      padding: 28px 32px;
      border-radius: 4px;
      align-items: center;
      border: 1px solid transparent;
      &-img{
        width: 42px;
        height: 36px;
        img{
          width: 100%;
          height: 100%;
          object-fit: scale-down;
        }
      }
      &-text{
        padding-left: 10px;
        p{
          color: #1A1A1A;
          font-size: 16px;
          line-height: 25px;
        }
        span{
          color: #666;
          font-size: 14px;
          line-height: 20px;
        }
      }
      &:first-child{
        margin-bottom: 24px;
      }
      &.active{
        border: 1px solid #FB3A32;
      }
      &.unactive {
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
      }
      &:hover{
        box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.1);
      }
    }
  }
  .dialog-publish-footer{
    padding:  32px 0;
    text-align: center;
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
    cursor: pointer;
  }
</style>
