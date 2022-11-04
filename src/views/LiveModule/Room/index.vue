<template>
  <chrome v-if="downloadChrome" :type="'master'"></chrome>
  <tip v-else-if="tipMsg" :text="tipMsg"> </tip>
  <div v-else class="publish-wrap">
    <vhall-saas
      v-if="roomStatus.show"
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
  </div>
</template>
<script>
import VhallReport from '@/components/VhallReport/main';
import { browserSupport } from '@/utils/getBrowserType';
import { sessionOrLocal, getQueryString } from '@/utils/utils';
import chrome from './chrome';
import tip from './tip';
export default {
  components: { chrome, tip },
  data() {
    return {
      rootActive:{}, // 活动信息
      roomStatus:{
        show: false
      }, // 房间信息
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
    if(window.location.search.indexOf('live_token=') != -1){
      sessionOrLocal.set('live_token', getQueryString('live_token'), 'localStorage')
    }
    if (!browserSupport()) return;
    this.getUserinfo()
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
    window.se = sessionOrLocal
      this.$fetch('initiatorInfo', { webinar_id: this.il_id })
        .then(async res => {
          if (res.code != 200) {
            // eslint-disable-next-line no-return-assign
            return this.tipMsg = res.msg;
          }
          const mockResult =  this.rootActive = res.data;
          console.warn('*************this.rootActive*************', this.rootActive);
          sessionStorage.setItem('host_uid', JSON.stringify(mockResult.join_info.third_party_user_id));
          sessionStorage.setItem('user', JSON.stringify(mockResult.join_info));
          sessionStorage.setItem('userInfo', JSON.stringify(mockResult.join_info));
          sessionStorage.setItem('vss_token', mockResult.join_info.interact_token);
          sessionStorage.setItem('roomId', mockResult.interact.room_id);
          sessionStorage.setItem('report_extra', JSON.stringify(mockResult.report_data))
          sessionStorage['vhall-vsstoken'] = mockResult.join_info.interact_token;
          sessionStorage.setItem('defaultMainscreenDefinition', mockResult.push_definition || '');// ???
          sessionStorage.setItem('defaultSmallscreenDefinition', mockResult.hd_definition || '');// ???
          sessionStorage.setItem('interact_token', mockResult.interact.interact_token);
          this.shareId = mockResult.share_id;
          this.userInfo = mockResult.join_info;
          this.roomId = mockResult.interact.room_id;
          this.vss_token = mockResult.interact.paas_access_token;
          this.third_party_user_id = mockResult.join_info.third_party_user_id;
          this.saas_join_id = mockResult.join_info.join_id;
          this.params_verify_token = mockResult.join_info.interact_token;
          this.permission = mockResult.permission;
          this.qaStatus = mockResult.qa_open || 0;  //
          // 单独增加 static、upload、web  为了减少修改，将这个
          this.domains = {
            ...mockResult.urls || {},
            ...{
              static: mockResult.urls.static_url,
              upload: mockResult.urls.upload_url,
              webinar: '',
              web: mockResult.urls.web_url
            }
          };
          console.log(mockResult, 88888, this.domains);
          sessionStorage.setItem('vhall_domain',JSON.stringify(this.domains));
          this.duration = mockResult.webinar.live_time;
          this.is_interact = mockResult.webinar.mode == 3  ? 1 : 0 ; // 做一下判断 ??? mode 直播模式：1-音频、2-视频、3-互动
          this.document_id = mockResult.webinar.document_id;
          this.cut_record_status = mockResult.cut_record_status;
          this.record_notice = mockResult.record_notice || 3; // 设置默认回放视频提示 ???
          this.docLowPriority = mockResult.doc_low_priority || 0;// ???  互动工具
          this.recordTip = mockResult.record_tip;
          await this.getTools(mockResult.interact.room_id);
          // 初始化数据上报
          this.initVHallReport(mockResult);
        }).catch(err => {
          console.log('catch', err);
        });
    },
    getTools(roomId){
      return new Promise((resolve, reject) => {
        this.$fetch('getToolStatus', {room_id: roomId}).then(res=>{
          if(res.code == 200){
            res.data.show = true
            this.roomStatus = res.data;
            console.warn(res.data, '基于整那个');
            resolve();
          }else{
            this.$message.warning(res.msg)
          }
        }).catch(err=>{
          console.warn(err, 'catch');
          resolve();
        });
      });
    },
    // 打点录制
    recordFun(data) {
      // status 状态：1-开始|恢复，2-暂停，3-结束
      console.log('打点录制 状态数据-2', data);
      this.$fetch('record', {
        ...data,
        params_verify_token: this.params_verify_token,
        webinar_id: this.il_id
      }).then(res=>{
        if (res.code!=200) return this.$message.warning(res.msg)
      })
    },
    initVHallReport(roominfo) {
      window.vhallReport = new VhallReport({
        user_id: this.rootActive.join_info.join_id,
        webinar_id: this.rootActive.webinar.id,
        t_start: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        os: 10,
        type: 4,
        entry_time: dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        pf: 7,
        env: process.env.VUE_APP_NODE_ENV === 'production' ? 'production' : 'test'
      });
      window.vhallReport && window.vhallReport.report('ENTER_WATCH');
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
