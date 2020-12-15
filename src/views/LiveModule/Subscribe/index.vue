<template>
  <div class="wrap">
    <header
      class="wh-title"
      v-if="logo && logo.image"
    >
      <img v-if="logo && logo.show == 1" class="logo-image" :src="logo.image" alt @click.stop="handleSkipLogo"/>
      <div class="title-right">
        <template v-if="!isLogin">
          <el-button class="button-style button-login" @click="callLogin"
            >登录</el-button
          >
          <el-button
            @click="registerClick"
            class="button-style button-register"
            >注册</el-button
          >
        </template>
        <span class="login-info-wrap" v-else>
          <div @click="menuListShow = !menuListShow" class="loginUserInfo">
            <img
              :src="roomData && roomData.join_info ? roomData.join_info.avatar : '//cnstatic01.e.vhall.com/static/img/head50.jpg'"
              alt
            />
            <div class="login-nickName">
              <span>{{ (roomData && roomData.join_info) ? roomData.join_info.nickname : ''}}</span>
              <span></span>
            </div>
            <ul v-if="menuListShow" class="login-info-list">
              <li>
                <a :href="myliveRoute">
                  <i></i>
                  <span>我的直播</span>
                </a>
              </li>
              <li>
                <a
                  :href="accountRoute"
                >
                  <i></i>
                  <span>账户中心</span>
                </a>
              </li>
              <li>
                <a :href="myPageRoute">
                  <i></i>
                  <span>我的主页</span>
                </a>
              </li>
              <li>
                <a :href="myAccountRoute">
                  <i></i>
                  <span>账户设置</span>
                </a>
              </li>
              <li>
                <a @click="handleQuit">
                  <i></i>
                  <span>退出登录</span>
                </a>
              </li>
            </ul>
          </div>
        </span>
      </div>
    </header>
    <!-- 登录弹窗 -->
    <div class="logins-dialog" v-if="loginDialogShow">
      <!-- 登录type页 -->
      <div class="login">
        <div class="top"></div>
        <div class="head" :class="isActive ? 'left' : 'right'">
          <p @click="usersLogin" :class="{ active: isActive }">
            账号登录
          </p>
          <p @click="messgeLogin" :class="{ active: !isActive }">
            快捷登录
          </p>
          <div class="line">
            <div class="after"></div>
          </div>
        </div>
        <!-- 账号登录 -->
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          class="userLogin"
          v-show="typeControl"
        >
          <el-form-item prop="username">
            <el-input
              clearable
              @focus="errorMessage = ''"
              v-model.trim="ruleForm.username"
              placeholder="手机号/邮箱"
            >
              <i
                style="margin-left:5px;"
                slot="prefix"
                class="iconfont iconshoujihaoyouxiang"
              ></i>
            </el-input>
          </el-form-item>
          <!-- 图形验证码 -->
          <el-form-item v-show="photoCpathaShow">
            <div id="photoCaptcha"></div>
          </el-form-item>
          <!-- 登录密码 -->
          <el-form-item
            style="position:relative; margin-bottom:0;"
            prop="password"
          >
            <el-input
              v-if="passwordShow"
              :maxlength="20"
              v-model.trim="ruleForm.password"
              placeholder="登录密码"
              style="width:270px;"
              type="password"
              clearable
              @focus="errorMessage = ''"
            >
              <i
                style="margin-left:5px;"
                slot="prefix"
                class="iconfont iconmima"
              ></i>
              <i
                slot="suffix"
                @click="passwordShow = false"
                style="font-size:14px;margin-right:5px;"
                class="iconfont iconyincang-copy"
              ></i>
            </el-input>
            <el-input
              v-else
              :maxlength="20"
              v-model.trim="ruleForm.password"
              placeholder="登录密码"
              clearable
              @focus="errorMessage = ''"
            >
              <i
                style="margin-left:5px;"
                slot="prefix"
                class="iconfont iconmima"
              ></i>
              <i
                slot="suffix"
                @click="passwordShow = true"
                style="font-size:12px;margin-right:5px;"
                class="iconfont iconxianshi"
              ></i>
            </el-input>
            <span v-if="errorMessage != ''" class="errorImage">{{errorMessage}}</span>
          </el-form-item>
          <el-form-item>
            <el-button
              style="margin-top:10px;"
              @click="checkLoginAccount"
              class="login-button"
              >登录</el-button
            >
            <div>
              <el-checkbox
                v-model="accountChecked"
                style="margin-right:6px;"
              ></el-checkbox>
              <span class="auto-login">自动登录</span>
              <span class="auto-login forget-password">
                <a :href="webDominUrl + '/auth/forgot'">忘记密码？</a>
              </span>
            </div>
          </el-form-item>
        </el-form>
        <!-- 短信登录 -->
        <el-form
          :model="ruleForm"
          ref="ruleForm"
          class="userLogin"
          v-show="!typeControl"
        >
          <el-form-item prop="usernames">
            <el-input
              clearable
              :maxlength="11"
              v-model.trim="ruleForm.usernames"
              style="width:270px;"
              placeholder="请输入手机号"
              @focus="smsErrorMessage = ''"
            >
              <i
                style="margin-left:5px;"
                slot="prefix"
                class="iconfont iconshouji"
              ></i>
            </el-input>
          </el-form-item>
          <el-form-item>
            <div id="captcha"></div>
          </el-form-item>
          <el-form-item prop="captchas" class="wrap-code">
            <el-input
              clearable
              type="captcha"
              :maxlength="6"
              v-model.trim="ruleForm.captchas"
              placeholder="动态密码"
              style="width:270px; margin-bottom：0;"
              @focus="smsErrorMessage = ''"
            >
              <i
                style="margin-left:5px;"
                slot="prefix"
                class="iconfont iconmima"
              ></i>
            </el-input>
            <button
              type="danger"
              :disabled="buttonControl"
              class="identCodes duanxinCode"
              :class="{disabled: buttonControl}"
              @click.stop.prevent="getCaptha"
            >
              {{sendMsgDisabled ? (countTime + '秒') : '获取验证码'}}
            </button>
            <span v-if="smsErrorMessage != ''" class="errorImage">{{smsErrorMessage}}</span>
          </el-form-item>
          <el-form-item>
            <el-button
              @click="telLogin"
              class="login-button smslogin-button"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
        <div
          class="bottom-login"
          v-if="bottomLoginInfo"
        >
          <p class="rightnow-reg">
            <span>现在注册，就送20G流量</span>
            <span style="color:#FC5659">
              <a
                style="color:#FC5659"
                :href="webDominUrl + '/auth/register'"
                >立即注册</a
              >
            </span>
          </p>
          <div class="downLogin">
            <p class="other-login" @click="otherLoginClick">
              <span>其他登录方式</span>&nbsp;&nbsp;&nbsp;
              <span>展开</span>
              <span class="ionc">
                <span v-show="pickUpShow" class="ioncPickUp"></span>
                <span
                  v-show="!pickUpShow"
                  class="ioncPickDown"
                ></span>
              </span>
            </p>
            <div class="third-way-choose" v-if="otherWayShow && roomData.webinar.id">
              <div class="third-auth">
                <a
                  :href="
                    webinarDominUrl +
                      '/auth/weibo?after_register=' +
                      webinarDominUrl +
                      '/' +
                      roomData.webinar.id
                  "
                  class="weibo"
                  title="微博登录"
                ></a>
                <a
                  :href="
                    webinarDominUrl +
                      '/auth/qq?after_register=' +
                      webinarDominUrl +
                      '/' +
                      roomData.webinar.id
                  "
                  class="qq"
                  title="QQ登录"
                ></a>
                <a
                  :href="
                    webinarDominUrl +
                      '/auth/weixinweb?after_register=' +
                      webinarDominUrl +
                      '/' +
                      roomData.webinar.id
                  "
                  class="weixin"
                  title="微信登录"
                ></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <section class="watchContainer">
      <div class="area">
        <div class="topInfo">
          <p class="">
            <b>{{title}}</b>
            <span class="tag">{{ webinarType | webinarTypeToText}}</span>
            <span class="right gray font-14">
              {{viewCount}} 次观看
            </span>
          </p>
          <p class="gray font-14">
            <span class="mrR" v-if="logo.organizers_status == 1">
              主办方：<a class="blue" :href="hostUrl">{{hostName}}</a>
            </span>
            <span>
              时间：{{time}}
            </span>
            <span class="right iconBtn">
              <icon icon-class="saasyijianfankui" @click.native="$refs.feedBack.dialogVisible = true">反馈</icon>
              <el-popover
                placement="bottom-end"
                trigger="click">
                <div>
                  <share slot="content" :url="shareUrl"></share>
                </div>
                <icon icon-class="saasfenxiang" slot="reference">分享直播</icon>
              </el-popover>
              <div
                  class="officialaccount-qrcode"
                  v-if="showOfficialAccountMiniQRCode"
                >
                  <span><i class="iconfont iconweixin"></i>微信公众号</span>
                  <div class="qr-wrap">
                    <span class="arrow"></span>
                    <template v-if="publicAdv && publicAdv.img">
                      <img
                        :src="
                          `${publicAdv && publicAdv.img}?x-oss-process=image/resize,m_fill,w_233,h_233`
                        "
                        :alt="publicAdv && publicAdv.img"
                      />
                    </template>
                  </div>
                </div>
              <template v-if="logo.organizers_status == 1">
                <i class="focusBtn" @click="focusHandler" >
                  {{isFollow ? '取消关注' : '关注'}}
                </i>
                <i class="focusCount">{{focusCount}}</i>
              </template>
            </span>
          </p>
        </div>
        <div class="watchBox">
          <div class="leftWatch">
            <!-- <img :src="roomData.urls.upload_url + '/' + roomData.webinar.img_url" v-if="this.roomData && this.roomData.webinar.img_url" alt=""> -->
            <!-- <img src="//t-alistatic01.e.vhall.com/static/img/video_default.png" v-else alt=""> -->
          </div>
          <div class="rightWatch">
            <template v-if="!isKeyLogin">
              <div class="title">距离直播开始还有</div>
              <div class="timeBox">
                <div>
                  <p class="mian">{{days}}</p>
                  <p class="sub">天</p>
                </div>
                <div>
                  <p class="mian">{{hours}}</p>
                  <p class="sub">小时</p>
                </div>
                <div>
                  <p class="mian">{{minutes}}</p>
                  <p class="sub">分钟</p>
                </div>
                <div>
                  <p class="mian">{{seconds}}</p>
                  <p class="sub">秒</p>
                </div>
              </div>
              <p class="title"><span class="red">{{subscribe_count}}</span>人预约</p>
              <div class="bottom">
                <el-button  type="primary" @click="btnClick">{{ btnVal }}</el-button>
                <p class="limit">{{limitText}}</p>
              </div>
            </template>
            <template v-else>
              <key-login></key-login>
            </template>
          </div>
        </div>
      </div>
    </section>
    <div :class="{area: true, product: productFlag}">
      <div class="flex1">
        <!-- <custoMenu></custoMenu> -->
        <el-tabs class="foot" v-model="activeName2" @tab-click="handleClick">
          <el-tab-pane label="活动推荐" name="activity">
            <ul class="activity" ref="activityUL">
              <li>
                <div class="imgBox">
                  <img src="//t-alistatic01.e.vhall.com/static/img/video_default.png" alt="">
                </div>
                <p class="activityName"><span>最多可输入30个文字</span></p>
              </li>
              <li v-for=" i in  10" :key="i">
                <div class="imgBox">
                  <img src="//t-alistatic01.e.vhall.com/static/img/video_default.png" alt="">
                </div>
                <p class="activityName"><span>最多可输入30个文字，单行居中对齐折行文字左对齐</span></p>
              </li>
            </ul>
            <span class="operaBtn left" @click="activityMove('left')">
              <i class="el-icon-arrow-left"></i>
            </span>
            <span class="operaBtn right" @click="activityMove('right')">
              <i class="el-icon-arrow-right"></i>
            </span>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- <products
        v-if="productFlag"
        @sellGoodsInfo="sellGoodsInfo"
        :goodsList="goodsList"
      ></products> -->
    </div>
    <div class="footer inner-center tac" v-if="logo && logo.reserved_status == 1">
      <div class="about-us">
        <a href="http://www.vhall.com/about" target="_blank">关于我们</a>
        <a href="http://www.vhall.com/blog" target="_blank">客户案例</a>
        <a
          href="http://www.vhall.com/business/page-472.html"
          target="_blank"
          >区域代理</a
        >
        <a href="http://www.vhall.com" target="_blank">平台介绍</a>
        <a href="//e.vhall.com/home/vhallapi/serviceterms" target="_blank"
          >服务条款</a
        >
        <a
          href="//e.vhall.com/home/vhallapi/commonproblem"
          target="_blank"
          >常见问题</a
        >
      </div>
      <p>京ICP备10024636号-4京公网安备11010502008915</p>
      <p>© Vhall 2020.All Rights Reserved.</p>
    </div>
    <el-dialog
      :title="tipTitle"
      width="400px"
      :visible.sync="showModile"
      :close-on-click-modal="true"
      :before-close="handleCancelDelete"
    >
      <span>{{tipContent}}</span>
      <el-input v-model="authCheckValue" :placeholder="dialogPlaceholder"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelDelete">取 消</el-button>
        <el-button type="primary" @click="btnClick">确 定</el-button>
      </span>
    </el-dialog>
    <popup
      :visible="showOfficialAccountQRCode"
      :width="'340px'"
      title="公众号二维码"
      :onClose="showOfficialAccountQRCode = false"
    >
      <div class="preview-wrap ad-qrcode">
        <div class="preview-title">
          <span class="owner">【{{ roomData.webinar && roomData.webinar.userinfo.nickname }}】</span>
          <span>邀请你关注微信了解更多资讯</span>
        </div>
        <div class="preview-content">
          <a target="_blank" v-if="publicAdv && publicAdv.img">
            <img
              :src="
                `${publicAdv && publicAdv.img}?x-oss-process=image/resize,m_fill,w_233,h_233`
              "
              :alt="`${publicAdv && publicAdv.img}`"
            />
          </a>
          <div class="preview-des">扫码关注公众号</div>
        </div>
      </div>
    </popup>
    <feedBack ref="feedBack"></feedBack>
    <div class="shade" v-if="shadeShow" @click="(shadeShow = false), (loginDialogShow = false)"></div>
    <!-- 商品详情的弹窗 -->
    <!-- <goodsPop v-if="goodsPopShow" @closeGoodPop="closeGoodPop" :goodsAllInfo="goodInfo"></goodsPop> -->
    <!-- 报名表单 -->
    <!-- <signUpForm v-if="!isSignUp" @closeSignUp="isSignUp = true" @changeBtnVal="changeBtnVal"></signUpForm> -->
  </div>
