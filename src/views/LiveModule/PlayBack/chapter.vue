<template>
  <div>
    <pageTitle title="章节打点">
      <div slot="content">
        章节功能支持文档格式：PPT、PPTX，其他格式不支持
      </div>
    </pageTitle>
    <div class="contentView" v-loading="loading">
      <div class="playerBox">
        <!-- v-if="docSDKReady" -->
        <player ref="player" v-if="docSDKReady"  v-bind="playerProps" :autoPlay="false" :playerParams="playerParams"></player>
        <div v-show="docSDKReady" class="vhallPlayer-container">
          <div class="vhallPlayer-progress-box">
            <el-slider
              v-model="sliderVal"
              :show-tooltip="false"
              ref="controllerRef"
              @change="setVideo"
            ></el-slider>
          </div>
          <div class="vhallPlayer-controller-box">
            <div class="v-c-left">
              <div class="vh-video-chapter__operate">
                <span @click="seekBack" class="vh-btn vh-video-chapter__seek-back">
                  <icon icon-class="saasicon_shangyimiao"></icon>
                </span>
                <span
                  @click="videoPlayBtn"
                  class="vh-btn vh-video-chapter__play"
                  :class="{ 'is-pause': statePaly }"
                >
                  <icon :icon-class="statePaly ? 'saasicon_bofang' : 'saasicon_zanting'"></icon>
                </span>
                <span @click="seekForward" class="vh-btn vh-video-chapter__seek-forward">
                  <icon icon-class="saasicon_xiayimiao"></icon>
                </span>
              </div>

            </div>
            <div class="vhallPlayer-time-component">
              <span class="vh-video-chapter__time">
                <span class="vh-video-chapter__hover-time">{{ showTime }}</span>
                /
                {{ showVideoTime }}
              </span>
            </div>
            <div class="vh-video-chapter__volume-box">
              <span @click="jingYin" class="vh-video-chapter__icon-voice-warp">
                <icon style="color:#fff" :icon-class="voice > 0 ? 'saasicon_yangshengqion' : 'saasicon_yangshengqioff'"></icon>
              </span>
              <div class="vh-video-chapter__slider">
                <el-slider v-model="voice" :show-tooltip="false" vertical height="90px"></el-slider>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="docBox">
        <div class="docInner">
          <doc
            v-if="showDoc"
            ref="doc"
            :webinarId='webinar_id'
            :isInteract="true"
            :roleType="2"
            :roomId="playerProps.roomId"
            :channelId="playerProps.channel_id"
            :appId="playerProps.appId"
            :token="playerProps.token"
            :liveStatus="2"
            :joinId="playerProps.accountId"
            :accountId="playerProps.accountId"
            :isVod="true"
            :preloadDocs="true"
          ></doc>
        </div>
        <div class="actionBar">
          <span class="pages">
            <span class="translatePage">
              <i class="el-icon-arrow-left" @click="prevPage"></i>
            </span>
            <em> {{pageInfo.pageIndex}}</em>/{{pageInfo.total}}
            <span class="translatePage">
              <i class="el-icon-arrow-right" @click="nextPage"></i>
            </span>
          </span>
          <span class="docs">
            <i class="el-icon-arrow-left" @click="prevDoc"></i>
            <i class="el-icon-arrow-right" @click="nextDoc"></i>
          </span>
          <!-- <span class="thumbnail"></span> -->
        </div>
      </div>
    </div>
    <div class="cont">
      <div class="btnGroup">
        <el-button v-if="isDemand == 'true'" size="medium" type="primary" round @click="associateHandler">关联文档</el-button>
        <!-- <el-button v-if="isDemand == 'true'" size="medium" round @click="addChapter">新增章节</el-button> -->
        <el-dropdown style="margin: 0 10px;" trigger="click" v-if="isDemand == 'true'" @command="addChapter">
          <el-button :disabled="tableData.length == 0" size="medium" round>
            新增章节<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item in docs"
              :key="item.document_id"
              :command="item"
            >{{ item.file_name }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button :disabled="!selectedData.length" size="medium" round @click="deleteChapter">批量删除</el-button>
        <div class="right">
          <el-button :disabled="tableData.length == 0" size="medium" round @click="saveChapters">保存</el-button>
          <el-button size="medium" round @click="previewChapters">预览</el-button>
        </div>
      </div>
      <el-table
        ref="chapterTable"
        :data.sync="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        :tree-props="{children: 'sub'}"
        default-expand-all
        row-key="index"
      >
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          prop="index"
          width="120">
        </el-table-column>
        <el-table-column
          label="章节标题">
          <template slot-scope="scope">
            <el-input v-model="scope.row.title" placeholder="请输入章节标题"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="文档页码"
          width="110">
           <template slot-scope="scope">
             <el-input :disabled="isDemand == 'false'" @input="handleInput(scope.row)" v-model="scope.row.slideIndex" placeholder="请输入文档页码"></el-input>
           </template>
        </el-table-column>

        <el-table-column
          label="章节时间"
          width="126"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input :disabled="isDemand == 'false'" v-model="scope.row.userCreateTime" @change="scope.row.isChange = true" placeholder="请输入章节时间"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          v-if="isDemand == 'true'"
          label="操作"
          width="190"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="getTime(scope.row)">获取时间</el-button>
            <el-button v-if="scope.row.sub" type="text" @click="addSonNode(scope.row)">添加子章节</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <associateDoc :tableDataLength="tableData.length" @getChapters="getChapters" ref="associateDialog"></associateDoc>
    <div v-if="previewVisible" class="wraper">
      <div class="preViewChapters">
        <span class="close" @click="closePreview">&times;</span>
        <iframe width="100%" height="100%" :src="`${VUE_APP_WEB_URL}/previewChapter/${webinar_id}?recordId=${recordId}`" frameborder="0"></iframe>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import player from '@/components/Player_1';
import doc from '@/components/Doc/watch-doc';
import associateDoc from './associatedDoc';
import { debounce } from "@/utils/utils"
export default {
  name: 'Chapters',
  data(){
    return {
      loading: false,
      VUE_APP_WEB_URL: process.env.VUE_APP_WEB_URL,
      recordId: this.$route.query.recordId,
      webinar_id: this.$route.params.str,
      isDemand: this.$route.query.isDemand,
      showDoc: false,
      userId: window.sessionStorage.getItem('userId'),
      playerProps: {},
      docIds: [],
      docs: [],
      playerParams: {
        subtitleOption: {
          enable: true
        }
      },
      docSDKReady: false,
      docsdk: {},
      pageInfo: {pageIndex: 0, total: 0},
      tableData: [],
      selectedData: [],
      previewVisible: false,
      docToolStatus: {
        docToolActive: '',
        hb: {
          width: 7,
          color: '#FD2C0A'
        },
        ygb: {
          width: 7,
          color: '#FD2C0A'
        },
        graph: {
          color: '#FD2C0A',
          value: 'setCircle'
        },
        font: {
          width: '18',
          color: '#FD2C0A'
        }
      },
      sliderVal: 0, // 视频时间
      statePaly: false, // 默认播放状态
      currentTime: 0, // 当前视频播放时间
      voice: 60, // 音量
      catchVoice: 0,
      videoTime: 0 // 视频实际时长
    };
  },
  provide () {
    return {
      docToolStatus: this.docToolStatus
    };
  },
  computed: {
    docInfo(){
      console.log('docInfo', this.docsdk._currentDoc ? this.docsdk._currentDoc.getDocInfo() : {toal: 0, current:0});
      return 1234;
    },
    /**
     * 视频当前播放时长初始化
     */
    showTime () {
      return this.formatTime(Math.round(this.currentTime) * 1);
    },
    /**
     * 视频总时长格式化
     */
    showVideoTime () {
      return this.formatTime(this.videoTime * 1);
    },
  },
  watch: {
    /**
     * 设置视频声音
     */
    // eslint-disable-next-line no-unused-vars
    voice (newVal, oldVal) {
      window.vhallPlayer.setVolume(newVal, () => {
        console.log('设置音量失败');
      });
    },
  },
  created(){
    this.loading = true;
    setTimeout(() => {
      this.checkChapterSave()
      this.getPlayBackInfo()
    }, 300)
    this.$EventBus.$on('all_complete', () => {
      this.loading = false;
    });
    this.$EventBus.$on('docSDK_ready', docsdk=>{
      // setTimeout(()=>{
        this.docSDKReady = true;
      // }, 3000);
      this.docsdk = docsdk;
      this.docsdk.on(window.VHDocSDK.Event.PAGE_CHANGE, event => {
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
        this.pageInfo.pageIndex= event.info.slideIndex+1;
        this.pageInfo.total= event.info.slidesTotal;
      });
      console.log('docSDK_ready', docsdk, this.$refs.doc);
    });
    // this.$EventBus.$on('component_docSDK_ready', docsdk=>{
    //   this.docSDKReady = true;
    //   this.docsdk = docsdk;
    //   console.log('component_docSDK_ready', docsdk, this.$refs.doc);
    // });
    // 监听视频初始化成功
    this.$EventBus.$on('component_playerSDK_ready', ()=>{
      console.log('component_playerSDK_ready');
      setTimeout(() => {
        // 动态获取当前视频的总时长及当前播放的时间 当做刻度尺值，弱播放时间小于1200秒，则刻度尺最小赋值为1200秒
        this.videoTime = Math.round(window.vhallPlayer.getDuration());
        this.$EventBus.$emit('blockInit', 0, this.videoTime);
        window.vhallPlayer.on(window.VhallPlayer.TIMEUPDATE, () => {
          this.currentTime = window.vhallPlayer.getCurrentTime(() => {
            console.log('获取当前视频播放时间失败----------');
          });
          this.sliderVal = this.currentTime / this.videoTime * 100;
        });
      }, 100);
      window.vhallPlayer.on(window.VhallPlayer.PLAY, () => {
        // 监听播放状态
        this.statePaly = true;
      });
      window.vhallPlayer.on(window.VhallPlayer.PAUSE, () => {
        // 监听暂停状态
        this.statePaly = false;
      });
      this.vodReady = true;
    });

    this.$EventBus.$on('documenet_load_complete', (data)=>{
      console.log('documenet_load_complete', data);
      this.pageInfo = data;
    });

    // 监听文档加载完毕
    this.$EventBus.$on('vod_cuepoint_load_complete', chapters => {
      const ids = []
      console.log("=============所有文档加载完毕==============", chapters)
      this.tableData = chapters.map((item, index) => {
        ids.push(item.docId);
        return {
          ...item,
          index: index + 1,
          userCreateTime: this.secondsFormmat(item.createTime),
          isChange: false,
          slideIndex: item.slideIndex + 1,
          stepIndex: item.stepIndex,
          sub: item.sub.map((subItem, subIndex) => ({
            ...subItem,
            slideIndex: subItem.stepIndex, // 由于列表中统一使用 slideIndex 字段显示修改，所以，对于子章节，使用 slideIndex
            stepIndex: subItem.slideIndex + 1, // 代替 stepIndex ，使用 stepIndex 代替 slideIndex ，保存的时候会反向处理。
            userCreateTime: this.secondsFormmat(subItem.createTime),
            index: `${index + 1}-${subIndex + 1}`,
            isChange: false
          }))
        }
      });
      this.docIds = [...new Set(ids)]
      this.getDocTitles();
    });
  },
  mounted(){

  },
  beforeDestroy(){
    this.$EventBus.$off('docSDK_ready');
    this.$EventBus.$off('component_playerSDK_ready');
    this.$EventBus.$off('component_page_info');
    this.$EventBus.$off('vod_cuepoint_load_complete');
  },
  methods: {
    handleInput(value) {
      if (value.slideIndex.length == 0) return;
      const pattern = /^[1-9][0-9]*$/ // 正整数的正则表达式
      if (!pattern.test(value.slideIndex)) {
        value.slideIndex = value.slideIndex.slice(0, value.slideIndex.length - 1)
        this.$message.warning(`页码只能是整数`)
      }
    },
    /**
     * 时间格式化
     * 将秒转化为hh:mm:ss显示
     * value 刻度尺格数
     * currentUnit当前时间转换比例
     */
    formatTime(value) {
      // value = parseInt(value) * currentUnit
      var hh = Math.floor(value / 3600);
      if (hh < 10) hh = '0' + hh;
      var mm = Math.floor((value - hh * 3600) / 60);
      if (mm < 10) mm = '0' + mm;
      var ss = Math.floor((value - hh * 3600) % 60);
      if (ss < 10) ss = '0' + ss;
      var length = hh + ':' + mm + ':' + ss;
      if (value >= 0) {
        return length;
      } else {
        return '';
      }
    },
    /**
     * 后退一秒
     */
    seekBack () {
      if (this.vodReady) {
        this.currentTime = parseInt(
          window.vhallPlayer.getCurrentTime(() => {
            console.log('获取当前视频播放时间失败----------');
          })
        );
        window.vhallPlayer.setCurrentTime(this.currentTime - 1);
      }
    },
    /**
     * 前进一秒
     */
    seekForward () {
      if (this.vodReady) {
        this.currentTime = parseInt(
          window.vhallPlayer.getCurrentTime(() => {
            console.log('获取当前视频播放时间失败----------');
          })
        );
        window.vhallPlayer.setCurrentTime(this.currentTime + 1);
      }
    },
    /**
     * 快进功能
     */
    setVideo () {
      const time = this.sliderVal / 100 * this.videoTime;
      this.setVideoCurrentTime(time);
      this.play();
    },
    /**
     * 设置播放时间
     */
    setVideoCurrentTime (val) {
      window.vhallPlayer && window.vhallPlayer.setCurrentTime(val);
    },
    /**
     * 静音/取消静音
     */
    jingYin () {
      if (this.voice == 0) {
        this.voice = this.catchVoice;
      } else {
        this.catchVoice = this.voice;
        this.voice = 0;
      }
    },
    /**
     * 播放||暂停
     */
    videoPlayBtn () {
      if (this.vodReady) {
        if (window.vhallPlayer.getIsPause()) {
          this.play();
        } else {
          this.pause();
        }
      }
    },
    /**
     *  开始播放旁路
     */
    play () {
      window.vhallPlayer && window.vhallPlayer.play();
    },
    /**
     * 暂停
     */
    pause () {
      window.vhallPlayer && window.vhallPlayer.pause();
    },
    getDocTitles() {
      if (!this.docIds.length) return false;
      const taskList = []
      this.docIds.map(item => {
        taskList.push(
          new Promise((resolve, reject) => {
            this.$fetch('getWordDetail', {
              document_id: item
            }).then(res => {
              resolve(res.data)
            }).catch(err => {
              console.log(err)
            })
          })
        )
      })
      Promise.all(taskList).then((result) => {
        console.log(result)
        this.docs = result
      }).catch((error) => {
        console.log(error)
      })
    },
    checkChapterSave() {
      this.$fetch('checkChapterSave', {
        record_id: this.recordId
      }).then(res => {
        if (res.data && res.data.chatper_callbanck_status == 0) {
          this.$message.warning('上次章节保存任务尚未完成，当前章节信息为为保存章节')
        }
      })
    },
    closePreview() {
      this.previewVisible = false;
    },
    previewChapters() {
      window.scrollTo(0, 0);
      this.previewVisible = true;
      this.$refs.player.$PLAYER.pause();
    },
    saveChapters() {
      debounce(() => {
        const createTimeArr = [];
        console.log('tableData', this.tableData)
        const doc_titles = this.tableData.map(item => {
          createTimeArr.push(item.isChange ? this.secondsReverse(item.userCreateTime) : item.createTime)
          return {
            document_id: item.docId,
            created_at: item.isChange ? this.secondsReverse(item.userCreateTime) : item.createTime,
            page: item.slideIndex - 1,
            step: item.stepIndex,
            title: item.title,
            remark: '',
            step_total: item.sub.length,
            subsection: item.sub.map(subItem => {
              createTimeArr.push(subItem.isChange ? this.secondsReverse(subItem.userCreateTime) : subItem.createTime)
              return {
                document_id: item.docId,
                created_at: subItem.isChange ? this.secondsReverse(subItem.userCreateTime) : subItem.createTime,
                page: subItem.stepIndex - 1, // 由于列表中统一使用 slideIndex 字段显示修改，所以，对于子章节，使用 slideIndex
                step: subItem.slideIndex, // 代替 stepIndex ，使用 stepIndex 代替 slideIndex ，保存的时候会反向处理。
                title: subItem.title,
                remark: '',
                step_total: 0
              }
            })
          }
        })
        const createTimeArrSet = new Set(createTimeArr);
        if (createTimeArrSet.size < createTimeArr.length) return this.$message.error('章节时间点不能重复');
        console.log(doc_titles)
        console.log('isDemand', this.isDemand ? 2 : 1)
        this.$fetch('saveChapters', {
          record_id: this.recordId,
          type: this.isDemand == 'true' ? 2 : 1,
          doc_titles: JSON.stringify(doc_titles)
        }).then(res => {
          if (res.code == 200) {
            this.$message.success('保存成功');
            this.$router.go(-1);
          } else if (res.code == 12563) {
            // 保存章节是异步任务，存储的时候需要判断上次存储是否完成
            this.$message.warning('上次保存尚未完成,请稍后提交保存');
          } else if (res.code == 12027) {
            // 保存章节是异步任务，存储的时候需要判断上次存储是否完成
            this.$message.warning('保存失败，子章节页码超出章节总步数');
          } else {
            this.$message.warning('保存失败');
          }
        })
      }, 500)
    },
    getPlayBackInfo() {
      this.$fetch('playBackPreview', {
        webinar_id: this.webinar_id,
        record_id: this.recordId,
        type: 0
      }).then(res => {
        console.log(res)
        const data = res.data
        this.playerProps = {
          appId: data.paasAppId,
          channelId: data.doc.channelId,
          roomId: data.doc.roomId,
          accountId: data.accountId,
          // watchAccountId: '10000128',
          token: data.paasAccessToken,
          recordId: data.player.paasRecordId,
          nickName: '123',
          type: data.player.type,
          channel_id: data.doc.channelId,
          vodOption: {
            recordId: data.player.paasRecordId
          },
          openPlayerUI: false,
          playerInfo: {}
        }
        this.showDoc = true
      })
    },
    getChapters(tableSelect) {
      this.$fetch('playBackChaptersGet', {
        document_id: tableSelect.join(',')
      }).then(res => {
        const ids = []
        this.tableData = res.data.doc_titles.map((item, index) => {
          ids.push(item.document_id);
          return {
            createTime: 0,
            docId: item.document_id,
            slideIndex: item.page + 1,
            stepIndex: item.step,
            title: item.title,
            index: index + 1,
            userCreateTime: '00:00:00',
            isChange: true,
            sub: item.subsection.length ?
              item.subsection.map((subItem, subIndex) => ({
                createTime: 0,
                docId: subItem.document_id,
                stepIndex: subItem.page + 1, // 由于列表中统一使用 slideIndex 字段显示修改，所以，对于子章节，使用 slideIndex
                slideIndex: subItem.step, // 代替 stepIndex ，使用 stepIndex 代替 slideIndex ，保存的时候会反向处理。
                title: subItem.title,
                index: `${index + 1}-${subIndex + 1}`,
                userCreateTime: '00:00:00',
                isChange: true,
              })) : []
          }
        })
        this.docIds = [...new Set(ids)];
        this.getDocTitles();
      })
    },
    prevPage(){
      this.$EventBus.$emit('prevStep');
    },
    nextPage(){
      this.$EventBus.$emit('nextStep');
    },
    prevDoc(){
      this.$EventBus.$emit('prevDoc');
    },
    nextDoc(){
      this.$EventBus.$emit('nextDoc');
    },
    handleSelectionChange(val){
      this.selectedData = val;
    },
    addChapter(doc){
      // const currentContainerInfo = this.docsdk._currentDoc._currentContainer;
      this.tableData.push({
        title: '',
        createTime: this.secondsFormmat(this.$refs.player.$PLAYER.getCurrentTime()),
        userCreateTime: this.secondsFormmat(this.$refs.player.$PLAYER.getCurrentTime()),
        isChange: true,
        index: this.tableData.length + 1,
        stepIndex: 1,
        slideIndex: 1,
        sub: [],
        docId: doc.document_id,
        cid: '',
        // cid: currentContainerInfo._id,
        hash: doc.hash
      });
    },
    deleteChapter(){
      if(!this.selectedData.length > 0) return this.$message.warning('请选择要删除的章节');
      this.$confirm('删除后章节不可恢复，确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(()=>{
        const temp = this.tableData.filter(item => {
          if (this.selectedData.some(selectItem => selectItem.index == item.index)) {
            return false;
          } else {
            if (item.sub.length > 0) {
              item.sub = item.sub.filter(subItem => {
                if (this.selectedData.some(selectItem => selectItem.index == subItem.index)) {
                  return false;
                }
                return true;
              })
            }
            return true;
          }
        });
        if (temp.length === 0) {
          this.tableData[0].sub = []
          this.tableData = [this.tableData[0]]
          this.$message.warning('至少保留一个章节')
        } else {
          this.tableData = temp
        }
        this.handleSerialize()
      }).catch(()=>{});
    },
    handleSerialize() {
      this.tableData.forEach((item, index) => {
        item.index = '' + (index + 1);
        if (item.sub.length > 0) {
          item.sub.forEach((subItem, subIndex) => {
            subItem.index = `${index + 1}-${subIndex + 1}`
          })
        }
      })
    },
    getTime(row){
      // 时间为秒数，四舍五入取整数
      row.userCreateTime = this.secondsFormmat(this.$refs.player.$PLAYER.getCurrentTime());
      row.isChange = true
      // row.createTime = this.$refs.player.$PLAYER.getCurrentTime();
    },
    // 添加子章节
    addSonNode(row) {
      row.sub.push({
        title: '',
        createTime: this.secondsFormmat(this.$refs.player.$PLAYER.getCurrentTime()),
        userCreateTime: this.secondsFormmat(this.$refs.player.$PLAYER.getCurrentTime()),
        index: `${row.index}-${row.sub.length + 1}`,
        stepIndex: row.slideIndex,
        slideIndex: 1,
        docId: row.docId,
        cid: '',
        hash: '',
        isChange: true
      })
    },
    associateHandler(){
      this.$refs.associateDialog.dialogVisible = true;
    },
    // 格式化秒数为时分秒 s => hh:mm:ss
    secondsFormmat(val){
      val = Number(val);
      val = Math.floor(val)
      if(isNaN(val)) return val;
      const hours = parseInt(val/3600);
      const minutes = parseInt(val/60) - (hours*60);
      const seconds = val % 60;
      return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    },
    // 格式化时分秒为秒数 hh:mm:ss => s
    secondsReverse(val){
      const hours = val.split(':')[0];
      const minutes = val.split(':')[1];
      const seconds = val.split(':')[2];
      const s = Number(hours*3600) + Number(minutes*60) + Number(seconds);
      return s;
    },
  },
  components: {
    PageTitle,
    player,
    doc,
    associateDoc,
  }
};
</script>

