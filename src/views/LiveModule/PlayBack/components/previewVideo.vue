<template>
  <div class="contentView">
    <div :class="bigElem == 'video' ? 'littleBox' : 'bigBox'">
      <div class="docBox">
        <div class="docInner">
          <doc
            v-if="showDoc"
            ref="doc"
            :webinarId="webinarId"
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
            :notControlVisible="true"
          ></doc>
        </div>
        <!-- <div class="actionBar">
          <span class="translatePage">
            <i class="el-icon-arrow-left" @click="prevPage"></i>
            <i class="el-icon-arrow-right" @click="nextPage"></i>
          </span>
          <span class="pages">
            <em>{{pageInfo.pageIndex}}</em>/{{pageInfo.total}}
          </span>
        </div> -->
      </div>
    </div>
    <div :class="bigElem == 'doc' ? 'littleBox' : 'bigBox'">
      <div class="playerBoxContainer" @mouseover="videoMouseOver" @mouseleave="videoMouseLeave">
        <span v-show="chanBenVisible" class="changeBigElem" @click="switchBox">
          <icon class="icon" icon-class="saasicon_copy"></icon>
        </span>
        <div :class="['playerBox', chanBenVisible ? 'openControler' : '']">
          <!-- v-if="docSDKReady" -->
          <player
            ref="player"
            v-if="docSDKReady"
            v-bind="playerProps"
            :playerParams="playerParams"
          ></player>
        </div>
        <!-- <div class="chaptersBox">
          <div class="tab">
            <span>章节</span>
          </div>
          <div class="listBox">
            <ul class="chapterList">
              <li v-for="(item, index) in tableData" @click="chapterHandler(index)" :key="index">
                <span class="title">{{item.index}}. {{item.title}}</span>
                <span class="times">{{item.createTimeShow}}</span>
              </li>
            </ul>
          </div>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
  import player from '@/components/Player_1';
  import doc from '@/components/Doc/watch-doc';
  export default {
    name: 'Chapters',
    props: {
      recordId: {
        required: true,
        type: [Number, String]
      },
      webinarId: {
        required: {
          required: true,
          type: [Number, String]
        }
      }
    },
    data() {
      return {
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
        pageInfo: { pageIndex: 0, total: 0 },
        // tableData: [],
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
        bigElem: 'doc',
        chanBenVisible: false,
        isOpenControler: true
      };
    },
    provide() {
      return {
        docToolStatus: this.docToolStatus
      };
    },
    computed: {
      docInfo() {
        console.log(
          'docInfo',
          this.docsdk._currentDoc ? this.docsdk._currentDoc.getDocInfo() : { toal: 0, current: 0 }
        );
        return 1234;
      }
    },
    created() {
      // this.checkChapterSave();
      this.getPlayBackInfo();
      this.$EventBus.$on('docSDK_ready', docsdk => {
        console.log(docsdk);
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
          this.pageInfo.pageIndex = event.info.slideIndex + 1;
          this.pageInfo.total = event.info.slidesTotal;
        });
        console.log('docSDK_ready', docsdk, this.$refs.doc);
      });
      // this.$EventBus.$on('component_docSDK_ready', docsdk=>{
      //   this.docSDKReady = true;
      //   this.docsdk = docsdk;
      //   console.log('component_docSDK_ready', docsdk, this.$refs.doc);
      // });

      this.$EventBus.$on('component_playerSDK_ready', () => {
        console.log('component_playerSDK_ready');
        // 延时获取事件点的位置
        setTimeout(() => {
          this.updateEventPonitPosition();
        }, 1000);
      });

      this.$EventBus.$on('component_page_info', () => {
        console.log('component_page_info', this.$refs.doc.pageInfo);
        this.pageInfo = this.$refs.doc.pageInfo;
      });

      // 监听文档加载完毕,暂时隐藏，不要删除，需要章节时，去掉注释即可
      // this.$EventBus.$on('vod_cuepoint_load_complete', chapters => {
      //   console.log("=============所有文档加载完毕==============", chapters)
      //   chapters.map((item, index) => {
      //      this.tableData.push({
      //       ...item,
      //       index: index + 1,
      //       createTimeShow: this.secondsFormmat(item.createTime),
      //       sub: item.sub.map((subItem, subIndex) => ({
      //         ...subItem,
      //         createTimeShow: this.secondsFormmat(subItem.createTime),
      //         index: `${index + 1}-${subIndex + 1}`
      //       }))
      //     })
      //     if (item.sub.length) {
      //       item.sub.map((subItem, subIndex) => {
      //         this.tableData.push({
      //           ...subItem,
      //           createTimeShow: this.secondsFormmat(subItem.createTime),
      //           index: `${index + 1}-${subIndex + 1}`
      //         })
      //       })
      //     }
      //   });
      // });
    },
    mounted() {},
    beforeDestroy() {
      this.$EventBus.$off('docSDK_ready');
      this.$EventBus.$off('component_playerSDK_ready');
      this.$EventBus.$off('component_page_info');
      this.$EventBus.$off('vod_cuepoint_load_complete');
    },
    methods: {
      // checkChapterSave() {
      //   this.$fetch('checkChapterSave', {
      //     record_id: this.recordId
      //   }).then(res => {
      //     if (res.data && res.data.chatper_callbanck_status == 0) {
      //       this.$message.warning('上次章节保存任务尚未完成，当前章节信息为前一次保存的章节')
      //     }
      //   })
      // },
      // chapterHandler(index){
      //   console.log(index)
      //   let opts = {
      //     id: this.docsdk._currentDoc._currentContainer._id, // 容器id， 必填
      //     page: Number(this.tableData[index].slideIndex) // 跳转到某页，数字，必填
      //   };
      //   console.log(this.tableData[index].createTime)
      //   // this.docsdk.gotoPage(opts);
      //   this.$refs.player.$PLAYER.setCurrentTime(this.tableData[index].createTime, (e) => console.log(e));
      // },
      updateEventPonitPosition() {
        const parentWidth = document.querySelector('.vhallPlayer-progress-container').offsetWidth;
        const markpoints = document.getElementsByClassName('v-p-markpoint');
        const markpointMarks = document.getElementsByClassName('v-p-markpoint__mark');
        Array.from(markpoints).forEach((item, index) => {
          markpointMarks[index].style.left = 'auto';
          if (item.offsetLeft < 52) {
            markpointMarks[index].style.left = '54px';
          } else if (parentWidth - item.offsetLeft - 50 < 52) {
            console.log(item.offsetLeft);
            markpointMarks[index].style.right = '-46px';
          } else {
            markpointMarks[index].style.left = item.style.left;
          }
        });
      },
      videoMouseOver() {
        this.chanBenVisible = true;
      },
      videoMouseLeave() {
        this.chanBenVisible = false;
      },
      resize() {
        if (isIE()) {
          var evt = window.document.createEvent('UIEvents');
          evt.initUIEvent('resize', true, false, window, 0);
          window.dispatchEvent(evt);
        } else {
          const resizeEvent = new Event('resize');
          window.dispatchEvent(resizeEvent);
        }
      },
      switchBox() {
        this.bigElem = this.bigElem == 'doc' ? 'video' : 'doc';
        this.$nextTick(() => {
          this.$refs.doc.resize();
          this.updateEventPonitPosition();
        });
      },
      getPlayBackInfo() {
        this.$fetch('playBackPreview', {
          webinar_id: this.webinarId,
          record_id: this.recordId,
          type: 0
        }).then(res => {
          console.log(res);
          const data = res.data;
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
          };
          this.playerParams.otherOption = {
            vid: res.data.report_data.vid, // hostId
            vfid: res.data.report_data.vfid,
            guid: res.data.report_data.guid,
            biz_id: this.webinarId
          };
          this.playerParams.otherOption.report_extra = res.data.report_data.report_extra;
          console.log(this.playerProps);
          this.showDoc = true;
        });
      },
      prevPage() {
        this.docsdk.prevPage({ id: document.querySelector('.docInner .doc-box').id });
      },
      nextPage() {
        this.docsdk.nextPage({ id: document.querySelector('.docInner .doc-box').id });
      },
      // 格式化秒数为时分秒 s => hh:mm:ss
      secondsFormmat(val) {
        val = Number(val);
        val = Math.floor(val);
        if (isNaN(val)) return val;
        const hours = parseInt(val / 3600);
        const minutes = parseInt(val / 60) - hours * 60;
        const seconds = val % 60;
        return `${hours < 10 ? `0${hours}` : hours}:${minutes < 10 ? `0${minutes}` : minutes}:${
          seconds < 10 ? `0${seconds}` : seconds
        }`;
      }
    },
    components: {
      player,
      doc
    }
  };