</template>

<script>
import feedBack from './feedBack';
import share from '@/components/Share';
import custoMenu from '../components/customMenuView';
import goodsPop from '../Room/rankList/goodsPop';
import products from '../components/products';
import signUpForm from './signUpForm';
import keyLogin from '../components/keyLogin';
import { sessionOrLocal } from '@/utils/utils';
import Env from '@/api/env.js';
export default {
  components: {
    feedBack,
    share,
    custoMenu,
    goodsPop,
    products,
    signUpForm,
    keyLogin
  },
  data(){
    return {
      tipContent: '',
      showModile: false,
      authCheckValue: '',
      dialogPlaceholder: '',
      showOfficialAccountQRCode: false, // 刷新后是否显示公众号弹窗
      showOfficialAccountMiniQRCode: false, // head栏是否显示微信公众号图标
      isKeyLogin: this.$route.path.startsWith('/keylogin'),
      title: '预约',
      webinarType: 1,
      viewCount: 0,
      hostName: '',
      hostUrl: '',
      time: '',
      days: "00",
      hours: "00",
      minutes: "00",
      seconds: "00",
      focusCount: 0, // 关注人数
      subscribe_count: 0,
      activeName: 'desc',
      activeName2: 'activity',
      productFlag: true,
      goodsList: [],
      goodInfo: {},
      shadeShow: false,
      goodsPopShow: false,
      isSignUp: true,
      btnVal: '立即预约',
      limitText: '',
      status: 'subscribe', // 活动状态
      shareUrl: '',
      webinar: {}, // 活动信息
      isLogin: false,
      loginDialogShow: false, // 登录页面
      isActive: true, // 切换tap
      ruleForm: {
        username: '',
        password: ''
      },
      typeControl: true, // 云链账号页
      errorMessage: '',
      photoCpathaShow: false, // 登录的图片验证码的展示
      passwordShow: true, // 密码框的显示
      phoneKey: '', // 云盾值
      key: 'b7982ef659d64141b7120a6af27e19a0', // 云盾key
      accountChecked: false, // 账户的自动登录
      buttonControl: true, // 按钮的置灰
      webDominUrl: '',
      smsErrorMessage: '', // 短信的错误提示
      sendMsgDisabled: false,
      timeinterval: null,
      countTime: 60,
      bottomLoginInfo: true, // 登录底部信息展示
      otherWayShow: false, // 其他登录方式的图标
      pickUpShow: true, // 收起的显示
      menuListShow: false, // 菜单列表的显示
      logo: {},
      userInfo: {},
      roomData: {},
      webinarDominUrl: '',
      isFollow: false,
      myliveRoute: '',
      accountRoute: '',
      myPageRoute: '',
      myAccountRoute: '',
      publicAdv: {},
      tipTitle: ''
    };
  },
  async created(){
    await this.getWatchInfo()
    await this.getSignInfo()
    await this.getAdsInfo() // 获取活动广告信息
    await this.getSkin() // 获取皮肤
    await this.getPublisAdv() // 获取公众号广告
    this.handleInitRoom()
    // this.getGoodsInfo();
  },
  mounted() {
    this.userInfo = sessionOrLocal.get('userInfo') ? JSON.parse(sessionOrLocal.get('userInfo')) : {}
    if (this.userInfo && this.userInfo.user_id) {
      this.isLogin = true
    }
  },
  beforeDestroy() {
    this.timer && clearInterval(this.timer)
  },
  methods:{
    getWatchInfo() {
      return this.$fetch('watchInit', {
        webinar_id: this.$route.params.id,
        visitor_id: sessionOrLocal.get('visitor_id') ? sessionOrLocal.get('visitor_id') : '',
        refer: '',
        record_id: '',
        wx_url: ''
      }).then(res => {
        this.handleErrorCode(res)
      }).catch(e => {
        console.log('获取房间信息失败:', e)
      })
    },
    // 初始化错误信息处理
    handleErrorCode (res) {
      switch (res.code) {
        case 200:
          this.roomData = res.data
          this.roomData.visitor_id && sessionOrLocal.set('visitor_id', this.roomData.visitor_id)
          this.roomData.interact.interact_token && sessionOrLocal.set('interact_token', this.roomData.interact.interact_token)
          this.getAttentionNum()
          break
        case 12514: // 您已被踢出，请联系活动组织者
        case 12002: // 活动不存在
        case 12522: // 主持人、嘉宾或助理不允许进入观看端
        case 12536: // 回放不存在
        case 12542: // 此视频暂时下线了
        case 12543: // 该视频已下线，有疑问请联系客服
        case 12544: // 该视频转码失败
        case 12545: // 该视频正在审核中
        case 12546: // 该视频正在转码中
        case 12541: // 活动现场太火爆，已超过人数上限
          this.$EventBus.$emit('loaded');
          this.tipMsg = res.msg;
          break;
      }
    },
    // 获取活动广告信息
    getAdsInfo () {
      return this.$fetch('queryAdsInfo', {
        webinar_id: this.$route.params.id,
        pos: 0,
        limit: 50
      }).then(res => {
        if (res.code == 200 && res.data) {
          this.ads = res.data.adv_list
        }
      })
    },
    // 获取皮肤
    getSkin () {
      return this.$fetch('getSkin', {
        webinar_id: this.$route.params.id
      }).then(res => {
        if (res.code == 200 && res.data) {
          this.skinInfo = res.data
        }
      })
    },
    // 获取公众号广告
    getPublisAdv () {
      return this.$fetch('getScreenPublicInfo', {
        webinar_id: this.$route.params.id
      }).then(res => {
        if (res.code == 200 && res.data) {
          this.publicAdv = res.data && res.data['public-account']
        }
      })
    },
     // 获取标记 logo 主办方信息
    getSignInfo () {
      return this.$fetch('watchInterGetWebinarTag', {
        webinar_id: this.$route.params.id
      }).then(res => {
        if (res.code == 200 && res.data) {
          this.signInfo = res.data
        }
      })
    },
    // logo跳转
    handleSkipLogo () {
      window.location.href = this.logo.href
    },
    // 点击注册
    registerClick() {
      window.location.href = `${Env.web}/auth/register`
    },
    handleInitRoom () {
      if (this.roomData) {
        this.status = this.roomData.status
        // this.btnVal = this.roomData.status === 'subscribe' ? '立即预约' : '进入直播'
        console.log(111111, this.roomData)
        this.title = this.roomData.webinar.subject
        this.viewCount = this.roomData.pv.num
        this.hostName = this.roomData.webinar.userinfo.nickname
        this.hostUrl = Env.web + `/user/home/${this.roomData.webinar.userinfo.user_id}`
        this.shareUrl = Env.web + `/live/watch/${this.$route.params.id}`
        this.time = this.roomData.webinar.start_time
        this.webinarDominUrl = this.roomData.urls.web_url
        this.myliveRoute = window.location.origin + '/live/list'
        this.accountRoute = window.location.origin + '/finance/info'
        this.myPageRoute = window.location.origin + `/user/home/${this.userInfo.user_id}`
        this.myAccountRoute = window.location.origin + '/account/info'
        if (this.signInfo) {
          this.logo = {
            href: this.signInfo.skip_url, // 跳转连接
            image: this.signInfo.logo_url, // logo地址
            show: this.signInfo.view_status, // 观看端信息
            reserved_status: this.signInfo.reserved_status, // 版权信息
            organizers_status: this.signInfo.organizers_status // 主办方信息
          }
        }
        this.joinCommonParam = {
          webinar_id: this.$route.params.id,
          refer: this.$route.query.refer,
          record_id: this.roomData.paas_record_id,
          visitor_id: sessionStorage.getItem('visitor_id') ? sessionStorage.getItem('visitor_id') : ''
        }
        if (this.publicAdv) {
          if (this.publicAdv.alert_type == 1) {
            this.showOfficialAccountQRCode = true
          }
          if (this.publicAdv.status == 1) {
            this.showOfficialAccountMiniQRCode = true
          }
        }
        this.getBtnText()
        if (this.timer) clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.remainTimes(this.roomData.webinar.start_time)
        }, 1*1000);
      }
    },
    // startTime  YYYY-MM-DD HH:MM
    remainTimes(startTime){
      const limitTime = new Date(startTime).getTime();
      const now = new Date().getTime();
      const remin = parseInt((limitTime - now)/1000);
      const day_coefficient = 1*24*60*60; // 定义一天包含多少秒---系数
      const hours_coefficient = 60*60; // 定义一小时包含多少秒---系数
      const mintes_coefficient = 60; // 定义一分钟包含多少秒---系数
      const hour_reminder = remin % day_coefficient; // 剩余时间取余
      const minutes_reminder = hour_reminder % hours_coefficient;  // 剩余时间取余
      const seconds_reminder = minutes_reminder % mintes_coefficient;  // 剩余时间取余
      this.days = this.zeroPadding(parseInt(remin/day_coefficient)) < 1 ? '00' : this.zeroPadding(parseInt(remin/day_coefficient));
      this.hours = this.zeroPadding(parseInt(hour_reminder/hours_coefficient)) < 1 ? '00' : this.zeroPadding(parseInt(hour_reminder/hours_coefficient));
      this.minutes = this.zeroPadding(parseInt(minutes_reminder/mintes_coefficient)) < 1 ? '00' : this.zeroPadding(parseInt(minutes_reminder/mintes_coefficient));
      this.seconds = this.zeroPadding(seconds_reminder) < 1 ? '00' : this.zeroPadding(seconds_reminder);
    },
    zeroPadding(num){
      num = Number(num);
      if(isNaN(num)) return num;
      if(num >= 0 && num <10){
        return `0${num}`;
      }
      return num;
    },
    // 关注
    focusHandler(){
      if (this.isLogin) {
        if (this.isFollow) {
          this.$fetch('notAttention', {
            at_id: this.roomData.webinar.userinfo.user_id,
            type: 1
          }).then(res => {
            if (res.code == 200) {
              this.$message.success('取消关注')
              this.isFollow = !this.isFollow
            }
          })
        } else {
          this.$fetch('attention', {
            at_id: this.roomData.webinar.userinfo.user_id,
            type: 1
          }).then(res => {
            if (res.code == 200) {
              this.$message.success('关注成功')
              this.isFollow = !this.isFollow
            }
          })
        }
      } else {
        this.callLogin()
      }
    },
    // 预约
    subscribe(){
      this.isSignUp = false;
    },
    handleClick(){

    },
    activityMove(direction){
      const el = this.$refs.activityUL;
      const offset = el.style.transform.match(/-?\d+/g);
      const width = el.offsetWidth;
      const originDis = offset ? Number(offset[0]) : 0;
      const clientWidth = el.parentElement.offsetWidth;
      let currentDistance = 0;
      if(direction == 'left'){
        currentDistance = originDis-100;
        Math.abs(currentDistance) > (width-clientWidth-20) && (currentDistance = 0-(width-clientWidth-20));
      }else{
        currentDistance = originDis+100;
        currentDistance > 0 && (currentDistance=0);
      }
      el.style.transform = `translateX(${currentDistance}px)`;
      console.log(offset);
    },
    // 点击商品获得详细的信息
    sellGoodsInfo(goodInfo) {
      this.goodInfo = goodInfo;
      // window.vhallReport.report('GOOD_RECOMMEND', {
      //   event: moment().format('YYYY-MM-DD HH:mm'),
      //   market_tools_id: this.goodInfo.goods_id,
      //   // 浏览
      //   market_tools_status: 0
      // });
      this.shadeShow = true;
      this.goodsPopShow = true;
    },
    // 商品推荐
    getGoodsInfo() {
      this.$fetch('goodsList', {
        webinar_id: this.$route.params.id
      }).then(res => {
        if (res.code == 200) {
          this.productFlag = true;
          this.goodsList = res.data.goods_list;
          this.goodsList
            && this.goodsList.length
            && (this.goodInfo = res.data.goods_list[0]);

          this.goodsList.forEach(good => {
            const imgUrl = good.img_list.find(img => img.is_cover === '1');
            if (imgUrl) {
              good.goodImage = `
                ${this.imageDomin}/
                ${
                  good.img_list.find(img => img.is_cover === '1').img_url
                }
              `;
            }
          });
        }
      });
    },
    // 关闭详情弹窗事件
    closeGoodPop() {
      this.shadeShow = false;
      this.goodsPopShow = false;
    },
    // 改变按钮显示内容
    changeBtnVal(newValue) {
      this.btnVal = newValue
    },
    
    // 获取关注人被关注数量
    getAttentionNum () {
      this.$fetch('getAttentionNum', {
        at_id: this.roomData.webinar.userinfo.user_id,
        type: 1
      }).then(res => {
        this.focusCount = res.data.count
      })
    },
    // 打开登录面板
    callLogin() {
      this.errorMessage = '';
      this.smsErrorMessage = '';
      this.loginDialogShow = true;
      this.shadeShow = true;
      this.passwordShow = true;
    },
    // 校验登录次数
    checkLoginAccount() {
      this.$fetch('loginCheck', {
        account: this.ruleForm.username
      })
        .then(res => {
          if (res.code == 200) {
            if (res.data.check_result == 1) { // 账号被锁定 再次登录需要图片验证
              this.photoCpathaShow = true;
              this.callCaptcha('#photoCaptcha');
              if (this.phoneKey) {
                this.errorMessage = ''
                this.loginClick();
              }
            } else {
              this.errorMessage = ''
              this.loginClick();
            }
          } else {
            this.errorMessage = res.msg
          }
        })
        .catch(e => {
          console.log('登录检查失败:', e);
        });
    },
    // 校验账号登录
    checkLoginClick () {
      if (!this.ruleForm.username) {
        this.errorMessage = '请输入您的手机号或邮箱'
        return false
      } else if (!this.ruleForm.password) {
        this.errorMessage = '请输入您的账号密码'
        return false
      }else if (this.photoCpathaShow && !this.phoneKey) {
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
          visitor_id: sessionOrLocal.get('visitor_id') ? sessionOrLocal.get('visitor_id') : '', // 访客标识
          sso_token: sessionOrLocal.get('sso') ? sessionOrLocal.get('sso') : '' // sso服务生成的token（实现新、老控制台的同步登录用）
        }
      ).then(res => {
          if (res.code == 200) {
            this.errorMessage = ''
            this.loginDialogShow = false
            this.shadeShow = false
            this.phoneKey = ''
            this.photoCpathaShow = true
            this.$router.go(0) // 重新进入
            sessionOrLocal.set('sso', res.data.sso_token)
            sessionOrLocal.set('token', res.data.token, 'localStorage')
            sessionOrLocal.set('userInfo', res.data)
          } else {
            if (res.code == 12042) {
              this.errorMessage = '图片验证码错误'
              this.callCaptcha('#photoCaptcha')
            }
            this.errorMessage = res.msg
          }
        })
        .catch(e => {
          console.log(112, e)
          if (e.captcha[0] == '图形码未验证通过') {
            this.errorMessage = '图形码未验证通过'
          }
        });
    },
    // 超过登录次数 唤起图片验证码
    callCaptcha(element) {
      let that = this;
      initNECaptcha({
        captchaId: this.key,
        element: element,
        mode: 'float',
        width: 270,
        onReady(instance) {
          console.log('instance', instance);
        },
        onVerify(err, data) {
          if (data) {
            that.phoneKey = data.validate
            that.errorMessage = ''
            if (element == '#captcha') { // 快捷登录 释放获取验证码按钮
              that.buttonControl = false;
            }
          } else {
            that.errorMessage = '图形码未验证通过'
          }
        },
        onload(instance) {
          that.errorMessage = '图形码未验证通过';
        }
      })
    },
    // 快捷登录 获取短信验证码
    getCaptha(key) {
      let that = this
      if (!this.ruleForm.usernames) {
        this.smsErrorMessage = '请输入您的手机号'
        return
      }
      this.$fetch('sendCode', {
          type: 1,
          data: this.ruleForm.usernames,
          validate: this.phoneKey,
          scene_id: 7
        }
      ).then(res => {
        if (res.code == 200) {
          this.buttonControl = true;
          this.sendMsgDisabled = true;
          if (this.timeinterval) clearInterval(this.timeinterval)
          this.timeinterval = setInterval(() => {
            console.log('aaa', that.countTime)
            if (that.countTime > 0) {
              that.countTime--;
            } else {
              clearInterval(that.timeinterval)
              that.sendMsgDisabled = false;
              that.countTime = 60;
              that.buttonControl = false;
            }
          }, 1000);
        }
      }).catch(e => {
        console.log(e)
      });
    },
    // 快捷登录
    telLogin() {
      if (!this.ruleForm.usernames) {
        this.smsErrorMessage = '请输入您的手机号';
        return;
      } else if (!this.ruleForm.captchas) {
        this.smsErrorMessage = '请输入动态验证码';
        return;
      }
      this.$fetch('loginInfo', {
          account: this.ruleForm.usernames,
          dynamic_code: this.ruleForm.captchas,
          visitor_id: sessionOrLocal.get('visitor_id') ? sessionOrLocal.get('visitor_id') : '', // 访客标识
          sso_token: sessionOrLocal.get('sso') ? sessionOrLocal.get('sso') : '' // sso服务生成的token（实现新、老控制台的同步登录用）
        }
      ).then(res => {
        if (res.code == 200) {
          this.loginDialogShow = false;
          this.shadeShow = false;
          this.$router.go(0);
          this.phoneKey = ''
          this.smsErrorMessage = ''
          sessionOrLocal.set('sso', res.data.sso_token)
          sessionOrLocal.set('token', res.data.token, 'localStorage')
          sessionOrLocal.set('userInfo', res.data)
        } else if (res.code == 10000) {
          this.smsErrorMessage = '当前账号或密码错误'
        } else {
          this.smsErrorMessage = res.msg
        }
      });
    },
    // other登录方式的修改
    otherLoginClick() {
      this.otherWayShow = !this.otherWayShow;
      this.pickUpShow = !this.pickUpShow;
    },
    // 云链账号登录
    usersLogin() {
      this.typeControl = true;
      this.isActive = true;
      this.bottomLoginInfo = true;
      this.errorMessage = '';
    },
    // 点击快捷进行登录
    messgeLogin() {
      this.typeControl = false;
      this.isActive = false;
      this.bottomLoginInfo = false;
      this.smsErrorMessage = '';
      this.callCaptcha('#captcha');
    },
    // 退出
    handleQuit () {
      this.$fetch('loginOut').then(res => {
        if (res.code == 200) {
          sessionOrLocal.removeItem('sso')
          sessionOrLocal.removeItem('token', 'localStorage')
          sessionOrLocal.removeItem('userInfo')
          sessionOrLocal.removeItem('visitor_id')
          window.location.reload()
        }
      })
    },
    /**
     * 判断主按钮状态
     */
    getBtnText() {
      // type  直播状态 1直播中 2预告 3直播结束 4点播 5回放
      // verify  验证类型，0 无验证，1 密码，2 白名单，3 付费活动, 4 F码, 6 付费+F码
      // verified 除报名表单外其余的条件验证通过
      let ret = ''
      const {
        verify,
        type,
        verified,
        fee,
        is_subscribe,
        reg_form
      } = this.roomData.webinar
      // 预告
      if (reg_form == 1) {
        if (type == 2) {
          if (verified && is_subscribe == 1) {
            ret = '预约成功'
            this.buttonDisabled = true
          } else {
            if (verify == 3) {
              ret = `付费预约`
              this.limitText = `付费${fee}￥`
            } else if (verify == 6) {
              if (verified) {
                ret = '立即预约'
              } else {
                ret = `付费(￥${fee})立即预约`
                this.limitText = `邀请码`
              }
            } else if (verify == 4) {
              ret = '观看验证'
              this.limitText = '邀请码'
            } else if (verify == 1) {
              // 密码
              ret = '立即预约'
              this.limitText = '密码'
            } else if (verify == 2) {
              ret = '立即预约'
              this.limitText = '白名单'
            } else {
              ret = '立即预约'
              this.limitText = '免费'
            }
          }
          // 直播中
        } else if (type == 1) {
          ret = this._getBtnText('进入直播', verified, verify, fee)
        } else {
          // 回放
          if (type == 5) {
            ret = this._getBtnText('观看回放', verified, verify, fee)
            // 点播
          } else if (type == 4) {
            ret = this._getBtnText('观看点播', verified, verify, fee)
          } else {
            // 结束
            ret = '直播已结束'
            this.buttonDisabled = true
          }
        }
        this.btnVal = ret
      } else {
        if (type == 2) {
          if (verified) {
            ret = '预约成功'
            this.buttonDisabled = true
          } else {
            if (verify == 0) {
              ret = '立即预约'
              this.limitText = '免费'
            } else if (verify == 3) {
              ret = `付费预约`
              this.limitText = `付费${fee}￥`
            } else if (verify == 6) {
              ret = `付费(￥${fee})立即预约`
              this.limitText = `邀请码`
              // this.setData({
              //   btnShowInviteCode: true
              // })
            } else if (verify == 4) {
              ret = '观看验证'
              this.limitText = '邀请码'
            } else if (verify == 1) {
              ret = '立即预约'
              this.limitText = '密码'
            } else if (verify == 2) {
              ret = '立即预约'
              this.limitText = '白名单'
            } else {
              ret = '观看验证'
              this.limitText = '免费'
            }
          }
          // 直播中
        } else if (type == 1) {
          ret = this._getBtnText('进入直播', verified, verify, fee)
        } else {
          // 回放
          if (type == 5) {
            ret = this._getBtnText('观看回放', verified, verify, fee)
            // 点播
          } else if (type == 4) {
            ret = this._getBtnText('观看点播', verified, verify, fee)
          } else {
            // 结束
            ret = '直播已结束'
            this.buttonDisabled = true
          }
        }
        this.btnVal = ret
        // if (ret) {
        //   this.showLimitBtn = true
        // } else {
        //   this.showLimitBtn = false
        // }
      }
    },
    _getBtnText(txt, verified, verify, fee) {
      let ret = ''
      if (this.roomData.webinar.reg_form == 1) {
        // 已经验证过或者免费
        if (
          (verified && this.roomData.webinar.is_subscribe == 1) ||
          verify == 0
        ) {
          ret = txt
          return ret
        }
        // 其他需要验证的类型
        if (verify == 3) {
          ret = `付费观看`
          this.limitText = `付费${fee}￥`
        } else if (verify == 6) {
          if (verified) {
            ret = '观看验证'
          } else {
            ret = `付费观看`
            this.limitText = `付费${fee}￥`
          }
        } else if (verify == 1) {
          ret = `观看验证`
          this.limitText = `密码`
        } else if (verify == 2) {
          ret = `观看验证`
          this.limitText = `白名单`
        } else if (verify == 4) {
          ret = `观看验证`
          this.limitText = `邀请码`
        } else {
          ret = '观看验证'
          this.limitText = `免费`
        }
        return ret
      } else {
        // 已经验证过或者免费
        if (verified || verify == 0) {
          ret = txt
          return ret
        }
        // 其他需要验证的类型
        if (verify == 3) {
          ret = `付费观看`
            this.limitText = `付费${fee}￥`
        } else if (verify == 6) {
          ret = `付费观看`
            this.limitText = `付费${fee}￥`
          // this.setData({
          //   btnShowInviteCode: true
          // })
        } else if (verify == 1) {
          ret = `观看验证`
          this.limitText = `密码`
        } else if (verify == 2) {
          ret = `观看验证`
          this.limitText = `白名单`
        } else if (verify == 4) {
          ret = `观看验证`
          this.limitText = `邀请码`
        } else {
          ret = '观看验证'
          this.limitText = `免费`
        }
        return ret
      }
    },
    // 底部按钮点击验证
    btnClick(e) {
      console.log('点击-------------------')
      if (this.hasClick) {
        return
      }
      this.hasClick = true
      // 只有免费的才可以不登录进直播
      const {
        type,
        verify
      } = this.roomData.webinar
      try {
        if (type == 3) {
          // 直播结束
          this.$message.warn('直播已结束')
          this.hasClick = false
          return
        }
        // 判断登录
        if (!this.isLogin) {
          this.callLogin()
          this.hasClick = false
          return
        }
        /**
         * 下面的就是条件验证没通过的情况
         */
        if (verify == 6) { // 验证码加付费
          const type = e.target.nodeName
          if (e == 'I') {
            if (!this.showModile) {
              this.tipTitle = '邀请码验证'
              this.dialogPlaceholder = '请输入邀请码'
              this.tipContent = ''
              this.showModile = true
            }
            this.checkInviteCodeAuth()
          } else {
            this.feeAuth()
          }
        } else if (verify == 4) {
          if (!this.showModile) {
            this.tipTitle = '邀请码验证'
            this.dialogPlaceholder = '请输入邀请码'
            this.showModile = true
          }
          this.checkInviteCodeAuth()
        } else if (verify == 3) {
          this.feeAuth()
        } else if (verify == 2) {
          if (!this.showModile) {
            this.tipTitle = '身份验证'
            this.tipContent = '当前活动设置了身份验证'
            this.dialogPlaceholder = '请输入身份信息'
            this.showModile = true
          }
          this.whiteAuth()
        } else if (verify == 1) {
          if (!this.showModile) {
            this.tipTitle = '密码验证'
            this.tipContent = '当前活动需要密码'
            this.dialogPlaceholder = '请输入密码'
            this.showModile = true
          }
          this.passwordAuth()
        } else if (verify == 0) {
          this.handleAppointment()
        }
      } catch (e) {
        console.log('预约鉴权失败', e)
      }
    },
    // 邀请码鉴权
    checkInviteCodeAuth () {
      console.log(1111123123123123, this.confirmError(this.authCheckValue))
      if (this.confirmError(this.authCheckValue)) {
        this.fetchAuth({type: 4, verify_value: this.authCheckValue})
      }
    },
    // 付费鉴权
    feeAuth () {
      this.fetchAuth({type: 3})
    },
    // 白名单鉴权
    whiteAuth () {
      if (this.confirmError(this.authCheckValue)) {
        this.fetchAuth({type: 2, verify_value: this.authCheckValue})
      }
    },
    // 密码鉴权
    passwordAuth () {
      if (this.confirmError(this.authCheckValue)) {
        this.fetchAuth({type: 1, verify_value: this.authCheckValue})
      }
    },
    // 弹窗确认失败处理
    confirmError (content) {
      if (content == '') {
        this.hasClick = false
        return false
      } else {
        return true
      }
    },
    // 立即预约
    handleAppointment () {
      this.fetchAuth({type: 0})
    },
    // 请求鉴权
    fetchAuth (params) {
      this.$fetch('watchAuth', {
        ...this.joinCommonParam,
        ...params
      }).then(res => { 
        if (res.code == 200) {
          console.log('>>>>>>校验通过')
          // this.toWatch()
        } else {
          this.handleAuthErrorCode(res.code, res.msg)
          this.hasClick = false
        }
      }).catch(e => {
        console.log(e)
        this.hasClick = false
      })
    },
    // 鉴权code处理
    handleAuthErrorCode (code, msg) {
      switch (code) {
        case 10008:
          this.showLoginCard = true
          this.hasClick = false
          break
        case 12525:
          // this.$toast('未填写报名表单')
          this.$router.push({name: 'signup', params: {id: this.$route.params.id}})
          break
        case 12002:
          this.$message.warning('活动不存在')
          break
        case 12522:
          this.$message.warning('主持人、嘉宾或助理不允许进入观看端')
          break
        case 12514: 
          this.$message.warning('您已被踢出，请联系活动组织者')
          this.$emit('haveKick')
          break
        case 12529:
          this.$message.warning('邀请码错误')
          break
        case 12530:
          this.$message.warning('邀请码已被使用')
          break
        case 12531:
          this.$message.warning('请输入邀请码')
          break
        case 12527:
            this.$message.warning('密码错误')
          break
        case 12528:
            this.$message.warning('请输入密码')
          break
        case 12532:
            this.$message.warning('请输入白名单手机号')
          break
        case 12017:
            this.$message.warning('白名单观众不存在')
          break
        case 12523: // TODO:
            this.$message.warning('需要支付')
            console.log(1111111111111111111)
            // window.location.href = `https://t-saas-dispatch.vhall.com/v3/commons/auth/weixin?source=wab&jump_url=https://t.e.vhall.com/v3/watch/${this.$route.params.id}`
            window.location.href = `https://t-saas-dispatch.vhall.com/v3/commons/auth/weixin?source=wab&jump_url=http://172.16.23.7:8081/watch/803634057`
            // if (Array.isArray(param)) {
                  //   // 如果是个数组说明需要跳转支付宝(兼容老接口，无数据的时候返回空数组，有数据了返回对象,对象内部是拉起微信支付的参数)
                  //   window.location.href = `${this.webinarInfo.domains.web}/webinar/paywebinar/${this.$route.params.id}`
                  // } else {
                  //   WeixinJSBridge.invoke(
                  //     'getBrandWCPayRequest',
                  //     {
                  //       appId: param.appId,
                  //       timeStamp: String(param.timeStamp), // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                  //       nonceStr: param.nonceStr, // 支付签名随机串，不长于 32 位
                  //       package: param.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
                  //       signType: param.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                  //       paySign: param.paySign // 支付签名
                  //     },
                  //     function(res) {
                  //       if (res.err_msg == 'get_brand_wcpay_request:ok') {
                  //         that.$toast('支付成功')
                  //         window.location.reload()
                  //         // window.location.replace(window.location.href)
                  //         // 使用以上方式判断前端返回,微信团队郑重提示：
                  //         // res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
                  //       }
                  //     }
                  //   )
                  // }
            break;
        default:
          this.$message.warn(res.msg)
          break
      }
    },
    handleCancelDelete () {
      this.showModile = false
      this.authCheckValue = ''
      this.dialogPlaceholder = ''
    }
  },
  filters: {
    webinarTypeToText(val){
      let str = val;
      switch (val) {
        case 1:
          str = "预告";

          break;

        default:
          break;
      }
      return str;
    }
  },
};
</script>

