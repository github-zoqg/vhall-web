<template>
  <tip v-if="tipMsg" :text="tipMsg"> </tip>
  <div v-else class="watch-wrap">
    <header
      v-if="roominfo.modules && roominfo.modules.logo.image"
      class="wh-title"
    >
      <img v-if="roominfo.modules && roominfo.modules.logo.show == 1" class="logo-image" :src="roominfo.modules.logo.image" alt @click.stop="handleSkipLogo"/>
      <div class="title-right">
        <span v-if="!isLogin">
          <el-button class="button-style button-login" @click="callLogin"
            >登录</el-button
          >
          <el-button
            @click="registerClick"
            v-if="regShow"
            class="button-style button-register"
            >注册</el-button
          >
        </span>
        <span v-else>
          <div @click="menuListShow = !menuListShow" class="loginUserInfo">
            <img
              :src="roominfo.auth.avatar ? roominfo.auth.avatar : '//cnstatic01.e.vhall.com/static/img/head50.jpg'"
              alt
            />
            <div class="login-nickName">
              <span>{{ roominfo.auth.nick_name }}</span>
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
                <!-- <a :href="webDominUrl + '/auth/logout'"> -->
                  <i></i>
                  <span @click="quitLive">退出登录</span>
                <!-- </a> -->
              </li>
            </ul>
          </div>
        </span>
      </div>
    </header>

    <div class="back-content">
      <div class="watch-content">
        <div class="watch-middle-cotent">
          <div class="watch-width-content">
            <img v-if="logoShow" class="skin-logo" :src="skinLogo" alt />
            <div class="seeding-infoleft">
              <h3 class="seeding-title">
                {{ activeInfo.subject }}&nbsp;&nbsp;
              </h3>
              <span class="seeding-icon">{{iconPlay}}</span>
              <div>
                <template v-if="roominfo.modules && roominfo.modules.logo.organizers_status == 1">
                  <span
                    style="color: #666"
                    class="iconfont"
                    :class="{
                      'iconzhubanfang1-copy': roominfo.modules.initiator.show == 1
                    }"
                  ></span>
                  <span
                    v-if="roominfo.modules.initiator.show == 1"
                    style="color: #666"
                    >主办方：</span
                  >
                  <a
                    v-if="roominfo.modules.initiator.show == 1"
                    :href="webDominUrl + '/user/home/' + roominfo.host.id"
                    style="color:#007AFF;cursor:pointer;"
                    >{{ hostInfo.nick_name }}</a
                  >
                </template>
                <span
                  style="margin-left: 20px;color: #666"
                  class="iconfont iconshijian"
                  :class="{ leftmargin: roominfo.modules.initiator.show == 0 }"
                ></span>
                <span style="color: #666"
                  >时间：{{ activeInfo.start_time }}</span
                >
              </div>
            </div>
            <div class="seeding-inforight">
              <div class="pv-online-account">
                <span
                  v-show="pvShow"
                  style="margin-left:10px; margin-bottom: 12px;color:#666; float:right;"
                >
                  <span
                    v-show="pvShow"
                    class="iconfont iconguankancishu"
                  ></span>
                  {{ roomData && roomData.pv ? roomData.pv.num : 0 }}次观看
                </span>
                <span
                  v-show="pvShow && onlineShow && iconPlay == '直播'"
                  style="margin-left: 7px;color: #BFBFBF; float:right;"
                  >|</span
                >
                <span
                  v-show="onlineShow && iconPlay == '直播'"
                  style=" margin-bottom: 12px;color:#666; float:right;"
                >
                  <span
                    v-show="onlineShow"
                    class="iconfont iconzaixianrenshu"
                  ></span>
                  {{ roomData && roomData.online ? roomData.online.num : 0 }}人在线
                </span>
              </div>
              <div class="seeding-funct">
                <div @click="fullScreen" class="full-screen" v-if="!isIE">
                  <span
                    class="iconfont iconquanping"
                    style="font-size: 12px;"
                  ></span>
                </div>
                <div v-if="attentionShow">
                  <i class="focusBtn" @click="handleAttention" >
                    {{attentionContent}}
                  </i>
                  <i class="focusCount">{{focusCount}}</i>
                </div>
                <!-- <div
                  v-if="attentionShow"
                  :class="followStyle ? 'followShow' : 'follow'"
                  @click="handleAttention"
                >
                  <i class="focusBtn">{{ attentionContent }}</i>
                  <i class="focusCount">{{ focusCount }}</i>
                  <span class="iconfont iconguanzhu"></span>
                  <span style="margin-left: 5px;">{{ attentionContent }}</span>
                </div> -->
                <div
                  class="officialaccount-qrcode"
                  v-if="showOfficialAccountMiniQRCode"
                >
                  <span><i class="iconfont iconweixin"></i>微信公众号</span>
                  <div class="qr-wrap">
                    <span class="arrow"></span>
                    <template v-if="roominfo.modules.adv && roominfo.modules.adv.public.img">
                      <img
                        :src="`${roominfo.modules.adv.public.img}?x-oss-process=image/resize,m_fill,w_233,h_233`"
                        :alt="`${roominfo.modules.adv.public.img}`"
                      />
                    </template>
                  </div>
                </div>
              </div>
            </div>
            <div class="seeding-content">
              <vhall-enjoy-watch-Saas
                v-if="roominfo.vss_token && !kickOutSass && !isFullStarff"
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
                :bizInfo="roominfo"
                :configList="configList"
                @NoLogin="callLogin"
                @descripe="decripeMenu"
              ></vhall-enjoy-watch-Saas>
              <div class="vhall-kick-outs" v-if="kickOutSass">
                <h1>您已被禁止，访问房间！</h1>
              </div>
              <div class="full-statrff" v-if="isFullStarff">
                <h1>活动现场太火爆，已超过人数上限!</h1>
              </div>
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
                        {{sendMsgDisabled ? (time + '秒') : '获取验证码'}}
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
                      <div class="third-way-choose" v-if="otherWayShow && roominfo.webinar.id">
                        <div class="third-auth">
                          <a
                            :href="qqLink"
                            class="qq"
                            title="QQ登录"
                          ></a>
                          <a
                            :href="wxLink"
                            class="weixin"
                            title="微信登录"
                          ></a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-bgColor">
          <div class="bottom-content">
            <!-- 活动简介 -->
            <div class="active-left">
              <div class="active-introduce" v-show="menuList.length > 0">
                <h3
                  v-for="(item, index) in menuList"
                  @click="activeClick(index, item)"
                  :key="index"
                  :class="{ active: activeIndex == index }"
                >
                  {{ item.name }}
                </h3>
                <hr />
                <div class="active-content">
                  <div
                    v-show="showIntroduce"
                    class="active-introduce-content"
                    v-html="simpleContent"
                  >
                    {{ simpleContent }}
                  </div>
                  <div v-show="!showIntroduce">
                    <template v-for="(i, num) in customTabInfo">
                      <div :key="num">
                        <custom-tab
                          :mode="1"
                          :info="i"
                        ></custom-tab>
                      </div>
                    </template>
                  </div>
                </div>
                <!-- <div class="active-content"> -->
                  <!-- <div v-for="(items, index) in menuList" :key="index"> -->
                    <!-- <div
                      v-if="items.type == 4 && activeIndex == index"
                      class="active-introduce-content"
                      v-html="simpleContent"
                    >
                      {{ simpleContent }}
                    </div> -->
                    <!-- <template v-if="activeIndex + 1 == index + 1"> -->
                      <!-- <custom-tab
                        v-if="items.type == 1"
                        :roominfo="roominfo"
                        :components="items.components"
                        :topShow="topShow"
                        :invitedFriend="invitedFriend"
                        :rulesShow="rulesShow"
                        :domains="roominfo.domains"
                        @changeRules="rulesShow = !rulesShow"
                        @invitedTopClick="topShow = true"
                        @rewardListClick="topShow = false"
                      >
                      </custom-tab> -->
                      <!-- <custom-tab
                        :mode="1"
                        :info="item.component"
                      ></custom-tab> -->
                    <!-- </template> -->
                  <!-- </div> -->
                <!-- </div> -->
              </div>

              <div class="active-second" v-show="roominfo.advs && roominfo.advs.length > 0">
                <h3>活动推荐</h3>
                <hr />
                <div class="active-recommond">
                  <swiper :options="swiperOption">
                    <swiper-slide
                      v-for="(item, index) in roominfo.advs"
                      :key="index"
                    >
                      <div class="recommond-content">
                        <span class="left-mark">推广</span>
                        <a :href="item.url">
                          <img
                            :src="item.img_url"
                            onerror="this.src='//cnstatic01.e.vhall.com/static/img/v35-webinar.png';this.onerror=null"
                            alt
                          />
                        </a>
                        <div class="recommond-contents">
                          <p class="content-header">{{ item.subject }}</p>
                        </div>
                      </div>
                    </swiper-slide>
                    <div
                      @click="preButtonClick"
                      v-show="swiperPrevShow"
                      class="swiper-button-prev"
                      slot="button-prev"
                    ></div>
                    <div
                      @click="nextButtonClick"
                      v-show="swiperNextShow"
                      class="swiper-button-next"
                      slot="button-next"
                    ></div>
                  </swiper>
                </div>
              </div>
            </div>
            <!-- 布局修改 -->
            <products
              v-show="sellGoodsShow"
              @sellGoodsInfo="sellGoodsInfo"
              :goodsList="goodsList"
            ></products>
          </div>
          <div class="footer inner-center tac" v-show="roominfo.modules && roominfo.modules.logo.reserved_status == 1">
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
        </div>
      </div>
    </div>
    <!-- 二维码弹窗 -->
    <div class="qrcodeDialog" v-if="qrCodeShow">
      <p class="qrcodeHead">扫码生成邀请卡</p>
      <span @click="qrCodeShow = false" class="closeQrcode">x</span>
      <img :src="qrCodeImg" alt />
    </div>
    <!-- 商品详情的弹窗 -->
    <goodsPop v-if="goodsPopShow" @closeGoodPop="closeGoodPop" :goodsAllInfo="goodInfo"></goodsPop>
    <popup
      :visible="showOfficialAccountQRCode"
      :width="'340px'"
      title="公众号二维码"
      :onClose="closeWXCode"
    >
      <div class="preview-wrap ad-qrcode">
        <div class="preview-title">
          <span class="owner">【{{ roominfo.host.nick_name }}】</span>
          <span>邀请你关注微信了解更多资讯</span>
        </div>
        <div class="preview-content">
          <a target="_blank" v-if="roominfo.modules.adv && roominfo.modules.adv.public.img">
            <img
              :src="
                `${roominfo.modules.adv.public.img}?x-oss-process=image/resize,m_fill,w_233,h_233`
              "
              :alt="`${roominfo.modules.adv.public.img}`"
            />
          </a>
          <div class="preview-des">扫码关注公众号</div>
        </div>
      </div>
    </popup>
    <!--弹窗蒙层-->
    <div class="shade" @click="shadeClick" v-if="shadeShow"></div>
  </div>
