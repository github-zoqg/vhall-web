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
    ></vhall-saas>
    <remote-script src="//static.vhallyun.com/jssdk/vhall-jssdk-chat/latest/vhall-jssdk-chat-2.0.9.js" @load="chatSdkLoadHandler"></remote-script>
    <remote-script src='//static.vhallyun.com/jssdk/vhall-jssdk-interaction/latest/vhall-jssdk-interaction-2.2.1.js' @load="interactionSdkLoadHandler"></remote-script>
  </div>
</template>
<script>
import VhallReport from '@/components/VhallReport/main';
import { browserSupport } from '@/utils/getBrowserType';
import chrome from './chrome';
import DATA from './data';
import tip from './tip';
export default {
  components: { chrome, tip },
  data() {
    return {
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
      tipMsg: '' // info接口返回的错误信息
    };
  },
  beforeCreate() {},
  created() {
    // this.$set(this.userInfo, 'token', 'vhall');
    // this.getInav();
    if (!browserSupport()) return;
    // this.getUserinfo();
  },

  mounted() {
    this.heartbeatLink();
  },

  methods: {
    heartbeatLink() {
      setTimeout(() => {
        this.$fetch('heartbeat', {})
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
      // this.$fetch('initiatorInfo', { webinar_id: this.il_id })
      //   .then(res => {
      //     if (res.code != 200) {
      //       // eslint-disable-next-line no-return-assign
      //       return this.tipMsg = res.msg;
      //     }
          const mockResult = window.a.data;
          console.warn(mockResult);
          this.shareId = mockResult.share_id;
          this.userInfo = mockResult.user;
          this.roomId = mockResult.room_id;
          this.vss_token = mockResult.vss_token;
          this.joinId = mockResult.user.join_id;
          this.third_party_user_id = mockResult.user.third_party_user_id;
          this.permission = mockResult.permission;
          this.qaStatus = mockResult.qa_open;
          this.params_verify_token = mockResult.params_verify_token;
          this.saas_join_id = mockResult.user.saas_join_id;
          this.domains = {
            ...mockResult.domains,
            custom: mockResult.live_domain_customization
          };
          this.duration = mockResult.live_time;
          this.is_interact = mockResult.is_interact;
          this.document_id = mockResult.document_id;
          this.cut_record_status = mockResult.cut_record_status;
          this.record_notice = mockResult.record_notice; // 设置默认回放视频提示
          this.docLowPriority = mockResult.doc_low_priority;
          this.recordTip = mockResult.record_tip;
          sessionStorage.setItem(
            'vhall_domain',
            JSON.stringify(mockResult.domains)
          );
          sessionStorage.setItem('host_uid', JSON.stringify(mockResult.host_uid));
          sessionStorage.setItem('user', JSON.stringify(mockResult.user));
          sessionStorage.setItem('vss_token', mockResult.vss_token);
          sessionStorage.setItem('roomId', mockResult.room_id);
          sessionStorage['vhall-vsstoken'] = mockResult.vss_token;
          sessionStorage.setItem('defaultMainscreenDefinition', mockResult.push_definition || '');
          sessionStorage.setItem('defaultSmallscreenDefinition', mockResult.hd_definition || '');
          // 初始化数据上报
          this.initVHallReport(mockResult);
          //   sessionStorage.setItem('vhall-vsstoken',res.data.vss_token)
        // })
        // .catch(err => {
        //   this.codeError = err.msg;
        //   console.log('catch', err);
        // });

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
        report_token: roominfo.report_token,
        vss_token: roominfo.vss_token
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
  height: 100vh;
  min-width: 1200px;
  overflow: hidden;
}
.alert{
  box-sizing: content-box;
}
</style>
