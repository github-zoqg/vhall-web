<template>
  <div class="vh-video-tailoring__warp" ref="videoTailoringWarp">
    <!-- <keep-alive> -->
    <div class="vh-video-tailoring__section">
      <div class="vh-video-tailoring__head clearfix">
        <h3 class="vh-video-tailoring__title">{{ videoName }}</h3>
      </div>
      <div class="vh-video-tailoring__media-wrap clearfix">
        <div
          class="vh-video-tailoring__play"
          :class="{ fl: docReady || !vodReady, no_doc: !(docReady || !vodReady) }"
        >
          <div class="vh-video-tailoring__noplay" v-show="!vodReady">
            <icon icon-class="saasicon_zanwushipin"></icon>
          </div>
          <!-- <template> -->
          <div v-show="vodReady">
            <div id="vh-player" v-show="showVideo"></div>
          </div>

          <!-- </template> -->
        </div>
        <div class="vh-video-tailoring__doc-warp fl" v-show="docReady || !vodReady">
          <doc
            v-if="showDoc"
            ref="doc"
            :webinarId="roomInfo.webinar_id"
            docPermissionId="no"
            :isInteract="true"
            :roleType="2"
            :roomId="roomInfo.room_id"
            :channelId="roomInfo.channel_id"
            :appId="roomInfo.app_id"
            :token="roomInfo.paas_access_token"
            :liveStatus="2"
            :joinId="roomInfo.joinId"
            :accountId="roomInfo.third_party_user_id"
            :isVod="true"
          ></doc>
          <div v-else class="vh-video-tailoring__nodoc-warp">
            <icon icon-class="saasicon_zanwuwendang"></icon>
          </div>
        </div>
      </div>
    </div>
    <div class="vh-video-tailoring__tailoring-wrap">
      <Tailoring
        :videoShowTime="videoShowTime"
        :rulerLength="rulerLength"
        :videoTime="videoTime"
        :initUnit="initUnit"
        v-show="rulerLength && showTailoring"
        :vodReady="vodReady"
        @saveVideoClick="saveVideo"
        @exportVideoClick="exportVideo"
        @addVideo="addVideo"
      ></Tailoring>
    </div>
    <el-dialog
      class="vh-video-tailoring__addvideo"
      :title="t('添加点播回放')"
      :visible.sync="dialogVisible"
      width="776px"
      :before-close="closeAddVideoDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div class="vh-video-tailoring__select">
        <el-input
          :placeholder="placeholderText"
          v-model="room_id"
          class="input-with-select"
          prefix-icon="el-icon-search"
          @change="onSubmit"
        >
          <el-select v-model="value" slot="prepend" :placeholder="t('请选择')">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-input>
        <el-date-picker
          v-if="value == '1'"
          v-model="selectDate"
          type="datetimerange"
          :range-separator="t('至')"
          :start-placeholder="t('开始日期')"
          :end-placeholder="t('结束日期')"
          prefix-icon="iconfont-v3 saasicon_date"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :editable="false"
        ></el-date-picker>
        <el-button
          class="vh-find-btn"
          type="primary"
          slot="append"
          @click="findVideo"
          v-if="value == '2'"
        >
          {{ t('查找') }}
        </el-button>
        <el-button class="vh-find-btn" v-if="value == '1'" @click="createVideo" type="primary">
          {{ t('生成') }}
        </el-button>
      </div>
      <div class="vh-video-tailoring__data">
        <ul class="clearfix">
          <li v-for="(item, index) in tableData" :key="'tailoring' + index">
            <div class="vh-video-tailoring__data-img">
              <div class="vh-video-tailoring__mark" @click="selectVideo(item)">
                <div class="vh-video-tailoring__mark-content">
                  <span class="vh-iconfont vh-icon-jianqiedianicon"></span>
                  <p>{{ t('剪辑') }}</p>
                </div>
              </div>
              <img class="fl" src="./image/no_video@2x.png" alt />
              <div class="vh-video-tailoring__webinar-info">
                <p class="vh-video-tailoring__webinar-info-id">ID:{{ item.id }}</p>
                <p class="vh-video-tailoring__duration">
                  <span class="vh-iconfont vh-icon-shichangicon"></span>
                  {{ item.duration }}
                </p>
              </div>
            </div>
            <div class="vh-video-tailoring__data-content">
              <p class="vh-video-tailoring__title">{{ item.name }}</p>
              <p class="vh-video-tailoring__time">{{ item.created_at }}</p>
              <!-- <el-link :underline="false" @click="selectVideo(item)"><span class="vh-iconfont vh-icon-jianqiedianicon"></span>{{ t('剪辑') }}</el-link> -->
            </div>
          </li>
        </ul>
      </div>
    </el-dialog>
    <el-dialog
      class="vh-video-tailoring__export"
      :visible.sync="exportVideoVisibile"
      width="483px"
      :title="t('导出回放')"
      :before-close="closeExportVideoDialog"
    >
      <div class="vh-video-tailoring__form">
        <span class="vh-video-tailoring__label">{{ t('回放时长') }}</span>
        <div class="vh-video-tailoring__input-form">
          <span class="vh-video-tailoring__content">{{ exportVideoDuration }}</span>
        </div>
      </div>
      <div class="vh-video-tailoring__form">
        <span class="vh-video-tailoring__label vh-video-tailoring__title">{{ t('回放标题') }}</span>
        <div class="vh-video-tailoring__input-form">
          <VhallInput
            resize="none"
            type="textarea"
            v-clearEmoij
            v-model="videoTitle"
            :placeholder="t('请输入回放标题')"
            maxlength="100"
            show-word-limit
          ></VhallInput>
          <!-- <span class="vh-invitation-card__title-length">
            <span :class="videoTitle.length != 0 ? 'vh-invitation-card__curLength' : ''">{{ videoTitleLength }}</span>/100
          </span> -->
        </div>
      </div>
      <div class="vh-video-tailoring__btn-group">
        <el-button round size="medium" type="primary" @click="exportVideoFun">
          {{ t('导出') }}
        </el-button>
        <el-button round size="medium" @click="cancelExportVideoFun">{{ t('取消') }}</el-button>
      </div>
    </el-dialog>
    <!-- </keep-alive> -->
  </div>
