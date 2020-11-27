<template>
  <div class="doc-wrapper"  v-loading="loading" element-loading-text="文档加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="doc" ref="doc" v-show="docInfo.docContainerShow">
      <div
        :class="[
          'doc-inner-wrapper',
          hasDocPermission || (roleName == 3 && !this.disableAssistant)? '' : 'no-permission'
        ]"
        ref="docInner"
      >
        <div
          v-for="cid in cids"
          :key="cid"
          :id="cid"
          v-show="currentCid == cid"
          class="doc-box"
          :style="cid.split('-')[0] == 'document' ? docBoxStyle : boardBoxStyle"
        ></div>
      </div>
      <slot name="liveEnd"></slot>
      <slot
        v-if="hasDocPermission || (roleName == '3' && !this.disableAssistant)"
        name="humbnailList"
      ></slot>
      <slot name="placeholder" :docShowType="docInfo.docShowType"></slot>
      <slot
        v-if="hasDocPermission || (roleName == '3' && !this.disableAssistant)"
        name="pencilControlBar"
        :colorArr="colorArr"
        :sizeArr="sizeArr"
      >
        <pencil-control-bar
          v-show="docInfo.docShowType"
          :size-arr="sizeArr"
          :color-arr="colorArr"
          :show-graph="showGraph"
          :show-text="showText"
          @handleControlBar="handleControlBar"
        ></pencil-control-bar>
      </slot>

      <slot v-if="hasDocPermission || roleName == '3'" name="paginationBar">
        <pagination-bar
          v-show="docInfo.docShowType === 'document'"
          :page-info="pageInfo"
          @handlePage="handlePage"
          :disablePagechange="disableAssistant"
        ></pagination-bar>
      </slot>
    </div>
    <slot name="mainplaceholder" :docContainerShow="docInfo.docContainerShow">
      <div v-show="!docInfo.docContainerShow" style="color:white;"></div>
    </slot>
    <remote-script v-if="!VhallMsgSdk" src="//static.vhallyun.com/jssdk/vhall-jssdk-base/vhall-msg-1.0.9.js"></remote-script>
    <remote-script src="//static.vhallyun.com/jssdk/vhall-jssdk-doc/latest/vhall-jssdk-doc-3.1.4-1.js" @load="sdkLoad"></remote-script>
  </div>
</template>
<script>
// import this.$EventBus from '../../utils/Events';
import PencilControlBar from './pencil-control-bar';
import PaginationBar from './pagination-bar';

