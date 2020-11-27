<template>
  <chrome v-if="downloadChrome" :type="'client'"> </chrome>
  <tip v-else-if="tipMsg" :text="tipMsg"> </tip>
  <div v-else class="watch-wraps">
    <div class="seeding-contents">
      <vhall-enjoy-watch-Saas
        v-if="roominfo.vss_token && !kickOutSass"
        @descripe="decripeMenu"
        :playerInfo="roominfo.player"
        @onlineJoin="onlinePeople"
        :authInfo="roominfo.auth"
        :roomId="roominfo.room_id"
        :ilId="roominfo.webinar_id"
        :vssToken="roominfo.vss_token"
        :vssJoinId="joinId"
        :saasJoinId="saasJoinId"
        :qaStatus="open_question"
        :userChatId="userChatId"
        :privateChat="privateChat"
        :domains="domains"
        @NoLogin="NoLogin"
        :chatShow="chatShow"
        :isEmbed="true"
        :chatFilterData="chatFilterData"
        :shareId="roominfo.share_id"
        :recordHistoryTime="recordHistoryTime"
        :menuData="menuData"
        :bizInfo="roominfo"
      ></vhall-enjoy-watch-Saas>
      <div class="vhall-kick-outs" v-if="kickOutSass">
        <h1 v-if="kickOutSass">您已被禁止，访问房间！</h1>
        <!-- <h1 v-if="liveEnded">直播已结束</h1> -->
      </div>
    </div>
  </div>
