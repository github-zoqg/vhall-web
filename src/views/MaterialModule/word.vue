<template>
  <div class="word-wrap">
    <pageTitle pageTitle="文档">
      <div slot="content">
        1.支持的文档格式: doc/docx，xls/xlsx，ppt/pptx，pdf，jpeg/jpg，png，bmp
        <br />
        2.上传的文档内容不能超过500页，不超过300M
        <br />
        3.如果ppt格式转换失败或文档打开失败请尝试用office转为pdf后上传
        <br />
        4.直播过程中发现ppt自动翻页，请检查源文件是否设置自动放映
        <br />
        5.文档转换较慢，请于直播前提前上传
      </div>
      <div class="title_text">
        推荐开播前提前上传课件，上传过程中如果遇到问题请查看<a
          href="https://saas-doc.vhall.com/docs/show/1278"
          target="_blank"
          >《常见问题》</a
        >
      </div>
    </pageTitle>
    <!-- 无权限，未创建 -->
    <div>
      <null-page
        text="您还没有文档，快来上传吧"
        nullType="noAuth"
        v-show="no_show"
      >
        <el-upload
          class="btn-upload"
          :action="actionUrl"
          :headers="headersVo"
          :data="saveData"
          accept="*"
          name="resfile"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :before-upload="beforeUploadHandler"
          :on-progress="uploadProcess"
          :on-preview="uploadPreview"
        >
          <el-button round type="primary" class="length152">上传</el-button>
        </el-upload>
        <el-button
          type="white-primary"
          class="length152"
          round
          @click="openCheckWord"
          v-if="$route.params.str"
          >资料库</el-button
        >
      </null-page>
      <div class="head-operat" v-show="!no_show">
        <el-upload
          class="btn-upload"
          :action="actionUrl"
          :headers="headersVo"
          :data="saveData"
          accept="*"
          name="resfile"
          :show-file-list="false"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :before-upload="beforeUploadHandler"
          :on-progress="uploadProcess"
          :on-preview="uploadPreview"
        >
          <el-button round type="primary" size="medium">上传</el-button>
        </el-upload>
        <!--<el-button type="primary" round @click.prevent.stop="importWordOpen" size="medium">上传文档</el-button>-->
        <el-button
          round
          @click="openCheckWord"
          class="transparent-btn"
          size="white-medium"
          v-if="$route.params.str"
          >资料库</el-button
        >
        <el-button
          round
          @click="wordMultiDel"
          class="transparent-btn"
          size="medium"
          :disabled="multipleSelection && multipleSelection.length === 0"
          >批量删除</el-button
        >
        <VhallInput
          class="head-btn search-tag"
          placeholder="请输入文档名称"
          v-model="formParams.keyword"
          clearable
          v-clearEmoij
          @clear="initPage"
          @keyup.enter.native="initPage"
        >
          <i
            class="el-icon-search el-input__icon"
            slot="prefix"
            @click="initPage"
          >
          </i>
        </VhallInput>
      </div>
      <div class="word-list" v-show="!no_show">
        <table-list
          ref="tableListWord"
          scene="word"
          :manageTableData="tableList"
          :tabelColumnLabel="tableColumn"
          :tableRowBtnFun="tableRowBtnFun"
          :totalNum="totalNum"
          max-height="auto"
          width="194"
          @onHandleBtnClick="onHandleBtnClick"
          @getTableList="getTableWordList"
          @changeTableCheckbox="changeTableCheckbox"
        >
        </table-list>
        <null-page
          text="未搜索到相关内容"
          nullType="search"
          v-if="totalNum === 0"
        ></null-page>
      </div>
    </div>
    <!-- 静态预览功能 -->
    <template v-if="showDialog">
      <!--<el-dialog class="vh-saas-dialog" title="预览" :visible.sync="showDialog" width="30%" center>
        <doc-preview ref="videoPreview" :docParam='docParam' v-if="docParam"></doc-preview>
      </el-dialog>-->
      <VhallDialog
        class="preview-doc-dialog"
        :visible.sync="showDialog"
        width="736px"
        height="458px"
        :modalClick="true"
      >
        <div
          class="loadingWrap"
          element-loading-background="rgba(255,255,255)"
          v-loading="!docLoadComplete"
          v-show="!docLoadComplete"
        ></div>
        <div
          style="position: relative; height: 396px"
          v-show="isDot && docLoadComplete"
        >
          <!-- 动态文档区域-->
          <div
            :key="currentCid"
            :id="currentCid"
            style="width: 704px; height: 396px"
          ></div>
        </div>
        <!-- 静态文档区域
        <div class="preview-doc" id="previewDoc" v-else>
          <img v-for="sIndex of docParam.page" :key="`s_${sIndex}`"  v-show="activeIns === sIndex" :index="sIndex" :src="`http://cnstatic01.e.vhall.com/document/${docParam.hash}/${sIndex}.jpg`" alt="" />
        </div>-->
        <div
          class="preview-pages"
          v-if="isDot && dotPageInfo.total > 0 && docLoadComplete"
        >
          <span class="left" @click="prevStep">&lt;</span
          ><span class="current">{{ dotPageInfo.pageIndex }}</span
          ><span class="side">/</span
          ><span class="total">{{ dotPageInfo.total }}</span
          ><span class="right" @click="nextStep">&gt;</span>
        </div>
        <!-- <div class="preview-pages" v-else>
          <span class="left" @click="showLastImg">&lt;</span><span class="current">{{ activeIns }}</span><span class="side">/</span><span class="total">{{ docParam.page }}</span><span class="right" @click="showNextImg">&gt;</span>
        </div> -->
      </VhallDialog>
    </template>

    <!-- 同步弹出框 -->
    <VhallDialog
      title="提示"
      :visible.sync="asyncDialog.visible"
      :show-close="false"
      class="zdy-async-dialog"
      width="400px"
    >
      <div class="async__body">
        <div class="async__ctx">
          <p>{{ asyncDialog.question }}</p>
          <el-checkbox v-model="asyncDialog.sureChecked">{{
            asyncDialog.show
          }}</el-checkbox>
        </div>
        <div class="async__footer">
          <el-button
            type="primary"
            size="medium"
            v-preventReClick
            @click="sureAsyncHandle"
            round
            >确 定</el-button
          >
          <el-button size="medium" @click="unSureAsyncHandle" round
            >取 消</el-button
          >
        </div>
      </div>
    </VhallDialog>

    <!-- 文档列表 -->
    <select-word ref="dialogWordComp" @reload="initPage"></select-word>
    <begin-play
      :webinarId="$route.params.str"
      v-if="$route.params.str"
    ></begin-play>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle'
