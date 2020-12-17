<template>
  <!--
        小屏幕 显示区域 给相应的DOM 元素 增加 class name: vhall-saas-miniArea
  -->
  <div id="vhall-saas-watchbox" class="vhall-saas-watchbox" v-if="init">
    <!-- 主显示区域 -->
    <div class="vhall-saas-watchbox__mainContent" v-loading='loading && !watchDocShow' element-loading-background="#2d2d2d" v-if="!isKicked">
      <!-- 公告组件 -->
      <notice-show :style="{right: isEmbedVideo ? '0' : '294px'}"></notice-show>
      <!-- 互动显示区域 -->
      <div class="vhall-saas-substreams" v-if="interactiveShow && this.roomInfo.role_name == 2">
        <streams
          v-if="mainScreen"
          :roleName="2"
          :roomId="roomInfo.room_id"
          :speakerList="speakerList"
          :accountId="roomInfo.third_party_user_id"
          :mainScreen="mainScreen"
          :miniElement="miniElemt"
          :isDocShow="watchDocShow"
        >
          <Interactive
            :webinadId='ilId'
            :ownerId="roomInfo.account_id"
            :inavId="roomInfo.inav_id"
            :roomId="roomInfo.room_id"
            :appId="roomInfo.app_id"
            :speakerList="speakerList"
            :nickName="userInfo.nick_name"
            :accountId="roomInfo.third_party_user_id"
            :token="roomInfo.paas_access_token"
            :vssToken="vssToken"
            :role="role"
            :roleName="2"
            :mainScreen="mainScreen"
            :miniElement="miniElemt"
            :isDocShow="watchDocShow"
            :status="roomInfo.status"
            :isInteract="isInteract == 1 && speakerList"
            ref="interactive"
          ></Interactive>
        </streams>
      </div>
      <!-- 文档内容主显示区域 -->
      <div class="vhall-saas-watchbox__mainContent__bigArea" :class="{'video-only': !watchDocShow}" ref="bigArea">
        <!-- player -->
        <div
          class="vhall-saas-watchbox__mainContent__bigArea-placeholder"
          :class="{ embedvideo: isEmbedVideo }"
          v-if="!liveEnded && this.roomInfo.role_name == 2 || !liveEnded && this.playerType == 'vod'"
        >
          <Watch
            v-if="roomInfo.paas_access_token && !interactiveShow"
            :appId="roomInfo.app_id"
            :playerInfo="playerInfo"
            :class="{ 'vhall-saas-miniArea': miniElemt == 'video' }"
            :accountId="roomInfo.third_party_user_id"
            :token="roomInfo.paas_access_token"
            :type="playerType"
            :liveOption="playerLiveOption"
            :vodOption="vodOption"
            :poster="poster"
            :isAudio="roomInfo.layout == 2"
            :voiceBack="voiceBack"
            :vodControllerShow="true"
            ref="vhallPlayer"
            @BackEnd="WarchBackEnd"
            :reportExtra='bizInfo.report_extra'
            :recordHistoryTime="recordHistoryTime"
            :exchangeVideoDoc="miniElemtChange"
            :isMini="miniElemt == 'video'"
            :docVisible="watchDocShow && !isEmbedVideo"
          ></Watch>

          <!-- 互动桌面共享 -->
          <share-screen
            :ownerId="roomInfo.account_id"
            :roleName="roomInfo.role_name"
            :class="{ 'vhall-saas-miniArea': miniElemt == 'doc' }"
            :interactiveShow="interactiveShow"
          ></share-screen>

          <!-- doc -->
          <watch-doc
            ref="refDoc"
            :class="{
              'vhall-saas-miniArea vhall-saas-miniArea-doc': miniElemt == 'doc'
            }"
            v-show="watchDocShow"
            :channel-id="roomInfo.channel_id"
            :roomId="roomInfo.room_id"
            :joinId="roomInfo.third_party_user_id"
            :appId="roomInfo.app_id"
            :roleType="2"
            :token="roomInfo.paas_access_token"
            :isVod="(roomInfo.status == 2 || roomInfo.status == 0 )&& roomInfo.record_id"
            :isMini="miniElemt == 'doc'"
            :rebroadcastChannelId="rebroadcastChannelId"
            :playMode="0"
          ></watch-doc>
        </div>
        <!-- 直播结束 -->
        <div
          class="vhall-saas-watchbox__mainContent__bigArea-watch-end"
          v-if="liveEnded"
        >
          <h1 style="width:100%">{{$t("message.end")}}</h1>
        </div>
        <!-- 固定工具栏区域 -->
        <div class="player-funct" v-show="!isEmbedVideo" :class="{'video-only': watchDocShow}">
          <div class="player-share" @click="toggleShare" v-if="!isEmbed && userModules.share.show == 1 ">
            <span
              class="iconfont"
              style="color: #ccc; display: inline-block;vertical-align: middle"
              >&#xe707;</span
            >
            <span class="share-icon-text">分享</span>
          </div>
          <div
            v-if="checkBrowserSupport"
            v-show="settingShow"
            class="player-share"
            @click="clickSetting"
          >
            <span
              class="iconfont"
              style="color: #ccc; display: inline-block;vertical-align: middle"
              >&#xe73b;</span
            >
            <span class="share-icon-text">设置</span>
          </div>
          <!-- <div class="player-hand" @click="applyMic">{{ handSend }}</div> -->
          <div v-show="!isBanned" v-if="checkBrowserShow">
            <el-button
              v-show="handShow && !allBanned && !interactiveShow"
              :disabled="micShow"
              class="player-hand"
              @click="applyMic(lowerWheat)"
              >{{ handSend }}</el-button
            >
            <el-button
              v-show="handDownShow || interactiveShow"
              class="player-hand"
              @click="downMic()"
              >下麦</el-button
            >
          </div>
          <div class="player-active" v-show="!isEmbed">
            <div class="table-praise" v-if="userModules.like.show == 1">
              <praise :roomId="roomId" :times="roomInfo.like"></praise>
            </div>
            <div class="table-reward" v-if="userModules.reward.show == 1 && roomInfo.role_name != 4 && roomInfo.role_name != 3" @click="showGiveMoneyPannel">
              <!-- <reward :roomId="roomId"></reward> -->
              <img src="../../assets/images/reward/reward-pay-23.png" alt="icon加载失败">
            </div>
            <div class="table-gift" v-if="userModules.gift.show == 1 && roomInfo.role_name == 2">
              <img @click='openGiftPannel' src="../../assets/images/publish/gift-icon-3.1.4.png" alt="">
            </div>
            <div class="table-redCoupon" v-if="redPacketShowBut && !isPlayback && roomInfo.role_name != 4 && roomInfo.role_name != 3">
              <getCoupon
                v-if="roomInfo.room_id"
                :vss_token="vssToken"
                :room_id="roomInfo.room_id"
                :red_packet_uuid="redPacketUuid"
                :authInfo="authInfo"
                :isHavePacket="isHavePacket"
                @NoLogin="NoLogin"
              ></getCoupon>
            </div>
            <!-- <span>打赏</span> -->
          </div>
        </div>
        <div class="table-lottery">
          <lottery
            :roomId="roomId"
            :vssToken="vssToken"
            ref="lotterySon"
          ></lottery>
        </div>
        <!-- 活动工具栏Done -->
      </div>
    </div>

    <!-- 侧边栏显示区域 -->
    <div
      class="vhall-saas-watchbox__sideContent"
      v-if="!isKicked"
      v-show="!isEmbedVideo"
    >
      <!-- 视频占位区 -->
      <div
        class="vhall-saas-videobox"
        v-show="(miniElemt != '' || watchDocShow) && !isEmbedVideo"
      >
        <div v-show="!interactiveShow && playIng" class="mask">
          <p>
            <span>视图</span>
            <el-tooltip content="切换" placement="top">
              <a
                href="javascript:void(0);"
                class="iconfont iconfuzhi"
                @click="miniElemtChange"
              ></a>
            </el-tooltip>
            <el-tooltip
              content="全屏"
              placement="top"
              v-show="miniElemt == 'video'"
            >
              <a
                href="javascript:void(0);"
                class="iconfont iconquanping"
                @click="fullScreen()"
              ></a>
            </el-tooltip>
          </p>
        </div>
        <!--        <span class="iconfont iconquanping" @click="miniElemtChange" v-show="!interactiveShow"></span>-->
        <img
          v-show="videoSizeShow"
          class="video-image"
          src="../../assets/small.png"
          alt
        />
      </div>
      <!-- 聊天互动区 -->
      <div class="vhall-saas-chatsbox">
        <div class="vhall-saas-chatsbox__tabs" :class="{invisible:!chatStatusShow && tabIndex != 2}">
          <a
            v-show="chatStatusShow"
            href="javascript:;"
            @click="changeTab(0)"
            :class="{ actived: tabIndex == 0 }"
            >{{chatTitle}}</a
          >
          <a
            href="javascript:;"
            :class="{ actived: tabIndex == 2 }"
            @click="changeTab(2)"
            v-if="qaVisible"
            >问答</a
          >
        </div>

        <!-- 增加 - 是否单视频嵌入的判断 -->
        <div class="vhall-saas-chatsbox__content"  v-if="!isEmbedVideo">
          <chat
            v-show="tabIndex == 0 && chatStatusShow"
            :showControl="false"
            :appId="roomInfo.app_id"
            v-if="roomInfo.channel_id"
            :channelId="roomInfo.channel_id"
            :roomId="roomInfo.room_id"
            :roleName="roomInfo.role_name"
            :userId="roomInfo.third_party_user_id"
            :vssToken="vssToken"
            :isBanned="isBanned"
            :allBanned="allBanned"
            :token="roomInfo.paas_access_token"
            :plugin="chatPlugins"
            :isEmbed="isEmbed"
            :playerType="playerType"
            :chatFilterData="chatFilterData"
            :chatFilterUrl="''"
            @pushBarrage="pushBarrage"
            ref="ChatRef"
          ></chat>
          <qa
            v-show="qaVisible && tabIndex == 2"
            :webinarId="ilId"
            :masterEnd="false"
            :roomId="roomInfo.room_id"
            :joinId="saasJoinId"
            :thirdPartyId="roomInfo.third_party_user_id"
            :isEmbed="isEmbed"
            :roleName='false'
            ref="qa"
          ></qa>
        </div>
      </div>
    </div>
    <!-- POP 事件弹出层显示区域 -->
    <!-- 签到 -->
    <!-- <Signin
      v-if="roomInfo.room_id"
      :vss_token="vssToken"
      :room_id="roomInfo.room_id"
      :masterEnd="false"
    ></Signin> -->
    <Signin
      v-if="roomInfo.room_id"
      :vss_token="vssToken"
      :room_id="roomInfo.room_id"
      :masterEnd="false"></Signin>
    <!-- 不是单视频嵌入时 ，渲染问卷模块 -->
    <template v-if="!isEmbedVideo">
    <popup
      :onClose="closeQuestion"
      :headerShow="showQA"
      :visible="showQA"
      :width="'600px'"
      title="问卷"
    >
      <!-- <question
        :roomId="roomId"
        :ilId="ilId"
        :userId="roomInfo.third_party_user_id"
        :accountId="roomInfo.account_id"
        :accessToken="roomInfo.paas_access_token"
        :appId="roomInfo.app_id"
        :showControl="true"
        @onCloses="closeQuestion"
        :roleName="roomInfo.role_name"
        ref="questions"
      ></question> -->
    </popup>
    </template>
    <popup
      :visible="shareVisible"
      :onClose="toggleShare"
      :background="'#E8E8E8'"
      :width="'438px'"
      :title="'分享'"
    >
      <share :url="shareUrl" :domains="domains" :shareId="shareId"></share>
    </popup>
    <popup
      :visible="UpperVisible"
      :onClose="closeUpper"
      :background="'#E8E8E8'"
      :width="'438px'"
      :headerShow="false"
    >
      <div class="visit-wrap-pop">
        <div class="recordboxHeader">
          <span>邀请上麦</span>
          <a
            href="javascript:;"
            @click="closeUpper"
            class="iconfont iconguanbi1"
          ></a>
        </div>
        <div class="upper-modal-body">
          <p>主持人邀请您上麦</p>
          <a href="javascript:;" class="v-comfirm" @click="AgreeUpper">同意</a>
          <a href="javascript:;" @click="refuseUpper" class="v-cancle">
            不同意(
            <span class="v-times">{{ UpperTime }}</span
            >s)
          </a>
        </div>
      </div>
    </popup>
    <!-- 设备设置 -->
    <popup
      :visible="mediaSettingVisible"
      :onClose="closeMediaSettings"
      :title="'设置'"
      :width="'380px'"
      v-if="settingWatchShow"
    >
      <watchSetting
        v-if="settingWatchShow"
        :editorAble="mediaSettingVisible"
        :roleName="roomInfo.role_name"
        :isInteract="isInteract"
        :layout="roomInfo.layout"
        :vssToken="vssToken"
        :roomId="roomInfo.room_id"
        :visible="mediaSettingVisible"
        @onCloses="closeMediaSettings"
        ref="mediasettingsRef"
        @vhallCheckStatus="vhallCheckStatus"
      ></watchSetting>
    </popup>
    <!--打赏-->
    <popup
      :visible="showGiveMoney"
      :onClose="closeGiveMoney"
      :title="'支付方式'"
      :width="'500px'"
    >
      <div class="pay-content">
        <div>
          <span :class="{active: giveMoneyIndex == 1}" @click="(giveMoneyIndex = 1), (giveMoney = 1.88)">1.88元</span>
          <span :class="{active: giveMoneyIndex == 2}" @click="(giveMoneyIndex = 2), (giveMoney = 8.88)">8.88元</span>
        </div>
        <div>
          <span :class="{active: giveMoneyIndex == 3}" @click="(giveMoneyIndex = 3), (giveMoney = 88.88)" >88.88元</span>
          <el-input class="give-money-input" v-model="giveMoney" placeholder="打赏其他金额"></el-input>
        </div>
        <div class="describe">
          <el-input placeholder="很精彩 来赞一个" v-model="giveMoneyDes"></el-input>
        </div>
        <div class="pay-method">
          <el-radio v-model="giveMoneyPayWay" label="1">微信支付</el-radio>
          <el-radio v-model="giveMoneyPayWay" label="2">支付宝支付</el-radio>
        </div>
      </div>
      <el-button @click.stop="handleGiveMoney" type="primary">确定</el-button>
    </popup>
    <popup
      :visible="showGiveMoneyQr"
      :onClose="closeGiveMoneyQr"
      :title="'支付'"
      :width="'300px'"
    >
      <div class="pay-img">
        <img :src="giveMoneyUrl">
      </div>
    </popup>
    <!--选择礼物-->
    <popup
      :visible="showGiftSend"
      :onClose="closeGiftsPannel"
      :title="'选择礼物'"
      :width="'616px'">
      <div class="gifts-wrap">
        <div class="gift-search"></div>
        <div class="gifts-list">
          <div class="gift-item"
            :class="{'active': item.id == selectGiftId}"
            v-for='(item, index) in giftList'
            :key="index"
            @click.stop="chooseGift(index)">
            <div class="gift-cover">
              <template v-show="uploadDomain">
                <img :src="uploadDomain + '/' + item.image_url">
              </template>
            </div>
            <div class="gift-info">
              <span class="name">{{item.name}}</span>
              <span class="price">￥{{item.price}}</span>
            </div>
          </div>
        </div>
        <div class="gifts-select">
          <el-button
            class="sure-gift"
            :disabled="!selectGiftId"
            @click="selectGift"
            >确定</el-button
          >
          <el-button
              class="cancel-gift"
              @click="closeGiftsPannel"
              >取消</el-button
            >
          <div class="gift-ids">当前选中<span class="color:#3562FA">{{selectGiftId ? 1 : 0}}</span>件商品</div>
        </div>
      </div>
    </popup>
    <!--选择支付方式-->
    <popup
      :visible="showPayWay"
      :onClose="closePayWay"
      :title="'支付方式'"
      :width="'380px'"
    >
      <div class="pay-way">
        <el-radio v-model="payWay" label="1">微信支付</el-radio>
        <el-radio v-model="payWay" label="2">支付宝支付</el-radio>
      </div>
      <el-button @click="checkPayWay" type="primary">确定</el-button>
    </popup>
    <!--礼物支付二维码-->
    <popup
      :visible="showPayQrCode"
      :onClose="closePayQrCode"
      :title="'支付'"
      :width="'300px'"
    >
      <div class="pay-img">
        <img :src="payQrCode">
      </div>
    </popup>
    <SassAlert
      :visible="PopAlert.visible"
      :knowText="PopAlert.knowText"
      @onClose="videoPaly"
      @onCancel="videoPaly"
    >
      <div slot="content">
        <span v-html="PopAlert.context"></span>
      </div>
    </SassAlert>
    <SassAlert
      :visible="streamendErrorPopupVisible"
      @onClose="streamendErrorPopupClose"
      @onCancel="streamendErrorPopupClose"
    >
      <div slot="content">
        <span>因设备问题导致连麦中断，请检查设备</span>
      </div>
    </SassAlert>
    <div class="vhall-kick-out" v-if="isKicked">
      <h1>您已被禁止访问房间！</h1>
    </div>
    <div class="vhall-kick-out" v-if="roomInfo.role_name != 2 && this.playerType != 'vod'">
      <h1>{{`正在使用${roleNameMap[this.roomInfo.role_name]}身份参与活动，无法进行观看，建议清除浏览器cookie后再进行访问`}}</h1>
    </div>
    <playbill v-if="false"></playbill>
  </div>
