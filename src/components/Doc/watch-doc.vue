<template>
  <div v-show="watchDocShow" class="vhall-watch-doc" ref="watchDocWrapper">
    <div v-show="!currentCid" class="watch-doc-placeholder">
      <i v-show="!isChapterWatch" class="iconfont iconzanwuwendang"></i>
      <i v-show="isChapterWatch" class="iconfont iconfont-v3 saasicon_zanwuwendang"></i>

      <span>主讲人未添加文档，请稍等...</span>
    </div>
    <div
      v-for="cid in cids"
      :key="cid"
      :id="cid"
      v-show="currentCid == cid"
      class="doc-box"
      :style="cid.split('-')[0] == 'document' ? docBoxStyle : boardBoxStyle"
    ></div>
    <div class="vhall-doc-pager" id="doc-pager" v-if="!isMini && currentCid && !notControlVisible">
      <div
        class="iconfont iconfont-v3 saasbofangqi_fangda"
        title="放大"
        :class="{ active: activeTool == 'zoomIn' }"
        @click="docControl('zoomIn')"
      ></div>
      <div
        class="iconfont iconfont-v3 saasbofangqi_suoxiao"
        title="缩小"
        :class="{ active: activeTool == 'zoomOut' }"
        @click="docControl('zoomOut')"
      ></div>
      <div
        class="iconfont iconfont-v3 saasbofangqi_11"
        title="还原"
        :class="{ active: activeTool == 'zoomReset' }"
        @click="docControl('zoomReset')"
      ></div>
      <div
        class="iconfont iconfont-v3 saasa-icon_jushou2x"
        title="移动"
        :class="{ active: activeTool == 'move' }"
        @click="docControl('move')"
      ></div>
      <div
        :class="
          isFullscreen
            ? 'iconfont iconfont-v3 saastuichuquanping_wendangbeifen active'
            : 'iconfont iconfont-v3 saasquanping_wendang'
        "
        :title="isFullscreen ? '退出全屏' : '全屏'"
        @click="docControl('fullscreen')"
      ></div>
    </div>
  </div>
