<template>
  <div>
    <pageTitle title="章节打点">
      <div slot="content">
        章节功能支持文档格式：PPT、PPTX，其他格式不支持
      </div>
    </pageTitle>
    <div class="contentView">
      <div class="playerBox">
        <!-- v-if="docSDKReady" -->
        <player ref="player" v-if="docSDKReady"  v-bind="playerProps" :playerParams="playerParams"></player>
      </div>
      <div class="docBox">
        <div class="docInner">
          <doc
            v-if="showDoc"
            ref="doc"
            :webinarId='webinar_id'
            docPermissionId="no"
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
          ></doc>
        </div>
        <div class="actionBar">
          <span class="translatePage">
            <i class="el-icon-arrow-left" @click="prevPage"></i>
            <i class="el-icon-arrow-right" @click="nextPage"></i>
          </span>
          <span class="pages">
            <em>{{pageInfo.pageIndex}}</em>/{{pageInfo.total}}
          </span>
        </div>
      </div>
    </div>
    <div class="cont">
      <div class="btnGroup">
        <el-button v-if="isDemand == 'true'" size="medium" type="primary" round @click="associateHandler">关联文档</el-button>
        <!-- <el-button v-if="isDemand == 'true'" size="medium" round @click="addChapter">新增章节</el-button> -->
        <el-dropdown style="margin: 0 10px;" trigger="click" v-if="isDemand == 'true'" @command="addChapter">
          <el-button size="medium" round>
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
          <el-button size="medium" round @click="saveChapters">保存</el-button>
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
             <el-input :disabled="isDemand == 'false'" v-model="scope.row.slideIndex" placeholder="请输入文档页码"></el-input>
           </template>
        </el-table-column>

        <el-table-column
          label="章节时间"
          width="126"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input :disabled="isDemand == 'false'" v-model="scope.row.createTime" placeholder="请输入章节时间"></el-input>
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
export default {
  name: 'Chapters',
  data(){
    return {
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
    }
  },
  created(){
    this.checkChapterSave()
    this.getPlayBackInfo()
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

    this.$EventBus.$on('component_playerSDK_ready', ()=>{
      console.log('component_playerSDK_ready');
    });

    this.$EventBus.$on('component_page_info', ()=>{
      console.log('component_page_info', this.$refs.doc.pageInfo);
      this.pageInfo = this.$refs.doc.pageInfo;
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
          createTime: this.secondsFormmat(item.createTime),
          sub: item.sub.map((subItem, subIndex) => ({
            ...subItem,
            createTime: this.secondsFormmat(subItem.createTime),
            index: `${index + 1}-${subIndex + 1}`
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
    getDocTitles() {
      if (!this.docIds.length) return fasle;
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
      const createTimeArr = [];
      console.log('tableData', this.tableData)
      const doc_titles = this.tableData.map(item => {
        createTimeArr.push(this.secondsReverse(item.createTime))
        return {
          document_id: item.docId,
          created_at: this.secondsReverse(item.createTime),
          page: item.slideIndex,
          step: item.stepIndex,
          title: item.title,
          remark: '',
          step_total: item.sub.length,
          subsection: item.sub.map(subItem => {
            createTimeArr.push(this.secondsReverse(subItem.createTime))
            return {
              document_id: subItem.docId,
              created_at: this.secondsReverse(subItem.createTime),
              page: subItem.slideIndex,
              step: subItem.stepIndex,
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
            createTime: '00:00:00',
            docId: item.document_id,
            slideIndex: item.page,
            stepIndex: item.step,
            title: item.title,
            index: index + 1,
            sub: item.subsection.length ?
              item.subsection.map((subItem, subIndex) => ({
                createTime: '00:00:00',
                docId: subItem.document_id,
                slideIndex: subItem.page,
                stepIndex: subItem.step,
                title: subItem.title,
                index: `${index + 1}-${subIndex + 1}`
              })) : []
          }
        })
        this.docIds = [...new Set(ids)];
        this.getDocTitles();
      })
    },
    prevPage(){
      this.docsdk.prevPage({id: document.querySelector('.docInner .doc-box').id});
    },
    nextPage(){
      this.docsdk.nextPage({id: document.querySelector('.docInner .doc-box').id});
    },
    handleSelectionChange(val){
      this.selectedData = val;
    },
    addChapter(doc){
      const currentDocInfo = this.docsdk._currentDoc.getDocInfo();
      const currentContainerInfo = this.docsdk._currentDoc._currentContainer;
      this.tableData.push({
        title: '',
        createTime: this.secondsFormmat(this.$refs.player.$PLAYER.getCurrentTime()),
        index: this.tableData.length + 1,
        stepIndex: 0,
        slideIndex: 0,
        sub: [],
        docId: doc.document_id,
        cid: currentContainerInfo._id,
        hash: doc.hash
      });
    },
    deleteChapter(){
      if(!this.selectedData.length > 0) return this.$message.warning('请选择要删除的章节');
      this.$confirm('删除后章节不可恢复，确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box'
      }).then(()=>{
        this.tableData = this.tableData.filter(item => {
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
      row.createTime = this.secondsFormmat(this.$refs.player.$PLAYER.getCurrentTime());
      // row.createTime = this.$refs.player.$PLAYER.getCurrentTime();
    },
    // 添加子章节
    addSonNode(row) {
      const currentDocInfo = this.docsdk._currentDoc.getDocInfo();
      console.log(currentDocInfo)
      const currentContainerInfo = this.docsdk._currentDoc._currentContainer;
      row.sub.push({
        title: '',
        createTime: this.secondsFormmat(this.$refs.player.$PLAYER.getCurrentTime()),
        index: `${row.index}-${row.sub.length + 1}`,
        stepIndex: currentDocInfo.stepIndex,
        slideIndex: currentDocInfo.slideIndex,
        docId: currentDocInfo.docId,
        cid: currentContainerInfo._id,
        hash: currentDocInfo.hash
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
      .translatePage{
        float: left;
        i{
          color: #999999;
          cursor: pointer;
        }
      }
      .pages{
        color: #666;
        font-size: 14px;
        em{
          color: #fff;
          font-style: normal;
        }
      }
    }
    /deep/ .vhallPlayer-container{
      position: relative;
      visibility: visible;
      opacity: 1;
      z-index: 2;
      display: block !important;
      .vhallPlayer-progress-container .vhallPlayer-progress-play{
        background: #FB3A32;
      }
      .vhallPlayer-verticalSlider-popup .vhallPlayer-verticalSlider-box .verticalSlider-range .verticalSlider-value{
        background: #FB3A32;
      }
    }
    .playerBox{
      width: 480px;
      margin-right: 10px;
    }
    /deep/ .v-c-right{
      >*:not(.vhallPlayer-volume-component){
        display: none;
      }
    }
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
    /deep/ .el-table__header{
      th{
        background: #F7F7F7;
      }
    }
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
</style>
