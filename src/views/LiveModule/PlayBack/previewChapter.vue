<template>
  <div class="contentView">
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
          :isChapterWatch="true"
        ></doc>
      </div>
      <div class="actionBar">
        <!-- <span class="translatePage">
          <i class="el-icon-arrow-left" @click="prevPage"></i>
          <i class="el-icon-arrow-right" @click="nextPage"></i>
        </span> -->
        <span class="pages">
          <em>{{pageInfo.pageIndex}} </em> / {{pageInfo.total}}
        </span>
      </div>
    </div>
    <div class="playerBoxContainer" @mouseover="videoMouseOver" @mouseleave="videoMouseLeave">
      <div :class="['playerBox', chanBenVisible ? 'openControler' : '']">
        <!-- v-if="docSDKReady" -->
        <player ref="player" v-if="docSDKReady"  v-bind="playerProps" :playerParams="playerParams"></player>
      </div>
      <div class="chaptersBox">
        <div class="tab">
          <span>章节</span>
        </div>
        <div class="listBox">
          <vue-scroll :ops="ops">
            <ul class="chapterList">
              <li v-for="(item, index) in tableData" @click="chapterHandler(index)" :key="index">
                <span class="title"><span class="titleIndex">{{item.index}}.</span>{{item.title}}</span>
                <span class="times">{{item.createTimeShow}}</span>
              </li>
            </ul>
          </vue-scroll>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import player from '@/components/Player_1';
import doc from '@/components/Doc/watch-doc';
export default {
  name: 'Chapters',
  data(){
    return {
      recordId: this.$route.query.recordId,
      webinar_id: this.$route.params.str,
      showDoc: false,
      userId: window.sessionStorage.getItem('userId'),
      playerProps: {},
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
      ops: {
        bar: {
          background: '#ccc'
        }
      },
      chanBenVisible: false
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
    this.checkChapterSave();
    this.getPlayBackInfo();
    this.$EventBus.$on('docSDK_ready', docsdk=>{
      console.log(docsdk)
      this.docSDKReady = true;
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
      window.addEventListener('resize', this.calcHeight);
      this.calcHeight()
    });

    this.$EventBus.$on('component_page_info', ()=>{
      console.log('component_page_info', this.$refs.doc.pageInfo);
      this.pageInfo = this.$refs.doc.pageInfo;
    });

    // 监听文档加载完毕
    this.$EventBus.$on('vod_cuepoint_load_complete', chapters => {
      console.log("=============所有文档加载完毕==============", chapters)
      chapters.map((item, index) => {
         this.tableData.push({
          ...item,
          index: index + 1,
          createTimeShow: this.secondsFormmat(item.createTime),
          sub: item.sub.map((subItem, subIndex) => ({
            ...subItem,
            createTimeShow: this.secondsFormmat(subItem.createTime),
            index: `${index + 1}-${subIndex + 1}`
          }))
        })
        if (item.sub.length) {
          item.sub.map((subItem, subIndex) => {
            this.tableData.push({
              ...subItem,
              createTimeShow: this.secondsFormmat(subItem.createTime),
              index: `${index + 1}-${subIndex + 1}`
            })
          })
        }
      });
    });
  },
  mounted(){

  },
  beforeDestroy(){
    this.$EventBus.$off('docSDK_ready');
    this.$EventBus.$off('component_playerSDK_ready');
    this.$EventBus.$off('component_page_info');
    this.$EventBus.$off('vod_cuepoint_load_complete');
    window.removeEventListener('resize', this.calcHeight);
  },
  methods: {
    calcHeight() {
      document.querySelector('.chaptersBox').style.height = document.querySelector('.playerBoxContainer').offsetHeight - document.querySelector('.playerBox').offsetHeight + 'px'
    },
    videoMouseOver() {
      this.chanBenVisible = true;
    },
    videoMouseLeave() {
      this.chanBenVisible = false;
    },
    checkChapterSave() {
      this.$fetch('checkChapterSave', {
        record_id: this.recordId
      }).then(res => {
        if (res.data && res.data.chatper_callbanck_status == 0) {
          this.$message.warning('上次章节保存任务尚未完成，当前章节信息为前一次保存的章节')
        }
      })
    },
    chapterHandler(index){
      console.log(index)
      // let opts = {
      //   id: this.docsdk._currentDoc._currentContainer._id, // 容器id， 必填
      //   page: Number(this.tableData[index].slideIndex) // 跳转到某页，数字，必填
      // };
      console.log(this.tableData[index].createTime)
      // this.docsdk.gotoPage(opts);
      this.$refs.player.$PLAYER.setCurrentTime(this.tableData[index].createTime, (e) => console.log(e));
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
        this.playerParams.otherOption = {
          vid: res.data.report_data.vid, // hostId
          vfid: res.data.report_data.vfid,
          guid: res.data.report_data.guid,
          biz_id: this.webinar_id
        }
        this.playerParams.otherOption.report_extra = res.data.report_data.report_extra
        console.log(this.playerProps)
        this.showDoc = true
      })
    },
    // prevPage(){
    //   this.docsdk.prevPage({id: document.querySelector('.docInner .doc-box').id});
    // },
    // nextPage(){
    //   this.docsdk.nextPage({id: document.querySelector('.docInner .doc-box').id});
    // },
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
  },
  components: {
    player,
    doc,
  }
};
</script>

