<template>
  <chrome v-if="downloadChrome" :type="'client'"> </chrome>
  <tip v-else-if="tipMsg" :text="tipMsg"> </tip>
  <div v-else class="watch-wraps">
    <div class="seeding-contents">
      <vhall-enjoy-watch-Saas
        v-if="roominfo.vss_token && !kickOutSass"
        :playerInfo="roominfo.player"
        :roomId="roominfo.room_id"
        :ilId="roominfo.webinar_id"
        :vssToken="roominfo.vss_token"
        :saasJoinId="roominfo.user.saas_join_id"
        :qaStatus="roominfo.open_question"
        :userChatId="userChatId"
        :domains="domains"
        :chatShow="chatShow"
        :chatFilterData="chatFilterData"
        :shareId="roominfo.share_id"
        :recordHistoryTime="recordHistoryTime"
        :menuData="menuData"
        :isEmbed="true"
        :bizInfo="roominfo"
        @NoLogin="callLogin"
        @descripe="decripeMenu"
        @onlineJoin="onlinePeople"
        @onlineLeave="onlineLeavePeople"
        @updateBaseNum="updateBaseNumFun"
      ></vhall-enjoy-watch-Saas>
      <div class="vhall-kick-outs" v-if="kickOutSass">
        <h1 v-if="kickOutSass">您已被禁止，访问房间！</h1>
      </div>
    </div>
  </div>
</template>
<script>
import VhallReport from '@/components/VhallReport/main'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { isIE } from '@/utils/utils'
import moment from 'moment'
import tip from './tip'
import { sessionOrLocal, clearCookies } from '@/utils/utils'

