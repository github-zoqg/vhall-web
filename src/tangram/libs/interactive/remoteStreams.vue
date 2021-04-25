<template>
  <div class="vhall-remote-strams-box" id="vhall-remote-strams-box" >
      <slot></slot>
      <!-- <Subitem
        v-for="(item) in remoteStreams"
        :key="item.accountId"
        :streamId="item.streamId"
        :sdkInstance="SDKINSTANCE"
        :accountId="item.accountId"
        :roomId="roomId"
        :nickName="item.nick_name"
        :role="item.role_name"
        :roleName="roleName"
        :isDocShow="isDocShow"
        :mainScreen="mainScreen"
        :cancel="false"
      >
      </Subitem> -->
      <template
        v-if="(SDKINSTANCE && showSubCribe && !splited)"
      >
        <Subitem
          v-for="(item) in remoteStreams"
          :key="item.streamId"
          :roomId="roomId"
          :roleName="roleName"
          :isDocShow="isDocShow"
          :mainScreen="mainScreen"
          :sdkInstance="SDKINSTANCE"
          :accountId="item.accountId"
          :nickName="item.nick_name"
          :role="item.role_name"
          :userInfo="item"
          :onlineUsers="streamLength"
          :miniElement="miniElement"
          :masterAccountId="accountId"
        >
        </Subitem>
      </template>
      <template
        v-if="splited"
      >
        <split-item
          v-for="(item) in speakerList"
          :key="item.streamId"
          :roomId="roomId"
          :roleName="roleName"
          :isDocShow="isDocShow"
          :mainScreen="mainScreen"
          :accountId="item.account_id"
          :nickName="item.nick_name"
          :role="item.role_name"
          :userInfo="item"
          :onlineUsers="speakerList.length"
          :miniElement="miniElement"
          :masterAccountId="accountId"
          :localStream="localStream"
        >
        </split-item>
      </template>
  </div>
</template>
<script>
import { findIndex, uniqBy } from 'lodash';
import EventBus from '@/utils/Events';
import Subitem from './subscribe/index';
import splitItem from './subscribe/splitIndex';

/**
 * 订阅远端流组件
 * @author Sean.shi
 * @exports  libs/remoteStreams
 *
 * @vue-prop {Boolean} splited - 是否分屏
 *
 */