<style lang="less" scoped>
  .contentView{
    min-height: 320px;
    padding: 0px;
    width: 100%;
    height: 100%;
    background: #1a1a1a;
    border: 1px solid #333;
    border-radius: 4px;
    .docBox{
      float: left;
      width: 68.4%;
      height: 100%;
      display: flex;
      flex-direction: column;
      border-right: 1px solid #333;
      .docInner{
        height: 100%;
        background-color: #1a1a1a;
        /deep/ .vhall-watch-doc {
          background-color: #1a1a1a;
        }
        /deep/ .watch-doc-placeholder {
          background-color: #1a1a1a;
        }
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
      // position: relative;
      visibility: visible;
      opacity: 1;
      z-index: 2;
      // display: block !important;
      // &:hover{
      //   height: 4px;
      // }
      .vhallPlayer-progress-container .vhallPlayer-progress-play{
        background: #FB3A32;
      }
      .vhallPlayer-progress-scrubber {
        display: none!important;
      }
      .vhallPlayer-verticalSlider-popup .vhallPlayer-verticalSlider-box .verticalSlider-range .verticalSlider-value{
        background: #FB3A32;
      }
      .vhallPlayer-controller-box {
        height: 40px;
        padding: 0 10px;
        background: rgba(0, 0, 0, 0.8);
      }
      .vhallPlayer-volume-component {
        margin-right: 3px;
      }
      .vhallPlayer-progress-container {
        height: 4px!important;
      }
      .vhallPlayer-playBtn {
        margin-right: 10px;
        &.play {
          background-image: url(./images/play.png);
          &:hover {
            background-image: url(./images/play_hover.png);
          }
        }
        &.pause {
          background-image: url(./images/pause.png);
          &:hover {
            background-image: url(./images/pause_hover.png);
          }
        }
      }
      .vhallPlayer-volume-btn {
        background-image: url(./images/volume.png);
        &:hover {
          background-image: url(./images/volume_hover.png);
        }
        &.mute {
          background-image: url(./images/volume_zero.png);
          &:hover {
            background-image: url(./images/volume_zero_hover.png);
          }
        }
      }
      .vhallPlayer-verticalSlider-popup {
        padding-bottom: 4px;
      }
    }
    .playerBoxContainer{
      float: left;
      width: 31.6%;
      height: 100%;
      .playerBox {
        height: 170px;
        >div{
          height: 100%;
          /deep/ .vh-player {
            height: 100%;
          }
        }
        &.openControler{
          /deep/ .vhallPlayer-container{
            display: block!important;
          }
        }
      }
      .chaptersBox {
        .tab{
          height: 32px;
          box-shadow: 0px 1px 0px 0px #1A1A1A;
          text-align: center;
          line-height: 32px;
          color: #999;
          span{
            color: #999;
            border-bottom: 1px solid #999;
            padding-bottom: 6px;
            font-size: 14px;
          }
        }
        .listBox {
          height: calc(100% - 32px);
          overflow-y: auto;
          /deep/ .__view{
            width: 100%!important;
          }
          /deep/ .__vuescroll .__bar-is-vertical {
            background-color: #666!important;
          }
        }
        .chapterList{
          padding-right: 10px;
          width: 100%;
          li{
            color: #999;
            font-size: 12px;
            height: 36px;
            line-height: 36px;
            padding-left: 12px;
            cursor: pointer;
            transition: all .1s linear;
            display: flex;
            &:hover{
              background: #222;
              color: #FB3A32;
            }
          }
          .times,.title{
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .times{
            width: 50px;
          }
          .title{
            flex: 1;
          }
          .titleIndex{
            padding-right: 8px;
          }
        }
      }
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
</style>
<style lang="less">
  // 这个页面是在 iframe 中加载，不会影响项目中的整体布局
  #app {
    min-width: 0;
  }
  // 页面底部插入了一个一像素高元素，影响一屏页面，不知作用是啥，先隐藏
  #myVodNode {
    height: 0px!important;
  }
</style>