</template>
<script>
import QRcode from 'qrcode';
import { listenEvent } from './mixin/watch/listen-event';
import noticeShow from '../../libs/notice/noticeShow';
import Chat from '../../libs/chat';
import Watch from '../../libs/player/index';
import WatchDoc from '@/components/Doc/watch-doc';
// import MemberList from '../../libs/member-list'
import streams from '../../libs/interactive/remoteStreams'; // 订阅流
import Interactive from '../../libs/interactive'; // 互动
import praise from '../../libs/praise'; // 点赞
// import question from '../../libs/question/saas'; // 问卷
import reward from '../../libs/reward'; // 打赏
import lottery from '../../libs/lottery'; // 抽奖
import playbill from '../../libs/playbill'; // 开屏海报
// import Signin from '../../libs/saas-signin'; // 签到
import Signin from '../../libs/saas-signin/watchSigin'; // 签到
import qa from '../../libs/qa';
import Popup from '../../libs/saas-popup'; // 弹窗
import getCoupon from '../../libs/redcoupon/openRedCoupon'; // 接红包
import share from '../../libs/share';
import checkMixin from '../../libs/envCheck';
import watchSetting from '../../libs/watchSetting'; // 观看设置
import shareScreen from '../../libs/desktopScreen';
import { findIndex } from 'lodash';
import SassAlert from '../../libs/saas-popup/alert';
import { browserSupport } from '@/utils/getBrowserType';
import { isIE, resize } from '../../utils/utils';
import { sessionOrLocal } from '@/utils/utils'