</template>
<script>
import VhallReport from '@vhall/report'
import 'swiper/dist/css/swiper.css'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import EventBus from '../../utils/Events'
import invited from '../../rankList' // 邀请榜
import reward from '../../rankList/reward' // 打赏榜
import goodsPop from '../../rankList/goodsPop'
import QRcode from 'qrcode'
import tip from './tip'
import chrome from './chrome'
export default {
  data() {
    return {
      userInfo: {},
      attentionAccount: null, // 关注数
      attentionContent: '关注', // 关注的内容显示
      headerShow: false, // header的显示与否
      chatFilterData: [], // 聊天过滤的数据
      kickOutSass: false, // 遮罩层
      chatShow: '', // 聊天的status
      goodsPopShow: false,
      roomUser: {
        uvOnline: '1',
        pvCount: '1'
      }, // 在线观看数和在线人数
      baseRoomUser: {
        baseOnlineNum: 0,
        basePv: 0
      },
      simpleContent: '', // 简介内容
      briefShow: true,
      activeAdviceShow: false, // 活动推荐的显示
      skipHostUrl: '', // 主办方跳转路径
      sellGoodsShow: false, // 商品推荐的显示
      smsErrorMsgShow: false, // 短信的错误提示
      errorMsgShow: false, // 错误信息的提示
      smsErrorMessage: '', // 短信的错误提示
      errorMessage: '请输入正确的邮箱', // 错误的提示
      swiperPrevShow: false, // 向前翻页的按钮显示
      swiperNextShow: true, // 向后翻页的按钮显示
      followStyle: true, // 关注不关注的显示
      shadeShow: false, // 遮罩层的显示
      testmoudle: '获取验证码',
      documentData: '', // 搜索框的搜索数据
      myprincipal: '', // 我的主页的链接
      userHeadImage: '', // 用户的头像
      menuListShow: false, // 菜单列表的显示
      imageDomin: '', // 图片的主域名
      otherWayShow: false, // 其他登录方式的图标
      qrCodeShow: false, // 二维码的显示切换
      qrCodeImg: '', // 二维码路径
      rulesShow: false, // 邀请的规则显示切换
      topShow: true, // 榜单的显示切换
      bottomLoginInfo: true, // 登录底部信息展示
      phoneKey: '', // 云盾值
      cap: null, // 云盾本身
      key: 'b7982ef659d64141b7120a6af27e19a0', // 云盾key
      loginDialogShow: false, // 登录按钮的显示不显示
      photoCpathaShow: false, // 登录的图片验证码的展示
      buttonControl: true, // 按钮的置灰
      passwordShow: true, // 密码框的显示
      // telChecked: false,              //手机验证码的自动登录
      accountChecked: false, // 账户的自动登录
      isActive: true, // 切换tap
      ruleForm: {},
      sendMsgDisabled: false,
      time: 60,
      pickUpShow: true, // 其它登录方式展开的标志
      typeControl: true, // 云链账号页
      iconPlay: '直播',
      iconPlayShow: false, // 观看图标的显示
      regShow: false, // 注册的显示
      pvShow: false, // 观看次数的显示
      onlineShow: false, // 在线人数的显示
      companyLogoShow: false, // logo的显示
      attentionShow: false,
      modulesInfo: {}, // 模块的显示
      activeInfo: {}, // 活动信息
      goodsImage: '',
      goodsInfo: {}, // 商品信息
      hostInfo: {}, // host信息
      userShow: true,
      activeIndex: null,
      menuList: [],
      logoShow: false,
      skinLogo: require('./img/logo.png'),
      components: null,
      userChatId: null,
      nickName: null,
      roominfo: {}, // 房间信息
      joinId: null,
      topicData: ['美食', '周邊', '樓宇'],
      swiperOption: {
        slidesPerView: 4,

        slidesPerGroup: 1,
        loop: true,
        loopFillGroupWithBlank: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      saasJoinId: '',
      open_question: 0,
      privateChat: {},
      domains: {},
      downloadChrome: false,
      recordHistoryTime: '', // 播放器进度
      tipMsg: '', // vssinfo接口返回的错误信息
      menuData: []
    }
  },

  components: {
    swiper,
    swiperSlide,
    invited,
    reward,
    goodsPop,
    chrome,
    tip
  },
  created() {
    console.log(this.startLive)
    this.getUerInfo()
    this.getMenuList()
    this.$loadingStatus = this.$loading({ background: '#2d2d2d' })
  },
  mounted() {
    console.log('tijiao2')
    window.EventBridge = EventBus
    EventBus.$on('loaded', () => {
      this.$loadingStatus.close()
    })
    // photoCaptcha
    this.invitePartner()
    this.$nextTick(() => {
      document.querySelector('body').style.overflowY = 'hidden'
    })
  },
  methods: {
    // 点击商品获得详细的信息
    sellGoodsInfo() {
      this.shadeShow = !this.shadeShow
      this.goodsPopShow = !this.goodsPopShow
    },
    // 简介的描述
    decripeMenu(msg) {
      this.simpleContent = msg
    },
    NoLogin() {
      this.callLogin()
    },
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
    // 点击注册
    registerClick() {
      window.location.href = `${process.env.START_URL}/auth/register`
    },
    // 在线人数的显示
    passShow() {
      this.passwordShow = !this.passwordShow
    },
    onlinePeople(msg) {
      this.$nextTick(() => {
        this.roomUser.uvOnline = msg.uv
        if (msg.context.pv > this.roomUser.pvCount) {
          this.roomUser.pvCount = msg.context.pv
        }
      })
    },
    // 点击遮罩
    shadeClick() {
      this.loginDialogShow = false
      this.shadeShow = false
    },
    // 跳转到主办方
    skipHost() {
      this.skipHostUrl = `${process.env.START_URL}/user/home/${this.roominfo.host.id}`
    },
    // 搜索框enter进行搜索
    searchDocdument() {
      window.location.href = `${process.env.START_URL}/search?wd=${this.documentData}`
    },
    // 点击出现其他的菜单
    otherMenuClick() {
      this.menuListShow = !this.menuListShow
    },
    // other登录方式的修改
    otherLoginClick() {
      this.otherWayShow = !this.otherWayShow
      this.pickUpShow = !this.pickUpShow
    },
    // 关闭二维码的弹窗
    closeQrDia() {
      this.qrCodeShow = false
    },
    // 邀请好友的打开
    invitedFriend() {
      this.qrCodeShow = true
    },
    // 二维码的生成
    invitePartner() {
      QRcode.toDataURL(
        `${window.location.host}/mywebinar/invite-card/${this.roominfo.webinar_id}/${this.saasJoinId}`,
        (err, url) => {
          if (err) {
          }
          this.qrCodeImg = url
        }
      )
    },
    // 榜单的切换
    changeRules() {
      this.rulesShow = !this.rulesShow
    },
    // 点击邀请榜
    invitedTopClick() {
      this.topShow = true
    },
    // 点击打赏榜
    rewardListClick() {
      this.topShow = false
    },
    // 新浪登录入口
    sinaclick() {
      window.open(
        `${window.location.host}/auth/weibo?after_register=${window.location.href}`,
        '_blank'
      )
    },
    // qq登录入口
    qqClick() {
      window.open(
        `${window.location.host}/auth/qq?after_register=${window.location.href}`,
        '_blank'
      )
    },
    weChatClick() {
      window.open(
        `${window.location.host}/auth/weixinweb?after_register=${window.location.href}`,
        '_blank'
      )
    },
    // 微信登录入口
    // 唤起图片验证码
    callCaptcha(element) {
      let that = this
      /* -- eslint ignore */
      window.initNECaptcha(
        {
          captchaId: this.key,
          element: element,
          mode: 'float',
          width: 270,
          onReady: function(instance) {
            console.log('instance', instance)
          },
          onVerify: function(err, data) {
            console.log('errr', err)
            if (data) {
              that.phoneKey = data.validate
              console.log('dataqqqqqqqqqqqqqqqqqqqqqqqqqqqqq', data)
              if (element == '#captcha') {
                that.buttonControl = false
              }
              // this.isImg = true;
            }
          }
        },
        function onload(instance) {
          that.cap = instance
        }
      )
    },
    // 唤起登录
    callLogin() {
      this.errorMsgShow = false
      this.errorMessage = ''
      this.smsErrorMsgShow = false
      this.smsErrorMessage = ''
      this.loginDialogShow = true
      this.shadeShow = true
      this.passwordShow = true
    },
    // 获取短信验证码
    getCaptha() {
      this.$fetch(
        'randcodelogin',
        {
          phone: this.ruleForm.usernames,
          type: 1,
          captcha: this.phoneKey,
          channel: this.roominfo.open_huawei == 1 ? 'huawei' : '' // 华为账号特有参数 v4.9.4
        },
        {
          'X-Requested-With': 'XMLHttpRequest'
        }
      ).then(res => {
        console.log('res', res)
        if (res.code == 200) {
          this.sendMsgDisabled = true
          console.log('daying', this.sendMsgDisabled)
          this.timeinterval = setInterval(() => {
            if (this.time > 0) {
              this.time--
              this.buttonControl = true
            } else {
              this.sendMsgDisabled = false
              window.clearInterval(this.timeinterval)
              this.time = 60
              this.buttonControl = false
            }
          }, 1000)
        }
      })
    },
    // 短信验证码登录
    telLogin() {
      if (this.ruleForm.usernames == undefined) {
        this.smsErrorMsgShow = true
        this.smsErrorMessage = '请输入您的手机号'
        return
      }
      this.$fetch(
        'ajaxphonelogin',
        {
          account: this.ruleForm.usernames,
          password: this.ruleForm.captchas
        },
        {
          'X-Requested-With': 'XMLHttpRequest'
        }
      ).then(res => {
        console.log('res', res)
        if (res.code == 200) {
          this.loginDialogShow = false
          this.shadeShow = false
          this.$router.go(0)
        }
      })
    },
    // 点击登录
    loginClick() {
      console.log('username', this.ruleForm.username)
      if (
        this.ruleForm.username == undefined ||
        this.ruleForm.password == undefined
      ) {
        this.errorMsgShow = true
        this.errorMessage = '请输入您的账号或邮箱或手机号'
        return
      }
      this.accountChecked
        ? (this.accountChecked = 'remember')
        : (this.accountChecked = null)
      this.$fetch(
        'login',
        {
          account: this.ruleForm.username,
          password: this.ruleForm.password,
          captcha: this.phoneKey,
          remember: this.accountChecked
        },
        {
          'X-Requested-With': 'XMLHttpRequest'
        }
      ).then(res => {
        console.log('ssss>>>>>>res', res)
        if (res.code == 200) {
          this.errorMsgShow = false
          this.loginDialogShow = false
          this.$router.go(0)
          this.shadeShow = false
          console.log('1111111111111111111111111111111111111', res)
        } else if (res.code == '500') {
          this.errorMsgShow = true
          this.errorMessage = '您输入的密码错误'
        }
      })
    },
    // 校验登录次数
    checkLoginAccount() {
      this.$fetch('checkAccount', {
        account: this.ruleForm.username
      }).then(res => {
        if (res.code == 200) {
          if (res.data) {
            this.photoCpathaShow = true
            this.callCaptcha('#photoCaptcha')
            if (this.phoneKey) {
              this.errorMsgShow = false
              this.loginClick()
            } else {
              this.errorMsgShow = true
              this.errorMessage = '图形码未验证通过'
            }
          } else {
            this.photoCpathaShow = false
            this.loginClick()
          }
        }
      })
    },
    // 快捷登录验证码的聚焦
    captchaFocus() {
      this.smsErrorMsgShow = false
    },
    // 快捷登录手机号的聚焦
    telFocus() {
      this.smsErrorMsgShow = false
    },
    // 手机号邮箱聚焦
    usernameFocus() {
      this.errorMsgShow = false
    },
    // 密码框聚焦
    passwordFocus() {
      this.errorMsgShow = false
    },
    // 获取验证码
    getCodes() {},
    // 云链账号登录
    usersLogin() {
      this.typeControl = true
      this.isActive = true
      this.bottomLoginInfo = true
    },
    // 点击快捷进行登录
    messgeLogin() {
      this.typeControl = false
      this.isActive = false
      this.bottomLoginInfo = false
      this.callCaptcha('#captcha')
    },

    // 点击活动
    activeClick(index) {
      this.activeIndex = index
      console.log('indexxxxxxxx', index)
      console.log('000000000000000', this.menuList)
      this.activeIndex == 0 ? (this.briefShow = true) : (this.briefShow = false)
      console.log('2222', this.simpleContent)
      console.log('tijiao')
    },
    // 向右滑
    arrowRight() {},
    fullScreen() {
      var docElm = document.querySelector('.seeding-contents')
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
      // 单视频 嵌入  -- 不拉取。 自定义菜单相关信息
      if (this.$route.query.embed == 'video') return

      this.$fetch('webinarMenus', {
        webinar_id: this.$route.params.il_id
      }).then(res => {
        if (res.code == 200) {
          this.menuData = res.data || []
          if (this.menuData && this.menuData.length) {
            const chat = this.menuData.find(d => d.type == 3) || {}
            this.chatShow = chat.status || ''
          }
          this.menuData.map(item => {
            if (item.type != 2 && item.type != 3) {
              this.menuList.push(item)
            }
          })
        }
      })
    },
    // 即将发售
    comeSelling() {
      window.location.href = this.goodsInfo.url
    },
    // 关注
    attention() {
      // if (this.roominfo.auth.length == undefined) {
      this.$fetch('attention', {
        at_id: this.hostInfo.id,
        webinar_id: this.$route.params.il_id
      }).then(res => {
        if (res.code == 200) {
          if (res.data.fans != this.attentionAccount) {
            this.followStyle = false
            this.attentionContent = '已关注'
          } else {
            this.followStyle = true
            this.attentionContent = '关注'
          }
        }
      })
      // } else {
      //   this.callLogin();
      // }
    },
    // 商品推荐
    getGoodsInfo() {
      // 单视频 嵌入不调取问卷 相关信息
      if (this.$route.query.embed == 'video') return

      this.$fetch('goodsInfo', {
        webinar_id: this.$route.params.il_id
      }).then(res => {
        if (res.code == 200) {
          this.sellGoodsShow = true
          this.goodsInfo = res.data
          this.goodsImage = `${this.imageDomin}/${this.goodsInfo.img_list[0].img}`
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
    // 聊天过滤接口
    chatFilter() {
      // 单视频 嵌入 不调取--关键词。
      if (this.$route.query.embed == 'video') return
      this.$fetch('keywordsList', {
        user_id: this.roominfo.host.id
      }).then(res => {
        if (res.code == 200) {
          console.log('22222222222222222222222', res)
          this.chatFilterData = res.data
        }
      })
    },
    // 获取用户信息
    getUerInfo() {
      this.$fetch('vssInfo', {
        webinar_id: this.$route.params.il_id,
        is_inline: '1',
        ...this.$route.query
      }).then(res => {
        if (res.code == 205) {
          window.location.href = '/auth/login'
        }

        if (res.code == 200) {
          if (res.data.player.watermark) {
            // 如果有水印重置图片url
            res.data.player.watermark.img_url =
              res.data.domains.upload + '/' + res.data.player.watermark.img_url
          }
          this.roominfo = res.data
          if (this.roominfo.modules && this.roominfo.modules.barrage) {
            this.roominfo.player.barrage = this.roominfo.modules.barrage.hide
          }
          // 初始化数据上报
          this.initVHallReport(res.data.report_token)
          this.joinId = this.roominfo.user.join_id
          this.userInfo = this.roominfo.user
          this.userChatId = this.roominfo.user.third_party_user_id
          this.saasJoinId = res.data.user.saas_join_id
          this.open_question = res.data.open_question
          // 获取关注数
          this.attentionAccount = res.data.modules.attention.count
          // 获取主办方的路径
          // 获取pv的观看数
          this.roomUser.pvCount = res.data.webinar.pv
          this.baseRoomUser.baseOnlineNum = Number(res.data.base_online_num)
          sessionStorage.setItem('baseOnlineNumber', this.baseRoomUser.baseOnlineNum)
          if (res.data.advs.length > 0) {
            this.activeAdviceShow = true
            this.menuButton(res.data.advs)
          } else {
            this.activeAdviceShow = false
          }
          console.log('roominfo', this.roominfo.auth.length)
          if (this.roominfo.auth.length == undefined) {
            this.userHeadImage = this.roominfo.auth.avatar
            this.userShow = false
            this.myprincipal = this.roominfo.auth.id
          } else {
            this.userHeadImage = null
            this.userShow = true
          }
          this.hostInfo = this.roominfo.host
          this.roominfo.webinar_id = res.data.webinar.id
          this.activeInfo = res.data.webinar
          this.privateChat = res.data.saas_chat
          this.domains = res.data.domains
          sessionStorage.setItem('vhall-vsstoken', this.roominfo.vss_token)

          // 获取图片的主域路径
          this.imageDomin = res.data.domains.upload
          // 存取图片的主要路径，给七巧板用
          sessionStorage.setItem('imageDomin', this.imageDomin)
          // 存取用户信息给七巧板用
          let deliverUser = res.data.user
          deliverUser.account_id = res.data.user.third_party_user_id
          sessionStorage.setItem('user', JSON.stringify(deliverUser))
          // 存取VssToke
          sessionStorage.setItem('vhall-vsstoken', res.data.vss_token)
          sessionStorage.setItem('defaultMainscreenDefinition', res.data.push_definition || '')
          sessionStorage.setItem('defaultSmallscreenDefinition', res.data.hd_definition || '')
          sessionStorage.setItem('moduleShow', JSON.stringify(this.roominfo))
          // 头条的显示
          this.headerShow = this.roominfo.modules.header.show
          // 关注的显示
          this.roominfo.modules.attention.show == 1
            ? (this.attentionShow = true)
            : (this.attentionShow = false)
          // logo的显示
          this.roominfo.modules.logo.show == 1
            ? (this.companyLogoShow = true)
            : (this.companyLogoShow = false)
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
          if (res.data.skin && res.data.skin.skin_json_pc) {
            this.$nextTick(() => {
              try {
                // 背景颜色
                const bgColor = document.querySelector('.back-content')
                // 页面颜色
                const follow = document.querySelector('.follow')
                const fullScreen = document.querySelector('.full-screen')
                const activeHead = document.querySelector('.active-second h3')
                const activeIntroduce = document.querySelector(
                  '.active-introduce h3'
                )
                // logo
                // const logo = document.querySelector('.skin-logo')
                // 背景图片
                const bgContent = document.querySelector('.watch-middle-cotent')
                if (res.data.skin && res.data.skin.skin_json_pc.background) {
                  bgContent.style.background = `url(${this.imageDomin}/${res.data.skin.skin_json_pc.background}) no-repeat 100% 100%`
                  bgContent.style.backgroundSize = `cover`
                }
                if (res.data.skin && res.data.skin.skin_json_pc.logo) {
                  this.logoShow = true
                  this.skinLogo = `${this.imageDomin}/${res.data.skin.skin_json_pc.logo}`
                } else {
                  this.logoShow = false
                }
                // imageDomin
                //  = "url('./img/hand.png')";

                // const activeColor = document.querySelector('.active-introduce');
                // const secondColor = document.querySelector('.active-second');
                // const topicContent = document.querySelector('.topic-content');
                // const [...contentHeader] = document.querySelectorAll('.content-header');
                // console.log('content',contentHeader);
                console.log('follow>>>>>', follow)
                try {
                  bgColor.style.background = res.data.skin.skin_json_pc.bgColor.substring(
                    3
                  )
                  if (follow) {
                    follow.style.background = res.data.skin.skin_json_pc.pageStyle.substring(
                      3
                    )
                  }
                  fullScreen.style.background = res.data.skin.skin_json_pc.pageStyle.substring(
                    3
                  )
                  if (activeHead) {
                    activeHead.style.borderBottomColor = res.data.skin.skin_json_pc.pageStyle.substring(
                      3
                    )
                  }
                  activeIntroduce.style.borderBottomColor = res.data.skin.skin_json_pc.pageStyle.substring(
                    3
                  )
                } catch (e) {
                  console.log(e)
                }
              } catch (error) {
                console.error(error)
              }
            })
            // activeColor.style.background = res.data.skin.skin_json_pc.bgColor.substring(3);
            // secondColor.style.background = res.data.skin.skin_json_pc.bgColor.substring(3);
            // topicContent.style.color = '#fff';
            // contentHeader.map((item)=>{
            //     item.style.color = '#fff';
            // })
            // contentHeader.style.color = '#fff';
          }
          this.getGoodsInfo()
          this.chatFilter() // 聊天过滤接口
          this.skipHostUrl = `${process.env.START_URL}/user/home/${
            this.roominfo.host.id
          }`
          this.recordHistoryTime = res.data.record_history_time
        } else if (res.code == 301) {
          EventBus.$emit('loaded')
          window.location.replace(res.data.url)
        } else if (res.code == 210) {
          EventBus.$emit('loaded')
          this.kickOutSass = true
        } else {
          EventBus.$emit('loaded')
          this.tipMsg = res.msg
        }
      })
    },
    updateBaseNumFun(msg) {
      this.$nextTick(() => {
        this.baseRoomUser.baseOnlineNum =
        this.baseRoomUser.baseOnlineNum + Number(msg.data.update_online_num)
        sessionStorage.setItem('baseOnlineNumber', this.baseRoomUser.baseOnlineNum)
      })
    },
    initVHallReport() {
      this.$fetch('getReportInfo', {
        report_token: this.roominfo.report_token,
        vss_token: this.roominfo.vss_token
      }).then(res => {
        window.vhallReport = new VhallReport({
          ...res.data,
          pf: 7,
          service_names: this.roominfo.is_replay == 1 ? 2 : 1,
          env: process.env.NODE_ENV === 'production' ? 'production' : 'test'
        })
        window.vhallReport.report('ENTER_WATCH', {
          event: this.$route.query.refer // 推广渠道，会在url里传参
        })
      })
      // 浏览器或者页面关闭时上报
      window.addEventListener('beforeunload', function(e) {
        // 离开H5观看端页面
        if (/room\/watch/.test(window.location.pathname)) {
          window.vhallReport.report('LEAVE_WATCH', {}, false)
        }
      })
    }
  },
  beforeDestroy() {
    window.vhallReport.report('LEAVE_WATCH')
  }
}
</script>
<style lang="less">
.el-loading-spinner .path {
    stroke: #fc5659 !important;
}
.watch-wraps {
  // max-width: 1640px;
  // min-width: 1220px;
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
        font-family: PingFangSC-Semibold;
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
        font-family: PingFangSC-Regular;
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