</script>

<style lang="less" scoped>
  .contentView {
    padding: 4px;
    width: 100%;
    height: 560px;
    background: #222;
    position: relative;
    border-radius: 4px;
    .bigBox {
      width: calc(100% - 8px);
      height: calc(100% - 8px);
      position: absolute;
      top: 4px;
      right: 4px;
    }
    .docBox {
      width: 100%;
      height: 100%;
      .docInner {
        height: 100%;
        background-color: #292929;
      }
    }
    .actionBar {
      height: 48px;
      background: rgba(0, 0, 0, 0.5);
      text-align: center;
      line-height: 48px;
      padding: 0 16px;
      .translatePage {
        float: left;
        i {
          color: #999999;
          cursor: pointer;
        }
      }
      .pages {
        color: #666;
        font-size: 14px;
        em {
          color: #fff;
          font-style: normal;
        }
      }
    }
    /deep/ .vhallPlayer-container {
      position: relative;
      visibility: visible;
      opacity: 1;
      z-index: 2;
      .vhallPlayer-progress-container .vhallPlayer-progress-play {
        background: #fb3a32;
      }
      .vhallPlayer-progress-container {
        background-color: rgba(0, 0, 0, 0.7);
        .vhallPlayer-progress-scrubber > i {
          width: 6px;
          height: 6px;
        }
        .vhallPlayer-progress-scrubber {
          display: none !important;
          width: 8px;
          height: 8px;
        }
        &:hover {
          height: 4px;
        }
        .v-p-markpoint {
          border: none;
        }
      }
      .vhallPlayer-verticalSlider-popup
        .vhallPlayer-verticalSlider-box
        .verticalSlider-range
        .verticalSlider-value {
        background: #fb3a32;
      }
      .v-p-markpoint__mark {
        min-height: auto;
        background: #fff;
        border-radius: 4px;
        width: auto;
        width: 100px;
        padding: 10px;
        img {
          display: none;
        }
        .v-p-markpoint-msg {
          color: #1a1a1a;
        }
      }
    }
    .littleBox {
      width: 302px;
      height: 190px;
      position: absolute;
      top: 16px;
      right: 16px;
      z-index: 2;
    }
    .playerBoxContainer {
      width: 100%;
      height: 100%;
      position: relative;
      .playerBox {
        height: 100%;
        > div {
          height: 100%;
        }
        /deep/ #vh-player {
          height: 100%;
        }
        /deep/ .vhallPlayer-container {
          position: absolute;
        }
        /deep/ .vhallPlayer-volume-component {
          margin-right: 0px;
        }
        &.openControler {
          /deep/ .vhallPlayer-container {
            display: block !important;
          }
        }
        /deep/ .vhallPlayer-controller-box {
          height: 40px;
          padding: 0 10px;
        }
      }
      .changeBigElem {
        position: absolute;
        top: 10px;
        left: 10px;
        cursor: pointer;
        z-index: 3;
        width: 30px;
        height: 30px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        /deep/ i {
          color: #fff;
        }
      }
      .chaptersBox {
        height: calc(100% - 223px);
        .tab {
          height: 32px;
          box-shadow: 0px 1px 0px 0px #1a1a1a;
          text-align: center;
          line-height: 32px;
          span {
            color: #fff;
            border-bottom: 1px solid #fff;
            padding-bottom: 6px;
            font-size: 14px;
          }
        }
        .listBox {
          height: calc(100% - 32px);
          overflow-y: auto;
        }
        .chapterList {
          li {
            color: #cccccc;
            font-size: 12px;
            height: 32px;
            line-height: 32px;
            padding-left: 8px;
            cursor: pointer;
            transition: all 0.1s linear;
            display: flex;
            &:hover {
              background: #333333;
              color: #fb3a32;
            }
          }
          .times,
          .title {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .times {
            width: 50px;
          }
          .title {
            flex: 1;
          }
        }
      }
    }
    /deep/ .v-c-right {
      .vhallPlayer-definition-component,
      .vhallPlayer-config-component,
      .vhallPlayer-speed-component {
        display: none;
      }
      .vhallPlayer-fullScreen-btn {
        margin-left: 8px;
      }
    }
    /deep/ .vh-doc__wrap {
      background-color: #666;
    }
  }
</style>
