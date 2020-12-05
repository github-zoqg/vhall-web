<template>
  <chrome v-if="downloadChrome" :type="'master'"></chrome>
  <tip v-else-if="tipMsg" :text="tipMsg"> </tip>
  <div v-else class="publish-wrap">
    <vhall-saas
      :roomId="roomId"
      :ilId="il_id"
      :vssToken="vss_token"
      :joinId="joinId"
      :third_party_user_id="third_party_user_id"
      :params_verify_token="params_verify_token"
      :qaStatus="qaStatus"
      :saas_join_id="saas_join_id"
      :recordFun="recordFun"
      :domains="domains"
      :duration="duration"
      :permission="permission"
      :isInteract="is_interact"
      :record_notice="record_notice"
      :cut_record_status="cut_record_status"
      :documentId="document_id"
      :shareId="shareId"
      :docLowPriority="docLowPriority"
      :recordTip="recordTip"
      :rootActive='rootActive'
      :roomStatus='roomStatus'
    ></vhall-saas>
    <remote-script src="//static.vhallyun.com/jssdk/vhall-jssdk-chat/latest/vhall-jssdk-chat-2.0.9.js" @load="chatSdkLoadHandler"></remote-script>
    <remote-script src='//static.vhallyun.com/jssdk/vhall-jssdk-interaction/latest/vhall-jssdk-interaction-2.2.1.js' @load="interactionSdkLoadHandler"></remote-script>
  </div>