<style lang="less" scoped>
  .wrap{
    width: 100%;
    // margin: -1rem;
    min-width: 1280px;
    margin: 0 auto;
    background: #fff;
    overflow-y: hidden;
    position: relative;
    .shade {
      position: fixed;
      top: 0;
      width: 100%;
      height: 100%;
      background: #2d2d2d;
      opacity: 0.5;
      z-index: 3;
    }
  }
  .area {
    width: 1220px;
    margin: 0 auto;
    @media screen and (min-width: 1380px) {
      width: 1480px;
    }
  }
  .watchContainer{
    padding: 10px 0 20px;
    padding-top: 36px;
    background-color: #e8e9eb;
    border-bottom: 1px solid #c9c9c9;
  }
  .iconBtn{
    .iconContainer{
      font-size: 14px;
      cursor: pointer;
      /deep/ .svg-icon{
        font-size: 16px;
        margin-right: 4px;
        vertical-align: middle;
      }
      &:hover{
        /deep/ .svg-icon{
          color: #333;
        }
      }
      margin-right: 10px;
    }
    .focusBtn{
      display: inline-block;
      padding: 3px 12px;
      background-color: #ff3333;
      color: #fff;
      text-align: center;
      border-radius: 3px 0 0 3px;
      font-style: normal;
      line-height: normal;
      cursor: pointer;
    }
    .focusCount{
      color: #ff3333;
      background-color: #fbdcdc;
      border-radius: 0 3px 3px 0;
      display: inline-block;
      padding: 3px 12px;
      font-style: normal;
      line-height: normal;
    }
  }
  .gray{
    color: #7c8287;
    font-size: 14px;
  }
  .mrR{
    margin-right: 20px;
  }
  .font-14{
    font-size: 14px;
  }
  .blue{
    color: #1087dc;
  }
  .red{
    color: #e63c37;
  }
  .topInfo{
    p{
      line-height: 32px;
    }
    b{
      font-size: 24px;
      font-weight: normal;
    }
    .tag{
      color: #fff;
      display: inline-block;
      background-color: #1087dc;
      font-size: 14px;
      padding: 0 8px;
      border-radius: 3px;
      margin: 8px 0 0 15px;
      line-height: normal;
    }
    .right{
      float: right;
    }
  }
  .watchBox{
    margin-top: 40px;
    display: flex;
    height: 521px;
    overflow: hidden;
    .leftWatch{
      flex: 1;
      line-height: 0;
      img{
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }
    .rightWatch{
      width: 300px;
      background: #242424;
      color: #fff;
      position: relative;
      .title{
        font-size: 20px;
        text-align: center;
        margin: 40px 0;
      }
      .timeBox{
        display: flex;
        justify-content: space-around;
        >div{
          width: 64px;
          height: 90px;
          background: #1b1b1b;
          border: 2px solid #2d2d2d;
          border-radius: 4px;
          text-align: center;
        }
        .mian{
          font-size: 33px;
          margin: 10px 0;
          margin-bottom: 4px;
        }
        .sub{
          font-size: 14px;
          color: #7c8287;
        }
      }
    }
  }
  .bottom{
    position: absolute;
    bottom: 40px;
    width: 100%;
    padding: 0 20px;
    .el-button{
      width: 100%;
    }
    .limit{
      margin-top: 10px;
      color: #7c8287;
      text-align: center;
      font-size: 14px;
      height: 20px;
      color: #7c8287;
    }
  }
  .foot{
    margin-top: 20px;
    border: 1px solid #d2d2d2;
    /deep/ .el-tabs__content{
      padding: 20px;
      font-size: 14px;
      color: #666;
    }
  }
  .activity{
    width: max-content;
    overflow: hidden;
    transition: all .15s linear;
    // &::after{
    //   content: '';
    //   display: block;

    // }
    li{
      float: left;
      width: 260px;
      margin-right: 20px;
      .imgBox{
        width: 100%;
        height: 146px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .activityName{
        font-size: 14px;
        color: #333333;
        text-align: center;
        margin-top: 6px;
        height: 40px;
        line-height: 20px;
        span{
          display: inline-block;
          text-align: left;
        }
      }
    }
  }
  .operaBtn{
    display: inline-block;
    width: 50px;
    height: 50px;
    line-height: 50px;
    background: #FFFFFF;
    background: #FFFFFF;
    border-radius: 50%;
    position: absolute;
    top: 60px;
    box-sizing: border-box;
    cursor: pointer;
    font-size: 18px;
    transition: all .15s linear;
    &:hover{
      background: #7DB7F0;
      color: #fff;
    }
    &.left{
      left: -24px;
      text-align: right;
      padding-right: 10px;
    }
    &.right{
      right: -24px;
      text-indent: 4px;
    }
  }
  .fixWidth{
    padding: 20px;
    border: 1px solid #D2D2D2;
    display: inline-block;
    width: 300px;
    box-sizing: border-box;
    margin-top: 20px;
    margin-left: 20px;
    vertical-align: top;
    .productImg{
      width: 100%;
      height: 254px;
      cursor: pointer;
      img{
        height: 100%;
        width: 100%;
      }
    }
    .title{
      font-size: 19px;
      color: #333;
      font-weight: bold;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 40px;
    }
    .price{
      span:nth-child(1){
        font-size: 24px;
        color: #FC5659;
      }
      span:nth-child(2){
        font-size: 18px;
        color:#D2D2D2;
        i{
          text-decoration: line-through;
          font-style: normal;
        }
      }
    }
    .desc{
      font-size: 14px;
      color: #666;
      margin-top: 20px;
    }
    .fullBut{
      width: 100%;
      margin-top: 20px;
    }
    .textBtn{
      width: 100%;
      color: #FC5659;
      text-align: center;
      border: 0 none;
    }
  }
  .product{
    .flex1{
      display: inline-block;
      width: calc(84% - 78px);
    }
  }
  .wh-title {
    max-width: 1480px;
    line-height: 70px;
    // min-width: 1220px;
    margin: 0 auto;
    overflow: hidden;
    .title-right {
      float: right;
      .el-input {
        width: auto;
      }
      .button-register {
        padding: 0px;
        border: none;
        background: #fc5659;
        color: #fff;
        border: none;
        span{
          display: inline-block;
          width: 70px;
          text-align:center;
        }
      }

      .button-login {
        padding: 0px;
        border: none;
        margin-left: 20px;
        background: #e7e7e7;
        color: #333;
        span{
          display: inline-block;
          width: 70px;
          text-align:center;
        }
      }
    }
    .logo-image {
      width: 80px;
      height: 38px;
      float: left;
      margin-top: 16px;
    }
    .login-info-list {
      font-size: 12px;
      position: absolute;
      top: 70px;
      z-index: 66;
      width: 200px;
      height: 200px;
      cursor: pointer;
      background: #fff;
      margin-right: 8px;
      .recive-news {
        font-size: 12px;
        border-radius: 50%;
        position: absolute;
        width: 18px;
        height: 18px;
        background-color: #ff3333;
        color: #fff;
        line-height: 18px;
        text-align: center;
        margin-left: 7px;
        top: 10px;
      }
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
          .recive-news {
            font-size: 12px;
            border-radius: 50%;
            position: absolute;
            width: 18px;
            height: 18px;
            background-color: #ff3333;
            color: #fff;
            line-height: 18px;
            text-align: center;
            margin-left: 7px;
            top: 10px;
          }
        }
      }

      li:first-of-type {
        i {
          width: 21px;
          height: 19px;
          background: url(https://cnstatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
            no-repeat -70px -17px;
        }
        &:hover {
          i {
            background: url(https://cnstatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
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
          background: url(https://cnstatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
            no-repeat -71px -68px;
        }
        &:hover {
          i {
            background: url(https://cnstatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
              no-repeat -130px -68px;
          }
        }
      }
      li:nth-of-type(3) {
        position: relative;
        i {
          width: 21px;
          height: 19px;
          background: url(https://cnstatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
            no-repeat -71px -238px;
        }
        &:hover {
          i {
            background: url(https://cnstatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
              no-repeat -131px -238px;
          }
        }
      }
      li:nth-of-type(4) {
        position: relative;
        i {
          width: 21px;
          height: 19px;
          background: url(https://cnstatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
            no-repeat -70px -95px;
        }
        &:hover {
          i {
            background: url(https://cnstatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
              no-repeat -130px -95px;
          }
        }
      }
      li:nth-of-type(5) {
        width: 200px;
        i {
          width: 21px;
          height: 19px;
          background: url(https://cnstatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
            no-repeat -70px -118px;
        }
        &:hover {
          i {
            background: url(https://cnstatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
              no-repeat -130px -118px;
          }
        }
      }
      li:nth-of-type(6) {
        i {
          width: 21px;
          height: 19px;
          background: url(https://cnstatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
            no-repeat -70px -142px;
        }
        &:hover {
          i {
            background: url(https://cnstatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
              no-repeat -130px -142px;
          }
        }
      }
      li:nth-of-type(7) {
        i {
          width: 21px;
          height: 19px;
          background: url(https://cnstatic01.e.vhall.com/static/images/vhall3.0/v35-icon-spirit.png?v=plCGclOoh092k9Uv6wWPcA%3D%3D)
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
        line-height: 30px;
        border-radius: 4px;
        text-align: center;
        border: none;
        outline: none;
        background: #fc5659;
        color: #fff;
        span {
          margin: 0px auto;
        }
        &.disabled {
          opacity: .5;
        }
      }
    }
    .head.left .line {
      transform: translateX(0);
    }
    .head.right .line {
      transform: translateX(100%);
    }
    .head {
      width: 100%;
      height: 54px;
      line-height: 54px;
      border-bottom: 1px solid #dcdcdc;
      position: relative;
      box-sizing: border-box;
      p {
        width: 196px;
        font-size: 16px;
        font-weight: 400;
        color: rgba(51, 51, 51, 1);
        text-align: center;
        height: 22px;
        line-height: 22px;
        display: inline-block;
        cursor: pointer;
        box-sizing: border-box;
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
        display: inline-block;
        position: relative;
        color: #fc5659;
        min-width: 16px;
        height: 16px;
        line-height: 16px;
        font-size: 16px;
        margin-left: 20px;
        &:before{
          content: 'x';
          position: absolute;
          top: 0px;
          left: -20px;
          width: 16px;
          height: 16px;
          border-radius: 8px;
          background: #fc5659;
          color: #fff;
          line-height: 16px;
          text-align: center;
          font-size: 12px;
        }
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
        background: url('https://cnstatic01.e.vhall.com/static/images/vhall3.0/login_spirt.png?v=TTFVyijQs0w%2BDrAG7%2B%2FB3g%3D%3D')
          no-repeat -12px -143px;
      }
      .ioncPickDown {
        background: url('https://cnstatic01.e.vhall.com/static/images/vhall3.0/login_spirt.png?v=TTFVyijQs0w%2BDrAG7%2B%2FB3g%3D%3D')
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
      background: url(https://cnstatic01.e.vhall.com/static/images/vhall3.0/login_spirt.png?v=TTFVyijQs0w%2BDrAG7%2B%2FB3g%3D%3D)
        no-repeat -10px -227px;
    }
    .third-auth .weibo:hover {
      background-position: -39px -227px;
    }
    .third-auth .qq {
      background: url(https://cnstatic01.e.vhall.com/static/images/vhall3.0/login_spirt.png?v=TTFVyijQs0w%2BDrAG7%2B%2FB3g%3D%3D)
        no-repeat -10px -166px;
    }
    .third-auth .qq:hover {
      background-position: -39px -166px;
    }
    .third-auth .weixin:hover {
      background-position: -39px -196px;
    }
    .third-auth .weixin {
      background: url(https://cnstatic01.e.vhall.com/static/images/vhall3.0/login_spirt.png?v=TTFVyijQs0w%2BDrAG7%2B%2FB3g%3D%3D)
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
  .button-style {
    width: 70px;
    height: 38px;
  }
  .footer {
    margin: 0 auto;
    padding-left: 80px;
    padding-right: 80px;
    padding-bottom: 100px;
    text-align: center;
    font-size: 14px;
    margin-top: 40px;
    max-width: 1480px;
    p {
      color: #808080;
      line-height: 25px;
    }
    .about-us {
      border-top: 1px solid #e1e1e1;
      padding-bottom: 10px;
      padding-top: 40px;
      font-size: 14px;
      a {
        text-decoration: none;
        color: #333;
        display: inline-block;
        padding: 0 15px;
        line-height: 1;
        border-right: 1px solid #000;
        &:last-child {
          border: none;
        }
      }
    }
  }
  .officialaccount-qrcode {
    position: relative;
    text-align: center;
    height: 32px;
    line-height: 32px;
    font-size: 14px;
    color: #444;
    cursor: pointer;
    margin-right: 20px;
    span {
      font-size: 14px;
      margin: 10px 0;
      line-height: 25px;
      i {
        font-size: 16px;
        margin-right: 5px;
        vertical-align: middle;
      }
    }
    .qr-wrap {
      position: absolute;
      top: 46px;
      left: -42px;
      z-index: 111;
      width: 168px;
      height: 168px;
      padding: 10px;
      border-radius: 5px;
      background-color: #ffffff;
      box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
      box-sizing: border-box;
      display: none;
      .arrow {
        height: 6px;
        width: 6px;
        top: -9px;
        left: 78px;
        position: absolute;
        border-width: 0 7px 10px;
        border-style: solid;
        border-color: transparent transparent white;
        box-sizing: border-box;
        margin: 0px;
      }
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    &:hover {
      .qr-wrap {
        display: block;
      }
    }
  }
  .preview-wrap {
    background-color: white;
    font-size: 14px;
    .preview-title {
      color: #666666;
      width: 260px;
      margin: 0 auto;
      text-align: center;
      .owner {
        color: #333333;
        display: block;
        padding-top: 5px;
      }
      span {
        display: block;
      }
    }
    .preview-content {
      margin: 20px auto 10px;
      width: 220px;
      a > {
        img {
          width: 220px;
          height: 220px;
          display: block;
          margin-bottom: 5px;
        }
      }
      .preview-des {
        display: block;
        width: 200px;
        height: 30px;
        line-height: 30px;
        border-radius: 2px;
        margin: auto;
        text-align: center;
        color: #999999;
        font-size: 14px;
      }
    }
  }
</style>