</template>
<script>
  // import player from '../Player'; // 回放组件
  import doc from '../Doc/watch-doc'; // 文档组件
  import Tailoring from './components/tailoring'; // 剪裁整体功能组件
  import { formatTime } from './js/format';
  export default {
    name: 'videoTailoring',
    // mixins: [locale],
    props: {
      roomInfo: {
        type: Object,
        required: true
      },
      isAdd: {
        type: Boolean,
        required: false,
        default: true
      },
      playerParams: {
        type: Object,
        required: false
      }
    },
    data() {
      return {
        nickName: '', // 视频组件必传的nickName
        doc_permission: '', // 文档组件必传的可使用画笔等工具id
        vodReady: false, // 当前回放是否初始化完成
        docReady: false, // 当前回放文档是否初始化完成
        showVideo: false,
        showTailoring: false,
        showDoc: false,
        videoShowTime: 1200, // 视频刻度尺显示时长
        videoTime: 0, // 视频实际时长
        rulerLength: 1200, // 尺子的尺寸
        initUnit: 1, // 当前时间单位 共七档对应 1s、3s、6s、12s、30s、60s、120s
        dialogVisible: false,
        exportVideoVisibile: false, // 导出视频弹窗是否显示
        videoTitle: '', // 生成回放名称
        exportVideoDuration: 0, // 生成回放时长
        // exportDate: '', // 生成回放时间
        cutTimeList: [], // 裁剪时间段数组
        eventPointList: [], // 事件点数组
        isFirstInit: false,
        options: [
          {
            value: '1',
            label: '生成点播'
          },
          {
            value: '2',
            label: '查找点播'
          }
        ], // 生成点播或查找点播下拉初始化值
        value: '1', // 当前是生成点播1 或者查找点播 2
        room_id: '', // 生成点播填写的房间ID
        selectDate: '', // 生成点播选择的时间段
        tableData: [], // 点播回放列表初始化
        loading: false
      };
    },
    computed: {
      videoName() {
        return this.roomInfo.name ? this.roomInfo.name : '视频名称';
      },
      placeholderText() {
        return this.value == '1' ? '直播ID' : '点播ID/直播ID';
      },
      videoTitleLength() {
        return this.videoTitle.length;
      }
    },
    mounted() {
      this.$nextTick(() => {
        // 监听视频初始化成功
        this.$EventBus.$on('component_playerSDK_ready', () => {
          this.vodReady = true;
          setTimeout(() => {
            // 动态获取当前视频的总时长及当前播放的时间 当做刻度尺值，弱播放时间小于1200秒，则刻度尺最小赋值为1200秒
            this.videoShowTime =
              Math.round(window.vhallPlayer.getDuration()) > 1200
                ? Math.round(window.vhallPlayer.getDuration(window.vhallPlayer.getDuration()))
                : 1200;
            this.videoTime = Math.round(window.vhallPlayer.getDuration());
            this.initUnitFun();
          }, 100);
        });

        // 监听裁剪时间段变化，为计算导出总时长准备
        this.$EventBus.$on('cutTimeListChange', cutTimeList => {
          // 监听当前对裁剪的时间段数组的增加或移除操作，用来更新控制跳转视频播放时间
          this.cutTimeList = cutTimeList;
          this.$forceUpdate();
        });
        this.$EventBus.$on('docInfo', docInfo => {
          console.debug('docInfo', docInfo);
          if (this.docReady != docInfo.showContainer) {
            window.dispatchEvent(new Event('resize'));
          }
          this.docReady = docInfo.showContainer;
        });
        this.$EventBus.$on('watchDocShow', flag => {
          console.log('watchDocShow', flag);
          if (this.docReady != flag) {
            window.dispatchEvent(new Event('resize'));
          }
          this.docReady = flag;
        });

        // 监听文档初始化及是否显示
        this.$EventBus.$on('component_doc_info', docInfo => {
          console.debug('component_doc_info', docInfo);
          if (this.docReady != docInfo.showContainer) {
            window.dispatchEvent(new Event('resize'));
          }
          this.docReady = docInfo.showContainer;
        });

        // 初始化原视频事件点
        this.$EventBus.$on('markPoints', markPoints => {
          this.eventPointList = markPoints;
          setTimeout(() => {
            this.$EventBus.$emit('eventPointListInit', this.eventPointList);
          }, 600);
        });

        // 监听事件点列表变化
        this.$EventBus.$on('eventPointListChange', eventPointList => {
          this.eventPointList = eventPointList;
        });

        // 监听文档初始化完成
        this.$EventBus.$on('docSDK_ready', async () => {
          this.showVideo = true;
          await this.initSDK().catch(err => {
            this.$message({
              message: `${err.message}!x{${err.code}}`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
          this.showTailoring = true;
        });
        this.showTailoring = true;
      });
    },
    beforeDestroy() {
      sessionStorage.removeItem('leftTime');
      window.vhallPlayer && window.vhallPlayer.destroy();
      window.vhallPlayer = null;
      this.$EventBus.$off('docSDK_ready');
      this.$EventBus.$off('component_playerSDK_ready');
      this.$EventBus.$off('cutTimeListChange'); // 测试是否注释
      this.$EventBus.$off('component_doc_info');
      this.$EventBus.$off('markPoints');
      this.$EventBus.$off('eventPointListChange');
      this.$EventBus.$off('component_docSDK_ready');
    },
    methods: {
      initSDK() {
        let params = {
          appId: this.roomInfo.app_id, // 应用ID，必填
          accountId: this.roomInfo.third_party_user_id, // 第三方用户ID，必填
          token: this.roomInfo.paas_access_token, // access_token，必填
          videoNode: 'vh-player',
          type: 'vod', // live 直播  vod 点播  必填
          subtitleOption: {
            enable: true
          }
        };
        Object.assign(params, this.playerParams);
        params.vodOption = { recordId: this.roomInfo.record_id };
        console.log(params, '初始化播放器参数');
        return new Promise((resolve, reject) => {
          window.VhallPlayer.createInstance(
            params,
            event => {
              console.log('初始化播放器成功111');
              window.vhallPlayer = this.$PLAYER = event.vhallplayer;
              this.$PLAYER.openControls(false);
              if (this.type == 'live') {
                resolve();
                this.$EventBus.$emit('component_playerSDK_ready');
              } else {
                this.$PLAYER.on(window.VhallPlayer.LOADED, () => {
                  resolve();
                  this.$EventBus.$emit('component_playerSDK_ready');
                });
              }
              this.$EventBus.$emit('markPoints', event.markPoints);
            },
            e => {
              reject(e);
            }
          );
        });
      },
      /**
       * 点击添加视频 弹窗展示 获取列表
       */
      addVideo() {
        this.dialogVisible = true;
      },
      /**
       * 根据传入的视频列表绑定数据
       */
      bindDataList(data) {
        this.tableData = data;
        this.$forceUpdate();
      },
      /**
       * 根据传入新生成的视频信息绑定
       */
      pushDataList(data) {
        this.tableData.push(data);
        this.$forceUpdate();
      },
      /**
       * 保存视频
       */
      async saveVideo() {
        let data = await this.cutTimeReverse();
        let pargram = {
          il_id: this.roomInfo.webinar_id,
          record_id: this.roomInfo.record_id,
          cut_sections: data,
          point_sections: JSON.stringify(this.eventPointList),
          cut_type: 0,
          name: this.roomInfo.name
        };
        this.$emit('saveVideo', pargram);
      },
      /**
       * 关闭添加视频弹窗回调
       */
      closeAddVideoDialog() {
        this.dialogVisible = false;
        this.value = '1';
        this.room_id = '';
        this.selectDate = '';
        this.tableData = [];
      },
      /**
       * 点击导出回放
       */
      exportVideo() {
        let duration = 0;
        for (let i = 0; i < this.cutTimeList.length; i++) {
          duration += parseInt(this.cutTimeList[i].endTime - this.cutTimeList[i].startTime);
        }
        this.exportVideoDuration = formatTime(duration);
        this.exportVideoVisibile = true;
      },
      /**
       * 导出回放
       */
      async exportVideoFun() {
        if (this.videoTitle.trim() == '') {
          this.$message({
            message: this.t('请输入导出回放标题'),
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        let data = await this.cutTimeReverse();
        let pargram = {
          il_id: this.roomInfo.webinar_id,
          record_id: this.roomInfo.record_id,
          cut_sections: data,
          point_sections: JSON.stringify(this.eventPointList),
          cut_type: 0,
          name: this.videoTitle
        };
        this.$emit('exportVideo', pargram);
      },
      /**
       * 取消导出回放
       */
      cancelExportVideoFun() {
        this.exportVideoVisibile = false;
        this.videoTitle = '';
        this.exportVideoDuration = '';
      },
      /**
       * 导出回放弹窗关闭
       */
      closeExportVideoDialog() {
        this.exportVideoVisibile = false;
        this.videoTitle = '';
        this.exportVideoDuration = '';
      },
      /**
       * 点击生成视频
       */
      createVideo() {
        if (!this.selectDate) {
          this.$message({
            message: this.t('请选择时间'),
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        } else if (this.room_id.trim() == '') {
          this.$message({
            message: this.t('请输入直播ID'),
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        let pargram = {
          begin_time: this.selectDate[0],
          end_time: this.selectDate[1],
          il_id: this.room_id
        };
        this.loading = true;
        this.$emit('createVideo', pargram);
      },
      cancelLoading() {
        this.loading = false;
      },
      /**
       * 选定裁剪视频
       */
      selectVideo(data) {
        this.dialogVisible = false;
        this.$emit('selectVideo', data);
        this.value = '1';
        this.room_id = '';
        this.selectDate = '';
        this.tableData = [];
      },
      /**
       * 查找视频
       */
      findVideo() {
        if (this.room_id.trim() == '') {
          this.$message({
            message: this.t('请输入点播ID/直播ID'),
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        this.tableData = [];
        this.$emit('getVod', { keywords: this.room_id });
      },
      /**
       * 裁剪时间段格式化
       */
      cutTimeFormat() {
        let cutTimeReverseList = [];
        for (let i = 0; i < this.cutTimeList.length; i++) {
          let cutTime = {
            start: this.cutTimeList[i].startTime,
            end: this.cutTimeList[i].endTime
          };
          cutTimeReverseList.push(cutTime);
        }
        return JSON.stringify(cutTimeReverseList);
      },
      /**
       * 裁剪时间段取反
       */
      cutTimeReverse() {
        let cutTimeReverseList = [];
        for (let i = 0; i < this.cutTimeList.length; i++) {
          if (i == 0) {
            if (this.cutTimeList[i].startTime > 0) {
              let cutTime = {
                start: 0,
                end: this.cutTimeList[i].startTime
              };
              cutTimeReverseList.push(cutTime);
            }
            if (this.cutTimeList.length == 1 && this.cutTimeList[i].endTime < this.videoTime) {
              let cutTime = {
                start: this.cutTimeList[i].endTime,
                end: this.videoTime
              };
              cutTimeReverseList.push(cutTime);
            }
          } else if (i + 1 == this.cutTimeList.length) {
            let cutTime = {
              start: this.cutTimeList[i - 1].endTime,
              end: this.cutTimeList[i].startTime
            };
            cutTimeReverseList.push(cutTime);
            if (this.cutTimeList[i].endTime < this.videoTime) {
              let cutTimeNew = {
                start: this.cutTimeList[i].endTime,
                end: this.videoTime
              };
              cutTimeReverseList.push(cutTimeNew);
            }
          } else {
            let cutTime = {
              start: this.cutTimeList[i - 1].endTime,
              end: this.cutTimeList[i].startTime
            };
            cutTimeReverseList.push(cutTime);
          }
        }
        // sdk不支持同一秒作为裁剪的起止点 因此需要过滤数据
        for (let j = 0; j < cutTimeReverseList.length; j++) {
          if (cutTimeReverseList[j].start == cutTimeReverseList[j].end) {
            cutTimeReverseList.splice(j--, 1);
          }
        }
        return JSON.stringify(cutTimeReverseList);
      },
      initUnitFun() {
        if (this.videoTime > 8100) {
          this.initUnit = 7;
        } else if (this.videoTime > 4050) {
          this.initUnit = 6;
        } else if (this.videoTime > 1620) {
          this.initUnit = 5;
        } else if (this.videoTime > 810) {
          this.initUnit = 4;
        } else if (this.videoTime > 405) {
          this.initUnit = 3;
        } else if (this.videoTime > 135) {
          this.initUnit = 2;
        } else {
          this.initUnit = 1;
        }
      },
      onSubmit() {
        if (this.value == 1) {
          this.createVideo();
        } else {
          this.findVideo();
        }
      },
      t(name) {
        return name;
      }
    },
    watch: {
      value(newValue, oldValue) {
        if (newValue != oldValue) {
          this.room_id = '';
          this.selectDate = '';
          this.tableData = [];
        }
      },
      'roomInfo.record_id': {
        handler(n, o) {
          if (n && n != o) {
            if (window.vhallPlayer) {
              window.vhallPlayer.destroy();
            }
            if (this.roomInfo.duration == '00:00:00') {
              this.$message({
                message: this.t('请选择正确的原视频'),
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
              return false;
            }
            this.showVideo = false;
            this.showDoc = false;
            this.showTailoring = false;
            this.docReady = false;
            setTimeout(() => {
              this.showTailoring = true;
              this.showDoc = true;
            }, 100);
          }
        },
        immediate: true, // 刷新加载 立马触发一次handler
        deep: true // 可以深度检测到
      }
    },
    components: {
      // player,
      doc,
      Tailoring
    }
  };
</script>
<style lang="less">
  // 页面底部插入了一个一像素高元素，影响一屏页面，不知作用是啥，先隐藏
  #myVodNode {
    height: 0px !important;
  }
</style>
<style lang="less">
  .vh-video-tailoring__warp {
    width: 1366px;
    margin: 20px auto;
    border-radius: 4px;
    background-color: #000;
    text-align: center;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    .fr {
      margin-left: 20px;
      color: #888;
    }
    /deep/.el-date-editor .el-range__icon {
      line-height: 29px;
    }
    /deep/.el-date-editor .el-range__close-icon {
      line-height: 28px;
    }
    .vh-video-tailoring__section {
      background-color: #222222;
      border-radius: 4px;
      height: calc(100% - 314px);
      .vh-video-tailoring__head {
        display: none;
        width: 1306px;
        margin: 0 auto;
        height: 50px;
        line-height: 50px;
        position: relative;
        .vh-video-tailoring__title {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 16px;
          color: #fff;
          font-weight: 500;
          display: inline-block;
          margin: 0 auto;
        }
        .el-button {
          margin: 15px;
          border: none;
          &:hover {
            background-color: #1e89e4;
          }
        }
        .vh-video-tailoring__add-btn {
          width: 90px;
          height: 36px;
          padding: 0;
          border-radius: 4px;
          background-color: #282831;
          color: #a4a4a8;
          margin-left: 0;
          &:hover {
            color: #fff;
          }
        }
        .vh-btn {
          width: 100px;
          height: 36px;
          padding: 0;
          border-radius: 18px;
          background-color: #4a4a53;
          color: #a4a4a8;
          background-repeat: no-repeat;
          background-position: 19px;
          padding-left: 24px;
          background-size: 20px 20px;
          &.vh-video-tailoring__export-btn {
            background-image: url('./image/export@2x.png');
            &:hover {
              background-image: url('./image/export-hover@2x.png');
              color: #ffffff;
            }
          }
          &.vh-video-tailoring__save-btn {
            background-image: url('./image/save@2x.png');
            &:hover {
              background-image: url('./image/save-hover@2x.png');
              color: #ffffff;
            }
          }
        }
      }

      .vh-video-tailoring__media-wrap {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        padding: 25px 24px 11px;
        .vh-video-tailoring__play {
          width: calc(50% - 5px);
          height: 100%;
          background-color: #000;
          // background-image: url(./image/video-placeholder.png);
          background-size: 150px 150px;
          background-position: 50% 50%;
          background-repeat: no-repeat;
          margin: 0 auto;
          display: inline-block;
          vertical-align: middle;
          overflow: hidden;
          &.no_doc {
            background-color: #222;
            #vh-video {
              background-color: #222 !important;
            }
          }
          .vhallPlayer-barrage-box,
          .v-c-right {
            display: none;
          }
          .vhallPlayer-container {
            display: none !important;
          }
          .overEnd {
            display: none !important;
          }
          .vh-video-tailoring__noplay {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .iconContainer i {
              font-size: 126px;
              color: #666;
            }
          }
        }
        .vh-video-tailoring__doc-warp {
          width: calc(50% - 5px);
          height: 100%;
          margin-left: 10px;
          background-color: #000;
          // background-image: url(./image/doc_init@2x.png);
          background-size: 150px 150px;
          background-position: 50% 50%;
          background-repeat: no-repeat;
          display: inline-block;
          vertical-align: middle;
          overflow: hidden;
          .doc-ctrl-bar {
            display: none;
          }
          .vhall-doc-pager {
            display: flex !important;
            .iconzuofanye,
            .page-number,
            .iconyoufanye {
              display: none;
            }
          }
          .vh-video-tailoring__nodoc-warp {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            .iconContainer i {
              font-size: 126px;
              color: #666;
            }
          }
          .vhall-watch-doc .vhall-doc-pager {
            bottom: 8px;
          }
        }
      }
    }
    .vh-video-tailoring__tailoring-wrap {
      width: 100%;
      margin: 0 auto;
    }
    .vh-video-tailoring__addvideo {
      .el-dialog__header {
        .el-dialog__title {
          font-size: 20px;
        }
      }
      .el-dialog__body {
        padding: 30px 0 0 !important;
        .vh-video-tailoring__select {
          padding: 0 40px;
        }
        .vh-video-tailoring__data {
          padding: 0 40px;
          height: 374px;
          overflow: auto;
          box-sizing: border-box;
        }
        ul {
          padding-bottom: 15px;
          margin-top: 15px;
          box-sizing: border-box;
          li {
            width: 220px;
            height: 179px;
            margin-left: 14px;
            margin-top: 15px;
            float: left;
            border-radius: 4px;
            overflow: hidden;
            box-sizing: border-box;
            &:nth-child(3n + 1) {
              margin-left: 0px;
            }
            &:nth-child(1),
            &:nth-child(2),
            &:nth-child(3) {
              margin-top: 0px;
            }
            .vh-video-tailoring__data-img {
              position: relative;
              width: 220px;
              height: 124px;
              font-size: 12px;
              &:hover {
                .vh-video-tailoring__mark {
                  display: flex;
                }
              }
              .vh-video-tailoring__mark {
                display: none;
                cursor: pointer;
                justify-content: center;
                align-items: center;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 2;
                background-color: rgba(#000000, 0.8);
                .vh-video-tailoring__mark-content {
                  vertical-align: middle;
                  display: inline-block;
                  margin: 0 auto;
                  color: #1e90ff;
                }
              }
              img {
                width: 100%;
                height: 100%;
                border-radius: 0;
              }
              .vh-video-tailoring__webinar-info {
                position: absolute;
                left: 0;
                right: 0;
                bottom: 0px;
                height: 30px;
                line-height: 30px;
                background: linear-gradient(180deg, transparent, rgba(#000000, 0.5));
              }
              .vh-video-tailoring__webinar-info-id {
                position: absolute;
                left: 10px;
                bottom: 0px;
                color: #ffffff;
              }
              .vh-video-tailoring__duration {
                position: absolute;
                right: 15px;
                bottom: 0px;
                color: #ffffff;
                .vh-icon-shichangicon {
                  font-size: 12px;
                  display: inline-block;
                  margin-right: 5px;
                }
              }
            }
            .vh-video-tailoring__data-content {
              padding: 8px 0;
              text-align: left;
              position: relative;
              .vh-video-tailoring__title {
                font-size: 14px;
                color: #333333;
                line-height: 20px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 1;
                -webkit-box-orient: vertical;
              }
              .vh-video-tailoring__time {
                font-size: 12px;
                color: #666666;
              }
              .el-link {
                // color: #1E90FF;
                position: absolute;
                bottom: 15px;
                font-size: 12px;
                .vh-icon-jianqiedianicon {
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
      .vh-video-tailoring__select {
        text-align: left;
        .input-with-select {
          width: fit-content;
          .el-select__caret {
            line-height: 36px;
          }
        }
        .el-input-group__prepend {
          background-color: #ffffff;
          height: 34px;
          .el-select {
            width: 102px;
            height: 34px;
            line-height: 34px;
            .el-input__inner {
              width: 102px;
              height: 36px !important;
              line-height: 36px !important;
              padding: 0 14px;
            }
          }
        }
        .el-input__inner {
          width: 187px;
          height: 36px !important;
          line-height: 36px !important;
        }
        .vh-find-btn {
          height: 36px !important;
          line-height: 36px !important;
          padding: 0;
          margin-left: 5px;
        }
        & > .el-range-editor {
          width: 275px;
          margin-left: 5px;
          height: 36px !important;
          line-height: 36px !important;
          position: relative;
          top: 0px;
          .el-range-separator {
            line-height: 28px !important;
          }
        }
        .el-button {
          position: relative;
          top: 1px;
        }
      }
    }
    .vh-video-tailoring__export {
      .el-dialog {
        overflow: hidden;
      }
      .el-dialog__body {
        .vh-video-tailoring__form {
          margin-top: 24px;
          &:first-child {
            margin-top: 0px;
          }
          .vh-video-tailoring__label {
            float: left;
            width: 56px;
            height: 20px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #1a1a1a;
            line-height: 20px;
            &.vh-video-tailoring__title {
              height: 120px;
            }
          }
          .vh-video-tailoring__input-form {
            display: inline-block;
            width: 351px;
            margin-left: 8px;
            color: #666;
            font-size: 14px;
            text-align: left;
            position: relative;
            .el-textarea__inner {
              color: #1a1a1a;
              height: 120px;
              font-family: PingFangSC-Regular, PingFang SC;
            }
            .vh-video-tailoring__content {
              line-height: 20px;
              color: #1a1a1a;
            }
            .el-input__inner {
              padding: 0 45px 0 12px;
              border: 1px solid #e2e2e2;
              border-radius: 0;
              background: #fff;
              border-radius: 4px;
              height: 36px;
              line-height: 36px;
            }
            .el-input__count-inner {
              background: #fff;
            }
            .el-input__suffix {
              height: 36px;
              line-height: 36px;
              width: fit-content;
              span {
                width: fit-content;
              }
            }
            .vh-invitation-card__title-length {
              position: absolute;
              right: 8px;
              top: 8px;
              color: #666666;
              .vh-invitation-card__curLength {
                color: #1e90ff;
              }
            }
          }
        }
        .vh-video-tailoring__btn-group {
          text-align: right;
          margin-top: 24px;
          padding-bottom: 24px;
          /deep/.el-button--default {
            margin-left: 12px;
            background: transparent;
            &:hover {
              background: #fb3a32;
              border: 1px solid #fb3a32;
            }
            &:active {
              background: #e2332c;
              border: 1px solid #e2332c;
            }
            &.is-disabled {
              border: 1px solid #e6e6e6;
              background: transparent;
              color: #b3b3b3;
              &:hover,
              &:active {
                background: transparent;
              }
            }
          }
        }
      }
    }

    .el-dialog {
      .el-dialog__title {
        font-size: 20px;
        color: #1a1a1a;
        font-weight: 500;
        line-height: 28px;
      }
      .el-dialog__header {
        text-align: left;
        padding-bottom: 32px;
      }
      .el-dialog__body {
        text-align: left;
        background-color: #fff;
        .el-input__icon {
          line-height: 36px;
        }
        .el-range__icon {
          line-height: 28px;
        }
        .el-input__inner {
          height: 38px;
          line-height: 38px;
        }
        // .el-button {
        //   width: 76px;
        //   height: 36px;
        //   line-height: 36px;
        //   background: #FB3A32;
        //   border: none;
        //   border-radius: 18px;
        //   padding: 0;
        //   text-align: center;
        //   color: #FAFAFA;
        //   &.el-button--default {
        //     border: 1px solid #CCCCCC;
        //     padding: 4px 24px;
        //     font-size: 14px;
        //     font-family: "-apple-system","BlinkMacSystemFon","Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        //     font-weight: 400;
        //     color: #666666;
        //     line-height: 26px;
        //     &:hover{
        //       background: #ffebeb;
        //       border: 1px solid #CCCCCC;
        //       color: #666666;
        //     }
        //   }
        //   &.el-button--primary {
        //     &:hover{
        //       color: #fff;
        //       background: #FC615B;
        //     }
        //   }
        // }
      }
      .el-dialog__footer {
        text-align: center;
        padding: 10px 20px 40px 20px;
        .el-button + .el-button {
          margin-left: 20px;
        }
      }
    }
  }
  .clearfix {
    &:after {
      content: '';
      clear: left;
      display: block;
    }
  }
</style>
