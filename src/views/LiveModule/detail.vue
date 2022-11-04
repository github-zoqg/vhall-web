<template>
  <div
    class="detailBox"
    v-loading="loading"
    element-loading-text="数据获取中"
    v-if="!loading"
  >
    <pageTitle pageTitle="直播详情"></pageTitle>
    <!--  <pageTitle :title='titleText(liveDetailInfo.webinar_state) + "详情"'></pageTitle> -->
    <el-row :gutter="16" class="basicInfo">
      <el-col
        :span="18"
        :lg="18"
        :md="24"
        :sm="24"
        :xs="24"
        :class="liveDetailInfo.webinar_state === 4 ? 'active' : ''"
      >
        <div class="inner">
          <div class="thumb">
            <img :class="`webinar_cover webinar_cover_${imageMode}`" :src="liveDetailInfo.img_url" alt="" />
            <span class="liveTag">
              <label
                class="live-status"
                v-if="liveDetailInfo.webinar_state == 1"
              >
                <img src="../../common/images/live.gif" alt="" />
              </label>
              {{ liveDetailInfo | liveTag }}
              <span
                v-if="
                  liveDetailInfo.is_new_version == 3 &&
                  (liveDetailInfo.webinar_type == 3 ||
                    liveDetailInfo.webinar_type == 6) &&
                  liveDetailInfo.inav_num > 1
                "
              >
                | 1v{{ Number(liveDetailInfo.inav_num) - 1 }}</span
              >
              <span
                v-if="
                  liveDetailInfo.webinar_type != 6 &&
                  hasDelayPermission &&
                  isDelay
                "
              >
                | 无延迟</span
              >
              <span v-if="webinarDirector && isDirector"> | 云导播</span>
            </span>
            <span class="hot">
              <i class="iconfont-v3 saasicon_redu">
                {{ liveDetailInfo.pv | unitCovert }}</i
              >
            </span>
          </div>

          <div class="info">
            <div class="hidden_hover">
              <p class="mainColor font-20">
                {{ liveDetailInfo.subject }}
              </p>
              <p class="title_hover">{{ liveDetailInfo.subject }}</p>
            </div>
            <p class="subColor" v-if="liveDetailInfo.webinar_state != 4">
              直播时间：{{ liveDetailInfo.start_time }}
            </p>
            <p class="subDuration" v-else>
              点播时长：{{ liveDetailInfo.duration }}
            </p>
            <p class="subColor">
              观看限制：
              <span class="tag">{{ liveDetailInfo.verify | limitTag }}</span>
              <span class="tag" v-if="isForm">报名表单</span>
            </p>
            <div class="action-look">
              <el-button
                round
                size="small"
                v-if="
                  [3, 5].includes(liveDetailInfo.webinar_state) &&
                  liveDetailInfo.webinar_type != 5
                "
                style="margin-right: 8px"
                @click="resetResume(liveDetailInfo.webinar_state)"
                >恢复预告</el-button
              >
              <el-popover
                placement="bottom"
                trigger="hover"
                style="margin-right: 8px"
              >
                <div class="invitation-code">
                  <p>活动观看页</p>
                  <img :src="h5WapLink" alt="" v-if="h5WapLink" />
                  <p>
                    <el-button
                      round
                      type="primary"
                      size="medium"
                      @click="downErCode"
                      >下载二维码</el-button
                    >
                  </p>
                </div>
                <el-button round size="small" slot="reference">扫码</el-button>
              </el-popover>
              <div
                class="check-url"
                @mouseout="handlerMouseOut"
                @mouseover="handleMouseIn"
              >
                <el-button round size="small" class="check-btn">查看</el-button>
                <div
                  class="invitation-code urlCopy float-dom"
                  v-if="showFloat"
                  @mouseout="handlerMouseOut"
                  @mouseover="handleChildOver"
                >
                  <p>
                    观看页
                    <el-input
                      id="copy-val"
                      v-model="link"
                      style="width: 320px"
                    ></el-input>
                  </p>
                  <div class="copy-item">
                    <el-button
                      round
                      size="small"
                      type="primary"
                      data-clipboard-target="#copy-val"
                      @click="doCopy"
                      class="copy-link"
                      >复制</el-button
                    >
                    <el-button round size="small" @click="openLink"
                      >打开页面</el-button
                    >
                  </div>
                </div>
              </div>
              <div
                class="check-url director"
                v-if="webinarDirector && isDirector"
                @mouseout="handlerMouseOutDirector"
                @mouseover="handleMouseInDirector"
              >
                <el-button
                  round
                  size="small"
                  class="check-btn"
                  @click="toDirector(false)"
                  >云导播</el-button
                >
                <div
                  class="float-dom-director"
                  v-if="showFloatDirector && !hasUpdate"
                  @mouseout="handlerMouseOutDirector"
                  @mouseover="handleChildOverDirector"
                >
                  <div class="desc">多路机位+异地推流，画中画分屏直播</div>
                  <div class="flex-box">
                    <span>分辨率</span>
                    <el-select
                      v-model="dpi"
                      placeholder="请选择"
                      :popper-append-to-body="false"
                    >
                      <el-option label="1280*720" value="1280*720"></el-option>
                      <el-option
                        label="1920*1080"
                        value="1920*1080"
                      ></el-option>
                    </el-select>
                  </div>
                  <div class="indent">设置后，分辨率不支持重复修改</div>
                  <div class="btns">
                    <el-button round size="small" type="primary" @click="setDpi"
                      >确定</el-button
                    >
                    <el-button round size="small" @click="cancelSetDirector"
                      >取消</el-button
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>
      <el-col
        :span="6"
        :lg="6"
        :md="24"
        :sm="24"
        :xs="24"
        v-if="liveDetailInfo.webinar_state !== 4"
        class="rightbox"
        style="padding-right: 4px"
      >
        <div class="inner liveTime" v-if="!outLiveTime">
          <p class="subColor">{{ liveDetailInfo.webinar_state | limitText }}</p>
          <p
            class="mainColor timerBox"
            v-if="liveDetailInfo.webinar_state === 2"
          >
            <span class="custom-font-barlow first-downTime">{{
              time.day
            }}</span>
            <i>天</i>
            <span class="custom-font-barlow">{{ time.hours }}</span>
            <i>时</i>
            <span class="custom-font-barlow">{{ time.minute }}</span>
            <i>分</i>
            <span class="custom-font-barlow">{{ time.second }}</span>
            <i>秒</i>
          </p>
          <p v-else>
            <span>{{ liveDetailInfo.webinar_state | liveText }}</span>
          </p>
          <el-button
            round
            type="primary"
            @click="toEndLive"
            v-if="
              liveDetailInfo.webinar_type == 5 &&
              liveDetailInfo.webinar_state == 1
            "
            >结束直播</el-button
          >
          <el-button
            round
            type="primary"
            @click="toRoom"
            :disabled="isAnginOpen"
            v-if="liveDetailInfo.webinar_type != 5"
            >发起直播</el-button
          >
        </div>
        <div
          class="inner liveTime"
          v-if="outLiveTime && liveDetailInfo.webinar_state == 2"
        >
          <p class="subColor">直播即将开始</p>
          <p><span>观众等待中</span></p>
          <el-button
            v-if="liveDetailInfo.webinar_type != 5"
            round
            type="primary"
            @click="toRoom"
            >发起直播</el-button
          >
        </div>
      </el-col>
    </el-row>
    <item-card
      :type="liveDetailInfo.webinar_state"
      :webinarType="liveDetailInfo.webinar_type"
      :perssionInfo="perssionInfo"
      :childPremission="childPremission"
      :videoType="videoType"
      @blockHandler="blockHandler"
      v-if="isShow"
    ></item-card>
    <begin-play
      :webinarType="liveDetailInfo.webinar_type"
      :webinarId="$route.params.str"
      v-if="
        liveDetailInfo.webinar_state != 4 && liveDetailInfo.webinar_type != 5
      "
    ></begin-play>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle'
