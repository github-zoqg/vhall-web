<template>
  <div :class="['chooseWay', { 'no-login': executeType !== 'ctrl' }]">
    <OldHeader
      :is-show-login="false"
      class="old-header"
      v-if="executeType !== 'ctrl' && arr[1] != 1 && arr[1] != 2"
      scene="chooseWay"
      :isWhiteBg="executeType !== 'ctrl'"
    ></OldHeader>
    <pageTitle
      :pageTitle="arr[1] == 1 ? '选择发起方式' : '选择进入方式'"
      v-if="executeType === 'ctrl'"
    ></pageTitle>
    <div class="choose__way__main">
      <div class="choose__way__ctx">
        <h1 class="choose-method" v-if="executeType !== 'ctrl'">
          {{ arr[1] == 1 ? '选择发起方式' : '选择进入方式' }}
        </h1>
        <div class="select-way">
          <div
            class="choose-p choose-a-way"
            :class="chooseType === 'browser' ? 'active' : 'choose-a-way'"
            @click.prevent.stop="changeChoose('browser')"
          >
            <div class="choose-img">
              <img src="../../common/images/live/app.png" alt="" />
            </div>
            <p class="f-20">网页发起</p>
            <p>一键发起直播，无需安装客户端</p>
          </div>
          <!-- <div class="interact_select choose-a-way">

            <p class="choose-p"></p>
            <p class="f-20">网页发起互动直播</p>
            <p>可进行多人连麦</p>
            <p>需要使用chrome浏览器</p>
          </div> -->
          <div
            class="choose-p choose-a-way"
            :class="[
              chooseType === 'client' ? 'client active' : 'choose-a-way',
              groupLiveStatus ? 'no-hover' : '',
            ]"
            @click.prevent.stop="changeChoose('client')"
          >
            <div v-if="groupLiveStatus" class="delay-mask">
              {{ groupLiveStatus ? '分组直播暂不支持此方式发起' : '' }}
            </div>
            <div class="choose-img">
              <img src="../../common/images/live/net.png" alt="" />
            </div>
            <p class="f-20">客户端发起</p>
            <p>需安装客户端、支持多种视频采集卡、插入视频等功能</p>
          </div>
          <!-- <div class="choose-a-way other vip">
            <p class="choose-p"></p>
            <p class="f-20"><label style="font-weight: 400">第三方推流方式/工具发起</label></p>
            <p>通过第三方软件实现多样化的推流方式</p>
            <p>拥有更强的扩展性</p>
          </div> -->
        </div>
        <div class="choose-btn">
          <el-button
            type="primary"
            round
            @click="goLive(2)"
            class="length152"
            v-preventReClick
            >{{ arr[1] == 1 ? '发起直播' : '进入直播' }}</el-button
          >
          <iframe
            src=""
            class="hide"
            frameborder="0"
            scrolling="no"
            id="start_live"
          ></iframe>
        </div>
        <div
          :class="['v-download', { css: executeType === 'ctrl' }]"
          v-if="chooseType === 'client' && downloadUrl"
        >
          客户端启动遇到问题？您可以尝试：<a target="_blank" :href="downloadUrl"
            >下载客户端</a
          >
          联系客服：400-888-9970
        </div>
      </div>
    </div>
    <el-dialog
      title="云导播推流方式"
      :visible.sync="dialogDirectorVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="480px"
    >
      <div class="director-dialog director-types-dialog">
        <div class="director-types-boxs">
          <div
            class="director-box"
            :class="{ active: selectDirectorMode === 1 }"
            @click.stop="handleSelectDirectorMode(1)"
          >
            <div class="avatar">
              <img
                src="../../common/images/icon/vh-saas-color-Video.png"
                alt=""
              />
            </div>
            <div>
              <div class="title">以主持人身份发起直播</div>
              <div class="desc">以主持人身份进入直播间，发起并管理直播</div>
            </div>
          </div>
          <div
            class="director-box"
            :class="{
              active: selectDirectorMode === 2,
              closeDirectorStatus: !directorStatus,
            }"
            @click.stop="handleSelectDirectorMode(2)"
          >
            <div class="avatar">
              <img
                src="../../common/images/icon/vh-saas-color-mixer-on.png"
                alt=""
              />
            </div>
            <div class="info">
              <div class="title">以视频推流形式推流到云导播</div>
              <div class="desc">仅将云导播视频流推到直播间</div>
            </div>
            <div class="corner" v-if="!directorStatus">未开启云导播台</div>
          </div>
        </div>
        <el-button
          type="primary"
          round
          @click="openLive"
          class="btn"
          v-preventReClick
          >确认</el-button
        >
      </div>
    </el-dialog>
    <el-dialog
      title="选择推流机位"
      :visible.sync="dialogDirectorSeatVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      width="480px"
    >
      <div class="director-dialog director-seats-dialog">
        <div class="director-seats-boxs">
          <div
            class="director-seats-box"
            v-for="item of seatList"
            :key="item.seat_id"
            @click="selectSeat(item)"
            :class="{
              used: item.status === 1,
              selected: curSelected === item.seat_id,
            }"
          >
            {{ item.name }}
            <div class="corner" v-if="item.status === 1">已占用</div>
          </div>
        </div>
        <el-button
          type="primary"
          round
          :disabled="!curSelected"
          @click="toDirector"
          class="btn"
          v-preventReClick
          >确认</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle'