<style lang="less" scoped>
  .wraper{
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,.5);
    top: 0;
    left: 0;
    z-index: 22;
    display: flex;
    justify-content: center;
    .preViewChapters {
      margin-top: 200px;
      min-height: 320px;
      width: 960px;
      height: 600px;
      background: #222;
      position: relative;
      .close {
        color: #FFFFFF;
        position: absolute;
        right: 0;
        top: -30px;
        font-size: 25px;
        cursor: pointer;
      }
    }
  }
  .contentView{
    padding: 24px;
    background: #222222;
    display: flex;
    min-height: 320px;
    justify-content: space-between;
    >div{
      flex: 1;
    }
    .docBox{
      display: flex;
      flex-direction: column;
      .docInner{
        height: 100%;
        background-color: #292929;
      }
    }
    .actionBar{
      height: 48px;
      background: #000;
      text-align: center;
      line-height: 48px;
      padding: 0 16px;
      position: relative;
      .translatePage{
        i{
          color: #999999;
          cursor: pointer;
        }
      }
      .pages{
        display: block;
        color: #666;
        font-size: 14px;
        em{
          color: #fff;
          font-style: normal;
        }
      }
      .docs{
        position: absolute;
        right: 10px;
        top: 0px;
        i{
          color: #999999;
          cursor: pointer;
        }
      }
    }
    /deep/ .vhallPlayer-container{
      position: relative;
      visibility: visible;
      opacity: 1;
      z-index: 2;
      // display: block !important;
      .vhallPlayer-progress-container .vhallPlayer-progress-play{
        background: #FB3A32;
      }
      .vhallPlayer-verticalSlider-popup .vhallPlayer-verticalSlider-box .verticalSlider-range .verticalSlider-value{
        background: #FB3A32;
      }
      .vhallPlayer-progress-box{
        .el-slider__runway {
          margin: 0;
        }
      }
    }
    .playerBox{
      width: 480px;
      margin-right: 10px;
      /deep/ .vh-player .vhallPlayer-controller-box{
        display: flex;
        justify-content: space-between;
      }
      .vhallPlayer-controller-box{
        background: #000;
      }
      .vh-video-chapter__operate {
        height:72px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .vh-video-chapter__time {
        line-height: 21px;
        color: #666666;
        font-size: 14px;
        .vh-video-chapter__hover-time {
          color: #ffffff;
        }
      }
      .vh-video-chapter__volume-box {
        position: relative;
        width: 60px;
        height: 28px;
        line-height: 40px;
        float: right;
        display: flex;
        align-items: center;
        justify-content: center;
        .vh-iconfont {
          display: inline-block;
          font-size: 22px;
          color: #FAFAFA;
          cursor: pointer;
          &:hover {
            color: #1890FF;
          }
        }
        .vh-video-chapter__icon-voice-warp {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 28px;
          &:hover {
            & + .vh-video-chapter__slider {
              display: block;
            }
          }
        }
        .vh-video-chapter__slider {
          display: none;
          width: 70px;
          position: absolute;
          z-index: 3;
          right: -8px;
          top: -110px;
          padding: 0 10px;
          &:hover {
            display: inline-block;
          }
          .el-slider{
            width: 40px;
            background: rgba(0,0,0,0.81);
            border-radius: 4px;
            padding: 10px 0;
            /deep/ .el-slider__runway{
              margin: 0 18px;
              width: 4px;
              background: #333;
              .el-slider__bar {
                background-color: #E18B2E;
                width: 4px;
              }
            }
          }
          .el-slider.is-vertical .el-slider__button-wrapper {
            left: -16px;
            .el-slider__button {
              width: 8px;
              height: 8px;
              border: none;
              box-shadow: 0px 0px 6px 0px rgba(30, 137, 228, 0.8);
              background: #ececec;
            }
          }
        }
        /deep/ .el-slider__button-wrapper{
          left: -16px;
        }
      }
      /deep/ .el-slider__button {
        width: 8px;
        height: 8px;
        border: none;
        box-shadow: 0px 0px 6px 0px rgba(30, 137, 228, 0.8);
        background: #ececec;
      }
      .vh-btn {
        display: inline-block;
        cursor: pointer;
        background-repeat: no-repeat;
        vertical-align: middle;
        &.vh-video-chapter__seek-back {
          width: 18px;
          height: 14px;
          line-height: 14px;
          background-size: 16px 13px;
          margin-left: 0px;
          /deep/ i {
            color: #999;
            font-size: 14px;
            &:hover {
              color: #fff;
            }
          }
        }
        &.vh-video-chapter__play {
          width: 20px;
          height: 21px;
          background-size: 20px 22px;
          margin: 0 16px;
          line-height: 21px;
          /deep/ i {
            color: #999;
            font-size: 18px;
            &:hover {
              color: #fff;
            }
          }
        }
        &.vh-video-chapter__seek-forward {
          width: 18px;
          height: 14px;
          line-height: 14px;
          background-size: 16px 13px;
          /deep/ i {
            color: #999;
            font-size: 14px;
            &:hover {
              color: #fff;
            }
          }
        }
      }
    }
    // /deep/ .v-c-right{
    //   >*:not(.vhallPlayer-volume-component){
    //     display: none;
    //   }
    // }
    /deep/ .vh-doc__wrap{
      background-color: #666;
    }
  }

  .cont{
    padding: 24px;
    background: #fff;
    .el-table{
      margin-top: 24px;
    }
    /* /deep/ .el-table__header{
      th{
        background: #F7F7F7;
      }
    } */
    .el-input {
      width: 95%;
    }
    /deep/ .el-tooltip .el-button--text span:hover {
      color: #3562fa;
    }
  }
  .right{
    float: right;
  }
  /deep/ .saasicon_yangshengqion {
    font-size: 18px;
  }
</style>