import beginPlay from '@/components/beginBtn'
import ItemCard from '@/components/ItemCard/index.vue'
import Env from '@/api/env'
import { formateDates } from '@/utils/general.js'
import { sessionOrLocal, parseImgOssQueryString, cropperImage } from '@/utils/utils'
export default {
  components: {
    PageTitle,
    ItemCard,
    beginPlay,
  },
  data() {
    return {
      lowerGradeInterval: null,
      isDelay: false,
      isDirector: false,
      hasDelayPermission: false,
      msg: '',
      userId: '',
      imageMode: 3,
      perssionInfo: {},
      isShow: false,
      loading: true,
      isForm: false,
      isExport: false,
      isAnginOpen: false,
      outLiveTime: false,
      liveDetailInfo: {
        webinar_state: 0,
        webinar_type: 0,
      },
      showFloat: false,
      showFloatDirector: false,
      timer: null,
      link: `${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`,
      h5WapLink: `${Env.staticLinkVo.aliQr}${process.env.VUE_APP_WAP_WATCH}/lives/watch/${this.$route.params.str}`,
      time: {
        day: 0,
        hours: 0,
        minute: 0,
        second: 0,
      },
      dpi: '1280*720',
      hasUpdate: true, //false: 没有修改过
      director_web_url: '', //云导播地址
    }
  },
  computed: {
    titleText() {
      return function (val) {
        let _text = '直播'
        val == 5
          ? (_text = '回放')
          : val == 4
          ? (_text = '点播')
          : (_text = '直播')
        return _text
      }
    },
    childPremission: function () {
      return sessionOrLocal.get('SAAS_V3_SON_PS')
        ? JSON.parse(sessionOrLocal.get('SAAS_V3_SON_PS'))
        : {}
    },
    videoType() {
      //定时直播视频格式 用来确定是否有暖场视频
      return (
        this.liveDetailInfo.webinar_type == 5 &&
        (this.liveDetailInfo.msg_url == '.MP3' ||
          this.liveDetailInfo.msg_url == '.MAV')
      )
    },
    // admin无云导播活动权限
    webinarDirector() {
      //  webinar.director 1:有无延迟权限  0:无权限
      if (
        JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))[
          'webinar.director'
        ] == '1'
      ) {
        return true
      } else {
        return false
      }
    },
  },
  created() {
    this.userId = JSON.parse(sessionOrLocal.get('userId'))
    this.getLiveDetail(this.$route.params.str)
    this.getPermission(this.$route.params.str)
  },
  mounted() {
    console.log(this.$route.meta.title, '1111111111111111')
  },
  beforeDestroy() {
    if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval)
  },
  methods: {
    handleLowerGradeHeart() {
      this.getLowerGradeConfig()
      this.lowerGradeInterval = setInterval(() => {
        this.getLowerGradeConfig()
      }, (Math.random() * 5 + 5) * 1000)
    },
    getLowerGradeConfig() {
      this.$fetch('lowerGrade', {})
        .then((res) => {})
        .catch((res) => {
          // 降级没有code吗
          const { activity, user, global } = res
          // 优先顺序：互动 > 用户 > 全局
          const activityConfig =
            activity && activity.length > 0
              ? activity.find(
                  (option) => option.audience_id == this.$route.params.str
                )
              : null
          const userConfig =
            user && user.length > 0
              ? user.find((option) => option.audience_id == this.userId)
              : null
          if (activityConfig) {
            this.setLowerGradeConfig(activityConfig.permissions)
          } else if (userConfig) {
            this.setLowerGradeConfig(userConfig.permissions)
          } else if (global && global.permissions) {
            this.setLowerGradeConfig(global.permissions)
          }
        })
    },
    setLowerGradeConfig(data) {
      if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval)
      let perssionInfo = JSON.parse(
        sessionOrLocal.get('WEBINAR_PES', 'localStorage')
      )
      perssionInfo = Object.assign(perssionInfo, data)
      this.perssionInfo = perssionInfo
      sessionOrLocal.set('WEBINAR_PES', perssionInfo, 'localStorage')
      console.log(this.perssionInfo, '>>>>>>1231<<<')
      this.isShow = true
      this.hasDelayPermission =
        this.perssionInfo['no.delay.webinar'] &&
        this.perssionInfo['no.delay.webinar'] == 1
          ? true
          : false
    },
    handleChildOver() {
      if (this.showFloat) {
        clearTimeout(this.handleTimer)
      }
      this.showFloat = true
    },
    handleMouseIn() {
      if (this.handleTimer) clearTimeout(this.handleTimer)
      this.showFloat = true
    },
    handlerMouseOut() {
      if (this.handleTimer) clearTimeout(this.handleTimer)
      this.handleTimer = setTimeout(() => {
        this.showFloat = false
      }, 400)
    },
    handleChildOverDirector() {
      if (this.showFloatDirector) {
        clearTimeout(this.handleTimerDirector)
      }
      this.showFloatDirector = true
    },
    handleMouseInDirector() {
      if (this.handleTimerDirector) clearTimeout(this.handleTimerDirector)
      this.showFloatDirector = true
    },
    handlerMouseOutDirector() {
      if (this.handleTimerDirector) clearTimeout(this.handleTimerDirector)
      this.handleTimerDirector = setTimeout(() => {
        this.showFloatDirector = false
        this.dpi = '1280*720'
      }, 400)
    },
    // 字符截取显示...兼容ie，用js
    fontNumber(date) {
      const length = date.length
      if (length > 35) {
        var str = ''
        str = date.substring(0, 35) + '...'
        return str
      } else {
        return date
      }
    },
    getPermission(id) {
      // 活动权限
      this.$fetch('planFunctionGet', {
        webinar_id: id,
        webinar_user_id: this.userId,
        scene_id: 1,
      })
        .then((res) => {
          if (res.code == 200) {
            if (res.data.permissions) {
               // TODO 模拟快问快答 - 有权限
              let perssionInfo = JSON.parse(res.data.permissions)
              perssionInfo.exam = 1
              sessionOrLocal.set(
                'WEBINAR_PES',
                perssionInfo,
                'localStorage'
              )
              this.perssionInfo = perssionInfo
              // sessionOrLocal.set(
              //   'WEBINAR_PES',
              //   res.data.permissions,
              //   'localStorage'
              // )
              // this.perssionInfo = JSON.parse(
              //   sessionOrLocal.get('WEBINAR_PES', 'localStorage')
              // )
              console.log(this.perssionInfo, '>>>>>>1231<<<')
              this.isShow = true
              this.hasDelayPermission =
                this.perssionInfo['no.delay.webinar'] &&
                this.perssionInfo['no.delay.webinar'] == 1
                  ? true
                  : false
              // this.handleLowerGradeHeart()
            } else {
              sessionOrLocal.removeItem('WEBINAR_PES')
            }
          }
        })
        .catch((e) => {
          console.log(e)
          sessionOrLocal.removeItem('SAAS_VS_PES')
        })
    },
    // 获取基本信息
    getLiveDetail(id) {
      this.loading = true
      // webinar/info调整-正常的信息展示使用 0
      this.$fetch('getWebinarInfo', { webinar_id: id, is_rehearsal: 0})
        .then((res) => {
          this.liveDetailInfo = res.data;
          if (cropperImage(this.liveDetailInfo.img_url)) {
            this.handlerImageInfo(this.liveDetailInfo.img_url);
          }
          sessionOrLocal.set('webinarState', this.liveDetailInfo.webinar_state)
          sessionOrLocal.set('webinarType', this.liveDetailInfo.webinar_type)
          if (res.data.webinar_state == 4) {
            this.$route.meta.title = '点播详情'
          } else {
            if (res.data.webinar_type == 5) {
              this.$route.meta.title = '定时直播详情'
              this.videoType = res.data.msg_url
            } else {
              this.$route.meta.title = '直播详情'
            }
          }
          this.getFormInfo(id)
          if (res.data.webinar_state == 1) {
            this.getOpenLive()
          }
          if (res.data.webinar_state == 2) {
            // let date = new Date();
            // let nowTime = date.setTime(date.getTime());
            let nowTime = res.data.time * 1000
            this.downTime(
              formateDates(nowTime).replace(/-/g, '/'),
              res.data.start_time.replace(/-/g, '/')
            )
          }
          this.isDelay = res.data.no_delay_webinar == 1 ? true : false
          this.isDirector = res.data.is_director == 1 ? true : false
          // 是否活动标记为云导播活动
          sessionOrLocal.set(`webinar_is_director__${id}`, res.data.is_director)
          if (this.isDirector) {
            this.getLiveDirectorResolution()
          }
        })
        .catch((res) => {
          this.$message({
            message: res.msg || '获取信息失败',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box',
          })
          console.log(res)
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 解析图片地址
    handlerImageInfo(url) {
      let obj = parseImgOssQueryString(url);
      this.imageMode = Number(obj.mode) || 3;
    },
    // 获取是否有报名表单
    getFormInfo(id) {
      this.$fetch('regFromGet', { webinar_id: id }).then((res) => {
        if (res.code == 200 && res.data.enable_status == 1) {
          this.isForm = true
        } else {
          this.isForm = false
        }
      })
    },
    // 下载二维码
    downErCode() {
      const activeName = this.liveDetailInfo.subject
      this.$vhall_paas_port({
        k: 100055,
        data: {
          business_uid: this.userId,
          user_id: '',
          webinar_id: this.$route.params.str,
          refer: '',
          s: '',
          report_extra: {},
          ref_url: '',
          req_url: '',
        },
      })
      let image = new Image()
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous')
      image.onload = function () {
        let canvas = document.createElement('canvas')
        // canvas.width = image.width
        // canvas.height = image.height
        canvas.width = 217
        canvas.height = 217
        let context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, 217, 217)
        // context.drawImage(image, 0, 0, image.width, image.height)
        let url = canvas.toDataURL('image/png') //得到图片的base64编码数据
        let a = document.createElement('a') // 生成一个a元素
        let event = new MouseEvent('click') // 创建一个单击事件
        a.download = `${activeName || 'code'}观看端二维码.png` // 设置图片名称
        a.href = url // 将生成的URL设置为a.href属性
        a.dispatchEvent(event) // 触发a的单击事件
      }
      image.src = this.h5WapLink
    },
    // 复制
    doCopy() {
      let clipboard = new this.$clipboard('.copy-link')
      clipboard.on('success', (e) => {
        this.$message({
          message: `复制成功`,
          showClose: true,
          type: 'success',
          customClass: 'zdy-info-box',
        })
        e.clearSelection()
        clipboard.destroy()
      })
      clipboard.on('error', (e) => {
        this.$message({
          message: `复制失败`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box',
        })
        clipboard.destroy()
      })
    },
    // 结束直播
    toEndLive() {
      //强制结束直播
      this.$confirm('正在直播中，确定结束直播？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel',
      })
        .then(() => {
          this.timingliveEnd()
        })
        .catch(() => {})
    },
    timingliveEnd() {
      this.$fetch(
        'liveEnd',
        this.$params({
          webinar_id: this.$route.params.str,
          end_type: 1,
        })
      )
        .then((res) => {
          if (res && res.code === 200) {
            this.getLiveDetail(this.$route.params.str)
          }
        })
        .catch((e) => {})
    },
    // 打开页面
    openLink() {
      this.$vhall_paas_port({
        k: 100057,
        data: {
          business_uid: this.userId,
          user_id: '',
          webinar_id: this.$route.params.str,
          refer: '',
          s: '',
          report_extra: {},
          ref_url: '',
          req_url: '',
        },
      })
      window.open(this.link, '_blank')
    },
    //恢复预告
    resetResume(status) {
      if (status === 5) {
        this.$confirm('恢复为预告后，回放将不能观看', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel',
        })
          .then(() => {
            this.reSumeNotice()
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消',
            })
          })
      } else {
        this.reSumeNotice()
      }
    },
    reSumeNotice() {
      this.$fetch('liveEdit', { webinar_id: this.$route.params.str, type: 2 })
        .then((res) => {
          this.$vhall_paas_port({
            k: 100054,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: this.$route.params.str,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: '',
            },
          })
          this.$message({
            message: `恢复预告成功`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box',
          })
          this.getLiveDetail(this.$route.params.str)
        })
        .catch((res) => {
          this.$message({
            message: res.msg || '恢复预告失败',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box',
          })
          console.log(res)
        })
    },
    // 判断是否有起直播的权限
    getOpenLive() {
      this.$fetch(
        'checkLive',
        this.$params({
          webinar_id: this.$route.params.str,
        })
      )
        .then((res) => {
          if (res && res.code === 200) {
            this.isAnginOpen = false
          } else {
            this.isAnginOpen = true
          }
        })
        .catch((e) => {
          this.isAnginOpen = true
        })
    },
    blockHandler(item) {
      if (item.path) {
        if (item.path === '/live/edit') {
          if (this.liveDetailInfo.webinar_state == 4) {
            this.$router.push({
              path: `/live/vodEdit/${this.$route.params.str}`,
              query: { type: 2 },
            })
          } else {
            if (this.liveDetailInfo.webinar_type == 5) {
              this.$router.push({
                path: `/live/timeEdit/${this.$route.params.str}`,
                query: { type: 2 },
              })
            } else {
              this.$router.push({
                path: `${item.path}/${this.$route.params.str}`,
                query: { type: 2 },
              })
            }
          }
        } else if (item.path === '/live/question') {
          // 问卷
          this.$router.push({
            path: `${item.path}/${this.$route.params.str}`,
            query: {
              roomId: this.liveDetailInfo.vss_room_id,
              query: { type: this.liveDetailInfo.webinar_type },
            },
          })
        }  else if (item.path === '/live/exam') {
          // 快问快答
          this.$router.push({
            path: `${item.path}/${this.$route.params.str}`,
            query: {
              roomId: this.liveDetailInfo.vss_room_id,
              tab: 1,
              query: { type: this.liveDetailInfo.webinar_type }
            },
          })
        } else if (
          item.path === `/live/prizeSet/${this.$route.params.str}` ||
          item.path === `/live/gift/${this.$route.params.str}`
        ) {
          // 奖品
          this.$router.push({
            path: item.path,
            query: {
              roomId: this.liveDetailInfo.vss_room_id,
              type: this.liveDetailInfo.webinar_type,
            },
          })
        } else if (
          item.path === `/live/interactionData/${this.$route.params.str}`
        ) {
          // 互动统计
          this.$router.push({
            path: item.path,
            query: { roomId: this.liveDetailInfo.vss_room_id },
          })
        } else if (item.path == `/live/livingSet/${this.$route.params.str}`) {
          // 直播间设置
          let isDelay = this.hasDelayPermission && this.isDelay ? 1 : 0;
          this.$router.push({
            path: item.path,
            query: { type: this.liveDetailInfo.webinar_type, isDelay: isDelay },
          })
        } else if (item.path == `/live/safeScreenSet/${this.$route.params.str}`) {
          // 防录屏
          let isDelay = this.hasDelayPermission && this.isDelay ? 1 : 0;
          this.$router.push({
            path: item.path,
            query: { type: this.liveDetailInfo.webinar_type, isDelay: isDelay },
          })
        } else {
          this.$router.push({
            path: item.path,
            query: item.path == `/live/signup/${this.$route.params.str}` ? { type: this.liveDetailInfo.webinar_type, tab: 1 }: { type: this.liveDetailInfo.webinar_type },
          })
        }
      } else {
        console.log(item)
      }
    },
    getAppersInfo() {
      this.$fetch('getVersionInfo', { user_id: this.userId })
        .then((res) => {
          if (res.data.arrears.total_fee > 0) {
            this.$confirm(
              `尊敬的微吼会员，您的${
                res.data.type == 1
                  ? '流量'
                  : res.data.type == 2
                  ? '时长资源'
                  : '并发套餐'
              }已用尽，${res.data.type == 2 ? '请联系客服充值' : '请充值'}`,
              '提示',
              {
                confirmButtonText: res.data.type == 2 ? '知道了' : '去充值',
                cancelButtonText: '知道了',
                customClass: 'zdy-message-box',
                lockScroll: false,
                showCancelButton: res.data.type == 2 ? false : true,
                cancelButtonClass: 'zdy-confirm-cancel',
              }
            )
              .then(() => {
                if (res.data.type == 2) return
                this.$router.push({ path: '/finance/info' })
              })
              .catch(() => {})
          } else {
            this.toLive()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    toLive() {
      if (this.liveDetailInfo.webinar_type == 1) {
        // 跳转发起端地址 协议 +  域名
        let href = `${window.location.protocol}${process.env.VUE_APP_ROOM_WATCH}/lives/room/${this.$route.params.str}`
        window.open(href, '_blank')
      } else {
        const { href } = this.$router.resolve({
          path: `/live/chooseWay/${this.$route.params.str}/1?type=ctrl`,
        })
        window.open(href, '_blank')
      }
    },
    toRoom() {
      // 跳转至发起页面
      this.getAppersInfo(this.userId)
      // let status = await
      // if (status) {
      //   this.$confirm('尊敬的微吼会员，您的流量已用尽，请充值', '提示', {
      //     confirmButtonText: '去充值',
      //     cancelButtonText: '知道了',
      //     customClass: 'zdy-message-box',
      //     lockScroll: false,
      //     cancelButtonClass: 'zdy-confirm-cancel',
      //   }).then(() => {
      //     this.$router.push({path:'/finance/info'});
      //   }).catch(() => {});
      // } else {
      //   if (this.liveDetailInfo.webinar_type == 1) {
      //     let href = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/lives/room/${this.$route.params.str}`;
      //     window.open(href, '_blank');
      //   } else {
      //     const { href } = this.$router.resolve({path: `/live/chooseWay/${this.$route.params.str}/1?type=ctrl`});
      //     window.open(href, '_blank');
      //   }
      // }
      // const { href } = this.$router.resolve({path: `/lives/room/${this.$route.params.str}`});
    },
    downTime(targetStartDate, targetEndDate) {
      let targetStart = new Date(targetStartDate)
      let targetEnd = new Date(targetEndDate)
      if (targetEnd.getTime() - targetStart.getTime() < 0) {
        this.outLiveTime = true
        return false
      } else {
        let diff = targetEnd.getTime() - targetStart.getTime()
        targetStart.setTime(targetStart.getTime() + 1000)
        let day = Math.floor(diff / (24 * 3600 * 1000))
        this.time.day = day > 9 ? day : `0${day}`
        let limit1 = diff % (24 * 3600 * 1000)
        let hours = Math.floor(limit1 / (3600 * 1000))
        this.time.hours = hours > 9 ? hours : `0${hours}`
        let limit2 = limit1 % (3600 * 1000)
        let minute = Math.floor(limit2 / (60 * 1000))
        this.time.minute = minute > 9 ? minute : `0${minute}`

        let limit3 = limit2 % (60 * 1000)
        let second = Math.floor(limit3 / 1000)
        this.time.second = second > 9 ? second : `0${second}`
        // console.log(diff, '????????????????????')
        if (diff) {
          let diffSetTime = window.setTimeout(() => {
            this.downTime(targetStart, targetEnd)
            window.clearTimeout(diffSetTime)
          }, 1000)
        } else {
          return `0天0时0分0秒`
        }
      }
    },
    //设置导播分辨率
    setDpi() {
      this.$fetch(
        'setLiveDirectorResolution',
        this.$params({
          webinar_id: this.$route.params.str,
          resolution_ratio: this.dpi,
        })
      )
        .then((res) => {
          this.hasUpdate = true
          this.director_web_url = res.data.director_web_url
          this.toDirector(true)
        })
        .catch((res) => {})
    },
    // 控制台-获取活动分辨率信息
    getLiveDirectorResolution(open = false) {
      this.$fetch(
        'getLiveDirectorResolution',
        this.$params({
          webinar_id: this.$route.params.str,
        })
      )
        .then((res) => {
          if (res && res.code === 200) {
            //1:未修改 2:已修改不可修改
            this.hasUpdate = res.data.is_update === 2
            this.director_web_url = res.data.director_web_url
            if (open) {
              this.openDirector()
            }
          }
        })
        .catch((e) => {})
    },
    //打开云导播台
    toDirector(open = false) {
      if (this.hasUpdate) {
        if (this.director_web_url && open) {
          this.openDirector()
        } else {
          this.getLiveDirectorResolution(true)
        }
      }
    },
    openDirector() {
      //打开云导播台
      this.$vhall_paas_port({
        k: 100838,
        data: {
          business_uid: this.userId,
          user_id: '',
          webinar_id: this.$route.params.str,
          refer: '',
          s: '',
          report_extra: {},
          ref_url: '',
          req_url: '',
        },
      })
      window.open(this.director_web_url, '_blank')
    },
    cancelSetDirector() {
      this.showFloatDirector = false
      this.dpi = '1280*720'
    },
  },
}
</script>

<style lang="less" scoped>
.basicInfo {
  // display: flex;
  // min-width: 756px;
  // flex-wrap: wrap;
  // justify-content: space-between;
  .rightbox {
    height: 223px;
  }
  .active {
    width: 100%;
  }
  .inner {
    background: #fff;
    width: 100%;
    height: 100%;
    padding: 24px;
    display: flex;
    border-radius: 4px;
    .info {
      flex: 1;
      // overflow: auto;
      // height: 175px;
      p {
        font-size: 14px;
        line-height: 28px;
        &:nth-child(1) {
          margin-bottom: 16px;
          // height: 56px;
          font-size: 20px;
          // display: table-cell;
          vertical-align: middle;
          cursor: pointer;
        }
        &:last-child {
          margin-bottom: 20px;
        }
        // &:nth-child(2){
        //   margin-bottom: 10px;
        //   line-height: 20px;
        // }
        // &:nth-child(3){
        //   // margin-bottom: 20px;
        //   line-height: 20px;
        // }
      }

      .hidden_hover:hover .title_hover {
        display: block;
      }
      .title_hover {
        position: absolute;
        left: 370px;
        top: 55px;
        border-radius: 4px;
        max-width: 368px;
        word-break: break-all;
        line-height: 17px;
        background: rgba(#1a1a1a, 0.85);
        font-size: 12px;
        color: #fff;
        padding: 8px 10px;
        z-index: 100;
        display: none;
      }
    }
    .thumb {
      width: 312px;
      height: 175px;
      position: relative;
      margin-right: 25px;
      background: #1a1a1a;
      border-radius: 4px;
      .webinar_cover{
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
        border-radius: 4px;
        &.webinar_cover_1{
          object-fit: fill;
        }
        &.webinar_cover_2{
          object-fit: cover;
          object-position: left top;
        }
      }
      .liveTag {
        background: rgba(0, 0, 0, 0.7);
        // background: rgba(247, 245, 245, 0.7);
        color: #fff;
        font-size: 12px;
        padding: 4px 12px;
        border-radius: 20px;
        position: absolute;
        top: 12px;
        left: 12px;
        .live-status {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin-right: 4px;
          vertical-align: top;
          img {
            width: 100%;
            height: 100%;
            border-radius: 0;
            object-fit: scale-down;
          }
        }
      }
      .hot {
        position: absolute;
        height: 50px;
        width: 100%;
        /* background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%); */
        background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.6));
        bottom: 0px;
        left: 0px;
        color: #fff;
        font-size: 14px;
        z-index: 2;
        cursor: pointer;
        border-radius: 0 0 4px 4px;
        i {
          position: absolute;
          left: 14px;
          bottom: 10px;
        }
      }
    }
    .tag {
      border-radius: 20px;
      background: #f2f2f2;
      font-size: 12px;
      padding: 4px 8px;
      margin-right: 8px;
    }
  }
}
.float-dom {
  position: absolute;
  top: 40px;
  left: -40px !important;
  width: 420px;
  height: 150px;
  border-radius: 4px;
  padding: 5px 10px;
  background: #fff;
  border: 1px solid #f2f2f2;
  transform-origin: center top;
  z-index: 2001;
  color: #666;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  word-break: break-all;
  p {
    font-size: 14px !important;
    margin-top: 30px !important;
  }
  .copy-item {
    padding-top: 10px !important;
  }
}
.invitation-code {
  text-align: center;
  padding: 2px 40px 10px;
  display: block !important;
  left: 50%;
  p {
    line-height: 40px;
  }
  img {
    margin-bottom: 10px;
    width: 132px;
    height: 132px;
  }
  .copy-item {
    text-align: right;
    padding: 24px 0 10px 0;
  }
}
.urlCopy {
  padding: 2px 15px;
  p {
    margin-top: 20px;
    &:nth-child(2) {
      padding: 4px;
      font-size: 16px;
      ::v-deep.el-button {
        font-size: 14px;
        line-height: 24px;
        padding: 2px 20px;
        margin-right: 20px;
      }
    }
  }
}

.float-dom-director {
  position: absolute;
  top: 40px;
  left: -40px !important;
  width: 314px;
  height: 217px;
  border-radius: 4px;
  padding: 24px 32px;
  background: #fff;
  border: 1px solid #f2f2f2;
  transform-origin: center top;
  z-index: 2001;
  color: #666;
  line-height: 1.4;
  text-align: justify;
  font-size: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  word-break: break-all;
  .flex-box {
    display: flex;
    align-items: center;
    margin-top: 20px;
    span {
      margin-right: 10px;
    }
    /deep/ .el-select {
      width: 194px;
      .el-input__inner {
        height: 40px;
      }
    }
  }
  .indent {
    text-indent: 50px;
    margin-top: 8px;
  }
  .btns {
    margin-top: 24px;
    text-align: right;
  }
}

.mainColor {
  color: #1a1a1a;
}
.timerBox {
  span {
    display: inline-block;
    width: 26px;
  }
  .first-downTime {
    padding: 0 3px;
    text-align: right;
    width: 50px;
  }
}
.subColor,
.subDuration {
  color: #666666;
}
.action-look {
  margin-top: 10px;
}
.check-url {
  display: inline-block;
  width: 62px;
  height: 32px;
  position: relative;
}
.director {
  margin-left: 8px;
}
.font-20 {
  font-size: @20;
  width: 100%;
  position: relative;
  overflow: hidden;
  word-break: break-all;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  position: relative;
  // &:hover .info .title_hover {
  //   display: block;
  // }
  // max-width: 500px;
  // height: 56px;
  // overflow: hidden;
  // text-overflow:ellipsis;
  // white-space: nowrap;
}
.liveTime {
  font-size: 14px;
  justify-content: center;
  flex-direction: column;
  i {
    font-style: normal;
  }
  p {
    text-align: center;
    i {
      vertical-align: text-top;
    }
    &:nth-child(1) {
      margin-bottom: 10px;
    }
    &:nth-child(2) {
      span {
        font-size: 22px;
        font-weight: bold;
      }
      i {
        margin: 0 2px;
      }
      // margin-bottom: 18px;
    }
  }
  .el-button {
    width: 160px;
    margin: 22px auto 0;
  }
}
/*.detailBox {
  margin: auto;
  width: 1020px;
}
@media screen and (min-width: 1920px) {
  .detailBox {
    // padding: 0px 140px;
    margin: auto;
    width: 1374px;
  }
}*/
</style>