</template>
<script>
import VhallReport from '@/components/VhallReport/main'
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import { isIE, clearCookies } from '@/utils/utils'
import invited from './rankList' // 邀请榜
import reward from './rankList/reward' // 打赏榜
import goodsPop from './rankList/goodsPop'
import moment from 'moment'
import QRcode from 'qrcode'
// import customTab from './custom-tab'
import tip from './tip'
import products from '../components/products'
import customTab from './components/custom-menu/preview-box'
import 'swiper/dist/css/swiper.css'
import { sessionOrLocal } from '@/utils/utils'

export default {
  data() {
    return {
      customTabInfo: {},
      showIntroduce: true,
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
      isFullStarff: false, // 是否满员
      chatShow: '', // 聊天的status
      goodsPopShow: false,
      // roomUser: {
      //   uvOnline: '1',
      //   pvCount: '1'
      // }, // 在线观看数和在线人数
      baseRoomUser: {
        baseOnlineNum: 0,
        basePv: 0
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
        password: ''
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
          logo: {}
        },
        auth: {},
        host: {},
        webinar: {}
      }, // 房间信息
      swiperOption: {
        slidesPerView: 4,
        slidesPerGroup: 1,
        loop: false,
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
      focusCount: 0
    };
  },
  components: {
    customTab,
    swiper,
    swiperSlide,
    goodsPop,
    tip,
    products
  },
  created() {
    sessionOrLocal.set('tag', 'helloworld', 'localStorage'); // 第三方绑定信息 场景
    sessionOrLocal.set('sourceTag', 'watch'); // 第三方绑定信息 场景
    this.$loadingStatus = this.$loading({
      background: 'rgba(0,0,0,0.5)',
      text: '加载中'
    })
  },
  mounted() {
    window.EventBridge = this.$EventBus;
    sessionStorage.setItem('role_val', '2')
    this.userInfo = sessionOrLocal.get('userInfo') ? JSON.parse(sessionOrLocal.get('userInfo')) : {}
    if (this.userInfo && this.userInfo.user_id) {
      this.isLogin = true
    }
    // 加入消息 增加uv
    this.$EventBus.$on('Join', (msg) => {
      this.roomData.online.num = msg.context.uv
      this.roomData.pv.num = msg.context.pv
    })
    // 离开消息
    this.$EventBus.$on('Leave', (msg) => {
      this.roomData.online.num = msg.context.uv
      // this.roomData.pv.num = msg.pv
    })
    this.$EventBus.$on('updateBaseNum', (msg) => {
      let num = this.roomData.online.num
      this.roomData.online.num = Number(num) + Number(msg.data.update_online_num)

      let pvNum = this.roomData.pv.num
      this.roomData.pv.num = Number(pvNum) + Number(msg.data.update_pv)
    })
    this.$EventBus.$on('loaded', () => {
      this.$loadingStatus.close()
      // 是否显示公众号
      let modules = this.roominfo.modules ? this.roominfo.modules : null
      if (
        modules &&
        modules.adv &&
        modules.adv.public
      ) {
        // alert_type:1 自动弹出
        if (modules.adv.public.alert_type == 0 && modules.adv.public.status == 0) {
          this.showOfficialAccountQRCode = true
        }
        if (modules.adv.public.status == 0) {
          this.showOfficialAccountMiniQRCode = true
        }
      }
    });
    // 自适应处理
    window.addEventListener('resize', () => {
      let width = document.querySelector('.seeding-content').offsetWidth;
      /**
       * 根据文档区域 16: 9  去计算容器 高度
       * 具体算法。
       * 1.  计算出文档区域 宽度   width - 侧边栏 宽度 （ 295 ）
       * 2.  计算出文档区高度 + with - 295 / x = 16/ 9
       * x =  width - 295 / 1.78
       * 容器高度 =  height + 46 // 底部互动工具栏高度
      */
      const ratio = 16 / 9;
      const docHeight = (width - 294) / ratio + 46;
      document.querySelector('.seeding-content').style.height = `${docHeight}px`;
    });
    // 全屏兼容360浏览器等
    const setFullscreen = () => {
      const fullscreenElement =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullscreenElement ||
        document.msFullscreenElement;
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
  computed: {
    qqLink() {
      return `${process.env.VUE_APP_BIND_BASE_URL}/v3/commons/auth/qq?source=pc&jump_url=${this.location}/watch/${this.roomData.webinar.id}`
    },
    wxLink() {
      return `${process.env.VUE_APP_BIND_BASE_URL}/v3/commons/auth/weixin?source=pc&jump_url=${this.location}/watch/${this.roomData.webinar.id}`
    }
  },
  methods: {
    closeWXCode () {
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
      }, 1000 * 60 * 30)
    },
    async startRoomInitProcess () {
      try {
        await this.getRoomInfo() // 初始化房间信息
        if (this.roomData && this.roomData.status == 'subscribe') {
          if(location.pathname.indexOf('/embedclient/') != -1){
            this.$router.push({name: 'embedSubscribe', params: {id: this.$route.params.il_id}})
          }else{
            this.$router.push({name: 'Subscribe', params: {id: this.$route.params.il_id}})
          }
          return
        }
        if (this.roomData && this.roomData.status == 'live' && this.roomData.webinar.type != 4) {
          await this.queryRoomInterInfo() // 获取房间活动状态
        }
        if (this.roomData && this.roomData.status == 'live') {
          this.getFirstPost() // 开屏
        }
        this.getAdsInfo() // 获取活动广告信息
        this.getSkin() // 获取皮肤
        this.getPublisAdv() // 获取公众号广告
        this.getSignInfo() // 获取标记 logo 主办方信息
        this.getMenuList()
        // 预约后的活动才显示邀请卡
        if (this.isLogin) {
          this.getAttentionStatus()
        }
        if (this.roomData && this.roomData.is_subscribe) {
          this.getInviteStatus()
        }
        if (this.roomData) {
          this.getConfigList() // 获取观看端配置项
          this.handleRoomInfo()
        }
      } catch (e) {
        console.log('初始化调用失败:', e)
      }
    },
    // 初始化房间信息
    getRoomInfo () {
      return this.$fetch('watchInit', {
        webinar_id: this.$route.params.il_id,
        visitor_id: sessionOrLocal.get('visitor_id') ? sessionOrLocal.get('visitor_id') : '',
        refer: '',
        record_id: '', // TODO:
        wx_url: ''
      }).then(res => {
        this.roomData = res.data && res.data
        this.roomData.online.num += 1 // 需要手动加自己
        this.roomData.pv.num += 1
        this.roomData.visitor_id && sessionOrLocal.set('visitor_id', this.roomData.visitor_id)
        this.roomData.interact.interact_token && sessionOrLocal.set('interact_token', this.roomData.interact.interact_token)
      }).catch(e => {
        this.initStatus = false
        this.handleErrorCode(e.code)
        console.log('获取房间信息失败:', e)
      })
    },
    // 初始化错误信息处理
    handleErrorCode (e) {
      switch (e) {
        case 512514: // 您已被踢出，请联系活动组织者
          this.kickOutSass = true
          break
        case 512541: // 满员
          this.isFullStarff= true
          break;
        default:
          this.$EventBus.$emit('loaded');
          break;
      }
      this.$EventBus.$emit('loaded')
    },
    // 点击商品获得详细的信息
    sellGoodsInfo(id) {
      window.vhallReport && window.vhallReport.report('GOOD_RECOMMEND', {
        event: moment().format('YYYY-MM-DD HH:mm'),
        market_tools_id: id,
        // 浏览
        market_tools_status: 0
      });
      this.getGoodInfo(id)
    },
    getGoodInfo (id) {
      this.$fetch('getGoodInfo', {
        webinar_id: this.$route.params.il_id,
        goods_id: id
      }).then(res => {
        if (res.code == 200 && res.data) {
          this.goodInfo = res.data
          this.shadeShow = !this.shadeShow;
          this.goodsPopShow = !this.goodsPopShow;
        }
      }).catch(e => {
        if (e.code == 513283) {
          this.getGoodsInfo() // 商品不存在或已下架
        }
      })
    },
    // 关闭详情弹窗事件
    closeGoodPop() {
      this.shadeShow = false;
      this.goodsPopShow = false;
    },
    // 简介的描述
    decripeMenu(msg) {
      this.simpleContent = msg;
    },
    // 活动简介翻页
    preButtonClick() {
      const preStyle = document.querySelector('.swiper-wrapper');
      const [...everySlide] = document.querySelectorAll('.swiper-slide');
      preStyle.style.transform ==
      `translate3d(-${[...everySlide][0].style.width}, 0px, 0px)`
        ? (this.swiperPrevShow = false)
        : (this.swiperPrevShow = true);
    },
    // 点击后一个按钮显示
    nextButtonClick() {
      this.swiperPrevShow = true;
    },
    // 点击遮罩
    shadeClick() {
      this.loginDialogShow = false;
      this.shadeShow = false;
    },
    // other登录方式的修改
    otherLoginClick() {
      this.otherWayShow = !this.otherWayShow;
      this.pickUpShow = !this.pickUpShow;
    },
    // 邀请好友的打开
    invitedFriend() {
      this.qrCodeShow = true;
    },
    // 二维码的生成
    invitePartner() {
      QRcode.toDataURL(
        `https://${window.location.host}/mywebinar/invite-card/${this.roominfo.webinar_id}/${this.roominfo.user.saas_join_id}`,
        (err, url) => {
          if (err) { return; }
          this.qrCodeImg = url;
        }
      );
    },
    // 点击注册
    registerClick() {
      window.location.href = `${this.webDominUrl}/register?source=2`
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
    // 打开登录面板
    callLogin() {
      this.errorMessage = '';
      this.smsErrorMessage = '';
      this.loginDialogShow = true;
      this.shadeShow = true;
      this.passwordShow = true;
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
          scene_id: 7
        }
      ).then(res => {
        this.buttonControl = true;
        this.sendMsgDisabled = true;
        if (this.timeinterval) clearInterval(this.timeinterval)
        this.timeinterval = setInterval(() => {
          if (this.time > 0) {
            this.time--;
          } else {
            clearInterval(this.timeinterval)
            this.sendMsgDisabled = false;
            this.time = 60;
            this.buttonControl = false;
          }
        }, 1000);
      })
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
        }, {}, {600: '当前账号或密码错误'}
      ).then(res => {
        if (res.code == 200) {
          this.loginDialogShow = false;
          this.shadeShow = false;
          this.phoneKey = ''
          this.smsErrorMessage = ''
          sessionOrLocal.set('sso', res.data.sso_token)
          // sessionOrLocal.set('token', res.data.token, 'localStorage')
          sessionOrLocal.set('userInfo', res.data)
          this.fetchData()
        }
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
        }, {}, {512042: '图片验证码错误', }
      ).then(res => {
          this.errorMessage = ''
          this.loginDialogShow = false
          this.shadeShow = false
          this.phoneKey = ''
          this.photoCpathaShow = true
          sessionOrLocal.set('sso', res.data.sso_token)
          sessionOrLocal.set('token', res.data.token, 'localStorage')
          sessionOrLocal.set('tokenRefresh', new Date().getTime(), 'localStorage')
          sessionOrLocal.set('tokenExpiredTime', res.data.exp_time, 'localStorage')
          // sessionOrLocal.set('userInfo', res.data)
          this.fetchData()
        })
        .catch(e => {
          if (e.code == 512042) {
            this.callCaptcha('#photoCaptcha')
          }
          if (e.captcha[0] == '图形码未验证通过') {
            this.errorMessage = '图形码未验证通过'
          }
        });
    },
    fetchData () {
      this.$fetch('getInfo', {scene_id: 2}).then(res => {
        sessionOrLocal.set('userInfo', JSON.stringify(res.data));
        sessionOrLocal.set('userId', JSON.stringify(res.data.user_id));
        this.$router.go(0) // 重新进入
      }).catch(e=>{
        sessionOrLocal.set('userInfo', null);
      })
    },
    // 校验登录次数
    checkLoginAccount() {
      this.$fetch('loginCheckC', {
        account: this.ruleForm.username,
        channel: 'C'
      }).then(res => {
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
      })
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
    // 点击活动
    activeClick(index) {
      let menu  = this.menuList[index]
      if (menu.type == 4) {
        this.showIntroduce = true
      } else {
        this.showIntroduce = false
        menu.id && this.queryTabContent(menu.id)
      }
      this.activeIndex = index;
    },
    // 获取菜单内容
    fetchMenuContent(index) {
      let menu = this.menuList[index]
      const params = {
        menu_id: menu.id
      };
      this.$fetch('getMenuDetailById', params).then(res => {
        menu.components = res.data.components;
        this.$set(this.menuList, index, menu);
      });
    },

    fullScreen() {
      var docElm = document.querySelector('.seeding-content');
      // W3C
      if (docElm.requestFullscreen) {
        docElm.requestFullscreen();
      } else if (docElm.mozRequestFullScreen) {
        docElm.mozRequestFullScreen();
      } else if (docElm.webkitRequestFullScreen) {
        docElm.webkitRequestFullScreen();
      } else if (docElm.msRequestFullscreen) {
        docElm.msRequestFullscreen();
      }
    },
    // 获取菜单列表
    getMenuList() {
      this.$fetch('newWebinarMenus', {
        webinar_id: this.$route.params.il_id
      }).then(res => {
        let data = res.data.list
        let menuList = []
        let hasIntro = false
        data.length > 0 && data.map((item, index) => {
          if (item.type == 3) {
            this.chatShow = item.status || ''
          }
          if (item.type != 2 && item.type != 3) {
            menuList.push(item)
          }
          if (item.type == 4) {
            hasIntro = true
          }
        })
        this.menuData = data // TODO:
        this.menuList = menuList

        this.$nextTick(() => {
          // this.activeClick(0);
          if (hasIntro) {
            this.showIntroduce = true
          }
          // 如果没有简介 首位显示自定义菜单第一个
          if (!hasIntro && this.menuList.length > 0 && this.menuList[0].id) { // 没有简介
            this.queryTabContent(this.menuList[0].id)
          }
        });
      });
    },
    // 获取自定义菜单内容
    queryTabContent (id) {
      this.$fetch('getMenuDetailById', {
        menu_id: id
      }).then(res => {
        this.customTabInfo = res.data.components
        this.showIntroduce = false
      })
    },
    // 关注
    handleAttention() {
      if (this.isLogin) {
        if (!this.followStyle) {
          this.$fetch('attention', {
            at_id: this.hostInfo.id,
            type: 1
          }).then(res => {
            this.followStyle = true;
            this.roominfo.modules.attention.follow = 1
            this.attentionContent = '取消关注';
          })
        } else {
          this.$fetch('notAttention', {
            at_id: this.hostInfo.id,
            type: 1
          }).then(res => {
            this.followStyle = false;
            this.roominfo.modules.attention.follow = 0
            this.attentionContent = '关注';
          })
        }
      } else {
        this.callLogin();
      }
    },
    // 商品推荐
    getGoodsInfo() {
      this.$fetch('goodsList', {
        webinar_id: this.$route.params.il_id,
        pos: 0,
        limit: 100
      }).then(res => {
        this.goodsList = res.data.goods_list
        if (this.goodsList.length > 0) {
          this.sellGoodsShow = true;
        }
      });
    },
    // 菜单按钮的判断
    menuButton(value) {
      if (value.length < 5) {
        this.swiperPrevShow = false;
        this.swiperNextShow = false;
      }
    },
    /**
     * @description 获取聊天过滤相关关键字信息
     * @author Sean
     */
    chatFilter() {
      this.$fetch('getAudinceKeyWordList', {
        room_id: this.roomData.interact.room_id
      }).then(res => {
          this.chatFilterData = res.data.list
      });
    },
    handleSkipLogo () {
      window.location.href = this.roominfo.modules.logo.href
    },
    // 获取活动广告信息
    getAdsInfo () {
      return this.$fetch('queryAdsInfo', {
        webinar_id: this.$route.params.il_id,
        pos: 0,
        limit: 50
      }).then(res => {
        this.ads = res.data.adv_list
      })
    },
    // 获取关注人被关注数量
    getAttentionNum () {
      this.$fetch('getAttentionNum', {
        at_id: this.roominfo.host.id,
        type: 1
      }).then(res => {
        this.focusCount = res.data.count
      })
    },
    getOpenScreenConfig () {
      this.$fetch('getPlaybillInfo', {
        webinar_id: this.$route.params.il_id
      }).then(res => {
        this.openScreenConfig = res.data['screen-posters']
      })
    },
    // 获取观看端配置项
    getConfigList () {
      return this.$fetch('getConfigList', {
        webinar_id: this.$route.params.il_id,
        webinar_user_id: this.roomData.webinar.userinfo.user_id
      }).then(res => {
        if (res.data && res.data.permissions) {
          this.configList = JSON.parse(res.data.permissions)
        }
      })
    },
    // 获取皮肤
    getSkin () {
      return this.$fetch('watchGetWebinarSkin', {
        webinar_id: this.$route.params.il_id
      }).then(res => {
        console.log(777777777777777, res)
        if (res.code == 200 && res.data) {
          this.skinInfo = res.data
          console.log(666, this.skinInfo)
          this.theme = (this.skinInfo && this.skinInfo.skin_json_pc) ? JSON.parse(this.skinInfo.skin_json_pc) : ''
        }
      })
    },
    // 设置主题
    setCustomTheme (data) {
      let {bgColor, pageStyle, popStyle, background} = data
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
        let sellBtn = document.querySelector('.sell-goods .el-carousel__item .selling')
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
    getPublisAdv () {
      return this.$fetch('getScreenPublicInfo', {
        webinar_id: this.$route.params.il_id
      }).then(res => {
        if (res.data) {
          this.publicAdv = res.data
        }
      })
    },
    // 获取开屏海报
    getFirstPost () {
      return this.$fetch('watchInterGetFirstPost', {
        webinar_id: this.$route.params.il_id
      }).then(res => {
        if (res.data) {
          this.firstPost = res.data
        }
      })
    },
    // 获取标记 logo 主办方信息
    getSignInfo () {
      return this.$fetch('watchInterGetWebinarTag', {
        webinar_id: this.$route.params.il_id
      }).then(res => {
        if (res.data) {
          this.signInfo = res.data
        }
      })
    },
    // 获取房间活动状态
    queryRoomInterInfo () {
      return this.$fetch('getToolStatus', {
        room_id: this.roomData.interact.room_id
      }).then(res => {
        if (res.data) {
          this.interactiveInfo = res.data
        }
      })
    },
    // 获取邀请卡信息
    getInviteStatus () {
      return this.$fetch('shwoInvite', {
        webinar_id: this.$route.params.il_id,
        join_id: this.roomData.join_info.join_id
      }).then((res) => {
        if (res.data) {
          this.inviteInfo = res.data
        }
      })
    },
    // 获取关注状态
    getAttentionStatus () {
      return this.$fetch('attentionStatus', {
        at_id: this.roomData.webinar.userinfo.user_id,
        type: 1 // 关注人
      }).then(res => {
        this.attentionStatus = res.data.result
      })
    },
    handleRoomInfo () {
      let data = this.roomData,
          userInfo = this.userInfo,
          text = data.webinar.type == 1
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
          pv: data.pv.num ,
          uv: data.online.num
        }),
        advs: this.ads,
        auth: this.isLogin ? {
          avatar: data.join_info.avatar,
          id: this.userInfo ? this.userInfo.user_id : data.join_info.third_party_user_id,
          nick_name: data.join_info.nickname,
          phone: this.userInfo ? this.userInfo.phone : ''
        } : [],
        interactiveInfo: this.interactiveInfo ? this.interactiveInfo : {},
        rebroadcast: data.rebroadcast,
        open_question: this.interactiveInfo ? this.interactiveInfo.question_status : 0,
        report_extra: data.report_data.report_extra,
        vss_token: data.interact.interact_token,
        room_id: data.interact.room_id,
        app_id: data.interact.paas_app_id,
        channel_id: data.interact.channel_id,
        inav_id: data.interact.inav_id,
        introduction: data.webinar.introduction,
        paas_access_token: data.interact.paas_access_token,
        inviteInfo: this.inviteInfo ? this.inviteInfo : {status: 0},
        skin: {
          skin_json_pc : (this.skinInfo && this.skinInfo.skin_json_pc) ? (this.skinInfo.skin_json_pc ? JSON.parse(this.skinInfo.skin_json_pc) : '') : {},
          skin_json_wap: (this.skinInfo && this.skinInfo.skin_json_wap) ? (this.skinInfo.skin_json_wap ? JSON.parse(this.skinInfo.skin_json_wap) : '') : {}
        },
        user: {
          avatar: data.join_info.avatar,
          nick_name: data.join_info.nickname,
          role_name: 2, // TODO:
          saas_join_id: data.join_info.join_id,
          third_party_user_id: data.join_info.third_party_user_id,
          account_id: data.join_info.third_party_user_id,
          is_gag: data.join_info.is_gag,
          is_kick: data.join_info.is_kick
        },
        domains: {
          static: data.urls.static_url,
          upload: data.urls.upload_url,
          web: data.urls.web_url,
          webinar: '//' + document.domain
        },
        hd_definition: this.interactiveInfo ? this.interactiveInfo.hd_definition : '',
        push_definition: this.interactiveInfo ? this.interactiveInfo.push_definition : '',
        host: {
          id: data.webinar.userinfo.user_id,
          nick_name: data.webinar.userinfo.nickname,
          avatar: data.webinar.userinfo.avatar
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
          logo: {
            show: this.signInfo ? this.signInfo.view_status : 0, // 观看标志w
            href: this.signInfo ? this.signInfo.skip_url : '',
            image: this.signInfo ? this.signInfo.logo_url : '',
            reserved_status: this.signInfo ? this.signInfo.reserved_status : 0, // 版权信息
            organizers_status: this.signInfo ? this.signInfo.organizers_status : 0// 主办方信息
          },
          attention: {show: 1, follow: this.isLogin ? this.attentionStatus : 0},
          // initiator: {show: this.signInfo ? this.signInfo.organizers_status : 0},
          initiator: {show: 1},
          adv: {
            public: (this.publicAdv && this.publicAdv['public-account']) ? this.publicAdv['public-account'] : [], // 公众号广告
            posters: (this.firstPost && this.firstPost['screen-posters']) ? this.firstPost['screen-posters'] : [] // 开屏广告
          },
          // barrage: {hide: this.configList['ui.hide_barrage']},
          online: {show: data.online.show}, // 在线人数
          reg: {show: data.webinar.reg_form}, // 报名表单
          pv: {show: data.pv.show}, // 热度
          webinar_status: {show: data.webinar.type, text: text}, // 直播状态
          reward: {show: this.configList ? this.configList['ui.hide_reward'] : 0},
          gift: {show: this.configList ? this.configList['ui.hide_gifts'] : 0},
          like: {show: this.configList ? this.configList['ui.watch_hide_like'] : 0},
          share: {show: this.configList ? this.configList['ui.hide_share'] : 0},
          chat_login: {show: 1}
        },
        reportOption: data.report_data ? data.report_data : {}
      }

      this.myliveRoute = window.location.origin + '/live/list'
      this.accountRoute = window.location.origin + '/finance/info'
      this.myPageRoute = window.location.origin + `/user/home/${this.userInfo.user_id}`
      this.myAccountRoute = window.location.origin + '/acc/info'
      this.followStyle = this.roominfo.modules.attention.follow == 1

      this.userChatId = this.roominfo.user.third_party_user_id
      // 获取所有的主域名
      this.webDominUrl = this.roominfo.domains.web
      this.webinarDominUrl = this.roominfo.domains.webinar
      // 获取pv的观看数
      // this.roomUser.pvCount = data.pv.num
      sessionOrLocal.set(
        'defaultMainscreenDefinition',
        this.roominfo.push_definition || ''
      );
      sessionOrLocal.set(
        'defaultSmallscreenDefinition',
        this.roominfo.hd_definition || ''
      );
      this.baseRoomUser.baseOnlineNum = Number(this.roominfo.base_online_num);
      sessionOrLocal.set(
        'baseOnlineNumber',
        Number(this.roominfo.base_online_num)
      );
      this.baseRoomUser.basePv = Number(this.roominfo.base_pv)
      if (this.roominfo.advs && this.roominfo.advs.length > 0) {
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
        : (this.onlineShow = false);
      // 观看次数的显示
      this.roominfo.modules.pv.show == 1
        ? (this.pvShow = true)
        : (this.pvShow = false);
      // 注册的显示
      this.roominfo.modules.reg.show == 1
        ? (this.regShow = true)
        : (this.regShow = false);
      // 主办方直播图标的显示
      // this.roominfo.modules.webinar_status.show == 1
      //   ? (this.iconPlayShow = true)
      //   : (this.iconPlayShow = false);
      this.iconPlay = this.roominfo.modules.webinar_status.text;
      if (this.roominfo.modules.webinar_status.text == '回放') {
        this.$nextTick(() => {
          const seedingContent = document.querySelector('.seeding-icon');
          if (seedingContent) {
            seedingContent.style.background = '#2ab804';
          }
        });
      } else if (this.roominfo.modules.webinar_status.text == '点播') {
        this.$nextTick(() => {
          const seedingContent = document.querySelector('.seeding-icon');
          if (seedingContent) {
            seedingContent.style.background = '#ff8834';
          }
        });
      }
      // 获取 推荐商品数据
      this.getGoodsInfo();
      // end
      this.chatFilter(); // 聊天过滤接口
      this.getAttentionNum()
      this.recordHistoryTime = data.record_history_time; // TODO:
      // 初始化数据上报
      this.initVHallReport();
      // 初始化邀请卡
      this.invitePartner();
      this.$nextTick(() => {
        if (this.theme && this.skinInfo.status == 1) {
          this.setCustomTheme(this.theme)
        }
      })
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
        env: process.env.VUE_APP_NODE_ENV === 'production' ? 'production' : 'test'
      });
      window.vhallReport && window.vhallReport.report('ENTER_WATCH', {
        event: this.$route.query.refer // 推广渠道，会在url里传参
      });
      // 浏览器或者页面关闭时上报
      window.addEventListener('beforeunload', function(e) {
        // 离开H5观看端页面
        if (/room\/watch/.test(window.location.pathname)) {
          window.vhallReport && window.vhallReport.report('LEAVE_WATCH', {}, false);
        }
      })
    },
    // 退出登录
    quitLive () {
      this.$fetch('loginOut').then(res => {
        sessionOrLocal.clear('localStorage')
        sessionOrLocal.clear()
        clearCookies()
        this.$nextTick(() => {
          window.location.reload()
        })
      })
    }
  }

};
</script>
<style lang="less">
.el-loading-spinner .path {
  stroke: #fc5659 !important;
}
.el-loading-text {
  color: #fc5659 !important;
  font-weight: bold;
}
.watch-wrap {
  min-width: 1220px;
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
      font-size: 12px;
      position: absolute;
      top: 70px;
      z-index: 66;
      width: 200px;
      height: 282px;
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
        border-bottom: 1px solid #ccc;
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
      margin: 0 auto;
      // padding-left: 80px;
      // padding-right: 80px;
      overflow: hidden;
      display: flex;
      max-width: 1480px;
    }
    .bottom-bgColor {
      background-color: #fff;
      width: 100%;
      overflow: hidden;
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
      .leftmargin {
        margin-left: 0px !important;
      }
      .seeding-title {
        display: inline-block;
        vertical-align: middle;
        font-size: 20px;
        margin-bottom: 16px;
      }

      span {
        font-size: 16px;
      }
    }

    .seeding-inforight {
      margin-top: 32px;
      float: right;
      margin-bottom: 15px;
      height: 73px;

      .pv-online-account {
        width: 250px;
        height: 36px;
        overflow: hidden;
        font-size: 14px;
        .iconguankancishu {
          font-size: 13px;
        }
        .iconzaixianrenshu {
          font-size: 15px;
        }
      }
      .seeding-funct {
        div {
          float: right;
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
      }

      .follow {
        float: right;
        text-align: center;
        width: 100px;
        height: 32px;
        line-height: 32px;
        font-size: 14px;
        background: rgba(213, 213, 213, 1);
        border-radius: 19px;
        color: #444;
        cursor: pointer;
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
      .follow:hover,
      .full-screen:hover {
        color: #fff;
        background: #fc5659;
      }
      .followShow {
        float: right;
        text-align: center;
        width: 100px;
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
        margin-left: 12px;
        width: 32px;
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
      margin-bottom: 16px;
      margin-top: 2px;
      width: 32px;
      height: 18px;
      color: #fff;
      text-align: center;
      font-size: 12px !important;
      background: rgba(252, 86, 89, 1);
      line-height: 18px;
      margin-left: 10px;
    }

    .seeding-content {
      clear: both;
      margin-top: 20px;
      /* width: 100%; */
      height: 721px;
      min-height: 481px;
      background: #000;

      .vhall-kick-outs, .full-statrff {
        text-align: center;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 99;
        background: rgba(0, 0, 0, 0.68);
        background: url('//cnstatic01.e.vhall.com/static/img/webinar.png')
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
        margin-top: 10px;
        padding-bottom: 10px;
        color: #666;
        margin-left: 30px;
        width: 80px;
        line-height: 25px;
        text-align: center;
        float: left;
        cursor: pointer;
        &.active {
          border-bottom: 2px solid #fc5659;
        }
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

        .direc-seeding {
          position: relative;
          display: inline-block;
          vertical-align: middle;
          width: 272px;
          height: 214px;
          border: 1px solid #e5e5e5;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.08);
          text-align: center;
          margin-right: 10px;
          margin-top: 10px;
          a {
            display: inline-block;
            position: relative;
            .people-account {
              position: absolute;
              height: 20px;
              right: 0;
              bottom: 8px;
              span {
                color: #ddd;
                float: right;
                margin-right: 3px;
                line-height: 22px;
                margin-left: 3px;
              }
              & > .iconfont {
                font-size: 14px;
              }
            }
          }
          img {
            margin-top: 15px;
            width: 250px;
            height: 154px;
          }

          .video-header {
            display: block;
            width: 100%;
            font-size: 14px;
            text-align: left;
            text-indent: 17px;
            color: #333;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 230px;
          }
          .video-start-time {
            display: block;
            width: 100%;
            font-size: 12px;
            text-align: left;
            text-indent: 17px;
            color: #999;
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
        margin-top: 15px;
        padding-bottom: 15px;
        color: #666;
        margin-left: 30px;
        width: 80px;
        line-height: 25px;
        text-align: center;
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
          right: -47.8%;
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
    /* .selling {
      width: 195px !important;
    }

    .sell-image {
      width: 195px !important;
      height: 195px !important;
      img {
        width: 195px !important;
        height: 195px !important;
      }
    } */
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
    background: url('https://cnstatic01.e.vhall.com/static/images/mobile/bang-bg.png?v=fU6YKk49PdUizDjMr88d7g%3D%3D');
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
      & > .inviteBillboard {
        height: 100%;
      }
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
        line-height: 5px;
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
    z-index: 20;
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
}
</style>
