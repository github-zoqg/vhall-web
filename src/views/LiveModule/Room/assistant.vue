<template>
  <div :class="['publish-wrap',assistantType ? 'assistantStyle':'']">
    <vhall-saas-base
      v-if="roomId"
      :joinId="joinId"
      :roomId="roomId"
      :ilId="il_id"
      :vssToken="vss_token"
      :third_party_user_id="third_party_user_id"
      :params_verify_token="params_verify_token"
      :qaStatus="qaStatus"
      :saas_join_id="saas_join_id"
      :domains="domains"
      :duration="duration"
      :permission="permission"
      :isInteract="is_interact"
      :record_notice="record_notice"
      :cut_record_status="cut_record_status"
      :documentId="document_id"
      ref="vhallSaas"
      @assistantMsg="assistantMsg"
      :recordFun="recordFun"
      :docLowPriority="docLowPriority"
      :recordTip="recordTip"
    ></vhall-saas-base>
  </div>
</template>
<script>
import VhallReport from '@vhall/report'
import { QWebChannel } from '../../../static/qwebchannel'
import chrome from './chrome'
export default {
  components: { chrome },
  data () {
    return {
      roomId: '',
      joinId: '',
      il_id: this.$route.params.il_id,
      vss_token: '',
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
      assistantType: '',
      docLowPriority: '', // 文档转换优先级
      recordTip: '', // 是否弹出默认回放弹框
      webviewType: '' // 嵌入webview类型
    }
  },

  created () {
    let urlParams = this.GetUrlData()
    console.log(urlParams)
    this.assistantToken = urlParams.assistant_token
    this.assistantType = urlParams.assistantType
    this.webviewType = urlParams.view_type
    this.getUserinfo()
  },

  mounted () {
    if (this.assistantType == 'doc' && this.webviewType == 'cef') { // 新版webview添加退出事件，（客户端内监听不到esc键）
      window.addEventListener('keydown', (e) => {
        if (e.keyCode == 27) {
          window.JsCallQtMsg(JSON.stringify({ type: 'esc', msg: true }))
        }
      })
    }
  },

  methods: {
    initAssistantMsg() {
      window.vhallSaas = this.$refs.vhallSaas
      if (this.webviewType != 'cef') {
        /* eslint-disable no-new */
        new QWebChannel(window.qt.webChannelTransport, function (channel) {
          if (channel.objects.bridge) {
            window.bridge = channel.objects.bridge
          }
        })
      }
      window.QtCallFunctionPage = _msg => {
        let msg = Number(_msg)
        this.$refs.vhallSaas.handleAssitant(msg)
      }
      // 显示/隐藏文档工具栏
      window.QtCallJsChangeDocTool = _msg => {
        let msg = Number(_msg)
        this.$refs.vhallSaas.handleAssitantDocTool(msg)
      }
      // 踢出用户回调
      window.QtCallJsKickOut = (msg, bool) => {
        this.$refs.vhallSaas.handleAssitantKickout(msg.msg, bool)
      }
      // 文档区域获取焦点
      window.QtCallDocFocus = (msg) => {
        this.$refs.vhallSaas.handleAssitantDocFocus(msg)
      }
    },
    assistantMsg (type, msg) {
      console.log('接受上下线消息', { type, msg })
      if (this.webviewType != 'cef') {
        window.bridge
          ? window.bridge.JsCallQtMsg(JSON.stringify({ type, msg })) // Join,Leave
          : console.error('此方法不存在')
      } else {
        window.JsCallQtMsg(JSON.stringify({ type, msg })) // Join,Leave
      }
    },
    GetUrlData () {
      let url = window.location.href
      /* eslint-disable no-new-object */
      let theData = new Object()
      if (url.indexOf('?') != -1) {
        let _index = -1
        if (url.indexOf('?') > url.indexOf('#/')) {
          _index = url.length
        } else {
          _index = url.indexOf('#/')
        }

        let str = url.substring(url.indexOf('?') + 1, _index)
        let strs = str.split('&')
        for (let i = 0; i < strs.length; i++) {
          theData[strs[i].split('=')[0]] = strs[i].split('=')[1]
        }
      }
      return theData
    },
    getUserinfo () {
      this.$fetch('getInfo', {
        webinar_id: this.il_id,
        assistant_token: this.assistantToken
      })
        .then(res => {
          this.userInfo = res.data.user
          this.joinId = res.data.user.join_id
          this.vss_token = res.data.vss_token
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
          sessionStorage.setItem(
            'vhall_domain',
            JSON.stringify(res.data.domains)
          )
          sessionStorage.setItem('user', JSON.stringify(res.data.user))
          sessionStorage.setItem('vss_token', res.data.vss_token)
          sessionStorage.setItem('roomId', res.data.room_id)
          sessionStorage['vhall-vsstoken'] = res.data.vss_token
          this.roomId = res.data.room_id
          this.$nextTick(() => {
            this.initAssistantMsg()
          })
          // 初始化数据上报
          this.initVHallReport(res.data)
          //   sessionStorage.setItem('vhall-vsstoken',res.data.vss_token)
        })
        .catch(err => {
          this.codeError = err.msg
          console.log('catch', err)
        })
    },
    // 打点录制
    recordFun (data) {
      console.log('打点录制 状态数据-4', data)

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
        // let service_names = null
        // if (this.roominfo.page_type == 2) {
        //   service_names = this.roominfo.is_replay == 1 ? 2 : 1
        // }
        window.vhallReport = new VhallReport({
          ...res.data,
          pf: 7,
          service_names: 1,
          env: process.env.VUE_APP_NODE_ENV === 'production' ? 'production' : 'test'
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
  &.assistantStyle {
    min-width: auto;
  }
}

// .header {
//   position: relative;
//   z-index: 1;
//   width: 100%;
//   height: 50px;
//   line-height: 50px;
//   background: #36383f;
//   box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.68);
//   .goto-watch {
//     float: right;
//     button {
//       margin-right: 20px;
//       width: 70px;
//       height: 30px;
//       border-radius: 15px;
//     }
//   }
//   .title {
//     font-family: @fontRegular;
//     font-size: 16px;
//     color: #b8bbca;
//     // width:360px;
//     min-width: 300px;
//     height: 50px;
//     text-align: center;
//     margin: 0 auto;
//   }
// }

// .main-section {
//   height: 100%;
//   box-sizing: border-box;
//   margin-top: -50px;
//   padding-top: 50px;
//   position: relative;
//   .strong-section {
//     position: relative;
//     padding-right: 310px;
//   }
//   .slim-section {
//     z-index: 1;
//     width: 310px;
//     position: absolute;
//     top: 50px;
//     right: 0;
//     bottom: 0;
//     background: #2a2b31;
//     border-left: 1px solid #3a3a48;
//   }
//   // 视频播放区域
//   .local-video-box {
//     background: url("../../assets/images/publish/local-video-camera.png")
//       no-repeat;
//     background-color: #23232b;
//     background-size: 72px 54px;
//     background-position: center;
//     transition: 0.3s;
//     text-align: center;
//     margin: 0 auto;
//     width: 100%;
//     height: 175px;
//     font-size: 16px;
//     color: #b8bbca;
//     img {
//       vertical-align: middle;
//     }
//     .no-video-tip {
//       width: 100%;
//       height: 100%;
//       text-align: center;
//       margin: 0 auto;
//       padding-top: 82px;
//       box-sizing: border-box;
//     }
//     &:hover {
//       .action-box {
//         display: flex;
//       }
//     }
//     .action-box {
//       display: none;
//       width: 100%;
//       height: 100%;
//       position: absolute;
//       top: 0;
//       font-size: 0;
//       text-align: center;
//       background: rgba(0, 0, 0, 0.5);
//       // z-index:9999;
//       z-index: 99;
//       justify-content: center;
//       align-items: center;
//       // border: 1px solid #1E89E4;
//       .camera-icon {
//         display: inline-block;
//         width: 32px;
//         height: 32px;
//         background: url("../../assets/images/publish/enable-camera-icon.png")
//           no-repeat;
//         background-size: 32px 32px;
//         vertical-align: middle;
//         margin-right: 30px;
//         cursor: pointer;
//         // margin-top: 24%;
//         // @media (max-width: 1366px){
//         //     width:31.86px;
//         //     height:31.86px;
//         //     background-size: 31.86px 31.86px;
//         //     margin-right: 40px;
//         // }
//         &.disable {
//           background: url("../../assets/images/publish/disable-camera-icon.png")
//             no-repeat;
//           background-size: 32px 32px;
//           // @media (max-width: 1366px){
//           //     background-size: 31.86px 31.86px;
//           // }
//         }
//       }
//       .mic-icon {
//         width: 32px;
//         height: 32px;
//         background: url("../../assets/images/publish/enable-mic-icon.png")
//           no-repeat;
//         background-size: 32px 32px;
//         display: inline-block;
//         vertical-align: middle;
//         cursor: pointer;
//         // margin-top: 24%;
//         // @media (max-width: 1366px){
//         //     width:31.86px;
//         //     height:31.86px;
//         //     background-size: 31.86px 31.86px;
//         // }
//         &.disable {
//           background: url("../../assets/images/publish/disable-mic-icon.png")
//             no-repeat;
//           background-size: 32px 32px;
//           // @media (max-width: 1366px){
//           //     background-size: 31.86px 31.86px;
//           // }
//         }
//       }
//     }
//   }
//   // 用户消息
//   .chat-and-user-list {
//     .chat-tabs {
//       height: 40px;
//       background: #3a3a48;
//       border-bottom: 1px solid #3a3a48;
//       &.chat {
//         & > .chat-tabs-inner-box > .tabs-chat {
//           color: #fff;
//         }
//         & > .blue-bar {
//           margin-left: 56px;
//         }
//         & ~ .chat-area {
//           display: block;
//         }
//         & ~ .interaction-area {
//           display: none;
//         }
//       }
//       &.list {
//         & > .chat-tabs-inner-box > .tabs-list {
//           color: #fff;
//         }
//         & > .chat-tabs-inner-box > .tabs-chat {
//           color: #b8bbca;
//         }
//         & > .blue-bar {
//           width: 75px;
//           margin-left: 197px;
//         }
//         & ~ .chat-area {
//           display: none;
//         }
//         & ~ .interaction-area {
//           display: block;
//         }
//       }
//       .chat-tabs-inner-box {
//         padding-left: 4px;
//         a {
//           display: inline-block;
//           font-size: 14px;
//           color: #b8bbca;
//           height: 40px;
//           line-height: 40px;
//           text-align: center;
//           width: 49%;
//         }
//         background: #2a2b31;
//         .tabs-chat {
//           color: #fff;
//         }
//         .tabs-list {
//         }
//       }
//       .blue-bar {
//         position: absolute;
//         width: 48px;
//         height: 3px;
//         background: #1e89e4;
//         margin-top: -1px;
//         transition: 0.2s;
//         margin-left: 56px;
//       }
//     }
//     .chat-area {
//       padding-top: 12px;
//       transition: 0.3s;
//       // height:566px;
//       position: relative;
//       .chat-audit {
//         position: absolute;
//         top: 12px;
//         right: 0;
//         width: 50px;
//         height: 38px;
//         background-image: url("../../assets/images/publish/auditing.png");
//         background-repeat: no-repeat;
//         background-size: 24px 24px;
//         background-position: center top;
//         &:hover {
//           background-image: url("../../assets/images/publish/auditing-hover.png");
//         }
//         // line-height: 36px;
//         // background: #5A3986;
//         // color:#fff;
//         // text-align: center;
//         // border-radius:4px;
//       }
//       .msg-items {
//         overflow: scroll;
//         // height:562px;
//         // 总高度减去头部、视频、聊天tab栏、打字区域高度和12的padding
//         // height:calc(100vh - 50px - 175px - 40px - 58px - 13px);
//         // 总高度减去头部、视频、聊天tab栏、打字区域高度和12的padding
//         height: calc(100vh - 50px - 175px - 40px - 58px - 48px - 13px);
//         position: sticky;
//         .message-card {
//           padding: 8px 14px 8px 20px;
//           .msg-user-pic {
//             float: left;
//             min-height: 30px;
//             position: relative;
//             height: 100%;
//             .pic {
//               background: #1e89e4;
//               color: #fff;
//               text-align: center;
//               width: 30px;
//               height: 30px;
//               line-height: 30px;
//               font-size: 14px;
//               border-radius: 50%;
//               cursor: default;
//             }
//             .actions {
//               display: none;
//               width: 118px;
//               height: auto;
//               background: #36383f;
//               border: 1px solid #505061;
//               border-radius: 4px;
//               position: absolute;
//               color: #b8bbca;
//               font-size: 12px;
//               margin-top: 6px;
//               z-index: 1;
//               padding: 6px 0;
//               &.actions-top {
//                 top: -6px;
//                 transform: translate3d(0, -100%, 0);
//               }
//               &.actions-bottom {
//                 top: 24px;
//               }
//               div {
//                 height: 34px;
//                 line-height: 34px;
//                 text-align: center;
//                 cursor: pointer;
//                 &:hover {
//                   color: #ffffff;
//                   background: #51535a;
//                 }
//               }
//             }
//           }
//           .msg-text-content {
//             margin-left: 36px;
//             font-size: 12px;
//             .name {
//               color: #1e89e4;
//             }
//             .content {
//               font-size: 12px;
//               color: #b8bbca;
//               word-break: break-all;
//             }
//           }
//           .clear {
//             clear: both;
//           }
//         }
//         .message-card:nth-child(2n + 1) {
//           & > .msg-user-pic > .pic {
//             background: #ef5353;
//           }
//           & > .msg-text-content > .name {
//             color: #ef5353;
//           }
//         }
//         .message-card:nth-child(3n + 2) {
//           & > .msg-user-pic > .pic {
//             background: #53ef64;
//           }
//           & > .msg-text-content > .name {
//             color: #53ef64;
//           }
//         }
//         .message-card:nth-child(5n + 3) {
//           & > .msg-user-pic > .pic {
//             background: #ff9845;
//           }
//           & > .msg-text-content > .name {
//             color: #ff9845;
//           }
//         }
//         .message-card:nth-child(6n + 4) {
//           & > .msg-user-pic > .pic {
//             background: #ff45f1;
//           }
//           & > .msg-text-content > .name {
//             color: #ff45f1;
//           }
//         }
//       }

//       .chat-message-input {
//         padding: 50px 12px 12px;
//         height: 106px;
//         box-sizing: border-box;
//         background: #2a2b31;
//         border-top: 1px solid #3a3a48;
//         position: relative;
//         .input-box {
//           border-radius: 100px;
//           margin: 0 auto;
//           height: 34px;
//           line-height: 34px;
//           background: #303138;
//           input {
//             background: transparent;
//             font-size: 12px;
//             color: #b8bbca;
//             padding: 8px 12px;
//             border: none;
//             border-radius: 4px;
//             outline: none;
//             height: 34px;
//             line-height: 34px;
//             width: 226px;
//             box-sizing: border-box;
//             &:focus + button {
//               background: #1e89e4;
//               color: #fff;
//               &:hover {
//                 background: #37a0f9;
//               }
//             }
//           }
//           button {
//             float: right;
//             background: #6e8ca5;
//             color: #b6c5d2;
//             width: 60px;
//             height: 34px;
//             font-size: 14px;
//             border-radius: 100px;
//             border-top-left-radius: 0px;
//             border-bottom-left-radius: 0px;
//             &:active {
//               background: #1b7aca;
//             }
//           }
//         }
//       }
//     }
//     .interaction-area {
//       transition: 0.3s;
//       .interaction-users {
//         height: 299px;
//         @media (max-width: 1366px) {
//           height: 201px;
//         }
//         padding-left: 30px;
//         overflow: scroll;
//         .user-item {
//           height: 24px;
//           margin-top: 18px;
//           font-size: 0px;
//           @media (max-width: 1366px) {
//             // height:17.92px;
//             // margin-top:13.27px;
//           }
//           color: #b8bbca;
//           span {
//             margin-right: 0px;
//             font-size: 12px;
//             display: inline-block;
//             width: 60px;
//             text-overflow: ellipsis;
//             white-space: nowrap;
//             overflow: hidden;
//             margin-right: 0px;
//             vertical-align: middle;
//             @media (max-width: 1366px) {
//               // width: 60px;
//               // font-size:12px;
//             }
//           }
//           button {
//             vertical-align: middle;
//             margin-left: 4px;
//             font-size: 12px;
//             min-width: 62px;
//             @media (max-width: 1366px) {
//               // margin-left:5px;
//             }
//           }
//         }
//       }
//       .middle-line {
//         height: 20px;
//         line-height: 20px;
//         @media (max-width: 1366px) {
//           height: 13.27px;
//           line-height: 13.27px;
//         }
//         text-align: center;
//         .left-line {
//           width: 88px;
//           height: 1px;
//           background-image: linear-gradient(
//             -90deg,
//             #3a3a48 0%,
//             rgba(58, 58, 72, 0) 100%
//           );
//           display: inline-block;
//           margin-bottom: 4px;
//           @media (max-width: 1366px) {
//             width: 104.87px;
//             margin-bottom: 2.65px;
//           }
//         }
//         .text {
//           font-size: 14px;
//           color: #6b6c7e;
//           display: inline-block;
//           margin: 0 6px;
//           @media (max-width: 1366px) {
//             margin: 0 3.98px;
//           }
//         }
//         .right-line {
//           width: 88px;
//           height: 1px;
//           background-image: linear-gradient(
//             -90deg,
//             rgba(58, 58, 72, 0) 0%,
//             #3a3a48 100%
//           );
//           display: inline-block;
//           margin-bottom: 4px;
//           @media (max-width: 1366px) {
//             width: 104.87px;
//             margin-bottom: 2.65px;
//           }
//         }
//       }
//       .black-list {
//         padding-bottom: 22px;
//         background: #2a2b31;
//         // height:442px;
//         overflow: scroll;
//         @media (max-width: 1366px) {
//           padding-bottom: 14.6px;
//         }
//       }
//     }
//   }
// }
</style>