import { sessionOrLocal, getQueryString } from '@/utils/utils'
import OldHeader from '@/components/OldHeader'
import Env from '@/api/env'
import { v1 as uuidV1 } from 'uuid'

export default {
  name: 'chooseWay.vue',
  components: {
    PageTitle,
    OldHeader,
  },
  data() {
    return {
      chooseType: 'browser',
      scheme: '',
      schemeUrl: '',
      watchUrl: '',
      arr: [],
      browserStatus: false,
      clientOpen: '',
      executeType: 'ctrl', // 是否控制台 ctrl 控制台
      downloadUrl: '',
      delayStatus: 0,
      hasDelayPermission: false,
      groupLiveStatus: 0,
      gray_id: null,
      dialogDirectorVisible: false,
      is_director: false,
      directorStatus: false, //云导播台开启状态
      seatList: [], //机位列表
      selectDirectorMode: 1,
      dialogDirectorSeatVisible: false,
      curSelected: null,
      userId: '',
    }
  },
  beforeCreate() {
    const { liveT, visitorId } = this.$route.query
    liveT && sessionOrLocal.removeItem('live_token', liveT)
    visitorId && sessionOrLocal.removeItem('visitorId', visitorId)
  },
  computed: {
    // admin无云导播活动权限
    webinarDirector() {
      //  webinar.director 1:有无延迟权限  0:无权限
      const configInfo = JSON.parse(
        sessionOrLocal.get('SAAS_VS_PES', 'localStorage')
      )
      if (configInfo && configInfo['webinar.director'] == '1') {
        return true
      } else {
        return false
      }
    },
  },
  async created() {
    this.executeType = this.$route.query.type
    if (this.executeType === 'ctrl') {
      // 控制台，清除live_tokend等数据
      sessionOrLocal.removeItem('live_token', 'localStorage')
    }
    // 动态获取 下载客户端地址 + 启动PC客户端应用程序地址命令
    let _data = this.$route.params
    this.arr = [_data.str, _data.role]
    await this.initGrayBefore()
    this.getRoleUrl()
    this.getDownloadUrl()
    this.getLiveBaseInfo()
  },
  methods: {
    initGrayBefore() {
      return this.$fetch('initGrayBefore', {
        webinar_id: this.$route.params.str,
      })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.gray_id = res.data.user_id
          } else {
            console.log(`灰度ID-获取用户by用户信息失败~${res.msg}`)
            this.gray_id = null
          }
        })
        .catch((e) => {
          console.log(`灰度ID-获取用户by用户信息失败~${e}`)
          this.gray_id = null
        })
    },
    getLiveBaseInfo() {
      // webinar/info调整-与活动状态无关的调用
      this.$fetch(
        'getWebinarInfo',
        { webinar_id: this.$route.params.str },
        {
          'gray-id': this.gray_id,
        }
      )
        .then((res) => {
          if (res.code == 200) {
            this.delayStatus = res.data.no_delay_webinar
            // 是否分组直播
            this.groupLiveStatus = res.data.webinar_type == 6
            //是否云导播
            this.is_director = res.data.is_director === 1
          }
        })
        .catch((res) => {
          console.log(res)
        })
    },
    getLiveDirectorStatus() {
      return this.$fetch('getLiveDirectorStatus', {
        webinar_id: this.$route.params.str,
      })
        .then((res) => {
          if (res.code == 200) {
            //云导播台是否开启
            this.directorStatus = res.data.director_status === 1
          }
        })
        .catch((res) => {
          console.log(res)
        })
    },
    getLiveDirectorSeatList() {
      return this.$fetch('getLiveDirectorSeatList', {
        webinar_id: this.$route.params.str,
      })
        .then((res) => {
          if (res.code == 200) {
            //云导播台是否开启
            this.seatList = res.data.list || []
          }
        })
        .catch((res) => {
          console.log(res)
        })
    },
    getDownloadUrl() {
      this.$fetch(
        'getPCDownloadUrl',
        {
          source: 'assistant',
        },
        {
          platform:
            this.executeType === 'ctrl'
              ? sessionOrLocal.get('platform', 'localStorage') || 17
              : 7,
          'gray-id': this.gray_id,
        }
      ).then((res) => {
        this.downloadUrl = res.data.download_link
      })
    },
    changeChoose(type) {
      if (this.groupLiveStatus) return
      this.chooseType = type
    },
    goLive(origin = 1) {
      if (
        this.chooseType !== 'client' &&
        this.webinarDirector &&
        this.is_director &&
        origin != 1
      ) {
        Promise.resolve(this.getLiveDirectorStatus()).then((res) => {
          this.selectDirectorMode = 1
          this.dialogDirectorVisible = true
        })
      } else {
        if (this.chooseType !== 'client') {
          // 浏览器检测 => 若失败，跳转浏览器效果页；若成功，跳转观看页
          this.$fetch(
            'checkLive',
            this.$params({
              webinar_id: this.arr[0],
            }),
            {
              platform:
                this.executeType === 'ctrl'
                  ? sessionOrLocal.get('platform', 'localStorage') || 17
                  : 7,
              'gray-id': this.gray_id,
            }
          )
            .then((res) => {
              if (res && res.code === 200) {
                /*  this.$router.push({
                path: this.watchUrl
              }) */
                if (this.selectDirectorMode === 1) {
                  //云导播选择以主持人身份发起直播 确认进入直播间
                  this.$vhall_paas_port({
                    k: 100839,
                    data: {
                      business_uid: this.userId,
                      user_id: '',
                      webinar_id: this.arr[0],
                      refer: '',
                      s: '',
                      report_extra: {},
                      ref_url: '',
                      req_url: '',
                    },
                  })
                }
                console.error(this.watchUrl)
                window.location.href = this.watchUrl
              }
            })
            .catch((res) => {
              this.$message({
                message: res.msg || '检测异常',
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box',
              })
              console.log(res)
            })
        } else {
          // 客户端启动
          document.querySelector('#start_live').setAttribute('src', this.scheme)
          document.querySelector('#start_live').click()
        }
      }
    },
    getRoleUrl() {
      // 获取当前用户角色 1-主持人，2-嘉宾 ，3-助理
      let params = {
        webinar_id: this.arr[0],
        type: this.arr[1],
        live_token:
          Number(this.arr[1]) !== 1
            ? sessionOrLocal.get('liveToken', 'localStorage')
            : '',
      } // 若非主持人登录，需传递用户token
      if (
        location.search.includes('liveT') &&
        params.live_token != '' &&
        getQueryString('liveT')
      ) {
        params.live_token = getQueryString('liveT')
      }
      this.$fetch('getJoinUrl', this.$params(params), {
        platform:
          this.executeType === 'ctrl'
            ? sessionOrLocal.get('platform', 'localStorage') || 17
            : 7,
        'gray-id': this.gray_id,
      })
        .then((res) => {
          if (res && res.code === 200) {
            // this.watchUrl = res.data.page_url;
            this.scheme = res.data.client_protocol
          }
        })
        .catch((res) => {
          this.$message({
            message: res.msg || '当前未获取到启动数据',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box',
          })
          console.log(res)
        })
    },
    userLogoGet() {
      this.$fetch(
        'userLogoGet',
        {
          home_user_id:
            this.$route.meta.type === 'owner'
              ? sessionOrLocal.get('userId')
              : this.$route.params.str,
        },
        {
          platform:
            this.executeType === 'ctrl'
              ? sessionOrLocal.get('platform', 'localStorage') || 17
              : 7,
          'gray-id': this.gray_id,
        }
      )
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {})
    },
    // 获取标记 logo 主办方信息
    getSignInfo() {
      return this.$fetch(
        'watchInterGetWebinarTag',
        {
          webinar_id: this.$route.params.id,
        },
        {
          platform:
            this.executeType === 'ctrl'
              ? sessionOrLocal.get('platform', 'localStorage') || 17
              : 7,
          'gray-id': this.gray_id,
        }
      ).then((res) => {
        if (res.data) {
          this.signInfo = res.data
        }
      })
    },
    //选择导播模式 1：主持人         2：视频推流云导播
    handleSelectDirectorMode(mode) {
      if (!this.directorStatus) return
      this.selectDirectorMode = mode
    },
    openLive() {
      if (this.selectDirectorMode === 2) {
        Promise.resolve(this.getLiveDirectorSeatList()).then((res) => {
          this.dialogDirectorSeatVisible = true
          this.dialogDirectorVisible = false
          this.curSelected = null
        })
      } else {
        this.goLive(1)
      }
    },
    selectSeat(info) {
      if (info.status === 1) return
      this.curSelected = info.seat_id
    },
    toDirector() {
      if (this.curSelected == null) {
        this.$message({
          message: '请选择机位',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box',
        })
        return
      }
      const uuid = uuidV1()
      this.$fetch('setLiveDirectorSeat', {
        webinar_id: this.$route.params.str,
        seat_id: this.curSelected,
        uuid: uuid,
      }).then((res) => {
        if (res.code === 515000) {
          this.$message({
            message: '机位被占用',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box',
          })
        } else if (res.code === 200) {
          if (this.selectDirectorMode === 1) {
            //云导播选择以视频推流到云导播 确认进入视频推流页面
            this.$vhall_paas_port({
              k: 100840,
              data: {
                business_uid: this.userId,
                user_id: '',
                webinar_id: this.arr[0],
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: '',
              },
            })
          }
          let arr = this.seatList.filter((e) => {
            return e.seat_id === this.curSelected
          })
          if (arr.length) {
            let seat_name = arr[0].name
            //跳转推流页
            window.location.href = `${process.env.VUE_APP_WEB_URL}/lives/yun/${this.$route.params.str}?seat_id=${this.curSelected}&seat_name=${seat_name}&uuid=${uuid}`
          }
        }
      })
    },
  },
  mounted() {
    console.warn('最终的url', location.search == '', location.search)
    if (location.search == '') {
      this.watchUrl = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/lives/room/${this.arr[0]}`
    } else {
      this.watchUrl = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/lives/room/${this.arr[0]}${location.search}`
    }
    const checkInfo = JSON.parse(
      sessionOrLocal.get('WEBINAR_PES', 'localStorage')
    )
    if (checkInfo) {
      // 无延迟发起
      this.hasDelayPermission =
        checkInfo['no.delay.webinar'] && checkInfo['no.delay.webinar'] == 1
          ? true
          : false
    }
    this.userId = JSON.parse(sessionOrLocal.get('userId'))
  },
}
</script>

