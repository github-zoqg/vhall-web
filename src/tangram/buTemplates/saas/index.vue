<template>
  <div class="room-container cxs" :class="assistantType ? 'assistantStyle' : ''">
    <div class="main-wrap"
         :class="{'full-screen-doc':isDocFullscreen}"
         v-if="roomReady && !isKicked" ref="mainWrap">
      <div id="no-support-relogin">
        只支持用一个发起页发起直播，请使用第一次进入的发起页开始直播
      </div>

      <div v-if="!assistantType" class="vhall-header">
        <div class="vhall-header-left">
          <div class="vhall-room-name" :title="roomInfo.webinar.subject">
            {{ roomInfo.webinar.subject || '房间名称' }}
          </div>
          <div class="vhall-room-id-container">
            <div class="vhall-room-id-icon">ID</div>
            <div class="vhall-room-id">{{ ilId }}</div>
            <div class="vhall-room-id-copy" @click="doCopy">
              <i class="iconfont iconfuzhi"></i>
            </div>
          </div>
        </div>
        <div class="vhall-header-right">
          <div
            class="vhall-main-area-tools--doc-control"
            v-if="roomInfo.interact.room_id"
          ></div>
          <!-- {{permission}} -->
          <record
            v-auth="100020"
            @recordFun="recordFun"
            ref="recordRef"
            :cut_record_status="cut_record_status"
          ></record>
          <div
            class="vhall-room-connect vhall-room-operation non-selectable"
            style="width: 120px; margin-right: 20px"
            v-if="
              roomInfo.join_info.role_name == 4 &&
                status == 1 &&
                !isBanned &&
                envCheckResult
            "
            @click="applyMic()"
          >
            <span v-show="!isApplying && !applyWating"
              >申请上麦</span
            >
            <span v-show="applyWating">等待应答({{ applyTimerCount }}s)</span>
            <span v-show="isApplying">下麦</span>
          </div>
          <span class="non-selectable" v-if="envCheckResult || thirdPartyMobild">
            <div
              v-auth="100021"
              class="vhall-room-play vhall-room-operation stop"
              v-if="isPublishing && !stopping"
              @click="stop"
            >
              <span class="duration">{{ liveDuration || '初始化中' }}</span>
              <span class="stoptext">结束直播</span>
            </div>
            <div
              class="vhall-room-play vhall-room-operation"
              v-if="roomInfo.join_info.role_name == '1' && isPublishing && stopping"
            >
              正在结束...
            </div>
            <div
              class="vhall-room-play vhall-room-operation ly-cxs"
              v-if="roomInfo.join_info.role_name == '1' && !isPublishing && !starting"
              @click="push(1)"
            >
              开始直播
            </div>
            <div
              class="vhall-room-play vhall-room-operation"
              v-if="roomInfo.join_info.role_name == '1' && !isPublishing && starting && status != 1"
            >
              正在启动...
            </div>
            <!-- <div class="vhall-room-play vhall-room-operation"></div> -->
          </span>
          <span v-else-if="envChecked && !envCheckResult">
            <div
              class="vhall-room-play vhall-room-operation"
              @click="ReDetection"
              v-if="roomInfo.join_info.role_name != 3"
            >
              重新检测
            </div>
          </span>
          <div class="vhall-room-user-icon-contaier">
            <div
              class="vhall-room-user-icon-index"
              :style="
                userInfo.avatar
                  ? { 'background-image': `url(${userInfo.avatar})` }
                  : {}
              "
            >
              <i></i>
              <div class="vhall-user-frame" v-if="!(isEmbed && roleName == 3)">
                <div class="vhall-user-frame-head">
                  <span class="vhall-user-type">{{ roleMap[roleName] }}</span>
                  <span class="vhall-user-name">{{ userInfo.nickname }}</span>
                </div>
                <div class="vhall-user-frame-bottom">
                  <div
                    :class="{ disable: thirdPartyMobild || screensharing }"
                    v-if="
                      roomInfo.join_info.role_name == '1' || roomInfo.join_info.role_name == '4'
                    "
                    class="vhall-user-mediasetting"
                    :title="(screensharing || thirdPartyMobild) ? '桌面共享和第三方推流过程中不可用' : ''"
                    @click="openMediaSettings"
                  >
                    <i class="iconfont iconmeitishezhi"></i>
                    媒体设置
                  </div>
                  <div
                    v-if="
                      (roomInfo.join_info.role_name == '1' ||
                        roomInfo.join_info.role_name == '4') &&
                        permission.includes(100025) &&
                        !isEmbed
                    "
                    class="vhall-user-mediasetting"
                    :class="(status == 1 && !this.screensharing) ? '': 'disable'"
                    @click="split()"
                    :title="screensharing ? '桌面共享过程中不可用' : ''"
                  >
                    <i class="iconfont iconfenpingmoshi"></i>
                    {{ splitStatus == 2 ? '分屏' : '关闭分屏' }}
                  </div>
                  <div
                    class="vhall-user-quit"
                    v-show="roleName != '1' && !isEmbed"
                    @click="roleQuit"
                  >
                    <i class="iconjiaosetuichu iconfont"></i>
                    角色退出
                  </div>
                  <div
                    class="vhall-user-quit"
                    @click="thirdPartyShow"
                    v-if="thirdPartyBtn && !thirdPartyMobild"
                  >
                    <i class="icondisanfangfaqi iconfont"></i>
                    第三方发起
                  </div>
                  <div
                    class="vhall-user-quit"
                    @click="thirdPartyClose"
                    v-if="thirdPartyBtn && thirdPartyMobild"
                  >
                    <i class="icondisanfangfaqi iconfont"></i>
                    网页发起
                  </div>
                  <div class="vhall-user-quit" @click="openVirtualAudience" v-if="
                        permission.includes(100028)" :class="{ disable: !virtualAudienceCanUse }">
                    <i class="iconxuniguanzhong iconfont"></i>
                    虚拟观众
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="vhall-room-fullscreen" @click="fullscreen('body')">
            <i
              :class="
                isFullscreen
                  ? 'iconfont iconquanpingguanbi'
                  : 'iconfont iconquanping'
              "
            ></i>
          </div>
        </div>
      </div>
      <div
        id="vhall-main-area"
        class="vhall-main-area"
        :class="assistantType ? 'assistantStyle' : ''"
      >
        <div
          class="thirdParty-warp"
          v-if="!assistantType && thirdPartyMobild && NoDocShow && roleName != 3"
        >
          <thirdParty
            :roomId="roomInfo.interact.room_id"
            :vssToken="vssToken"
          ></thirdParty>
        </div>
        <div
          v-if="!assistantType || (assistantType && assistantType == 'doc')"
          class="vhall-main-area-tools"
          :class="assistantType == 'doc' ? 'assistantStyle' : ''"
        >
          <!-- 签到 -->
          <NewSignIn
            v-if="roomInfo.interact.room_id"
            ref="signin"
            :vss_token="vssToken"
            :room_id="roomInfo.interact.room_id"
            :masterEnd="true"
          ></NewSignIn>

          <!-- 转播 -->
          <popup
            :visible="rebroadcastVisible"
            :onClose="closeRebroadcast"
            :height="'470px'"
            :width="'830px'"
            :title="'转播'"
          >
          <!-- rebroadcastVisible -->
            <rebroadcast
              :visible="rebroadcastVisible"
              :webinar_id="ilId"
              @onClose="closeRebroadcast"
              :roomId="roomInfo.interact.room_id"
              :vssToken="vssToken"
              :status="status"
              ref="rebroadcast"
            ></rebroadcast>
          </popup>

          <!-- 问卷模块 -->
          <popup
            v-if="showQuestion"
            :visible="true"
            height="500px"
            width="830px"
            title="问卷"
            :onClose="closeQuestionarie"
          >
            <question
              :ilId="ilId"
              :roomId="roomInfo.interact.room_id"
              :appId="roomInfo.interact.paas_app_id"
              :accountId="roomInfo.webinar.userinfo.user_id"
              :accessToken="roomInfo.interact.paas_access_token"
              :isEmbed="isEmbed"
              :roleName="roomInfo.join_info.role_name"
              ref="questionarie"
            ></question>
          </popup>
          <!-- 问答 -->
          <popup
            :visible="qaVisible"
            :height="'196px'"
            :width="'270px'"
            :onClose="closeQAPopup"
            :title="'问答'"
          >
            <div v-if="!assistantType" class="vhall-qa-switch">
              <p v-if="!isQAEnabled">
                开启后，右侧互动区会增加“问答”模块，可进入右下角“问答管理”对观众提问进行处理。
              </p>
              <div v-if="!isQAEnabled" @click="enableQA">开启问答</div>
              <p v-if="isQAEnabled">
                该功能已开启，是否关闭？ 当前已收集问题：{{ qaCount }}个
              </p>
              <div v-if="isQAEnabled" @click="closeQA">关闭问答</div>
            </div>
            <div v-else class="vhall-qa-switch">
              <p v-if="!isQAEnabled">
                点击后打开“问答管理”页面，观众端显示“问答”。
              </p>
              <div v-if="!isQAEnabled" @click="enableQA">开启问答</div>
              <p v-if="isQAEnabled">
                问答关闭后，观众端将不能提问。 当前已收集问题：{{ qaCount }}个
              </p>
              <div v-if="isQAEnabled" @click="closeQA">关闭问答</div>
            </div>
          </popup>
          <!-- 发红包 -->
          <popup :visible="RedPacketVisible" :header-show="false">
            <redcoupon
              @onClose="closeRedPacketPopup"
              :roomId="roomInfo.interact.room_id"
              :vssToken="vssToken"
              :assistantType="assistantType"
            ></redcoupon>
          </popup>
          <!-- 红包未领取完 -->
          <popup :visible="hadEnvelopeVisible" :header-show="false">
            <hadEnvelope
              :room_id="roomInfo.interact.room_id"
              @onClose="closeRedPacketPopup"
              @ContinueSendRed="ContinueSendRed"
              @cancelSendRed="cancelSendRed"
            ></hadEnvelope>
          </popup>
          <!-- 分享 -->
          <popup
            :visible="shareVisible"
            :onClose="toggleShare"
            :background="'#E8E8E8'"
            :width="'438px'"
            :title="'分享'"
          >
            <share
              :url="shareUrl"
              :domains="domains"
              :shareId="shareId"
            ></share>
          </popup>

          <!-- 设备设置 -->
          <popup
            :visible="mediaSettingVisible"
            :onClose="closeMediaSettings"
            :title="'设置'"
            :width="'400px'"
          >
            <mediasettings
              v-if="!assistantType"
              :editorAble="mediaSettingVisible"
              :roleName="roleName"
              :isInteract="isInteract"
              :layout="layout"
              :vssToken="vssToken"
              :roomId="roomInfo.interact.room_id"
              :visible="mediaSettingVisible"
              :status="status"
              @close="closeMediaSettings"
              ref="mediasettingsRef"
            ></mediasettings>
          </popup>

          <!-- 虚拟观众 -->
          <popup
            :visible="virtualAudienceVisible"
            :onClose="closeVirtualAudience"
            :title="'虚拟观众'"
            :width="'500px'"
          >
            <virtualAudience
              :ilId="ilId"
              :params_verify_token="params_verify_token"
              @close="closeVirtualAudience"
              ref="virtualAudienceRef"
            ></virtualAudience>
          </popup>

          <!-- 文档-end -->
          <a
            v-show="rebroadcast == 'rebroadcastEnd' || !rebroadcast"
            href="javascript:;"
            :class="[
              'vhall-tools',
              'vhall-docs',
              isDocEnabled ? 'enabled' : '',
              doc_permission != roomInfo.join_info.third_party_user_id || screensharing
                ? 'disable'
                : ''
            ]"
            @click="showDoc"
            v-auth="100030"
          >
            <i class="iconfont iconwendang"></i>文档
          </a>
          <a
            v-show="rebroadcast == 'rebroadcastEnd' || !rebroadcast"
            href="javascript:;"
            :class="[
              'vhall-tools',
              'vhall-whiteboard',
              isWhiteBoardEnabled ? 'enabled' : '',
              doc_permission != roomInfo.join_info.third_party_user_id || screensharing
                ? 'disable'
                : ''
            ]"
            @click="showWhiteBoard"
          >
            <i class="iconfont iconbaiban"></i>白板
          </a>
          <a
            href="javascript:;"
            class="vhall-tools vhall-desktopshare"
            :class="{
              disable:
                thirdPartyMobild ||
                status != 1 ||
                doc_permission != roomInfo.join_info.third_party_user_id ||
                splited
                ,
              enabled: screensharing
            }"
            @click="shareScreen"
            v-show="layout != 2"
            v-if="roomInfo.join_info.role_name != 3"
          >
            <!-- 助理， 不能发起桌面共享 -->
            <i class="iconfont iconzhuomiangongxiang"></i>
            {{ this.screensharing ? '关闭共享' : '桌面共享' }}
          </a>
          <a
            href="javascript:;"
            class="vhall-tools vhall-interact"
            :class="{ disable: status != 1 }"
            v-auth="[100014,100022,100012,100016,100018,100027]"
          >
            <i class="iconfont iconhudonggongju"></i>互动工具
            <div
              class="vhall-interact-panel"
              :class="{ disabled: interacttools }"
              ref="interacttools"
            >
              <a
                v-auth="100014"
                class="vhall-tools vhall-luckydraw"
                @click="openLettery"
              >
                <i class="iconfont iconchoujiang"></i>抽奖
              </a>
              <a
                v-auth="100022"
                class="vhall-tools vhall-signin"
                @click="openSignIn"
              >
                <i class="iconfont iconqiandao"></i>签到
              </a>
              <a
                v-auth="100012"
                class="vhall-tools vhall-questionarie"
                @click="openQuestionarie"
              >
                <i class="iconfont iconwenjuan"></i>问卷
              </a>
              <a
                v-auth="100016"
                class="vhall-tools vhall-qa"
                @click="openQAPopup"
              >
                <i class="iconfont iconwenda"></i>问答
              </a>
              <a
                v-auth="100018"
                class="vhall-tools vhall-redpacket"
                @click="openRedPacketPopup"
              >
                <i class="iconfont iconhongbao"></i>红包
              </a>
              <a
                v-auth="100027"
                class="vhall-tools vhall-rebroadcast"
                @click="openRebroadcast"
              >
                <i class="iconfont iconzhuanbo"></i>转播
              </a>
            </div>
          </a>
          <a
            v-auth="100005"
            href="javascript:;"
            class="vhall-tools vhall-share"
            @click="toggleShare"
          >
            <i class="iconfont iconfenxiang"></i>分享
          </a>
        </div>

        <div class="vhall-main-area--content" ref="mainArea">
          <!-- 订阅流区域 -->
          <streams
            :style="roomInfo.join_info.role_name == 3 ? 'height: 0' : ''"
            v-if="!assistantType"
            v-show="rebroadcast == '' || rebroadcast == 'rebroadcastEnd'"
            :speakerList="speakerList"
            :accountId="roomInfo.join_info.third_party_user_id"
            :roomId="roomInfo.interact.room_id"
            :roleName="roomInfo.join_info.role_name"
            :isDocShow="isDocShow"
            :mainScreen="mainScreen"
            :miniElement="miniElement"
            :isInteract="isInteract"
            :splited="splited"
            :layout="layout"
          >
            <!-- 互动区域 -->

            <Interactive
              v-if="roomInfo.join_info.third_party_user_id && roomInfo.interact.paas_app_id && !thirdPartyMobild && splitStatus == 2 && speakerList"
              :mainScreen="mainScreen"
              :miniElement="miniElement"
              :isDocShow="isDocShow"
              :inavId="roomInfo.interact.inav_id"
              :roomId="roomInfo.interact.room_id"
              :appId="roomInfo.interact.paas_app_id"
              :accountId="roomInfo.join_info.third_party_user_id"
              :ownerId="roomInfo.webinar.userinfo.user_id"
              :nickName="userInfo.nickname"
              :token="roomInfo.interact.paas_access_token"
              :vssToken="vssToken"
              :speakerList="speakerList"
              :role="role"
              :roleName="roomInfo.join_info.role_name"
              :layout="layout"
              :status="status"
              :isInteract="isInteract"
              :splited="splited"
              :webinadId='ilId'
              ref="interactive"
            ></Interactive>
          </streams>
          <!-- 只有在直播中显示该播放器 -->
          <player
            v-if="status == 1 &&
              !assistantType &&
                ((roomInfo.interact.paas_access_token &&
                  rebroadcast != '' &&
                  rebroadcast != 'rebroadcastEnd') ||
                  roomInfo.join_info.role_name == 3)
            "
            :appId="roomInfo.interact.paas_app_id"
            :playerInfo="{disableDanmu: true, barrage: '1'}"
            :class="miniElement == 'video' ? 'vhall-miniBox' : ''"
            :accountId="roomInfo.join_info.third_party_user_id"
            :token="roomInfo.interact.paas_access_token"
            :type="'live'"
            :id="'xxx'"
            :liveOption="{ roomId: roomInfo.interact.room_id, type: 'flv' }"
            :isAudio="rebroadcastLayout == 2 || roomInfo.layout == 2"
            :vodControllerShow="true"
            :isMini="true"
            :docVisible="true"
            :exchangeVideoDoc="exchange"
            ref="vhallPlayer"
          ></player>
          <div
            class="vhall-saas-videobox vhall-miniBox"
            v-show="false"
          >
            <div class="mask">
              <p>
                <span>视图</span>
                <el-tooltip content="切换" placement="top">
                  <a
                    href="javascript:void(0);"
                    class="iconfont iconfuzhi"
                    @click="exchange()"
                  ></a>
                </el-tooltip>
                <el-tooltip
                  content="全屏"
                  placement="top"
                  v-show="miniElement == 'video'"
                >
                  <a
                    href="javascript:void(0);"
                    class="iconfont iconquanping"
                    @click="
                      () => {
                        this.$refs.vhallPlayer.toogleFullScreen()
                      }
                    "
                  ></a>
                </el-tooltip>
              </p>
            </div>
            <!-- <img v-show="videoSizeShow" class="video-image" src="../../assets/small.png" alt /> -->
          </div>
          <div
            id="vhall-document-container"
            class="vhall-document-container"
            :class="{'assistantStyle' : assistantType, 'assistant-plugin': assistantPlugin}"
             @mouseenter="assistantMouseEnter(true)"
             @mouseleave="assistantMouseEnter(false)"
          >
            <!-- 文档列表 -->
            <doc-list
              v-if="(!assistantType || (assistantType && assistantType == 'doc')) && doc_permission == roomInfo.join_info.third_party_user_id"
              :accountId="roomInfo.join_info.third_party_user_id"
              :isEnjoy="false"
              :roomId="roomInfo.interact.room_id"
              :webinar_id='webinar_id'
              :permission="permission"
              :vssToken="vssToken"
              :docLowPriority="docLowPriority"
              :domains="domains"
              ref="doclist"
            >
              <!-- <template slot="switchDoc">
              <span style="display:none"></span>
              </template>-->
              <!-- <template slot="chooseDoc">
              <span style="display:none"></span>
              </template>-->
            </doc-list>
            <!--清除文档、白板标注-->
            <SassAlert
              :visible="PopAlertClear.visible"
              @onClose="PopAlertCloseClear"
              @onCancel="PopAlertCloseClear"
              @onSubmit="PopAlertClearSubmit"
              :confirm="true"
            >
              <div slot="content">
                <span v-html="PopAlertClear.context"></span>
              </div>
            </SassAlert>
            <!-- 桌面共享显示区 -->
            <share-screen
              v-if="!assistantType && roomInfo.join_info.role_name != 3"
              :ownerId="roomInfo.webinar.userinfo.user_id"
              :mainScreen="mainScreen"
              :splited="splited"
              :accountId="roomInfo.join_info.third_party_user_id"
              :roleName="roomInfo.join_info.role_name"
              :class="miniElement == 'doc' ? 'vhall-miniBox vhall-saas-miniArea' : ''"
            ></share-screen>

            <!-- 文档区域 -->
            <doc
              :class="
                miniElement == 'doc' ? 'vhall-miniBox vhall-saas-miniArea' : ''
              "
              ref="doc"
              v-if="
                (!assistantType || (assistantType && assistantType == 'doc'))
              "
              :webinarId="ilId"
              :docPermissionId="doc_permission"
              :roleName="roomInfo.join_info.role_name"
              :room-id="roomInfo.interact.room_id"
              :channel-id="roomInfo.interact.channel_id"
              :appId="roomInfo.interact.paas_app_id"
              :token="roomInfo.interact.paas_access_token"
              :live-status="status"
              :accountId="roomInfo.join_info.third_party_user_id"
              :documentId="documentId"
              :rebroadcast="rebroadcast"
              :isInteract="isInteract"
              :disableAssistant="!permission.includes(100029)"
              :rebroadcastChannelId="rebroadcastChannelId"
            >
              <!-- 兼容轻享写法 -->
              <template
                slot="mainplaceholder"
                slot-scope="{ docContainerShow }"
              >
                <div
                  v-show="
                    !docContainerShow &&
                      (!rebroadcast || rebroadcast == 'rebroadcastEnd')
                  "
                  class="vhall-main-placeholder"
                >
                  <i class="iconfont iconweizhibozhanweitu"></i>
                  <span>可在此区域进行文档、白板演示等操作</span>
                </div>
                <div
                  v-show="rebroadcast && rebroadcast != 'rebroadcastEnd'"
                  class="vhall-main-placeholder"
                >
                  <i class="iconfont iconzanwuwendang"></i>
                  <span>转播中...</span>
                </div>
              </template>
              <!-- 兼容轻享写法 -->
              <!-- <template slot="watchControl">
              <span style="display:none"></span>
              </template>-->
              <!-- 缩略图 区域 -->
              <template slot="humbnailList" v-if="!isDocFullscreen">
                <!-- 展开缩略图区域 -->
                <div
                  v-show="!isWhiteBoardEnabled"
                  :class="
                    isThumbnailEnabled
                      ? 'document-thumbnail enabled'
                      : 'document-thumbnail'
                  "
                  title="文档缩略图"
                  @click="toggleThumbnail"
                >
                  <i class="iconfont iconsuolvetu"></i>
                </div>
                <div
                  :class="
                    isThumbnailEnabled
                      ? 'vhall-document-thumbnail-container visible'
                      : 'vhall-document-thumbnail-container'
                  "
                  ref="thumbnailList"
                >
                  <!--                <smooth-scrollbar>-->
                  <div class="vhall-document-thumbnail">
                    <div
                      v-for="(thumbnail, index) in documentThumbnailList"
                      :key="thumbnail"
                      @click="goToPage(index)"
                      :class="selectedDocumentPage == index ? 'selected' : ''"
                    >
                      <span>{{ index + 1 }}</span>
                      <ImageLoader :thumbnail="thumbnail" ></ImageLoader>
                    </div>
                  </div>
                  <!--                </smooth-scrollbar>-->
                </div>
              </template>

              <template slot="placeholder" slot-scope="{ docShowType }">
                <div v-show="!docShowType" class="vhall-document-placeholder">
                  <i class="iconfont iconzanwuwendang"></i>
                  <span>暂未分享任何文档</span>
                </div>
              </template>

              <!-- 画笔工具区 -->
              <template slot="pencilControlBar">
                <div v-if="roleName != 3" class="vhall-document-operationbar">
                  <div class="button-container">
                    <div
                      class="choose-document"
                      @click="chooseDocument"
                      v-show="!isWhiteBoardEnabled"
                      v-if="permission.includes(100030) || assistantType"
                    >
                      选择文档
                    </div>
                    <div class="audience-visible">
                      观众可见
                      <div
                        :class="
                          docVisibleToAudience
                            ? 'toggle-button enabled'
                            : 'toggle-button'
                        "
                        @click="toggleDocumenVisiblity(!docVisibleToAudience)"
                      >
                        <span></span>
                      </div>
                      <div class="alert" v-show="DocTipsAlert">
                        <div class="v-show-tips">
                          <div class="triangle_border_up"></div>
                          <span
                            class="iconfont iconguanbi1"
                            @click="closeDocTips"
                          ></span>
                          如果想让观众看到文档/白板内容， 必须开启“观众可见”开关
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="vhall-document-pencilbar">
                    <div
                      class="choose"
                      :class="{
                        active: docToolStatus.docToolActive == 'cancelDrawable'
                      }"
                      title="选择"
                      @click="handleControlBar('cancelDrawable')"
                    >
                      <i class="iconfont iconxuanze"></i>
                    </div>
                    <div
                      class="pencil"
                      :class="{ active: docToolStatus.docToolActive == 'hb' }"
                    >
                      <i
                        class="iconfont iconhuabi"
                        title="画笔"
                        @click.stop="handleControlBar('hb')"
                      ></i>
                      <span></span>
                      <div class="list-wrapper">
                        <div class="list-container">
                          <div class="size-list">
                            <div
                              v-for="size in sizeArr"
                              :key="size"
                              :title="size"
                              :class="{
                                active: docToolStatus.hb.width == size
                              }"
                              @click.stop="handleControlBar('hb', size)"
                            >
                              <i
                                class="iconfont iconhuabichicun"
                                :title="size"
                                :style="
                                  `font-size:12px;transform:scale(${size / 12})`
                                "
                              ></i>
                            </div>
                          </div>
                          <div class="color-list">
                            <div
                              v-for="color in colorArr"
                              :key="color.color"
                              :class="{
                                active: docToolStatus.hb.color == color.color
                              }"
                              :title="color.title"
                              @click.stop="handleControlBar('hb', color.color)"
                            >
                              <div
                                :style="`background-color:${color.color}`"
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="laserpointer"
                      :class="{ active: docToolStatus.docToolActive == 'ygb' }"
                      title="荧光笔"
                    >
                      <i
                        class="iconfont iconjiguangbi"
                        @click.stop="handleControlBar('ygb')"
                      ></i>
                      <span></span>
                      <div class="list-wrapper">
                        <div class="list-container">
                          <div class="size-list">
                            <div
                              v-for="size in sizeArr"
                              :key="size"
                              :title="size"
                              :class="{
                                active: docToolStatus.ygb.width == size
                              }"
                              @click.stop="handleControlBar('ygb', size)"
                            >
                              <i
                                class="iconfont iconhuabichicun"
                                :style="
                                  `font-size:12px;transform:scale(${size / 12})`
                                "
                              ></i>
                            </div>
                          </div>
                          <div class="color-list">
                            <div
                              v-for="color in colorArr"
                              :key="color.color"
                              :class="{
                                active: docToolStatus.ygb.color == color.color
                              }"
                              :title="color.title"
                              @click.stop="handleControlBar('ygb', color.color)"
                            >
                              <div
                                :style="`background-color:${color.color}`"
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="shape"
                      :class="{
                        active: docToolStatus.docToolActive == 'graph'
                      }"
                      title="形状"
                    >
                      <i
                        class="iconfont icontuxing"
                        @click.stop="handleControlBar('graph')"
                      ></i>
                      <span></span>

                      <div class="list-wrapper">
                        <div class="list-container">
                          <div class="size-list">
                            <div
                              v-for="shape in shapeArr"
                              :key="shape.value"
                              :title="shape.tex"
                              :class="{
                                active: docToolStatus.graph.value == shape.value
                              }"
                              @click.stop="
                                handleControlBar('graph', shape.value)
                              "
                            >
                              <i :class="shape.icon" style="font-size:16px"></i>
                            </div>
                          </div>
                          <div class="color-list">
                            <div
                              v-for="color in colorArr"
                              :key="color.color"
                              :title="color.title"
                              :class="{
                                active: docToolStatus.graph.color == color.color
                              }"
                              @click.stop="
                                handleControlBar('graph', color.color)
                              "
                            >
                              <div
                                :style="`background-color:${color.color}`"
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      class="font"
                      title="文字"
                      :class="{ active: docToolStatus.docToolActive == 'font' }"
                      @click.capture="handleControlBar('font')"
                    >
                      <i class="iconfont iconwenzi"></i>
                      <span></span>
                      <div class="list-wrapper">
                        <div class="list-container">
                          <div class="size-list">
                            <div
                              v-for="font in fontArr"
                              :key="font.value"
                              :title="font.label"
                              :class="{
                                active: docToolStatus.font.width == font.value
                              }"
                              @click.stop="handleControlBar('font', font.value)"
                            >
                              <i
                                :style="
                                  `font-size:${font.showSize}px;font-style:normal`
                                "
                                >{{ font.label }}</i
                              >
                            </div>
                          </div>
                          <div class="color-list">
                            <div
                              v-for="color in colorArr"
                              :key="color.color"
                              :title="color.title"
                              :class="{
                                active: docToolStatus.font.color == color.color
                              }"
                              @click.stop="
                                handleControlBar('font', color.color)
                              "
                            >
                              <div
                                :style="`background-color:${color.color}`"
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      class="eraser"
                      :class="{
                        active: docToolStatus.docToolActive == 'eraser'
                      }"
                      @click.stop="handleControlBar('eraser', false)"
                      title="橡皮擦"
                    >
                      <i class="iconfont iconxiangpica"></i>
                      <!--
                    <span></span>
                    <div class="list-wrapper">
                      <div
                        class="clear-everything"
                        @click.stop="handleControlBar('clear',false)"
                        title="清除"
                      >
                        <i class="iconfont iconqingkong"></i>
                      </div>
                    </div>
                      -->
                    </div>
                    <div
                      class="clear-everything"
                      :class="{
                        active: docToolStatus.docToolActive == 'clear'
                      }"
                      @click.stop="handleControlBar('clear', false)"
                      title="清除">
                      <i class="iconfont iconqingkong"></i>
                    </div>
                    <div
                      v-if="isDocFullscreen"
                      class="fullscreen-everything"
                      @click.stop="exitFullscreen('#vhall-document-container')"
                      title="退出全屏">
                      <i class="iconfont iconquanpingguanbi"></i>
                    </div>
                    <!-- <div class="undo" title="撤销">
                    <i class="iconfont iconchexiao"></i>
                  </div>
                  <div class="redo" title="重做">
                    <i class="iconfont iconzhongzuo"></i>
                    </div>-->
                  </div>
                  <div
                    v-if="!isDocFullscreen"
                    class="vhall-room-fullscreen" :class="[isWhiteBoardEnabled ? 'vhall-room-fullscreen-right' : '']"
                    @click.stop="enterFullscreen('#vhall-document-container')">
                    <div title="全屏">
                      <i class="iconfont iconquanping"></i>
                    </div>
                  </div>
                </div>
                <div v-if="roleName == 3" class="vhall-document-operationbar">
                </div>
              </template>
            </doc>
          </div>
        </div>
        <!-- 右侧聊天区域 -->
        <div
          v-if="!assistantType || (assistantType && assistantType == 'chat')"
          class="vhall-chats-box"
          :class="assistantType == 'chat' ? 'assistantStyle' : ''"
        >
          <div
            v-if="!assistantType"
            class="video-box"
            style="position: relative; overflow: hidden"
          >
            <img
              src="../../assets/thirdDefault.png"
              width="100%"
              height="100%"
              alt
              v-show="thirdPartyMobild && isPublishing"
            />
            <!-- 直播 - 占位区域 -->
          </div>
          <div
            class="chat-and-user-list"
            :class="assistantType == 'chat' ? 'assistantStyle' : ''"
          >
            <div v-if="!assistantType" class="chat-tabs list">
              <div class="chat-tabs-inner-box">
                <a
                  href="javascript:void(0);"
                  class="tabs"
                  :class="{ tabs__active: tabIndex == 0 }"
                  @click="changeTab(0)"
                >
                  聊天
                  <span class="tip" v-show="chatTip"></span>
                </a>

                <a
                  v-auth="100019"
                  href="javascript:void(0);"
                  class="tabs"
                  :class="{ tabs__active: tabIndex == 2 }"
                  @click="changeTab(2)"
                  >公告</a
                >
                <a
                  v-auth="100013"
                  href="javascript:void(0);"
                  class="tabs tip"
                  :class="{ tabs__active: tabIndex == 1 }"
                  @click="changeTab(1)"
                >
                  成员
                  <span class="tip" v-show="memberTip"></span>
                </a>
                <a
                  v-if="isQAEnabled"
                  href="javascript:void(0);"
                  class="tabs"
                  :class="{ tabs__active: tabIndex == 3 }"
                  @click="changeTab(3)"
                  >问答</a
                >
              </div>
            </div>
            <div
              class="tab-content"
              :class="assistantType == 'chat' ? 'assistantStyle' : ''"
              v-show="tabIndex == 0"
            >
              <chat-component
                ref="chat"
                @chatUpdata="chatUpdata"
                v-if="roomInfo.webinar.userinfo.user_id"
                :splited="splitStatus == 1"
                :appId="roomInfo.interact.paas_app_id"
                :channelId="roomInfo.interact.channel_id"
                :roleName="roomInfo.join_info.role_name"
                :roomId="roomInfo.interact.room_id"
                :userId="roomInfo.join_info.third_party_user_id"
                :vssToken="vssToken"
                :token="roomInfo.interact.paas_access_token"
                :isBanned="isBanned"
                :allBanned="allBanned"
                :webinarId="ilId"
                :plugin="chatPlugins"
                :chatFilterUrl="filterUrl"
              ></chat-component>
            </div>
            <div
              v-auth="100019"
              class="tab-content"
              v-if="!assistantType"
              v-show="tabIndex == 2"
            >
              <notice :roomId="roomInfo.interact.room_id" :channel_id='roomInfo.interact.channel_id'></notice>
            </div>
            <div
              v-auth="100013"
              class="tab-content"
              v-if="!assistantType"
              v-show="tabIndex == 1"
            >
              <saas-member
                ref="saasMember"
                @memberUpdata="memberUpdata"
                :speakerList="speakerList"
                :roomId="roomInfo.interact.room_id"
                :PorpAllowHandup="allowHandup"
                :docPermissionId="doc_permission"
                :userId="roomInfo.join_info.third_party_user_id"
                :roleName="roomInfo.join_info.role_name"
                :isInteract="isInteract"
                :status="status"
              ></saas-member>
            </div>
            <div
              class="tab-content"
              v-if="!assistantType"
              v-show="tabIndex == 3"
            >
              <qa
                :webinarId="ilId"
                :masterEnd="true"
                :roomId='roomId'
                :roleName='roleName'
                ref="qa"
                :isEmbed="isEmbed"
                :joinId="joinId"
              ></qa>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!assistantType">
        <!-- 嘉宾邀请弹框 -->
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
              <a href="javascript:;" class="v-comfirm" @click="AgreeUpper"
                >同意</a
              >
              <a href="javascript:;" @click="refuseUpper" class="v-cancle">
                不同意(
                <span class="v-times">{{ UpperTime }}</span
                >s)
              </a>
            </div>
          </div>
        </popup>
        <SassAlert
          :visible="PopAlert.visible"
          :confirm="PopAlert.confirm"
          @onClose="PopAlertClose"
          @onSubmit="PopAlertSubmit"
          @onCancel="PopAlertCancel"
        >
          <div slot="content">{{ PopAlert.context }}</div>
        </SassAlert>
        <SassAlert
          :visible="PopAlertTwo.visible"
          @onClose="PopAlertCloseTwo"
          @onCancel="PopAlertCloseTwo"
        >
          <div slot="content">
            <span v-html="PopAlertTwo.context"></span>
          </div>
        </SassAlert>
        <!-- 抽奖 -->
        <SassAlert
          :visible="PopAlertOffline.visible"
          :retry="'点击重试'"
          @onClose="PopAlertOfflineClose"
          @onSubmit="PopAlertOfflineConfirm"
        >
          <div slot="content">
            <span>网络异常导致互动房间连接失败</span>
          </div>
        </SassAlert>
        <SassAlert
          :visible="sharescreenPopupVisible"
          :confirm="true"
          @onClose="sharescreenPopupClose"
          @onCancel="sharescreenPopupClose"
          @onSubmit="sharescreenPopupConfirm"
        >
          <div slot="content">
            <div>请确认开启桌面共享</div>
            <div style="color:#fc5659;">为了体验更好，建议选择“您的整个屏幕”</div>
          </div>
        </SassAlert>
        <SassAlert
          :visible="popAlertCheckVisible"
          :confirm="true"
          :title="'设备检测'"
          :confirmText="'立即检测'"
          :cancelText="'暂不检测'"
          @onClose="popAlertCheckClose"
          @onSubmit="popAlertCheckSubmit"
          @onCancel="popAlertCheckClose"
        >
          <div slot="content">
            <span>为保证直播顺利进行，推荐在直播开始前进行设备检测</span>
          </div>
        </SassAlert>
        <SassAlert
          :visible="popAlertCheckConfirmVisible"
          :confirm="true"
          :confirmText="'立即检测'"
          :cancelText="'不检测'"
          @onClose="popAlertCheckConfirm"
          @onSubmit="popAlertCheckConfirmClose"
          @onCancel="popAlertCheckConfirm"
        >
          <div slot="content">
            <span>直播前取消设备检测，将会影响直播质量，确定不检测？</span>
          </div>
        </SassAlert>
        <media-check
          ref="mediaCheck"
          :roleName="roomInfo.join_info.role_name"
          :layout="layout"
        ></media-check>
        <SassAlert
          :visible="streamendErrorPopupVisible"
          @onClose="streamendErrorPopupClose"
          @onCancel="streamendErrorPopupClose"
        >
         <div slot="content">
            <span>{{`因设备问题导致${this.roomInfo.join_info.role_name== 1 ? '直播' : '连麦'}中断，请检查设备`}}</span>
          </div>
        </SassAlert>
        <SassAlert
          :visible="sharescreenErrorPopupVisible"
          @onClose="sharescreenErrorPopupClose"
          @onCancel="sharescreenErrorPopupClose"
        >
         <div slot="content">
            <span>请查看系统是否允许浏览器使用桌面共享功能</span>
          </div>
        </SassAlert>
      </div>
      <lottery
        v-if="!assistantType || (assistantType && assistantType == 'doc')"
        :roomId="roomInfo.interact.room_id"
        :vssToken="vssToken"
        ref="lotterySon"
      ></lottery>
    </div>
    <div class="vhall-kick-out" v-if="isKicked">
      <h1>您已被禁止访问房间！</h1>
    </div>
  </div>