</template>
<script>
import VhallReport from '@/components/VhallReport/main';
import { browserSupport } from '@/utils/getBrowserType';
import chrome from './chrome';
import tip from './tip';
export default {
  components: { chrome, tip },
  data() {
    return {
      rootActive:{}, // 活动信息
      roomStatus:{}, // 房间信息
      roomId: '',
      il_id: this.$route.params.il_id,
      vss_token: '',
      joinId: '',
      third_party_user_id: '',
      params_verify_token: '',
      qaStatus: 0,
      saas_join_id: '',
      domains: {},
      duration: 0,
      permission: [],
      is_interact: '',
      document_id: '',
      cut_record_status: '',
      record_notice: 1,
      userInfo: {},
      shareId: '',
      downloadChrome: !browserSupport(),
      docLowPriority: '', // 文档转换优先级
      recordTip: '', // 是否弹出默认回放弹框
      tipMsg: '', // info接口返回的错误信息
    };
  },
  beforeCreate() {},
  created() {
    if (!browserSupport()) return;
  },

  mounted() {
    this.heartbeatLink();
  },

  methods: {
    heartbeatLink() {
      setTimeout(() => {
        this.$fetch('liveHeartBeat', {})
          .then(() => {
            this.heartbeatLink();
            console.log('心跳检测成功');
          })
          .catch(re => {
            console.log(re);
            console.log('心跳检测失败');
          });
      }, 1000 * 60 * 30);
    },
  getUserinfo() {
      this.$fetch('initiatorInfo', { webinar_id: this.il_id })
        .then(async res => {
          if (res.code != 200) {
            // eslint-disable-next-line no-return-assign
            return this.tipMsg = res.msg;
          }
          const mockResult =  this.rootActive = res.data;
          await this.getTools(mockResult.interact.room_id);
          this.shareId = mockResult.share_id;
          this.userInfo = mockResult.join_info;
          this.roomId = mockResult.interact.room_id;
          this.vss_token = mockResult.interact.paas_access_token;
          this.third_party_user_id = mockResult.join_info.third_party_user_id;
          // this.joinId = mockResult.join_info.join_id; // 暂时移除
          this.saas_join_id = mockResult.join_info.join_id;
          var a = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjE2NDIxMzg0IiwicGhvbmUiOiIxMzc4MzQ1MTAyMyIsIm5pY2tfbmFtZSI6Ilx1NTQwM1x1NGUwZFx1ODBkNlx1NWMwZlx1OTY0OCIsImpvaW5fdWlkIjoiMTczNjI2NyJ9.SZ2CgHUBoGFRN7v-NscO90ZbOJtprgItBE-HhYoV4vc';
          this.params_verify_token = mockResult.join_info.interact_token;
          this.permission = mockResult.permission;
          this.permission = [100001,100003,100004,100005,100008,100009,100011,100012,100013,100014,100015,100016,100017,100018,100019,100020,100021,100022,100023,100026,100027,100028,100029,100030];
          console.log(this.roomStatus, 123);
          this.qaStatus = mockResult.qa_open || 0;  // ???  互动--
          this.domains = {
            ...mockResult.urls || {},  // ??? 云俊 返回
            custom: mockResult.live_domain_customization
          };
          console.log(mockResult, 88888);
          let localDomain = {
            'static':mockResult.urls.static_url ,
            'upload': mockResult.urls.upload_url,
            'web': mockResult.urls.web_url,
            'webinar': "//t-webinar.e.vhall.com"
          };
          this.duration = mockResult.webinar.live_time;
          this.is_interact = mockResult.webinar.mode == 3  ? 1 : 0 ; // 做一下判断 ??? mode 直播模式：1-音频、2-视频、3-互动
          this.document_id = mockResult.webinar.document_id;
          this.cut_record_status = mockResult.cut_record_status;
          this.record_notice = mockResult.record_notice || 3; // 设置默认回放视频提示 ???
          this.docLowPriority = mockResult.doc_low_priority || 0;// ???  互动工具
          this.recordTip = mockResult.record_tip;
          sessionStorage.setItem('vhall_domain',JSON.stringify(localDomain));
          sessionStorage.setItem('host_uid', JSON.stringify(mockResult.join_info.third_party_user_id));
          sessionStorage.setItem('user', JSON.stringify(mockResult.join_info));
          sessionStorage.setItem('vss_token', mockResult.join_info.interact_token);
          sessionStorage.setItem('roomId', mockResult.interact.room_id);
          sessionStorage['vhall-vsstoken'] = mockResult.join_info.interact_token;
          sessionStorage.setItem('defaultMainscreenDefinition', mockResult.push_definition || '');// ???
          sessionStorage.setItem('defaultSmallscreenDefinition', mockResult.hd_definition || '');// ???
          sessionStorage.setItem('interact_token', mockResult.interact.interact_token);
          // 初始化数据上报
          this.initVHallReport(mockResult);
        }).catch(err => {
          console.log('catch', err);
        });
    },
    getTools(roomId){
      return new Promise((resolve, reject) => {
        this.$fetch('getToolStatus', {room_id: roomId}).then(res=>{
          this.roomStatus = res.data;
          resolve();
        }).catch(err=>{
          console.warn(err, 'catch');
          resolve();
        });
      });
    },
    // 打点录制
    recordFun(data) {
      console.log('打点录制 状态数据', data);

      this.$fetch('record', {
        ...data,
        params_verify_token: this.params_verify_token,
        webinar_id: this.il_id
      });
    },
    initVHallReport(roominfo) {
      this.$fetch('getInitiatorReportInfo', {
        vss_token: roominfo.interact.paas_access_token,
        webinar_id: roominfo.webinar.id
      }).then(res => {
        window.vhallReport = new VhallReport({
          ...res.data,
          pf: 7,
          service_names: 1,
          env: process.env.NODE_ENV === 'production' ? 'production' : 'test'
        });
      }).catch(error=>{
        console.error('init vhallReport failure', error);
        window.vhallReport = new VhallReport({
          code: 216,
          msg: "暂不支持数据上报",
          pf: 7,
          service_names: 1,
          env: process.env.NODE_ENV === 'production' ? 'production' : 'test'
        });

      });
    },
    chatSdkLoadHandler(){
      this.chatSdkLoaded = true;
      if(this.chatSdkLoaded&&this.interactionSdkLoaded){
        this.getUserinfo();
      }

    },
    interactionSdkLoadHandler(){
      this.interactionSdkLoaded = true;
      if(this.chatSdkLoaded&&this.interactionSdkLoaded){
        this.getUserinfo();
      }
    }
  }
};
</script>
<style lang="less" scoped>
a {
  text-decoration: none;
}
.publish-wrap {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  overflow: hidden;
}
.alert{
  box-sizing: content-box;
}
</style>