<style lang="less" scoped>
@import '../../common/css/common.less';
.chooseWay {
  background: #f7f7f7;
  height: 100%;
  &.no-login {
    .choose__way__main {
      width: 900px;
      margin: 122px auto;
    }
  }
}
.choose__way__main {
  width: 850px;
  margin: 122px auto;
}
@media (max-width: 1366px) {
  .choose__way__main {
    margin: 60px auto 122px;
  }
}
.old-header {
  margin-bottom: 40px;
}
.choose-method {
  text-align: left;
  font-weight: bold;
  font-size: 22px;
  color: #1a1a1a;
  margin-bottom: 40px;
}
.select-way {
  display: flex;
  align-items: center;
  justify-content: space-around;
  // text-align: center;
}
.choose-a-way {
  // display: inline-block;
  // margin: 0 24px 0 0;
  width: 400px;
  height: 220px;
  background: #fff;
  border: 1px solid transparent;
  text-align: center;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease-in;
  p {
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: #666666;
    line-height: 20px;
    &.f-20 {
      padding-top: 6px;
      text-align: center;
      padding-bottom: 12px;
      color: #1a1a1a;
    }
  }
  .choose-img {
    width: 56px;
    height: 46px;
    margin: auto;
    margin-top: 55px;
    // text-align: center;
    img {
      width: 100%;
      height: 100%;
      object-fit: scale-down;
    }
  }
  .choose-p {
    // border-radius: 2px;
    // background: #fff;
    // background-size: 200px;
    // position: relative;
    position: relative;
  }
  &:hover {
    box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08),
      0px 2px 4px 0px rgba(0, 0, 0, 0.02);
    // border: 1px solid #FB3A32;
  }
  &.active {
    border: 1px solid #fb3a32;
    box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08),
      0px 2px 4px 0px rgba(0, 0, 0, 0.02);
  }
}
.no-hover:hover {
  cursor: unset;
}
.choose-btn {
  text-align: center;
  margin-top: 32px;
  iframe {
    display: none !important;
  }
}
.v-download {
  text-align: center;
  display: block;
  font-size: 14px;
  font-family: '-apple-system', 'BlinkMacSystemFon', 'Helvetica Neue', Helvetica,
    'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial,
    sans-serif;
  font-weight: 400;
  color: #666666;
  line-height: 20px;
  // margin-top: calc(100% - 450px);
  position: fixed;
  bottom: 24px;
  left: calc(50% - 220px);
  a {
    color: @default--normal;
    cursor: pointer;
    /*&:hover {
      color: @default--hover;
    }*/
  }
  &.css {
    left: unset;
    width: 850px;
  }
}
.delay-mask {
  position: absolute;
  width: 400px;
  height: 220px;
  background: rgba(0, 0, 0, 0.5);
  text-align: center;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 220px;
  border-radius: 4px;
  &:hover {
    cursor: unset;
  }
}
.director-dialog {
  padding-bottom: 24px;

  .btn {
    width: 160px;
    height: 40px;
    background: #fb3a32;
    border-radius: 20px;
    margin: 24px auto 0;
    display: block;
  }
}
.director-types-dialog {
  .director-types-boxs {
    .director-box {
      width: 416px;
      height: 80px;
      background: #f2f2f2;
      border: 1px solid #f2f2f2;
      border-radius: 4px;
      display: flex;
      align-items: center;
      padding: 0 32px;
      margin-bottom: 16px;
      cursor: pointer;

      &.active {
        border: 1px solid #fb3a32;
        background-color: #fff;
        box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08),
          0px 2px 4px 0px rgba(0, 0, 0, 0.02);
      }
      &.closeDirectorStatus {
        position: relative;

        .avatar,
        .info {
          opacity: 0.3;
        }
        .corner {
          height: 18px;
          background: #999999;
          border-radius: 0px 12px 0px 4px;
          position: absolute;
          padding: 0 4px;
          left: 0;
          bottom: 0;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #ffffff;
          line-height: 17px;
        }
      }
      .avatar {
        margin-right: 24px;

        img {
          width: 44px;
          height: 44px;
        }
      }
      .title {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #1a1a1a;
        line-height: 22px;
      }
      .desc {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 22px;
      }
    }
  }
}
.director-seats-dialog {
  .director-seats-boxs {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .director-seats-box {
      margin-bottom: 16px;
      width: 92px;
      height: 80px;
      background: #f2f2f2;
      border-radius: 4px;
      cursor: pointer;
      position: relative;
      text-align: center;
      line-height: 80px;
      font-size: 14px;
      color: #222;

      &.used {
        background: #fff0ef;
        color: #999;
      }
      &.selected {
        background-color: #fff;
        box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08),
          0px 2px 4px 0px rgba(0, 0, 0, 0.02);
        border: 1px solid #fb3a32;
      }
      .corner {
        height: 18px;
        background: #fb3a32;
        border-radius: 0px 12px 0px 4px;
        position: absolute;
        padding: 0 4px;
        left: 0;
        bottom: 0;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 17px;
      }
    }
  }
}
</style>
