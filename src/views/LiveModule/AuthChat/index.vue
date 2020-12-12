<template>
  <div class="approval">
    <div class="approval-content" :class="{'off': isOpen===1}">
      <div class="approval-info">
        <p class="subject">{{webinarTitle}}</p>
        <p class="txt">消息过滤</p>
      </div>
      <div class="switch">
        <span>留言过滤</span>
        <div class="switch-bar" :class="{on: isOpen===2}" id="switch-bar" @click="switchUpdate">
          <div class="bar"></div>
        </div>
      </div>
      <div class="auto-send">
        <span>过滤设置：未审核超过200条时自动发送/阻止</span>
        <el-radio-group v-model="autoSend" @change="radioChange">
          <el-radio label="1">自动发送</el-radio>
          <el-radio label="2">自动阻止</el-radio>
        </el-radio-group>
      </div>
      <div class="approval-tab">
        <div class="tab-head">
          <span
            :class="{'tab-active': tabActive===0}"
            @click="tabClick(0)"
          >未审核（{{showMessage.length}}）</span>
          <span :class="{'tab-active': tabActive===1}" @click="tabClick(1)">已通过（{{allowNumber}}）</span>
          <span :class="{'tab-active': tabActive===2}" @click="tabClick(2)">禁言（{{bannedNumber}}）</span>
          <span :class="{'tab-active': tabActive===3}" @click="tabClick(3)">踢出（{{kickedNumber}}）</span>

          <div class="btn-group">
            <button class="butt pass" @click="messageOperate(3)">全部通过</button>
            <button class="butt stop" @click="messageOperate(4)">全部阻止</button>
          </div>
        </div>
        <div class="tab-content">
          <div class="tab-pane">
            <ul class="lists">
              <template v-if="tabActive===0">
                <li class="item" v-for="(item,ind) in showMessage" :key="ind">
                  <message :message="item"></message>
                  <div class="btn-group">
                    <!--<button class="butt pass">通过</button>-->
                    <btnBox
                      :roomInfo="roomInfo"
                      :message="item"
                      :baseChanelInfo="baseChanelInfo"
                      :roleName="roleName"
                      @fetchOperate="fetchOperate"
                    ></btnBox>
                  </div>
                </li>
              </template>
              <template v-else-if="tabActive===1">
                <li class="item" v-for="(item,ind) in allowMsgInfo" :key="ind">
                  <message :message="item"></message>
                </li>
              </template>
              <template v-else-if="tabActive===2||tabActive===3">
                <li class="item user-list" v-for="(item, ind) in specialUser" :key="ind">
                  <div class="infos">
                    <p>{{item.nick_name || item.nickname || ''}}</p>
                  </div>
                  <div class="user-btn">
                    <button class="butt" v-if="tabActive===2" @click="cancelBanned(item, 3)">取消禁言</button>
                    <button class="butt" v-if="tabActive===3" @click="cancelBanned(item, 4)">取消踢出</button>
                  </div>
                </li>
                <!--<user class="item" v-for="(item, ind) in specialUser" :user="item" :key="ind"></user>-->
              </template>
            </ul>
          </div>
          <!-- <vePagination
            v-if="pageInfo.total>pageInfo.pageSize&&tabActive!==0"
            :total="pageInfo.total"
            :pageSize="pageInfo.pageSize"
            :currentPage="pageInfo.page"
            @changePage="changePage"
            class="ve-page"
          ></vePagination> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import btnBox from './components/btn-box'
import message from './components/message'
// import vePagination from '../../components/ve-pagination'