</template>
<script>
  // import this.$EventBus from '../../utils/Events';
  // const roleTypeMap = {
  //   1: window.VHDocSDK.RoleType.HOST,
  //   2: window.VHDocSDK.RoleType.SPECTATOR,
  //   3: window.VHDocSDK.RoleType.ASSISTANT,
  //   4: window.VHDocSDK.RoleType.GUEST
  // };
  export default {
    props: {
      isMini: {
        default: false
      },
      token: {
        required: true
      },
      roomId: {
        required: true
      },
      channelId: {
        type: [String, Number],
        require: true
      },
      joinId: {
        required: true
      },
      appId: {
        required: true
      },
      roleType: {
        required: true
      },
      isVod: {
        required: false
      },
      rebroadcastChannelId: {
        required: false
      },
      roleName: {
        required: false
      },
      playMode: {
        required: false,
        default: 0
      },
      notControlVisible: {
        required: false,
        default: false
      },
      preloadDocs: {
        required: false,
        default: false
      },
      isChapterWatch: {
        required: false,
        default: false
      },
      isParentFullScreen: {
        required: false,
        default: true
      }
    },
    data() {
      return {
        docBoxStyle: {}, // 文档宽高
        boardBoxStyle: {},
        watchDocShow: true,
        cids: [],
        currentCid: '',
        activeTool: '', // 激活状态的工具
        isFullscreen: false,
        VhallMsgSdk: !!window.VhallMsg, // 是否加载了msgsdk
        addDoc: false
        // vodCids: [],
        // currentId: ''
      };
    },
    watch: {
      // isMini () {
      //   this.resize()
      // },
      currentCid(newval) {
        if (newval) {
          this.resize();
        }
      }
    },
    mounted() {
      this._listenEvents();
      window.roleTypeMap = {
        1: window.VHDocSDK.RoleType.HOST,
        2: window.VHDocSDK.RoleType.SPECTATOR,
        3: window.VHDocSDK.RoleType.ASSISTANT,
        4: window.VHDocSDK.RoleType.GUEST
      };
      this._initDocSDK();
    },
    methods: {
      /**
       * 初始化文档区域宽度，window resize时也触发
       */
      initWidth(type = 'document') {
        let wrapWidth = null;
        let wrapHeight = null;
        if (this.isMini) {
          let style = window.getComputedStyle(document.querySelector('.vhall-saas-miniArea-doc'));
          wrapWidth = parseFloat(style.width);
          wrapHeight = parseFloat(style.height);
        } else {
          try {
            const elem = this.$refs.watchDocWrapper.parentNode;
          } catch (err) {
            return false;
          }
          let style = window.getComputedStyle(
            this.isParentFullScreen
              ? this.$refs.watchDocWrapper.parentNode
              : this.$refs.watchDocWrapper
          );
          wrapWidth = parseFloat(style.width);
          wrapHeight = parseFloat(style.height);
        }
        let ratio = 16 / 9;
        let docBoxWidth = null;
        let docBoxHeight = null;
        if (wrapWidth / wrapHeight > ratio) {
          docBoxHeight = wrapHeight;
          docBoxWidth = docBoxHeight * ratio;
        } else {
          docBoxWidth = wrapWidth;
          docBoxHeight = docBoxWidth * (1 / ratio);
        }
        if (type === 'document') {
          this.docBoxStyle = {
            width: `${docBoxWidth}px`,
            height: `${docBoxHeight}px`
          };
          console.log('this.docBoxStyle', this.docBoxStyle);
        } else {
          this.boardBoxStyle = {
            width: `${docBoxWidth}px`,
            height: `${docBoxHeight}px`
          };
          console.log('this.boardBoxStyle', this.boardBoxStyle);
        }
      },
      resize() {
        if (this.watchDocShow) {
          this.$nextTick(async () => {
            if (!this.currentCid) {
              return;
            }
            let type = this.currentCid.split('-')[0];
            this.initWidth(type);
            try {
              const setSize = this.docSDK.setSize;
            } catch (err) {
              return;
            }
            if (type === 'document') {
              this.docSDK.setSize(
                parseFloat(this.docBoxStyle.width),
                parseFloat(this.docBoxStyle.height),
                {
                  id: this.currentCid
                }
              );
            } else {
              this.docSDK.setSize(
                parseFloat(this.boardBoxStyle.width),
                parseFloat(this.boardBoxStyle.height),
                {
                  id: this.currentCid
                }
              );
            }
          });
        }
      },
      _listenEvents() {
        window.addEventListener('resize', this.resize);
        // 全屏兼容360浏览器等
        const setFullscreen = () => {
          const fullscreenElement =
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullscreenElement ||
            document.msFullscreenElement;
          if (!fullscreenElement) {
            let video = document.querySelector('.vhall-saas-miniArea');
            video && (video.style.visibility = 'visible');
            this.isFullscreen = false;
          }
          if (
            !fullscreenElement ||
            (fullscreenElement && fullscreenElement.className == 'seeding-content')
          ) {
            setTimeout(() => {
              const wrapper = document.querySelector(
                '.vhall-saas-watchbox__mainContent__bigArea-placeholder'
              );
              wrapper && (wrapper.style.paddingBottom = '46px');
              this.resize();
            }, 100);
          }
          if (
            !fullscreenElement ||
            (fullscreenElement &&
              fullscreenElement.className ==
                'vhall-saas-watchbox__mainContent__bigArea-placeholder')
          ) {
            this.resize();
            setTimeout(() => {
              const wrapper = document.querySelector(
                '.vhall-saas-watchbox__mainContent__bigArea-placeholder'
              );
              if (wrapper) {
                wrapper.style.width = '100%';
              }
              this.resize();
            }, 100);
          }
        };
        window.addEventListener('fullscreenchange', setFullscreen);
        window.addEventListener('webkitfullscreenchange', setFullscreen);
        window.addEventListener('mozfullscreenchange', setFullscreen);
        window.addEventListener('msfullscreenchange', setFullscreen);
        window.addEventListener('MSFullscreenChange', setFullscreen);
        // 直播结束
        this.$EventBus.$on('live_over', () => {
          this.watchDocShow = false;
          this.$EventBus.$emit('watchDocShow', this.watchDocShow);
        });
        this.$EventBus.$on('live_broadcast_start', msg => {
          this.watchDocShow = false;
          this.$EventBus.$emit('watchDocShow', this.watchDocShow);
          this.loadRemote(msg.channel_id);
        });
        // 文档列表组件触发演示文档事件
        this.$EventBus.$on('demonstration', async data => {
          console.log(data);
          this.addDoc = true;
          this.docLoadComplete = false;
          this.cids.forEach(item => {
            let type = item.split('-')[0];
            if (type == 'document') {
              this.docSDK.destroyContainer({ id: item });
            }
          });
          // 删除多余的容器
          if (this.boardID) {
            this.cids = [this.boardID];
          } else {
            this.cids = [];
          }

          const temp = [];
          data.documentIds.forEach(item => {
            let cid = this.docSDK.createUUID('document');
            // this.currentCid = cid;
            this.cids.push(cid);
            temp.push({ cid, docId: item });
            this.watchDocShow = true;
          });
          await this.$nextTick();
          for await (let { cid, docId } of temp) {
            this.initWidth();
            this.initContainer({
              type: 'document',
              docId: docId,
              id: cid
            });
            this.activeContainer(cid); // 创建后的选择不能延迟，否则不会派发文档加载完成事件
            console.warn(docId, cid);
            await this.docSDK.loadDoc({ docId, id: cid });
          }
        });
        // 下一个文档
        this.$EventBus.$on('nextDoc', () => {
          try {
            this.nextDoc();
          } catch (err) {
            console.log(err);
          }
        });
        // 上一个文档
        this.$EventBus.$on('prevDoc', () => {
          try {
            this.prevDoc();
          } catch (err) {
            console.log(err);
          }
        });
        // 上一步
        this.$EventBus.$on('nextStep', () => {
          try {
            this.docSDK.nextStep({ id: this.currentCid });
          } catch (err) {
            console.log(err);
          }
        });
        // 下一步
        this.$EventBus.$on('prevStep', () => {
          try {
            this.docSDK.prevStep({ id: this.currentCid });
          } catch (err) {
            console.log(err);
          }
        });
        // eslint-disable-next-line no-unused-vars
        this.$EventBus.$on('live_broadcast_stop', msg => {
          if (this.roleName) return;
          console.log('live_broadcast_stop', this.roleName);
          clearTimeout(this.rebroadcastStopTimer);
          this.rebroadcastStopTimer = setTimeout(() => {
            this.watchDocShow = false;
            this.$EventBus.$emit('watchDocShow', this.watchDocShow);
            this.loadRemote(this.channelId);
          }, 500);
        });
        // 互动连麦成功
        this.$EventBus.$on('vrtc_connect_success', msg => {
          if (msg.room_join_id == this.joinId) {
            this.docSDK.setPlayMode(window.VHDocSDK.PlayMode.INTERACT);
          }
        });
        // 互动连麦断开成功
        this.$EventBus.$on('vrtc_disconnect_success', msg => {
          let mode = window.VHDocSDK.PlayMode.FLV; // 根据配置选择播放模式
          if (this.playMode) {
            mode = window.VHDocSDK.PlayMode.HLS;
          }
          if (msg.target_id == this.joinId) {
            try {
              this.docSDK.setPlayMode(mode);
            } catch (e) {
              // eslint-disable-next-line no-unused-vars
            }
          }
        });
      },
      // 激活容器，设置默认画笔颜色
      activeContainer(cid = '', isEvent = true) {
        this.docSDK.selectContainer({ id: cid });
        this.currentCid = cid;
        isEvent && this.$EventBus.$emit('remote_doc_select', { id: cid });
        let type = cid.split('-')[0];
        if (type == 'document') {
          this.docID = cid;
        }
      },
      /**
       * 初始化文档SDK,观看端观看文档时调用
       */
      _initDocSDK() {
        let opt = {
          accountId: this.joinId,
          roomId: this.roomId,
          channelId: this.channelId, // 频道id 必须
          appId: this.appId, // appId 必须
          role: window.roleTypeMap[this.roleType], // 角色 必须
          isVod: this.isVod, // 是否是回放 必须
          client: window.VHDocSDK.Client.PC_WEB, // 客户端类型
          token: this.token
        };
        console.log('实例化文档参数1', opt);
        let success = () => {
          console.log('实例化文档成功');
          if (!this.isVod) {
            this.loadRemote();
          }
          this.$EventBus.$emit('docSDK_ready', this.docSDK);
        };
        let failed = error => {
          console.error('实例化文档失败', error.msg);
        };
        this.docSDK = window.VHDocSDK.createInstance(opt, success, failed);
        // ====================================================================================
        // 监听回放消息
        if (this.isVod) {
          this.docSDK.on(window.VHDocSDK.Event.VOD_CUEPOINT_LOAD_COMPLETE, async ({ chapters }) => {
            console.log('VOD_CUEPOINT_LOAD_COMPLETE', this.docSDK.getVodAllCids());
            const data = this.docSDK.getVodAllCids();
            this.cids = data.map(item => item.cid);
            await this.$nextTick();
            data.forEach(({ cid, type }) => {
              this.initContainer({ type: type.toLowerCase(), id: cid });
            });
            this.preloadDocs && this.docSDK.loadVodIframe();
            this.$EventBus.$emit('vod_cuepoint_load_complete', chapters);
          });
          this.docSDK.on(window.VHDocSDK.Event.ALL_COMPLETE, () => {
            console.warn('所有文档加载完成');
            this.$EventBus.$emit('all_complete');
          });
          // 监听回放事件
          this.FIRST = true;
          this.docSDK.on(window.VHDocSDK.Event.VOD_TIME_UPDATE, data => {
            if (this.addDoc) return false;
            if (this.FIRST) {
              this.$EventBus.$emit('watchDocShow', data.watchOpen);
              this.FIRST = false;
            }
            if (data.watchOpen != this.watchDocShow) {
              this.$EventBus.$emit('watchDocShow', data.watchOpen);
            }
            this.watchDocShow = data.watchOpen;

            if (data.activeId) {
              // let type = data.activeId.split('-')[0]
              // this.currentVodCid = data.activeId
              // this.docSDK.selectContainer({ id: data.activeId })
              this.selectContainer(data.activeId);
            } else {
              this.currentCid = '';
            }
            // {container:[容器id], activeid: 容器id, watchOpen: true | false}
          });
        } else {
          this.docSDK.on(window.VHDocSDK.Event.SWITCH_CHANGE, status => {
            console.log('==========控制文档开关=============', status);
            if (status == 'on') {
              this.watchDocShow = true;
            } else {
              this.watchDocShow = false;
            }
            this.$EventBus.$emit('watchDocShow', this.watchDocShow);
          });
          this.docSDK.on(window.VHDocSDK.Event.CREATE_CONTAINER, async data => {
            console.log('===================创建容器====================', data);
            if (this.cids.includes(data.id)) return;
            this.cids.push(data.id);
            await this.$nextTick();
            data.select = true;
            this.initContainer(data);
          });
          this.docSDK.on(window.VHDocSDK.Event.SELECT_CONTAINER, async data => {
            console.log('===================选择容器====================', data);
            // 判断容器是否存在
            if (this.cids.includes(data.id)) {
              await this.$nextTick();
              this.selectContainer(data.id);
            } else {
              this.cids.push(data.id);
              await this.$nextTick();
              data.select = true;
              this.initContainer({
                type: data.id.split('-')[0],
                id: data.id,
                docId: ''
              });
              this.selectContainer(data.id);
            }
          });
          this.docSDK.on(window.VHDocSDK.Event.DELETE_CONTAINER, data => {
            console.log('===================删除容器====================', data);
            let index = this.cids.indexOf(data.id);
            if (index > -1) {
              this.docSDK.destroyContainer({ id: data.id });
              this.cids.splice(index, 1); // 删除dom结构
            }
            if (this.currentCid == data.id) {
              this.currentCid = '';
            }
          });
        }
        // eslint-disable-next-line no-unused-vars
        this.docSDK.on(window.VHDocSDK.Event.DOCUMENT_NOT_EXIT, ({ cid, docId }) => {
          console.log(
            '====================文档不存在或已删除=================',
            cid,
            this.currentCid,
            this.watchDocShow
          );
          if (this.watchDocShow) {
            this.$message({
              type: 'error',
              message: '文档不存在或已删除'
            });
            this.deleteTimer = setTimeout(() => {
              let index = this.cids.indexOf(cid);
              this.cids.splice(index, 1);
              this.docSDK.destroyContainer({ id: this.currentCid });
              this.currentCid = '';
            }, 3000); // 其他地方调用回将值重新传入
          }
        });
        this.docSDK.on(window.VHDocSDK.Event.ERROR, error => {
          console.error(error);
        });
      },
      async loadRemote(channelId = null) {
        let params = null;
        if (channelId) {
          params = { channelId };
        } else if (this.rebroadcastChannelId) {
          params = { channelId: this.rebroadcastChannelId };
        }
        let res = await this.docSDK.getContainerInfo(params);
        // res.data会返回空数组或者一个对象，所以需要判断，应该是后端（朱俊亚）优化
        if (res instanceof Array && !res.length) {
          this.$EventBus.$emit('watchDocShow', false);
          this.watchDocShow = false;
          return;
        }
        let { list = [], switch_status } = res;
        console.log('=============获取文档容器信息=============', res);
        this.watchDocShow = Boolean(switch_status);
        this.$EventBus.$emit('watchDocShow', this.watchDocShow);
        // if (!this.watchDocShow) {
        //   console.log('========初始化观看端文档容器状态 隐藏========')
        //   return
        // }
        if (!list.length) {
          return;
        }
        this.cids = list.map(item => item.cid);
        let activeItem = list.find(item => item.active == 1);
        this.$nextTick(() => {
          // eslint-disable-next-line no-unused-vars
          list.forEach((item, index) => {
            this.initContainer({
              type: item.cid.split('-')[0],
              id: item.cid,
              docId: item.docId
            });
            this.docSDK.setRemoteData(item);
          });
          if (activeItem) {
            this.selectContainer(activeItem.cid);
          }
        });
      },
      /**
       * 初始化文档容器
       */
      initContainer(data) {
        this.initWidth(data.type);
        if (data.type === 'document') {
          console.log('docBoxStyle', this.docBoxStyle);
          let opts = {
            id: data.id,
            docId: data.docId || '',
            elId: data.id, // div 容器 必须
            width: parseFloat(this.docBoxStyle.width), // div 宽度，像素单位，数值型不带px 必须
            height: parseFloat(this.docBoxStyle.height), // div 高度，像素单位，数值型不带px 必须
            noDispatch: !data.select // 通过监听创建容器消息创建的需要派发加载完成消息
          };
          console.log(opts);
          this.docSDK.createDocument(opts);
        } else {
          console.log('boardBoxStyle', this.boardBoxStyle);
          this.boardID = data.id;
          let opts = {
            id: data.id,
            elId: data.id, // div 容器 必须
            width: parseFloat(this.boardBoxStyle.width), // div 宽度，像素单位，数值型不带px 必须
            height: parseFloat(this.boardBoxStyle.height), // div 高度，像素单位，数值型不带px 必须
            noDispatch: !data.select,
            backgroundColor: '#FFFFFF'
          };
          this.docSDK.createBoard(opts);
        }
      },
      selectContainer(id) {
        this.docSDK.selectContainer({ id });
        this.currentCid = id;
      },
      nextDoc() {
        const curIndex = this.cids.indexOf(this.currentCid);
        let nextIndex;
        if (curIndex == this.cids.length - 1) {
          nextIndex = 0;
        } else {
          nextIndex = curIndex + 1;
        }
        console.log(this.docSDK);
        this.docSDK.selectContainer({
          id: this.cids[nextIndex]
        });
        this.currentCid = this.cids[nextIndex];
        let opts = {
          id: this.currentCid, // 容器id， 必填
          pageId: 0, // 页码 数字 必填
          stepId: 0 // 步数 数字 必填
        };
        this.docSDK.gotoStep(opts);
      },
      prevDoc() {
        const curIndex = this.cids.indexOf(this.currentCid);
        let nextIndex;
        if (curIndex == 0) {
          nextIndex = this.cids.length - 1;
        } else {
          nextIndex = curIndex - 1;
        }
        console.log(this.docSDK);
        this.docSDK.selectContainer({
          id: this.cids[nextIndex]
        });
        this.currentCid = this.cids[nextIndex];
        let opts = {
          id: this.currentCid, // 容器id， 必填
          pageId: 0, // 页码 数字 必填
          stepId: 0 // 步数 数字 必填
        };
        this.docSDK.gotoStep(opts);
      },
      docControl(type) {
        if (['zoomIn', 'zoomOut', 'zoomReset', 'move', 'fullcreen'].includes(type)) {
          this.activeTool = type;
        }
        this.routeTool(type);
      },
      routeTool(type) {
        switch (type) {
          // 放大
          case 'zoomIn':
            this.docSDK.zoomIn();
            break;
          // 缩小
          case 'zoomOut':
            this.docSDK.zoomOut();
            break;
          // 还原
          case 'zoomReset':
            this.docSDK.zoomReset();
            break;
          // 移动
          case 'move':
            this.docSDK.move();
            break;
          // 全屏
          case 'fullscreen':
            // eslint-disable-next-line no-case-declarations
            const wrapper = document.querySelector(
              '.vhall-saas-watchbox__mainContent__bigArea-placeholder'
            );
            // eslint-disable-next-line no-case-declarations
            const el = wrapper
              ? '.vhall-saas-watchbox__mainContent__bigArea-placeholder'
              : '.vhall-watch-doc';
            this.fullscreen(el);
            this.resize();
            break;
          default:
            break;
        }
      },
      fullscreen(el) {
        let video = document.querySelector('.vhall-saas-miniArea');
        if (this.isFullscreen) {
          this.exitFullscreen(el);
          video && (video.style.visibility = 'visible');
        } else {
          this.enterFullscreen(el);
          video && (video.style.visibility = 'hidden');
          setTimeout(() => {
            const wrapper = document.querySelector(
              '.vhall-saas-watchbox__mainContent__bigArea-placeholder'
            );
            wrapper && (wrapper.style.padding = '0px');
          }, 300);
        }
      },
      enterFullscreen(el) {
        let element = document.querySelector(el);
        if (element.requestFullscreen) element.requestFullscreen();
        else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
        else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) element.msRequestFullscreen();
        this.isFullscreen = true;
      },
      exitFullscreen() {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
        this.isFullscreen = false;
      }
    },
    beforeDestroy() {
      console.log('测试文档销毁================');
      this.docSDK.destroy();
      this.docSDK = null;
      window.removeEventListener('resize', this.resize);
    }
  };