</template>
<script>
import { findIndex } from 'lodash';
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel';
import moment from 'moment';
import ChatComponent from '../../libs/chat';
import Interactive from '../../libs/interactive';
import streams from '../../libs/interactive/remoteStreams';
import DocList from '../../libs/doc-list';
import Doc from '@/components/Doc';
// import this.$EventBus from '@/utils/Events';
import Mediasettings from '../../libs/media-settings';
import VirtualAudience from '../../libs/virtualAudience';
import Question from '../../libs/question/saas';
// import SignIn from '../../libs/saas-signin/index copy';
import NewSignIn from '../../libs/saas-signin';
import Popup from '../../libs/saas-popup';
import SassAlert from '../../libs/saas-popup/alert';
import Rebroadcast from '../../libs/rebroadcast';
import Qa from '../../libs/qa';
import checkMixin from '../../libs/envCheck';
import SaasMember from '../../libs/saas-member';
import lottery from '../../libs/lottery'; // 抽奖
import redcoupon from '../../libs/redcoupon'; // 发红包
import hadEnvelope from '../../libs/redcoupon/hadEnvelope'; // 发红包
import record from './record';
import share from '../../libs/share';
import notice from '../../libs/notice'; // 公告
import thirdParty from '../../libs/thirdParty'; // 第三方发起
import liveEnd from '../../libs/liveEnd'; // 直播结束
import jiabinMixin from './mixin/jiabin';
import start from './start';
import player from '../../libs/player/index'; // 直播结束
import shareScreen from '../../libs/desktopScreen';
import { assitantMixin } from './mixin/assitantMixin';
import WatchDoc from '@/components/Doc/watch-doc';
import ImageLoader from '../../components/ImageLoader';
import MediaCheck from '../../libs/mediaCheck';
import { session } from '../../libs/player/js/utils';
BScroll.use(ScrollBar);
BScroll.use(MouseWheel);
export default {
  name: 'vhallSaasBase',
  props: {
    shareId: {
      required: false
    },
    cut_record_status: {
      required: true
    },

    roomId: {
      required: true
    },

    ilId: {
      required: true
    },

    vssToken: {
      required: true
    },
    third_party_user_id: {
      required: true
    },
    params_verify_token: {
      required: true
    },
    qaStatus: {
      required: true,
      default: 0
    },
    saas_join_id: {
      required: true
    },
    recordFun: {
      required: true,
      default: () => {}
    },
    domains: {
      required: true
    },
    duration: {
      required: true,
      default: 0
    },
    permission: {
      required: true
    },
    isInteract: {
      required: true
    },
    documentId: {
      // 创建直播时上传的文档Id
      required: true
    },
    record_notice: {
      required: true
    },
    isEmbed: {
      required: false // 是否为嵌入页
    },
    joinId: {
      required: false
    },

    splitStatus: {
      required: false,
      default: 2
    },
    docLowPriority: {
      required: true
    },
    recordTip: {
      required: true
    },
    rootActive:{
      required: true
    },
    roomStatus: {
      required: true
    }},
  components: {
    SassAlert,
    hadEnvelope,
    Interactive,
    streams,
    DocList,
    Doc,
    ChatComponent,
    Mediasettings,
    VirtualAudience,
    Question,
    NewSignIn,
    Popup,
    Rebroadcast,
    Qa,
    SaasMember,
    lottery,
    redcoupon,
    record,
    share,
    notice,
    thirdParty,
    // liveEnd,
    player,
    shareScreen,
    // WatchDoc,
    ImageLoader,
    MediaCheck
  },

  mixins: [jiabinMixin, assitantMixin, checkMixin, start],

  data () {
    return {
      acxs: '7889999',
      chatTip: false,
      memberTip: false,
      assistantType: '',
      UpperTimerInter: null,
      UpperTime: 0,
      UpperVisible: false,
      DocTipsAlert: true, // 如果想让观众看到文档/白板内容， 必须开启“观看端显示”开关
      tooTimeFew: false,
      LiveEndMobild: false, // 结束弹框
      hadEnvelopeVisible: false, // 红包未领取完成
      thirdPartyBtn: false,
      thirdPartyMobild: false, // 第三方弹框
      NoDocShow: true,
      RedPacketVisible: false,
      roomReady: false,
      loadingStus: null,
      instance: null,
      role: 'MASTER',
      isPublishing: false,
      tabIndex: 0,
      inavId: '',
      channelId: '',
      appId: '',
      docStatus: true,
      isOpenDocument: '',
      userInfo: {},
      roomInfo: {},
      chatPlugins: {
        // image: true,
        emoji: true,
        audit: {
          show: this.permission.includes(100015) || this.permission.includes(100017),
          src: 'javascript:;'
        }
      },
      starting: false,
      stopping: false,
      interactOn: false,
      mediaSettingVisible: false,
      virtualAudienceVisible: false, // 虚拟观众弹窗显示隐藏
      rebroadcastVisible: false,
      webinar_id: this.ilId,
      qaVisible: false,
      qaCount: 0,
      isQAEnabled: false,
      isFullscreen: false,
      isDocFullscreen: false,
      isDocEnabled: false,
      isWhiteBoardEnabled: false,
      docVisibleToAudience: false,
      pencilColor: 'black',
      sizeArr: [4, 7, 10, 13],
      colorArr: [
        { color: '#FFFFFF', title: '白色' },
        { color: '#9B9B9B', title: '浅灰' },
        { color: '#2E3038', title: '深灰' },
        { color: '#000000', title: '黑色' },
        { color: '#FD2C0A', title: '红色' },
        { color: '#FF6E00', title: '橙色' },
        { color: '#FFD400', title: '黄色' },
        { color: '#98CD47', title: '绿色' },
        { color: '#01D6D1', title: '青色' },
        { color: '#0097F0', title: '蓝色' },
        { color: '#8B6DC2', title: '紫色' },
        { color: '#FF9B9E', title: '粉色' }
      ],
      fontArr: [
        { label: '小', value: 14, showSize: '12' },
        { label: '中', value: 18, showSize: '16' },
        { label: '大', value: 30, showSize: '18' },
        { label: '超', value: 48, showSize: '20' }
      ],
      shapeArr: [
        { tex: '圆形', value: 'setCircle', icon: 'iconfont iconyuanxing' },
        {
          tex: '四边形',
          value: 'setSquare',
          icon: 'iconfont iconzhengfangxing'
        },
        {
          tex: '单向箭头',
          value: 'setSingleArrow',
          icon: 'iconfont iconjiantou'
        },
        {
          tex: '双向箭头',
          value: 'setDoubleArrow',
          icon: 'iconfont iconshuangjiantou'
        }
      ],
      documentThumbnailList: [],
      isThumbnailEnabled: false,
      selectedDocumentPage: 0,
      shareVisible: false,
      showQuestion: false,
      shareUrl: '',
      roleName: '1',
      speakerList: null, // 上麦列表
      liveDuration: '',
      durationInterval: null,
      localDuration: 0,
      allowHandup: false, // 当前房间是否允许举手
      roleMap: {
        1: '主持人',
        2: '观众',
        3: '助理',
        4: '嘉宾'
      },

      envCheckResult: true, // false  先修改
      envChecked: false,
      isDocShow: true,
      mainScreen: '',
      isBanned: false, // 是否被禁言
      allBanned: false, // 是否全体禁言
      status: 0, // 直播状态
      rebroadcast: '', // 转播状态 值为truthy并等于后台返回的直播中'rebroadcastingroomid'的时候表示直播中，值为'rebroadcastend'的时候转播结束但是在直播中，falsy的时候非转播
      doc_permission: '',
      screensharing: false, // 桌面共享状态
      interacttools: true, // 嘉宾互动列表权限全禁用时隐藏互工具列表
      PopAlert: {
        context: '',
        visible: false,
        confirm: false,
        resId: ''
      },
      PopAlertTwo: {
        context: '',
        visible: false
      },
      PopAlertClear: {
        context: '',
        visible: false
      },
      PopAlertOffline: {
        visible: false
      },
      sharescreenPopupVisible: false,
      lockStreamPlay: true,

      miniElement: 'video', // video,  doc  小屏 - 元素
      docToolStatus: {
        docToolActive: '',
        hb: {
          width: 7,
          color: '#FD2C0A'
        },
        ygb: {
          width: 7,
          color: '#FD2C0A'
        },
        graph: {
          color: '#FD2C0A',
          value: 'setCircle'
        },
        font: {
          width: '18',
          color: '#FD2C0A'
        }
      },
      disX: 0,
      disY: 0,
      rebroadcastLayout: null, // 转播活动类型
      isKicked: false,
      filterUrl: '', // 聊天审核过滤地址
      virtualAudienceCanUse: false,
      startType: '', // 直播发起类型
      shadowDisconnected: false, // 分屏页面关闭时的状态，立刻生效，分屏关闭完成以后恢复
      rebroadcastChannelId: '', // 转播channelId
      popAlertCheckVisible: false, // 媒体检测弹框
      popAlertCheckConfirmVisible: false, // 媒体检测确认弹框
      streamendErrorPopupVisible: false, // stream-end事件提示
      sharescreenErrorPopupVisible: false, // 桌面共享权限未允许
      assistantPlugin: true // 客户端互动工具嵌入页
    };
  },

  // watch: {

  // },
  computed: {
    splited () {
      return this.splitStatus == 1;
    }
  },

  provide () {
    return {
      docToolStatus: this.docToolStatus
    };
  },
  created () {
    this.$loadingStus = this.$loading({
      background: '#2d2d2d' });
    if (sessionStorage.getItem(this.$route.params.il_id)) {
      this.DocTipsAlert = false;
    }
    this.assistantType = this.$route.query.assistantType;
    this.assistantPlugin = this.$route.query.plugin;
    console.log('=======this.assistantType======', this.assistantType, this.permission);
  },

  mounted () {
    window.saasindex = this;
    this.getInavInfo();
    console.warn(this.domains, '图片地址   ***********************');
    this.shareUrl = this.domains.custom ? `${this.domains.custom}/v3/live/watch/${this.ilId}` : `https:${this.domains.web_url}live/watch/${this.ilId}`;
    this.localDuration = this.duration;
    setTimeout(() => {
      this.interacttools = this.$refs['interacttools'] && this.$refs['interacttools'].childElementCount == 0;
      if (!this.isWhiteBoardEnabled && (this.permission.includes(100030) || this.assistantType)) {
        this.isDocEnabled = true;
        this.$refs.doc && this.$refs.doc.toggleDocContainer(true);
        this.$refs.doc && this.$refs.doc.toggleBoard(false);
        this.isWhiteBoardEnabled = false;
        this.$refs.doc && this.$refs.doc.$el.focus();
        this.$refs.doc && this.$refs.doc.$el.click();
        this.$nextTick(() => {
          // 手动触发window resize 事件
          const resizeEvent = new Event('resize');
          window.dispatchEvent(resizeEvent);
        });
      }

      if (!this.permission.includes(100030) && !this.assistantType) {
        this.isWhiteBoardEnabled = true;
        this.$refs.doc && this.$refs.doc.toggleBoard(true);
        this.$refs.doc && this.$refs.doc.toggleDocContainer(true);
        this.isDocEnabled = false;

        this.$nextTick(() => {
          // 手动触发window resize 事件
          const resizeEvent = new Event('resize');
          window.dispatchEvent(resizeEvent);
        });
      }

      if (!this.assistantType) {
        this.$refs['mainArea'] && (this.$refs['mainArea'].style.zIndex = 1);
      }
    }, 2000);
    this.$EventBus.$emit('permission', this.permission);
    this.initThirdPermis();
    const setFullscreen = () => {
      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullscreenElement;
      console.warn('fullscreenElement--', fullscreenElement);
      if (fullscreenElement) {} else {
        this.isFullscreen = false;
        this.isDocFullscreen = false;
        this.moveTool();
      }
      this.$nextTick(() => {
        // 手动触发window resize 事件
        const resizeEvent = new Event('resize');
        window.dispatchEvent(resizeEvent);
      });
    };
    window.addEventListener(
      'fullscreenchange',
      setFullscreen,
      true
    );
    window.addEventListener(
      'webkitfullscreenchange',
      setFullscreen,
      true
    );
    this.stopKeyPropagation();
    this.$EventBus.$on('live_start', () => {
      this.$EventBus.$emit('startLive');
      this.status = 1; // 开始直播变更直播状态
      this.virtualAudienceCanUse = true;
      if (this.roleName == 3 && !this.assistantType) {
        this.autoPlay();
      }
    });
    this.$EventBus.$on('live_over', () => {
      this.status = 2; // 开始直播变更直播状态
      this.documentThumbnailList = [];
      this.isThumbnailEnabled = false;
      this.$emit('endSplit');
      this.virtualAudienceCanUse = false;
      this.isDocEnabled = true;
      this.isWhiteBoardEnabled = false;
      // 结束直播时当前主讲人不是主持人， 就设置为主持人
      if (this.doc_permission != this.roomInfo.webinar.userinfo.user_id) {
        this.doc_permission = this.roomInfo.webinar.userinfo.user_id;
      }
      // 结束直播时 更新当前 speakerList
      this.speakerList = this.speakerList.filter(item => {
        return item.account_id == this.roomInfo.webinar.userinfo.user_id;
      });
      this.$refs.mediasettingsRef.selectedRate = '';
      sessionStorage.setItem('speakerDefinition', '');
      sessionStorage.setItem('selectedRate', '');
      // 结束直播时如果问答是开启状态，发起关闭问答接口
      if (this.isQAEnabled && this.roomInfo.join_info.role_name == 1) {
        this.enableQA(1);
      }
      window.clearInterval(this.durationInterval);
      this.isPublishing = false;
      this.starting = false;
      this.stopping = false;
      this.liveDuration = '';
      if (this.roomInfo.join_info.role_name == 4) {
        sessionStorage.setItem(`MEDIACHECK_FINISH_${this.roomInfo.interact.room_id}`, '');
      }
      if (this.roomInfo.join_info.role_name == 4 || this.roomInfo.join_info.role_name == 3) {
        this.$message.warning('直播已结束');
      }
    });
    this.$EventBus.$on('startLive', () => {
      this.calculateLiveDuration(1);
      this.isPublishing = true;
      this.starting = false;
      this.stopping = false;
      this.LiveEndMobild = false;
      this.status = 1; // 开始直播变更直播状态
    });
    this.$EventBus.$on('endLive', () => {
      console.log('jiesuzhibo>>>>>>>>>>>>>>>>>>>>>');
      window.clearInterval(this.durationInterval);
      this.isPublishing = false;
      this.starting = false;
      this.stopping = false;
      this.status = 2; // 结束直播变更直播状态
      sessionStorage.removeItem(this.$route.params.il_id, 'true'); // 删除doc提示框
      this.$refs.recordRef.stop(); // 停止录制
      try {
        this.$refs.interactive.exchangeDoc();
      } catch (e) {
        console.log(e);
      }
      if (this.localDuration < 30) {
        const sr = this.layout != 2 ? '视频' : '音频';
        // this.$alert(`${sr}时长过短，不支持生成回放`, '提示', {
        //   confirmButtonText: '知道了'
        // })
        this.PopAlert.context = `${sr}时长过短，不支持生成回放`;
        this.PopAlert.visible = true;
        this.PopAlert.confirm = false;

        this.LiveEndMobild = true;
        this.tooTimeFew = true;
      } else {
        this.$vhallFetch('createRecord', {
          params_verify_token: this.params_verify_token,
          user_id: this.third_party_user_id,
          webinar_id: this.ilId
        })
          .then(res => {
            this.LiveEndMobild = true;
            this.tooTimeFew = false;
            this.PopAlert.context = `自动生成回放成功，是否设置为默认回放？`;
            this.recordTip == '1' && (this.PopAlert.visible = true);
            this.PopAlert.confirm = true;
            this.PopAlert.resId = res.data.id;
          });
      }
      this.localDuration = 0;
      this.liveDuration = '';
    });
    this.$EventBus.$on('_endLive', () => {
      clearTimeout(this._endLiveTimer);
      this._endLiveTimer = setTimeout(() => {
        window.clearInterval(this.durationInterval);
        this.isPublishing = false;
        this.starting = false;
        this.stopping = false;
        this.status = 2; // 结束直播变更直播状态
        sessionStorage.removeItem(this.$route.params.il_id, 'true'); // 删除doc提示框
        this.liveDuration = '';
      }, 1000);
    });
    this.$EventBus.$on('docInfo', docInfo => {
      console.log('docInfo', docInfo);
      if (docInfo.docShowType == 'document' || !docInfo.docShowType) {
        this.isDocEnabled = true;
        this.isWhiteBoardEnabled = false;
      } else if (docInfo.docShowType == 'board') {
        this.isWhiteBoardEnabled = true;
        this.$EventBus.$emit('doc_loaded', 2);
        this.isDocEnabled = false;
        this.isThumbnailEnabled = false;
      }
      if (docInfo.docContainerShow) {
        this.NoDocShow = false;
      }
      this.docVisibleToAudience = docInfo.showInWatch;
      if (
        this.isDocEnabled &&
        this.doc_permission == this.roomInfo.join_info.third_party_user_id &&
        this.status != 2 && this.permission.includes(100030)
      ) {
        this.$nextTick(() => {
          const docThumbnails = this.$refs.doc.getThumibnailList() || [];
          this.documentThumbnailList = docThumbnails[0] ? docThumbnails[0].list : [];
          this.scrollInitDocMin();
        });
      }
      if (this.status == 2) {
        this.documentThumbnailList = [];
        this.isThumbnailEnabled = false;
      }
    });
    this.$EventBus.$on('documenet_load_complete', e => {
      this.documentThumbnailList = e;
      this.scrollInitDocMin();
      this.scrollThumbnailList && this.scrollThumbnailList.scrollTo && this.scrollThumbnailList.scrollTo(0, 0);
      if (!e.length) {
        this.isThumbnailEnabled = false;
      }
    });

    this.$EventBus.$on('remote_doc_select', e => {
      // 初始化工具画笔颜色
      this.handleControlBar('ygb', '#FD2C0A');
      this.handleControlBar('font', '#FD2C0A');
      this.handleControlBar('graph', '#FD2C0A');
      this.handleControlBar('hb', '#FD2C0A');
      // 设置工具条默认选中“选择”功能
      this.$nextTick(() => {
        this.handleControlBar('cancelDrawable');
        // hack：sdk底层异步操作，导致不能同步生效兼容代码
        let count = 0;
        if (this.temInterval) {
          clearInterval(this.temInterval);
          this.temInterval = null;
        }
        this.temInterval = setInterval(() => {
          if (count >= 10) {
            clearInterval(this.temInterval);
            this.temInterval = null;
          }
          this.handleControlBar('cancelDrawable');
          count++;
        }, 200);
      });
    });

    this.$EventBus.$on('PAGE_CHANGE', (index) => {
      this.selectedDocumentPage = index;
    });

    this.$EventBus.$on('demonstration', e => {
      this.isThumbnailEnabled = false;
    });

    this.$EventBus.$on('deviceSuccess', e => {
      console.log('devicesucces', e);
      if (e.type == 'deviceCheck') {
        console.log('设备检测结果', e, this.status, this.assistantType);
        if (this.layout == 2) {
          this.envChecked = true;
          this.envCheckResult = (e.audio && this.roleName == 1) || (e.audio && e.video); // 只要有音频设备 设备检测通过
          if (!this.envCheckResult) {
            this.$message({
              type: 'error',
              message: '发起直播前，请先允许访问麦克风'
            });
          }
        } else {
          this.envChecked = true;
          this.envCheckResult = e.audio && e.video;
          if (!this.envCheckResult) {
            this.$message({
              type: 'error',
              message: '发起直播前，请先允许访问摄像头和麦克风'
            });
          }
        }
      }
    });

    this.$EventBus.$on('rebroadcastStart', e => {
      this.rebroadcastLayout = e.layout;
      const interactive = this.$refs.interactive;
      window.interactive = interactive;
      this.rebroadcastChannelId = e.channelId;
      interactive.$streamStop();
      window.setTimeout(() => {
        this.rebroadcast = e.sourceRoomId;
      }, 100);
    });

    this.$EventBus.$on('rebroadcastPushStream', data => {
      const interactive = this.$refs.interactive;
      interactive.$streamPush();
      this.rebroadcast = '';
      this.rebroadcastChannelId = '';
    });
    this.$EventBus.$on('rebroadcastStop', e => {
      console.log('rebroadcastStop');
      this.rebroadcastChannelId = '';
      setTimeout(() => {
        const interactive = this.$refs.interactive;
        if (e.localStream) {
          // 关闭转播同时开启本地流
          this.rebroadcast = '';
          interactive.$streamPush();
        } else {
          this.rebroadcast = 'rebroadcastEnd';
        }
      }, 2000);
    });

    this.$EventBus.$on('vrtc_speaker_switch', msg => {
      if (
        this.roomInfo.join_info.third_party_user_id == msg.room_join_id &&
        this.roomInfo.webinar.userinfo.user_id == this.roomInfo.join_info.third_party_user_id
      ) {
        // 主持人被设置成为主讲人。 自动跳过提示
        this.docVisibleToAudience = this.docVisibleToAudience;
      } else {
        setTimeout(() => {
          const reszieEvent = new Event('resize');
          window.dispatchEvent(reszieEvent);
          // this.$refs.doc.resize()
        }, 1000);
        this.$message.success(`${msg.nick_name}设置成为主讲人`);
      }
    });

    this.$EventBus.$on('vrtc_connect_apply', msg => {
      console.log('申请上麦消息', msg);

      let role = '';
      if (msg.room_role == 2) {
        return;
      } else if (msg.room_role == 4) {
        role = '嘉宾';
      }

      if (this.roomInfo.join_info.role_name == 1) {
        this.$message({
          message: `收到 ${role} [${msg.nick_name}] 的上麦申请`,
          type: 'success'
        });
      }
    });

    this.$EventBus.$on('sharescreenstart', e => {
      this.screensharing = true;

      // 桌面共享开启并且白板或者文档观众可见状态时观看端视频最大化
      if (
        (this.isWhiteBoardEnabled || this.isDocEnabled) &&
        this.docVisibleToAudience
      ) {
        this.$vhallFetch('setDesktop', {
          room_id: this.roomInfo.interact.room_id,
          status: '1'
        });
      }
    });

    this.$EventBus.$on('sharescreenstop', e => {
      this.screensharing = false;

      // 桌面共享开启并且白板或者文档观众可见状态时观看端视频最小化
      if (
        (this.isWhiteBoardEnabled || this.isDocEnabled) &&
        this.docVisibleToAudience
      ) {
        this.$vhallFetch('setDesktop', {
          room_id: this.roomInfo.interact.room_id,
          status: '0'
        });
      }
    });

    // 动态切换布局 --
    this.$EventBus.$on('vhallLayoutExchange', value => {
      this.miniElement = value;
    });

    // 结束直播清空上麦列表
    this.$EventBus.$on('live_over', msg => {
      this.speakerList = this.speakerList.filter(item => {
        return item.account_id == this.roomInfo.webinar.userinfo.user_id;
      });
    });

    // 手动维护在线上麦人员列表 - 上线
    this.$EventBus.$on('vrtc_connect_success', e => {
      console.log('用户上麦了12', e);
      let check = findIndex(this.speakerList, item => {
        return item.account_id == e.data.room_join_id;
      });
      console.warn('test----check-----', check);
      if (check < 0) {
        this.speakerList.push({
          account_id: e.data.room_join_id,
          audio: e.data.vrtc_audio_status == 'on' ? 1 : 0,
          nick_name: e.data.nick_name,
          role_name: Number(e.data.room_role),
          video: e.data.vrtc_video_status == 'on' ? 1 : 0
        });
        console.warn('test----this.speakerList-----', this.speakerList);
      }
    });

    // 手动维护在线上麦人员列表 - 下线
    this.$EventBus.$on('vrtc_disconnect_success', e => {
      console.log('手动维护在线上麦人员列表 - 下线', e);

      console.log('下麦用户ID', e.target_id);
      e.data.target_id &&
        (this.speakerList = this.speakerList.filter(item => {
          return item.account_id != e.target_id;
        }));
    });

    // 互动设置主讲人
    this.$EventBus.$on('vrtc_speaker_switch', msg => {
      this.doc_permission = msg.room_join_id;
      if (this.isWhiteBoardEnabled) {
        this.isThumbnailEnabled = false;
      }
    });

    // 解决-- 分屏恢复的问题
    // 视频禁用
    this.$EventBus.$on('vrtc_frames_forbid', e => {
      this.speakerList = this.speakerList.map((item) => {
        return {
          ...item,
          video: item.account_id == e.room_join_id ? 0 : item.video
        };
      });

      // if (this.accountId == e.room_join_id) {
      //   this.videoStatus = true

      //   // this.$EventBus.$emit('sendCmdToShadow', e)
      // }
    });

    // 视频取消禁用
    this.$EventBus.$on('vrtc_frames_display', e => {
      this.speakerList = this.speakerList.map((item) => {
        return {
          ...item,
          video: item.account_id == e.room_join_id ? 1 : item.video
        };
      });
    });

    // 音频禁用
    this.$EventBus.$on('vrtc_mute', e => {
      this.speakerList = this.speakerList.map((item) => {
        return {
          ...item,
          audio: item.account_id == e.room_join_id ? 0 : item.audio
        };
      });
    });

    // 音频取消禁用
    this.$EventBus.$on('vrtc_mute_cancel', e => {
      this.speakerList = this.speakerList.map((item) => {
        return {
          ...item,
          audio: item.account_id == e.room_join_id ? 1 : item.audio
        };
      });
    });

    // 摄像头清晰度设置
    this.$EventBus.$on('vrtc_definition_set', e => {
      if (e.vrtc_definition) {
        sessionStorage.setItem('speakerDefinition', e.vrtc_definition || '');
      }
    });

    // 桌面共享清晰度设置
    this.$EventBus.$on('vrtc_screen_definition_set', e => {
      if (e.vrtc_screen_definition) {
        sessionStorage.setItem('screenDefinition', e.vrtc_screen_definition || '');
      }
    });

    // 在线人数
    this.$EventBus.$on('Join', msg => {
      if (this.status == 1) {
        this.$EventBus.$emit('onlineJoin', msg);
      }
    });

    // 在线人数
    this.$EventBus.$on('Leave', msg => {
      if (this.status == 1) {
        this.$EventBus.$emit('onlineLeave', msg);
      }
    });

    // 分屏页面关闭事件
    this.$EventBus.$on('INTERACT_SHADOW_CLOSE', msg => {
      this.miniElement = 'video'; // 解决17566 【H5互动】主画面切换到文档区，点击分屏，结束分屏后，主持人自动下麦，画面黑屏
      this.$nextTick(() => {
        const resizeEvent = new Event('resize');
        window.dispatchEvent(resizeEvent);
      });
      this.shadowDisconnected = true;
    });
    // 桌面共享确认弹出框
    this.$EventBus.$on('sharescreenconfirm', msg => {
      this.sharescreenPopupVisible = true;
    });
    // 房间链接出错事件
    this.$EventBus.$on('EVENT_ROOM_EXCDISCONNECTED', (e) => {
      console.log(e, 'EVENT_ROOM_EXCDISCONNECTED');
      this.PopAlertOffline.visible = true;
    });
    // 房间链接出错事件
    this.$EventBus.$on('MEDIACHECK_FINISH', (e) => {
      sessionStorage.setItem(`MEDIACHECK_FINISH_${this.roomInfo.interact.room_id}`, 'yes');
      sessionStorage.setItem('selectedVideoDeviceId', e.selectedVideoDeviceId || '');
      sessionStorage.setItem('selectedAudioDeviceId', e.selectedAudioDeviceId || '');
    });

    // 业务端上麦成功后推流失败错误
    this.$EventBus.$on('STREAM_PUSH_ERROR', (e) => {
      console.log(e, 'STREAM_PUSH_ERROR');
      if (e.data.error.msg.name == 'NotAllowedError') {
        this.$message.error('设备被禁用导致上麦失败，请检查设备!');
      } else {
        this.$message.error('因设备问题导致上麦失败，请检查设备!');
      }
    });
    // 设备问题引起的本地流结束事件
    this.$EventBus.$on('EVENT_STREAM_END_ERROR', () => {
      this.streamendErrorPopupVisible = true;
    });
    // 桌面共享失败抛错
    this.$EventBus.$on('SHARESCREEN_ACCESS_DENIED', () => {
      this.sharescreenErrorPopupVisible = true;
    });
    // 弱网情况重新推流http://wiki.vhallops.com/pages/viewpage.action?pageId=119177504
    this.$EventBus.$on('EVENT_LOCALSTREAM_FAILED', (e) => {
      console.log(e, 'EVENT_LOCALSTREAM_FAILED');
      this.$message.warning('因网络问题推流失败，正在重新推流');
    });
    // 弱网情况重新订阅http://wiki.vhallops.com/pages/viewpage.action?pageId=119177504
    this.$EventBus.$on('EVENT_REMOTESTREAM_FAILED', (e) => {
      console.log(e, 'EVENT_REMOTESTREAM_FAILED');
      if (e.isSharescreen) {
        this.$message.warning(`因网络问题订阅桌面共享失败，正在重新订阅`);
      } else {
        this.$message.warning(`因网络问题订阅用户[${e.nickName}]失败，正在重新订阅`);
      }
    });
    // 设置主讲人失败
    this.$EventBus.$on('BIGSCREENSET_FAILED', () => {
      this.$message.error('设置主讲人失败，请刷新后重试');
    });
    // EVENT_STREAM_STUNK事件
    this.$EventBus.$on('EVENT_STREAM_STUNK', (e) => {
      console.log(e, 'EVENT_STREAM_STUNK');
      this.$message.warning('互动流编码异常，正在重新推流');
    });
    // 文档列表组件触发演示文档事件
    this.$EventBus.$on('demonstration', data => {
      this.docVisibleToAudience = data.docVisibleToAudience;
    });
    let vhallDomain = window.sessionStorage.getItem('vhall_domain');
    if (vhallDomain) {
      vhallDomain = JSON.parse(vhallDomain);
      const base = (process.env.VUE_APP_NODE_ENV === 'production' || process.env.VUE_APP_NODE_ENV === 'test') ? '/v3/' : '/'
      this.filterUrl = `${base}live/authchat/${this.ilId}`
      // this.filterUrl =
      //   (this.$route.query.assistantType ? 'http:' : 'https:') +
      //   `${vhallDomain.web}/room/authchat/${this.ilId}`;
    } else {
      console.error('聊天过滤地址没有localStorage的vhall_domain');
    }

  },
  watch: {
    roomId (newVal) {
      this.getInavInfo();
      this.shareUrl = this.domains.custom
        ? `${this.domains.custom}/v3/live/watch/${this.ilId}`
        : `https:${this.domains.web_url}live/watch/${this.ilId}`;
      this.localDuration = this.duration;
      setTimeout(() => {
        this.interacttools =
          this.$refs['interacttools'] &&
          this.$refs['interacttools'].childElementCount == 0;
      }, 1000);
    },
    permission (newval) {
      this.$EventBus.$emit('permission', newval);
      this.initThirdPermis();
    },
    splitStatus (value) {
      // 结束分屏时， 自动更新 上麦列表
      this.speakerList = [];
      this.$nextTick(() => {
        this.getRoomStatus();
      });
      if (value == 2) {
        clearTimeout(this.disconnectTimer);
        this.disconnectTimer = setTimeout(() => {
          this.shadowDisconnected = false;
        }, 4000);
      }
    }
  },
  methods: {

    // 开启分屏
    split () {
      if (this.screensharing) {
        return;
      }

      if ((this.isPublishing || this.status == 1) && this.isPublishing) {
        this.miniElement = 'video'; // 解决17566 【H5互动】主画面切换到文档区，点击分屏，结束分屏后，主持人自动下麦，画面黑屏
        this.$nextTick(() => {
          const resizeEvent = new Event('resize');
          window.dispatchEvent(resizeEvent);
        });
        if (this.splitStatus == 2) {
          this.$emit('startSplit');
        } else {
          this.$emit('endSplit');
        }
      }
    },

    memberUpdata () {
      if (this.tabIndex == 1) return;
      this.memberTip = true;
    },
    chatUpdata () {
      if (this.tabIndex == 0) return;
      this.chatTip = true;
    },
    PopAlertClose () {
      this.PopAlert.visible = false;
    },
    PopAlertSubmit () {
      this.$vhallFetch(
        'defaultRecord',
        {
          params_verify_token: this.params_verify_token,
          id: this.PopAlert.resId,
          user_id: this.third_party_user_id
        },
        {
          'X-Requested-With': 'XMLHttpRequest'
        }
      ).then(rs => {
        this.PopAlert.visible = false;
        this.$message({
          message: '设置成功',
          type: 'success'
        });
      });
    },
    PopAlertCancel () {
      this.PopAlert.visible = false;
      if (this.record_notice == 4) {
        return;
      }
      this.PopAlertTwo.visible = true;
      let html = '非默认回放将暂存15天';
      if (this.record_notice == 1) {
        html = '非默认回放将暂存15天';
      } else if (this.record_notice == 2) {
        html =
          "非默认回放将暂存15天，联系您的客户经理或 <a href=\"http://webim.qiao.baidu.com/im/index?siteid=113762&ucid=2052738\" style='color: #fc5659' target='_blank'>客服</a> 开通点播服务，即可将非默认回放永久保存和播放";
      } else if (this.record_notice == 3) {
        html =
          '非默认回放将暂存15天，发布为点播，即可将非默认回放永久保存和播放';
      }
      this.PopAlertTwo.context = html;

      // this.$alert(html, '提示', {
      //   dangerouslyUseHTMLString: true,
      //   confirmButtonText: '知道了'
      // })
    },
    PopAlertCloseTwo () {
      this.PopAlertTwo.visible = false;
    },
    PopAlertCloseClear () {
      this.PopAlertClear.visible = false;
    },
    PopAlertClearSubmit () {
      this.$refs.doc.handleControlBar({ type: 'clear' });
      this.PopAlertClear.visible = false;
    },
    sharescreenPopupConfirm () {
      this.sharescreenPopupVisible = false;
      this.$EventBus.$emit('sharescreenprocess');
    },
    sharescreenPopupClose () {
      this.sharescreenPopupVisible = false;
    },
    // 邀请上下麦
    getWatchUpperMsg () {
      clearInterval(this.UpperTimerInter);
      this.UpperVisible = true;
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
    AgreeUpper () {
      clearInterval(this.UpperTimerInter);
      this.isApplying = true;
      this.applyWating = false;
      // 分屏状态 直接派发事件
      if (this.splitStatus == 1) {
        this.$EventBus.$emit('splitSpeakOn');
      } else {
        this.$refs.interactive.speakOn();
      }

      this.UpperVisible = false;
    },
    /**
     * @param {Number} flag 如果flag为1 不发送请求
     */
    refuseUpper (flag) {
      this.UpperVisible = false;
      if (flag == 1) return;
      let data = {
        receive_account_id: this.roomInfo.join_info.third_party_user_id,
        room_id: this.roomInfo.interact.room_id
      };
      this.$vhallFetch('rejectInvite', data).catch(error => {
        console.error('拒绝上麦邀请接口错误', error);
      });
    },
    closeUpper () {
      if (this.UpperTime > 0) {
        this.UpperTime = 0;
        clearInterval(this.UpperTimerInter);
        this.refuseUpper();
      }

      // 关闭弹窗
      this.UpperVisible = false;
    },
    scrollInitDocMin () {
      this.$nextTick(() => {
        console.log('this.scrollThumbnailList', this.scrollThumbnailList);
        // 修复自己不具备文档操作权限时候的报错
        try {
          if (this.scrollThumbnailList) {
            this.scrollThumbnailList.destroy();
          }
        } catch (e) {
          console.log(e, 'scrollThumbnailList');
        }

        this.scrollThumbnailList = new BScroll(this.$refs.thumbnailList, {
          click: true,
          bounce: false,
          scrollY: true,
          scrollbar: true,
          mouseWheel: {
            speed: 20,
            invert: false,
            easeTime: 300
          }
        });
      });
    },
    ReDetection () {
      this.$refs.mediasettingsRef.getDeviceInfo();
    },
    closeDocTips () {
      this.DocTipsAlert = false;
      if (this.isPublishing) {
        // this.$route.params.il_id, 1关闭， 2开启
        sessionStorage.setItem(this.$route.params.il_id, 'true');
      }
    },
    initThirdPermis () {
      // 判断是否发起第三方权限，只有直播才有
      if (this.permission.includes(100023)) {
        this.thirdPartyBtn = true;
      }
      console.log(this.permission);
    },
    thirdPartyShow () {
      if (this.isPublishing) {
        this.$message.error('请先结束直播');
        return;
      }
      this.thirdPartyMobild = true;
      this.NoDocShow = true;
    },
    thirdPartyClose () {
      if (this.isPublishing) {
        this.$message.error('请先结束直播');
        return;
      }
      this.thirdPartyMobild = false;
      this.NoDocShow = false;
    },
    getInavInfo () {
      console.warn(this.roomStatus, 'roomStatus*************');
      // res.data.stream.definition--speakerDefinition  不确定是否使用  先存'' res.data.stream.screen_definition --screenDefinition
      sessionStorage.setItem('speakerDefinition','');
      sessionStorage.setItem('screenDefinition', '');
      console.warn(this.rootActive, 'this.rootActive*************');
      this.$fetch('initiatorInfo', {
        webinar_id: this.webinar_id
      }).then(async res => {
          this.roomInfo = this.rootActive;
          this.userInfo = JSON.parse(sessionStorage.getItem('user'));
          // 因早期设置值不同  进行根源影射   更换接口时产生的问题  备注勿删
          if(this.rootActive.webinar.type == 1){
            this.status = 1;
          }else if(this.rootActive.webinar.type == 2){
            this.status = 0;
          }else{
           this.status = 2;
          }
          this.isPublishing = this.status == 1;
          this.isQAEnabled = this.qaStatus == 1; // ??
          this.isQAEnabled = this.roomStatus.question_status == 1; // ??
          this.roleName = this.rootActive.join_info.role_name;

          this.layout =  this.roomStatus.layout;
          this.localDuration = this.duration;

          if (this.status == 1) {
            this.virtualAudienceCanUse = true;
          }
          // 媒体检测
          const mediacheckStatus = sessionStorage.getItem(`MEDIACHECK_FINISH_${this.roomInfo.interact.room_id}`);
          console.warn('cxs----设备检测', mediacheckStatus,this.roomInfo.interact.room_id, this.roomInfo.join_info.role_name);
          if (this.roomInfo.join_info.role_name == 1) {
            console.warn('cxs--设备检测---',!this.assistantType, mediacheckStatus != 'yes', this.status != 1 );
            if (!this.assistantType && mediacheckStatus != 'yes' && this.status != 1) {
              // this.popAlertCheckVisible = true;
            }
          } else if (this.roomInfo.join_info.role_name == 4 && mediacheckStatus != 'no') {
            if (!this.assistantType && mediacheckStatus != 'yes') {
              this.popAlertCheckVisible = true;
            }
          }
          this.isBanned = this.roomStatus.is_banned == 1;
          this.isKicked = this.roomStatus.is_kicked == 1;
          this.getRoomStatus();
          let context = {
            nickname: this.userInfo.nickname, // 昵称
            avatar: this.userInfo.avatar
              ? `${this.userInfo.avatar}`
              : 'https://cnstatic01.e.vhall.com/3rdlibs/vhall-static/img/default_avatar.png', // 头像
            // pv: 100, // pv
            role_name: this.roomInfo.join_info.role_name, // 角色 1主持人2观众3助理4嘉宾
            device_type: '2', // 设备类型 1手机端 2PC 0未检测
            device_status: '0', // 设备状态  0未检测 1可以上麦 2不可以上麦
            is_banned: this.isBanned // 是否禁言 1是0否
          };
          let opt = {
            appId: this.roomInfo.interact.paas_app_id,
            third_party_user_id: this.third_party_user_id,
            channelId: this.roomInfo.interact.channel_id,
            context: JSON.stringify(context),
            token: this.roomInfo.interact.paas_access_token,
            hide: this.$route.query.hide == 1
          };
          VhallChat.createInstance(
            opt,
            chat => {
              window.chatSDK = chat.message;
              this.roomReady = true;
              this.$loadingStus.close();
              this.$EventBus.$on('sdkReady', () => {
                if (!this.assistantType && this.roomInfo.join_info.role_name != 3) {
                  this.vhallChecking();
                }
              });
              if (this.assistantType && this.assistantPlugin) {
                // 接受加入房间消息
                window.chatSDK.join(msg => {
                  if (typeof msg !== 'object') {
                    msg = JSON.parse(msg);
                  }
                  try {
                    if (msg.context && typeof msg.context !== 'object') {
                      msg.context = JSON.parse(msg.context);
                    }
                    if (msg.data && typeof msg.data !== 'object') {
                      msg.data = JSON.parse(msg.data);
                    }
                  } catch (e) {
                    console.log(e);
                  }

                  console.log('********加入房间消息*********');
                  console.log(msg);
                  this.$EventBus.$emit(msg.data.type, msg);
                });
                // 接受离开房间消息
                window.chatSDK.leave(msg => {
                  if (typeof msg !== 'object') {
                    msg && (msg = JSON.parse(msg));
                  }
                  try {
                    if (msg.context && typeof msg.context !== 'object') {
                      msg.context = JSON.parse(msg.context);
                    }
                    if (msg.data && typeof msg.data !== 'object') {
                      msg.data = JSON.parse(msg.data);
                    }
                  } catch (e) {
                    console.log(e);
                  }
                  console.log('********离开房间消息*********');
                  console.log(msg);
                  this.$EventBus.$emit(msg.data.type, msg);
                });
              }
            },
            err => {
              console.error('聊天SDK实例化失败', err);
            }
          );
          if (this.splitStatus == 1) {
            this.calculateLiveDuration(1);
          }
          if (this.roleName == 3 && !this.assistantType) {
            this.autoPlay();
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    /**
     * 获取房间状态，是否开启文档/白板/举手/主讲人...
     */
    getRoomStatus () {
      console.warn(this.roomStatus, '8888');
      let _data = this.roomStatus;
      if (_data.start_type == 4) {
        this.startType = 4;
        this.thirdPartyMobild = true;
        this.$EventBus.$emit('startLive');
      }
      this.allowHandup = Boolean(_data.is_handsup);
      this.allBanned = _data.all_banned == 1;
      this.doc_permission = _data.doc_permission; // 当前主讲人
      this.mainScreen = _data.main_screen;
      this.speakerList = _data.speaker_list || [];
      if(this.rootActive.rebroadcast && this.rootActive.rebroadcast.room_id ){
        this.rebroadcast =  this.rootActive.rebroadcast.room_id || '';
        this.rebroadcastChannelId = this.rootActive.rebroadcast.channel_id || '';
      }
      console.log(this.speakerList);
      if(typeof this.speakerList === 'object' && this.speakerList.length!=0){
        this.speakerList.forEach(item => {
          if (item.account_id == this.roomInfo.join_info.third_party_user_id) {
            this.isApplying = true;
          }
        });
      }

      // console.log('嘉宾是否已经上麦', this.isApplying);
      const layout = sessionStorage.getItem('layout') || _data.layout || ''; // 布局先从本地获取
      sessionStorage.setItem('layout', layout);
      // 动态切换主显示
      this.$EventBus.$on('vrtc_big_screen_set', e => {
        this.mainScreen = e.room_join_id;
      });
    },
    /**
     * @param {Number} flag -是否清零计时器 flag为1的时候清零
     **/
    push (flag) {
      // 互动直播，设备检测通过，但是没有视频设备 提示
      if (this.status == 1) {
        document.getElementById('no-support-relogin').style.display = 'block';
        this.$message.error('当前用户重复进入房间');
        return;
      }
      this.starting = true;
      this.stopping = false;
      console.warn('this.thirdPartyBtn && this.thirdPartyMobild', this.thirdPartyBtn, this.thirdPartyMobild);
      // 第三方发起推流
      if (this.thirdPartyBtn && this.thirdPartyMobild) {
        this.$fetch('liveStart', {
          webinar_id: this.webinar_id,
          start_type: 4
        }).then(() => {
          alert(13);
          this.$EventBus.$emit('startLive');
        }).catch(err=>{
          alert(14);
        });
      } else {
        if (flag == 1) {
          this.localDuration = 0;
        }
        this.$refs.interactive
          .startLive(this.status)
          .then(() => {
            this.isPublishing = true;
          })
          .catch(e => {
            this.isPublishing = false;
            this.starting = false;
            if (e.code == '611005') {
              this.$message.error(e.message);
            } else {
              this.$message.error('发起直播失败');
            }
          });
      }
    },

    stop () {
      if (this.shadowDisconnected) return this.$message.warning('请分屏关闭完成以后结束直播'); // 刚关闭分屏的时候不能点击结束按钮
      this.stopping = true;
      this.starting = false;
      // 第三方发起停止直播
      if (this.thirdPartyBtn && this.thirdPartyMobild) {
        return this.$fetch('liveEnd', {
          webinar_id: this.webinar_id,
          end_type: 4
        }).then(() => {
          // this.localDuration = 0
          this.thirdPartyMobild = false;
          this.$EventBus.$emit('endLive');
        });
      } else if (this.rebroadcast) {
        if (this.rebroadcast == 'rebroadcastEnd') {
          // 转播结束后停止直播
          this.$fetch('liveEnd', {
            webinar_id: this.webinar_id,
            end_type: 4
          }).then(() => {
            this.rebroadcast = '';
            // this.localDuration = 0
            this.thirdPartyMobild = false;
            this.$EventBus.$emit('endLive');
          });
        } else {
          // 转播中停止直播
          this.$vhallFetch('stopRebroadcast', {
            room_id: this.roomInfo.interact.room_id,
            vss_token: this.vssToken,
            source_room_id: this.rebroadcast
          }).then(() => {
            this.rebroadcast = '';
            this.$refs.rebroadcast.rebroadcastingRoomId = '';
            this.$refs.rebroadcast.getList();
            this.$fetch('liveEnd', {
              webinar_id: this.webinar_id,
              end_type: 4
            }).then(() => {
              // this.localDuration = 0
              this.thirdPartyMobild = false;
              this.$EventBus.$emit('endLive');
            });
          });
        }
      } else {
        this.$fetch('v3SetDesktop', { // 直播结束后条用视频最小化接口
          room_id: this.roomInfo.interact.room_id,
          status: '0'
        });

        if (this.splitStatus == 2) {
          this.$refs.interactive.stopLive();
        } else if (this.splitStatus == 1) {
          // 通知分屏关闭直播 - 并关闭自己
          this.$EventBus.$emit('close_live');
          clearTimeout(this._endSplitTimer);
          this._endSplitTimer = setTimeout(() => {
            this.localDuration = 0;
            this.isPublishing = false;
            this.status = 2;
          }, 2000);
        }
      }
    },
    // 切换聊天窗口标签页
    changeTab (idx) {
      this.tabIndex = idx;
      if (idx == 0) {
        setTimeout(() => {
          this.$refs.chat.refresh();
        }, 20);
        this.chatTip = false;
      }
      if (idx == 1) {
        this.memberTip = false;
      }
      if (idx == 3) {
        window.setTimeout(() => {
          this.$refs.qa.refresh();
        }, 50);
      }
      if (idx == 1) {
        window.setTimeout(() => {
          this.$refs.saasMember.refresh();
        }, 50);
      }
    },
    doCopy () {
      this.$copyText(this.ilId).then(e => {
        this.$message.success('复制成功！');
      }).catch(error=>{
        this.$message.error('复制失败！');
      });
    },
    openMediaSettings () {
      if (!this.thirdPartyMobild && !this.screensharing) {
        this.mediaSettingVisible = true;
      }
    },
    closeMediaSettings () {
      this.mediaSettingVisible = false;
    },
    openVirtualAudience () {
      if (this.virtualAudienceCanUse) {
        this.$EventBus.$emit('openVirtualAudience');
        this.virtualAudienceVisible = true;
      }
    },
    closeVirtualAudience () {
      this.virtualAudienceVisible = false;
    },
    openQuestionarie () {
      this.showQuestion = true;
    },
    closeQuestionarie () {
      this.showQuestion = false;
      localStorage.setItem('create', '');
    },
    openSignIn () {
      this.$refs.signin.openSignIn();
    },
    openRedPacketPopup () {
      const obj = {
        vss_token: this.vssToken,
        room_id: this.roomId
      };
      this.$vhallFetch('getPacketLastInfo', obj).then(res => {
        if (res.data.get_user_count < res.data.number && res.data.status == 1) {
          // 红包未领取完成
          this.hadEnvelopeVisible = true;
          return;
        }
        this.RedPacketVisible = true;
      });
    },
    ContinueSendRed () {
      this.hadEnvelopeVisible = false;
      this.RedPacketVisible = true;
    },
    cancelSendRed () {
      this.hadEnvelopeVisible = false;
      this.RedPacketVisible = false;
    },
    closeRedPacketPopup () {
      this.RedPacketVisible = false;
    },
    // 打开抽奖
    openLettery () {
      // this.lotteryShow = true;
      this.$refs.lotterySon && this.$refs.lotterySon.lotteryShow();
    },
    closeRebroadcast () {
      this.rebroadcastVisible = false;
    },
    openRebroadcast () {
      this.rebroadcastVisible = true;
    },
    // 打开问答
    openQAPopup () {
      this.isQAEnabled && this.$fetch('v3GetQaNum', {
        room_id: this.roomId
      }).then(res => {
        if(res.code == 200){
          this.qaCount = res.data.num;
        }else{
          this.$message(res.msg)
        }
      }).catch(() => {
        this.$message('获取问题数量失败!');
        this.qaCount = 0;
      });
      this.qaVisible = true;
    },
    // 关闭问答
    closeQAPopup () {
      this.qaVisible = false;
    },
    /**
     * @param {Number} flag 值为1的时候不弹出提示
     */
    enableQA (flag) {
      this.$fetch('v3GetQa', {
        room_id: this.roomId
      }).then(res => {
          console.log(res);
          if (this.isQAEnabled) {
            this.changeTab(0);
          }
          if (flag != 1) {
            this.$message.success('开启问答成功！');
          }
          this.closeQAPopup();
          if (this.assistantType) {
            this.isQAEnabled = !this.isQAEnabled;
          }
        });
    },
    closeQA(flag){
      this.$fetch('v3CloseQa', {
        room_id: this.roomId
      }).then(res=>{
        console.warn('v3CloseQa',res);
        if(res.code == 200){
          if (this.isQAEnabled) {
            this.changeTab(0);
          }
          if (flag != 1) {
            this.$message.success('关闭问答成功！');
          }
          this.closeQAPopup();
          if (this.assistantType) {
            this.isQAEnabled = !this.isQAEnabled;
          }
        }
      }).catch(err=>{
        console.warn(err);
      })
    },
    showDoc () {
      if (this.doc_permission != this.roomInfo.join_info.third_party_user_id) {
        this.$message.error({ message: `您不是主讲人不能使用该功能` });
        return;
      }
      if (this.isDocEnabled) {
        // this.$refs.doc.toggleDocContainer(false)
        // this.isDocEnabled = false
      } else if (this.isWhiteBoardEnabled) {
        this.isDocEnabled = true;
        this.$refs.doc && this.$refs.doc.toggleDocContainer(true);
        this.$refs.doc && this.$refs.doc.toggleBoard(false);
        this.isWhiteBoardEnabled = false;
        this.$nextTick(() => {
          // 手动触发window resize 事件
          const resizeEvent = new Event('resize');
          window.dispatchEvent(resizeEvent);
        });
      }
      this.NoDocShow = false;
    },
    showWhiteBoard () {
      if (this.doc_permission != this.roomInfo.join_info.third_party_user_id) {
        this.$message.error({ message: `您不是主讲人不能使用该功能` });
        return;
      }
      this.NoDocShow = false;
      // if (!this.$refs.doc.docInfo.docContainerShow) {
      //   return
      // }
      if (this.isWhiteBoardEnabled) {
        // this.$refs.doc.toggleDocContainer(false)
        // this.$refs.doc.toggleBoard(false)
        // this.isWhiteBoardEnabled = false
      } else {
        this.$refs.doc && this.$refs.doc.toggleDocContainer(true);
        this.$nextTick(() => {
          // 手动触发window resize 事件
          const resizeEvent = new Event('resize');
          window.dispatchEvent(resizeEvent);
        });
        this.isWhiteBoardEnabled = true;
        this.isDocEnabled = false;
        this.$refs.doc && this.$refs.doc.toggleBoard(true);
        this.isThumbnailEnabled = false;
      }
    },
    shareScreen () {
      // if (this.status != 1) return this.$message('直播未开始，不能开启桌面共享')

      // 分屏状态下，不能开启桌面共享
      if (this.splitStatus == 1) {
        return;
      }

      if (this.thirdPartyMobild || this.status != 1) {
        return;
      }
      if (this.doc_permission != this.roomInfo.join_info.third_party_user_id) {
        this.$message.error({ message: `您不是主讲人不能使用该功能` });
        return;
      }
      if (this.screensharing) {
        this.$refs.interactive.stopShareScreen();
      } else {
        this.$refs.interactive.shareScreen();
      }
    },
    fullscreen (el) {
      if (this.isFullscreen) {
        this.exitFullscreen(el);
      } else {
        this.enterFullscreen(el);
      }
    },
    enterFullscreen (el) {
      let element = document.querySelector(el);
      if (!this.assistantType) {
        if (element.requestFullscreen) element.requestFullscreen();
        else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
        else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) element.msRequestFullscreen();
      }
      this.isFullscreen = true;
      if (el == '#vhall-document-container') { // 助手全屏
        element.style.width = '100%';
        this.isDocFullscreen = true;
        if (this.assistantType) { // 解决15988
          this.$emit('assistantMsg', 'docFullscreen', true);
          setTimeout(() => {
            this.$refs.doc && this.$refs.doc.$el.focus();
            this.$refs.doc && this.$refs.doc.$el.click();
          }, 2000);
        }
      } else {
        this.isFullscreen = true;
      }
      this.moveTool();
    },

    exitFullscreen (el) {
      if (!this.assistantType) {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
      }
      if (el == '#vhall-document-container') { // 助手全屏退出
        this.isDocFullscreen = false;
        if (this.assistantType) { // 解决15988
          this.$emit('assistantMsg', 'docFullscreen', false);
          setTimeout(() => {
            this.$refs.doc && this.$refs.doc.$el.focus();
            this.$refs.doc && this.$refs.doc.$el.click();
          }, 2000);
        }
      } else {
        this.isFullscreen = false;
      }
      this.moveTool();
    },

    downEvent (e) {
      // 兼容触摸屏
      if (e.changedTouches && e.changedTouches.length >= 1) {
        e = e.changedTouches[0];
      }
      // 添加定时器过滤点击事件
      this.longDownSt = setTimeout(() => {
        clearTimeout(this.longDownSt);
        this.longDownSt = null;
        let docBar = document.querySelector('.vhall-document-pencilbar');
        if (!docBar) return;
        if (e.pageY < 200) {
          docBar.setAttribute('class', 'vhall-document-pencilbar long-touch top-sector');
        } else {
          docBar.setAttribute('class', 'vhall-document-pencilbar long-touch');
        }
        this.disX = e.clientX - docBar.offsetLeft;
        this.disY = e.clientY - docBar.offsetTop;
        document.addEventListener('mousemove', this.moveEvent, false);
        // 兼容触摸屏
        document.addEventListener('touchmove', this.moveEvent, false);
      }, 100);
    },
    upEvent (e) {
      // 兼容触摸屏
      if (e && e.changedTouches && e.changedTouches.length >= 1) {
        e = e.changedTouches[0];
      }
      let docBar = document.querySelector('.vhall-document-pencilbar');
      if (e && e.clientY < 200) {
        docBar.setAttribute('class', 'vhall-document-pencilbar top-sector');
      } else {
        docBar.setAttribute('class', 'vhall-document-pencilbar');
      }
      clearTimeout(this.longDownSt);
      this.longDownSt = null;
      this.disX = 0;
      this.disY = 0;
      document.removeEventListener('mousemove', this.moveEvent, false);
      // 兼容触摸屏
      document.removeEventListener('touchmove', this.moveEvent, false);
    },
    moveEvent (e) {
      // 兼容触摸屏
      if (e && e.changedTouches && e.changedTouches.length >= 1) {
        e = e.changedTouches[0];
      }
      let docBar = document.querySelector('.vhall-document-pencilbar');
      let left = e.clientX - this.disX;
      // 计算左右边界
      left = left <= -150 ? -150 : (left >= window.screen.width - 150 ? window.screen.width - 150 : left);
      let top = e.clientY - this.disY;
      // 计算上下边界
      top = top < 0 ? 0 : (top >= window.screen.height - 50 ? window.screen.height - 50 : top);
      docBar.style.left = left + 'px';
      docBar.style.top = top + 'px';
      if (e && e.pageY < 200) {
        docBar.setAttribute('class', 'vhall-document-pencilbar long-touch top-sector');
      } else {
        docBar.setAttribute('class', 'vhall-document-pencilbar long-touch');
      }
    },
    moveTool () {
      this.$nextTick(() => {
        let docBar = document.querySelector('.vhall-document-pencilbar');
        if (!this.isDocFullscreen) {
          this.upEvent();
          document.removeEventListener('mouseup', this.upEvent, false);
          docBar.removeEventListener('mousedown', this.downEvent, false);
          // 兼容触摸屏
          document.removeEventListener('touchend', this.upEvent, false);
          docBar.removeEventListener('touchstart', this.downEvent, false);
          docBar.style = '';
          docBar.setAttribute('title', '');
          return;
        } else {
          // 初始化位置
          docBar.style.top = window.screen.height - 100 + 'px';
          docBar.style.left = window.screen.width / 2 - 150 + 'px';
          docBar.style.marginLeft = 0 + 'px';
        }
        docBar.setAttribute('title', '长按拖动');
        docBar.addEventListener('mousedown', this.downEvent, false);
        document.addEventListener('mouseup', this.upEvent, false);
        // 兼容触摸屏
        docBar.addEventListener('touchstart', this.downEvent, false);
        document.addEventListener('touchend', this.upEvent, false);
      });
    },
    startStream () {
      // 转播成功后关闭推流
      this.$refs.interactive.startPushStream();
    },

    stopStream () {
      // 转播成功后关闭推流
      this.$refs.interactive.stopLive();
    },
    handleControlBar (type, value) {
      // 文档工具栏操作
      this.docToolStatus.docToolActive = type;
      // this.$refs.doc.handleControlBar(params);
      switch (type) {
        // 设置画笔/荧光笔宽度
        case 'hb':
        case 'ygb':
        case 'font':
        case 'graph':
          if (value) {
            // 设置颜色
            if (/#/.test(value)) {
              this.docToolStatus[type].color = value;
              if (type == 'graph') {
                this.$refs.doc.handleControlBar({
                  type,
                  value: this.docToolStatus[type].value
                });
              } else {
                this.$refs.doc.handleControlBar({
                  type,
                  value: this.docToolStatus[type].width
                });
              }
              this.$refs.doc.handleControlBar({ type: 'setColor', value });
            } else {
              if (type == 'graph') {
                this.docToolStatus[type].value = value;
              } else {
                this.docToolStatus[type].width = value;
              }
              if (type == 'graph') {
                this.$refs.doc.handleControlBar({
                  type,
                  value: this.docToolStatus[type].value
                });
              } else {
                this.$refs.doc.handleControlBar({
                  type,
                  value: this.docToolStatus[type].width
                });
              }
              this.$refs.doc.handleControlBar({
                type: 'setColor',
                value: this.docToolStatus[type].color
              });
            }
          } else {
            if (type == 'graph') {
              this.$refs.doc.handleControlBar({
                type: 'setColor',
                value: this.docToolStatus[type].color
              });
              this.$refs.doc.handleControlBar({
                type,
                value: this.docToolStatus[type].value
              });
            } else {
              this.$refs.doc.handleControlBar({
                type,
                value: this.docToolStatus[type].width
              });
            }
          }
          // Object.assign(params, { value });
          break;
        default:
          if (type == 'clear') {
            this.PopAlertClear.visible = true;
            if (this.isWhiteBoardEnabled) {
              this.PopAlertClear.context = '确定要清空白板么？';
            } else {
              this.PopAlertClear.context = '确定要清空文档标记么？';
            }
            return;
          }
          this.$refs.doc.handleControlBar({ type });
        // 设置颜色
        // case 'setColor':
        //   this.docToolStatus[type].color = value;
        //   break;
        // 设置图形
        // case 'graph':
        //   this.docToolStatus[type].value = value;
        //   break;
      }
      // console.log(JSON.stringify(this.docToolStatus));

      // if (type == 'setColor') {
      //   this.pencilColor = value
      // }
    },
    // handleControlBar (type, value) {
    //   // 文档工具栏操作
    //   this.docToolStatus.docToolActive = type
    //   const params = value ? { type, value } : { type }
    //   this.$refs.doc.handleControlBar(params)
    // },
    chooseDocument () {
      this.$refs.doclist.showDocList();
    },

    toggleDocumenVisiblity (value) {
      if (this.screensharing) {
        return;
      }
      // 观众是否可见
      this.docVisibleToAudience = value;
      this.$refs.doc.toggleWatchContainer(value);
    },

    toggleThumbnail () {
      if (!this.isDocEnabled) return;
      try {
        const docThumbnails = this.$refs.doc.getThumibnailList() || [];
        this.documentThumbnailList = docThumbnails[0] ? docThumbnails[0].list : [];
        this.isThumbnailEnabled = !this.isThumbnailEnabled;
        this.scrollInitDocMin();
      } catch (e) {
        console.log('获取缩略图失败');
      }
    },

    goToPage (index) {
      this.selectedDocumentPage = index;
      this.$refs.doc.gotoPage(index);
      // this.$EventBus.$emit('remote_doc_select')
    },
    toggleShare () {
      this.shareVisible = !this.shareVisible;
    },

    roleQuit () {
      this.$vhallFetch('roleQuit', {
        webinar_id: this.ilId,
        params_verify_token: this.params_verify_token,
        join_uid: this.saas_join_id
      })
        .then(res => {
          window.location.href = `${window.location.origin}/mywebinar/login/${this.ilId}`;
        })
        .catch(res => {});
    },

    calculateLiveDuration (status = '') {
      window.clearInterval(this.durationInterval);
      if (status != 1) return;
      let temp = 0;
      this.durationInterval = window.setInterval(() => {
        this.localDuration = this.localDuration + 1;
        temp = this.localDuration * 1000;
        const hours = moment.duration(temp).hours();
        const minutes = moment.duration(temp).minutes();
        const seconds = moment.duration(temp).seconds();
        this.liveDuration = `${hours < 10 ? '0' + hours : hours}:${
          minutes < 10 ? '0' + minutes : minutes
        }:${seconds < 10 ? '0' + seconds : seconds}`;
      }, 1000);
    },
    PopAlertOfflineClose () {
      this.PopAlertOffline.visible = false;
    },
    PopAlertOfflineConfirm () {
      // this.$message('请等待五秒钟')
      // this.PopAlertOffline.visible = false
      // clearTimeout(this.reloadTimer)
      // this.reloadTimer = setTimeout(() => {
      //   window.location.reload()
      // }, 5000)
      window.location.reload();
    },
    popAlertCheckClose () {
      this.popAlertCheckVisible = false;
      this.$nextTick(() => {
        // this.popAlertCheckConfirmVisible = true;
      }, 1000);
      const list = document.getElementsByTagName('video');
      for (let item of list) {
        item.play();
      }
    },
    popAlertCheckSubmit () {
      this.popAlertCheckVisible = false;
      this.$refs.mediaCheck && this.$refs.mediaCheck.show();
      const list = document.getElementsByTagName('video');
      for (let item of list) {
        item.play();
      }
    },
    popAlertCheckConfirm () {
      this.popAlertCheckConfirmVisible = false;
      sessionStorage.setItem(`MEDIACHECK_FINISH_${this.roomInfo.interact.room_id}`, 'no');
    },
    popAlertCheckConfirmClose () {
      this.popAlertCheckConfirmVisible = false;
      this.$refs.mediaCheck && this.$refs.mediaCheck.show();
    },
    streamendErrorPopupClose () {
      this.streamendErrorPopupVisible = false;
    },
    sharescreenErrorPopupClose () {
      this.sharescreenErrorPopupVisible = false;
    },
    assistantMouseEnter (type) { // 给助手客户端提供鼠标移入移出文档区域的事件
      if (this.assistantType == 'doc') {
        this.$emit('assistantMsg', 'docmouseenter', type);
      }
    },
    /**
     * 视频文档相互切换
     */
    exchange () {
      if (this.miniElement == 'doc') {
        this.$EventBus.$emit('vhallLayoutExchange', 'video');
      } else {
        this.$EventBus.$emit('vhallLayoutExchange', 'doc');
      }

      this.$nextTick(() => {
        // 手动触发window resize 事件
        const resizeEvent = new Event('resize');
        window.dispatchEvent(resizeEvent);
      });
    },
    // input框聚焦时，阻止键盘事件冒泡, 阻止此时翻页
    stopKeyPropagation () {
      let body = document.getElementsByTagName('body')[0];
      body.addEventListener('keyup', event => {
        var e = event || window.event;
        if (e.target.tagName == 'INPUT') {
          event.stopPropagation();
          console.log('阻止input冒泡');
        }
      });
    },
    autoPlay () {
      setTimeout(() => {
        this.$alert('您已进入直播房间，马上开始互动吧', '', {
          title: '提示',
          confirmButtonText: '立即开始',
          center: true,
          callback: action => {
            const list = document.getElementsByTagName('video');
            for (let item of list) {
              item.play();
            }
          }
        });
      }, 2000);
    }
  }
};
</script>

<style lang="less">
.vhall-subStream-box .pop-nickName i{
  display: none;
}
.el-message-box__content {
  padding: 0 24px;
}
@import url(./interactive.less);
.el-loading-spinner .path {
  stroke: #fc5659 !important;
}
.room-container {
  width: 100%;
  height: 100%;
  &.assistantStyle {
    background: rgba(67, 67, 67, 1);
  }
}
.tab-content {
  flex: 1;
  min-height: 0;
  &.assistantStyle {
    height: 100%;
  }
  /*overflow: hidden;*/
}
.full-screen-doc {
  .vhall-document-operationbar{
    height: 1px !important;
    background-color: transparent !important;
    border-bottom: transparent !important;
    .button-container{
      opacity: 0;
    }
    .vhall-room-fullscreen{
      position: relative;
      top: 24px;
    }
    .vhall-document-pencilbar{
      position: fixed !important;
      bottom: 50px;
      background-color: #1A1A1A;
      cursor: move;
      padding: 0 20px;
      border-radius: 25px;
      &.long-touch:after{
        position: absolute;
        display: block;
        content: '';
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: transparent;
        z-index: 99;
      }

    }
    .list-wrapper{
      transform: translateY(-122%);
      padding-bottom: 10px;
    }
    .top-sector .list-wrapper{
      transform: inherit;
      padding-bottom: 0;
    }
  }
  .vhall-doc-pager{
    display: none;
  }
  .doc-wrapper{
    .doc-inner-wrapper{
      top: 0 !important;
    }
    .doc{
      background-color: #000 !important;
    }
  }
}
.main-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  font-family: '微软雅黑';
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .vhall-header {
    width: 100%;
    height: 50px;
    line-height: 50px;
    //   background: rgba(67, 67, 67, 1);
    background: rgba(67, 67, 67, 1);
    //   background: #363636;
    //   background: #36383f;
    // box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.68);
    z-index: 12;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #353535;
    .vhall-header-left {
      height: 100%;
      margin-left: 20px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .vhall-room-name {
        font-size: 16px;
        color: #ffffff;
        line-height: 22px;
        max-width: 720px;
        margin-right: 10px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .vhall-room-id-container {
        height: 20px;
        border-radius: 2px;
        border: 1px solid rgba(151, 151, 151, 1);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding-right: 3px;
        .vhall-room-id-icon {
          width: 22px;
          height: 20px;
          background: rgba(151, 151, 151, 1);
          font-size: 12px;
          color: rgba(255, 255, 255, 1);
          line-height: 19px;
          text-align: center;
        }
        .vhall-room-id {
          width: 100%;
          height: 20px;
          font-size: 12px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          line-height: 20px;
          padding-left: 2px;
          text-align: center;
        }
        .vhall-room-id-copy {
          width: 19px;
          height: 19px;
          color: #999;
          line-height: 20px;
          text-align: center;
          cursor: pointer;
          & > i {
            display: block;
            font-size: 12px;
          }
        }
      }
    }
    .vhall-header-right {
      height: 100%;
      margin-right: 20px;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .non-selectable{
        user-select: none;
      }
      .vhall-room-operation {
        width: 100px;
        height: 26px;
        border-radius: 100px;
        font-size: 14px;
        text-align: center;
        line-height: 26px;
        color: rgba(255, 255, 255, 1);
        margin-right: 10px;
        padding: 0 10px;
        box-sizing: border-box;
        cursor: pointer;
      }
      .vhall-room-operation.stop {
        & > .stoptext {
          display: none;
        }
        & > .duration {
          font-size: 14px;
          // padding-right: 14px;
          // padding-left: 14px;
        }
        &:hover {
          box-sizing: border-box;
          /*border: 1px solid rgba(151, 151, 151, 1);*/
          /*background: none;*/
          & > .duration {
            display: none;
          }
          & > .stoptext {
            display: block;
          }
        }
      }
      .vhall-room-record-container {
        height: 100%;
        display: flex;
        align-items: center;
        align-content: center;
        position: relative;
        &:hover {
          .vhall-recorder-buttons {
            display: block;
          }
        }
        .vhall-recorder-buttons {
          z-index: 3;
          display: none;
          position: absolute;
          top: 45px;
          left: -6px;
          width: 112px;
          background-color: #434343;
          text-align: center;
          padding: 3px 0;
          border-radius: 3px;
          border: 1px solid #2d2d2d;
          overflow: hidden;
          color: #ececec;
          box-sizing: border-box;
          & > li {
            width: 100%;
            height: 32px;
            line-height: 32px;
            color: #fff;
            font-size: 14px;
            cursor: pointer;
            box-sizing: border-box;
            vertical-align: middle;
            & > i {
              font-size: 7px;
              transform: scale(0.6);
              margin-right: 11px;
              vertical-align: middle;
            }
            &:hover {
              background-color: #1d1d1d;
            }
          }
        }
      }
      .vhall-room-record {
        box-sizing: border-box;
        border: 1px solid rgba(151, 151, 151, 1);
        line-height: 24px;
        & > i.iconluzhi {
          font-size: 12px;
          transform: scale(0.6);
          margin-right: 5px;
          vertical-align: middle;
        }
      }
      .vhall-room-connect {
        span {
          display: inline-block;
          background-color: #fc5659;
          width: 120px;
          height: 26px;
          border-radius: 100px;
          font-size: 14px;
          text-align: center;
          line-height: 26px;
          color: rgba(255, 255, 255, 1);
          margin-right: 10px;
          padding: 0 10px;
          box-sizing: border-box;
          cursor: pointer;
        }
      }
      .vhall-room-play {
        background-color: #fc5659;
      }
      .vhall-room-user-icon-contaier {
        height: 100%;
        display: flex;
        align-content: center;
        align-items: center;
        &:hover {
          .vhall-user-frame {
            display: block;
          }
        }
      }
      .vhall-room-user-icon-index {
        background-color: rgba(226, 226, 226, 0.15);
        border-radius: 50%;
        width: 28px;
        height: 28px;
        margin-right: 10px;
        line-height: 28px;
        text-align: center;
        color: #a3a3a3;
        font-size: 20px;
        cursor: pointer;
        background-image: url(../../assets/images/common/default_avatar.png);
        background-repeat: no-repeat;
        background-position: center center;
        background-color: rgba(226, 226, 226, 0.15);
        background-size: 100% 100%;
        box-sizing: border-box;
        border: 1px solid rgba(221, 221, 221, 0.3);
        &:hover {
          border: 1px solid #a3a3a3;
        }
        .vhall-user-frame {
          display: none;
          position: absolute;
          top: 48px;
          right: 10px;
          z-index: 10;
          width: 240px;
          border-radius: 4px;
          overflow: hidden;
          background-color: #fff;
          font-size: 14px;
          cursor: initial;
          .vhall-user-frame-head {
            height: 50px;
            background: url(../../public/saas/images/setting-bg.png);
            background-repeat: no-repeat;
            background-size: cover;
            padding: 0 20px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            .vhall-user-type {
              display: inline-block;
              width: 50px;
              height: 18px;
              font-size: 12px;
              border: 1px solid #fff;
              border-radius: 50px;
              text-align: center;
              line-height: 16px;
              color: #fff;
            }
            .vhall-user-name {
              width: 110px;
              color: #fff;
              display: inline-block;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              text-align: left;
              margin-left: 7px;
            }
          }
          .vhall-user-frame-bottom {
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 18px 20px;
            box-sizing: border-box;
            & > div {
              width: 77px;
              display: block;
              text-align: center;
              font-size: 12px;
              color: #333;
              box-sizing: border-box;
              cursor: pointer;
              & > i {
                display: block;
                margin: 0 auto;
                width: 34px;
                height: 34px;
                font-size: 19px;
                color: #888888;
                border: 1px solid #888888;
                border-radius: 50%;
                line-height: 34px;
                &.iconfenpingmoshi {
                  font-size: 15px;
                }
              }
              &.disable {
                cursor: default;
                color: #aaa;
                user-select: none;
                & > i {
                  border: 1px solid #e2e2e2;
                  color: #e2e2e2;
                  background-color: #fff;
                }
                &:hover {
                  color: #aaa;
                  & > i {
                    border: 1px solid #e2e2e2;
                    color: #e2e2e2;
                    background-color: #fff;
                  }
                }
              }
              &:hover {
                color: #fc5659;
                & > i {
                  border: 1px solid #fc5659;
                  color: #ffffff;
                  background-color: #fc5659;
                }
              }
            }
          }
        }
      }
    }
    .vhall-room-fullscreen {
      background-color: rgba(226, 226, 226, 0.15);
      border-radius: 50%;
      width: 28px;
      height: 28px;
      color: #a3a3a3;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      cursor: pointer;
      box-sizing: border-box;
      &:hover {
        border: 1px solid #a3a3a3;
        line-height: 26px;
      }
      .iconquanpingguanbi {
        font-size: 12px;
        margin-top: 1px;
        margin-left: 1px;
      }
      .iconquanping {
        font-size: 12px;
        margin-top: 1px;
        margin-left: 1px;
      }
    }
  }

  .vhall-main-area {
    position: relative;
    width: 100%;
    height: 100%;
    padding-right: 310px;
    padding-left: 60px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    position: relative;
    &.assistantStyle {
      padding: 0;
    }
    .thirdParty-warp {
      width: 100%;
      height: 100%;
      flex-shrink: 0;
      &.live-end {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 600;
      }
    }
    .vhall-main-area--content {
      height: 100%;
      display: flex;
      /*background: url('https://t-alistatic01.e.vhall.com/static/img/host_doc_shade.jpg') no-repeat;*/
      background-size: cover;
      flex-direction: column;
      background-color: #2d2d2d;
      .vhall-document-container {
        // height: 100%;
        flex: 1;
        min-height: 0;
        &.assistantStyle {
          height: 100%;
        }
        &.assistant-plugin{
          opacity: 0;
        }
        .vhall-saas-miniArea {
          .vhall-main-placeholder,
          .vhall-document-placeholder {
            & > i {
              color: #7c7c7c;
              &.iconweizhibozhanweitu,
              &.iconzanwuwendang {
                font-size: 98px;
              }
            }
            span {
              font-size: 12px;
              user-select: none;
            }
          }
        }
        .vhall-main-placeholder {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(45, 45, 45, 1);
          flex-direction: column;
          & > i {
            font-size: 137px;
            color: #7c7c7c;
            &.iconweizhibozhanweitu {
              font-size: 137px;
            }
          }
          & > span {
            font-size: 16px;
            color: rgba(153, 153, 153, 1);
            line-height: 22px;
          }
        }
        .vhall-document-placeholder {
          height: 100%;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(45, 45, 45, 1);
          flex-direction: column;
          & > i {
            font-size: 137px;
            color: #7c7c7c;
          }
          & > span {
            width: 208px;
            height: 22px;
            font-size: 16px;
            font-family: '微软雅黑';
            font-weight: 400;
            color: rgba(153, 153, 153, 1);
            line-height: 22px;
            text-align: center;
            user-select: none;
          }
        }
        .document-thumbnail {
          width: 36px;
          height: 36px;
          // background: rgba(0, 0, 0, 1);
          border-radius: 4px;
          text-align: center;
          vertical-align: middle;
          line-height: 36px;
          cursor: pointer;
          position: absolute;
          right: 16px;
          top: 7px;
          z-index: 51;
          &:hover {
            background: #000;
          }
          & > i {
            font-size: 17px;
            color: #dadada;
          }
        }
        .document-thumbnail.enabled {
          background: rgba(0, 0, 0, 1);
          &:hover {
            background: #000;
          }
          // &:active {
          //   background: rgba(53, 51, 51, 0.897);
          // }
        }
        .vhall-document-thumbnail-container.visible {
          width: 144px;
          right: 0;
          -webkit-transition: all 0.4s ease-in-out;
          transition: all 0.4s ease-in-out;
        }
        .vhall-document-thumbnail-container {
          width: 0px;
          height: calc(100% - 40px);
          background: black;
          position: absolute;
          right: -144px;
          top: 40px;
          // z-index: 50;
          overflow: hidden;
          /*overflow: scroll;*/
          .smooth-scrollbar {
            overflow: unset !important;
          }
          .vhall-document-thumbnail {
            padding: 20px 0px;
            /*border: 1px solid red;*/
            /* width: 144px; */
            /*padding: 20px 0px;*/
            /*height: 97%;*/
            /* background: black; */
            /* position: absolute; */
            /* right: 0; */
            /*box-sizing: border-box;*/
            /* top: 0; */
            /* z-index: 50; */
            /*overflow-y: scroll;*/
            // overflow: scroll;
            & > div {
              height: 63px;
              width: 110px;
              margin-top: 15px;
              position: relative;
              margin-left: auto;
              margin-right: auto;
              box-sizing: border-box;
              cursor: pointer;
              transition: All 0.4s ease;
              & > img {
                height: 100%;
                width: 100%;
                display: block;
              }
              & > span {
                display: block;
                min-width: 20px;
                height: 14px;
                background: rgba(0, 0, 0, 1);
                opacity: 0.7;
                color: #ffffff;
                font-size: 12px;
                line-height: 14px;
                text-align: center;
                font-family: '微软雅黑';
                position: absolute;
                left: 0;
                bottom: 0;
              }
            }
            & > div.selected {
              // animation: selected 1s;
              border: 2px solid rgba(252, 86, 89, 1);
              transform: scale(1.1);
              transition: All 0.4s ease;
              & > span {
                left: -2px;
                bottom: -2px;
              }
            }
          }
        }
        .vhall-document-operationbar {
          height: 50px;
          width: 100%;
          background: rgba(45, 45, 45, 1);
          border-bottom: solid 1px #1f1f1f;
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 2;
          & > .button-container {
            max-width: 250px;
            display: flex;
            & > .choose-document {
              height: 27px;
              width: 76px;
              border-radius: 15px;
              border: 1px solid rgba(218, 218, 218, 1);
              font-size: 12px;
              color: rgba(218, 218, 218, 1);
              line-height: 27px;
              text-align: center;
              margin-left: 16px;
              cursor: pointer;
              &:hover {
                background: #fc5659;
                border-color: #fc5659;
              }
              &:active {
                background: #c51f1d;
                border-color: #c51f1d;
              }
            }
            & > .audience-visible {
              font-size: 12px;
              color: rgba(218, 218, 218, 1);
              line-height: 17px;
              display: flex;
              align-items: center;
              margin-left: 20px;
              position: relative;
              .alert {
                position: absolute;
                right: -176px;
                top: 40px;
                width: 192px;
                height: 45px;
                word-break: break-all;
                z-index: 8;
                background: #ff9b00;
                border-radius: 4px;
                line-height: 20px;
                padding: 9px 14px;
                color: #fff;
                text-align: center;
                box-sizing: content-box;
                .triangle_border_up {
                  position: absolute;
                  display: block;
                  width: 0;
                  height: 0;
                  border-width: 0 8px 8px;
                  border-style: solid;
                  border-color: transparent transparent #ff9b00;
                  top: -8px;
                  left: 10px;
                }
                span {
                  cursor: pointer;
                  color: #fffdef;
                  width: 15px;
                  height: 15px;
                  font-size: 12px;
                  position: absolute;
                  top: 2px;
                  display: block;
                  right: 5px;
                }
              }
              & > .toggle-button {
                margin-left: 10px;
                width: 38px;
                height: 20px;
                box-sizing: border-box;
                border-radius: 10px;
                border: 1px solid rgba(221, 221, 221, 1);
                cursor: pointer;
                line-height: 18px;
                & > span {
                  margin-bottom: 2px;
                  transition: all 0.3s ease;
                  display: inline-block;
                  vertical-align: middle;
                  height: 12px;
                  width: 12px;
                  background: rgba(132, 132, 132, 1);
                  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.2);
                  margin-left: 4px;
                  border-radius: 50%;
                }
              }

              & > .toggle-button.enabled {
                border-color: #7db7f0;
                & > span {
                  background: #7db7f0;
                  margin-left: 21px;
                  transition: all 0.3s ease;
                }
              }
            }
          }
          .vhall-document-pencilbar {
            width: 300px;
            height: 50px;
            position: absolute;
            margin-left: -170px;
            left: 50%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            & > div {
              height: 36px;
              width: 36px;
              margin-left: 3px;
              border-radius: 4px;
              text-align: center;
              vertical-align: middle;
              position: relative;
              line-height: 36px;
              cursor: pointer;
              z-index: 100;
              &:active {
                background: rgba(0, 0, 0, 1);
              }
              &.active {
                background: rgba(0, 0, 0, 1);
              }
              &:hover {
                background: rgba(0, 0, 0, 1);
                & > .list-wrapper {
                  display: block;
                }
              }
              & > .list-wrapper {
                display: none;
                position: absolute;
                top: 36px;
                left: 0;
                padding-top: 4px;
                & > .clear-everything {
                  height: 36px;
                  width: 36px;
                  border-radius: 4px;
                  text-align: center;
                  vertical-align: middle;
                  position: relative;
                  line-height: 36px;
                  cursor: pointer;
                  background: rgba(0, 0, 0, 1);
                  color: white;
                  &:hover {
                    background: rgb(87, 87, 85);
                  }
                  &:active {
                    background: rgba(53, 51, 51, 0.897);
                  }
                }
                & > .list-container {
                  width: 129px;
                  background: rgba(0, 0, 0, 1);
                  border-radius: 4px;
                  opacity: 0.8;
                  & > .size-list {
                    width: 100%;
                    border-bottom: 1px solid rgba(67, 67, 67, 1);
                    height: 41px;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    & > div {
                      height: 24px;
                      width: 24px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      color: white;
                      border-radius: 1px;
                      &:hover {
                        background: #434343;
                      }
                      &:active,
                      &.active {
                        background: #333333;
                      }
                    }
                  }
                  & > .color-list {
                    width: 100%;
                    display: flex;
                    justify-content: space-around;
                    flex-wrap: wrap;
                    & > div {
                      height: 20px;
                      width: 20px;
                      border-radius: 1px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      box-sizing: border-box;
                      margin: 6px;
                      & > div {
                        height: 16px;
                        width: 16px;
                      }
                      &:hover {
                        border: 1px solid #e6d2d2;
                      }
                      &:active {
                        border: 1px solid #b6aeae;
                      }
                      &.active {
                        border: 1px solid #ffffff;
                      }
                    }
                  }
                }
              }
              & > i {
                font-size: 17px;
                color: #dadada;
              }
              & > span {
                position: absolute;
                right: -1px;
                bottom: 0px;
                display: block;
                height: 0px;
                width: 0px;
                border-width: 4px;
                border-style: solid;
                transform: rotate(130deg);
                border-color: transparent transparent #dadada;
                box-sizing: border-box;
              }
            }
          }
          .vhall-room-fullscreen {
            margin-right: 60px;
            & > div {
              height: 36px;
              width: 36px;
              margin-left: 3px;
              border-radius: 4px;
              text-align: center;
              vertical-align: middle;
              position: relative;
              line-height: 36px;
              cursor: pointer;
              z-index: 100;
              &:active {
                background: rgba(0, 0, 0, 1);
              }
              &.active {
                background: rgba(0, 0, 0, 1);
              }
              &:hover {
                background: rgba(0, 0, 0, 1);
                & > .list-wrapper {
                  display: block;
                }
              }
              & > .list-wrapper {
                display: none;
                position: absolute;
                top: 36px;
                left: 0;
                padding-top: 4px;
                & > .clear-everything {
                  height: 36px;
                  width: 36px;
                  border-radius: 4px;
                  text-align: center;
                  vertical-align: middle;
                  position: relative;
                  line-height: 36px;
                  cursor: pointer;
                  background: rgba(0, 0, 0, 1);
                  color: white;
                  &:hover {
                    background: rgb(87, 87, 85);
                  }
                  &:active {
                    background: rgba(53, 51, 51, 0.897);
                  }
                }
                & > .list-container {
                  width: 129px;
                  background: rgba(0, 0, 0, 1);
                  border-radius: 4px;
                  opacity: 0.8;
                  & > .size-list {
                    width: 100%;
                    border-bottom: 1px solid rgba(67, 67, 67, 1);
                    height: 41px;
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    & > div {
                      height: 24px;
                      width: 24px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      color: white;
                      border-radius: 1px;
                      &:hover {
                        background: #434343;
                      }
                      &:active,
                      &.active {
                        background: #333333;
                      }
                    }
                  }
                  & > .color-list {
                    width: 100%;
                    display: flex;
                    justify-content: space-around;
                    flex-wrap: wrap;
                    & > div {
                      height: 20px;
                      width: 20px;
                      border-radius: 1px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      box-sizing: border-box;
                      margin: 6px;
                      & > div {
                        height: 16px;
                        width: 16px;
                      }
                      &:hover {
                        border: 1px solid #e6d2d2;
                      }
                      &:active {
                        border: 1px solid #b6aeae;
                      }
                      &.active {
                        border: 1px solid #ffffff;
                      }
                    }
                  }
                }
              }
              & > i {
                font-size: 17px;
                color: #dadada;
              }
              & > span {
                position: absolute;
                right: -1px;
                bottom: 0px;
                display: block;
                height: 0px;
                width: 0px;
                border-width: 4px;
                border-style: solid;
                transform: rotate(130deg);
                border-color: transparent transparent #dadada;
                box-sizing: border-box;
              }
            }
          }
          .vhall-room-fullscreen-right {
            margin-right: 16px;
          }
        }
      }
      .vhall-saas-videobox {
        position: relative;
        height: 168px;
        width: 100%;
        z-index: 10;
        /* background: url('../../assets/small.png') no-repeat;
        background-size: 100% 100%; */
        .mask {
          opacity: 0;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 10;
          display: flex;
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
            font-size: 16px;
            width: 32px;
            height: 32px;
            line-height: 32px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 100%;
            margin-right: 10px;
            &:hover {
              background: #fc5659;
            }
            &.iconsheweizhujiangren {
              font-size: 14px;
            }
          }
        }
        .video-image {
          width: 100%;
          height: 100%;
        }
      }
    }
    .vhall-main-area-tools {
      width: 60px;
      box-sizing: border-box;
      background: rgba(67, 67, 67, 1);
      border-left: 1px solid #3a3a48;
      border-top: 1px solid rgb(53, 53, 53);
      position: absolute;
      left: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      height: 100%;
      &.assistantStyle {
        width: 0;
        overflow: hidden;
      }

      & > a {
        margin-top: 30px;
      }
      & > a.vhall-docs {
        margin-top: 20px;
      }
      .vhall-tools {
        display: block;
        text-align: center;
        font-size: 12px;
        color: #ececec;
        & > i {
          display: block;
          width: 23px;
          height: 23px;
          margin: 0 auto;
          padding-bottom: 6px;
          font-size: 22px;
        }
        &:hover,
        &:active {
          color: #fc5659;
          & > i {
            color: #fc5659;
          }
        }
        &.enabled {
          color: #fc5659;
          & > i {
            color: #fc5659;
          }
        }
        &.disable {
          cursor: default;
          color: #7c7c7c;
          & > i {
            color: #7c7c7c;
          }
          &:hover {
            color: #7c7c7c;
            & > i {
              color: #7c7c7c;
            }
          }
        }
      }
      .vhall-interact:hover {
        position: relative;
        .vhall-interact-panel {
          &.disabled {
            display: none;
          }
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          position: absolute;
          z-index: 14;
          top: -17px;
          left: 59px;
          width: 154px;
          padding-left: 10px;
          padding-right: 10px;
          padding-bottom: 20px;
          background: #434343;
          color: #ececec;
          border-radius: 4px;
          overflow: hidden;
          border: 0px solid #2d2d2d;
          box-sizing: border-box;
          border: 1px solid #2d2d2d;
          & > a {
            flex-shrink: 0;
            width: 24px;
            margin-left: 10px;
            margin-right: 10px;
            margin-top: 20px;
            font-size: 12px;
            & .iconfont {
              display: block;
              margin: 0 auto;
              font-size: 16px;
              padding-bottom: 2px;
            }
          }
        }
      }
      .vhall-interact.disable {
        &:hover {
          .vhall-interact-panel {
            display: none;
          }
        }
      }
      .vhall-interact-panel {
        display: none;
      }
      .vhall-tools.vhall-share {
        position: absolute;
        bottom: 20px;
        width: 60px;
        left: 50%;
        margin-left: -30px;
      }
    }
    .vhall-chats-box {
      width: 310px;
      box-sizing: border-box;
      background: rgba(67, 67, 67, 1);
      border-left: 1px solid #1f1f1f;

      //   border-top: 1px solid rgb(53, 53, 53);
      position: absolute;
      right: 0;
      bottom: 0;
      display: flex;
      height: 100%;
      flex-direction: column;
      justify-content: flex-start;
      &.assistantStyle {
        width: 100%;
      }
      .video-box {
        width: 100%;
        height: 240px;
        background: url(../../assets/livebg.png) no-repeat;
      }

      .chat-and-user-list {
        flex: 1;
        // z-index: 2;
        position: relative;
        display: flex;
        flex-direction: column;
        &.assistantStyle {
          height: 100%;
        }
        .chat-tabs-inner-box {
          font-size: 14px;
          display: flex;
          height: 40px;
          line-height: 40px;
          .tabs {
            display: block;
            color: #b8bbca;
            flex: 1;
            text-align: center;
            position: relative;
            border-bottom: 1px solid #2d2d2d;
            .tip {
              display: block;
              position: absolute;
              height: 5px;
              width: 5px;
              right: 50%;
              top: 10px;
              transform: translateX(25px);
              background: #fc5659;
              border-radius: 50%;
            }
            &:after {
              display: block;
              position: absolute;
              height: 0px;
              width: 0px;
              content: ' ';
              background: #fc5659;
              bottom: 0px;
              left: 50%;
              transform: translateX(-50%);
              transition: all 0.2s ease;
            }
            &__active {
              color: #fff;
              &:after {
                display: block;
                position: absolute;
                height: 2px;
                width: 36px;
                content: ' ';
                background: #fc5659;
                bottom: 0px;
                left: 50%;
                transform: translateX(-50%);
                transition: all 0.2s ease;
              }
            }

            &:hover {
              color: #fff;
            }
          }
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
}
.vhall-qa-switch {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 27px 23px 27px;

  & > p {
    padding: 15px 0;
    font-size: 14px;
    text-align: center;
  }
  & > div {
    line-height: 36px;
    width: 110px;
    height: 36px;
    padding: 0;
    cursor: pointer;
    color: #fff;
    border: none;
    font-size: 12px;
    text-align: center;
    background: #fc5659;
    border-radius: 4px;
    &:hover {
      background: #c51f1d;
    }
  }
}
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
#no-support-relogin {
  position: absolute;
  left: 60px;
  top: 47px;
  right: 310px;
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  text-align: center;
  color: #333;
  background: #ffd7b9;
  border: 1px solid #ff9558;
  z-index: 52;
  display: none;
}
</style>
