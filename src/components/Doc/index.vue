<template>
  <div class="vh-doc" ref="docInner">
    <div class="vh-doc__wrap" v-show="docInfo.showContainer && docInfo.cid">
      <div class="vh-doc__box">
        <div
          v-for="cid in cids"
          :key="cid"
          :id="cid"
          v-show="docInfo.cid == cid"
          class="vh-doc__show student"
          :style="boxStyle"
        ></div>
      </div>
      <slot v-if="hasDocPermission || roleName == 3" name="humbnailList"></slot>
      <slot v-if="hasDocPermission && roleName != 3" name="pencilControlBar" :colorArr="colorArr" :sizeArr="sizeArr">
        <pencil-control-bar
          v-show="docInfo.cid && docInfo.cid == docInfo.docID"
          :size-arr="sizeArr"
          :color-arr="colorArr"
          :show-graph="showGraph"
          :show-text="showText"
          @handleControlBar="handleControlBar"
        ></pencil-control-bar>
      </slot>
      <slot v-if="hasDocPermission || roleName == '3'" name="paginationBar">
        <pagination-bar
          v-show="docInfo.cid && docInfo.cid == docInfo.docID && permission.indexOf(11004) > -1"
          :page-info="pageInfo"
          @handlePage="handlePage"
          :isKeyEvent="isKeyEvent"
        ></pagination-bar>
      </slot>
    </div>
    <slot name="mainplaceholder" v-if="!(docInfo.showContainer && docInfo.cid)"></slot>
    <remote-script src="//static.vhallyun.com/jssdk/vhall-jssdk-doc/latest/vhall-jssdk-doc-3.1.1.js" @load="sdkLoad"></remote-script>
  </div>
</template>
<script>
import PencilControlBar from './pencil-control-bar';
import PaginationBar from './pagination-bar';
/**
 * 文档白板模块
 * @author qi.chen
 *
 * @component
 *
 */