export default {
  props: {
    rebroadcast: {},
    webinarId: {
      required: true
    },
    token: {
      required: false
    },
    documentId: {
      required: true
    },
    docPermissionId: {
      required: true // 主讲人ID
    },
    roleName: {
      required: true // 角色类型
    },
    roomId: {
      required: true // eg "lss_bd1e9b69"
    },
    channelId: {
      required: true // eg "ch_ab95b2bb"
    },
    accountId: {
      required: true
    },
    appId: {
      required: true
    },
    // 直播状态 0待直播,1直播中,2直播结束
    liveStatus: {
      require: true
    },
    // 文档/白板选择画笔大小
    sizeArr: {
      type: Array,
      default () {
        return [6, 8, 12, 14, 16]; // 画笔直径，单位px
      }
    },
    colorArr: {
      type: Array,
      default () {
        return ['#FF0200', '#008002', '#0800FF', '#000000']; // 画笔颜色
      }
    },
    showGraph: {
      type: Boolean,
      default: false
    },
    showText: {
      type: Boolean,
      default: false
    },
    isInteract: {
      required: true
    },
    disableAssistant: {
      required: false,
      default: false
    },
    rebroadcastChannelId: {
      required: false
    },
    isVod: {
      type: Boolean,
      default: false,
    }
  },
  data () {
    return {
      liveEnd: false,
      backToManagerUrl: `/mywebinar/recordpart/${this.webinarId}`,
      docInfo: {
        showInWatch: false,
        docContainerShow: true,
        docShowType: '' // document 显示文档  board白板  '' 未添加文档
      },
      // isBoard: false,
      docBoxStyle: {}, // 文档宽高
      boardBoxStyle: {}, // 白板宽高
      // currentDocPermissionId: this.docPermissionId,
      pageInfo: {
        total: 0,
        pageIndex: 1
      },
      hasDocPermission: Boolean(this.docPermissionId == this.accountId),
      styleOpts: {
        style: {
          hasControls: true, // 是否有控制条
          hasBorders: true, // 每个控制块之间是否有连接线
          hasRotatingPoint: true, // 是否有旋转控制块
          transparentCorners: false, // 方向控制块是否是透明
          cornerStyle: 'circle', // 控制块样式， 支持:"circle", "square"
          padding: 8, // 控制块与元件的边界
          cornerSize: 13, // 控制块大小，单位px
          rotatingPointOffset: 19, // 旋转控制块的距离元件的距离
          borderColor: '#979797', // 连接线颜色
          cornerColor: '#007AFF', // 控制块填充色颜色
          cornerStrokeColor: '#007AFF' // 控制块描边颜色
        } // 样式，必填
      },
      docLoadComplete: false, // 文档加载状态
      cids: [], // 动态容器
      currentCid: '', // 当前正在展示的容器id
      isSetRole: -1, // 重新设置的新的角色
      VhallMsgSdk: !!window.VhallMsg
    };
  },
  components: { PencilControlBar, PaginationBar },
  watch: {
    docPermissionId (newval) {
      this.hasDocPermission = newval == this.accountId;
      if (this.hasDocPermission) {
        this.$EventBus.$emit('docInfo', this.docInfo);
        this.isSetRole = 1;
        // eslint-disable-next-line no-unused-vars
        this.docSDK && this.docSDK.setRole(window.roleTypeMap[1]).then(res => {
          console.log('文档---切换权限成功');
          this.isSetRole = -1;
        }).catch(() => {
          // 实例未全部加载完毕，切换失败
          console.log('文档---切换权限失败');
        });
        if (this.docInfo.docShowType == 'document') {
          this.docID && this.$EventBus.$emit('remote_doc_select', { id: this.docID });
        } else if (this.docInfo.docShowType == 'board') {
          this.boardID &&
            this.$EventBus.$emit('remote_doc_select', { id: this.boardID });
        }
      } else {
        if (this.roleName == 4 || this.roleName == 1) {
          this.isSetRole = 4;
          // eslint-disable-next-line no-unused-vars
          this.docSDK && this.docSDK.setRole(window.roleTypeMap[4]).then(res => {
            console.log('文档---切换权限成功');
            this.isSetRole = -1;
          }).catch(() => {
          // 实例未全部加载完毕，切换失败
            console.log('文档---切换权限失败');
          }); // 主持人或嘉宾
        }
        this.docInfo.docContainerShow = true;
      }
      console.log('是否具有文档编辑权限', this.hasDocPermission);
    },
    // eslint-disable-next-line no-unused-vars
    loading (val, old) {
      if (val && !this.loadingTimer) {
        this.loadingTimer = setTimeout(() => {
          clearTimeout(this.loadingTimer);
          this.loadingTimer = null;
          this.changeRoleAlert();
        }, 15000);
      } else if (!val) {
        if (this.loadingTimer) {
          clearTimeout(this.loadingTimer);
          this.loadingTimer = null;
        }
      }
    }
  },
  computed: {
    loading () {
      // 切换主讲人时，文档区域展示loading
      return this.isSetRole > -1;
    }
  },
  mounted () {
    this._listenEvents();
    // this._initDocSDK();

    window.onbeforeunload = () => {
      if (this.liveStatus != 1) {
        this.docSDK.resetContainer();
      }
    };
  },
  methods: {
    // ============================对外暴露方法 start===========================================================================
    /**
     *获取缩略图列表
     */
    getThumibnailList () {
      return this.docSDK.getThumbnailList({ id: this.currentCid });
    },
    /**
     * 切换显示主持端文档区域
     */
    toggleDocContainer (flag) {
      this.docInfo.docContainerShow = flag;
    },
    /**
     * 观看端是否可见
     */
    toggleWatchContainer (flag) {
      if (flag) {
        this.docSDK.switchOnContainer();
      } else {
        this.docSDK.switchOffContainer();
      }
      this.$EventBus.$emit('component_doc_watch_containner', flag);
    },

    /**
     * 切换显示白板 == 切换显示文档
     */
    toggleBoard (flag) {
      console.log('toggleBoard ======> ', flag);
      if (flag) {
        this.docInfo.docShowType = 'board';
        this.$nextTick(() => {
          this.initWidth('board');
          if (!this.boardID) {
            let cid = this.docSDK.createUUID('board');
            this.cids.push(cid);
            this.$nextTick(() => {
              console.log('gyh cids ======>', this.cids);
              this.initContainer('board', cid);
              this.activeContainer(cid);
            });
          } else {
            this.activeContainer(this.boardID);
            this.docSDK.setControlStyle(this.styleOpts);
          }
        });
      } else {
        if (this.docID) {
          this.docInfo.docShowType = 'document';
          this.$nextTick(() => {
            this.initWidth('document');
            this.activeContainer(this.docID);
            this.docSDK.setControlStyle(this.styleOpts);
          });
        } else {
          this.currentCid = '';
          this.docInfo.docShowType = '';
        }
      }
    },
    /**
     *跳到某一页
     */
    gotoPage (page) {
      let key = this.currentCid.split('-')[0];
      if (!this.currentCid || key == 'board') {
        return;
      }
      if (!this.docLoadComplete) {
        return this.$message.warning('请文档加载完成以后再操作');
      }
      this.docSDK.gotoPage({ page });
    },

    debuncePrev () {
      this.docSDK.prevStep();
    },

    debunceNext () {
      this.docSDK.nextStep();
    },

    /**
     * 文档翻页
     */
    handlePage (type) {
      let key = this.currentCid.split('-')[0];
      if (!this.currentCid || key == 'board') {
        return;
      }
      if (!this.docLoadComplete) {
        return this.$message.warning('请文档加载完成以后再操作');
      }
      switch (type) {
        case 'prePage':
          this.docSDK.prevPage();
          break;
        case 'prevStep':
          this.debuncePrev();
          break;
        case 'nextStep':
          // if (this.pageInfo.pageIndex >= this.pageInfo.total) {
          //   return
          // }
          this.debunceNext();
          break;
        case 'nextPage':
          if (this.pageInfo.pageIndex >= this.pageInfo.total) {
            return;
          }
          this.docSDK.nextPage();
          break;
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
        default:
          break;
      }
    },

    /**
     * 画笔，颜色，形状控制条操作
     */
    handleControlBar (event) {
      if (event.type != 'setColor') {
        console.log('取消缩放');
        this.docSDK.cancelZoom();
      }
      switch (event.type) {
        // 设置荧光笔
        case 'ygb':
          this.docSDK.setHighlighters();
          if (event.value) {
            this.docSDK.setStrokeWidth({ width: Number(event.value) });
          }
          break;
        // 设置画笔
        case 'hb':
          this.docSDK.setPen();
          if (event.value) {
            clearTimeout(this.timer);
            this.docSDK.setStrokeWidth({ width: Number(event.value) });
          }
          break;
        // 设置颜色
        case 'setColor':
          if (event.value) {
            this.docSDK.setStroke({ color: event.value });
          }
          break;
        // 设置图形
        case 'graph':
          this.docSDK[event.value]();
          break;
        // 设置橡皮擦
        case 'eraser':
          this.docSDK.setEraser();
          break;
        // 全部清除
        case 'clear':
          this.docSDK.clear();
          break;
        // 设置文字
        case 'font':
          this.docSDK.setText();
          if (event.value) {
            this.timer = setTimeout(() => {
              this.docSDK.setStrokeWidth({ width: Number(event.value) });
            }, 200);
          }
          break;
        // 设置宽度
        case 'strokeWidth':
          this.docSDK.setStrokeWidth({ width: Number(event.value) });
          break;
        // 取消画笔
        case 'cancelDrawable':
          this.docSDK.cancelDrawable();
          break;
        default:
          break;
      }
    },

    // ============================对外暴露方法 end==============================================================================
    /**
     * 加载远端文档/白板信息
     */
    async loadRemote () {
      const params = this.rebroadcastChannelId
        ? { channelId: this.rebroadcastChannelId }
        : null;
      this.cids = [];
      let res = await this.docSDK.getContainerInfo(params);
      console.log('loadRemote', res);
      // res.data会返回空数组或者一个对象，所以需要判断，应该是后端（朱俊亚）优化
      if (res instanceof Array && !res.length) {
        this.docInfo.docContainerShow = true;
        this.$EventBus.$emit('docInfo', this.docInfo);
        return;
      }
      let { list = [] } = res;
      this.docInfo.showInWatch = Boolean(res.switch_status);
      if (!list.length) {
        this.initUploadDoc();
        return;
      }

      let activeItem = list.find(item => item.active == 1);
      this.pageInfo = {
        total: activeItem.page,
        pageIndex: activeItem.show_page
      };
      this.docInfo.docContainerShow = true;
      this.docInfo.docShowType = activeItem.cid.split('-')[0];
      this.currentCid = activeItem.cid;
      this.cids = list.map(item => item.cid);
      this.$nextTick(() => {
        // eslint-disable-next-line no-unused-vars
        list.forEach((item, index) => {
          let type = item.is_board == 2 ? 'board' : 'document';
          this.initWidth(type);
          this.initContainer(type, item.cid, item.docId, true);
          if (type == 'document') {
            this.docID = item.cid;
          } else if (type == 'board') {
            this.boardID = item.cid;
          }
          this.docSDK.setRemoteData(item);
        });
        if (!activeItem) return;
        this.activeContainer(activeItem.cid);
        this.docSDK.setControlStyle(this.styleOpts);
      });
      this.$EventBus.$emit('docInfo', this.docInfo);
    },
    /**
     * 初始化文档区域宽度，window resize时也触发
     */
    initWidth (type = 'document') {
      if (!this.$refs.docInner) {
        return;
      }
      let style = window.getComputedStyle(this.$refs.docInner);
      let ratio = 16 / 9;
      let wrapWidth = parseFloat(style.width);
      let wrapHeight = parseFloat(style.height);
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
      } else {
        this.boardBoxStyle = {
          width: `${docBoxWidth}px`,
          height: `${docBoxHeight}px`
        };
      }
    },
    _listenEvents () {
      window.addEventListener('resize', () => {
        this.resize();
      });
      /**
       * 处理键盘事件：上下左右，pageDown,pageUp翻页
       */
      document.addEventListener('keyup', e => {
        switch (e.key) {
          case 'ArrowUp':
          case 'PageUp':
            this.handlePage('prevStep');
            break;
          case 'ArrowDown':
          case 'PageDown':
            this.handlePage('nextStep');
            break;
          case 'ArrowLeft':
            this.handlePage('prePage');
            break;
          case 'ArrowRight':
            this.handlePage('nextPage');
            break;
          default:
            break;
        }
      });

      // 文档列表组件触发演示文档事件
      this.$EventBus.$on('demonstration', data => {
        this.docLoadComplete = false;
        this.toggleWatchContainer(data.docVisibleToAudience);
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

        setTimeout(() => {
          let cid = this.docSDK.createUUID('document');
          this.currentCid = cid;
          this.cids.push(cid);
          this.docInfo.docShowType = 'document';
          this.$nextTick(() => {
            this.initWidth();
            this.initContainer('document', cid, data.documentId);
            this.docSDK.loadDoc({ docId: data.documentId, id: this.currentCid });
            this.activeContainer(cid); // 创建后的选择不能延迟，否则不会派发文档加载完成事件
          });
        }, 300);
      });

      // 开始直播事件
      this.$EventBus.$on('startLive', () => {
        this.liveEnd = false;
      });
      // 开始直播事件
      this.$EventBus.$on('live_start', () => {
        if (this.roleName == '1') {
          const type = this.isInteract == 1 ? 2 : 1;
          this.docSDK.start(1, type);
          this.docSDK.republish();
        }
        if (this.roleName != 1) {
          this.loadRemote();
        }
      });
      // 结束直播事件
      this.$EventBus.$on('live_over', () => {
        this.liveEnd = true;
        this.cids = [];
        this.currentCid = '';
        this.docSDK.resetContainer();
        this.boardID = '';
        this.docID = '';
        if (this.roleName == '1') {
          this.docInfo = {
            showInWatch: false,
            docContainerShow: true,
            docShowType: '' // document 显示文档  board白板  '' 未添加文档
          };
          const type = this.isInteract == 1 ? 2 : 1;
          this.docSDK.start(2, type);
        } else {
          this.docInfo = {
            showInWatch: false,
            docContainerShow: true,
            docShowType: '' // document 显示文档  board白板  '' 未添加文档
          };
        }
        this.$EventBus.$emit('docInfo', this.docInfo);
      });
      // 互动连麦成功
      // eslint-disable-next-line no-unused-vars
      this.$EventBus.$on('vrtc_connect_success', msg => {
        if (this.$route.query.assistantType) {
          this.resize();
        }
      });
      // 互动连麦断开成功
      // eslint-disable-next-line no-unused-vars
      this.$EventBus.$on('vrtc_disconnect_success', msg => {
        if (this.$route.query.assistantType) {
          this.resize();
        }
      });
      // 开始转播
      // eslint-disable-next-line no-unused-vars
      this.$EventBus.$on('live_broadcast_start', msg => {
        this.docSDK && this.docSDK.setRole(window.roleTypeMap[2]);
        this.docSDK &&
          this.docSDK.setAccountId({ accountId: this.accountId + '7890' });
        this.docInfo.showInWatch = false;
        this.$EventBus.$emit('docInfo', this.docInfo);
        if (this.rebroadcastStartTimer) {
          clearTimeout(this.rebroadcastStartTimer);
          this.rebroadcastStartTimer = null;
        }
        this.rebroadcastStartTimer = setTimeout(() => {
          this.docSDK && this.docSDK.setPlayMode(window.VHDocSDK.PlayMode.FLV);
          this.loadRemote();
          this.hasDocPermission = false;
          clearTimeout(this.rebroadcastStartTimer);
          this.rebroadcastStartTimer = null;
        }, 1000);
      });
      // 结束转播
      // eslint-disable-next-line no-unused-vars
      this.$EventBus.$on('live_broadcast_stop', msg => {
        this.docSDK && this.docSDK.setAccountId({ accountId: this.accountId });
        clearTimeout(this.rebroadcastStopTimer);
        this.rebroadcastStopTimer = setTimeout(() => {
          this.$EventBus.$emit('documenet_load_complete', []);
          this.boardID = '';
          this.docID = '';
          this.cids = [];
          this.currentCid = '';
          this.docInfo.showInWatch = false;
          this.docInfo.docContainerShow = true;
          this.docInfo.docShowType = '';
          this.$EventBus.$emit('docInfo', this.docInfo);
          if (this.liveStatus == 1) {
            this.loadRemote();
          }
          this.docSDK && this.docSDK.setRole(window.roleTypeMap[1]);
          this.docSDK && this.docSDK.setPlayMode(window.VHDocSDK.PlayMode.INTERACT);
          this.hasDocPermission = true;
        }, 1000);
      });
      // 设置主讲人
      // this.$EventBus.$on('vrtc_speaker_switch', msg => {
      //   this.currentDocPermissionId = msg.room_join_id
      // })
    },
    // 重新计算文档区域
    resize () {
      if (this.docInfo.docContainerShow && this.docInfo.docShowType) {
        console.log('=======触发了resize事件 ========================');
        this.$nextTick(() => {
          this.initWidth(this.docInfo.docShowType);
          if (this.docInfo.docShowType === 'document') {
            this.docSDK.setSize(
              parseFloat(this.docBoxStyle.width),
              parseFloat(this.docBoxStyle.height),
              {
                id: this.docID
              }
            );
          } else {
            this.docSDK.setSize(
              parseFloat(this.boardBoxStyle.width),
              parseFloat(this.boardBoxStyle.height),
              {
                id: this.boardID
              }
            );
          }
        });
      }
    },
    /**
     * 初始化文档SDK实例,演示文档时调用
     */
    _initDocSDK () {
      let hide = this.$route.query.hide == 1;
      let mode = this.roleName == 3 ? window.window.VHDocSDK.PlayMode.FLV : window.window.VHDocSDK.PlayMode.INTERACT;
      let opt = {
        accountId: this.accountId,
        roomId: this.roomId,
        channelId: this.channelId, // 频道id 必须
        appId: this.appId, // appId 必须
        role: window.roleTypeMap[this.disableAssistant ? 2 : this.roleName], // 角色 必须, 助理无文档权限时设置观众权限
        isVod: this.isVod, // 是否是回放 必须
        client: window.VHDocSDK.Client.PC_WEB, // 客户端类型
        token: this.token,
        hide,
        mode
      };
      let success = () => {
        this.docLoadComplete = false;
        if (this.hasDocPermission) {
          this.docSDK.setRole(window.roleTypeMap[1]);
        } else {
          this.docSDK.setRole(
            window.roleTypeMap[this.disableAssistant ? 2 : this.roleName]
          );
        }
        // 刷新时，如果在直播中会加载远端文档信息
        if (this.roleName == 1) {
          if (this.rebroadcastChannelId) {
            this.docSDK.setAccountId({ accountId: this.accountId + '7890' });
            this.docInfo.showInWatch = false;
            this.$EventBus.$emit('docInfo', this.docInfo);
            this.docSDK.setRole(window.roleTypeMap[2]);
            this.docSDK.setPlayMode(window.VHDocSDK.PlayMode.FLV);
            this.hasDocPermission = false;
          }
          this.loadRemote();
        } else {
          if (this.liveStatus == 1) {
            this.loadRemote();
          }
        }

        // 主持人，嘉宾
        if (
          (this.roleName == 1 || this.roleName == 4) &&
          !this.rebroadcastChannelId
        ) {
          this.docSDK.setPlayMode(window.VHDocSDK.PlayMode.INTERACT);
        }

        // 助理
        if (this.roleName == 3) {
          this.docSDK.setPlayMode(window.VHDocSDK.PlayMode.FLV);
        }
        console.log('实例化文档成功', this.docSDK);
        this.$EventBus.$emit('docSDK_ready', this.docSDK);
        window.docSDK = this.docSDK;
      };
      let failed = error => {
        console.error('实例化文档失败', error.msg);
      };
      this.docSDK = window.VHDocSDK.createInstance(opt, success, failed);

      // 助手端还需要监听房间消息
      if (this.$route.query.assistantType) {
        window.chatSDK.onRoomMsg(msg => {
          if (typeof msg !== 'object') {
            msg = JSON.parse(msg);
          }
          console.log('==========房间消息===========', msg);
          msg.data = JSON.parse(msg.data);
          Object.assign(msg, msg.data);
          this.$EventBus.$emit(msg.type, msg);
        });
      }
      // 设置编辑权限
      // this.docSDK.setEditable(this.hasDocPermission)

      this.docSDK.on(window.VHDocSDK.Event.ERROR, error => {
        console.error('===================文档错误====================', error);
      });

      this.docSDK.on(window.VHDocSDK.Event.DOCUMENT_LOAD_COMPLETE, data => {
        console.log('===================文档加载完成====================', data);
        // this.isPageShow = true
        this.pageInfo = {
          total: data.info.slidesTotal,
          pageIndex: Number(data.info.slideIndex) + 1
        };
        let res = this.docSDK.getThumbnailList({ id: this.docID });
        const thumbnailList = res[0] ? res[0].list : [];
        this.$EventBus.$emit('documenet_load_complete', thumbnailList);
      });
      this.docSDK.on(window.VHDocSDK.Event.PAGE_CHANGE, data => {
        console.log('===================文档翻页====================', data);
        this.$EventBus.$emit('PAGE_CHANGE', data.info.slideIndex);
        this.pageInfo = {
          total: data.info.slidesTotal,
          pageIndex: Number(data.info.slideIndex) + 1
        };
      });

      this.docSDK.on(window.VHDocSDK.Event.SWITCH_CHANGE, status => {
        if (this.hasDocPermission) return;
        console.log('==========控制文档开关=============', status);
        if (status == 'on') {
          this.toggleWatchContainer(true); // 同步各个端 文档开关状态
          this.docInfo.showInWatch = true;
        } else {
          this.toggleWatchContainer(false); // 同步各个端 文档开关状态
          this.docInfo.showInWatch = false;
        }
        this.$EventBus.$emit('docInfo', this.docInfo);
      });
      this.docSDK.on(window.VHDocSDK.Event.CREATE_CONTAINER, data => {
        if (
          (this.roleName != 1 && this.liveStatus != 1) ||
          this.cids.includes(data.id)
        ) {
          return;
        }
        console.log('===================创建容器====================', data);
        this.docInfo.docContainerShow = true;
        this.docInfo.docShowType = data.type;
        this.cids.push(data.id);
        this.$nextTick(() => {
          this.initWidth(data.type);
          this.initContainer(data.type, data.id, '');
        });
      });
      this.docSDK.on(window.VHDocSDK.Event.DELETE_CONTAINER, data => {
        if (this.roleName != 1 && this.liveStatus != 1) {
          return;
        }
        console.log('===============删除容器=======================', data);
        let index = this.cids.indexOf(data.id);
        if (index > -1) {
          this.cids.splice(index, 1);
          this.docSDK.destroyContainer({ id: data.id });
        }
        if (this.currentCid == data.id) {
          this.currentCid = '';
          this.docInfo.docShowType = '';
        }
      });
      this.docSDK.on(window.VHDocSDK.Event.SELECT_CONTAINER, async data => {
        if (
          this.currentCid == data.id ||
          (this.roleName != 1 && this.liveStatus != 1)
        ) {
          return;
        }
        console.log('===============选择容器=======================', data);
        this.docInfo.docShowType = data.id.split('-')[0];
        this.currentCid = data.id;
        // 判断容器是否存在
        if (this.cids.indexOf(data.id) > -1) {
          this.activeContainer(data.id);
        } else {
          this.cids.push(data.id);
          await this.$nextTick();
          this.initWidth(data.type);
          this.initContainer(data.type, data.id, '');
          this.activeContainer(data.id);
        }
        this.$EventBus.$emit('docInfo', this.docInfo);
        this.docSDK.setControlStyle(this.styleOpts);
      });

      this.docSDK.on(window.VHDocSDK.Event.ALL_COMPLETE, () => {
        console.log('=============所有文档加载完成==============');
        this.docLoadComplete = true;
        if (this.isSetRole > -1) {
          // eslint-disable-next-line no-unused-vars
          this.docSDK.setRole(window.roleTypeMap[this.isSetRole]).then(res => {
            this.isSetRole = -1;
          }).catch(() => {
            // 实例未全部加载完毕，切换失败
            console.log('=============文档没有在完成===========');
            // this.isSetRole = this.isSetRole
          });
        }
      });
      // eslint-disable-next-line no-unused-vars
      this.docSDK.on(window.VHDocSDK.Event.DOCUMENT_NOT_EXIT, ({cid, docId}) => {
        console.log('====================文档不存在或已删除=================', cid);
        if (cid == this.currentCid) {
          this.$message({
            type: 'error',
            message: '文档不存在或已删除'
          });
          this.deleteTimer = setTimeout(() => {
            this.docID = '';
            let index = this.cids.indexOf(cid);
            this.cids.splice(index, 1);
            this.docSDK.destroyContainer({id: this.currentCid});
            this.currentCid = '';
            this.docInfo.docShowType = '';
          }, 3000); // 其他地方调用回将值重新传入
        }
      });
      // eslint-disable-next-line no-unused-vars
      this.docSDK.on(window.VHDocSDK.Event.DOCUMENT_LOAD_COMPLETE, data => {
        // this.docLoadComplete = true
      });
    },
    /**
     * 初始化文档容器
     * documentId在主讲人状态时，是演示的文档ID,其他角色时，是创建文档/白板的UUID
     */
    initContainer (type = 'document', cid, documentId, noDispatch = false) {
      console.log('初始化容器的参数===========', cid, documentId);
      if (type === 'document') {
        let opts = {
          id: cid,
          docId: documentId,
          elId: cid, // div 容器 必须
          width: parseFloat(this.docBoxStyle.width), // div 宽度，像素单位，数值型不带px 必须
          height: parseFloat(this.docBoxStyle.height), // div 高度，像素单位，数值型不带px 必须
          noDispatch: noDispatch
        };
        this.docSDK.createDocument(opts);
        this.docSDK.setControlStyle(this.styleOpts);
      } else {
        this.boardID = cid;
        let opts = {
          id: cid,
          elId: cid, // div 容器 必须
          width: parseFloat(this.boardBoxStyle.width), // div 宽度，像素单位，数值型不带px 必须
          height: parseFloat(this.boardBoxStyle.height), // div 高度，像素单位，数值型不带px 必须
          backgroundColor: '#FFFFFF',
          noDispatch: noDispatch
        };
        this.docSDK.createBoard(opts);
        this.docSDK.setControlStyle(this.styleOpts);
      }
    },
    /**
     * 创建直播时有上传文档，则显示上传文档
     */
    async initUploadDoc () {
      if (this.documentId) {
        this.docInfo.docContainerShow = true;
        this.docInfo.docShowType = 'document';
        this.$EventBus.$emit('docInfo', this.docInfo);
        let cid = this.docSDK.createUUID('document');
        this.cids.push(cid);
        this.$forceUpdate();
        // await
        this.$nextTick(()=>{
          this.initWidth();
          this.initContainer('document', cid, this.documentId, true);
          this.docSDK.loadDoc({ docId: this.documentId, id: cid });
          this.activeContainer(cid);
        });

      }
    },
    // 激活容器，设置默认画笔颜色
    activeContainer (cid = '', isEvent = true) {
      this.docSDK.selectContainer({id: cid});
      this.currentCid = cid;
      isEvent && this.$EventBus.$emit('remote_doc_select', { id: cid });
      let type = cid.split('-')[0];
      if (type == 'document') {
        this.docID = cid;
      }
    },
    // 切换角色时可能触发的弹窗
    changeRoleAlert () {
      this.$alert('文档加载失败，请尝试刷新浏览器', '', {
        title: '提示',
        confirmButtonText: '立即刷新',
        center: true,
        showClose: false,
        // eslint-disable-next-line no-unused-vars
        callback: action => {
          window.location.reload();
        }
      });
    },
    sdkLoad(){
      window.roleTypeMap = {
        1: window.VHDocSDK.RoleType.HOST, // 1     主持人[1]
        2: window.VHDocSDK.RoleType.SPECTATOR, // 3 观众[2]
        3: window.VHDocSDK.RoleType.ASSISTANT, // 4 助理[3]
        4: window.VHDocSDK.RoleType.GUEST // 2 嘉宾[4]
      };
      this._initDocSDK();
      // if(window.VhallMsg)

    }
  },
  destroyed () {
    console.log('destroyed');
    this.docSDK.destroy();
    this.docSDK = null;
  }
};
</script>
<style lang="less" scoped>
.doc-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .doc-inner-wrapper {
    position: absolute;
    left: 0;
    right: 0;
    top: 50px;
    bottom: 0;
    overflow: hidden;
    &.no-permission {
      top: 0px;
    }
  }
  .doc {
    width: 100%;
    height: 100%;
    position: relative;
    // padding-top: 40px;
    box-sizing: border-box;
    background-color: #292929;
    .switch-white-board {
      top: 0;
      right: 20px;
      position: absolute;
    }
    .doc-box {
      top: 50%;
      left: 50%;
      position: absolute;
      transform: translate(-50%, -50%);
      overflow: visible !important;
    }
    .board-box {
      top: 50%;
      left: 50%;
      position: absolute;
      transform: translate(-50%, -50%);
      overflow: visible !important;
    }
    .thumbnail-wrapper {
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
    }
  }
  .doc-empty {
    width: 100%;
    height: 100%;
    background: url('../../common/images/doc-default.png') no-repeat;
    background-color: #23232b;
    background-size: 387px 205px;
    background-position: center;
    @media (max-width: 1366px) {
      background-size: 256.88px 136.07px;
    }
  }
   /deep/ .el-loading-spinner {
    margin-top: 0;
    transform: translateY(-50%);
    i {
      color: #fff;
      font-size: 24px;
    }
    .el-loading-text {
      color: #fff;
    }
  }
}
.live-end-mask {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  box-sizing: border-box;
  z-index: 600;
  background: url('https://t-alistatic01.e.vhall.com/static/images/interact/endcover.jpg?v=%2BrM3tCz1%2BRV%2BsxuP6fa7Bg%3D%3D')
    no-repeat;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    text-align: center;
    font-size: 24px;
    line-height: 80px;
    height: 80px;
    color: #fff;
    text-align: center;
    letter-spacing: 1px;
  }
  .back-to-manager {
    color: #fff;
    text-decoration: underline;
  }
}
</style>