export default {
  props: {

    splited: {
      required: false,
      default: false
    },
    accountId: {
      required: true
    },

    roomId: {
      required: false
    },

    speakerList: {
      required: false,
      default: () => []
    },

    roleName: {
      required: true
    },

    mainScreen: {
      required: false
    },

    miniElement: {
      required: true,
      default: 'video'
    },

    isDocShow: {
      required: false,
      default: () => false
    }

  },

  components: {
    Subitem,
    splitItem
  },

  data () {
    return {
      SDKINSTANCE: null,
      $inav_info: null,
      hashMap: {},
      streams: 0,
      $localStramId: null,
      remoteStreams: [],
      subscribed: false,
      showSubCribe: false,
      lockStreamPlay: true,
      streamLength: 0 // 房间内远端音视频流数量
    };
  },

  watch: {
    splited (val) {
      console.log('splited', val);
      if (val == false) {
        this.initRemoteStreams();
      } else {
        this.subscribed = false;
        this.showSubCribe = false;
        this.remoteStreams = this.speakerList;
      }
    },

    speakerList: {
      handler: function (val, oldVal) {
        this.remoteStreams = this.remoteStreams.map((item) => {
          if (!item.audio) {
            const userInfo = this.getSpeakerInfo(item.accountId, val);
            return {
              ...userInfo,
              ...item
            };
          } else {
            return { ...item };
          }
        });
        console.log('log info::', 'fix speackerlist userinfo', this.remoteStreams);
      },
      deep: true,
      immediate: true
    }
  },

  created () {
    this.initListeners();
  },

  methods: {
    initListeners () {
      // 接收 speakerlist
      let streams = [];
      if (this.splited) {
        EventBus.$on('INTERACT_SHADOW_MSG', e => {
          console.log('streams', e);
          this.remoteStreams = this.speakerList;
        });
      } else {
        EventBus.$on('deviceSuccess', (msg) => {
          if (msg.type == 'permissionCheck' && this.roleName != 3 && this.roleName != 2) {
            console.log('permissionCheck', msg, streams);
            this.initRemoteStreams(streams);
          }
        });
      }

      // 监听 SDK ready 事件 ，获取SDK
      EventBus.$on('sdkReady', (e) => {
        this.SDKINSTANCE = e.vhallrtc;

        console.info('log info::', 'getSdk ready', e.currentStreams);

        this.addEventListener();
        streams = e.currentStreams.filter((item) => {
          return item.streamType !== 3 && item.streamType !== 4;
        });

        if (this.roleName == 4) {
          this.showSubCribe = true;
          const href = window.location.href || '';
          if (href.includes('?s=1&layout=')) {
            this.initRemoteStreams(streams);
          }
        }
        if (this.roleName == 1 && !this.showSubCribe) { // 嘉宾为主讲人，主持人下麦 刷新主持人后订阅流显示上麦用户画面
          this.showSubCribe = true;
          // this.initRemoteStreams(streams)
        }
      });

      // 推流成功后 - 开始创建订阅列表
      EventBus.$once('streamPushed', (e) => {
        console.log('log info::', 'local stream Pushed', e);
        this.showSubCribe = true;
        this.streamLength = this.streamLength + 1;
        if (this.roleName != 4) {
          this.initRemoteStreams(streams);
        }
      });
      // 结束推流后 - 取消订阅列表
      EventBus.$on('streamStoped', () => {
        this.remoteStreams = [];
      });
      // 维护房间内远端流数量
      EventBus.$on('vrtc_disconnect_success', msg => {
        this.streamLength = this.streamLength - 1;
      });
      // 维护房间内远端流数量
      EventBus.$on('vrtc_connect_success', msg => {
        this.streamLength = this.streamLength + 1;
      });
    },

    addEventListener () {
      /**
       * 远端流 加入- 订阅
       */
      this.SDKINSTANCE.on(VhallRTC.EVENT_REMOTESTREAM_ADD, (e) => {
        console.log('tangram log info::', 'remote stream add', e);
        if (e.data.streamType != 3 && e.data.streamType != 4) {
          this.initRemoteStreams([e.data]);
        }
        const info = this.SDKINSTANCE.getRoomInfo();
        const match = info.remote.users.find(u => u.accountId == this.accountId);
        if (match && e.streamType !== 4 && e.streamType !== 3 && this.roleName == 1) {
          const token = sessionStorage.getItem('vss_token');
          const param = {
            type: 'relogin',
            token,
            accountId: this.accountId
          };
          window.chatSDK.emitCustomMsg(param); // 解决14568
        }
      });

      /**
       * 远端流 退出 - 开始倒计时，下麦该用户
       */
      this.SDKINSTANCE.on(VhallRTC.EVENT_REMOTESTREAM_REMOVED, (e) => {
        console.log('tangram log info::', 'remote streamremove', e);
        this.steamLeave(e.data);
      });
    },

    getSpeakerInfo (accountId, speackerlist) {
      if (speackerlist) {
        let check = findIndex(speackerlist, item => {
          return item.account_id == accountId;
        });
        return check != -1 ? this.speakerList[check] : null;
      }

      let check = findIndex(this.speakerList, item => {
        return item.account_id == accountId;
      });
      return check != -1 ? this.speakerList[check] : null;
    },

    initRemoteStreams (stream = []) {
      if (this.splited) {
        this.remoteStreams = this.speakerList;
        return;
      }
      let cache = [];
      cache = stream.map((item) => {
        const userInfo = this.getSpeakerInfo(item.accountId) || {};
        console.log('cache', item, userInfo);
        let nickName;
        let roleName;
        try {
          nickName = JSON.parse(item.attributes).nickName;
          roleName = JSON.parse(item.attributes).role;
        } catch (e) {
          console.warn('推流中无用户信息');
        }
        return {
          role_name: roleName,
          ...userInfo,
          ...item,
          nick_name: nickName
        };
      });
      console.log('list', cache, this.remoteStreams);
      this.remoteStreams = this.remoteStreams.filter((r) => { // 解决17110
        return !cache.find((c) => {
          return r.accountId == c.accountId || r.account_id == c.account_id;
        });
      });

      this.remoteStreams = uniqBy(this.remoteStreams.concat(cache), 'accountId').filter(r => r.accountId !== this.accountId && r.streamId);
      // 只订阅 1， 音频流 2，视频流
      this.remoteStreams = this.remoteStreams.filter((item) => {
        return !([3, 4].includes(Number(item.streamType)));
      });
      EventBus.$emit('remoteStreams', this.remoteStreams);
      this.streamLength = this.remoteStreams.length;
      const inavInfo = this.SDKINSTANCE.getRoomInfo();
      const localUser = inavInfo.local.user;
      if (localUser.streams && localUser.streams.length) {
        this.streamLength = this.streamLength + 1;
      }
      console.log('tangram log info:: current online Speakers', this.remoteStreams);

      window.dispatchEvent(new Event('resize'));

      if (this.splited == true) {
        EventBus.$emit('sendCmdToHost', {streams: this.remoteStreams});
      }
      this.createSubcribeList();
    },

    /**
     * 废弃方法
     */
    steamLeave (stream) {
      if (this.splited) {
        this.remoteStreams = this.speakerList;
        return;
      }
      if (stream.streamType != 3 || stream.streamType != 4) {
        this.remoteStreams = this.remoteStreams.filter((item) => {
          return item.streamId && (item.streamId != stream.streamId);
        });
      }

      if (this.splited == true) {
        EventBus.$emit('sendCmdToHost', {streams: this.remoteStreams});
      }
    },

    async createSubcribeList () {
      if (!this.subscribed) {
        this.subscribed = true;
        setTimeout(() => {
          if (!document.querySelector('video')) return;
          const mediacheckStatus = sessionStorage.getItem(`MEDIACHECK_FINISH_${this.roomId}`);
          if (mediacheckStatus == 'no' || mediacheckStatus == 'yes') {
            this.$alert('您已进入直播房间，马上开始互动吧', '', {
              title: '提示',
              confirmButtonText: '立即开始',
              lockScroll: false,
              callback: action => {
                this.lockStreamPlay = false;
                const list = document.getElementsByTagName('video');
                for (let item of list) {
                  item.play();
                }
              }
            });
          }
        }, 1000); // 只播放一个video标签、出现其它video标签播放不了的情况
        EventBus.$emit('finished');
      }
      // }
    }
  }
};
</script>
<style lang="less">
    .vhall-remote-strams-box{
        width: 100%;
        vertical-align: top;
        text-align: center;
        background: #242424;
        overflow-x: auto;
        border-bottom: 1px solid #1F1F1f;
        overflow-y: hidden;
        display: flex;
        justify-content: center;
        & > div {
          vertical-align: top;
          position: relative;
          top: 0;
          width: 160px;
          display: inline-block;
          height: 120px;
        }
    }
</style>