import EventBus from '@/utils/Events';

export default {
  name: 'vhallEnjoyWatchSaas',

  props: {
    shareId: {
      required: true
    },
    chatShow: {
      required: true
    },
    roomId: {
      type: [String],
      required: true
    },

    authInfo: {
      default: () => []
    },

    playerInfo: {
      required: false
    },

    vssToken: {
      required: true
    },

    vssJoinId: {
      required: false
    },

    userChatId: {
      required: true
    },

    saasJoinId: {
      required: true
    },

    qaStatus: {
      required: true
    },

    domains: {
      required: true
    },
    ilId: {
      required: true // webinarid
    },
    isEmbed: {
      required: false // 是否为潜入页
    },
    chatFilterData: {
      required: false // 聊天过滤的数组
    },
    recordHistoryTime: {
      required: false,
      default: ''
    },
    menuData: {
      required: true,
      default: []
    },
    bizInfo: { // 业务层信息（主要是配置相关信息）
      required: true,
      default: () => {}
    }
  },

  mixins: [listenEvent, checkMixin],

  components: {
    SassAlert,
    noticeShow,
    Chat,
    Watch,
    WatchDoc,
    streams,
    Interactive,
    praise,
    // question,
    Signin,
    reward,
    lottery,
    qa,
    Popup,
    getCoupon,
    playbill,
    share,
    shareScreen,
    watchSetting
  },

  data () {
    return {
      selectGiftId: '',
      showGiftSend: false,
      isHavePacket: false,
      checkBrowserSupport: true, // shezhi
      checkBrowserShow: true, // 不支持的浏览器隐藏举手上麦
      playIng: true,
      vhallCheckStatusChange: true, // 设置状态
      settingWatchShow: false, // 设置
      settingShows: false,
      settingShow: false, // 设置的显示
      mediaSettingVisible: false, // 媒体设置的显示弹窗
      videoSizeShow: false, // 视频占位图
      UpperTimerInter: null,
      UpperTime: 0,
      handDownShow: false, // 下麦的显示与否
      lowerWheat: true, // 是上麦还是下麦 true--是上麦状态 false --等待上麦状态
      statusHand: false, // 全部允许不允许的举手状态
      vodControllerShow: '', // 播放器控制条的开关
      chatStatusShow: true, // 聊天显示不显示
      sideStatusShow: true, // 侧边栏的显示不显示
      voiceBack: false, // 音频回放
      mainScreen: '', // 主讲人ID 默认主持人
      speakerList: [], // 上麦人员列表 - 业务给出的接口
      playerType: '', // 播放器的类型是直播还是回放
      playerLiveOption: {},
      vodOption: {},
      miniElemt: '', // 取值 doc  = 文档区到右上角， video = 视频区到右上角  interaction = 主讲人区域到右上角 default: '' 不显示右上角区域
      init: false, // 房间业务SDK初始化成功。开始挂载组件
      roomInfo: '',
      userInfo: '',
      chatPlugins: {
        emoji: true,
        audit: {
          show: false,
          src: 'javascript:;'
        }
      },
      changeIcon: true, // 文档切换按钮
      userModules: {}, // 模块显示与否
      giftShow: false,
      micShow: false,
      playBillShow: true,
      redPacketShowBut: false,
      redPacketUuid: '',
      RedPacketVisible: false,
      handShow: false, // 举手上麦的显示

      handSend: '举手上麦',

      timeStart: 30,
      watchDocShow: false,
      interactiveShow: false, // 是否显示互动

      liveEnded: false, // 直播是否结束

      cancelMic: false, // 是否可以下麦

      waiting: false, // 是否等待上麦

      timer: null,
      timerFun: null,
      tabIndex: 0,
      instance: null,
      role: 'GUEST',
      sign_id: '',
      qaVisible: this.qaStatus == 1,
      shareUrl: '',
      shareVisible: false,
      UpperVisible: false,
      showQA: false,
      isPlayback: false,
      isBanned: false, // 是否被禁言
      allBanned: false, // 是否被全体禁言
      isKicked: false, // 是否被踢出
      status: 0, // 直播状态
      isInteract: '', // 互动
      isEmbedVideo: this.$route.query.embed == 'video', // 是否为单视频嵌入页
      PopAlert: {
        context: window.i18n.t('message.clickToPlay'),
        visible: false,
        knowText: window.i18n.t('message.okText')
      },
      checkBrowser: true,
      isDesktop: false, // 桌面共享中并文档演示中
      loading: false,
      chatTitle: '聊天',
      roleNameMap: {
        '1': '主持人',
        '2': '观众',
        '3': '助理',
        '4': '嘉宾'
      },
      selfOnline: 0,
      poster: '',
      streamendErrorPopupVisible: false, // stream-end事件提示
      layout: 0,
      giftList: [],
      uploadDomain: '',
      payWay: '1',
      showPayWay: false,
      showPayQrCode: false,
      payQrCode: '',
      showGiveMoney: false,
      giveMoney: '',
      giveMoneyIndex: 1,
      giveMoneyPayWay: '1',
      giveMoneyDes: '',
      giveMoneyUrl: '',
      showGiveMoneyQr: false
    };
  },
  created () {
    this.userInfo = sessionOrLocal.get('user') ? JSON.parse(sessionOrLocal.get('user')) : {}
    // 存取观看端标识
    sessionOrLocal.set('watch', true);
    // 存取是否登录的标识
    sessionOrLocal.set('authInfo', JSON.stringify(this.authInfo));
  },
  watch: {
    roomId (newVal) {
      if (!newVal) {
        return;
      }
      if (this.qaStatus == 1) {
        this.qaVisible = true;
      } else {
        this.qaVisible = false;
      }
    },
    bizInfo: {
      handler (val) {
        if (val) {
          this.vssInfo = val
          this.poster = val.webinar.image_url ? val.domains.upload + '/' + val.webinar.image_url : '';
          this.userModules = val.modules;
          this.isInteract = val.webinar.is_interact;
          this.uploadDomain = val.domains.upload
        }
      },
      deep: true,
      immediate: true
    }
  },
  mounted () {
    this.getInavInfo();
    this.redPacketInit();
    
    this.FIRST = true;
    this.repeatStatus = false; // 防止重复点击上麦
    if (!browserSupport()) {
      this.checkBrowser = false; // 干掉设置
      this.checkBrowserShow = false; // 干掉举手上麦
      this.checkBrowserSupport = false;
    }
    let chat = this.menuData.find(m => m.type == 3);
    if (chat) {
      this.chatTitle = chat.name;
    }
    this.$nextTick(() => {
      this.getList()
    })
    this.eventListener()
  },
  methods: {
    eventListener () {
      EventBus.$on('roomAllInfo', (msg) => {
        if (msg.type == "gift_send_success") {
          this.showGiftSend = false
          this.showPayQrCode = false
          this.showPayWay = false
          this.selectGiftId = ''
          this.payQrCode = ''
          this.payWay = 1
        }
        if (msg.data.type == "gift_send_success") {
          this.closeGiveMoneyQr = false
          this.showGiveMoney = false
          this.giveMoneyIndex = 1
          this.giveMoneyPayWay = 1
          this.giveMoney = ''
          this.giveMoneyDes = ''
        }
      });
    },
    showGiveMoneyPannel () {
      this.showGiveMoney = true
    },
    closeGiveMoneyQr () {
      this.showGiveMoneyQr = false
    },
    handleGiveMoney () {
      this.$fetch('seadAwardMsg', {
        room_id: this.roomInfo.room_id,
        reward_amount: Number(this.giveMoney).toFixed(2),
        channel: this.giveMoneyPayWay == 1 ? 'WEIXIN' : 'ALIPAY',
        service_code: 'QR_PAY',
        describe: this.giveMoneyDes
      }).then(res => {
        if (res.code == 200 && res.data.pay_data) {
          let a = QRcode.toDataURL(
            res.data.pay_data,
            (err, url) => {
              this.showGiveMoneyQr = true
              this.giveMoneyUrl = url
            }
          )
        }
      })
    },
    closeGiveMoney () {
      this.showGiveMoney = false
    },
    openGiftPannel () {
      this.showGiftSend = true
    },
    closePayWay () {
      this.showPayWay = false
    },
    // 礼物支付获取二维码
    checkPayWay (type) {
      let str =''
      if (this.payWay == 1) {
        str = 'WEIXIN'
      } else {
        str = 'ALIPAY'
      }
      this.$fetch('sendGift', {
        gift_id: this.selectGiftId,
        channel: str,
        service_code: 'QR_PAY',
        room_id: this.roomInfo.room_id
      }).then(res => {
        let a = QRcode.toDataURL(
          res.data.data.pay_data,
          (err, url) => {
            this.showPayQrCode = true
            this.payQrCode = url
          }
        )
      }).catch(e => {
        this.$message.error(e.msg)
      })
    },
    closePayQrCode () {
      this.showPayQrCode = false
    },
    closeGiftsPannel () {
      this.showGiftSend = false
      this.selectGiftId = ''
    },
    chooseGift (index) {
      this.selectGiftId = this.giftList[index].id
    },
    // 获取礼物列表
    getList () {
      // list
      this.$fetch('giftList', {
        room_id: this.roomInfo.room_id
      }).then((res) => {
        if (res.code === 200) {
          // this.giftContentControl = !this.giftContentControl
          // this.imageInfo = res.data ? res.data.list : []
          // console.log('礼物列表',this.giftContentControl);
          this.giftList = res.data.list
        }
      })
    },
    getSpeakList () {
      this.$fetch('speakList', {
        room_id: this.bizInfo.room_id
      }).then(res => {
        if (res.code == 200 && res.data.list) {
          return res.data.list
        }
      })
    },
    getRoomStatus () {
      this.$fetch('getToolStatus', {
        room_id: this.bizInfo.room_id
      }).then(res => {
        if (res.code == 200 && res.data) {
          this.layout = res.data.layout
          this.mainScreen = res.data.main_screen
          this.allBanned = res.data.all_banned == 1
          this.handDownShow = false
          if (res.data.is_handsup == 1) {
            this.handShow = true;
            this.statusHand = true;
          } else {
            this.handShow = false;
            this.statusHand = false;
          }
          // 初始化文档状态 end
          this.speakerList = res.data.speaker_list;
          this.rebroadcastChannelId = res.data.rebroadcast && res.data.rebroadcast.channel_id; // TODO: rebroadcast
          let isApply = findIndex(this.speakerList, {
            account_id: this.roomInfo.third_party_user_id
          })
          if (isApply > -1 && this.roomInfo.role_name != 1) {
            this.interactiveShow = true;
            this.loading = true;
          }
          this.handShow = Boolean(res.data.is_handsup);
          window.EventBridge.$emit('loaded');
          this.init = true;
          this.isDesktop = res.data.is_desktop;
          setTimeout(() => {
            if (this.isPlayback || this.interactiveShow || !this.watchDocShow) return;
            if (res.data.is_desktop == 1) {
              // 桌面共享状态
              if (this.miniElemt == 'video') {
                this.miniElemtChange();
              }
            } else if (res.data.is_desktop == 0) {
              if (this.miniElemt == 'doc') {
                this.miniElemtChange();
              }
            }
          }, 4000);
          sessionOrLocal.set('speakerDefinition', res.data.definition || '');
        }
      }).catch (e => {
        console.log(e);
      })
    },
    async getInavInfo () {
      await this.getRoomStatus()
      let inavInfo = {
        account_id: this.bizInfo.host.id,
        app_id: this.bizInfo.app_id,
        channel_id: this.bizInfo.channel_id,
        inav_id: this.bizInfo.inav_id,
        introduction: this.bizInfo.introduction,
        layout: this.layout,
        like: this.bizInfo.webinar.like,
        paas_access_token: this.bizInfo.paas_access_token,
        record_id: this.bizInfo.paas_record_id,
        role_name: 2,
        room_id: this.bizInfo.room_id,
        status: this.bizInfo.webinar.type,
        subject: this.bizInfo.webinar.subject,
        third_party_user_id: this.bizInfo.user.third_party_user_id
      }
      this.roomInfo = inavInfo

      this.isPlayback = inavInfo.status === 2 && inavInfo.record_id !== '';
      this.shareUrl = `https:${this.domains.web}live/watch/${this.ilId}`;
      this.$emit('descripe', this.roomInfo.introduction);
      if (this.roomInfo.status == 1 && this.FIRST && this.roomInfo.role_name == 2) {
        this.PopAlert.visible = true;
        this.FIRST = false;
      }
      if (
        this.isInteract == 1 &&
        this.roomInfo.status == 1 &&
        this.checkBrowser
      ) {
        this.settingWatchShow = true;
        this.settingShow = true;
      } else {
        this.settingWatchShow = false;
        this.settingShow = false;
      }
      // 聊天模块的显示与否 1--显示 2--隐藏 3--直播回放显示 4--预告结束显示
      if (this.chatShow == 2) {
        this.chatStatusShow = false;
        this.sideStatusShow = false;
        this.changeTab(2);
      } else {
        this.chatStatusShow = true;
      }
      // 主屏ID
      // 跳转到相对应的直播 0--预约 1--直播 2--结束 回放2&&record_id不为空
      if (inavInfo.status == 2 && inavInfo.record_id == '') {
        // 跳转到直播结束
        // window.location.href = `/${this.ilId}`
      } else if ((inavInfo.status == 2 || inavInfo.status == 0) && inavInfo.record_id != '') {
        // 回放
        this.playerType = 'vod';
        this.vodOption['recordId'] = this.roomInfo.record_id;
        this.vodOption['defaultDefinition'] = 'same';
        this.playerLiveOption = {};
      } else {
        // 直播
        this.playerType = 'live';
        this.vodOption = {};
        this.playerLiveOption = {
          type: 0 || isIE() ? 'hls' : 'flv',
          roomId: this.roomInfo.room_id
        };
      }
      this.isBanned = this.bizInfo.user.is_gag == 1
      this.isKicked = this.bizInfo.user.is_kick == 1
      let context = {
        nickname: this.userInfo.nick_name, // 昵称
        avatar: this.userInfo.avatar
          ? `https:${this.userInfo.avatar}`
          : 'https://cnstatic01.e.vhall.com/3rdlibs/vhall-static/img/default_avatar.png', // 头像
        pv: this.vssInfo.webinar.pv, // pv
        role_name: this.roomInfo.role_name, // 角色 1主持人2观众3助理4嘉宾
        device_type: '2', // 设备类型 1手机端 2PC 3SDK
        device_status: '0', // 设备状态  0未检测 1可以上麦2不可以上麦
        is_banned: this.isBanned, // 是否禁言 1是0否
        audience: true
      };
      sessionOrLocal.set('vhall_chat_context', JSON.stringify(context));
      const opt = {
        appId: this.roomInfo.app_id,
        accountId: this.roomInfo.third_party_user_id,
        // accountId: '',
        channelId: this.roomInfo.channel_id,
        context: JSON.stringify(context),
        token: this.roomInfo.paas_access_token,
        client: 'pc_browser'
      };
      if (this.roomInfo.role_name != 2 && this.playerType != 'vod') {
        this.init = true;
        window.EventBridge.$emit('loaded');
        return;
      }
      VhallChat.createInstance(
        opt,
        chat => {
          this.$nextTick(() => {
            this.addSocketsListener();
          })
          window.chatSDK = chat.message;
          console.log('chatSDK is Ready');

          if (this.isEmbedVideo) {
            this.embedBarrage();
            this.initNotice();
          }
          setTimeout(() => {
            if (this.isInteract == 1 && this.playerType == 'live') {
              this.vhallChecking();
            }
          }, 1500);
          chat.message.join(msg => {
            // 将join放在实例化处是因为--放在聊天组件内，会因sockit消息快慢问题 偶发丢失join消息
            if (this.vssInfo.sso_mark) {
              if (msg.sender_id == this.vssInfo.user.third_party_user_id) {
                this.selfOnline++;
              }
              console.log(msg.sender_id == this.vssInfo.user.third_party_user_id, '关于有时候手机进入不会顶掉当前账户-----', this.selfOnline);
              if (this.selfOnline > 1) {
                window.location.href = this.vssInfo.kick_out_url;
              }
            }
            if (this.isPlayback) {
              if (msg.context.role_name != 1) {
                this.$emit('onlineJoin', msg);
              }
            } else {
              this.$emit('onlineJoin', msg);
            }
          });
        },
        err => {
          console.error('聊天SDK实例化失败', err);
        }
      );
    },
    WarchBackEnd (val) {
      this.playIng = !val;
    },
    // 是否创建过
    vhallCheckStatus (msg) {
      console.log('msg>>>>>>>>>>>>>>>>>>>>', msg);
      this.vhallCheckStatusChange = msg;
    },
    // 点击设置
    clickSetting () {
      this.mediaSettingVisible = true;
    },
    closeMediaSettings () {
      this.mediaSettingVisible = false;
    },
    // 邀请上下麦
    getWatchUpperMsg (msg) {
      this.upperMsg = msg;
      clearInterval(this.UpperTimerInter);
      !this.isEmbedVideo && (this.UpperVisible = true);
      this.UpperTime = 30;
      this.UpperTimerInter = setInterval(() => {
        this.UpperTime = this.UpperTime - 1;
        if (this.UpperTime == 0) {
          this.refuseUpper(1);
          this.$message.warning({
            message: `由于您长时间没有响应，导致上麦失败`
          });
          clearInterval(this.UpperTimerInter);
        }
      }, 1000);
    },
    AgreeUpper () { // 观看端同意上麦邀请调用方法
      clearInterval(this.UpperTimerInter);
      if (this.statusHand) {
        // 在全部允许举手的状态下进行邀请上麦
        this.handShow = false;
        this.handDownShow = true; // 下麦按钮的显示
      } else {
        this.handShow = false;
        this.handDownShow = true;
      }
      this.UpperVisible = false;
      this.$fetch('agreeInvite', {
        room_id: this.bizInfo.room_id
      });
      this.$fetch('speakOn', { // 上麦接口成功后出发vrtc_connect_success消息，监听到该消息后手动维护speakerList，渲染互动组件 互动组件初始化互动sdk后 执行autorepushstream方法判断该用户是否已上麦，若已上麦就开始推流
        room_id: this.bizInfo.room_id
      }).then(async () => {
        await this.$fetch('getToolStatus', { // 上麦之前获取房间内音视频禁用状态 bug15469
          room_id: this.bizInfo.room_id
        }).then(res => {
          this.mainScreen = res.data.main_screen
          this.speakerList = res.data.speaker_list
        });
        this.interactiveShow = true;
        this.loading = true;
      }).catch(() => {
        this.interactiveShow = false;
        this.handShow = true;
        this.loading = false;
        this.handDownShow = false;
      });
    },
    /**
     * @param {Number} flag flag为1的时候不发送拒绝请求
     */
    refuseUpper (flag) {
      this.UpperVisible = false;
      if (flag == 1) return;
      // 取消上麦
      this.$fetch('rejectInvite', {
        room_id: this.bizInfo.room_id
      }).catch(error => {
        console.error('拒绝上麦邀请接口错误', error);
      });
    },
    closeUpper () {
      // 关闭弹窗
      this.refuseUpper();
      this.UpperVisible = false;
    },
    // 直播开启
    startPlayControl () {
      // this.startPlayContro = 'live'
      this.liveEnded = false;
      this.videoSizeShow = false;
    },
    miniElemtChange () {
      try {
        if (this.miniElemt == 'video') {
          this.miniElemt = 'doc';
          const w = this.$refs.bigArea && this.$refs.bigArea.offsetWidth;
          const h = this.$refs.bigArea && (this.$refs.bigArea.offsetHeight - 40);
          const opt = {
            width: w,
            height: h
          };
          this.$refs.vhallPlayer.setSize(opt);
          this.vodControllerShow = true;
        } else if (this.miniElemt == 'doc') {
          this.miniElemt = 'video';
          this.vodControllerShow = false;
          const opt = {
            width: 294,
            height: 168
          };
          this.$refs.vhallPlayer.setSize(opt);
        }
      } catch (e) {}
      // 重置 尺寸
      resize();
    },
    // 关闭问卷
    closeQuestion (msg) {
      this.showQA = false;
    },
    changeTab (idx) {
      this.tabIndex = idx;
      if (idx == 0) {
        setTimeout(() => {
          this.$refs.ChatRef.refresh();
        }, 20);
      }
      if (idx == 2) {
        setTimeout(() => {
          this.$refs.qa.refresh();
        }, 20);
      }
    },
    NoLogin () {
      this.$emit('NoLogin');
    },
    redPacketInit () {
      // 如果 是单视频嵌入 跳过 - 获取上次红包信息
      if (this.isEmbedVideo) return;
      const obj = {
        vss_token: this.vssToken,
        room_id: this.roomId
      };
      this.$fetch('redPackInfo', {
        room_id: this.bizInfo.room_id,
        red_packet_uuid: this.redPacketUuid
      }).then(res => {
        if (res.data.status == 1) {
          // 有红包
          this.redPacketUuid = res.data.red_packet.red_packet_uuid;
          this.isHavePacket = res.data.red_packet.get_user_count != res.data.red_packet.number;
          this.redPacketShowBut = true;
          this.status = res.data.status;
        }
      });
    },

    embedBarrage () {
      window.chatSDK.on(msg => {
        if (typeof msg !== 'object') {
          msg = JSON.parse(msg);
        }
        try {
          if (typeof msg.context !== 'object') {
            msg.context = JSON.parse(msg.context);
          }
          if (typeof msg.data !== 'object') {
            msg.data = JSON.parse(msg.data);
          }
        } catch (e) {
          console.log(e);
        }
        console.log('============收到聊天消息===============');
        console.log(msg);
        if (!msg.data.barrageTxt && msg.data.text_content) {
          msg.data.barrageTxt = msg.data.text_content.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>');
        }
        // if (msg.data.text_content) {
        //   msg.data.text_content = textToEmojiText(msg.data.text_content)
        // }
        EventBus.$emit('receiveMsg', msg);
      });
    },
    toggleShare () {
      this.shareVisible = !this.shareVisible;
    },
    fullScreen () {
      if (this.miniElemt == 'video') {
        this.$refs.vhallPlayer.toogleFullScreen();
      }
    },
    setMiniElement (val) {
      if (this.$route.query.embed == 'video') return; // 如果为嵌入页，embed参数为video的时候（即为但视频活动的时候）不显示文档

      try {
        this.miniElemt = val;
        this.$nextTick(() => {
          this.$refs.ChatRef.refresh();
          setTimeout(() => {
            this.$refs.ChatRef.scrollBottom();
          }, 10);
        });
        if (val == 'video') {
          this.vodControllerShow = false;
          const opt = {
            width: 294,
            height: 168
          };
          this.$refs.vhallPlayer.setSize(opt);
        } else {
          this.vodControllerShow = true;
          const w = this.$refs.bigArea.offsetWidth;
          const h = this.$refs.bigArea.offsetHeight - 40;
          const opt = {
            width: w,
            height: h
          };
          this.$refs.vhallPlayer.setSize(opt);
        }
      } catch (e) {}

      resize();
    },
    // 用户上麦
    applyMic (isMic) {
      let that = this;
      let data = { room_id: this.roomId };
      if (this.repeatStatus) {
        return;
      }
      this.repeatStatus = true;
      if (isMic) {
        // 上麦状态
        this.$fetch('applySpeakOn', {
          room_id: this.bizInfo.room_id
        }).then(res => {
          this.repeatStatus = false;
          if (res.code == 200) {
            this.timer = 30;
            this.lowerWheat = false;
            this.handSend = `等待(${this.timer}s)`;
            this.timerFun = setInterval(() => {
              this.timer--;
              this.handSend = `等待(${this.timer}s)`;
              if (this.timer <= 0) {
                this.handSend = '举手上麦';
                window.clearInterval(this.timerFun);
                this.lowerWheat = true;
                this.cancelApply(false);
              }
            }, 1000);
          } else {
            this.$message.error(res.msg);
          }
        });
      } else {
        this.$fetch('cancelApplySpeakOn', {
          room_id: this.bizInfo.room_id
        }).then(res => {
          this.repeatStatus = false;
          if (res.code == 200) {
            this.lowerWheat = true; // 上麦的状态
            window.clearInterval(this.timerFun);
            this.handSend = '举手上麦';
            this.$message.success('您已取消申请上麦！');
          }
        });
      }
    },
    // 取消用户上麦
    cancelApply (timeouts) {
      this.$fetch('cancelApplySpeakOn', {
        room_id: this.bizInfo.room_id
      }).then(res => {
        if (res.code == 200) {
          this.lowerWheat = true; // 上麦的状态
          window.clearInterval(this.timerFun);
          this.handSend = '举手上麦';
          this.handShow = false;
          this.handDownShow = false;
          this.statusHand ? (this.handShow = true) : (this.handShow = false);
        }
      });
    },
    // 用户下麦
    downMic () {
      this.$fetch('speakOff', {
        room_id: this.bizInfo.room_id
      }).then(res => {
        if (res.code == 200) {
          // this.lowerWheat = true
          this.$message.success('下麦成功！');
          this.handSend = '举手上麦';
          this.handShow = false;
          this.handDownShow = false;
          this.statusHand ? (this.handShow = true) : (this.handShow = false);
        }
      });
    },
    videoPaly () {
      try {
        this.PopAlert.visible = false;
        const list = document.getElementsByTagName('video');
        if (this.poster != '') {
          this.poster = '';
        }
        for (let item of list) {
          item.play();
        }
      } catch (e) {}
    },
    streamendErrorPopupClose () {
      this.streamendErrorPopupVisible = false;
    },
    pushBarrage (txt) {
      this.$refs.vhallPlayer.addBarrage(txt);
    },
    selectGift () {
      
      this.showPayWay = true
    } 
  }
};
</script>
<style lang="less">
// 重构后。 观看端魔板样式
.vhall-saas-watchbox {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  .vhall-kick-out {
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

  &__mainContent {
    flex: 1;
    flex-direction: column;
    overflow: hidden;
    display: flex;
    .vhall-saas-substreams {
      max-height: 120px;
    }
    .el-loading-mask{
      z-index: 29 !important;
    }

    &__bigArea {
      flex: 1;
      // border-right: 1px solid #434343;
      overflow: hidden;
      // height: 100%;
      // position: relative;
      &-placeholder {
        height: 100%;
        box-sizing: border-box;
        padding-bottom: 46px;
      }
      & .embedvideo {
        padding-bottom: 0px !important;
      }
      &.video-only{
        position: relative;
      }
      &-watch-end {
        /* position: relative; */
        box-sizing: border-box;
        padding-bottom: 46px;
        /* width: 100%; */
        height: 100%;
        z-index: 100;
        background: url('https://t-alistatic01.e.vhall.com/static/images/interact/endcover.jpg?v=%2BrM3tCz1%2BRV%2BsxuP6fa7Bg%3D%3D')
          no-repeat;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10;
        h1 {
          /* position: absolute;
                    left: 0;
                    right: 0;
                    top: 0;
                    bottom: 0; */
          text-align: center;
          margin: auto;
          font-size: 24px;
          line-height: 80px;
          height: 80px;
          color: #fff;
          text-align: center;
          letter-spacing: 1px;
          width: 100%;
        }
      }
    }

    .vhall-saas-miniArea {
      position: absolute !important;
      right: 0 !important;
      top: 0 !important;
      width: 294px !important;
      height: 168px !important;
      z-index: 2;
    }
  }

  &__sideContent {
    width: 294px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: #434343;
    .vhall-saas-videobox {
      position: relative;
      height: 168px;
      width: 100%;
      .mask {
        opacity: 0;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.7);
        z-index: 10;
        display: none;
        align-items: center;
        justify-content: center;
        &:hover {
          opacity: 100;
        }
        p {
          width: 100%;
          color: #fff;
          text-align: center;
        }
        span {
          display: inline-block;
          text-align: right;
          width: 54px;
          margin-right: 10px;
          font-size: 12px;
        }
        a {
          display: inline-block;
          color: #fff;
          font-weight: 700;
          font-size: 12px;
          width: 32px;
          height: 32px;
          line-height: 32px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 100%;
          margin-right: 10px;
          &:hover {
            background: #fc5659;
          }
        }
      }
      .video-image {
        width: 100%;
        height: 100%;
      }
    }

    .vhall-saas-chatsbox {
      flex: 1;
      display: flex;
      flex-direction: column;
      &__tabs {
        border-bottom: 1px solid #2d2d2d;
        height: 32px;
        line-height: 32px;
        display: flex;
        &.invisible{
          border-bottom: none;
        }
        a {
          flex: 1;
          text-align: center;
          color: #ececec;
          font-size: 14px;
          position: relative;
          &.actived {
            color: #fff;
            &:after {
              content: ' ';
              display: block;
              height: 2px;
              width: 36px;
              position: absolute;
              background: #fc5659;
              bottom: 0;
              left: 50%;
              margin-left: -18px;
            }
          }
        }
      }

      &__content {
        flex: 1;
        box-sizing: border-box;
      }
    }
  }
  .upper-modal-body {
    background-color: #fff;
    text-align: center;
    p {
      padding: 27px 0px 0px 0px;
    }
    a {
      width: 100px;
      height: 35px;
      line-height: 33px;
      text-align: center;
      margin: 35px auto;
      display: inline-block;
      border-radius: 4px;
      border: 1px solid #fc5659;
      color: #fc5659;
      margin-left: 10px;
      &:hover {
        background-color: #fc5659;
        color: #fff;
      }
      &.v-cancle {
        border-color: #999;
        background-color: #fff;
        color: #999;
        &:hover {
          border-color: #fc5659;
          background-color: #fc5659;
          color: #fff;
        }
      }
    }
  }
  .visit-wrap-pop {
    border-top: 3px solid #fc5659;
    background-color: #fff;
    .recordboxHeader {
      position: relative;
      padding: 10px 20px;
      font-size: 14px;
      .iconguanbi1 {
        position: absolute;
        top: 10px;
        color: #666;
        font-size: 12px;
        right: 10px;
      }
    }
  }
}

