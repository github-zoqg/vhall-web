<template>
  <div class="vhall-rebroadcast-container">
    <div class="vhall-rbrdcst-leftpanel" v-loading="loading">
      <div class="vhall-searchbar">
        <span class="mylive">
          我的直播
          <i></i>
          <div class="tips">暂只支持转播直播</div>
        </span>
        <div class="search-right">
          <span class="refresh" @click="getList">刷新</span>
          <input
            v-model="input"
            class="go-search"
            type="text"
            placeholder="搜索直播标题"
            @keydown.enter="getList"
          />
          <div class="clear-search"></div>
        </div>
      </div>
      <div class="vhall-searchresult">
        <p v-if="!list.length">没有找到直播</p>
        <div
          v-for="item in list"
          v-bind="item"
          :key="item.room_id"
          :class="item.isStream||current == item.room_id?'rebroadcasting item-container':'item-container'"
          @click="select(item.room_id)"
        >
          <i v-show="item.isStream == 1" class="broadcasting">转播中</i>
          <div class="item-logo">
            <img
              :src="item.cover_image||'//t-alistatic01.e.vhall.com/static/img/video_default_nologo.png'"
              class="mCS_img_loaded"
            />
            <i v-show="item.status == 1">直播</i>
          </div>
          <div class="item-content">
            <div class="broadcast-title">{{item.subject}}</div>
            <div class="broadcast-time">{{item.start_time}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="vhall-rbrdcst-rightpanel">
      <div class="rbrdcs-title">预览</div>
      <div class="rbrdcs-videobox" v-if="!docUrl">
        <img  v-if="!current&&!rebroadcastingRoomId" :src="posterUrl" />
        <Player
          v-if="appId && (current||rebroadcastingRoomId)"
          :appId="appId"
          :accountId="accountId"
          :token="token"
          :type="'live'"
          :poster="posterUrl"
          :liveOption="{roomId:current,type:'flv'}"
          :playerInfo="{}"
          :controller="'disabled'"
          :isAudio="webinar.layout==2"
          ref="preview"
        ></Player>
      </div>
      <div class="rbrdcs-videobox" v-else>
        <img class="doc" :src="docUrl" />
        <div class="mini-video-box">
          <Player
            v-if="appId && (current||rebroadcastingRoomId)"
            :appId="appId"
            :accountId="accountId"
            :token="token"
            :type="'live'"
            :poster="posterUrl"
            :liveOption="{roomId:current,type:'flv'}"
            :controller="'disabled'"
            :playerInfo="{}"
            :isAudio="webinar.layout==2"
            ref="preview"
          ></Player>
        </div>
      </div>
      <div class="rbrdcs-button-container" v-if="current">
        <p v-if="pushStreamSeperately" class="start-local-stream" @click="pushLocalStream">开始本地推流</p>
        <span v-if="!rebroadcastingRoomId" class="switch-broadcast" @click="rebroadcast">开始转播</span>
        <span v-if="rebroadcastingRoomId" class="switch-broadcast" @click="stopRebroadcast">结束转播</span>
        <p v-if="rebroadcastingRoomId" class="local-streambox" style="display: block;">
          <input type="checkbox" id="startPushstream" checked />
          <label for="startPushstream" @click="toggleLocalStream(!localStream)">
            <i :class="localStream?'selected':''"></i>同时开始本地推流
          </label>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import Player from '../player';
import EventBus from '@/utils/Events';
export default {
  name: 'rebroadcast',
  components: { Player },
  props: ['webinar_id', 'roomId', 'vssToken', 'status', 'visible'],
  data () {
    return {
      loading: false,
      list: [],
      current: '', // 选中的roomID
      webinar: {},
      input: '',
      localStream: false,
      posterUrl:
        '//t-alistatic01.e.vhall.com/static/img/video_default_nologo.png',
      rebroadcastingRoomId: '', // 转播中的roomID
      appId: '',
      accountId: '',
      token: '',
      recordId: '',
      docUrl: '',
      pushStreamSeperately: false
    };
  },
  mounted () {
    this.getList();
  },
  watch: {
    visible (newvalue) {
      console.warn(newvalue, '转播');
      if (!newvalue) {
        this.current = '';
        this.rebroadcastingRoomId = '';
        this.docUrl = '';
        this.pushStreamSeperately = false;
        try {
          this.$refs.preview && this.$refs.preview.$PLAYER.destroy();
        } catch (error) {
          console.log(error);
        }
      } else {
        this.getList();
      }
    }
  },
  methods: {
    select (id) {
      try {
        this.$refs.preview && this.$refs.preview.$PLAYER.destroy();
      } catch (error) {
        console.log(error);
      }
      this.docUrl = '';
      this.current = '';
      this.rebroadcastingRoomId = '';
      window.setTimeout(() => {
        this.current = id;
        const currentItem = this.list.find(item => item.room_id == this.current);
        this.posterUrl = currentItem.cover_image || this.posterUrl;
        if (currentItem.isStream == 1) {
          this.rebroadcastingRoomId = this.current;
        }
        this.getPreviewInfo(id);
      }, 1000);
    },
    getList () {
      this.loading = true;
      this.$fetch('rebroadcastList',{
        webinar_id: this.webinar_id,
        subject: this.input
      }).then(res=>{
          this.loading = false;
          this.list = res.data ? res.data.list : [];
          console.warn('获取转播列表准确------', res);
      }).catch(err=>{
          this.loading = false;
          console.log(error);
      });
      // this.$vhallFetch('getRebroadcastList', {
      //   room_id: this.roomId,
      //   vss_token: this.vssToken,
      //   subject: this.input
      // })
      //   .then(res => {
      //     this.loading = false;
      //     this.list = res.data ? res.data.list : [];
      //   })
      //   .catch(error => {
      //     this.loading = false;
      //     console.log(error);
      //   });
    },
    getPreviewInfo (id) {
      this.$fetch('rebroadcastPreview',{
        webinar_id: this.webinar_id,
        source_id: id,
      }).then(res => {
          this.webinar = res.data;
          this.token = this.webinar.paas_access_token;
          this.appId = this.webinar.app_id;
          this.accountId = this.webinar.third_party_user_id;
          this.recordId = this.webinar.record_id;
          this.docUrl = res.data.document_url;
          this.$refs.preview.initSDK();
        })
        .catch(error => {
          console.log(error);
        });
      // this.$vhallFetch('getRebroadcastPreviewInfo', {
      //   source_room_id: id,
      //   vss_token: this.vssToken
      // })
      //   .then(res => {
      //     this.webinar = res.data;
      //     this.token = this.webinar.paas_access_token;
      //     this.appId = this.webinar.app_id;
      //     this.accountId = this.webinar.third_party_user_id;
      //     this.recordId = this.webinar.record_id;
      //     this.docUrl = res.data.document_url;
      //     this.$refs.preview.initSDK();
      //   })
      //   .catch(error => {
      //     console.log(error);
      //   });
    },
    toggleLocalStream (value) {
      this.localStream = value;
    },
    pushLocalStream () {
      EventBus.$emit('rebroadcastPushStream');
      this.$emit('onClose');
    },
    rebroadcast () {
      if (!this.$refs.preview || !this.$refs.preview.$PLAYER) return this.$message.error('拉流中或者拉流失败！');
      if (this.status != 1) return this.$message('请先开始直播！');
      this.$vhallFetch('rebroadcast', {
        room_id: this.roomId,
        vss_token: this.vssToken,
        source_room_id: this.current
      })
        .then(res => {
          this.rebroadcastingRoomId = this.current;
          this.getList();
          EventBus.$emit('rebroadcastStart', {
            roomId: this.roomId,
            vssToken: this.vssToken,
            sourceRoomId: this.current,
            recordId: this.webinar.record_id,
            token: this.webinar.paas_access_token,
            accountId: this.webinar.third_party_user_id,
            appId: this.webinar.app_id,
            layout: this.webinar.layout,
            liveOption: { roomId: this.current, type: 'flv' },
            channelId: this.webinar.channel_id
          });
          if (res.code == 200) {
            this.$emit('onClose');
            this.$message.success('转播成功！');
          } else {
            this.$message.error('转播失败！');
          }
        })
        .catch(error => {
          this.$message.error('转播失败！');
          console.log(error);
        });
    },
    stopRebroadcast () {
      this.$vhallFetch('stopRebroadcast', {
        room_id: this.roomId,
        vss_token: this.vssToken,
        source_room_id: this.rebroadcastingRoomId
      })
        .then(res => {
          this.rebroadcastingRoomId = '';
          if (!this.localStream) {
            this.pushStreamSeperately = true;
          }
          this.getList();
          EventBus.$emit('rebroadcastStop', {
            roomId: this.roomId,
            vssToken: this.vssToken,
            sourceRoomId: this.current,
            recordId: this.webinar.record_id,
            token: this.webinar.paas_access_token,
            accountId: this.webinar.third_party_user_id,
            appId: this.webinar.app_id,
            localStream: this.localStream
          });
          if (res.code == 200) {
            this.$message('停止转播成功！');
          } else {
            this.$message('停止转播失败！');
          }
        })
        .catch(error => {
          console.log(error);
          this.$message('停止转播失败！');
        });
    }
  }
};
</script>
<style lang="less">
.vhall-rebroadcast-container {
  background-color: #fff;
  font-family: '微软雅黑';
  padding-left: 27px;
  padding-right: 27px;
  padding-bottom: 27px;
  padding-top: 4px;
  display: flex;
  & > .vhall-rbrdcst-leftpanel {
    width: 350px;
    & > .vhall-searchbar {
      display: flex;
      justify-content: flex-start;
      position: relative;
      width: 335px;
      padding: 10px 0 20px 0;
      & > .mylive {
        display: inline-block;
        line-height: 32px;
        width: 125px;
        text-align: left;
        position: relative;
        font-size: 14px;
        color: #666;
        & > i {
          display: inline-block;
          width: 14px;
          height: 14px;
          position: absolute;
          top: 10px;
          left: 66px;
          cursor: pointer;
          //   background: url(../../../images/vhall3.0/keywords/icon.png?v=6KG2Q2KeHF2BSgAcOiXZvQ%3D%3D)
          //     no-repeat -2px -2px;
        }
        & > .tips {
          background-color: rgba(51, 51, 51, 0.8);
          box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
          position: absolute;
          z-index: 999;
          color: #fff;
          font-size: 12px;
          width: 100px;
          border-radius: 4px;
          top: 0px;
          display: none;
          left: 90px;
          padding: 0 10px;
        }
      }
      .search-right {
        flex: 1;
        & > .refresh {
          width: 50px;
          border-radius: 3px;
          border-color: #d2d2d2;
          height: 32px;
          line-height: 28px;
          position: relative;
          color: #666;
          border: 1px solid #d2d2d2;
          display: inline-block;
          margin-bottom: 0;
          font-size: 12px;
          font-weight: 400;
          text-align: center;
          white-space: nowrap;
          vertical-align: middle;
          cursor: pointer;
          user-select: none;
          background: none;
          border-radius: 4px;
          margin-bottom: 2px;
          &:hover {
            background: #fc5659;
            color: #fff;
            border-color: transparent;
          }
          &:active {
            background: #c62020;
            color: #fff;
            border-color: transparent;
          }
        }
        & > .go-search {
          background-color: #fff;
          background-position: 10px 8px;
          border: 1px solid #d2d2d2;
          width: 85px;
          height: 30px;
          border-radius: 2px;
          color: #666666;
          background-image: url('../../public/saas/images/account-file-search.png');
          background-repeat: no-repeat;
          padding-left: 35px;
          padding-top: 2px;
          padding: 2px 30px 0px 35px;
          box-sizing: content-box !important;
        }
        & > .clear-search {
          display: none;
          position: absolute;
          top: 50%;
          right: 10px;
          margin-top: -10.5px;
          width: 15px;
          height: 15px;
          cursor: pointer;
          background-size: 100%;
        }
      }
    }
    & > .vhall-searchresult {
      height: 338px;
      overflow-y: scroll;
      overflow-x: hidden;
      margin-right: 8px;
      scroll-behavior: smooth;
      &>p{
          background: url(../../buTemplates/saas/img/v35-empty-list-search.png) no-repeat;
          background-position: center 70px;
          line-height: 430px;
          font-size: 16px;
          color: #666;
          text-align: center;
          height: 100%;
      }
      &::-webkit-scrollbar {
        width: 6px;
      }

      /* Track */
      &::-webkit-scrollbar-track {
          box-shadow: inset 0 0 6px rgba(82, 81, 81, 0.3);
          border-radius: 6px;
      }

      /* Handle */
      &::-webkit-scrollbar-thumb {
          border:1px solid rgba(138, 134, 134, 0.9);
          border-radius: 6px;
          background: rgba(160, 156, 156, 0.5);
          box-shadow: inset 0 0 6px rgba(7, 7, 7, 0.3);
      }
      & > .item-container {
        box-sizing: content-box;
        cursor: pointer;
        border: 1px solid #dfdfdf;
        margin-bottom: 10px;
        width: 315px;
        height: 97px;
        padding: 5px;
        border-radius: 4px;
        display: flex;
        justify-content: flex-start;
        position: relative;
        & > .broadcasting {
          position: absolute;
          top: 0;
          right: 0;
          width: 42px;
          text-align: center;
          height: 19px;
          line-height: 19px;
          font-size: 12px;
          color: #fff;
          background: #fc5659;
          font-style: normal;
        }
        &:hover {
          border-color: #fc5659;
        }
        & > .item-logo {
          box-sizing: content-box;
          width: 170px;
          height: 97px;
          position: relative;
          & > img {
            width: 100%;
            height: 100%;
            border: 0.5px solid #dfdfdf;
          }
          & > i {
            position: absolute;
            top: 0;
            left: 0;
            width: 30px;
            text-align: center;
            height: 15px;
            line-height: 15px;
            color: #fff;
            background: #fc5659;
            border-radius: 0px 0px 2px 0;
            font-size: 12px;
            font-style: normal;
          }
        }
        & > .item-content {
          box-sizing: content-box;
          padding: 16px 0;
          display: flex;
          flex-direction: column;
          padding: 16px 10px;
          display: flex;
          justify-content: center;
          & > div:first-child {
            width: 120px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 16px;
            color: #333;
            text-align: left;
            margin-bottom: 5px;
          }
          & > div:nth-child(2) {
            text-align: left;
            font-size: 12px;
            color: #666;
          }
        }
      }
      & > .item-container.rebroadcasting {
        border-color: #fc5659;
      }
    }
  }
  & > .vhall-rbrdcst-rightpanel {
    flex: 1;
    height: 379px;
    & > .rbrdcs-title {
      text-align: left;
      color: #d2d2d2;
      font-size: 14px;
      font-weight: normal;
      padding: 17px 0 24px 0;
      color: #666;
    }
    & > .rbrdcs-videobox {
      width: 100%;
      height: 253px;
      border: 1px solid #dfdfdf;
      border-radius: 4px;
      overflow: hidden;
      background-color: rgb(223, 223, 223);
      position: relative;
      text-align: center;
      &>img{
        height:100%;
        width:100%;
      }
      &>img.doc{
        height: 100%;
        width:initial;
      }
      &>.mini-video-box{
        width:118px;
        height: 89px;
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    & > .rbrdcs-button-container {
      margin-top: 30px;
      box-sizing: content-box;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      & > .switch-broadcast {
        padding: 0;
        width: 90px;
        height: 30px;
        line-height: 28px;
        border-radius: 2px;
        border-color: #999;
        color: #666;
        border: 1px solid #d2d2d2;
        display: inline-block;
        margin-bottom: 0;
        font-size: 12px;
        font-weight: 400;
        text-align: center;
        white-space: nowrap;
        cursor: pointer;
        user-select: none;
        background: none;
        &:hover {
          border-color: #fc5659;
          background: #fc5659;
          color: #fff;
        }
        &:active {
          background: #c62020;
          color: #fff;
          border-color: transparent;
        }
      }
      & > .local-streambox {
        box-sizing: content-box;
        position: absolute;
        left: 37px;
        overflow: hidden;
        top: 2px;
        & > input {
          display: none;
        }
        & > label {
          cursor: pointer;
          font-size: 12px;
          color: rgb(68, 68, 68);
          & > i {
            display: inline-block;
            width: 14px;
            height: 14px;
            border-radius: 2px;
            border: 1px solid #999;
            margin-right: 5px;
            position: relative;
            top: 3px;
          }
          & > i.selected {
            border-color: #fff;
            background: url('../../public/saas/images/account-file-check.png')
              no-repeat;
          }
        }
      }
      &>.start-local-stream{
        box-sizing: content-box;
        position: absolute;
        left: 278px;
        overflow: hidden;
        cursor: pointer;
        top: 6px;
        font-size: 12px;
        color: rgb(68, 68, 68);
        &:hover{
          color: #c62020;
        }
      }
    }
  }
}
</style>
