<template>
  <chrome v-if="downloadChrome" :type="'master'">
  </chrome>
  <div v-else class="recordVideo">
      <vhall-record-saas
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
      :is_recording ="isrecording"
      :record_notice="record_notice"
      :cut_record_status="cut_record_status"
      :documentId="document_id"
      :docLowPriority="docLowPriority"
      :recordTip="recordTip"
      :rootActive='rootActive'
      :roomStatus='roomStatus'
    ></vhall-record-saas>
  </div>
</template>
<script>
import { browserSupport } from '@/utils/getBrowserType';
import chrome from './chrome'
export default {
  components: { chrome },
  data () {
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
      downloadChrome: !browserSupport(),
      docLowPriority: '', // 文档转换优先级
      isrecording: 0, // 是否录制中
      recordTip: '', // 是否弹出默认回放弹框
      tipMsg: '' // info接口返回的错误信息
    }
  },

  created () {
    this.getUserinfo()
  },
  mounted () {
    this.heartbeatLink()
  },

  methods: {
    heartbeatLink () {
      setTimeout(() => {
        this.$fetch('heartbeat', {})
          .then(() => {
            this.heartbeatLink()
            console.log('心跳检测成功')
          })
          .catch((re) => {
            console.log(re)
            console.log('心跳检测失败')
          })
      }, 1000 * 60 * 30)
    },
    getUserinfo () {
      this.$fetch('initRecord', { webinar_id: this.il_id })
        .then(async res => {
          console.log(res)
          if (res.code != 200) {
            return this.tipMsg = res.msg;
          }
          const resultData =  this.rootActive = res.data;
          sessionStorage.setItem('user', JSON.stringify(resultData.join_info))
          sessionStorage.setItem('vss_token', resultData.interact.paas_access_token)
          sessionStorage.setItem('roomId', resultData.interact.room_id)
          sessionStorage['vhall-vsstoken'] = resultData.interact.paas_access_token
          sessionStorage.setItem('defaultMainscreenDefinition', resultData.push_definition || '') // 不知道这个字段是干什么的,暂定和发起端一致
          sessionStorage.setItem('defaultSmallscreenDefinition', resultData.hd_definition || '') // 不知道这个字段是干什么的,暂定和发起端一致
          sessionStorage.setItem('interact_token', resultData.interact.interact_token);
          await this.getTools(resultData.interact.room_id);
          this.userInfo = resultData.join_info
          this.roomId = resultData.interact.room_id
          this.vss_token = resultData.interact.paas_access_token
          this.joinId = resultData.join_info.join_id
          this.third_party_user_id = resultData.join_info.third_party_user_id
          this.permission = resultData.permission
          this.qaStatus = resultData.qa_open || 0;  // 不知道这个字段是干什么的,暂定和发起端一致
          this.params_verify_token = resultData.interact.interact_token
          this.saas_join_id = resultData.join_info.join_id

          // 单独增加 static、upload、web  为了减少修改 // ********** 这个字段没有返回,暂定写死和发起端一致
          this.domains = {
            ...resultData.urls || {},
            ...{
              static: 'https://t-alistatic01.e.vhall.com',
              upload: 'https://t-alistatic01.e.vhall.com/upload',
              webinar: '',
              web: '//t.e.vhall.com/v3/'
            }
          };
          console.log(resultData, 88888, this.domains);
          sessionStorage.setItem('vhall_domain',JSON.stringify(this.domains));

          this.duration = resultData.webinar.live_time
          this.is_interact = resultData.webinar.mode == 3  ? 1 : 0 ; // 做一下判断 ??? mode 直播模式：1-音频、2-视频、3-互动
          this.document_id = resultData.webinar.document_id
          this.cut_record_status = 3 // 打点录制状态1录制中2暂停3结束/未录制 // ********** 这个字段没有返回,暂定 3
          this.record_notice = 4 // 设置默认回放视频提示 // ********** 这个字段没有返回,暂定 4
          this.isrecording = resultData.is_recording
          this.docLowPriority = resultData.doc_low_priority || 0; // 不知道这个字段是干什么的,暂定和发起端一致
        })
    },
    getTools(roomId){
      return new Promise((resolve, reject) => {
        this.$fetch('getToolStatus', {room_id: roomId}).then(res=>{
          if(res.code == 200){
            this.roomStatus = res.data;
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
    recordFun (data) {
      console.log('打点录制 状态数据-1', data)
      this.$fetch('record', {
        ...data,
        params_verify_token: this.params_verify_token,
        webinar_id: this.il_id
      })
    }
  }
}
</script>
<style lang="less">
.recordVideo {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  /* width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  .main-content {
    width: 100%;
    background: cyan;
  }

  .slide-content {
    width: 320px;
    background: skyblue;
  } */
}
</style>
