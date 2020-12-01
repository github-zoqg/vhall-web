<template>
  <chrome v-if="downloadChrome"> </chrome>
  <tip v-else-if="tipMsg" :text="tipMsg"> </tip>
  <div v-else class="watch-wrap">
    <header
      v-if="roominfo.modules"
      v-show="roominfo.modules.header.show"
      class="wh-title"
    >
      <img v-if="companyLogoShow" class="logo-image" src="./img/logo.png" alt />
      <div class="title-right">
        <el-input
          @keyup.enter.native="searchDocdument"
          v-model="documentData"
          class="search-input"
          prefix-icon="el-icon-search"
          placeholder="搜索"
        ></el-input>
        <span v-if="userShow">
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
        <span v-if="!userShow">
          <div @click="otherMenuClick" class="loginUserInfo">
            <img
              :src="userHeadImage"
              onerror="this.src='//cnstatic01.e.vhall.com/static/img/head50.jpg';this.onerror=null"
              alt
            />
            <div class="login-nickName">
              <span>{{ roominfo.auth.nick_name }}</span>
              <span></span>
            </div>

            <ul v-if="menuListShow" class="login-info-list">
              <li>
                <a :href="webDominUrl + '/mywebinar/main'">
                  <i></i>
                  <span>我的直播</span>
                </a>
              </li>
              <li>
                <a
                  :href="
                    webDominUrl +
                      `${
                        this.roominfo.auth && this.roominfo.auth.parent_id
                          ? '/account/usage'
                          : '/account/center'
                      }`
                  "
                >
                  <i></i>
                  <span>账户中心</span>
                </a>
              </li>
              <li>
                <a :href="webDominUrl + '/workorder/create'">
                  <i></i>
                  <span>提交问题</span>
                  <span v-show="submitQuestionShow" class="recive-news">{{
                    submitQuestionNum
                  }}</span>
                </a>
              </li>
              <li>
                <a :href="webDominUrl + '/account/message'">
                  <i></i>
                  <span>我的消息</span>
                  <span v-show="myMessageShow" class="recive-news">{{
                    myMessageNum
                  }}</span>
                </a>
              </li>
              <li>
                <a :href="myprincipal">
                  <i></i>
                  <span>我的主页</span>
                </a>
              </li>
              <li>
                <a :href="webDominUrl + '/account/index'">
                  <i></i>
                  <span>账户设置</span>
                </a>
              </li>
              <li>
                <a :href="webDominUrl + '/auth/logout'">
                  <i></i>
                  <span>退出登录</span>
                </a>
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
              <span v-if="iconPlayShow" class="seeding-icon">{{
                iconPlay
              }}</span>
              <div>
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
                <!-- <span @click="skipHost" style="color:#007AFF;cursor:pointer;">{{ hostInfo.nick_name }}</span> -->
                <a
                  v-if="roominfo.modules.initiator.show == 1"
                  :href="skipHostUrl"
                  style="color:#007AFF;cursor:pointer;"
                  >{{ hostInfo.nick_name }}</a
                >
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
                  {{ showPv }}次观看
                </span>
                <span
                  v-show="pvShow & onlineShow && iconPlay == '直播'"
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
                  {{ showOnline }}人在线
                </span>
              </div>
              <div class="seeding-funct">
                <div @click="fullScreen" class="full-screen" v-if="!isIE">
                  <span
                    class="iconfont iconquanping"
                    style="font-size: 12px;"
                  ></span>
                  <!-- <span>网页全屏</span> -->
                </div>
                <div
                  v-if="attentionShow"
                  :class="followStyle ? 'follow' : 'followShow'"
                  @click="attention"
                >
                  <span class="iconfont iconguanzhu"></span>
                  <span style="margin-left: 5px;">{{ attentionContent }}</span>
                </div>
                <!-- <span>微信公众号</span> -->
                <div
                  class="officialaccount-qrcode"
                  v-if="showOfficialAccountMiniQRCode"
                >
                  <span><i class="iconfont iconweixin"></i>微信公众号</span>
                  <div class="qr-wrap">
                    <span class="arrow"></span>
                    <img
                      :src="
                        `https:${imageDomin}/${officialAccountImage}?x-oss-process=image/resize,m_fill,w_233,h_233`
                      "
                      :alt="`https:${imageDomin}/${officialAccountImage}`"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="seeding-content">
              <vhall-enjoy-watch-Saas
                v-if="roominfo.vss_token && !kickOutSass"
                @descripe="decripeMenu"
                :playerInfo="roominfo.player"
                @onlineJoin="onlinePeople"
                @onlineLeave="onlineLeavePeople"
                @updateBaseNum="updateBaseNumFun"
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
                :chatFilterData="chatFilterData"
                :shareId="roominfo.share_id"
                :pvCount="roomUser.pvCount"
                :uvOnline="roomUser.uvOnline"
                :recordHistoryTime="recordHistoryTime"
                :menuData="menuData"
                :bizInfo="roominfo"
              ></vhall-enjoy-watch-Saas>
              <div class="vhall-kick-outs" v-if="kickOutSass">
                <h1 v-if="kickOutSass">您已被禁止，访问房间！</h1>
                <!-- <h1 v-if="liveEnded">直播已结束</h1> -->
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
                        @focus="usernameFocus"
                        v-model.trim="ruleForm.username"
                        placeholder="手机号/邮箱"
                      >
                        <i
                          style="margin-left:5px;"
                          slot="prefix"
                          class="iconfont iconshoujihaoyouxiang"
                        ></i>
                        <!-- <i slot="suffix" class="el-input__icon el-icon-date"></i> -->
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
                        clearable
                        @focus="passwordFocus"
                        style="width:270px;"
                        v-if="passwordShow"
                        type="password"
                        :maxlength="20"
                        v-model.trim="ruleForm.password"
                        placeholder="登录密码"
                      >
                        <i
                          style="margin-left:5px;"
                          slot="prefix"
                          class="iconfont iconmima"
                        ></i>
                        <i
                          slot="suffix"
                          @click="passShow"
                          style="font-size:14px;margin-right:5px;"
                          class="iconfont iconyincang-copy"
                        ></i>
                      </el-input>
                      <el-input
                        v-if="!passwordShow"
                        @focus="passwordFocus"
                        clearable
                        :maxlength="20"
                        v-model.trim="ruleForm.password"
                        placeholder="登录密码"
                      >
                        <i
                          style="margin-left:5px;"
                          slot="prefix"
                          class="iconfont iconmima"
                        ></i>
                        <i
                          slot="suffix"
                          @click="passShow"
                          style="font-size:12px;margin-right:5px;"
                          class="iconfont iconxianshi"
                        ></i>
                      </el-input>
                      <!-- <img v-if="eysShow" class="eyesOpen" @click="eysopen" src="../../static/img/eyesClose.png" alt="">
            <img v-if="!eysShow" class="eyesOpen" @click="eysClose" src="../../static/img/eyeopen.png" alt="">-->
                      <span v-if="errorMsgShow" class="errorImage">x</span>
                      <span style="color:#fc5659;" v-if="errorMsgShow">{{
                        errorMessage
                      }}</span>
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
                        @focus="telFocus"
                        :maxlength="11"
                        v-model.trim="ruleForm.usernames"
                        style="width:270px;"
                        placeholder="请输入手机号"
                      >
                        <i
                          style="margin-left:5px;"
                          slot="prefix"
                          class="iconfont iconshouji"
                        ></i>
                        <!-- <i slot="suffix" class="el-input__icon el-icon-date"></i> -->
                      </el-input>
                    </el-form-item>
                    <el-form-item>
                      <div id="captcha"></div>
                    </el-form-item>
                    <el-form-item prop="captchas" class="wrap-code">
                      <el-input
                        clearable
                        @focus="captchaFocus"
                        type="captcha"
                        :maxlength="6"
                        v-model.trim="ruleForm.captchas"
                        placeholder="动态密码"
                        style="width:270px; margin-bottom：0;"
                      >
                        <i
                          style="margin-left:5px;"
                          slot="prefix"
                          class="iconfont iconmima"
                        ></i>
                      </el-input>
                      <el-button
                        type="danger"
                        :disabled="buttonControl"
                        @click="getCaptha"
                        class="identCodes duanxinCode"
                      >
                        <span v-if="sendMsgDisabled">{{ time + '秒' }}</span>
                        <span v-if="!sendMsgDisabled">{{ testmoudle }}</span>
                      </el-button>
                      <span v-if="smsErrorMsgShow" class="errorImage">x</span>
                      <span style="color:#fc5659;" v-if="smsErrorMsgShow">{{
                        smsErrorMessage
                      }}</span>
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
                    v-if="bottomLoginInfo && roominfo.open_huawei != 1"
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
                          <!-- <i class="iconfont">&#xe700;</i> -->
                          <span v-show="pickUpShow" class="ioncPickUp"></span>
                          <span
                            v-show="!pickUpShow"
                            class="ioncPickDown"
                          ></span>
                        </span>
                        <!--            <span>^</span>-->
                      </p>
                      <div class="third-way-choose" v-if="otherWayShow">
                        <div class="third-auth">
                          <a
                            :href="
                              webinarDominUrl +
                                '/auth/weibo?after_register=' +
                                webinarDominUrl +
                                '/' +
                                roominfo.webinar.id
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
                                roominfo.webinar.id
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
                                roominfo.webinar.id
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
              <!--登录弹窗接口  -->
            </div>
          </div>
        </div>
        <div class="bottom-bgColor">
          <div class="bottom-content">
            <!-- 活动简介 -->
            <div class="active-left">
              <div class="active-introduce">
                <h3
                  v-for="(item, index) in menuList"
                  @click="activeClick(index, item)"
                  :key="index"
                  :class="{ active: activeIndex == index }"
                >
                  {{ item.name }}
                </h3>
                <!-- <h3>活动简介</h3>
                <h3>活22介</h3>-->
                <hr />
                <div class="active-content">
                  <div v-for="(items, index) in menuList" :key="index">
                    <!-- 简介内容 -->
                    <div
                      class="active-introduce-content"
                      v-html="simpleContent"
                      v-if="items.type == 4 && activeIndex == index"
                    >
                      {{ simpleContent }}
                    </div>
                    <template v-if="activeIndex + 1 == index + 1">
                      <custom-tab
                        v-if="items.type == 1"
                        :roominfo="roominfo"
                        :components="items.components"
                        :topShow="topShow"
                        :invitedFriend="invitedFriend"
                        :rulesShow="rulesShow"
                        :changeRules="changeRules"
                        :rewardListClick="rewardListClick"
                        :invitedTopClick="invitedTopClick"
                        :joinId="joinId"
                        :domains="roominfo.domains"
                      >
                      </custom-tab>
                    </template>
                  </div>
                  <!-- <span class="topic-title">话题：</span>
                      <ul>
                          <li v-for = "(item,index) in topicData" :key="index">{{ item }}</li>
                      </ul>
                  <p class="topic-content">子的世界很小，关于夏天，他想来想去，都只有你。当杨树的浓荫再也遮挡不住发热的甲壳，虫子的心也开始滚烫起来，蠢蠢欲动。他知道，夏天来了，夏天——这个想去爱你并开始去爱你的季节，如期而至。对于人来说，阳光之于夏天，就是大汗淋漓的热烈和疯狂奔跑的酣畅，对于虫子来说，毋庸置疑，你就是他的整个夏天。没有你的日子，你不能想象他是多么的聒噪，你不来，烦恼就像麻雀捕食一样，紧紧的揪住了他的心，好像被捕食的是他自己，撕心裂肺，又一脸蒙逼。红日当头时，他会想，没有了你的夏天，是否还像干柴勾起的大火那般熊熊欲燃。有时候，夏天那么盛大，盛大得像极了黄昏的晚霞，就算虫子的两只瞳孔决裂了，也装不下一个零头。有时候，夏天那么高远，他用尽咬牙切齿的力气，也只是从地面飞到了树冠，身心俱疲。飞累了，他就在狗尾巴草上歇一会儿，昂着尖尖的小脑袋，对着天，开始骂娘。看不出来，虫子有时候也会爆粗口，只不过谁也不知道，骂完了，他的眼睛里总是噙着一汪流不出来的水。</p>-->
                </div>
              </div>

              <div class="active-second" v-if="activeAdviceShow">
                <!-- <div class="active-second" v-if=" roominfo.advs.length >0"> -->
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
                            :src="
                              `${imageDomin}/${
                                item.webinar
                                  ? item.webinar.img_url
                                  : item.img_url
                              }`
                            "
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
              v-if="sellGoodsShow"
              @sellGoodsInfo="sellGoodsInfo"
              :goodsList="goodsList"
            ></products>
          </div>
          <div class="footer inner-center tac">
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
      <span @click="closeQrDia" class="closeQrcode">x</span>
      <img :src="qrCodeImg" alt />
    </div>
    <div class="shade" @click="shadeClick" v-if="shadeShow"></div>
    <!-- 商品详情的弹窗 -->
    <goodsPop v-if="goodsPopShow" @closeGoodPop="closeGoodPop" :goodsAllInfo="goodInfo"></goodsPop>
    <popup
      :visible="showOfficialAccountQRCode"
      :width="'340px'"
      title="公众号二维码"
      :onClose="closeOfficialAccountQRCode"
    >
      <div class="preview-wrap ad-qrcode">
        <div class="preview-title">
          <span class="owner">【{{ roominfo.host.nick_name }}】</span>
          <span>邀请你关注微信了解更多资讯</span>
        </div>
        <div class="preview-content">
          <a target="_blank">
            <img
              :src="
                `https:${imageDomin}/${officialAccountImage}?x-oss-process=image/resize,m_fill,w_233,h_233`
              "
              :alt="`https:${imageDomin}/${officialAccountImage}`"
            />
          </a>
          <div class="preview-des">扫码关注公众号</div>
        </div>
      </div>
    </popup>
    <remote-script src="//static.vhallyun.com/jssdk/vhall-jssdk-chat/latest/vhall-jssdk-chat-2.0.9.js" @load="chatSdkLoadHandler"></remote-script>
    <remote-script src='//static.vhallyun.com/jssdk/vhall-jssdk-interaction/latest/vhall-jssdk-interaction-2.2.1.js' @load="interactionSdkLoadHandler"></remote-script>
  </div>