</script>
<style lang="less" scoped>
  .vhall-watch-doc {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
    background-color: #292929;
    .vhall-doc-pager {
      user-select: none;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      bottom: 20px;
      padding: 7px 16px;
      background: rgba(0, 0, 0, 0.8);
      border-radius: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #f4f4f4;
      line-height: 1;
      font-size: 14px;
      & > div {
        padding: 7px 10px;
        &.active {
          background-color: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
          color: #fc5659;
        }
      }
      .iconfont {
        cursor: pointer;
        padding: 0 18px 0 0;
        &:last-child {
          padding: 0 0;
        }
        &:hover {
          color: #fc5659;
        }
      }
    }
    .watch-doc-placeholder {
      position: absolute;
      width: 100%;
      height: 100%;
      color: #6f6f6f;
      background-color: #2d2d2d;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-position: center;
      i {
        display: block;
        font-size: 90px;
        margin-bottom: 10px;
      }

      @media (max-width: 1366px) {
        background-size: 256.88px 136.07px;
      }
    }
    .doc-box {
      top: 50%;
      left: 50%;
      position: absolute;
      transform: translate(-50%, -50%);
      overflow: hidden !important;
    }
    .board-box {
      top: 50%;
      left: 50%;
      position: absolute;
      transform: translate(-50%, -50%);
      overflow: hidden !important;
    }
  }
</style>