.vhall-mainScreen {
  position: absolute !important;
  top: 120px !important;
  width: auto !important;
  height: auto !important;
  left: 0 !important;
  box-sizing: border-box !important;
  right: 294px !important;
  bottom: 46px !important;
  overflow: hidden !important;
}
</style>

<style lang="less" scoped>
.player-funct {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0px;
  z-index: 30;
  height: 46px;
  line-height: 46px;
  background: rgba(67, 67, 67, 1);
  color: #fff;
  font-size: 12px;
  &.video-only{
    right: 294px;
  }
  .player-share {
    font-size: 12px;
    float: left;
    margin-left: 21px;
    color: #ccc;
    cursor: pointer;

    .share-icon-text {
      margin-left: 6px;
      display: inline-block;
      vertical-align: middle;
    }
  }

  .player-hand {
    cursor: pointer;
    color: #fff;
    margin-left: 28%;
    width: 104px;
    height: 30px;
    line-height: 8px;
    text-align: center;
    background: rgba(252, 86, 89, 1);
    border-radius: 97px;
    margin-top: 9px;
    border: none;
    position: absolute;
    left: 50%;
    margin-left: -52px;
  }

  .player-active {
    float: right;
    margin-right: 20px;

    .table-lottery {
      float: right;
      margin-top: 7px;
      margin-right: 16px;
    }

    .table-gift,
    .table-redCoupon {
      float: right;
      margin-top: 7px;
      cursor: pointer;
    }
    .table-gift{
      width: 32px;
      height: 32px;
      img {
        width: 32px;
        height: 32px;
        cursor: pointer;
      }
    }
    .table-reward {
      width: 32px;
      height: 32px;
      margin: 7px 10px;
      img {
        width: 32px;
        height: 32px;
        cursor: pointer;
      }
      float: right;
    }

    .table-praise {
      float: right;
    }

    span:first-of-type {
      margin-right: 21px;
    }

    span:nth-of-type(2) {
      margin-right: 20px;
    }

    span:nth-of-type(3) {
      margin-right: 10px;
    }

    span:nth-of-type(4) {
      color: #ff3333;
    }
  }
}
.gifts-wrap{
  width: 100%;
  min-height: 330px;
  box-sizing: border-box;
  background: #fff;
  padding: 24px 50px 32px 50px;
}
.gifts-list{
  width: 100%;
  height: 320px;
  overflow-y: scroll;
  scrollbar-width: none; 
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }

  // background: red;
  &:after{
    clear: both;
  }
}
.gift-item{
  float: left;
  width: 242px;
  height: 90px;
  background: #F5F5F5;
  border-radius: 4px;
  margin-right: 12px;
  box-sizing: border-box;
  padding: 12px;
  margin-bottom: 12px;
  border: 2px solid #F5F5F5;
  &.active {
    border: 2px solid #FC5659;
  }
  &:hover{
    cursor: pointer;
  }
  .gift-cover{
    width: 66px;
    height: 66px;
    display:inline-block;
    margin-right: 12px;
    img{
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
  .gift-info{
    display: inline-block;
    vertical-align: top;
    font-size: 14px;
    color: #222222;
    box-sizing: border-box;
    padding: 10px 0px 0px 0px;
    .name, .price {
      display: block;
    }
    .name {
      display: inline-block;
      width: 120px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .price{
      margin-top: 6px;
      color: #FC5659;
    }
  }
}
.gifts-select{
  width: 100%;
  height: 34px;
  text-align: center;
  position: relative;
  margin-top: 10px;
  .sure-gift, .cancel-gift{
    color: #fff;
    display: inline-block;
    width: 80px;
    height: 34px;
    background: #FC5659;
    border-radius: 4px;
    border: 1px solid #F3545B;
    padding: 0px;
    margin: 0px;
    margin: 0px 6px;
    span{
      display: inline-block;
      width: 100%;
      height: 100%;
      text-align: center;
      line-height: 34px;
    }
  }
  .cancel-gift{
    color: #555555;
    background: #fff;
    border: 1px solid #888888;
  }
  .gift-ids{
    position: absolute;
    top: 0px;
    left: 0px;
    height: 100%;
    font-size: 14px;
    font-weight: 400;
    color: #222222;
    line-height: 34px;
  }
}
.pay-way{
  width: 100%;
  height: 200px;
  font-size: 20px;
  color: #555;
  background: #fff;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  span{
    margin: 0px 15px;
  }
}
.pay-img{
  width: 100%;
  height: 220px;
  background: #fff;
  margin: auto;
  img{
    margin: 20px 60px;
    width: 180px;
    height: 180px;
    display: inline-block;
  }
}
.pay-content{
  width: 100%;
  height: 300px;
  background: #fff;
  box-sizing: border-box;
  >div{
    width: 100%;
    padding-top: 40px;
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  span, .give-money-input{
    display: inline-block;
    width: 200px;
    height: 40px;
    background: #F5F5F5;
    border-radius: 6px;
    border: 1px solid #aaa;
    line-height: 40px;
    text-align: center;
    font-size: 16px;
    color: #555;
    margin: 0px 10px;
  }
  .give-money-input{
    outline: none;
    border:none;
  }
  .describe{
    width: 300px;
    margin: 0px auto;
  }
  .pay-method{
    padding-top: 20px;
  }
}
</style>