</template>
<script>
import VhallReport from '@/components/VhallReport/main';
import moment from 'moment';
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import invited from './rankList'; // 邀请榜
import reward from './rankList/reward'; // 打赏榜
import goodsPop from './rankList/goodsPop';
import QRcode from 'qrcode';
import chrome from './chrome';
import CustomTab from './custom-tab';
import tip from './tip';
import products from '../components/products';
import { isIE } from '@/utils/utils';
export default {
  data() {
    return {
      imageDominStatic: '', // 图片static域名
      webDominUrl: '', // 主站的域名
      webinarDominUrl: '', // 观看的域名
      submitQuestionNum: '', // 提交问题数
      myMessageNum: '', // 信息数
      submitQuestionShow: false, // 提交问题的显示
      myMessageShow: false, // 我的消息的显示
      chatFilterData: [], // 聊天过滤的数据
      userInfo: {},
      attentionAccount: null, // 关注数
      attentionContent: '关注', // 关注的内容显示
      headerShow: false, // header的显示与否
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
      briefShow: false,
      activeAdviceShow: false, // 活动推荐的显示
      skipHostUrl: '', // 主办方跳转路径
      sellGoodsShow: true, // 商品推荐的显示
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
      pickUpShow: true, // 收起的显示
      ruleForm: {},
      sendMsgDisabled: false,
      time: 60,
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
      goodInfo: {}, // 商品信息
      goodsList: [], // 商品列表
      hostInfo: {}, // host信息
      userShow: true,
      activeIndex: 0,
      menuList: [],
      logoShow: false,
      skinLogo: require('./img/logo.png'),
      components: null,
      userChatId: null,
      nickName: null,
      roominfo: { modules: { initiator: {}, header: {} }, auth: {}, host: {} }, // 房间信息
      joinId: null,
      topicData: ['美食', '周邊', '樓宇'],
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
      saasJoinId: '',
      open_question: 0,
      privateChat: {},
      domains: {},
      downloadChrome: false, // 是否下载chrome
      recordHistoryTime: '', // 播放器进度
      tipMsg: '', // vssinfo接口返回的错误信息
      showOfficialAccountQRCode: false,
      officialAccountImage: '',
      showOfficialAccountMiniQRCode: false,
      menuData: [],
      isIE: isIE()
    };
  },

  components: {
    swiper,
    swiperSlide,
    invited,
    reward,
    goodsPop,
    chrome,
    CustomTab,
    tip,
    products
  },
  created() {
    // this.$loadingStatus = this.$loading({
    //   background: 'rgba(0,0,0,0.5)',
    //   text: '加载中'
    // });
  },
  computed: {
    showOnline() {
      return (
        Number(this.roomUser.uvOnline) + Number(this.baseRoomUser.baseOnlineNum)
      );
    },
    showPv() {
      return Number(this.roomUser.pvCount) + Number(this.baseRoomUser.basePv);
    }
  },
  mounted() {
    window.EventBridge = this.$EventBus;
    this.$EventBus.$on('loaded', () => {
      this.$loadingStatus.close();
      if (
        this.roominfo.modules &&
        this.roominfo.modules.adv &&
        !(this.roominfo.modules.adv.public instanceof Array)
      ) {
        this.officialAccountImage = this.roominfo.modules.adv.public.img;
        if (this.roominfo.modules.adv.public.alert_type == 0) {
          this.showOfficialAccountQRCode = true; // 显示公众账号
          this.showOfficialAccountMiniQRCode = true; // 显示公众账号
        } else {
          this.showOfficialAccountMiniQRCode = true; // 显示公众账号
        }
      }
    });
    // this.activeClick(0)
    window.addEventListener('resize', () => {
      console.log('resize');
      // const rate = 1480 / 717

      let width = document.querySelector('.seeding-content').offsetWidth;

      console.log('resize', width);
      // 根据文档区域 16: 9  去计算容器 高度
      // 具体算法。
      //  1.  计算出文档区域 宽度   width - 侧边栏 宽度 （ 295 ）
      //  2.  计算出文档区高度 + with - 295 / x = 16/ 9
      //      x =  width - 295 / 1.78
      //  容器高度 =  height + 46 // 底部互动工具栏高度
      const ratio = 16 / 9;
      const docHeight = (width - 294) / ratio + 46;
      // let height = width / rate
      // console.log(height)
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
          const contentWrapper = document.querySelector('.seeding-content');
          if (contentWrapper) {
            contentWrapper.style.marginTop = '0px';
            contentWrapper.style.width = '100%';
            contentWrapper.style.height = '100%';
          }
        }, 100);
      }
    };
    window.addEventListener('fullscreenchange', setFullscreen);
    window.addEventListener('webkitfullscreenchange', setFullscreen);
    window.addEventListener('mozfullscreenchange', setFullscreen);
    window.addEventListener('msfullscreenchange', setFullscreen);
    window.addEventListener('MSFullscreenChange', setFullscreen);
    this.heartbeatLink();
  },
  beforeDestroy() {
    window.vhallReport.report('LEAVE_WATCH');
  },
  methods: {
    heartbeatLink() {
      setTimeout(() => {
        this.$fetch('heartbeat', {})
          .then(() => {
            this.heartbeatLink();
            console.log('心跳检测成功');
          })
          .catch(re => {
            console.log(re);
            console.log('心跳检测失败 ');
          });
      }, 1000 * 60 * 30);
    },
    // 点击商品获得详细的信息
    sellGoodsInfo(goodInfo) {
      this.goodInfo = goodInfo;
      window.vhallReport.report('GOOD_RECOMMEND', {
        event: moment().format('YYYY-MM-DD HH:mm'),
        market_tools_id: this.goodInfo.goods_id,
        // 浏览
        market_tools_status: 0
      });
      this.shadeShow = !this.shadeShow;
      this.goodsPopShow = !this.goodsPopShow;
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
    NoLogin() {
      this.callLogin();
    },
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
    // 点击注册
    registerClick() {
      if (this.roominfo.open_huawei == 1) {
        window.location.href = `${this.webDominUrl}/auth/register?isHuawei=true`; // v4.9.4 华为定制，注册的时候短信登录需要带标识
      } else {
        window.location.href = `${this.webDominUrl}/auth/register`;
      }
    },
    // 在线人数的显示
    passShow() {
      this.passwordShow = !this.passwordShow;
    },
    onlinePeople(msg) {
      this.$nextTick(() => {
        this.roomUser.uvOnline = msg.uv;
        if (msg.context.pv > this.roomUser.pvCount) {
          this.roomUser.pvCount = msg.context.pv;
        }
      });
    },
    onlineLeavePeople(msg) {
      this.$nextTick(() => {
        this.roomUser.uvOnline = msg.uv;
      });
    },
    updateBaseNumFun(msg) {
      this.$nextTick(() => {
        this.baseRoomUser.basePv =
          this.baseRoomUser.basePv + Number(msg.data.update_pv);
        this.baseRoomUser.baseOnlineNum =
          this.baseRoomUser.baseOnlineNum + Number(msg.data.update_online_num);
        sessionStorage.setItem(
          'baseOnlineNumber',
          this.baseRoomUser.baseOnlineNum
        );
      });
    },
    // 点击遮罩
    shadeClick() {
      this.loginDialogShow = false;
      this.shadeShow = false;
    },
    // 跳转到主办方
    skipHost() {
      this.skipHostUrl = `${this.webDominUrl}/user/home/${this.roominfo.host.id}`;
    },
    // 搜索框enter进行搜索
    searchDocdument() {
      window.location.href = `${this.webDominUrl}/search?wd=${this.documentData}`;
    },
    // 点击出现其他的菜单
    otherMenuClick() {
      this.menuListShow = !this.menuListShow;
    },
    // other登录方式的修改
    otherLoginClick() {
      this.otherWayShow = !this.otherWayShow;
      this.pickUpShow = !this.pickUpShow;
    },
    // 关闭二维码的弹窗
    closeQrDia() {
      this.qrCodeShow = false;
    },
    // 邀请好友的打开
    invitedFriend() {
      this.qrCodeShow = true;
    },
    // 二维码的生成
    invitePartner() {
      QRcode.toDataURL(
        `https://${window.location.host}/mywebinar/invite-card/${this.roominfo.webinar_id}/${this.saasJoinId}`,
        (err, url) => {
          if (err) { return; }
          // this.wechatPay = true
          this.qrCodeImg = url;
        }
      );
    },
    // 榜单的切换
    changeRules() {
      this.rulesShow = !this.rulesShow;
    },
    // 点击邀请榜
    invitedTopClick() {
      this.topShow = true;
    },
    // 点击打赏榜
    rewardListClick() {
      this.topShow = false;
    },
    // 新浪登录入口
    sinaclick() {
      window.open(
        `${window.location.host}/auth/weibo?after_register=${window.location.href}`,
        '_blank'
      );
    },
    // qq登录入口
    qqClick() {
      window.open(
        `${window.location.host}/auth/qq?after_register=${window.location.href}`,
        '_blank'
      );
    },
    weChatClick() {
      window.open(
        `${window.location.host}/auth/weixinweb?after_register=${window.location.href}`,
        '_blank'
      );
    },
    // 微信登录入口
    // 唤起图片验证码
    callCaptcha(element) {
      let that = this;
      window.initNECaptcha(
        {
          captchaId: this.key,
          element: element,
          mode: 'float',
          width: 270,
          onReady: function(instance) {
            console.log('instance', instance);
          },
          onVerify: function(err, data) {
            console.log('errr>>>', err);
            console.log('data>>>', data);
            if (data) {
              that.phoneKey = data.validate;
              that.errorMsgShow = false;
              that.errorMessage = '';
              console.log('dataqqqqqqqqqqqqqqqqqqqqqqqqqqqqq', data);
              if (element == '#captcha') {
                that.buttonControl = false;
              }
            } else {
              that.errorMsgShow = true;
              that.errorMessage = '图形码未验证通过';
            }
          }
        },
        function onload(instance) {
          that.cap = instance;
        }
      );
    },
    // 唤起登录
    callLogin() {
      this.errorMsgShow = false;
      this.errorMessage = '';
      this.smsErrorMsgShow = false;
      this.smsErrorMessage = '';
      this.loginDialogShow = true;
      this.shadeShow = true;
      this.passwordShow = true;
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
        console.log('res', res);
        if (res.code == 200) {
          this.sendMsgDisabled = true;
          console.log('daying', this.sendMsgDisabled);
          this.timeinterval = setInterval(() => {
            if (this.time > 0) {
              this.time--;
              this.buttonControl = true;
            } else {
              this.sendMsgDisabled = false;
              window.clearInterval(this.timeinterval);
              this.time = 60;
              this.buttonControl = false;
            }
          }, 1000);
        }
      });
    },
    // 短信验证码登录
    telLogin() {
      if (this.ruleForm.usernames == undefined) {
        this.smsErrorMsgShow = true;
        this.smsErrorMessage = '请输入您的手机号';
        return;
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
        console.log('res', res);
        if (res.code == 200) {
          this.loginDialogShow = false;
          this.shadeShow = false;
          this.$router.go(0);
        } else {
          this.smsErrorMsgShow = true;
          this.smsErrorMessage = res.msg;
        }
      });
    },
    // 点击登录
    loginClick() {
      console.log('username', this.ruleForm.username);
      if (
        this.ruleForm.username == undefined ||
        this.ruleForm.password == undefined
      ) {
        this.errorMsgShow = true;
        this.errorMessage = '请输入您的账号或邮箱或手机号';
        return;
      }
      this.accountChecked
        ? (this.accountChecked = 'remember')
        : (this.accountChecked = null);
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
      )
        .then(res => {
          console.log('ssss>>>>>>res', res);
          if (res.code == 200) {
            this.errorMsgShow = false;
            this.loginDialogShow = false;
            this.$router.go(0);
            this.shadeShow = false;
            console.log('1111111111111111111111111111111111111', res);
          } else if (res.code == '500') {
            console.log('121221121212>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            this.errorMsgShow = true;
            this.errorMessage = '您输入的密码错误';
          }
        })
        .catch(error => {
          console.log('error>>>>>>>>>>>>>>>>>>>>>>>>>', error);
          if (error.captcha[0] == '图形码未验证通过') {
            this.errorMsgShow = true;
            this.errorMessage = '图形码未验证通过';
            this.callCaptcha('#photoCaptcha');
          }
        });
    },
    // 校验登录次数
    checkLoginAccount() {
      this.$fetch('checkAccount', {
        account: this.ruleForm.username
      })
        .then(res => {
          if (res.code == 200) {
            if (res.data) {
              this.photoCpathaShow = true;
              this.callCaptcha('#photoCaptcha');
              if (this.phoneKey) {
                this.errorMsgShow = false;
                this.loginClick();
              }
            } else {
              this.photoCpathaShow = false;
              this.loginClick();
            }
          }
        })
        .catch(error => {
          console.log('error>>>>>>>>>>>>>>>>>>>>>>>>>', error);
        });
    },
    // 快捷登录验证码的聚焦
    captchaFocus() {
      this.smsErrorMsgShow = false;
    },
    // 快捷登录手机号的聚焦
    telFocus() {
      this.smsErrorMsgShow = false;
    },
    // 手机号邮箱聚焦
    usernameFocus() {
      this.errorMsgShow = false;
    },
    // 密码框聚焦
    passwordFocus() {
      this.errorMsgShow = false;
    },
    // 获取验证码
    getCodes() {},
    // 云链账号登录
    usersLogin() {
      this.typeControl = true;
      this.isActive = true;
      this.bottomLoginInfo = true;
      this.errorMsgShow = false;
      this.errorMessage = '';
    },
    // 点击快捷进行登录
    messgeLogin() {
      this.typeControl = false;
      this.isActive = false;
      this.bottomLoginInfo = false;
      this.smsErrorMsgShow = false;
      this.smsErrorMessage = '';
      this.callCaptcha('#captcha');
    },

    // 点击活动
    activeClick(index, menu) {
      this.activeIndex = index;
      if (menu && menu.components) {
        if (menu.type == 1) {
          this.fetchMenuContent(index, menu);
        }
      } else {
        let fmenu = this.menuList[0];
        if (index == 0 && fmenu.type == 1) {
          this.fetchMenuContent(0, fmenu);
        }
      }
    },

    fetchMenuContent(index, menu) {
      const params = {
        menu_id: menu.id
      };
      this.$fetch('getMenuDetailById', params).then(res => {
        if (res.code == 200) {
          menu.components = res.data.components;
          this.$set(this.menuList, index, menu);
        }
      });
    },
    // 向右滑
    arrowRight() {},
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
        webinar_id: this.$route.params.il_id,
        ...this.$route.query
      }).then(res => {
        if (res.code == 200) {
          this.menuData = res.data.list || [];
          if (this.menuData && this.menuData.length) {
            const chat = this.menuData.find(d => d.type == 3) || {};
            this.chatShow = chat.status || '';
          }
          this.menuData.map(item => {
            item.components = [];
            if (item.type != 2 && item.type != 3) {
              this.menuList.push(item);
            }
          });
          this.$nextTick(() => {
            // TODO: 临时关闭
            // this.activeClick(0);
          });
        }
      });
    },
    // 关注
    attention() {
      if (this.roominfo.auth.length == undefined) {
        this.$fetch('attention', {
          at_id: this.hostInfo.id,
          webinar_id: this.$route.params.il_id
        }).then(res => {
          if (res.code == 200) {
            if (res.data.fans != this.attentionAccount) {
              this.followStyle = false;
              this.attentionContent = '已关注';
            } else {
              this.followStyle = true;
              this.attentionContent = '关注';
            }
          }
        });
      } else {
        this.callLogin();
      }
    },
    // 商品推荐
    getGoodsInfo() {
      this.$fetch('goodsList', {
        // webinar_id: this.$route.params.il_id
        webinar_id: 171205460
      }).then(res => {
        if (res.code == 200) {
          this.sellGoodsShow = true;
          this.goodsList = res.data.goods_list;
          this.goodsList
            && this.goodsList.length
            && (this.goodInfo = res.data.goods_list[0]);

          this.goodsList.forEach(good => {
            good.goodImage = `
              ${this.imageDomin}/
              ${
                good.img_list.find(img => img.is_cover).img_url
              }
            `;
          });
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
      this.$fetch('keywordsList', {
        user_id: this.roominfo.host.id
      }).then(res => {
        console.log(
          'saas action info::',
          'get auth chat info done.',
          `get datas: ${res}`
        );
        if (res.code == 200) {
          this.chatFilterData = res.data;
        }
      });
    },
    // 获取用户信息
    getUerInfo() {
      this.$fetch('vssInfo', {
        platform: 'pc',
        webinar_id: this.$route.params.il_id,
        ...this.$route.query
      }).then(res => {
        if (res.code == 205) {
          window.location.href = '/auth/login';
        }

        if (res.code == 200) {
          if (res.data.player.watermark) {
            // 如果有水印重置图片url
            res.data.player.watermark.img_url =
              res.data.domains.upload + '/' + res.data.player.watermark.img_url;
          }
          this.roominfo = res.data;
          if (this.roominfo.modules && this.roominfo.modules.barrage) {
            this.roominfo.player.barrage = this.roominfo.modules.barrage.hide;
          }
          this.joinId = this.roominfo.user.join_id;
          this.userInfo = this.roominfo.user;
          this.userChatId = this.roominfo.user.third_party_user_id;
          this.saasJoinId = res.data.user.saas_join_id;
          this.open_question = res.data.open_question;
          // 获取所有的主域名
          this.webDominUrl = res.data.domains.web;
          this.webinarDominUrl = res.data.domains.webinar;
          // 图片地址
          this.imageDominStatic = res.data.domains.static;
          // 获取关注数
          this.attentionAccount = res.data.modules.attention.count;
          // 获取主办方的路径
          // 获取pv的观看数
          this.roomUser.pvCount = res.data.webinar.pv;
          sessionStorage.setItem(
            'defaultMainscreenDefinition',
            res.data.push_definition || ''
          );
          sessionStorage.setItem(
            'defaultSmallscreenDefinition',
            res.data.hd_definition || ''
          );
          this.baseRoomUser.baseOnlineNum = Number(res.data.base_online_num);
          sessionStorage.setItem(
            'baseOnlineNumber',
            this.baseRoomUser.baseOnlineNum
          );
          this.baseRoomUser.basePv = Number(res.data.base_pv);
          if (res.data.advs.length > 0) {
            this.activeAdviceShow = true;
            this.menuButton(res.data.advs);
          } else {
            this.activeAdviceShow = false;
          }
          console.log('roominfo', this.roominfo.auth.length);
          if (this.roominfo.auth.length == undefined) {
            this.userHeadImage = this.roominfo.auth.avatar;
            this.userShow = false;
            this.myprincipal = `${this.webDominUrl}/user/home/${this.roominfo.auth.id}`;
          } else {
            this.userHeadImage = null;
            this.userShow = true;
          }
          this.hostInfo = this.roominfo.host;
          this.roominfo.webinar_id = res.data.webinar.id;
          this.activeInfo = res.data.webinar;
          this.privateChat = res.data.saas_chat;
          this.domains = res.data.domains;
          sessionStorage.setItem('vhall-vsstoken', this.roominfo.vss_token);

          // 获取图片的主域路径
          this.imageDomin = res.data.domains.upload;
          // 存取图片的主要路径，给七巧板用
          sessionStorage.setItem('imageDomin', this.imageDomin);
          // 存取用户信息给七巧板用
          let deliverUser = res.data.user;
          deliverUser.account_id = res.data.user.third_party_user_id;
          // console.log('deliverssssssssssssss', deliverUser)

          sessionStorage.setItem('user', JSON.stringify(deliverUser));
          // 存取VssToke
          sessionStorage.setItem('vhall-vsstoken', res.data.vss_token);
          // 模块的显示与否
          // if( this.roominfo.modules.attention.follow){
          // }
          sessionStorage.setItem('moduleShow', JSON.stringify(this.roominfo));
          // 头条的显示
          this.headerShow = this.roominfo.modules.header.show;
          // 关注的显示
          this.roominfo.modules.attention.show == 1
            ? (this.attentionShow = true)
            : (this.attentionShow = false);
          // logo的显示
          this.roominfo.modules.logo.show == 1
            ? (this.companyLogoShow = true)
            : (this.companyLogoShow = false);
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
          this.roominfo.modules.webinar_status.show == 1
            ? (this.iconPlayShow = true)
            : (this.iconPlayShow = false);
          // 提交问题的显示不显示
          if (this.roominfo.modules.commit_question) {
            if (this.roominfo.modules.commit_question.show == 1) {
              if (this.roominfo.modules.commit_question.num != 0) {
                this.submitQuestionShow = true;
                this.submitQuestionNum = this.roominfo.modules.commit_question.num;
              } else {
                this.submitQuestionShow = false;
              }
            }
          }
          // w我的消息的显示
          if (this.roominfo.modules.my_message) {
            if (this.roominfo.modules.my_message.show == 1) {
              if (this.roominfo.modules.my_message.num != 0) {
                this.myMessageShow = true;
                this.myMessageNum = this.roominfo.modules.my_message.num;
              } else {
                this.myMessageShow = false;
              }
            }
          }
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
          //  @author  Sean
          // 自定义 页面皮肤 初始化 相关逻辑
          //
          if (res.data.skin.skin_json_pc) {
            this.$nextTick(() => {
              try {
                // 背景颜色
                const bgColor = document.querySelector('.back-content');
                const footerColor = document.querySelector('.bottom-bgColor');
                // 页面颜色
                const follow = document.querySelector('.follow');
                const fullScreen = document.querySelector('.full-screen');
                const activeHead = document.querySelector('.active-second h3');
                const activeIntroduce = document.querySelector(
                  '.active-introduce h3'
                );
                // 背景图片
                const bgContent = document.querySelector('.watch-middle-cotent');
                if (res.data.skin.skin_json_pc.background) {
                  bgContent.style.background = `url(${this.imageDomin}/${res.data.skin.skin_json_pc.background}) no-repeat 100% 100%`;
                  bgContent.style.backgroundSize = `cover`;
                }
                if (res.data.skin.skin_json_pc.logo) {
                  this.logoShow = true;
                  this.skinLogo = `${this.imageDomin}/${res.data.skin.skin_json_pc.logo}`;
                } else {
                  this.logoShow = false;
                }
                bgColor.style.background = res.data.skin.skin_json_pc.bgColor.substring(
                  3
                );
                footerColor.style.background = res.data.skin.skin_json_pc.bgColor.substring(
                  3
                );
                if (follow) {
                  follow.style.background = res.data.skin.skin_json_pc.pageStyle.substring(
                    3
                  );
                }
                fullScreen.style.background = res.data.skin.skin_json_pc.pageStyle.substring(
                  3
                );
                if (activeHead) {
                  activeHead.style.borderBottomColor = res.data.skin.skin_json_pc.pageStyle.substring(
                    3
                  );
                }
                activeIntroduce.style.borderBottomColor = res.data.skin.skin_json_pc.pageStyle.substring(
                  3
                );
              } catch (error) {
                console.error(error);
              }
            });
          }

          // 获取 推荐商品数据
          this.getGoodsInfo();
          // end

          this.chatFilter(); // 聊天过滤接口

          this.skipHostUrl = `${this.webDominUrl}/user/home/${this.roominfo.host.id}`;
          this.recordHistoryTime = res.data.record_history_time;
          // 初始化数据上报
          this.initVHallReport(res.data.report_token);
          // 初始化邀请卡
          this.invitePartner();
        } else if (res.code == 301) {
          // --------------------
          // 知客 SAAS 融合 相关业务
          // -------——-----------
          this.$EventBus.$emit('loaded');
          window.localStorage.setItem('zhike_refer', window.document.referrer);
          window.location.replace(res.data.url);
        } else if (res.code == 210) {
          this.$EventBus.$emit('loaded');
          this.kickOutSass = true;
        } else {
          this.$EventBus.$emit('loaded');
          this.tipMsg = res.msg;
        }
      });
    },

    /**
     * @description 数据上报  init 方法
     *
     */
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
        });
        window.vhallReport.report('ENTER_WATCH', {
          event: this.$route.query.refer // 推广渠道，会在url里传参
        });
      });
      // 浏览器或者页面关闭时上报
      window.addEventListener('beforeunload', function(e) {
        // 离开H5观看端页面
        if (/room\/watch/.test(window.location.pathname)) {
          window.vhallReport.report('LEAVE_WATCH', {}, false);
        }
      });
    },

    closeOfficialAccountQRCode() {
      this.showOfficialAccountQRCode = false;
    },

    chatSdkLoadHandler(){
      this.chatSdkLoaded = true;
      if(this.chatSdkLoaded&&this.interactionSdkLoaded){
        this.getUerInfo();
        this.getMenuList();
      }

    },
    interactionSdkLoadHandler(){
      this.interactionSdkLoaded = true;
      if(this.chatSdkLoaded&&this.interactionSdkLoaded){
        this.getUerInfo();
        this.getMenuList();
      }
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

      .vhall-kick-outs {
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