export default {
  name: 'approval',
  components: {
    btnBox,
    message,
    // vePagination
  },
  data () {
    return {
      isOpen: 1,
      // switchTxt: 'ON',
      autoSend: '1',
      tabActive: 0,
      message: [
        { name: '未审核', value: 'not_pass' },
        { name: '已通过', value: 'passed' },
        { name: '踢出/禁言', value: 'passed' }
      ],
      activeTab: '',
      messageInfo: [],
      allowMsgInfo: [], // 通过审核的消息列表
      allowNumber: 0, // 通过的消息数
      specialUser: [], // 被踢出和禁言的消息列表
      bannedNumber: 0,
      kickedNumber: 0,
      // allowMesInfo: [],
      webinar_id: this.$route.params.id,
      roomInfo: {
        room_id: '',
        vss_token: ''
      },
      operatorId: null, // 操作人员的id
      baseChanelInfo: {
        app_id: '',
        client: 'pc_browser',
        access_token: '',
        channel_id: '',
        third_party_user_id: null, // 支持人的id
        package_check: '1.7.1'
      },
      pageInfo: {
        page: 1,
        total: 0,
        pageSize: 200
      },
      webinarTitle: '',
      createTime: '',
      roleName: ''
    }
  },
  computed: {
    showMessage () {
      return this.messageInfo.filter(item => {
        return item.isOperate === 0
      })
    }
  },
  methods: {
    // 获取房间信息，房间id /api/vss/initiator/info
    getRoomInfo () {
      let vc = this.$route.query.vc
      try {
        vc = decodeURI(vc)
      } catch (e) {
        console.error(e);
      }
      vc = vc == 'undefined' ? '' : vc

      let params = Object.assign({}, this.urlParams, {
        webinar_id: this.webinar_id,
        vc
      })
      this.$fetch('initiatorInfo', params)
        .then(res => {
          console.warn('获取到的关键信息点---', res.data);
          if(res.code != 200) return this.$message.warning(res.msg)
          this.roomInfo.room_id = res.data.interact.room_id
          this.roomInfo.vss_token = res.data.interact.paas_access_token
          if (!sessionStorage.getItem('user')) {
            sessionStorage.setItem('user', JSON.stringify(res.data.user))
          }
          this.operatorId = res.data.join_info.third_party_user_id

          this.baseChanelInfo.app_id = res.data.interact.paas_app_id, // appId 必须
          this.baseChanelInfo.third_party_user_id = res.data.join_info.third_party_user_id, // 第三方用户ID
          this.baseChanelInfo.access_token = res.data.interact.paas_access_token, // 必须， token，初始化接口获取
          this.baseChanelInfo.channel_id = res.data.interact.channel_id, // 频道id 必须
          this.webinarTitle = res.data.webinar.subject
          this.roleName = res.data.join_info.role_name
          //  res.data.created_at
          this.createTime = '2020-12-09 19:52:00'.split(' ')[0].split('-').join('/')
          console.warn(this.createTime, '--------');
          this.querySwitchInfo()
          this.queryMessage()
          this.initMsgServe()
          this.querySpecialUser(2)
          this.querySpecialUser(3)
          this.queryAllowMsg()

        })
        .catch(res => {
          console.log(res)
          this.$message({
            message: res.msg,
            type: 'error'
          })
        })
    },
    // 获取按钮的状态
    querySwitchInfo () {
      console.warn(param, '******************', this.baseChanelInfo);
      let param = {
        ...this.baseChanelInfo
      }
      this.$fetch('getChannelSwitch', param)
        .then(res => {
          console.warn(res, 'getChannelSwitch');
          this.isOpen = res.data.switch
          this.autoSend = res.data.switch_options + ''
        })
        .catch(res => {
          console.warn(res, 'cxs');
          this.$message({
            message: res.msg,
            type: 'error'
          })
        })
    },
    // 页面刷新时，获取未通过的消息列表
    queryMessage () {
      let param = {
        ...this.baseChanelInfo
      }

      console.log(param)
      this.messageInfo = []
      let tempItem = {}
      let object = {}
      let context, data
      this.$fetch('getChatAuditLists', param).then(res => {
        for (var i in res.data) {
          object = JSON.parse(res.data[i])
          context =
            typeof JSON.parse(object.context) === 'object'
              ? JSON.parse(object.context)
              : JSON.parse(JSON.parse(object.context))
          tempItem.nick_name = context.nickname || context.nick_name
          tempItem.time = object.time
          tempItem.type = object.type
          tempItem.msg_id = i
          tempItem.third_party_user_id = object.sender_id // 发送消息的人第三方id
          console.log(object.sender_id)
          tempItem.channel = object.channel
          tempItem.room_id = object.room_id
          data = JSON.parse(object.data)
          if (tempItem.type === 'text') {
            // console.log(object.data)
            tempItem.text_content = data.text_content
          } else if (tempItem.type === 'video') {
            tempItem.video_url = data.video_url
          } else if (tempItem.type === 'voice') {
            tempItem.voice_url = data.voice_url
          } else if (tempItem.type === 'image') {
            tempItem.image_urls = data.image_urls
            if (JSON.parse(object.data).hasOwnProperty('text_content')) { tempItem.text_content = JSON.parse(object.data).text_content }
          } else if (tempItem.type === 'link') {
            tempItem.link_url = JSON.parse(object.data).link_url
          }
          tempItem.isOperate = 0 // 0 未对数据操作， 1审核通过，2拒绝
          this.messageInfo.push(tempItem)
          tempItem = {}
          object = {}
        }
        console.log(this.messageInfo)
      })
      //   .catch(res => {
      //   this.$message({
      //     message: res.msg,
      //     type: 'error'
      //   })
      // })
    },
    // 获取已通过消息的列表
    queryAllowMsg () {
      let params = {
        ...this.baseChanelInfo,
        msg_type: 'image,text,link,video,voice',
        page_size: this.pageInfo.pageSize,
        curr_page: this.pageInfo.page,
        start_time: this.createTime
      }
      this.$fetch('allowMsg', params).then(res => {
        this.allowMsgInfo = res.data.list
        this.allowNumber = res.data.total
        this.pageInfo.total = res.data.total
      })
    },
    // 获取被踢出和被禁言的消息列表
    querySpecialUser (ind) {
      let params = {
        ...this.roomInfo,
        page: this.pageInfo.page,
        pageSize: this.pageInfo.pageSize
      }
      let _url = ''
      if (ind === 2) {
        _url = 'bannedList'
      } else {
        _url = 'kickedList'
      }
      this.$fetch(_url, params).then(res => {
        this.specialUser = res.data.list
        this.pageInfo.total = res.data.total
        if (ind === 2) {
          this.bannedNumber = res.data.total
        } else {
          this.kickedNumber = res.data.total
        }
      })
    },

    switchUpdate () {
      let temp = this.isOpen === 1 ? 2 : 1
      let param = {
        ...this.baseChanelInfo,
        switch: temp
      }
      this.$fetch('setChannelSwitch', param)
        .then(res => {
          this.isOpen = temp
        })
        .catch(res => {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        })
    },

    messageOperate (s, item) {
      let params = {
        ...this.baseChanelInfo
      }
      if (s === 3) {
        params.msg_id = this.showMessage.map(it => it.msg_id).join()
        params.status = 1
      } else if (s === 4) {
        params.msg_id = this.showMessage.map(it => it.msg_id).join()
        params.status = 2
      }
      this.fetchOperate(params)
    },

    fetchOperate (params) {
      if (!params.msg_id) return
      this.$fetch('applyMessageSend', params)
        .then(res => {
          if (res.code === 50014) {
            this.queryMessage()
          }
        })
        .catch(res => {
          if (res.code === 50014) {
            this.queryMessage()
          } else if (res.code === 10040) {
            this.$message({
              message: '当前无聊天消息',
              type: 'error'
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        })
    },
    radioChange (value) {
      if (this.isOpen === 1) {
        this.isOpen = 2
      }
      let param = {
        ...this.baseChanelInfo,
        switch: this.isOpen,
        switch_options: value
      }
      this.$fetch('setAutoSend', param)
        .then(res => {})
        .catch(res => {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        })
    },
    tabClick (ind) {
      this.tabActive = ind
      if (ind === 2 || ind === 3) {
        this.querySpecialUser(ind)
      } else if (ind === 1) {
        this.queryAllowMsg()
      }
    },
    initMsgServe () {
      let context = JSON.stringify({audience: true, isAuthChat: true})
      let option = {
        appId: this.baseChanelInfo.app_id, // 应用 ID ,必填
        // third_party_user_id: this.baseChanelInfo.third_party_user_id, // 第三方用户唯一标识,必填
        third_party_user_id: this.operatorId, // 使用操作人员的id初始化sdk
        token: this.baseChanelInfo.access_token, // token必填
        context: context,
        channelId: 'ck_' + this.baseChanelInfo.channel_id
      }
      let chat = null
      VhallChat.createInstance(
        option,
        msg => {
          chat = msg.message
          chat.onCustomMsg(this.customMsg)
          this.initChatServe()
        },
        err => {
          console.error(err)
        }
      )
    },
    initChatServe () {
      let context = JSON.stringify({audience: true, isAuthChat: true})
      let option = {
        appId: this.baseChanelInfo.app_id, // 应用 ID ,必填
        // third_party_user_id: this.baseChanelInfo.third_party_user_id, // 第三方用户唯一标识,必填
        third_party_user_id: this.operatorId, // 使用操作人员的id初始化sdk
        token: this.baseChanelInfo.access_token, // token必填
        context: context,
        channelId: this.baseChanelInfo.channel_id
      }
      VhallChat.createInstance(
        option,
        msg => {
          window.chatSend = msg.message
          window.chatSend.on(this.chatOnMsg)
          window.chatSend.onRoomMsg(this.chatOnMsg)
        },
        err => {
          console.error(err)
        }
      )
    },
    // 监听聊天频道自定义消息ck_
    customMsg (msg) {
      console.log(msg)
      let object = JSON.parse(msg.data)
      let context

      let operate = object.operation_status
      switch (operate) {
        case 1: // 收到新的聊天消息
          context = JSON.parse(msg.context)
          object.isOperate = 0
          object.join_id = msg.sender_id
          object.nick_name = context.nick_name || context.nickname
          this.messageInfo.push(object)
          break
        case 2: // 开启留言审核、自动阻止、自动发送
          if (
            object.third_party_user_id ===
            this.operatorId
          ) { return }
          this.isOpen = parseInt(object.switch)
          if (object.hasOwnProperty('switch_options')) {
            this.autoSend = object.switch_options + ''
          }
          break
        case 5: // 通过、全部通过、阻止、全部阻止
          // if (object.third_party_user_id === this.baseChanelInfo.third_party_user_id) return
          if (!object.hasOwnProperty('msg_id')) return
          var msgIds = object.msg_id.split(',')
          this.messageInfo.forEach(item => {
            msgIds.forEach(it => {
              if (item.msg_id === it) {
                item.isOperate = parseInt(object.status)
                if (item.isOperate === 1) {
                  this.allowNumber++
                }
              }
            })
          })
          break
        default:
          break
      }
    },
    // 监听正常频道的聊天消息
    chatOnMsg (msg) {
      console.log(msg)
      let data = JSON.parse(msg.data)
      let type = data.type
      switch (type) {
        case 'disable': // 禁言
        case 'room_kickout': // 踢出
          this.operateUser(data.target_id, type)
          break
        case 'permit': // 取消禁言
        case 'room_kickout_cancel':
          if (type === 'room_kickout_cancel') {
            this.kickedNumber--
          } else if (type === 'permit') {
            this.bannedNumber--
          }
          this.specialUser = this.specialUser.filter(item => {
            return item.account_id !== data.target_id
          })
          break
        default:
          break
      }
    },
    // 操作用户
    operateUser (id, type) {
      if (type === 'room_kickout') {
        this.kickedNumber++
      } else if (type === 'disable') {
        this.bannedNumber++
      }
      let params = {
        ...this.baseChanelInfo,
        msg_id: '',
        status: 2
      }
      this.showMessage.forEach(item => {
        if (item.third_party_user_id === id) {
          params.msg_id += item.msg_id + ','
        }
      })
      this.fetchOperate(params)
    },
    cancelBanned (item, ind) {
      console.log(item)
      let _url
      if (ind === 3) _url = 'banned'
      else _url = 'kicked'
      let params = {
        ...this.roomInfo,
        receive_account_id: item.account_id,
        status: 0
      }
      this.$fetch(_url, params).then(res => {
        if (res.code === 200) {
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
      })
    },
    changePage (num) {
      this.pageInfo.page = num
      if (this.tabActive === 1) {
        this.queryAllowMsg()
      } else if (this.tabActive === 2 || this.tabActive === 3) {
        this.querySpecialUser(this.tabActive)
      }
    },
    GetUrlData () {
      let url = window.location.href
      let theData = {}
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
    }
  },
  created () {
    let urlParams = this.GetUrlData()
    console.log(urlParams, 456)
    this.urlParams = urlParams
    this.getRoomInfo()
  }
}
</script>

<style scoped lang="less">
.approval {
  min-width: 996px;
  color: #555;
  height: 100%;
  background-color: #f3f4f8;
  overflow-y: auto;

  .approval-content {
    position: relative;
    min-width: 996px;
    width: 80%;
    margin: 0 auto 114px;
    padding: 30px 45px 52px;
    background: #fff;
    box-shadow: 0 0 12px 0 rgba(213, 197, 231, 0.5);
    border-radius: 4px;
    box-sizing: border-box;
    .approval-info {
      position: absolute;
      top: 20px;
      left: 45px;
      .subject {
        margin-bottom: 17px;
        font-size: 24px;
        color: #333;
        font-weight: 500;
      }
      .txt {
        font-size: 18px;
        color: #333;
      }
    }

    .switch {
      display: flex;
      align-items: center;
      /*margin-bottom: 20px;*/
      justify-content: flex-end;
      color: #5c5c5c !important;

      & > span {
        padding: 0 30px;
        font-size: 12px;
      }

      ::v-deep {
        .switch-bar {
          z-index: 4;
        }
      }
    }

    .auto-send {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      height: 58px;

      span {
        font-size: 14px;
        margin-right: 20px;
      }

     ::v-deep {
        .el-radio__inner {
          position: relative;
          display: inline-block;
          border: 1px solid #dcdfe6;
          border-radius: 100%;
          width: 18px;
          height: 18px;
          top: 1px;
          background-color: #fff;
          cursor: pointer;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          margin-right: -8px;

          &::after {
            width: 4px;
            height: 4px;
            border-radius: 100%;
            background-color: #fff;
            content: '';
            position: absolute;
            left: 50%;
            top: 50%;
          }
        }

        .el-radio {
          color: #606266;
          cursor: pointer;
          outline: none;
        }

        .el-radio,
        .el-radio--medium.is-bordered .el-radio__label {
          font-size: 14px;
        }

        .el-radio__input.is-checked .el-radio__inner {
          border-color: #409eff;
          background: #409eff;
        }

        .el-radio__original {
          opacity: 0;
          outline: 0;
          position: absolute;
          z-index: -1;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: 0;
        }
      }
    }

    .approval-tab {
      border: 1px solid #e2e2e2;
      position: relative;

      .tab-head {
        border-bottom: 1px solid #e2e2e2;
        position: relative;
        height: 70px;

        .btn-group {
          width: 171px;
          height: 66px;
          display: flex;
          float: right;
          margin-right: 10px;
          justify-content: space-between;
          align-items: center;
        }

        & > span {
          display: inline-block;
          height: 70px;
          line-height: 70px;
          padding: 0 8px 0 17px;
          cursor: pointer;

          &.tab-active {
            border-bottom: 4px solid #fc5659;
          }
        }
        button {
          width: 83px;
          height: 32px;
          outline: none;
          background-color: #fff;
        }

        .pass {
          background: #fc5659;
          border: 1px solid #fc5659;
          color: #fff;
          &:hover,
          &:focus,
          &.active {
            background: #fc7b78;
            border: 1px solid #fc7b78;
          }
        }
        .stop {
          border: 1px solid #d9d9d9;
          border-radius: 2px;
          outline: none;
          cursor: pointer;
          color: #666666;
          background-color: #fff;
          &:hover {
            background: #fff;
            border-color: #fc5659;
            color: #fc5659;
          }
          &:focus {
            background: #fff;
            border-color: #fc5659;
            color: #fc5659;
          }
        }
      }

      .tab-pane {
        padding: 0 42px 0 30px;
        box-sizing: border-box;
        position: relative;
        height: 624px;
        overflow: auto;

        .lists {
          position: absolute;
          /*padding-right: 42px;*/
          width: calc(100% - 42px);
          box-sizing: border-box;
        }

        .item {
          min-height: 89px;
          border-bottom: 1px solid #e2e2e2;
          display: flex;
          width: 100%;
        }
        .btn-group {
          width: 360px;
          flex-basis: 360px;
          /*flex-basis: 135px;*/
          display: flex;
          justify-content: space-between;
          align-items: center;

          .butt {
            padding: 9px 16px;
            border: 1px solid transparent;
            border-radius: 4px;
            outline: none;
            cursor: pointer;
          }

          .stop {
            background: #fff;
            border-color: #1e89e4;

            &:hover {
              border-color: transparent;
              box-shadow: 0 0 12px 0 #d5c5e7;
            }
          }

          .pass {
            background: #1e89e4;
            color: #fff;
          }
        }
      }
    }

    .switch-off {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background-color: rgba(226, 226, 226, 0.4);
      z-index: 3;
    }

    &.off {
      color: #e6e6e6 !important;
      .approval-tab {
        &:before {
          content: '';
          width: 100%;
          height: 100%;
          background: hsla(0, 0%, 100%, 0.4);
          position: absolute;
          left: 0;
          top: 0;
          z-index: 5;
        }
      }
      ::v-deep {
        color: #e6e6e6 !important;
        .el-tabs__item {
          color: #e6e6e6;

          &.is-active {
            border-bottom: 4px solid #e6e6e6;
          }
        }
        .butt {
          color: #e6e6e6;
          border: 1px solid #e6e6e6;
        }

        .el-button--primary {
          background-color: #e6e6e6;
        }

        .btn-group .butt.stop {
          border: 1px solid #e6e6e6 !important;
          color: #e6e6e6 !important;
        }

        .btn-group .butt.pass {
          background-color: #e6e6e6;
          border-color: #e6e6e6;
        }

        .tab-head > span.tab-active {
          border-bottom: 4px solid #e6e6e6;
        }
        .el-radio__input.is-checked .el-radio__inner {
          border-color: #e6e6e6;
          background: #e6e6e6;
        }

        .el-radio__input.is-checked + .el-radio__label {
          color: #e6e6e6;
        }

        .el-radio {
          color: #e6e6e6;
        }
      }
    }
  }

  .switch-bar {
    width: 44px;
    height: 22px;
    line-height: 25px;
    padding: 0 8px;
    border-radius: 100px;
    position: relative;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    cursor: pointer;
    background: #bfbfbf;
    color: #1e89e4;

    span {
      display: inline-block;
      width: 100%;
      font-size: 12px;
      text-align: right;
    }
    .bar {
      background: #fff;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      position: absolute;
      left: 3px;
      top: 2px;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.2);
    }

    &.on {
      color: #fff;
      background: #1890ff;

      span {
        text-align: left;
      }

      .bar {
        left: 23px;
      }
    }
  }
  .user-list {
    .infos {
      width: calc(100% - 240px);
      padding: 15px 0 3px;
      flex: 1;
      margin-right: 20px;
      display: flex;
      align-items: center;
      p {
        font-size: 14px;
        word-break: break-all;
        word-wrap: break-word;
        margin-bottom: 5px;
      }
    }
    .user-btn {
      display: flex;
      align-items: center;
    }
    .butt {
      width: 83px;
      height: 32px;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      outline: none;
      cursor: pointer;
      color: #666666;
      font-size: 14px;
      &:hover {
        background-color: #fc5659;
        border: 1px solid #fc5659;
        color: #fff;
      }
      &:focus {
        background-color: #fc5659;
        border: 1px solid #fc5659;
        color: #fff;
      }
    }
  }
  .ve-page {
    position: absolute;
    bottom: -31px;
    right: -11px;
  }
}
</style>
