<template>
  <div class="vhall-split-wrapbox-view">
    <div id="tip" >
        <span class="tip-txt">分屏模式</span>
        <span class="exit-shadow iconfont iconguanbi" @click="exitShadow" title="退出分屏"></span>
        <span class="v-fullScreen iconfont iconquanping" :class="isFullscreen ? 'iconquanpingguanbi' : 'iconquanping'" title="全屏" @click="enterFullScreen"></span>
    </div>
    <share-screen
      :ownerId="roomInfo.account_id"
      :mainScreen="mainScreen"
      :splited="false"
      :accountId="roomInfo.third_party_user_id"
      :roleName="roomInfo.role_name"
    ></share-screen>
    <streams
      style="height: 100%; margin: 0 auto;"
      :speakerList="speakerList"
      :accountId="roomInfo.third_party_user_id"
      :roomId="roomInfo.room_id"
      :roleName="roomInfo.role_name"
      :isDocShow="isDocShow"
      :mainScreen="doc_permission"
      :miniElement="miniElement"
      :isInteract="isInteract"
      :layout="layout"
    >
      <Interactive
        v-if="roomInfo.third_party_user_id && roomInfo.app_id && role"
        :miniElement="miniElement"
        :mainScreen="mainScreen || doc_permission"
        :isDocShow="isDocShow"
        :inavId="roomInfo.inav_id"
        :roomId="roomInfo.room_id"
        :appId="roomInfo.app_id"
        :accountId="roomInfo.third_party_user_id"
        :ownerId="roomInfo.account_id"
        :nickName="userInfo.nick_name"
        :token="roomInfo.paas_access_token"
        :vssToken="vssToken"
        :speakerList="speakerList"
        :splitStatus="this.splitStatus"
        :roleName="roomInfo.role_name"
        :role="role"
        :status="status"
        :isInteract="isInteract"
        :splited="true"
        :webinarId="ilId"
        ref="interactive"
      ></Interactive>
    </streams>
  </div>
</template>
<script>
import { findIndex } from 'lodash';
import EventBus from '@/utils/Events';
import streams from '../../libs/interactive/remoteStreams';
import Interactive from '../../libs/interactive';
import jiabinMixin from './mixin/jiabin';
import shareScreen from '../../libs/desktopScreen';