import NullPage from '../PlatformModule/Error/nullPage.vue'
import SelectWord from './components/selectWord.vue'
import Env from '@/api/env'
import { sessionOrLocal } from '@/utils/utils'
import beginPlay from '@/components/beginBtn'
import EventBus from '@/utils/Events'
import { v1 as uuidV1 } from 'uuid'

export default {
  name: 'word.vue',
  components: {
    PageTitle,
    NullPage,
    SelectWord,
    beginPlay,
  },
  data() {
    return {
      asyncDialog: {
        visible: false,
        question: '上传文档同时共享至资料管理，便于其他活动使用？',
        show: '共享到资料管理',
        sureChecked: true,
      },
      importWordShow: false,
      env: Env,
      userId: '',
      activeIns: null,
      isLoading: false,
      no_show: false,
      token: sessionOrLocal.get('token', 'localStorage') || '',
      actionUrl: `${process.env.VUE_APP_BASE_URL}/v3/interacts/document/upload-webinar-document`,
      formParams: {
        keyword: '',
      },
      totalNum: 0,
      tableList: [],
      tableColumn: [
        {
          label: '文档名称',
          key: 'file_name',
          width: 'auto',
          customTooltip: true,
        },
        {
          label: '上传时间',
          key: 'created_at',
          width: 200,
        },
        {
          label: '页码',
          key: 'page',
          width: 80,
        },
        {
          label: '进度',
          key: 'transform_schedule_str',
          width: 220,
        },
      ],
      tableRowBtnFun: [
        {
          name: '预览',
          methodName: 'preShow',
        },
        {
          name: '动画版预览',
          methodName: 'preDocShow',
        },
        {
          name: '删除',
          methodName: 'deleteHandle',
        },
      ],
      searchAreaLayout: [
        {
          type: '',
          key: 'searchTitle',
        },
      ],
      multipleSelection: [],
      showDialog: false,
      docParam: null,
      dialogVisible: false,
      dialogTotal: 0,
      dialogTableList: [],
      dialogMulti: [],
      channel_id: null,
      query: {
        pos: 0,
        limit: 1000,
        pageNumber: 1,
      },
      uploadProgress: 0,
      docBoxStyle: {}, // 文档宽高
      boardBoxStyle: {},
      watchDocShow: true,
      currentCid: '',
      activeTool: '', // 激活状态的工具
      isFullscreen: false,
      VhallMsgSdk: !!window.VhallMsg, // 是否加载了msgsdk
      addDoc: false,
      dotPageInfo: {
        pageIndex: 0,
        total: 0,
      },
      vm: null,
      isDotEnd: false, // 是否播放完毕
      docLoadComplete: false, // 文档加载状态
    }
  },
  computed: {
    headersVo: function () {
      let vo = { token: this.token, platform: 17, 'request-id': uuidV1() }
      // 取缓存userId相关
      if (window.sessionStorage.getItem('userId')) {
        vo['gray-id'] = window.sessionStorage.getItem('userId')
      }
      return vo
    },
    saveData: function () {
      let data = {
        path: 'interacts/docs',
        type: 1, // 上传类型 0：直播设置上传 1:资料库文档上传，2：发起端直播间
      }
      if (this.$route.params.str) {
        // 上传类型 0：直播设置上传 1:资料库文档上传，2：发起端直播间
        data.type = 0
        data.webinar_id = this.$route.params.str
      } else {
        data.type = 1
      }
      return data
    },
    playerProps: function () {
      let channelVo = JSON.parse(
        sessionOrLocal.get('SAAS_V3_INIT', 'localStorage') || '{}'
      )
      return {
        appId: channelVo.paasAppId || '',
        accountId: channelVo.accountId || '',
        channel_id: this.$route.params.str
          ? this.channel_id
          : channelVo.channelId || '',
        token: channelVo.paasAccessToken || '',
      }
    },
  },
  methods: {
    // 打开导入观众弹出框
    importWordOpen() {
      this.importWordShow = true
      this.fileUrl = null
    },
    initPayMessage() {
      this.vm = this.$message({
        showClose: true,
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: '上传过程中请勿关闭或刷新浏览器',
        type: 'warning',
      })
    },
    // 下一页
    showNextImg() {
      if (this.activeIns === this.docParam.page) {
        return
      } else {
        this.activeIns++
        // this.setImgSize();
      }
    },
    nextStep() {
      console.log('nextStep', this.docLoadComplete)
      if (!this.docLoadComplete) {
        return this.$message({
          message: `请文档加载完成以后再操作`,
          showClose: true,
          // duration: 0,
          type: 'warning',
          customClass: 'zdy-info-box',
        })
      }
      if (!this.isDotEnd) {
        this.$EventBus.$emit('nextStep')
      }
    },
    // 上一页
    showLastImg() {
      if (this.activeIns === 1) {
        return
      } else {
        this.activeIns--
        // this.setImgSize();
      }
    },
    prevStep() {
      console.log('prevStep', this.docLoadComplete)
      if (!this.docLoadComplete) {
        return this.$message({
          message: `请文档加载完成以后再操作`,
          showClose: true,
          // duration: 0,
          type: 'warning',
          customClass: 'zdy-info-box',
        })
      }
      this.$EventBus.$emit('prevStep')
    },
    setImgSize() {
      let that = this
      if (this.activeIns == 1) {
        let img = new Image()
        img.src = `http://cnstatic01.e.vhall.com/document/${this.docParam.hash}/${this.activeIns}.jpg`
        if (img.complete) {
          this.isLoading = true
        }
        img.onload = function () {
          that.loading = false
        }
      } else {
        that.loading = false
      }
    },
    uploadSuccess(res, file, fileList) {
      console.log(res, file, fileList)
      this.importWordShow = false
      this.vm.close()
      if (res.code === 200) {
        if (this.$route.params.str) {
          this.asyncDialog.visible = true
          this.asyncDialog.sureChecked = true
          // 弹出框提示是否同步
          this.asyncDialog.rows = res
        } else {
          // 判断文件上传情况
          // this.initPage();
          window.location.reload()
        }
      } else {
        // 上传失败
        this.$message({
          message: res.msg || `文件上传失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box',
        })
        window.location.reload()
      }
    },
    sureAsyncHandle() {
      this.$vhall_paas_port({
        k: 100299,
        data: {
          business_uid: this.userId,
          user_id: '',
          webinar_id: this.$route.params.str,
          refer: '',
          s: '',
          report_extra: {},
          ref_url: '',
          req_url: '',
        },
      })
      if (this.asyncDialog.sureChecked) {
        // 同步到资料库
        this.asyncWord(this.asyncDialog.rows)
        this.$vhall_paas_port({
          k: 100300,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: this.$route.params.str,
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: '',
          },
        })
        this.$vhall_paas_port({
          k: 100304,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: this.$route.params.str,
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: '',
          },
        })
      } else {
        this.asyncDialog.visible = false
        // 未勾选同步，不同步数据
        this.$vhall_paas_port({
          k: 100305,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: this.$route.params.str,
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: '',
          },
        })
        this.initPage()
      }
    },
    unSureAsyncHandle() {
      this.asyncDialog.visible = false
      // 取消同步，刷新列表
      this.initPage()
    },
    asyncWord(resV) {
      let params = {
        document_id: resV.data.document_id,
        tag: 1, // 1：同步到资料库 ，2：同步到活动
        webinar_id: this.$route.params.str,
      }
      this.$fetch('asyncWordInfo', this.$params(params))
        .then((res) => {
          this.asyncDialog.visible = false
          this.$message({
            message: res.msg || '同步成功',
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box',
          })
          try {
            this.$refs.tableListWord.clearSelect()
          } catch (e) {
            console.log(e)
          }
        })
        .catch((res) => {
          this.asyncDialog.visible = false
          console.log(res)
          this.$message({
            message: res.msg || '同步失败',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box',
          })
        })
        .finally(() => {
          this.asyncDialog.visible = false
          // this.initPage();
          window.location.reload()
        })
    },
    beforeUploadHandler(file) {
      console.log(file)
      if (!this.$route.params.str) {
        this.$vhall_paas_port({
          k: 100511,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: '',
          },
        })
      }
      const typeList = [
        'doc',
        'docx',
        'xls',
        'xlsx',
        'ppt',
        'pptx',
        'pdf',
        'jpeg',
        'jpg',
        'png',
        'bmp',
      ]
      let fileNameArr = file.name.split('.')
      let lastFileKey = fileNameArr[fileNameArr.length - 1]
      console.log(lastFileKey)
      const isType = typeList.includes(lastFileKey.toLowerCase())
      const isLt2M = file.size / 1024 / 1024 < 300
      if (!isType) {
        this.$message({
          message: `上传文件只能是 ${typeList.join('、')} 格式!`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box',
        })
        return false
      }
      if (!isLt2M) {
        this.$message({
          message: `上传文件大小不能超过 300MB!`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box',
        })
        return false
      }
      if (isType && isLt2M) {
        this.totalNum = 1
        this.no_show = false
        if (this.vm) {
          this.vm.close()
          this.initPayMessage()
        } else {
          this.initPayMessage()
        }
        // 若是当前为 this.no_show
        this.tableList.unshift({
          created_at: dayjs(new Date()).format('YYYY-MM-DD hh:mm:ss'),
          ext: lastFileKey.toLowerCase(),
          file_name: file.name,
          id: file.uid,
          isUpload: true,
          codeProcess: 0,
          transform_schedule_str: '',
        })
      }
      return isType && isLt2M
    },
    uploadProcess(event, file, fileList) {
      console.log('uploadProcess', event, file, fileList)
      this.tableList.map((item) => {
        if (item.id === file.uid) {
          item.codeProcess = parseInt(event.percent)
        }
      })
    },
    uploadError(err, file, fileList) {
      console.log('uploadError', err, file, fileList)
      this.$message({
        message: `文件上传失败`,
        showClose: true,
        // duration: 0,
        type: 'error',
        customClass: 'zdy-info-box',
      })
    },
    uploadPreview(file) {
      console.log('uploadPreview', file)
    },
    // 从资料库选择文档
    openCheckWord() {
      this.dialogVisible = true
      this.$refs.dialogWordComp.initComp()
    },
    // 批量删除
    wordMultiDel() {
      if (this.multipleSelection && this.multipleSelection.length > 0) {
        this.$confirm('删除后将会影响文档演示和观看，确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel',
        })
          .then(() => {
            let ids = this.multipleSelection.map((item) => {
              return item.id
            })
            this.deleteSend(
              {
                id: ids.join(','),
              },
              1
            )
          })
          .catch(() => {})
      } else {
        this.$message({
          message: `请至少选择一条记录进行删除`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box',
        })
      }
    },
    // 获取文档列表数据
    getTableWordList(row) {
      if (row) {
        this.query.pos = row.pos
        this.query.pageNumber = row.pageNum
      }
      let params = {
        pos: this.query.pos,
        limit: this.query.limit,
        keyword: this.formParams.keyword,
        type: 1,
        webinar_id: this.$route.params.str,
      }
      this.$fetch(
        this.$route.params.str ? 'getWebinarWordList' : 'getWordList',
        this.$params(params)
      )
        .then((res) => {
          if (res && res.code === 200) {
            this.totalNum = res.data.total
            this.no_show = this.totalNum === 0 && this.formParams.keyword === ''
            let list = res.data.list
            list.map((item) => {
              /*
              converted_page: "0" // 动态页数
              converted_page_jpeg: "1" // 静态页数
              document_id: "01b17b82" // 文档ID
              page: "1" // 文档总页数
              status: "200" // 动态转换状态 0待转换 100转换中 200完成 500失败
              status_jpeg: "200" // 静态转换状态 0待转换 100转换中 200完成 500失败
            */
              const statusJpeg = item.status_jpeg * 1
              const status = item.status * 1
              if (statusJpeg === 0) {
                item.showEventType = 0
                item.fileStatusCss = 'wating'
                item.fileStatusStr = '等待转码'
                item.transform_schedule_str = `等待转码`
              } else if (statusJpeg === 100) {
                item.showEventType = 1
                item.transform_schedule_str = `` // 静态转码中
                let _percent =
                  (parseInt(item.converted_page_jpeg) / parseInt(item.page)) *
                  100
                item.codeProcess = (_percent + '').substr(0, 4)
              } else if (statusJpeg === 200) {
                if (/pptx?/.test(item.ext)) {
                  // 如果是ppt or pptx
                  if (status === 0) {
                    item.showEventType = 2
                    item.fileStatusCss = 'wating'
                    item.fileStatusStr = '等待转码'
                    item.transform_schedule_str = `等待转码` // 静态转码完成，动态待转码
                  } else if (status === 100) {
                    item.showEventType = 3
                    item.fileStatusCss = 'success'
                    item.fileStatusStr = '动态转码中'
                    item.transform_schedule_str = `静态转码成功，动态转码中...` // 静态转码完成，动态转码中
                  } else if (status === 200) {
                    item.showEventType = 4
                    item.fileStatusCss = 'success'
                    item.fileStatusStr = '转码成功'
                    item.transform_schedule_str = `静态转码成功<br/>动态转码成功` // 静态转码完成，动态转码完成
                  } else {
                    item.showEventType = 5
                    item.fileStatusCss = 'failer'
                    item.fileStatusStr = '转码失败'
                    item.transform_schedule_str = `转码失败` // 静态转码完成，动态转码失败
                  }
                } else {
                  // 非PPT静态转码完成
                  item.showEventType = 6
                  item.fileStatusCss = 'success'
                  item.fileStatusStr = '转码成功'
                  item.transform_schedule_str = `转码成功` // 静态转码完成，动态转码失败
                }
              } else if (statusJpeg >= 500) {
                item.showEventType = 7
                item.fileStatusCss = 'failer'
                item.fileStatusStr = '转码失败'
                item.transform_schedule_str = `转码失败` // 静态转码失败
              }
            })
            this.tableList = list
          } else {
            this.totalNum = 0
            this.tableList = []
          }
        })
        .catch((e) => {
          console.log(e)
          this.totalNum = 0
          this.tableList = []
        })
        .finally(() => {})
    },
    // 预览
    async preShow(that, { rows }) {
      console.log('预览', rows)
      that.showDialog = true
      that.docParam = rows
      that.activeIns = 1 // 默认打开第一页
      /*  that.isDot = false;
      that.setImgSize(); // loading */
      that.isDot = true
      that.dotPageInfo.pageIndex = 0
      that.dotPageInfo.total = 0
      that.docLoadComplete = false
      await that.$nextTick(() => {})
      that.docEvents(rows)
      that.$vhall_paas_port({
        k: that.$route.params.str ? 100306 : 100514,
        data: {
          business_uid: that.userId,
          user_id: '',
          webinar_id: that.$route.params.str || '',
          refer: '',
          s: '',
          report_extra: {},
          ref_url: '',
          req_url: '',
        },
      })
    },
    // 动态演示
    async preDocShow(that, { rows }) {
      that.showDialog = true
      that.docParam = rows
      that.activeIns = 1 // 默认打开第一页
      that.isDot = true
      that.dotPageInfo.pageIndex = 0
      that.dotPageInfo.total = 0
      that.docLoadComplete = false
      await that.$nextTick(() => {})
      that.docDotEvents(rows)
      that.$vhall_paas_port({
        k: that.$route.params.str ? 100307 : 100515,
        data: {
          business_uid: that.userId,
          user_id: '',
          webinar_id: that.$route.params.str || '',
          refer: '',
          s: '',
          report_extra: {},
          ref_url: '',
          req_url: '',
        },
      })
    },
    // 删除
    deleteHandle(that, { rows }) {
      console.log('删除', rows)
      that
        .$confirm(
          that.$route.params.str
            ? '删除后将会影响文档演示和观看，确定删除？'
            : '删除后将会影响文档演示和观看，确定删除？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'zdy-message-box',
            lockScroll: false,
            cancelButtonClass: 'zdy-confirm-cancel',
          }
        )
        .then(() => {
          that.deleteSend(rows, 2)
        })
        .catch(() => {
          that.$message({
            message: `已取消删除`,
            showClose: true,
            // duration: 0,
            type: 'info',
            customClass: 'zdy-info-box',
          })
        })
    },
    deleteSend(rows, index) {
      let params = {
        ids: rows.id,
        tag: this.$route.params.str ? 1 : 2,
        webinar_id: this.$route.params.str,
      }
      this.$fetch('delWordList', this.$params(params))
        .then((res) => {
          let k = 0
          if (this.$route.params.str) {
            k = index == 1 ? 100303 : 100302
          } else {
            k = index == 1 ? 100513 : 100512
          }
          this.$vhall_paas_port({
            k: k,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: this.$route.params.str || '',
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: '',
            },
          })
          this.$message({
            message: `删除成功`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box',
          })
          try {
            this.$refs.tableListWord.clearSelect()
          } catch (e) {
            console.log(e)
          }
          this.initPage()
        })
        .catch((res) => {
          this.$message({
            message: res.msg || '删除失败',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box',
          })
        })
        .finally(() => {})
    },
    // 选中
    changeTableCheckbox(val) {
      console.log(val)
      this.multipleSelection = val
    },
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods
      methodsCombin[val.type](this, val)
    },
    initPage() {
      this.query.pos = 0
      this.query.pageNumber = 1
      this.query.limit = 10
      // 表格切换到第一页
      try {
        this.$refs.tableListWord.pageInfo.pageNum = 1
        this.$refs.tableListWord.pageInfo.pos = 0
      } catch (e) {
        console.log(e)
      }
      if (this.formParams.keyword) {
        this.$vhall_paas_port({
          k: this.$route.params.str ? 100308 : 100516,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: this.$route.params.str || '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: '',
          },
        })
      }
      this.getTableWordList()
    },
    getWebinarInfo() {
      // webinar/info调整-与活动状态无关的调用
      this.$fetch('getWebinarInfo', { webinar_id: this.$route.params.str })
        .then((res) => {
          if (res && res.code === 200) {
            this.channel_id = res.data.vss_channel_id
            // 初始化聊天SDK [活动下的]
            this.initWebinarChat()
            this.initPage()
          }
        })
        .catch((error) => {
          console.log(error)
        })
        .finally(() => {})
    },
    async _initDocSDK() {
      console.log('实例化文档参数进入')
      let result = await this.$fetch('msgInitConsole')
      if (result) {
        console.log(result, '值')
        sessionOrLocal.set(
          'SAAS_V3_INIT',
          JSON.stringify(result.data),
          'localStorage'
        )
        let opt = {
          accountId: result.data.accountId,
          roomId: 'yyyy',
          channelId: result.data.channelId, // 频道id 必须
          appId: result.data.paasAppId, // appId 必须
          role: VHDocSDK.RoleType.SPECTATOR, // 角色 必须
          isVod: false, // 是否是回放 必须
          client: window.VHDocSDK.Client.PC_WEB, // 客户端类型
          token: result.data.paasAccessToken,
        }
        console.log('实例化文档参数', opt)
        let success = () => {
          console.log('实例化文档成功')
          this.$EventBus.$emit('docSDK_ready', this.docSDK)
        }
        let failed = (error) => {
          console.error('实例化文档失败', error.msg)
        }
        this.docSDK = window.VHDocSDK.createInstance(opt, success, failed)
      }
    },
    /**
     * 初始化文档容器
     */
    initContainer(data) {
      let opts = {
        id: data.id,
        docId: data.docId || '',
        elId: data.id, // div 容器 必须
        width: 704, // div 宽度，像素单位，数值型不带px 必须
        height: 396, // div 高度，像素单位，数值型不带px 必须
        noDispatch: !data.select, // 通过监听创建容器消息创建的需要派发加载完成消息
      }
      console.log(opts)
      this.docSDK.createDocument(opts)
    },
    async docDotEvents(rows) {
      let cid = this.docSDK.createUUID('document')
      this.currentCid = cid
      await this.$nextTick(() => {})
      this.initContainer({
        type: 'document',
        docId: rows.document_id,
        id: cid,
      })
      this.docSDK.selectContainer({ id: cid })
      await this.docSDK.loadDoc({ docId: rows.document_id, id: cid })
    },
    async docEvents(rows) {
      let cid = this.docSDK.createUUID('document')
      this.currentCid = cid
      await this.$nextTick(() => {})
      this.initContainer({
        type: 'document',
        docId: rows.document_id,
        id: cid,
      })
      this.docSDK.selectContainer({ id: cid })
      await this.docSDK.loadDoc({
        docId: rows.document_id,
        id: cid,
        docType: 2,
      })
    },
    docSdkEvent() {
      // 下一步
      this.$EventBus.$on('nextStep', () => {
        console.log('nextStep下一步... ...')
        try {
          this.docSDK.nextStep({ id: this.currentCid })
        } catch (err) {
          console.log(err)
        }
      })
      // 上一步
      this.$EventBus.$on('prevStep', () => {
        console.log('prevStep上一步... ...')
        try {
          this.docSDK.prevStep({ id: this.currentCid })
        } catch (err) {
          console.log(err)
        }
      })
      this.$EventBus.$on('docSDK_ready', (docsdk) => {
        this.isDotEnd = false
        console.log('文档ready----go')
        this.docSDK = docsdk
        // 翻页事件
        this.docSDK.on(window.VHDocSDK.Event.PAGE_CHANGE, (event) => {
          console.log('页码改变')
          /* event内容
        {
          id:"document-5cbbb8f", // 当前选中的容器id
          info:{
              docType: "h5" // 演示的文档类型
              hash: "e4d67e902b9ecddd157ed3ffbadb6bc4" // 文档hash
              pageHash: "e4d67e902b9ecddd157ed3ffbadb6bc4/0" // 文档对应的pageHash
              slideIndex: 0 // 当前页码
              slidesTotal: 4 // 总页码
              stepIndex: 0 // 当前步数
              stepsAll: [1, 1, 1, 1,] 每页的总步数
              totalSteps: 1 // 当前页的总步数
            ｝
        ｝*/
          this.dotPageInfo.pageIndex = event.info.slideIndex + 1
          this.dotPageInfo.total = event.info.slidesTotal
        })
        this.docSDK.on(window.VHDocSDK.Event.PLAYBACKCOMPLETE, function (e) {
          console.log('播放完毕')
          this.isDotEnd = true
        })
        this.docSDK.on(VHDocSDK.Event.ALL_COMPLETE, (event) => {
          // 数据格式同  翻页事件 VHDocSDK.Event.PAGE_CHANGE
          console.log('=============所有文档加载完成==============', event)
          this.docLoadComplete = true
        })
        console.log('docSDK_ready', docsdk, this.$refs.doc)
      })
      // 文档页码
      this.$EventBus.$on('documenet_load_complete', (data) => {
        console.log('文档页码 documenet_load_complete', data)
        this.dotPageInfo = data
      })
    },
    // 初始化
    async initWebinarChat() {
      let result = await this.$fetch('msgInitConsole')
      if (result) {
        console.log(result, '值')
        let option = {
          appId: result.data.paasAppId || '', // appId 必须
          accountId: result.data.accountId || '', // 第三方用户ID
          channelId: this.channel_id || '', // 频道id 必须 => 活动的
          token: result.data.paasAccessToken || '', // 必须， token，初始化接口获取
          hide: true,
        }
        window.VhallChat.createInstance(
          option,
          (event) => {
            this.$WebinarChat = event.message // 聊天实例句柄
            this.monitor()
          },
          (err) => {
            // alert('初始化错误')
            console.error(err)
          }
        )
      }
    },
    // 监听
    monitor() {
      /**
       * 接收聊天自定义消息*/
      this.$WebinarChat.onCustomMsg(async (msg) => {
        try {
          if (typeof msg !== 'object') {
            msg = JSON.parse(msg)
          }
          if (typeof msg.context !== 'object') {
            msg.context = JSON.parse(msg.context)
          }
          if (typeof msg.data !== 'object') {
            msg.data = JSON.parse(msg.data)
          }
        } catch (e) {
          console.log(e)
        }
        console.log(
          '============收到活动下msg_center_num2===============' +
            JSON.stringify(msg.data)
        )
        if (msg.data.type === 'host_msg_webinar') {
          EventBus.$emit('host_msg_webinar', msg.data.data)
        }
        if (msg.data.type === 'doc_convert_jpeg') {
          EventBus.$emit('doc_convert_jpeg', msg.data.data)
        }
      })
    },
  },
  created() {
    // 如果存在活动Id，查询活动接口
    this.userId = JSON.parse(sessionOrLocal.get('userId'))
    let id = this.$route.params.str
    if (id) {
      this.getWebinarInfo()
    } else {
      this.channel_id =
        sessionOrLocal.get('SAAS_V3_CHANNEL_ID', 'localStorage') || ''
      this.initPage()
    }
  },
  mounted() {
    /* EventBus.$on('converted_process_msg', res => { // 转码进度
      // console.log(res, '监听到converted_process_msg转码进度事件');
      this.tableList.forEach((item) => {
        if (res.document_id === item.document_id && !item.transcoded) {
          item.codeProcess = Number(res.converted_process.replaceAll('%', ''));
        }
      });
    }); */
    function CalculatePercent(convert, total, dynamic_convert) {
      // 若总页数 > 0。注意convert 为 静态页数；dynamic_convert 为动态页数。
      total = total >= 1 ? total : 1
      let _percent =
        typeof dynamic_convert !== 'undefined'
          ? ((parseInt(convert) + parseInt(dynamic_convert)) / 2 / total) * 100
          : (parseInt(convert) / parseInt(total)) * 100
      return (_percent + '').substr(0, 4)
    }
    /* function getDocErrorText(error_status) {
        var textArr = {
            "500": "转换失败",
            "501": "文档打开失败",
            "502": "转换失败",
            "503": "文档不可用",
            "504": "文档受保护"
        };
        return textArr[error_status + ""];
    }*/
    EventBus.$on('doc_convert_jpeg', (res) => {
      // 转码状态
      console.log(res, '监听到doc_convert_jpeg转码状态事件')
      this.tableList.forEach((item) => {
        if (res.document_id === item.document_id) {
          const status = Number(res.status)
          if (status === 200) {
            // 判断是否动态版异常
            if (item.dataAnimateError) {
              item.transform_schedule_str = '动画版转换失败，请尝试极速版'
              item.codeProcess = 0
              item.transcoded = false
              item.isError = true
              item.dataAnimateError = true
            } else {
              let _percent = CalculatePercent(res.converted_page, res.page, 0)
              if (_percent == '100%') {
                item.transform_schedule_str = '转码成功'
                item.transcoded = true
                item.codeProcess = 100
                item.isError = false
              } else {
                item.transcoded = false
                item.codeProcess = _percent
                item.isError = false
              }
            }
          } else if (status === 100) {
            item.transcoded = false
            item.codeProcess = CalculatePercent(
              res.converted_page_jpeg,
              res.page,
              res.converted_page
            )
            item.isError = false
          } else if (status >= 500) {
            item.transform_schedule_str = '转码失败' // getDocErrorText(statusJpeg);
            item.transcoded = false
            item.codeProcess = 0
            item.isError = true
          }
          item.page = res.page || ''
        }
      })
    })

    EventBus.$on('host_msg_webinar', (res) => {
      // 转码状态
      console.log(res, '监听到host_msg_webinar转码状态事件')
      /*
        converted_page: "0" // 动态页数
        converted_page_jpeg: "1" // 静态页数
        document_id: "01b17b82" // 文档ID
        page: "1" // 文档总页数
        status: "200" // 动态转换状态 0待转换 100转换中 200完成 500失败
        status_jpeg: "200" // 静态转换状态 0待转换 100转换中 200完成 500失败
      */
      this.tableList.map((item) => {
        if (res.document_id === item.document_id) {
          const statusJpeg = res.status_jpeg * 1
          const status = res.status * 1
          if (statusJpeg === 0) {
            item.showEventType = 0
            item.fileStatusCss = 'wating'
            item.fileStatusStr = '等待转码'
            item.transform_schedule_str = `等待转码`
          } else if (statusJpeg === 100) {
            item.showEventType = 1
            item.transform_schedule_str = `` // 静态转码中
            let _percent =
              (parseInt(res.converted_page_jpeg) / parseInt(res.page)) * 100
            item.codeProcess = (_percent + '').substr(0, 4)
          } else if (statusJpeg === 200) {
            if (/pptx?/.test(item.ext)) {
              // 如果是ppt or pptx
              if (status === 0) {
                item.showEventType = 2
                item.fileStatusCss = 'wating'
                item.fileStatusStr = '等待转码'
                item.transform_schedule_str = `等待转码` // 静态转码完成，动态待转码
              } else if (status === 100) {
                item.showEventType = 3
                item.fileStatusCss = 'success'
                item.fileStatusStr = '动态转码中'
                item.transform_schedule_str = `静态转码成功<br/>动态转码中...` // 静态转码完成，动态转码中
              } else if (status === 200) {
                item.showEventType = 4
                item.fileStatusCss = 'success'
                item.fileStatusStr = '转码成功'
                item.transform_schedule_str = `静态转码成功<br/>动态转码成功` // 静态转码完成，动态转码完成
              } else {
                item.showEventType = 5
                item.fileStatusCss = 'failer'
                item.fileStatusStr = '转码失败'
                item.transform_schedule_str = `转码失败` // 静态转码完成，动态转码失败
              }
            } else {
              // 非PPT静态转码完成
              item.showEventType = 6
              item.fileStatusCss = 'success'
              item.fileStatusStr = '转码成功'
              item.transform_schedule_str = `静态转码成功` // 静态转码完成，动态转码失败
            }
          } else if (statusJpeg >= 500) {
            item.showEventType = 7
            item.fileStatusCss = 'failer'
            item.fileStatusStr = '转码失败'
            item.transform_schedule_str = `转码失败` // 静态转码失败
          }
          item.page = res.page || ''
        }
      })
    })
    this.docSdkEvent()
    // 初始化文档
    this._initDocSDK()
  },
  beforeDestroy() {
    console.log('docSDK消亡，chat消亡')
    if (this.vm) {
      this.vm.close()
      this.vm = null
    }
    if (this.docSDK) {
      this.docSDK.destroy()
      this.docSDK = null
    }
    if (this.$WebinarChat) {
      this.$WebinarChat.destroy()
      this.$WebinarChat = null
    }
  },
}
</script>
<style lang="less">
.el-tooltip__popper {
  max-width: 450px;
  // line-height: 17px;
}
</style>
<style lang="less" scoped>
.btn-upload {
  display: inline-block;
  margin-right: 16px;
  vertical-align: middle;
  /deep/.el-upload {
    width: auto;
    height: auto;
    line-height: unset;
    background: transparent;
    border: none;
  }
}
.word-list {
  width: 100%;
  .layout--right--main();
  .padding-table-list();
}
.word-wrap {
  height: 100%;
  .title_text {
    color: #999;
    font-size: 14px;
    padding-left: 10px;
    a {
      color: #3562fa;
      cursor: pointer;
    }
  }
  /deep/.el-card__body {
    padding: 32px 24px;
  }
  ::v-deep .vh-saas-dialog {
    .el-dialog {
      width: 960px !important;
      height: 623px;
      .el-dialog__body {
        height: calc(100% - 44px);
      }
      .el-dialog__header {
        padding-top: 10px;
      }
      .el-dialog__headerbtn {
        top: 15px;
      }
      .el-dialog--center .el-dialog__body {
        padding: 0 10px 10px;
      }
    }
  }
  .head-operat {
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    .head-btn {
      display: inline-block;
      margin-left: auto;
    }
    .el-input {
      width: 220px;
      .el-input__icon {
        cursor: pointer;
      }
      /deep/ .el-input__icon {
        line-height: 36px;
        color: #666;
      }
    }
    /deep/ .el-input__inner {
      user-select: none;
      border-radius: 50px;
      font-size: 14px;
      color: #666666;
      height: 36px;
      line-height: 36px;
      padding-right: 30px !important;
    }
    /deep/ .el-input__prefix {
      cursor: pointer;

      // /deep/ .el-input__icon {
      //   // width: auto;
      //   line-height: 38px;
      // }
    }
    ::v-deep.set-upload {
      position: relative;
      span {
        input {
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

/*预览弹出框*/
.preview-doc-dialog {
  /deep/.el-dialog__header {
    padding: 0 0;
  }
  /deep/.el-dialog__headerbtn {
    top: -20px;
    right: 0;
    i.el-dialog__close {
      font-size: 10px;
      color: #ffffff;
    }
  }
  /deep/.el-dialog__body {
    padding: 4px 4px 0 4px;
  }
  /deep/.el-loading-mask {
    border-radius: 4px;
  }
  .preview-box {
    width: 100%;
    height: 396px;
  }
  .preview-doc {
    width: 100%;
    height: 396px;
    img {
      width: 100%;
      height: 100%;
      object-fit: scale-down;
    }
  }
  .preview-pages {
    height: 46px;
    line-height: 46px;
    text-align: center;
    span {
      display: inline-block;
      vertical-align: middle;
      font-size: 14px;
      font-weight: 400;
      color: #1a1a1a;
    }
    .left {
      margin-right: 8px;
      color: #1a1a1a;
      cursor: pointer;
    }
    .right {
      margin-left: 8px;
      color: #1a1a1a;
      cursor: pointer;
    }
    .current {
      color: #1a1a1a;
    }
    .side {
      color: #999999;
      padding: 0 3px;
    }
    .total {
      color: #999999;
    }
  }
}
.upload-dialog-content {
  overflow: hidden;
}
.dialog-right-btn {
  text-align: right;
  margin-bottom: 24px;
  margin-top: 24px;
}
.loadingWrap {
  width: 736px;
  height: 458px;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