export default {
  name: 'vhDoc',
  data () {
    return {
      docSDK: null, // 问答个实例
      docInfo: {
        showContainer: false, // 观看端是否显示
        cid: '', // 正在展示的文档或者白板id
        docID: '', // 发起端的远程列表中的文档id
        boardID: '' // 发起端的远程列表中的白板id
      },
      cids: [], // 所有演示过的文档的id
      pageInfo: {
        total: 0, // 当前展示文档总页数
        pageIndex: 0
      },

      hasDocPermission: Boolean(this.docPermissionId == this.accountId),
      boxStyle: {}, // 白板/文档宽高
      permission: JSON.parse(sessionStorage.getItem('vhall-permission')) || [],
      roleTypeMap: {}
    };
  },
  props: {
    /**
     *  频道id
     */
    channelId: {
      type: String,
      required: true
    },
    /**
     *  appid
     */
    appId: {
      type: String,
      required: true
    },
    /**
     *  角色类型， 1主持人（默认主讲人，2观众，3助理，4嘉宾)
     */
    roleName: {
      type: [String, Number],
      required: true // 角色类型
    },
    /**
     *  回放
     */
    isVod: {
      type: Boolean,
      required: true // 是否是回放
    },
    /**
     *  房间id
     */
    roomId: {
      type: String,
      required: true
    },
    /**
     *  pass token 初始化sdk
     */
    token: {
      type: String,
      required: true
    },
    /**
     *  用户id
     */
    accountId: {
      type: [String, Number],
      required: true
    },
    /**
     *  可操作文档人的id
     */
    docPermissionId: {
      type: [String, Number],
      required: true
    },
    /**
     * 互动状态： 0预约， 1直播中，2结束
     */
    liveStatus: {
      type: [String, Number],
      required: true // 活动状态
    },
    /**
     * 文档/白板选择画笔大小
     */
    sizeArr: {
      type: Array,
      default () {
        return [6, 8, 12, 14, 16]; // 画笔直径，单位px
      }
    },
    /**
     * 画笔颜色
     */
    colorArr: {
      type: Array,
      default () {
        return ['#1E90FF', '#B01EFF', '#5064FE', '#F1831C', '#FF3D41', '#1AD5CE', '#FFFFFF', '#666666', '#000000'];
      }
    },
    /**
     * 多边形功能
     */
    showGraph: {
      type: Boolean,
      default: false
    },
    /**
     * 文字功能
     */
    showText: {
      type: Boolean,
      default: false
    },
    broadcastChannelId: {
      type: String,
      default: '',
      required: false
    },
    isKeyEvent: {
      // 翻页是否监听键盘事件
      type: Boolean,
      default: true,
      required: false
    }
  },
  components: { PencilControlBar, PaginationBar },
  watch: {
    docPermissionId (newval) {
      // 文档操作权限 写，画笔

      this.hasDocPermission = newval == this.accountId;
      console.debug('docPermissionId', newval, this.accountId);
      let index = Number(this.roleName);
      if (this.hasDocPermission) {
        if (this.docSDK) {
          this.setSdkRole(1, 'INTERACT');
          this.handleControlBar('hb');
        }
      } else {
        if (this.roleName == 1 || this.roleName == 4) {
          this.docSDK && this.setSdkRole(4, 'INTERACT');
        } else {
          this.docSDK && this.setSdkRole(this.roleTypeMap[index], 'FLV');
        }
      }
    },
    docInfo: {
      handler (val) {
        this.$EventBus.$emit('component_doc_info', val);
      },
      deep: true
    }
  },
  mounted () {
    this._listenEvents();
    // this._initSDK();
    this.stopKeyPropagation();
    console.log('文档传入的参数======', this.$props);
  },
  methods: {
    /**
     * 初始化组件监听的事件
     */
    _listenEvents () {
      window.addEventListener('resize', () => {
        this.resize();
      });
      /**
       * 处理键盘事件：上下左右，pageDown,pageUp翻页
       */
      this.isKeyEvent &&
        document.addEventListener('keyup', (e) => {
          switch (e.key) {
            case 'ArrowUp':
              this.handlePage('prePage');
              break;
            case 'ArrowDown':
              this.handlePage('nextPage');
              break;
            case 'ArrowLeft':
              this.handlePage('prevStep');
              break;
            case 'ArrowRight':
              this.handlePage('nextStep');
              break;
            case 'PageUp':
              this.gotoPage(0);
              break;
            case 'PageDown':
              this.gotoPage(this.pageInfo.total - 1);
              break;
            default:
              break;
          }
        });

      // 文档列表组件触发演示文档事件
      this.$EventBus.$on('component_doc_demonstration', (data) => {
        console.log('============列表初始演示==============', data);
        this.cids.forEach((item) => {
          let type = item.split('-')[0];
          if (type == 'document') {
            this.docSDK.destroyContainer({ id: item });
          }
        });
        // 删除多余的容器
        if (this.docInfo.boardID) {
          this.cids = [this.docInfo.boardID];
        } else {
          this.cids = [];
        }
        let cid = this.docSDK.createUUID('document');
        this.cids.push(cid);
        this.$nextTick(() => {
          this.initContainer('document', cid, data.documentId);
          this.docSDK.loadDoc({ docId: data.documentId, id: cid });
          this.activeContainer(cid);
        });
      });
    },
    /**
     * 初始化文档/白板sdk
     */
    _initSDK () {
      let role = this.roleTypeMap[2];
      let mode = window.VHDocSDK.PlayMode.FLV;
      if (this.hasDocPermission) {
        mode = window.VHDocSDK.PlayMode.INTERACT;
        role = this.roleTypeMap[1];
      } else if (this.roleName == 1 || this.roleName == 4) {
        mode = window.VHDocSDK.PlayMode.INTERACT;
        role = this.roleTypeMap[4];
      } else if (this.roleName == 3) {
        role = this.roleTypeMap[3];
      }
      let opt = {
        channelId: this.channelId, // 频道id 必须
        appId: this.appId, // appId 必须
        role, // 角色 必须
        isVod: this.isVod, // 是否是回放 必须
        client: window.VHDocSDK.Client.PC_WEB, // 客户端类型
        roomId: this.roomId, // 必须， 房间ID
        accountId: this.accountId, // paas 账户id， 必须
        token: this.token, // 必须， token，初始化接口获取
        hide: false, // 非必须， 默认false
        mode
      };
      console.log('===实例参数===', opt);
      // 失败回调
      let failed = (error) => {
        console.error('===实例化文档失败===', error.msg);
      };
      // 成功回调
      let success = () => {
        console.log('===实例化文档参数成功===');
        if (this.liveStatus == 1) {
          if (this.hasDocPermission) {
            this.docSDK.republish();
          }
          this.loadRemote(this.broadcastChannelId || '');
        }
        if (this.hasDocPermission) {
          if (this.broadcastChannelId) {
            this.docSDK.setAccountId({ accountId: this.accountId + '7890' });
            this.docInfo.showInWatch = false;
            this.$EventBus.$emit('docInfo', this.docInfo);
            this.setSdkRole(2, 'FLV');
            this.hasDocPermission = false;
          }
        }
        // 设置控制条样式
        let styleOpts = {
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
        };
        this.docSDK.setControlStyle(styleOpts);
        this.$EventBus.$emit('component_docSDK_ready', this.docSDK);
      };

      this.docSDK = window.VHDocSDK.createInstance(opt, success, failed);

      // 翻页事件
      this.refresh = true;
      this.docSDK.on(window.VHDocSDK.Event.PAGE_CHANGE, (data) => {
        console.log('===================翻页====================');
        this.pageInfo = {
          total: data.info.slidesTotal,
          pageIndex: Number(data.info.slideIndex) + 1
        };
        if (this.refresh || this.pageInfo.pageIndex == 1) {
          this.resize();
          this.refresh = false;
        }
        this.$EventBus.$emit('component_page_info', this.pageInfo);
      });

      // 创建容器事件
      this.docSDK.on(window.VHDocSDK.Event.CREATE_CONTAINER, (data) => {
        console.log('===================创建容器====================', data);
        if (this.cids.indexOf(data.id) > -1) return;
        this.cids.push(data.id);
        this.$nextTick(() => {
          this.initContainer(data.type, data.id);
          this.activeContainer(data.id);
        });
      });

      // 选择容器
      this.docSDK.on(window.VHDocSDK.Event.SELECT_CONTAINER, (data) => {
        console.log('===============选择容器=======================', data);
        // 兼容如果选择消息比创建消息先派发的问题
        if (this.cids.indexOf(data.id) > -1) {
          this.activeContainer(data.id);
        } else {
          this.cids.push(data.id);
          this.$nextTick(() => {
            this.initContainer(data.type, data.id);
            this.activeContainer(data.id);
          });
        }
        this.resize();
      });

      // 文档加载完成
      this.docSDK.on(window.VHDocSDK.Event.DOCUMENT_LOAD_COMPLETE, (data) => {
        // 数据格式同 window.VHDocSDK.Event.PAGE_CHANGE
        console.log('===================文档加载完成====================', data);
        this.$EventBus.$emit('component_doc_id', data.docId || data.info.docId);
        this.pageInfo = {
          total: data.info.slidesTotal,
          pageIndex: Number(data.info.slideIndex) + 1
        };
        let res = this.docSDK.getThumbnailList({ id: this.docInfo.docID });
        this.$EventBus.$emit('component_documenet_load_complete', res[0].list);
      });

      // 开关变换
      this.docSDK.on(window.VHDocSDK.Event.SWITCH_CHANGE, (status) => {
        console.log('==========控制文档开关=============', status);
        if (status == 'on') {
          this.docInfo.showContainer = true;
          this.resize();
        } else if (!this.hasDocPermission) {
          this.docInfo.showContainer = false;
        }
        this.toggleWatchContainer(this.docInfo.showContainer); // 同步各端状态
      });

      // 删除容器时候触发的事件
      this.docSDK.on(window.VHDocSDK.Event.DELETE_CONTAINER, (data) => {
        console.log('===============删除容器=======================', data);
        if (this.cids.indexOf(data.id) > -1) {
          this.docSDK.destroyContainer({ id: data.id });
        }
        if (data.id == this.docInfo.cid) {
          this.docInfo.cid = '';
        }
        if (data.id == this.docInfo.docID) {
          this.docInfo.docID = '';
        } else if (data.id == this.docInfo.boardID) {
          this.docInfo.boardID = '';
        }
      });

      // 报错信息
      this.docSDK.on(window.VHDocSDK.Event.ERROR, (data) => {console.log(window.VHDocSDK.Event.ERROR, data);});

      // 视频回放中，timeupdate事件
      let first = true;
      this.docSDK.on(window.VHDocSDK.Event.VOD_TIME_UPDATE, (data) => {
        if (this.isVod) {
          if (first) {
            this.$EventBus.$emit('component_doc_info', this.docInfo);
            first = false;
          }
          if (data.watchOpen != this.docInfo.showContainer) {
            this.docInfo.showContainer = data.watchOpen;
            this.$EventBus.$emit('component_doc_info', this.docInfo);
          }
          if (data.activeId && this.cids.indexOf(data.activeId) > -1) {
            this.activeContainer(data.activeId);
          } else if (data.activeId && this.cids.indexOf(data.activeId) == -1) {
            this.cids.push(data.activeId);
            this.$nextTick(() => {
              let type = data.activeId.split('-')[0] || 'document';
              this.initContainer(type, data.activeId, '');
              this.activeContainer(data.activeId);
            });
            // this.initContainer(type.toLowerCase(), cid documentId)
          } else {
            this.docInfo.cid = '';
          }
        }
      });

      // 回放文件加载完成事件
      this.docSDK.once(window.VHDocSDK.Event.VOD_CUEPOINT_LOAD_COMPLETE, (data) => {
        console.log(window.VHDocSDK.Event.VOD_CUEPOINT_LOAD_COMPLETE, data);
        const list = this.docSDK.getVodAllCids();
        console.log('=====回放文件加载完成====', list);
        this.cids = [];
        this.cids = list.map((item) => item.cid);
        this.$nextTick(() => {
          list.forEach((item) => {
            const { cid, type, documentId } = item;
            this.initContainer(type.toLowerCase(), cid, documentId);
          });
        });
      });
      // 所有的文档准备完成
      this.docSDK.on(window.VHDocSDK.Event.ALL_COMPLETE, () => {
        console.log('=============所有文档加载完成==============');
        this.docLoadComplete = true;
        if (this.isSetRole > -1) {
          this.setSdkRole(this.isSetRole);
        }
      });
      // 正在演示的文档被删除
      this.docSDK.on(window.VHDocSDK.Event.DOCUMENT_NOT_EXIT, ({ cid, docId }) => {
        console.log('====================文档不存在或已删除=================', cid, docId);
        if (cid == this.docInfo.cid) {
          this.$message({
            type: 'error',
            message: '文档不存在或已删除'
          });
          this.deleteTimer = setTimeout(() => {
            this.docInfo.docID = '';
            let index = this.cids.indexOf(cid);
            this.cids.splice(index, 1);
            this.docSDK.destroyContainer({ id: this.currentCid });
            this.docInfo.cid = '';
            this.docInfo.docShowType = '';
          }, 3000); // 其他地方调用回将值重新传入
        }
      });
    },
    /**
     * 加载远端文档/白板信息
     */
    async loadRemote (channelId) {
      let param = channelId ? { channelId: channelId } : null;
      console.debug('loadRemote', param);
      let res = await this.docSDK.getContainerInfo(param);
      console.debug('loadRemote', res);
      let { list = [] } = res;
      let activeItem = list.find((item) => item.active == 1);
      this.docInfo.showContainer = Boolean(res.switch_status);
      this.cids = [];
      this.cids = list.map((item) => item.cid);
      if (activeItem) {
        this.pageInfo = {
          total: activeItem.page,
          pageIndex: activeItem.show_page
        };
        this.docInfo.cid = activeItem.cid;
        this.$EventBus.$emit('component_doc_id', activeItem.docId);
      }
      this.$nextTick(() => {
        let type = '';
        list.forEach((item) => {
          if (item.is_board == 2) {
            this.docInfo.boardID = item.cid;
            type = 'board';
          } else {
            this.docInfo.docID = item.cid;
            type = 'document';
          }

          this.initContainer(type, item.cid, item.documentId, true);
          this.docSDK.setRemoteData(item);
        });
        if (activeItem) {
          this.activeContainer(activeItem.cid);
          if (this.hasDocPermission) {
            setTimeout(() => {
              this.handleControlBar('hb');
            }, 5000);
          }
        }
      });
      this.$EventBus.$emit('component_doc_info', this.docInfo);
    },
    /**
     * 创建 白板/文档
     * @param {String} type - document文档 board白板
     * @param {String} cid - sdk返回的一个id
     * @param {String} documentId - 文档id
     */
    initContainer (type = 'document', cid, documentId, noDispatch = false) {
      // await this.initWidth()
      // 避免在小屏幕初始化后,画笔等工具很粗
      let wrapWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      let wrapHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      let ratio = 16 / 9;
      if (wrapWidth / wrapHeight > ratio) {
        this.boxStyle.height = wrapHeight;
        this.boxStyle.width = this.boxStyle.height * ratio;
      } else {
        this.boxStyle.width = wrapWidth;
        this.boxStyle.height = this.boxStyle.width * (1 / ratio);
      }
      let opts = {
        id: cid,
        elId: cid, // div 容器 必须
        width: parseInt(this.boxStyle.width),
        height: parseInt(this.boxStyle.height),
        noDispatch: noDispatch
      };
      console.log('====optsopts====', opts);
      if (type == 'board') {
        this.docInfo.boardID = cid;
        opts.backgroundColor = '#FFF'; // 背景颜色， 支持RGB 与 RGBA， 如果全透明，舞台背景色与网页背景色相同，如 ‘#FF0000’或 ‘#FF000000’ 必须
        this.docSDK.createBoard(opts); // 创建成功后，返回模块id
      } else {
        this.docInfo.docID = cid;
        opts.docId = documentId; // 文档id
        this.docSDK.createDocument(opts);
      }
    },
    /**
     * 获取宽高
     */
    initWidth () {
      return new Promise((resolve) => {
        this.$nextTick(() => {
          if (!this.$refs.docInner) {
            return;
          }
          let style = window.getComputedStyle(this.$refs.docInner);
          let ratio = 16 / 9;
          let wrapWidth = parseFloat(style.width);
          let wrapHeight = parseFloat(style.height);
          let boxWidth = null;
          let boxHeight = null;
          if (wrapWidth / wrapHeight > ratio) {
            boxHeight = wrapHeight;
            // boxHeight = wrapHeight
            boxWidth = boxHeight * ratio;
            console.log('=======内层层盒子的宽高======', boxWidth, boxHeight);
          } else {
            boxWidth = wrapWidth;
            boxHeight = boxWidth * (1 / ratio);
          }
          this.boxStyle = {
            width: `${boxWidth}px`,
            height: `${boxHeight}px`
          };
          resolve();
        });
      });
    },
    /**
     * 重新计算文档/白板的高度
     */
    resize () {
      if (this.docInfo.showContainer) {
        console.log('=======触发了resize事件 ========================');
        this.$nextTick(() => {
          this.initWidth().then(() => {
            console.log('====测试重绘数据=====', this.boxStyle, this.docInfo.cid);
            this.docSDK.setSize(parseFloat(this.boxStyle.width), parseFloat(this.boxStyle.height), {
              id: this.docInfo.cid
            });
          });
        });
      }
    },
    /**
     * 文档翻页
     * @param {String} type - prePage前一页，prevStep前一步，nextStep后一步，nextPage后一页，zoomIn放大，zoomOut缩小，zoomReset还原，move移动
     */
    handlePage (type) {
      switch (type) {
        case 'prePage':
          this.docSDK.prevPage();
          break;
        case 'prevStep':
          this.debuncePrev();
          break;
        case 'nextStep':
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
    setSdkRole (role, mode) {
      this.isSetRole = role;
      this.docSDK.setRole(this.roleTypeMap[role]).then(() => {
        // 切换角色成功
        this.isSetRole = -1;
      });

      mode && this.docSDK.setPlayMode(window.VHDocSDK.PlayMode[mode]);
    },
    // ============================对外暴露方法 start===========================================================================
    /**
     *获取缩略图列表
     */
    getThumibnailList () {
      if (this.roleName != 2) {
        return this.docSDK.getThumbnailList({ id: this.docID });
      }
    },
    /**
     * 切换显示主持端文档区域
     * @param {Boolean} flag - true展示 false不展示
     */
    toggleDocContainer (flag) {
      this.docInfo.showContainer = flag;
    },
    /**
     * 观看端是否可见
     * @param {Boolean} flag - true观看端展示 false观看端不展示
     */
    toggleWatchContainer (flag) {
      if (flag) {
        this.docInfo.showContainer = flag;
        this.docSDK.switchOnContainer();
      } else {
        this.docSDK.switchOffContainer();
      }
    },

    /**
     * 点击侧边栏或者其他切换文档，白板
     * @param {Boolean} type - document显示文档  board示白板
     */
    toggleBoard (type = 'document') {
      if (type == 'board') {
        this.$nextTick(() => {
          this.initWidth();
          if (!this.docInfo.boardID) {
            let cid = this.docSDK.createUUID('board');
            this.cids.push(cid);
            this.$nextTick(() => {
              this.initContainer('board', cid);
              this.activeContainer(cid);
            });
          } else {
            this.activeContainer(this.docInfo.boardID);
          }
        });
      } else {
        if (this.docInfo.docID) {
          this.$nextTick(() => {
            this.initWidth();
            this.activeContainer(this.docInfo.docID);
            this.docInfo.cid = this.docID;
          });
        } else {
          this.docInfo.cid = '';
        }
      }
    },
    /**
     * 跳到某一页
     * @param {Number} page 页码
     */
    gotoPage (page) {
      this.docSDK.gotoPage({ page, id: this.docInfo.cid });
    },
    /**
     *文档上一步
     */
    debuncePrev () {
      if (this.pageTimeOut) return;
      this.pageTimeOut = setTimeout(() => {
        clearTimeout(this.pageTimeOut);
        this.pageTimeOut = null;
      }, 1000);
      this.docSDK.prevStep({ id: this.docInfo.cid });
    },
    /**
     *文档下一步
     */
    debunceNext () {
      if (this.pageTimeOut) return;
      this.pageTimeOut = setTimeout(() => {
        clearTimeout(this.pageTimeOut);
        this.pageTimeOut = null;
      }, 1000);
      this.docSDK.nextStep({ id: this.docInfo.cid });
    },
    /**
     * 画笔，颜色，形状控制条操作
     */
    handleControlBar (event) {
      if (event.type != 'setColor') {
        console.log('取消缩放');
        this.docSDK.cancelZoom();
      }
      console.log('event.type', event);
      let opts = {
        id: this.docInfo.cid
      };
      switch (event.type) {
        // 设置荧光笔
        case 'ygb':
          this.docSDK.setHighlighters(opts);
          if (event.value) {
            this.docSDK.setStrokeWidth({ width: Number(event.value), ...opts });
          }
          break;
        // 设置画笔
        case 'hb':
          this.docSDK.setPen(opts);
          if (event.value) {
            this.docSDK.setStrokeWidth({ width: Number(event.value), ...opts });
          }
          break;
        // 设置颜色
        case 'setColor':
          this.docSDK.setStroke({ color: event.value, ...opts });
          break;
        // 设置图形
        case 'graph':
          this.docSDK[event.value](opts);
          break;
        // 设置橡皮擦
        case 'eraser':
          this.docSDK.setEraser(opts);
          break;
        // 全部清除
        case 'clear':
          this.docSDK.clear(opts);
          break;
        // 设置文字
        case 'font':
          this.docSDK.setText(opts);
          if (event.value) {
            console.log('=====选择的容器=====', {
              width: Number(event.value),
              ...opts
            });
            this.docSDK.setStrokeWidth({ width: Number(event.value), ...opts });
          }
          break;
        // 设置宽度
        case 'strokeWidth':
          this.docSDK.setStrokeWidth({ width: Number(event.value), ...opts });
          break;
        // 取消画笔
        case 'cancelDrawable':
          this.docSDK.cancelDrawable(opts);
          break;
        default:
          break;
      }
    },
    // 激活容器，设置默认画笔颜色
    activeContainer (cid = '') {
      this.docSDK.selectContainer({ id: cid });
      this.docInfo.cid = cid;
      let type = cid.split('-')[0];
      if (type == 'document') {
        this.docInfo.docID = cid;
      }
    },
    destroyCurContainer (type = 'document') {
      if (this.docInfo.docID && type == 'document') {
        let index = this.cids.indexOf(this.docInfo.docID);
        this.cids.splice(index, 1);
        this.docSDK.destroyContainer({ id: this.docInfo.docID });
        if (this.docInfo.cid == this.docInfo.docID) {
          this.docInfo.cid = '';
        }
        this.docInfo.docID = '';
      } else if (this.docInfo.boardID && type == 'board') {
        let index = this.cids.indexOf(this.docInfo.boardID);
        this.cids.splice(index, 1);
        this.docSDK.destroyContainer({ id: this.docInfo.boardID });
        this.docInfo.boardID = '';
        if (this.docInfo.cid == this.docInfo.boardID) {
          this.docInfo.cid = '';
        }
      }
      console.log('测试销毁现在展示容器========', this.docInfo);
    },
    /**
     * 销毁文档/白板,主讲,将文档还原为初始状态
     */
    destroyDoc () {
      !this.docSDK || this.docSDK.resetContainer();
      this.toggleWatchContainer(false);
      this.cids.forEach((item) => {
        this.docSDK.destroyContainer({ id: item });
      });
      this.cids = [];
      // this.$refs.docInner.innerHTML = ''
      this.docInfo = {
        showContainer: false,
        cid: '',
        boardID: '',
        docID: ''
      };
    },
    // ============================对外暴露方法 end==============================================================================
    /**
     * 通知服务器续存刷新前的数据信息
     */
    republish () {
      this.docSDK.republish();
    },
    // 转播 id转播频道id
    // 转播结束后，把文档操作权限还给主持人
    broadcast (type, id, isSelfDoc = true) {
      if (type == 'start' && id) {
        this.docSDK.setAccountId({ accountId: this.accountId + '7890' }); // 解决文档翻页不生效的问题
        this.docInfo.showContainer = false;
        if (this.rebroadcastStartTimer) {
          clearTimeout(this.rebroadcastStartTimer);
          this.rebroadcastStartTimer = null;
        }
        this.rebroadcastStartTimer = setTimeout(() => {
          this.docSDK && this.setSdkRole(2, 'FLV');
          this.loadRemote(id);
          this.hasDocPermission = false;
          clearTimeout(this.rebroadcastStartTimer);
          this.rebroadcastStartTimer = null;
        }, 1000);
      } else if (type == 'end') {
        let mode = this.roleName == 1 || this.roleName == 4 ? 'INTERACT' : 'FLV';
        this.docSDK && this.setSdkRole(this.roleName, mode);
        this.docInfo.showContainer = false;
        this.cids = [];
        isSelfDoc && this.loadRemote(id);
      } else {
        this.$message({
          type: 'error',
          message: '转播参数错误'
        });
      }
    },
    // input框聚焦时，阻止键盘事件冒泡, 阻止此时翻页
    stopKeyPropagation () {
      let body = document.getElementsByTagName('body')[0];
      body.addEventListener('keyup', (event) => {
        var e = event || window.event;
        if (e.target.tagName == 'INPUT') {
          event.stopPropagation();
          console.log('阻止input冒泡');
        }
      });
    },
    sdkLoad(){
      this.roleTypeMap= {
        1: window.VHDocSDK.RoleType.HOST, // 1 活动拥有者
        2: window.VHDocSDK.RoleType.SPECTATOR, // 2 观众
        3: window.VHDocSDK.RoleType.ASSISTANT, // 3 助理
        4: window.VHDocSDK.RoleType.GUEST // 4 嘉宾
      };
      this._initSDK();
    }
  }
};
</script>

<style lang="less">
.vh-doc {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  &__wrap {
    width: 100%;
    height: 100%;
    position: relative;
    // padding-top: 40px;
    box-sizing: border-box;
    background-color: #000;
    .vh-doc-tool {
      display: none;
    }
    .vh-doc-pager {
      display: none;
    }
    &:hover {
      .vh-doc-tool {
        display: flex;
      }
      .vh-doc-pager {
        display: flex;
      }
    }
  }
  &__box {
    position: absolute;
    left: 0;
    right: 0;
    top: 0px;
    bottom: 0;
    overflow: hidden;
  }
  &__show {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);
    overflow: visible !important;
  }
}
</style>