export default {
  props: {
    cut_record_status: {
      required: true
    },

    roomId: {
      required: true
    },

    ilId: {
      required: true
    },

    vssToken: {
      required: true
    },

    third_party_user_id: {
      required: true
    },

    params_verify_token: {
      required: true
    },

    qaStatus: {
      required: true,
      default: false
    },

    saas_join_id: {
      required: true
    },
    recordFun: {
      required: true,
      default: () => {}
    },
    domains: {
      required: true
    },
    duration: {
      required: true,
      default: 0
    },
    permission: {
      required: true
    },
    isInteract: {
      required: true
    },
    documentId: {
      // 创建直播时上传的文档Id
      required: true
    },
    record_notice: {
      required: true
    },
    isEmbed: {
      required: false // 是否为嵌入页
    },

    splitStatus: {
      required: false
    }
  },

  data () {
    return {
      mainScreen: '',
      miniElement: '',
      role: '',
      roomInfo: {},
      userInfo: {},
      doc_permission: '',
      isDocShow: false,
      status: '',
      layout: '',
      speakerList: [],
      isFullscreen: false
    };
  },

  components: {
    streams,
    Interactive,
    shareScreen
  },

  mixins: [
    jiabinMixin
  ],

  mounted () {
    $('.vhall-remote-strams-box').css({
      '-webkit-box-align': 'center',
      'align-items': 'center',
      'display': 'flex',
      'flex-wrap': 'wrap',
      'height': '100%',
      'align-items': 'center',
      'justify-content': 'center',
      'margin': 'auto',
      'overflow': 'hidden'
    });

    EventBus.$on('close_live', () => {
      this.$refs.interactive.stopLive().then(() => {
        this.$parents.endSplit();
      });
      // this.endSplit()
    });

    // 手动维护在线上麦人员列表 - 上线
    EventBus.$on('vrtc_connect_success', e => {
      console.log('用户上麦了', e);
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 200);

      let check = findIndex(this.speakerList, item => {
        return item.account_id == e.data.room_join_id;
      });

      if (check < 0) {
        this.speakerList.push({
          account_id: e.data.room_join_id,
          audio: e.data.vrtc_audio_status == 'on' ? 1 : 0,
          nick_name: e.data.nick_name,
          role_name: Number(e.data.room_role),
          video: e.data.vrtc_video_status == 'on' ? 1 : 0
        });
      }
    });

    // 手动维护在线上麦人员列表 - 下线
    EventBus.$on('vrtc_disconnect_success', e => {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 200);
      e.data.target_id &&
        (this.speakerList = this.speakerList.filter(item => {
          return item.account_id != e.target_id;
        }));
    });

    // 互动设置主讲人
    EventBus.$on('vrtc_speaker_switch', msg => {
      console.log('msg  主讲人ID', msg.room_join_id);
      this.doc_permission = msg.room_join_id;

      console.log('msg  主讲人ID', this.doc_permission);

    });

    EventBus.$on('applyByHost-split', () => {
      this.$refs.interactive.speakOn().then(() => {
        window.dispatchEvent(new Event('resize'));
      });
    });

    EventBus.$on('close_live-split', () => {
      this.$refs.interactive.stopLive().then(() => {
        this.$parents.disConnectShadow();
      });
    });

    // 下麦
    EventBus.$on('speakOff-split', () => {
      this.$refs.interactive.speakOff();
    });
    // 上麦
    EventBus.$on('speakOn-split', () => {
      this.$refs.interactive.speakOn();
    });

    // 上麦
    EventBus.$on('vrtc_connect_agree', () => {
      this.$refs.interactive.speakOn();
    });

    this.getInavInfo();

    window.addEventListener('resize', () => {
      this.resize();
    }, false);

    window.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        this.isFullscreen = false;
      }
    }, true);
  },

  methods: {

    enterFullScreen () {
      if (this.isFullscreen) {
        document.exitFullscreen();
        this.isFullscreen = false;
        return;
      }
      let element = document.querySelector('.vhall-split-wrapbox-view');
      if (element.requestFullscreen) element.requestFullscreen();
      else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
      else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) element.msRequestFullscreen();
      this.isFullscreen = true;
    },

    exitShadow () {
      EventBus.$emit('exitShadow');
    },

    // 初始化房间信息
    getInavInfo () {
      EventBus.$on('streamPushed', () => {
        window.dispatchEvent(new Event('resize'));
      });

      this.$vhallFetch('getInavInfo', {
        room_id: this.roomId
      }).then(async res => {
        console.log('debug info:: vss roomInfo', res);
        this.roomInfo = res.data;
        this.userInfo = JSON.parse(sessionStorage.getItem('user'));
        this.webinar_id = res.data.webinar_id;
        this.status = res.data.status;
        this.isPublishing = this.status == 1;
        this.roleName = res.data.role_name;

        // 设置角色
        this.role = this.roleName == 1 ? VhallRTC.MASTER : VhallRTC.GUEST;

        this.layout = res.data.layout;
        this.localDuration = this.duration;
        this.getRoomStatus();

        sessionStorage.setItem('room_role', this.roleName);
      }).catch(e => {
        console.log(e);
      });
    },

    /**
     * 获取房间状态，是否开启文档/白板/举手/主讲人...
     */
    getRoomStatus () {
      this.$vhallFetch('getRoomStatus', {
        room_id: this.roomId
      })
        .then(res => {
          this.allBanned = res.data.all_banned == 1;
          this.doc_permission = res.data.doc_permission; // 当前主讲人
          this.mainScreen = res.data.main_screen;
          this.speakerList = res.data.speaker_list;
          this.speakerList.forEach(item => {
            if (item.account_id == this.roomInfo.third_party_user_id) {
              this.isApplying = true;
            }
          });
        });
    },

    // 以下分屏算法为zhenliang.sun实现，有问题请联系他
    resize () {
      let windowRatio = 0;
      let videoRatio = 0;
      let height = 0;
      let width = 0;
      let count = 0;

      switch (this.speakerList.length) {
        case 1:
          count = 1;
          windowRatio = document.body.clientWidth / document.body.clientHeight;
          videoRatio = 1.777 * count;
          if (windowRatio > videoRatio) {
            width = document.body.clientHeight / 0.5625 / count + 'px';
            height = 100 / count + '%';
            document.querySelector('#vhall-remote-strams-box').style.height = height;
            document.querySelector('#vhall-remote-strams-box').style.width =
              parseInt(width) + 'px';
          } else {
            height = (document.body.clientWidth * 0.5625) / count + 'px';
            width = 100 / count + '%';
            document.querySelector('#vhall-remote-strams-box').style.height =
              parseInt(height) + 'px';
            document.querySelector('#vhall-remote-strams-box').style.width = '';
          }
          break;

        case 2:
          count = 2;
          windowRatio = document.body.clientWidth / document.body.clientHeight;
          videoRatio = 3.555;
          if (windowRatio > 1 && windowRatio > videoRatio) {
            height = '100%';
            width = document.body.clientHeight / count / 0.281 + 'px';
            document.querySelector('#vhall-remote-strams-box').style.height = height;
            document.querySelector('#vhall-remote-strams-box').style.width = parseInt(width) * 2 + 3 + 'px';
          } else if (windowRatio > 1 && windowRatio < videoRatio) {
            height = (document.body.clientWidth / 1) * 0.281 + 'px';
            width = '50%';
            document.querySelector('#vhall-remote-strams-box').style.height = parseInt(height) * 2 + 3 + 'px';
            document.querySelector('#vhall-remote-strams-box').style.width = '';
          } else if (windowRatio < 1 && windowRatio < videoRatio) {
            height = (document.body.clientWidth / 1) * 0.281 + 'px';
            width = '50%';
            document.querySelector('#vhall-remote-strams-box').style.height = parseInt(height) * 2 + 3 + 'px';
            document.querySelector('#vhall-remote-strams-box').style.width = '';
          } else if (windowRatio < 1 && windowRatio > videoRatio) {
            height = '100%';
            width = document.body.clientHeight / count / 0.281 + 'px';
            document.querySelector('#vhall-remote-strams-box').style.height = height;
            document.querySelector('#vhall-remote-strams-box').style.width = parseInt(width) * 2 + 3 + 'px';
          }
          break;

        case 3:
        case 4:
          count = 2;
          windowRatio = document.body.clientWidth / document.body.clientHeight;
          videoRatio = 1.777;
          if (windowRatio > 1 && windowRatio > videoRatio) {
            height = '50%';
            width = document.body.clientHeight / count / 0.5625 + 'px';
            document.querySelector('#vhall-remote-strams-box').style.height = '';
            document.querySelector('#vhall-remote-strams-box').style.width = parseInt(width) * 2 + 3 + 'px';
          } else if (windowRatio > 1 && windowRatio < videoRatio) {
            height = (document.body.clientWidth / count) * 0.5625 + 'px';
            width = '50%';
            document.querySelector('#vhall-remote-strams-box').style.height =
              parseInt(height) * 2 + 3 + 'px';
            document.querySelector('#vhall-remote-strams-box').style.width = '';
          } else if (windowRatio < 1 && windowRatio < videoRatio) {
            height = (document.body.clientWidth / count) * 0.5625 + 'px';
            width = '50%';
            document.querySelector('#vhall-remote-strams-box').style.height = parseInt(height) * 2 + 3 + 'px';
            document.querySelector('#vhall-remote-strams-box').style.width = '';
          } else if (windowRatio < 1 && windowRatio > videoRatio) {
            height = '50%';
            width = document.body.clientHeight / count / 0.5625 + 'px';
            document.querySelector('#vhall-remote-strams-box').style.height = '';
            document.querySelector('#vhall-remote-strams-box').style.width = parseInt(width) * 2 + 3 + 'px';
          }
          break;
        case 5:
        case 6:
          count = 3;
          windowRatio = document.body.clientWidth / document.body.clientHeight;
          videoRatio = 2.667;
          if (windowRatio > 1 && windowRatio > videoRatio) {
            height = '50%';
            width = document.body.clientHeight / count / 0.375 + 'px';
            document.querySelector('#vhall-remote-strams-box').style.height = '';
            document.querySelector('#vhall-remote-strams-box').style.width =
              parseInt(width) * 3 + 3 + 'px';
          } else if (windowRatio > 1 && windowRatio < videoRatio) {
            height = (document.body.clientWidth / 2) * 0.375 + 'px';
            width = '33.33%';
            document.querySelector('#vhall-remote-strams-box').style.height =
              parseInt(height) * 2 + 3 + 'px';
            document.querySelector('#vhall-remote-strams-box').style.width = '';
          } else if (windowRatio < 1 && windowRatio < videoRatio) {
            height = (document.body.clientWidth / 2) * 0.375 + 'px';
            width = '33.33%';
            document.querySelector('#vhall-remote-strams-box').style.height =
              parseInt(height) * 2 + 3 + 'px';
            document.querySelector('#vhall-remote-strams-box').style.width = '';
          } else if (windowRatio < 1 && windowRatio > videoRatio) {
            height = '50%';
            width = document.body.clientHeight / count / 0.375 + 'px';
            document.querySelector('#vhall-remote-strams-box').style.height = '';
            document.querySelector('#vhall-remote-strams-box').style.width =
              parseInt(width) * 3 + 3 + 'px';
          }
          break;
        default:
          break;
      }
      let arr = Array.prototype.slice.call(
        $('.vhall-subStream-box:visible')
      );
      arr.forEach(item => {
        $(item).css({
          width: width,
          height: height
        });
        $(item).find('.vhall-subStream-box--pophover').remove();

        // if (!$(item).hasClass('v-assembly')) {
        //   item.style.width = width;
        //   item.style.height = height;
        // }
      });
    }

  }
};
</script>
<style lang="less" scopd>
  #tip{
    display: none;
    position: fixed;
    z-index: 12;
    width: 100%;
    height: 50px;
    background-color: #434343;
    color: white;
    // display: -webkit-box;
    // display: flex;
    -webkit-box-align: center;
    align-items: center;
    padding: 0 20px;
    -webkit-box-pack: justify;
    justify-content: space-between;
    .exit-shadow {
      cursor: pointer;
      width: 32px;
      height: 32px;
      line-height: 32px;
      font-size: 18px;
      color: #fff;
      position: absolute;
      top: 8px;
      right: 44px
    }
    .v-fullScreen {
      cursor: pointer;
      width: 32px;
      height: 32px;
      line-height: 32px;
      font-size: 18px;
      color: #fff;
      position: absolute;
      top: 8px;
      right: 100px
    }
  }

  .vhall-split-wrapbox-view{
    &:hover{
      #tip{
        display: flex;
      }
    }
    width: 100%;
    height: 100%;
    background: #2d2d2d;
    -webkit-box-flex: 1;
    flex: 1;
    height: 100%;
    background-color: #2d2d2d;
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    position: relative;
       /deep/ &{

        #vhall-subcribe-screen{
          position: fixed;
          top: 0;
          right: 0;
          left: 0;
          bottom: 0;
          z-index: 10;
        }

        .vhall-remote-strams-box{
          -webkit-box-align: center;
          align-items: center;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          margin: auto;
          overflow: hidden;
          overflow: hidden;
          height: 100%;
          .vhall-subStream-box--pophover{
            display: none !important;
          }

          &:hover {
            .vhall-subStream-box--pophover {
              display: none !important;
            }
          }
        }
      }
  }
</style>
