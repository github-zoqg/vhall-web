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
      :isEmbed="true"
      :docLowPriority="docLowPriority"
      :recordTip="recordTip"
    ></vhall-saas>
  </div>
</template>
<script>
import VhallReport from '@vhall/report'
import { browserSupport } from '../../utils/getBrowserType'
import chrome from './chrome'
import tip from './tip'
export default {
  components: { chrome, tip },
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
      userInfo: {},
      downloadChrome: !browserSupport(),
      docLowPriority: '', // 文档转换优先级
      recordTip: '', // 是否弹出默认回放弹框
      tipMsg: '' // info接口返回的错误信息
    }
  },

  created () {
    // this.$set(this.userInfo, 'token', 'vhall');
    // this.getInav();
    if (!browserSupport()) return
    this.getUserinfo()
  },

  mounted () {},

  methods: {
    getUserinfo () {
      this.$fetch('getInfo', { webinar_id: this.il_id, ...this.$route.query })
        .then(res => {
          if (res.code != 200) {
            // eslint-disable-next-line no-return-assign
            return this.tipMsg = res.msg
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
          this.docLowPriority = res.data.doc_low_priority
          this.recordTip = res.data.record_tip
          sessionStorage.setItem('user', JSON.stringify(res.data.user))
          sessionStorage.setItem('vss_token', res.data.vss_token)
          sessionStorage.setItem('roomId', res.data.room_id)
          sessionStorage['vhall-vsstoken'] = res.data.vss_token
          sessionStorage.setItem('defaultMainscreenDefinition', res.data.push_definition || '')
          sessionStorage.setItem('defaultSmallscreenDefinition', res.data.hd_definition || '')
          this.initVHallReport(res.data)
        })
        .catch(err => {
          this.codeError = err.msg
          console.log('catch', err)
        })
    },
    // 打点录制
    recordFun (data) {
      console.log('打点录制 状态数据-3', data)

      this.$fetch('record', {
        ...data,
        params_verify_token: this.params_verify_token,
        webinar_id: this.il_id
      })
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
        })
      })
    }
  }
}
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

</style>
