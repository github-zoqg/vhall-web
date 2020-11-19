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
    ></vhall-record-saas>
  </div>
</template>
<script>
import { browserSupport } from '../../utils/getBrowserType'
import chrome from './chrome'
export default {
  components: { chrome },
  data () {
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
      downloadChrome: !browserSupport(),
      docLowPriority: '', // 文档转换优先级
      isrecording: 0 // 是否录制中
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
      this.$fetch('getInfo', { webinar_id: this.il_id })
        .then(res => {
          if (res.code != 200) {
            window.location.href = '//t.e.vhall.com/auth/login'
          }
          this.userInfo = res.data.user
          this.roomId = res.data.room_id
          this.vss_token = res.data.vss_token
          this.joinId = res.data.user.join_id
          this.third_party_user_id = res.data.user.third_party_user_id
          this.permission = res.data.permission
          this.qaStatus = res.data.qa_open
          this.params_verify_token = res.data.params_verify_token
          this.saas_join_id = res.data.user.saas_join_id
          this.domains = res.data.domains
          this.duration = res.data.live_time
          this.is_interact = res.data.is_interact
          this.document_id = res.data.document_id
          this.cut_record_status = res.data.cut_record_status
          this.record_notice = res.data.record_notice // 设置默认回放视频提示
          this.isrecording = res.data.is_recording
          sessionStorage.setItem('user', JSON.stringify(res.data.user))
          sessionStorage.setItem('vss_token', res.data.vss_token)
          sessionStorage.setItem('roomId', res.data.room_id)
          sessionStorage['vhall-vsstoken'] = res.data.vss_token
          this.docLowPriority = res.data.doc_low_priority
          sessionStorage.setItem('defaultMainscreenDefinition', res.data.push_definition || '')
          sessionStorage.setItem('defaultSmallscreenDefinition', res.data.hd_definition || '')
        })
    },
    // 打点录制
    recordFun (data) {
      console.log('打点录制 状态数据', data)
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