export default {
  data() {
    return {
      downloadChrome: false,
      roomData: {},
      myliveRoute: '',
      accountRoute: '',
      myPageRoute: '',
      myAccountRoute: '',
      isIE: isIE(),
      webDominUrl: '', // 主站的域名
      webinarDominUrl: '', // 观看的域名
      submitQuestionNum: '', // 提交问题数
      myMessageNum: '', // 信息数
      submitQuestionShow: false, // 提交问题的显示
      chatFilterData: [], // 聊天过滤的数据
      attentionContent: '关注', // 关注的内容显示
      kickOutSass: false, // 遮罩层
      chatShow: '', // 聊天的status
      goodsPopShow: false,
      roomUser: {
        uvOnline: '1',
        pvCount: '1',
      }, // 在线观看数和在线人数
      baseRoomUser: {
        baseOnlineNum: 0,
        basePv: 0,
      },
      simpleContent: '', // 简介内容
      sellGoodsShow: false, // 商品推荐的显示
      smsErrorMessage: '', // 短信的错误提示
      errorMessage: '请输入正确的邮箱', // 错误的提示
      swiperPrevShow: false, // 向前翻页的按钮显示
      swiperNextShow: true, // 向后翻页的按钮显示
      followStyle: false, // 关注不关注的显示
      shadeShow: false, // 遮罩层的显示
      menuListShow: false, // 菜单列表的显示
      otherWayShow: false, // 其他登录方式的图标
      qrCodeShow: false, // 二维码的显示切换
      qrCodeImg: '', // 二维码路径
      rulesShow: false, // 邀请的规则显示切换
      topShow: true, // 榜单的显示切换
      bottomLoginInfo: true, // 登录底部信息展示
      phoneKey: '', // 云盾值
      cap: null, // 云盾本身
      key: 'b7982ef659d64141b7120a6af27e19a0', // 云盾key
      loginDialogShow: false, // 登录页面
      photoCpathaShow: false, // 登录的图片验证码的展示
      buttonControl: true, // 按钮的置灰
      passwordShow: true, // 密码框的显示
      accountChecked: false, // 账户的自动登录
      isActive: true, // 切换tap
      pickUpShow: true, // 收起的显示
      ruleForm: {
        username: '',
        password: '',
      },
      sendMsgDisabled: false,
      time: 60,
      typeControl: true, // 云链账号页
      iconPlay: '直播',
      iconPlayShow: false, // 观看图标的显示
      regShow: false, // 注册的显示
      pvShow: false, // 观看次数的显示
      onlineShow: false, // 在线人数的显示
      attentionShow: false,
      activeInfo: {}, // 活动信息
      goodInfo: {}, // 商品信息
      goodsList: [], // 商品列表
      hostInfo: {}, // host信息
      userShow: true, // 未登录 true
      activeIndex: 0,
      menuList: [],
      logoShow: false,
      skinLogo: require('./img/logo.png'),
      components: null,
      userChatId: null,
      nickName: null,
      roominfo: {
        modules: {
          initiator: {},
          header: {},
          logo: {},
        },
        auth: {},
        host: {},
        webinar: {},
      }, // 房间信息
      swiperOption: {
        slidesPerView: 4,
        slidesPerGroup: 1,
        loop: false,
        loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      },
      domains: {},
      recordHistoryTime: '', // 播放器进度
      tipMsg: '', // 初始化接口返回的错误信息
      showOfficialAccountQRCode: false, // 刷新后是否显示公众号弹窗
      showOfficialAccountMiniQRCode: false, // head栏是否显示微信公众号图标
      menuData: [],
      visitor_id: '', // 访客标识
      isLogin: false, // 是否登录
      initStatus: true,
      configList: {},
      openScreenConfig: {}, // 开屏海报
      userInfo: {},
      location: process.env.VUE_APP_WAP_WATCH,
      focusCount: 0,
    }
  },
  components: {
    tip,
  },
  created() {
    sessionOrLocal.set('tag', 'helloworld', 'localStorage') // 第三方绑定信息 场景
    sessionOrLocal.set('sourceTag', 'watch') // 第三方绑定信息 场景
    this.$loadingStatus = this.$loading({
      background: 'rgba(0,0,0,0.5)',
      text: '加载中',
    })
  },
  mounted() {
    window.EventBridge = this.$EventBus
    sessionStorage.setItem('role_val', '2')
    this.userInfo = sessionOrLocal.get('userInfo')
      ? JSON.parse(sessionOrLocal.get('userInfo'))
      : {}
    if (this.userInfo && this.userInfo.user_id) {
      this.isLogin = true
    }
    // 加入消息 增加uv
    this.$EventBus.$on('Join', (msg) => {
      if (this.roomData && this.roomData.online) {
        this.roomData.online.num = msg.uv
        this.roomData.pv.num = msg.context.pv
      }
    })
    // 离开消息
    this.$EventBus.$on('Leave', (msg) => {
      if (this.roomData && this.roomData.online) {
        this.roomData.online.num = msg.uv
        // this.roomData.pv.num = msg.pv
      }
    })
    this.$EventBus.$on('loaded', () => {
      this.$loadingStatus.close()
      // 是否显示公众号
    })
    // 自适应处理
    window.addEventListener('resize', () => {
      let width = document.querySelector('.seeding-content').offsetWidth
      /**
       * 根据文档区域 16: 9  去计算容器 高度
       * 具体算法。
       * 1.  计算出文档区域 宽度   width - 侧边栏 宽度 （ 295 ）
       * 2.  计算出文档区高度 + with - 295 / x = 16/ 9
       * x =  width - 295 / 1.78
       * 容器高度 =  height + 46 // 底部互动工具栏高度
       */
      const ratio = 16 / 9
      const docHeight = (width - 294) / ratio + 46
      document.querySelector('.seeding-content').style.height = `${docHeight}px`
    })
    // 全屏兼容360浏览器等
    const setFullscreen = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullscreenElement ||
        document.msFullscreenElement
      if (
        fullscreenElement &&
        fullscreenElement.className == 'seeding-content'
      ) {
        setTimeout(() => {
          const contentWrapper = document.querySelector('.seeding-content')
          if (contentWrapper) {
            contentWrapper.style.marginTop = '0px'
            contentWrapper.style.width = '100%'
            contentWrapper.style.height = '100%'
          }
        }, 100)
      }
    }
    window.addEventListener('fullscreenchange', setFullscreen)
    window.addEventListener('webkitfullscreenchange', setFullscreen)
    window.addEventListener('mozfullscreenchange', setFullscreen)
    window.addEventListener('msfullscreenchange', setFullscreen)
    window.addEventListener('MSFullscreenChange', setFullscreen)
    /**
     * 心跳检测
     * 因为saas和paas同步使用token，为避免用户长时间不动
     * 使用setTimeout30min后请求接口，延续cookie时间
     */
    this.heartbeatLink()
    this.startRoomInitProcess()
  },
  beforeDestroy() {
    window.removeEventListener('resize', () => {})
    window.removeEventListener('fullscreenchange', () => {})
    window.removeEventListener('webkitfullscreenchange', () => {})
    window.removeEventListener('mozfullscreenchange', () => {})
    window.removeEventListener('msfullscreenchange', () => {})
    window.removeEventListener('MSFullscreenChange', () => {})
    this.$loadingStatus.close()
    if (this.timeinterval) clearInterval(this.timeinterval)
    this.timeinterval = null
    window.vhallReport && window.vhallReport.report('LEAVE_WATCH')
  },
  methods: {
    closeWXCode() {
      this.showOfficialAccountQRCode = false
    },
    // 心跳检测
    heartbeatLink() {
      setTimeout(() => {
        this.$fetch('liveHeartBeat', {})
          .then(() => {
            this.heartbeatLink()
            console.log('心跳检测成功')
          })
          .catch((e) => {
            console.log('心跳检测失败:', e)
          })
      }, 1000 * 60 * 30)
    },
    async startRoomInitProcess() {
      try {
        await this.getRoomInfo() // 初始化房间信息
        if (this.roomData && this.roomData.status == 'subscribe') {
          if (location.pathname.indexOf('/embedclient/') != -1) {
            this.$router.push({
              name: 'embedSubscribe',
              params: { id: this.$route.params.il_id },
            })
          } else {
            this.$router.push({
              name: 'Subscribe',
              params: { id: this.$route.params.il_id },
            })
          }
          return
        }
        // if (this.roomData && this.roomData.status == 'live') {
        await this.queryRoomInterInfo() // 获取房间活动状态
        // await this.getFirstPost() // 开屏
        // }
        // await this.getAdsInfo() // 获取活动广告信息
        // await this.getSkin() // 获取皮肤
        // await this.getPublisAdv() // 获取公众号广告
        // await this.getSignInfo() // 获取标记 logo 主办方信息
        // await this.getMenuList()
        // 预约后的活动才显示邀请卡
        // if (this.isLogin) {
        //   await this.getAttentionStatus()
        // }
        // if (this.roomData && this.roomData.is_subscribe) {
        //   await this.getInviteStatus()
        // }
        if (this.roomData) {
          await this.getConfigList() // 获取观看端配置项
          this.handleRoomInfo()
        }
      } catch (e) {
        console.log('初始化调用失败:', e)
      }
    },
    // 初始化房间信息
    getRoomInfo() {
      return this.$fetch('watchInit', {
        webinar_id: this.$route.params.il_id,
        visitor_id: sessionOrLocal.get('visitor_id')
          ? sessionOrLocal.get('visitor_id')
          : '',
        refer: '',
        record_id: '', // TODO:
        wx_url: '',
      })
        .then((res) => {
          this.handleErrorCode(res)
        })
        .catch((e) => {
          this.initStatus = false
          console.log('获取房间信息失败:', e)
        })
    },
    // 初始化错误信息处理
    handleErrorCode(res) {
      switch (res.code) {
        case 200:
          this.roomData = res.data && res.data
          this.roomData.online.num += 1 // 需要手动加自己
          this.roomData.pv.num += 1
          this.roomData.visitor_id &&
            sessionOrLocal.set('visitor_id', this.roomData.visitor_id)
          this.roomData.interact.interact_token &&
            sessionOrLocal.set(
              'interact_token',
              this.roomData.interact.interact_token
            )
          break
        case 12514: // 您已被踢出，请联系活动组织者
          this.$EventBus.$emit('loaded')
          this.kickOutSass = true
          break
        case 12002: // 活动不存在
        case 12522: // 主持人、嘉宾或助理不允许进入观看端
        case 12536: // 回放不存在
        case 12542: // 此视频暂时下线了
        case 12543: // 该视频已下线，有疑问请联系客服
        case 12544: // 该视频转码失败
        case 12545: // 该视频正在审核中
        case 12546: // 该视频正在转码中
        case 12541: // 活动现场太火爆，已超过人数上限
          this.$EventBus.$emit('loaded')
          this.tipMsg = res.msg
          break
        default:
          this.tipMsg = res.msg
          this.$loadingStatus.close()
        // case 12534: // 跳转链接
        //   window.location.href = data.url // TODO:
        //   break;
      }
    },
    // 点击商品获得详细的信息
    sellGoodsInfo(goodInfo) {
      this.goodInfo = goodInfo
      window.vhallReport &&
        window.vhallReport.report('GOOD_RECOMMEND', {
          event: moment().format('YYYY-MM-DD HH:mm'),
          market_tools_id: this.goodInfo.good_id,
          // 浏览
          market_tools_status: 0,
        })
      this.shadeShow = !this.shadeShow
      this.goodsPopShow = !this.goodsPopShow
    },
    // 关闭详情弹窗事件
    closeGoodPop() {
      this.shadeShow = false
      this.goodsPopShow = false
    },
    // 简介的描述
    decripeMenu(msg) {
      this.simpleContent = msg
    },
    // 活动简介翻页
    preButtonClick() {
      const preStyle = document.querySelector('.swiper-wrapper')
      const [...everySlide] = document.querySelectorAll('.swiper-slide')
      preStyle.style.transform ==
      `translate3d(-${[...everySlide][0].style.width}, 0px, 0px)`
        ? (this.swiperPrevShow = false)
        : (this.swiperPrevShow = true)
    },
    // 点击后一个按钮显示
    nextButtonClick() {
      this.swiperPrevShow = true
    },
    onlinePeople(msg) {
      this.$nextTick(() => {
        this.roomUser.uvOnline = msg.uv
        if (msg.context.pv > this.roomUser.pvCount) {
          this.roomUser.pvCount = msg.context.pv
        }
      })
    },
    onlineLeavePeople(msg) {
      this.$nextTick(() => {
        this.roomUser.uvOnline = msg.uv
      })
    },
    updateBaseNumFun(msg) {
      this.$nextTick(() => {
        this.baseRoomUser.basePv =
          this.baseRoomUser.basePv + Number(msg.data.update_pv)
        this.baseRoomUser.baseOnlineNum =
          this.baseRoomUser.baseOnlineNum + Number(msg.data.update_online_num)
        sessionOrLocal.set('baseOnlineNumber', this.baseRoomUser.baseOnlineNum)
      })
    },
    // 点击遮罩
    shadeClick() {
      this.loginDialogShow = false
      this.shadeShow = false
    },
    // other登录方式的修改
    otherLoginClick() {
      this.otherWayShow = !this.otherWayShow
      this.pickUpShow = !this.pickUpShow
    },
    // 邀请好友的打开
    invitedFriend() {
      this.qrCodeShow = true
    },
    // 点击注册
    registerClick() {
      window.location.href = `${this.webDominUrl}/register?source=2`
    },
    // 超过登录次数 唤起图片验证码
    callCaptcha(element) {
      let that = this
      initNECaptcha({
        captchaId: this.key,
        element: element,
        mode: 'float',
        width: 270,
        onReady(instance) {
          console.log('instance', instance)
        },
        onVerify(err, data) {
          if (data) {
            that.phoneKey = data.validate
            that.errorMessage = ''
            if (element == '#captcha') {
              // 快捷登录 释放获取验证码按钮
              that.buttonControl = false
            }
          } else {
            that.errorMessage = '图形码未验证通过'
          }
        },
        onload(instance) {
          that.errorMessage = '图形码未验证通过'
        },
      })
    },
    // 打开登录面板
    callLogin() {
      this.errorMessage = ''
      this.smsErrorMessage = ''
      this.loginDialogShow = true
      this.shadeShow = true
      this.passwordShow = true
    },
    // 快捷登录 获取短信验证码
    getCaptha(key) {
      if (!this.ruleForm.usernames) {
        this.smsErrorMessage = '请输入您的手机号'
        return
      }
      this.$fetch('sendCode', {
        type: 1,
        data: this.ruleForm.usernames,
        validate: this.phoneKey,
        scene_id: 7,
      })
        .then((res) => {
          if (res.code == 200) {
            this.buttonControl = true
            this.sendMsgDisabled = true
            if (this.timeinterval) clearInterval(this.timeinterval)
            this.timeinterval = setInterval(() => {
              if (this.time > 0) {
                this.time--
              } else {
                clearInterval(this.timeinterval)
                this.sendMsgDisabled = false
                this.time = 60
                this.buttonControl = false
              }
            }, 1000)
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 校验账号登录
    checkLoginClick() {
      if (!this.ruleForm.username) {
        this.errorMessage = '请输入您的手机号或邮箱'
        return false
      } else if (!this.ruleForm.password) {
        this.errorMessage = '请输入您的账号密码'
        return false
      } else if (this.photoCpathaShow && !this.phoneKey) {
        this.errorMessage = '请输入图形验证码'
        return false
      }
      return true
    },
    // 账号登录
    loginClick() {
      if (!this.checkLoginClick()) return
      this.$fetch('loginInfo', {
        account: this.ruleForm.username,
        password: this.ruleForm.password,
        captcha: this.phoneKey,
        remember: this.accountChecked ? 1 : 0,
        visitor_id: sessionOrLocal.get('visitor_id')
          ? sessionOrLocal.get('visitor_id')
          : '', // 访客标识
        sso_token: sessionOrLocal.get('sso') ? sessionOrLocal.get('sso') : '', // sso服务生成的token（实现新、老控制台的同步登录用）
      })
        .then((res) => {
          if (res.code == 200) {
            this.errorMessage = ''
            this.loginDialogShow = false
            this.shadeShow = false
            this.phoneKey = ''
            this.photoCpathaShow = true
            sessionOrLocal.set('sso', res.data.sso_token)
            sessionOrLocal.set('token', res.data.token, 'localStorage')
            sessionOrLocal.set(
              'tokenRefresh',
              new Date().getTime(),
              'localStorage'
            )
            sessionOrLocal.set(
              'tokenExpiredTime',
              res.data.exp_time,
              'localStorage'
            )
            // sessionOrLocal.set('userInfo', res.data)
            this.fetchData()
          } else {
            if (res.code == 512042) {
              this.errorMessage = '图片验证码错误'
              this.callCaptcha('#photoCaptcha')
            }
            this.errorMessage = res.msg
          }
        })
        .catch((e) => {
          if (e.captcha[0] == '图形码未验证通过') {
            this.errorMessage = '图形码未验证通过'
          }
        })
    },
    fetchData() {
      this.$fetch('getInfo', { scene_id: 2 })
        .then((res) => {
          if (res.code === 200) {
            sessionOrLocal.set('userInfo', JSON.stringify(res.data))
            sessionOrLocal.set('userId', JSON.stringify(res.data.user_id))
          } else {
            sessionOrLocal.set('userInfo', null)
          }
          this.$router.go(0) // 重新进入
        })
        .catch((e) => {
          console.log(e)
        })
    },
    // 校验登录次数
    checkLoginAccount() {
      this.$fetch('loginCheckC', {
        account: this.ruleForm.username,
        channel: 'C',
      })
        .then((res) => {
          if (res.code == 200) {
            if (res.data.check_result == 1) {
              // 账号被锁定 再次登录需要图片验证
              this.photoCpathaShow = true
              this.callCaptcha('#photoCaptcha')
              if (this.phoneKey) {
                this.errorMessage = ''
                this.loginClick()
              }
            } else {
              this.errorMessage = ''
              this.loginClick()
            }
          } else {
            this.errorMessage = res.msg
          }
        })
        .catch((e) => {
          console.log('登录检查失败:', e)
        })
    },
    // 云链账号登录
    usersLogin() {
      this.typeControl = true
      this.isActive = true
      this.bottomLoginInfo = true
      this.errorMessage = ''
    },
    // 点击快捷进行登录
    messgeLogin() {
      this.typeControl = false
      this.isActive = false
      this.bottomLoginInfo = false
      this.smsErrorMessage = ''
      this.callCaptcha('#captcha')
    },
    // 点击活动
    activeClick(index) {
      let menu = this.menuList[index]
      this.activeIndex = index
      if (menu && menu.components) {
        if (menu.type == 1) {
          this.fetchMenuContent(index, menu)
        }
      } else {
        let fmenu = this.menuList[0]
        if (index == 0 && fmenu.type == 1) {
          this.fetchMenuContent(0, fmenu)
        }
      }
    },
    // 获取菜单内容
    fetchMenuContent(index) {
      let menu = this.menuList[index]
      const params = {
        menu_id: menu.id,
      }
      this.$fetch('getMenuDetailById', params).then((res) => {
        if (res.code == 200) {
          menu.components = res.data.components
          this.$set(this.menuList, index, menu)
        }
      })
    },
    fullScreen() {
      var docElm = document.querySelector('.seeding-content')
      // W3C
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen()
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen()
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen()
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen()
      }
    },
    // 获取菜单列表
    getMenuList() {
      this.$fetch('newWebinarMenus', {
        webinar_id: this.$route.params.il_id,
      }).then((res) => {
        if (res.code == 200) {
          this.menuData = res.data.list || []
          if (this.menuData && this.menuData.length) {
            const chat = this.menuData.find((d) => d.type == 3) || {}
            this.chatShow = chat.status || ''
          }
          this.menuData.map((item) => {
            item.components = []
            if (item.type != 2 && item.type != 3) {
              this.menuList.push(item)
            }
          })
          this.$nextTick(() => {
            this.activeClick(0)
          })
        }
      })
    },
    // 关注
    handleAttention() {
      if (this.isLogin) {
        if (!this.followStyle) {
          this.$fetch('attention', {
            at_id: this.hostInfo.id,
            type: 1,
          }).then((res) => {
            if (res.code == 200) {
              this.followStyle = true
              this.roominfo.modules.attention.follow = 1
              this.attentionContent = '取消关注'
            }
          })
        } else {
          this.$fetch('notAttention', {
            at_id: this.hostInfo.id,
            type: 1,
          }).then((res) => {
            if (res.code == 200) {
              this.followStyle = false
              this.roominfo.modules.attention.follow = 0
              this.attentionContent = '关注'
            }
          })
        }
      } else {
        this.callLogin()
      }
    },
    // 商品推荐
    getGoodsInfo() {
      this.$fetch('goodsList', {
        webinar_id: this.$route.params.il_id,
      }).then((res) => {
        if (res.code == 200) {
          this.goodsList = res.data.goods_list
          if (this.goodsList.length > 0) {
            this.sellGoodsShow = true
          }
        }
      })
    },
    // 菜单按钮的判断
    menuButton(value) {
      if (value.length < 5) {
        this.swiperPrevShow = false
        this.swiperNextShow = false
      }
    },
    /**
     * @description 获取聊天过滤相关关键字信息
     * @author Sean
     */
    chatFilter() {
      this.$fetch('getAudinceKeyWordList', {
        room_id: this.roomData.interact.room_id,
      }).then((res) => {
        if (res.code == 200 && res.data) {
          this.chatFilterData = res.data.list
        }
      })
    },
    handleSkipLogo() {
      window.location.href = this.roominfo.modules.logo.href
    },
    // 获取活动广告信息
    getAdsInfo() {
      return this.$fetch('queryAdsInfo', {
        webinar_id: this.$route.params.il_id,
        pos: 0,
        limit: 50,
      }).then((res) => {
        if (res.code == 200 && res.data) {
          this.ads = res.data.adv_list
        }
      })
    },
    // 获取关注人被关注数量
    getAttentionNum() {
      this.$fetch('getAttentionNum', {
        at_id: this.roominfo.host.id,
        type: 1,
      }).then((res) => {
        this.focusCount = res.data.count
      })
    },
    getOpenScreenConfig() {
      this.$fetch('getPlaybillInfo', {
        webinar_id: this.$route.params.il_id,
      }).then((res) => {
        if (res.code == 200 && res.data) {
          this.openScreenConfig = res.data['screen-posters']
        }
      })
    },
    // 获取观看端配置项
    getConfigList() {
      return this.$fetch('getConfigList', {
        webinar_id: this.$route.params.il_id,
        webinar_user_id: this.roomData.webinar.userinfo.user_id,
      }).then((res) => {
        if (res.code == 200 && res.data && res.data.permissions) {
          this.configList = JSON.parse(res.data.permissions)
        }
      })
    },
    // 获取皮肤
    // getSkin () {
    //   return this.$fetch('watchGetWebinarSkin', {
    //     webinar_id: this.$route.params.il_id
    //   }).then(res => {
    //     if (res.code == 200 && res.data) {
    //       this.skinInfo = res.data
    //       this.theme = (this.skinInfo && this.skinInfo.skin_json_pc) ? JSON.parse(this.skinInfo.skin_json_pc) : ''
    //     }
    //   })
    // },
    // 设置主题
    setCustomTheme(data) {
      let { bgColor, pageStyle, popStyle, background } = data
      let header = document.querySelector('.wh-title')
      let content = document.querySelector('.back-content')
      let bottom = document.querySelector('.bottom-bgColor')
      let seedIcon = document.querySelector('.seeding-icon')
      let followBtn = document.querySelector('.seeding-inforight .focusBtn')
      let followNum = document.querySelector('.seeding-inforight .focusCount')

      let fullScreen = document.querySelector('.seeding-inforight .full-screen')
      let watchContent = document.querySelector('.watch-middle-cotent')
      let activeRecommnd = document.querySelector('.active-second')
      let title = document.querySelector('.active-second>h3')
      let shop = document.querySelector('.sell-goods')
      let menu = document.querySelector('.active-introduce')
      let menuTitle = document.querySelector('.active-introduce>h3')
      setTimeout(() => {
        let sellBtn = document.querySelector(
          '.sell-goods .el-carousel__item .selling'
        )
        if (sellBtn) {
          sellBtn.style.background = pageStyle
        }
      }, 1000)

      if (header) {
        header.style.background = bgColor
      }
      if (content) {
        content.style.background = bgColor
      }
      if (bottom) {
        bottom.style.background = bgColor
      }
      if (activeRecommnd) {
        activeRecommnd.style.background = bgColor
      }
      if (shop) {
        shop.style.background = bgColor
      }
      if (menu) {
        menu.style.background = bgColor
      }

      if (title) {
        title.style.borderBottom = `2px solid ${pageStyle}`
      }
      if (menuTitle) {
        menuTitle.style.borderBottom = `2px solid ${pageStyle}`
      }
      if (seedIcon) {
        seedIcon.style.background = pageStyle
      }
      if (followBtn) {
        followBtn.style.background = pageStyle
      }
      if (followNum) {
        followNum.style.background = pageStyle
      }
      if (fullScreen) {
        fullScreen.style.background = pageStyle
      }
      if (watchContent) {
        watchContent.style.background = `url(${background})`
        watchContent.style.backgroundSize = 'cover'
        watchContent.style.backgroundRepeat = 'no-repeat'
      }
    },
    // 获取公众号广告
    getPublisAdv() {
      return this.$fetch('getScreenPublicInfo', {
        webinar_id: this.$route.params.il_id,
      }).then((res) => {
        if (res.code == 200 && res.data) {
          this.publicAdv = res.data
        }
      })
    },
    // 获取开屏海报
    getFirstPost() {
      return this.$fetch('watchInterGetFirstPost', {
        webinar_id: this.$route.params.il_id,
      }).then((res) => {
        if (res.code == 200 && res.data) {
          this.firstPost = res.data
        }
      })
    },
    // 获取标记 logo 主办方信息
    getSignInfo() {
      return this.$fetch('watchInterGetWebinarTag', {
        webinar_id: this.$route.params.il_id,
      }).then((res) => {
        if (res.code == 200 && res.data) {
          this.signInfo = res.data
        }
      })
    },
    // 获取房间活动状态
    queryRoomInterInfo() {
      return this.$fetch('getToolStatus', {
        room_id: this.roomData.interact.room_id,
      }).then((res) => {
        if (res.code == 200 && res.data) {
          this.interactiveInfo = res.data
        }
      })
    },
    // 获取邀请卡信息
    getInviteStatus() {
      return this.$fetch('shwoInvite', {
        webinar_id: this.$route.params.il_id,
        join_id: this.roomData.join_info.join_id,
      }).then((res) => {
        if (res.code == 200 && res.data) {
          this.inviteInfo = res.data
        }
      })
    },
    // 获取关注状态
    getAttentionStatus() {
      return this.$fetch('attentionStatus', {
        at_id: this.roomData.webinar.userinfo.user_id,
        type: 1, // 关注人
      }).then((res) => {
        if (res.code == 200) {
          this.attentionStatus = res.data.result
        }
      })
    },
    handleRoomInfo() {
      let data = this.roomData,
        userInfo = this.userInfo,
        text =
          data.webinar.type == 1
            ? '直播'
            : data.webinar.type == 2
            ? '预约'
            : data.webinar.type == 3
            ? '结束'
            : data.webinar.type == 4
            ? '点播'
            : '回放'
      this.roominfo = {
        webinar: Object.assign({}, data.webinar, {
          image_url: data.webinar.img_url,
          is_interact: data.webinar.mode == 3 ? 1 : 0,
          pv: data.pv.num,
        }),
        // advs: this.ads,
        auth: this.isLogin
          ? {
              avatar: data.join_info.avatar,
              id: this.userInfo
                ? this.userInfo.user_id
                : data.join_info.third_party_user_id,
              nick_name: this.userInfo
                ? this.userInfo.nick_name
                : data.join_info.nickname,
              phone: this.userInfo ? this.userInfo.phone : '',
            }
          : [],
        interactiveInfo: this.interactiveInfo ? this.interactiveInfo : {},
        rebroadcast: data.rebroadcast,
        open_question: this.interactiveInfo
          ? this.interactiveInfo.question_status
          : 0,
        report_extra: data.report_data.report_extra,
        vss_token: data.interact.interact_token,
        room_id: data.interact.room_id,
        app_id: data.interact.paas_app_id,
        channel_id: data.interact.channel_id,
        inav_id: data.interact.inav_id,
        introduction: data.webinar.introduction,
        paas_access_token: data.interact.paas_access_token,
        // inviteInfo: this.inviteInfo ? this.inviteInfo : {status: 0},
        // skin: {
        //   skin_json_pc : (this.skinInfo && this.skinInfo.skin_json_pc) ? (this.skinInfo.skin_json_pc ? JSON.parse(this.skinInfo.skin_json_pc) : '') : {},
        //   skin_json_wap: (this.skinInfo && this.skinInfo.skin_json_wap) ? (this.skinInfo.skin_json_wap ? JSON.parse(this.skinInfo.skin_json_wap) : '') : {}
        // },
        user: {
          avatar: data.join_info.avatar,
          nick_name: data.join_info.nickname,
          role_name: 2, // TODO:
          saas_join_id: data.join_info.join_id,
          third_party_user_id: data.join_info.third_party_user_id,
          account_id: data.join_info.third_party_user_id,
          is_gag: data.join_info.is_gag,
          is_kick: data.join_info.is_kick,
        },
        domains: {
          static: data.urls.static_url,
          upload: data.urls.upload_url,
          web: data.urls.web_url,
          webinar: '//' + document.domain,
        },
        hd_definition: this.interactiveInfo
          ? this.interactiveInfo.hd_definition
          : '',
        push_definition: this.interactiveInfo
          ? this.interactiveInfo.push_definition
          : '',
        host: {
          id: data.webinar.userinfo.user_id,
          nick_name: data.webinar.userinfo.nickname,
          avatar: data.webinar.userinfo.avatar,
        },
        base_online_num: data.online.num,
        base_pv: data.pv.num,
        is_replay: data.webinar.type == 5 ? 2 : 1,
        // is_replay: data.webinar.type == 5 || data.webinar.type == 4,
        paas_record_id: data.paas_record_id,
        record_history_time: '', // TODO:
        share_id: data.share_id,
        player: {},
        modules: {
          //   logo: {
          //     show: this.signInfo ? this.signInfo.view_status : 0, // 观看标志w
          //     href: this.signInfo ? this.signInfo.skip_url : '',
          //     image: this.signInfo ? this.signInfo.logo_url : '',
          //     reserved_status: this.signInfo ? this.signInfo.reserved_status : 0, // 版权信息
          //     organizers_status: this.signInfo ? this.signInfo.organizers_status : 0// 主办方信息
          //   },
          attention: {
            show: 1,
            follow: this.isLogin ? this.attentionStatus : 0,
          },
          // initiator: {show: this.signInfo ? this.signInfo.organizers_status : 0},
          initiator: { show: 1 },
          // adv: {
          //   public: (this.publicAdv && this.publicAdv['public-account']) ? this.publicAdv['public-account'] : [], // 公众号广告
          //   posters: (this.firstPost && this.firstPost['screen-posters']) ? this.firstPost['screen-posters'] : [] // 开屏广告
          // },
          // barrage: {hide: this.configList['ui.hide_barrage']},
          online: { show: data.online.show }, // 在线人数
          reg: { show: data.webinar.reg_form }, // 报名表单
          pv: { show: data.pv.show }, // 热度
          webinar_status: { show: data.webinar.type, text: text }, // 直播状态
          reward: {
            show: this.configList ? this.configList['ui.hide_reward'] : 0,
          },
          gift: {
            show: this.configList ? this.configList['ui.hide_gifts'] : 0,
          },
          like: {
            show: this.configList ? this.configList['ui.watch_hide_like'] : 0,
          },
          share: {
            show: this.configList ? this.configList['ui.hide_share'] : 0,
          },
          chat_login: { show: 1 },
        },
        reportOption: data.report_data ? data.report_data : {},
      }

      this.myliveRoute = window.location.origin + '/live/list'
      this.accountRoute = window.location.origin + '/finance/info'
      this.myPageRoute =
        window.location.origin + `/user/home/${this.userInfo.user_id}`
      this.myAccountRoute = window.location.origin + '/acc/info'
      this.followStyle = this.roominfo.modules.attention.follow == 1

      this.userChatId = this.roominfo.user.third_party_user_id
      // 获取所有的主域名
      this.webDominUrl = this.roominfo.domains.web
      this.webinarDominUrl = this.roominfo.domains.webinar
      // 获取pv的观看数
      this.roomUser.pvCount = data.pv.num
      sessionOrLocal.set(
        'defaultMainscreenDefinition',
        this.roominfo.push_definition || ''
      )
      sessionOrLocal.set(
        'defaultSmallscreenDefinition',
        this.roominfo.hd_definition || ''
      )
      sessionOrLocal.set('userInfo', this.roominfo.user)
      this.baseRoomUser.baseOnlineNum = Number(this.roominfo.base_online_num)
      sessionOrLocal.set(
        'baseOnlineNumber',
        Number(this.roominfo.base_online_num)
      )
      this.baseRoomUser.basePv = Number(this.roominfo.base_pv)
      if (this.roominfo.advs.length > 0) {
        this.menuButton(this.roominfo.advs)
      }

      this.hostInfo = this.roominfo.host
      this.roominfo.webinar_id = this.roominfo.webinar.id
      this.activeInfo = this.roominfo.webinar
      this.domains = this.roominfo.domains
      // 存取图片的主要路径，给七巧板用
      sessionOrLocal.set('imageDomin', this.roominfo.domains.upload)
      // 存取用户信息给七巧板用
      // 存取VssToke
      sessionOrLocal.set('vhall-vsstoken', this.roominfo.vss_token)
      sessionOrLocal.set('moduleShow', JSON.stringify(this.roominfo))
      // 关注的显示
      if (this.roominfo.modules.logo.organizers_status == 1) {
        this.attentionShow = true
      } else {
        this.attentionShow = false
      }
      // 在线人数的显示
      this.roominfo.modules.online.show == 1
        ? (this.onlineShow = true)
        : (this.onlineShow = false)
      // 观看次数的显示
      this.roominfo.modules.pv.show == 1
        ? (this.pvShow = true)
        : (this.pvShow = false)
      // 注册的显示
      this.roominfo.modules.reg.show == 1
        ? (this.regShow = true)
        : (this.regShow = false)
      // 主办方直播图标的显示
      this.roominfo.modules.webinar_status.show == 1
        ? (this.iconPlayShow = true)
        : (this.iconPlayShow = false)
      this.iconPlay = this.roominfo.modules.webinar_status.text
      if (this.roominfo.modules.webinar_status.text == '回放') {
        this.$nextTick(() => {
          const seedingContent = document.querySelector('.seeding-icon')
          if (seedingContent) {
            seedingContent.style.background = '#2ab804'
          }
        })
      } else if (this.roominfo.modules.webinar_status.text == '点播') {
        this.$nextTick(() => {
          const seedingContent = document.querySelector('.seeding-icon')
          if (seedingContent) {
            seedingContent.style.background = '#ff8834'
          }
        })
      }
      // 获取 推荐商品数据
      this.getGoodsInfo()
      // end
      this.chatFilter() // 聊天过滤接口
      this.getAttentionNum()
      this.recordHistoryTime = data.record_history_time // TODO:
      // 初始化数据上报
      this.initVHallReport()
      // 初始化邀请卡
      // this.$nextTick(() => {
      //   if (this.theme && this.skinInfo.status == 1) {
      //     this.setCustomTheme(this.theme)
      //   }
      // })
    },
    /**
     * @description 数据上报  init 方法
     *
     */
    initVHallReport() {
      window.vhallReport = new VhallReport({
        pf: 7,
        user_id: this.roomData.join_info.join_id,
        webinar_id: this.$route.params.il_id,
        t_start: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        entry_time: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        service_names: this.roominfo.is_replay == 1 ? 2 : 1,
        type: 3,
        env:
          process.env.VUE_APP_NODE_ENV === 'production' ? 'production' : 'test',
      })
      window.vhallReport &&
        window.vhallReport.report('ENTER_WATCH', {
          event: this.$route.query.refer, // 推广渠道，会在url里传参
        })
      // 浏览器或者页面关闭时上报
      window.addEventListener('beforeunload', function (e) {
        // 离开H5观看端页面
        if (/room\/watch/.test(window.location.pathname)) {
          window.vhallReport &&
            window.vhallReport.report('LEAVE_WATCH', {}, false)
        }
      })
    },
    // 退出登录
    quitLive() {
      this.$fetch('loginOut')
        .then((res) => {
          if (res.code == 200) {
            sessionOrLocal.clear('localStorage')
            sessionOrLocal.clear()
            clearCookies()
            this.$nextTick(() => {
              window.location.reload()
            })
          }
        })
        .catch((res) => {
          this.$message({
            message: res.msg || `退出失败`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box',
          })
          console.log('退出失败', res)
        })
    },
  },
}
</script>
<style lang="less">
.el-loading-spinner .path {
  stroke: #fc5659 !important;
}
.watch-wraps {
  margin: 0 auto;
  background: #fff;
  overflow-y: hidden;
  position: relative;
  height: 100%;
  .seeding-contents {
    clear: both;
    // margin-top: 20px;
    /* width: 100%; */
    // height: 721px;
    height: 100%;
    background: #000;

    .vhall-kick-outs {
      text-align: center;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 99;
      background: rgba(0, 0, 0, 0.68);
      background: url('//t-alistatic01.e.vhall.com/static/img/webinar.png')
        no-repeat;
      background-size: cover;
      h1 {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        text-align: center;
        margin: auto;
        font-size: 24px;
        line-height: 80px;
        height: 80px;
        color: #fff;
        text-align: center;
      }
    }
  }
  .shade {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    background: #000;
    opacity: 0.5;
    z-index: 3;
  }
  .active-left {
    min-width: 700px;
    flex: 1;
  }

  .loginUserInfo {
    // width: 200px;
    // height: 70px;
    cursor: pointer;
    float: right;
    display: inline-block;
    height: 70px;
    line-height: 20px;
    img {
      border-radius: 50%;
      width: 38px;
      height: 38px;
      margin-top: 6px;
      vertical-align: middle;
      margin-left: 15px;
      margin-right: 10px;
    }
    .login-nickName {
      display: inline-block;
      font-size: 14px;
      margin-top: 22px;
      span {
        display: inline-block;
        vertical-align: sub;
      }

      span:last-of-type {
        display: inline-block;
        width: 0;
        height: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 5px solid #666;
        margin-left: 10px;
        margin-bottom: 2px;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .wh-title {
    max-width: 1480px;
    line-height: 70px;
    // min-width: 1220px;
    margin: 0 auto;
    overflow: hidden;
    // position: relative;
    padding-left: 80px;
    padding-right: 80px;
    .title-right {
      float: right;
    }
    .logo-image {
      width: 80px;
      height: 38px;
      float: left;
      margin-top: 16px;
    }

    .login-info-list {
      position: absolute;
      right: 0;
      top: 70px;
      z-index: 66;
      width: 200px;
      height: 282px;
      cursor: pointer;
      background: #fff;
      margin-right: 8px;

      li {
        width: 198px;
        height: 40px;
        text-align: center;
        line-height: 40px;
        cursor: pointer;

        i {
          display: inline-block;
          vertical-align: middle;
          margin-top: 3px;
        }
        span {
          display: inline-block;
          vertical-align: middle;
          font-size: 14px;
          color: #333;
        }
        &:hover {
          span {
            color: #e8403f;
          }
        }
      }

      li:first-of-type {
        i {
          width: 21px;
          height: 19px;
          background: url(https://t-alistatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
            no-repeat -70px -17px;
        }
        &:hover {
          i {
            background: url(https://t-alistatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
              no-repeat -130px -17px;
          }
        }
      }
      li:nth-of-type(2) {
        width: 200px;
        border-bottom: 1px solid #ccc;
        i {
          width: 21px;
          height: 19px;
          background: url(https://t-alistatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
            no-repeat -71px -68px;
        }
        &:hover {
          i {
            background: url(https://t-alistatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
              no-repeat -130px -68px;
          }
        }
      }
      li:nth-of-type(3) {
        i {
          width: 21px;
          height: 19px;
          background: url(https://t-alistatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
            no-repeat -71px -238px;
        }
        &:hover {
          i {
            background: url(https://t-alistatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
              no-repeat -131px -238px;
          }
        }
      }
      li:nth-of-type(4) {
        i {
          width: 21px;
          height: 19px;
          background: url(https://t-alistatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
            no-repeat -70px -95px;
        }
        &:hover {
          i {
            background: url(https://t-alistatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
              no-repeat -130px -95px;
          }
        }
      }
      li:nth-of-type(5) {
        width: 200px;
        border-bottom: 1px solid #ccc;
        i {
          width: 21px;
          height: 19px;
          background: url(https://t-alistatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
            no-repeat -70px -118px;
        }
        &:hover {
          i {
            background: url(https://t-alistatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
              no-repeat -130px -118px;
          }
        }
      }
      li:nth-of-type(6) {
        i {
          width: 21px;
          height: 19px;
          background: url(https://t-alistatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
            no-repeat -70px -142px;
        }
        &:hover {
          i {
            background: url(https://t-alistatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
              no-repeat -130px -142px;
          }
        }
      }
      li:nth-of-type(7) {
        i {
          width: 21px;
          height: 19px;
          background: url(https://t-alistatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
            no-repeat -70px -167px;
        }
        &:hover {
          span {
            color: #333;
          }
        }
      }
    }
  }
  .search-input {
    width: 220px;
    height: 38px;
    // margin-left: 1000px;
    // vertical-align: middle;
    margin-top: 2px;
  }

  .button-style {
    width: 70px;
    height: 38px;
  }

  .button-register {
    background: #fc5659;
    color: #fff;
    border: none;
  }

  .button-login {
    /* float: right; */
    /* margin-right: 20px; */
    border: none;
    margin-left: 20px;
    background: #e7e7e7;
    color: #333;
  }

  .button-login:hover {
    color: #333;
    border-color: none;
  }

  .button-register:hover {
    background: #fc5659;
    color: #fff;
  }
  .back-content {
    // max-width: 1640px;
    min-width: 1220px;
    background: rgba(232, 233, 235, 1);

    .bottom-content {
      max-width: 1480px;
      margin: 0 auto;
      padding-left: 80px;
      padding-right: 80px;
      display: flex;
    }
  }

  .watch-content {
    // max-width: 1480px;

    margin: 0 auto;
    overflow: hidden;

    .watch-middle-cotent {
      overflow: hidden;
      padding-left: 80px;
      padding-right: 80px;
      padding-bottom: 15px;
      .watch-width-content {
        max-width: 1480px;
        margin: 0 auto;
      }
    }
    .skin-logo {
      float: left;
      width: 80px;
      height: 80px;
      margin-top: 30px;
      margin-right: 15px;
    }
    .seeding-infoleft {
      margin-top: 30px;
      float: left;
      .seeding-title {
        display: inline-block;
        vertical-align: middle;
        font-size: 20px;
        margin-bottom: 24px;
      }

      span {
        font-size: 16px;
      }
    }

    .seeding-inforight {
      margin-top: 32px;
      float: right;
      margin-bottom: 20px;
      height: 73px;

      .pv-online-account {
        width: 250px;
        height: 41px;
        overflow: hidden;
      }
      .seeding-funct {
        div {
          float: left;
        }
      }

      .follow {
        float: left;
        text-align: center;
        width: 114px;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        background: rgba(213, 213, 213, 1);
        border-radius: 19px;
        color: #444;
        cursor: pointer;
      }

      .follow:hover,
      .full-screen:hover {
        color: #fff;
        background: #fc5659;
      }
      .followShow {
        float: left;
        text-align: center;
        width: 114px;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        border-radius: 19px;
        cursor: pointer;
        color: #fff;
        background: #fc5659;
      }
      .full-screen {
        float: right !important;
        margin-left: 20px;
        width: 114px;
        height: 32px;
        background: rgba(213, 213, 213, 1);
        border-radius: 19px;
        text-align: center;
        line-height: 32px;
        font-size: 14px;
        color: #444;
        cursor: pointer;
      }
    }

    .seeding-icon {
      display: inline-block;
      vertical-align: middle;
      margin-bottom: 24px;
      margin-top: 2px;
      width: 32px;
      height: 18px;
      color: #fff;
      text-align: center;
      font-size: 12px !important;
      /* padding: 3px 3px 2px 3px; */
      background: rgba(252, 86, 89, 1);
    }

    .seeding-contents {
      clear: both;
      // margin-top: 20px;
      /* width: 100%; */
      // height: 721px;
      height: 100%;
      background: #000;

      .vhall-kick-outs {
        text-align: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99;
        background: rgba(0, 0, 0, 0.68);
        background: url('//t-alistatic01.e.vhall.com/static/img/webinar.png')
          no-repeat;
        background-size: cover;
        h1 {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          text-align: center;
          margin: auto;
          font-size: 24px;
          line-height: 80px;
          height: 80px;
          color: #fff;
          text-align: center;
        }
      }
    }

    .active-introduce {
      margin-top: 20px;
      border: 1px solid #c7c7c7;
      /* width: 1166px; */
      width: 100%;
      background: #fff;
      float: left;
      color: #fff;

      h3 {
        margin-top: 15px;
        padding-bottom: 15px;
        color: #666;
        margin-left: 30px;
        width: 80px;
        line-height: 25px;
        text-align: center;
        border-bottom: 2px solid #fc5659;
        float: left;
      }

      hr {
        clear: both;
        background-color: #c7c7c7;
        height: 1px;
        border: none;
      }

      .active-content {
        clear: both;
        padding: 20px 30px;

        .active-introduce-content {
          color: #666;
          font-size: 14px;
          letter-spacing: 1px;
        }
        ul {
          li {
            color: #72b3fa;
            float: left;
            font-size: 16px;
            padding-left: 16px;

            &::after {
              content: '|';
              margin-left: 16px;
            }
          }
        }
        li:last-of-type {
          &::after {
            content: '';
            margin-left: 16px;
          }
        }
      }

      .topic-title {
        float: left;
        color: #666;
      }

      .active-link {
        width: 100%;
        height: 15px;
      }

      .active-info {
        width: 100%;
        color: #666;
        /* height: 100px; */

        .active-phop {
          color: #666;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
      h4 {
        color: #666;
      }

      .topic-content {
        clear: both;
        margin-top: 40px;
        color: #666;
        font-size: 14px;
        line-height: 28px;
      }
    }

    .active-second {
      /* width: 1166px; */
      width: 100%;
      background: #fff;
      color: #fff;
      float: left;
      margin-top: 30px;
      border: 1px solid #c7c7c7;
      margin-bottom: 40px;
      hr {
        background-color: #c7c7c7;
        height: 1px;
        border: none;
      }

      h3 {
        margin-top: 30px;
        color: #666;
        padding-bottom: 30px;
        margin-left: 30px;
        width: 80px;
        border-bottom: 2px solid #fc5659;
      }
      .slide-image {
        width: 1139px;
        height: 220px;
        /* overflow: hidden; */
      }
      .active-recommond {
        position: relative;
        padding: 20px 30px;
        // width: 1139px;
        height: 220px;

        .swiper-container {
          // width: 1139px;
          width: 100.3%;
        }
        .swiper-button-prev {
          // margin-left: -126px !important;
          margin-top: -45px;
          left: -49%;
          background-image: url(./img/left.png) !important;
        }
        .swiper-button-prev:hover {
          background-image: url(./img/leftClick.png) !important;
        }

        .swiper-button-next {
          right: -47.7%;
          margin-top: -45px;
          background-image: url(./img/right.png) !important;
        }

        .swiper-button-next:hover {
          background-image: url(./img/rightClick.png) !important;
        }
        div {
          // width: 260px;
          width: 100%;
          float: left;
          /* margin-right: 19px; */
          /* position: relative; */
          .left-mark {
            display: block;
            width: 35px;
            height: 18px;
            background: #a560cf;
            text-align: center;
            line-height: 18px;
            color: #fff;
            position: absolute;
            left: 0;
            top: 0;
            font-size: 12px;
          }
          p {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
            font-size: 14px;
            line-height: 20px;
            letter-spacing: 0.5px;
          }

          img {
            // width: 260px;
            width: 95%;
            height: 146px;
          }

          .recommond-contents {
            padding: 2px;
            margin: 0 auto;
            width: 241px;
            text-align: center;

            p {
              width: auto;
              display: inline-block;
              text-align: left;
            }
          }
        }

        div:last-of-type {
          margin-right: 0;
        }
      }
    }

    .sell-goods {
      /* width: 234px; */
      margin-left: 15px;
      width: 16%;
      height: 100%;
      padding: 30px;
      float: right;
      background: #fff;
      margin-top: 20px;
      margin-bottom: 40px;
      border: 1px solid #d2d2d2;
      cursor: pointer;
      .sell-image {
        display: block;
        width: 234px;
        height: 234px;
        margin: 0 auto;

        img {
          width: 234px;
          height: 234px;
        }
      }

      .sell-title {
        font-size: 19px;
        margin-top: 20px;
        margin-bottom: 10px;
        font-family: @fontMedium;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
        line-height: 26px;
        word-break: break-all;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .sell-info {
        font-size: 14px;
        line-height: 20px;
        font-family: @fontRegular;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
        margin-top: 20px;
        margin-bottom: 20px;
        max-width: 230px;
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .selling {
        width: 234px;
        height: 30px;
        line-height: 8px;
        background: rgba(252, 86, 89, 1);
        color: #fff;
        font-size: 12px;
        border: none;
      }

      .go-store {
        display: block;
        color: rgba(252, 86, 89, 1);
        font-size: 12px;
        width: 50px;
        margin: 0 auto;
        margin-top: 20px;
      }
    }
  }

  .iconguankancishu-copy {
    font-size: 13px;
    margin-left: 5px;
    margin-right: 5px;
  }

  .iconzaixianrenshu-copy {
    font-size: 15px;
    margin-right: 5px;
  }

  @media screen and (max-width: 1480px) {
    .search-input {
      // margin-left: 740px;
    }
    .active-second {
      /* width: 1052px !important; */
      /* overflow-x: scroll !important; */
    }
    .active-introduce {
      /* width: 1052px !important; */
    }
    .sell-goods {
      /* width: 190px !important; */
    }

    .swiper-container {
      // width: 1025px !important;
    }

    .recommond-content {
      // width: 234px !important;
      margin-right: 17px !important;

      img {
        // width: 234.1px !important;
      }
    }
    .swiper-button-next {
      // right: -96px !important;
      // margin-top: -45px;
      // background-image: url(./img/right.png) !important;
    }
    .selling {
      width: 195px !important;
    }

    .sell-image {
      width: 195px !important;
      height: 195px !important;
      img {
        width: 195px !important;
        height: 195px !important;
      }
    }
  }
  .invite-reward-list {
    width: 400px;
    /* height: 441px; */
    /* position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto; */
    background: url('https://t-alistatic01.e.vhall.com/static/images/mobile/bang-bg.png?v=fU6YKk49PdUizDjMr88d7g%3D%3D');
    background-size: 90%, 90%;

    .inviteRules {
      width: 95%;
      line-height: 18px;
      margin: 0 auto;
      font-size: 12px;
      color: #666;
      background: #f2f2f2;
      margin-bottom: 6px;
      text-indent: 12px;
      word-wrap: break-word;
      padding: 8px;
      box-sizing: border-box;
    }
    .rank-title {
      width: 379px;
      height: 40px;
      line-height: 40px;
      margin: 0 auto;
      color: #fff;
      font-size: 14px;
      padding-top: 5px;

      span {
        width: 54px;
        height: 31px;
        line-height: 31px;
        display: block;
        letter-spacing: 1px;
        float: left;
        cursor: pointer;
        color: #ddd;
      }
      span:hover {
        color: #fff;
      }
      span:first-of-type {
        margin-right: 10px;
      }
      span:last-of-type {
        margin-left: 10px;
        width: 90px;
        float: right;
        color: #fff;
      }
    }

    .rank-box {
      width: 380px;
      height: 347px;
      margin: 0 auto;
      background: #fff;
      position: relative;
      /* display: flex;
            justify-content: center;
            align-items:center; */
    }
    .bottom-invite {
      width: 100%;
      height: 40px;
      line-height: 40px;
      color: #4da1ff;
      text-align: center;
      font-size: 14px;
      p {
        cursor: pointer;
      }
    }
  }

  // 样式冲突
  // .logins-dialog {
  //   width: 400px;
  //   height: 430px;
  //   background: rgba(255, 255, 255, 1);
  //   box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.2);
  //   border-radius: 4px;
  //   position: fixed;
  //   top: 0;
  //   bottom: 0;
  //   left: 0;
  //   right: 0;
  //   margin: auto;
  //   z-index: 669;
  //   .head {
  //     width: 100%;
  //     height: 54px;
  //     line-height: 54px;
  //     p {
  //       width: 197px;
  //       font-size: 16px;
  //       font-weight: 400;
  //       color: rgba(51, 51, 51, 1);
  //       text-align: center;
  //       height: 22px;
  //       line-height: 22px;
  //       display: inline-block;
  //     }
  //     p:hover {
  //       color: rgba(252, 86, 89, 1);
  //       cursor: pointer;
  //     }
  //     .active {
  //       margin-top: 0;
  //       margin-bottom: 60px;
  //       color: rgba(252, 86, 89, 1);
  //     }
  //   }
  .logins-dialog {
    width: 400px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 8px 1px rgba(0, 0, 0, 0.2);
    border-radius: 4px;
    position: fixed;
    display: block;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -200px;
    // position: fixed;
    // top: 0;
    // bottom: 0;
    // left: 0;
    // right: 0;
    // margin: auto;
    z-index: 1000;
    /deep/ .el-input__inner:focus {
      border-color: #999;
      outline: 0;
    }
    .wrap-code {
      position: relative;
      .duanxinCode {
        position: absolute;
        right: 5px;
        top: 5px;
        width: 90px;
        height: 30px;
        cursor: pointer;
        font-size: 12px;
        line-height: 5px;
        // background: #fc5659;
        border-radius: 2px;
        // color: #fff;
        text-align: center;
        border: none;
      }
    }
    .head.left .line {
      transform: translateX(0);
    }
    .head.right {
      /deep/ .line {
        transform: translateX(100%);
      }
    }
    .head {
      width: 100%;
      height: 54px;
      line-height: 54px;
      border-bottom: 1px solid #dcdcdc;
      position: relative;

      p {
        width: 197px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        text-align: center;
        height: 22px;
        line-height: 22px;
        display: inline-block;
        cursor: pointer;
      }
      .line {
        position: absolute;
        bottom: 0px;
        left: 0px;
        width: 50%;
        transition: 0.2s;
        border-bottom: 1px solid rgba(252, 86, 89, 1);
        .after {
          position: absolute;
          display: block;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) rotate(45deg);
          width: 10px;
          height: 10px;
          background-color: #fff;
          border: 1px solid rgba(252, 86, 89, 1);
          border-right: 0px;
          border-bottom: 0px;
        }
      }
      /*p:hover {*/
      /*  color: rgba(252, 86, 89, 1);*/
      /*}*/
      .active {
        margin-top: 0;
        margin-bottom: 60px;
        color: rgba(252, 86, 89, 1);
      }
    }
    .userLogin {
      width: 270px;
      margin: 0 auto;
      margin-top: 37px;

      .errorImage {
        background: #fc5659;
        color: #fff;
        border-radius: 50%;
        display: inline-block;
        width: 16px;
        height: 16px;
        text-align: center;
        line-height: 16px;
      }

      .login-button {
        width: 270px;
        height: 40px;
        background: rgba(252, 86, 89, 1);
        border-radius: 2px;
        color: #fff;
        letter-spacing: 3px;
        border: none;
        margin-top: 20px;
        &:hover {
          background: #ff7b78;
        }
      }
      .smslogin-button {
        margin-bottom: 50px;
      }
      .auto-login {
        color: #333;
        font-size: 12px;
      }

      .forget-password {
        float: right;
        a {
          color: #333;
          &:hover {
            color: #fc5659;
          }
        }
      }
      /deep/ .el-checkbox__inner:hover {
        border-color: #fc5659;
      }
      /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
        background-color: #fff;
        border: 1px solid #dcdfe6;
      }
      /deep/ .el-checkbox__inner::after {
        border: 1px solid #fc5659;
        border-left: 0;
        border-top: 0;
      }
    }
  }

  .bottom-login {
    width: 270px;
    margin: 0 auto;

    .rightnow-reg {
      text-align: center;
      font-size: 13px;
      span:first-of-type {
        color: #333;
        margin-right: 5px;
      }
      span:last-of-type {
        color: #fc5659;
      }
      a {
        color: #333;
        &:hover {
          color: #fc5659;
        }
      }
    }
  }
  .downLogin {
    margin-bottom: 30px;
  }
  .other-login {
    margin: 0 auto;
    font-size: 12px;
    color: #999;
    text-align: center;
    margin-top: 14px;
    user-select: none;
    cursor: pointer;
    span:last-of-type {
      color: #666;
    }
    .ionc {
      // transform: rotate(45deg);
      span {
        width: 15px;
        height: 17px;
        display: inline-block;
        vertical-align: middle;
      }
      .ioncPickUp {
        background-position: -40px -142px;
        background: url('https://t-alistatic01.e.vhall.com/static/images/vhall3.0/login_spirt.png?v=TTFVyijQs0w%2BDrAG7%2B%2FB3g%3D%3D')
          no-repeat -12px -143px;
      }
      .ioncPickDown {
        background: url('https://t-alistatic01.e.vhall.com/static/images/vhall3.0/login_spirt.png?v=TTFVyijQs0w%2BDrAG7%2B%2FB3g%3D%3D')
          no-repeat -42px -143px;
      }
    }
    i {
      font-size: 12px;
    }
  }
  .third-way-choose {
    text-align: center;
    margin-bottom: 20px;
    .third-auth {
      text-align: center;
      display: inline-block;
      vertical-align: middle;
      padding: 12px 0 0 0;
    }
    .third-auth a {
      display: inline-block;
      width: 20px;
      height: 20px;
      background: #000;
      margin: 0px 10px;
    }
    .third-auth .weibo {
      background: url(https://t-alistatic01.e.vhall.com/static/images/vhall3.0/login_spirt.png?v=TTFVyijQs0w%2BDrAG7%2B%2FB3g%3D%3D)
        no-repeat -10px -227px;
    }
    .third-auth .weibo:hover {
      background-position: -39px -227px;
    }
    .third-auth .qq {
      background: url(https://t-alistatic01.e.vhall.com/static/images/vhall3.0/login_spirt.png?v=TTFVyijQs0w%2BDrAG7%2B%2FB3g%3D%3D)
        no-repeat -10px -166px;
    }
    .third-auth .qq:hover {
      background-position: -39px -166px;
    }
    .third-auth .weixin:hover {
      background-position: -39px -196px;
    }
    .third-auth .weixin {
      background: url(https://t-alistatic01.e.vhall.com/static/images/vhall3.0/login_spirt.png?v=TTFVyijQs0w%2BDrAG7%2B%2FB3g%3D%3D)
        no-repeat -10px -196px;
    }
  }
  .botton-image {
    width: 113px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
    img {
      margin-top: 12px;
      width: 15px;
      height: 15px;
    }
  }
  // }
  // }
  // }

  .qrcodeDialog {
    width: 260px;
    height: 260px;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: 9;
    background: #fff;
    .qrcodeHead {
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      font-size: 12px;
    }
    .closeQrcode {
      font-size: 20px;
      position: absolute;
      right: 20px;
      top: 10px;
      cursor: pointer;
    }
    img {
      width: 260px;
      height: 260px;
    }
  }
}
</style>
