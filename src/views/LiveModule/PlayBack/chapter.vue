<template>
  <div>
    <pageTitle title="章节打点"></pageTitle>
    <div class="contentView">
      <div class="playerBox">
        <!-- v-if="docSDKReady" -->
        <player ref="player"  v-bind="playerProps"></player>
      </div>
      <div class="docBox" id="docBox">
        <!-- <doc
          ref="doc"
          webinarId="561752317"
          docPermissionId="no"
          documentId="docBox"
          :isInteract="true"
          :roleName="2"
          :roomId="playerProps.roomId"
          :channelId="playerProps.channel_id"
          :appId="playerProps.appId"
          :token="playerProps.token"
          :liveStatus="2"
          :accountId="playerProps.accountId"
          :isVod="true"
        ></doc> -->
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
        <el-button size="medium" type="primary" round @click="associateHandler">关联文档</el-button>
        <el-button size="medium" round @click="addChapter">新增章节</el-button>
        <el-button size="medium" round @click="deleteChapter">批量删除</el-button>
        <div class="right">
          <el-button size="medium" round>保存</el-button>
          <el-button size="medium" round @click="previewVisible=true">预览</el-button>
        </div>
      </div>
      <el-table
        ref="chapterTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="序号"
          type="index"
          width="55">
        </el-table-column>
        <el-table-column
          label="章节标题">
          <template slot-scope="scope">
            <el-input v-model="scope.row.subject" placeholder="请输入章节标题"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="文档页码"
          width="110">
           <template slot-scope="scope">
             <el-input v-model="scope.row.pageNum" placeholder="请输入文档页码"></el-input>
           </template>
        </el-table-column>

        <el-table-column
          label="章节时间"
          width="110"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input v-model="scope.row.times" placeholder="请输入章节时间"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="操作"
          width="90"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="getTime(scope.row)">获取时间</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <associateDoc ref="associateDialog"></associateDoc>
    <previewChapter v-if="previewVisible" :chapters='tableData' @close="closePreview"></previewChapter>
  </div>
</template>

<script>
import pageTitle from '../components/pageTitle';
import player from '@/components/Player/index.vue';
// import doc from '@/components/Doc';
import associateDoc from './associatedDoc';
import previewChapter from './previewChapter';
export default {
  data(){
    return {
      playerProps: {
        accountId: 16422750,
        nickName: '123',
        appId: 'fd8d3653',
        token: 'access:fd8d3653:24845ebe5972cc7e',
        type: 'vod',
        roomId: 'lss_8018578c',
        channel_id: 'ch_93f8b149',
        vodOption: {
          recordId: '6a9fb155'
        },
        playerInfo: {}
      },
      docSDKReady: false,
      docsdk: {},
      pageInfo: {pageIndex: 0, total: 0},
      tableData: [
        {
          subject: '',
          pageNum: 1,
          times: "03:60:30",
          index: 0
        }
      ],
      selectedData: [],
      previewVisible: false,
    };
  },
  computed: {
    docInfo(){
      console.log('docInfo', this.docsdk._currentDoc ? this.docsdk._currentDoc.getDocInfo() : {toal: 0, current:0});
      return 1234;
    }
  },
  created(){
    this.$EventBus.$on('docSDK_ready', docsdk=>{
      this.docSDKReady = true;
      this.docsdk = docsdk;
      console.log('docSDK_ready', docsdk, this.$refs.doc);
    });
    this.$EventBus.$on('component_docSDK_ready', docsdk=>{
      this.docSDKReady = true;
      this.docsdk = docsdk;
      console.log('component_docSDK_ready', docsdk, this.$refs.doc);
    });

    this.$EventBus.$on('component_playerSDK_ready', ()=>{
      console.log('component_playerSDK_ready');
    });

    this.$EventBus.$on('component_page_info', ()=>{
      console.log('component_page_info', this.$refs.doc.pageInfo);
      this.pageInfo = this.$refs.doc.pageInfo;
    });

  },
  mounted(){

  },
  beforeDestroy(){
    this.$EventBus.$off('component_docSDK_ready');
    this.$EventBus.$off('component_playerSDK_ready');
    this.$EventBus.$off('component_page_info');
  },
  methods: {
    prevPage(){
      this.docsdk._currentDoc && this.docsdk._currentDoc.prevPage();
    },
    nextPage(){
      this.docsdk._currentDoc && this.docsdk._currentDoc.nextPage();
    },
    handleSelectionChange(val){
      this.selectedData = val;
    },
    addChapter(){
      this.tableData.push({
        subject: '',
        pageNum: '',
        times: "",
        index: this.tableData.length
      });
    },
    deleteChapter(){
      if(!this.selectedData.length > 0) return this.$message.warning('请选择要删除得章节');
      this.$confirm('删除后章节不可恢复，确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(()=>{
        this.tableData = this.tableData.filter(item=>{
          return !this.selectedData.some(selectItem => selectItem.index == item.index);
        });
      }).catch(()=>{});

    },
    getTime(row){
      row.times = this.$refs.player.$PLAYER.getCurrentTime();
    },
    associateHandler(){
      this.$refs.associateDialog.dialogVisible = true;
    },
    closePreview(){
      this.previewVisible = false;
    }
  },
  filters:{
    secondsFormmat(val){
      val = Number(val);
      if(isNaN(val)) return val;
      const hours = parseInt(val/3600);
      const minutes = parseInt(val/60) - (hours*60);
      const seconds = val % 60;
      return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
    },
  },
  components: {
    pageTitle,
    player,
    // doc,
    associateDoc,
    previewChapter
  }
};
</script>

<style lang="less" scoped>
  .contentView{
    padding: 24px;
    background: #222222;
    display: flex;
    justify-content: space-between;
    >div{
      flex: 1;
    }
    .docBox{
      display: flex;
      flex-direction: column;
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
      .vhallPlayer-progress-container .vhallPlayer-progress-play{
        background: #FB3A32;
      }
      .vhallPlayer-playBtn.play:hover{

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
  }
  .right{
    float: right;
  }
</style>
