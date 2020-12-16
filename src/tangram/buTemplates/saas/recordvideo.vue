<template>
  <div class="records-wrap" v-if="roomReady" ref="mainWrap">
    <div v-if="!assistantType" class="vhall-header">
      <!-- <div @click = 'aaa'>1111111111111111111111111111111111111111</div> -->
      <div class="vhall-header-left">
        <div class="vhall-room-name" :title="roomInfo.subject">{{ roomInfo.subject || '房间名称'}}</div>
        <div class="vhall-room-id-container">
          <div class="vhall-room-id-icon">ID</div>
          <div class="vhall-room-id">{{ ilId }}</div>
          <div class="vhall-room-id-copy" @click="doCopy">
            <i class="iconfont iconfuzhi"></i>
          </div>
        </div>
      </div>
      <div class="vhall-header-right">
        <div class="vhall-main-area-tools--doc-control" v-if="roomInfo.room_id"></div>
        <!-- <record
          v-auth="100020"
          @recordFun="recordFun"
          ref="recordRef"
          :cut_record_status="cut_record_status"
        ></record> -->
        <div
          class="vhall-room-connect vhall-room-operation"
          style="width: 120px; margin-right: 20px"
          v-if="roomInfo.role_name == 4 && status == 1 && !isBanned"
          @click="applyMic()"
        >
          <span v-show="!isApplying && !applyWating && !allBanned&&connectable">申请上麦</span>
          <span v-show="applyWating">等待应答({{ applyTimerCount }}s)</span>
          <span v-show="isApplying">下麦</span>
        </div>
        <span v-if="envCheckResult">
          <div
            v-auth="100021"
            class="vhall-room-play vhall-room-operation stop"
            v-if="isPublishing && !stopping"
            @click="stopRecord"
          >
            <span class="duration">{{liveDuration || '初始化中'}}</span>
            <span class="stoptext">结束录制</span>
          </div>
          <div
            class="vhall-room-play vhall-room-operation"
            v-if="roomInfo.role_name == '1' && isPublishing&&stopping"
          >正在结束...</div>
          <div
            class="vhall-room-play vhall-room-operation"
            v-if="roomInfo.role_name == '1' && !isPublishing&&!starting"
            @click="startRecord"
          >开始录制</div>
          <div
            class="vhall-room-play vhall-room-operation"
            v-if="roomInfo.role_name == '1' && !isPublishing&&starting"
          >正在启动...</div>
          <!-- <div class="vhall-room-play vhall-room-operation"></div> -->
        </span>
        <span v-else-if="envChecked && !envCheckResult">
          <div
            class="vhall-room-play vhall-room-operation"
            @click="ReDetection"
            v-if="roomInfo.role_name != 3"
          >重新检测</div>
        </span>
        <div class="vhall-room-user-icon-contaier">
          <div
            class="vhall-room-user-icon-index"
            :style="userInfo.avatar?{'background-image': `url(${userInfo.avatar})`}:{}"
          >
            <i></i>
            <div class="vhall-user-frame" v-if="!(isEmbed&&roleName==3)">
              <div class="vhall-user-frame-head">
                <span class="vhall-user-type">{{roleMap[roleName]}}</span>
                <span class="vhall-user-name">{{userInfo.nick_name}}</span>
              </div>
              <div class="vhall-user-frame-bottom">
                <div
                  :class="{disable:thirdPartyMobild}"
                  v-if="roomInfo.role_name == '1'  || roomInfo.role_name == '4' "
                  class="vhall-user-mediasetting"
                  @click="openMediaSettings"
                >
                  <i class="iconfont iconmeitishezhi"></i>
                  媒体设置
                </div>
                <div
                  class="vhall-user-quit"
                  @click="thirdPartyClose"
                  v-if="thirdPartyBtn && thirdPartyMobild"
                >
                  <i class="icondisanfangfaqi iconfont"></i>
                  网页发起
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="vhall-main-area" :class="assistantType ? 'assistantStyle':''">
      <div class="thirdParty-warp" v-if="!assistantType && thirdPartyMobild && NoDocShow">
        <thirdParty :roomId="roomInfo.room_id" :vssToken="vssToken"></thirdParty>
      </div>
      <div
        v-if="!assistantType || (assistantType && assistantType == 'doc')"
        class="vhall-main-area-tools"
        :class="assistantType=='doc' ? 'assistantStyle':''"
      >
        <!-- 签到 -->
        <sign-in
          v-if="roomInfo.room_id"
          ref="signin"
          :vss_token="vssToken"
          :room_id="roomInfo.room_id"
          :masterEnd="true"
        ></sign-in>

        <!-- 转播 -->
        <popup
          :visible="rebroadcastVisible"
          :onClose="closeRebroadcast"
          :height="'470px'"
          :width="'830px'"
          :title="'转播'"
        >
          <rebroadcast
            :visible="rebroadcastVisible"
            v-if="params_verify_token"
            :webinar_id="ilId"
            :params_verify_token="params_verify_token"
            @onClose="closeRebroadcast"
            :roomId="roomInfo.room_id"
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
          :onClose="() => { showQuestion = false }"
        >
          <question
            :ilId="ilId"
            :roomId="roomInfo.room_id"
            :appId="roomInfo.app_id"
            :accountId="roomInfo.account_id"
            :accessToken="roomInfo.paas_access_token"
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
          <div class="vhall-qa-switch">
            <p v-if="!isQAEnabled">开启后，右侧互动区会增加“问答”模块，可进入右下角“问答管理”对观众提问进行处理。</p>
            <div v-if="!isQAEnabled" @click="enableQA">开启问答</div>
            <p v-if="isQAEnabled">
              该功能已开启，是否关闭？
              当前已收集问题：{{qaCount}}个
            </p>
            <div v-if="isQAEnabled" @click="enableQA">关闭问答</div>
          </div>
        </popup>
        <!-- 发红包 -->
        <popup :visible="RedPacketVisible" :header-show="false">
          <redcoupon @onClose="closeRedPacketPopup" :roomId="roomId" :vssToken="vssToken"></redcoupon>
        </popup>
        <!-- 红包未领取完 -->
        <popup :visible="hadEnvelopeVisible" :header-show="false">
          <hadEnvelope
            :room_id="roomInfo.room_id"
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
          <share :url="shareUrl" :domains="domains"></share>
        </popup>

        <!-- 设备设置 -->
        <popup
          :visible="mediaSettingVisible"
          :onClose="closeMediaSettings"
          :title="'设置'"
          :width="'380px'"
        >
          <mediasettings
            v-if="!assistantType"
            :editorAble="mediaSettingVisible"
            :roleName="roleName"
            :isInteract="false"
            :layout="layout"
            :vssToken="vssToken"
            :roomId="roomInfo.room_id"
            :visible="mediaSettingVisible"
            :status="status"
            @close="closeMediaSettings"
            ref="mediasettingsRef"
          ></mediasettings>
        </popup>

        <!-- 文档-end -->
        <a
          href="javascript:;"
          :class="['vhall-tools','vhall-docs',isDocEnabled ? 'enabled' : '',doc_permission != roomInfo.third_party_user_id ? 'disable':'']"
          @click="showDoc"
        >
          <i class="iconfont iconwendang"></i>文档
        </a>
        <a
          href="javascript:;"
          :class="['vhall-tools','vhall-whiteboard',isWhiteBoardEnabled ? 'enabled':'',doc_permission != roomInfo.third_party_user_id ? 'disable':'']"
          @click="showWhiteBoard"
        >
          <i class="iconfont iconbaiban"></i>白板
        </a>
      </div>
      <!-- 文档列表 -->
      <doc-list
        v-if="!assistantType || (assistantType && assistantType == 'doc')"
        :accountId="roomInfo.third_party_user_id"
        :isEnjoy="false"
        :roomId="roomInfo.room_id"
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
      <div class="record-end-main" v-show = 'recordEndShow || recordResultShow'>
        <div v-show = 'recordEndShow' class = 'record-end' >
            <p class="end-title">录制已结束，给录制内容添加一个标题吧！</p>
            <el-input maxlength="30" v-model = 'recordTitleInput' style="width: 320px; text-align: center; height: 45px; margin-top: 15px;"></el-input>
            <p class="end-describe">*最多可输入30个字符</p>
            <div class="record-button">
              <el-button @click = 'endSave' type = 'danger' class="end-save" >直接保存</el-button>
              <el-button @click = 'goCutting' class="end-cutting">前往剪辑</el-button>
            </div>
        </div>
        <div v-show = 'recordResultShow' class="record-end-result">
          <p>录制已生成，可前往 <a :href="contentAdminHref"> 内容管理</a>查看</p>
        </div>
      </div>
      <div class="vhall-main-area--content" v-show = '!recordEndShow && !recordResultShow'>
        <!-- 订阅流区域 -->
        <streams
          v-if="!assistantType && roomInfo.role_name != 3"
          :style="roomInfo.role_name == 3 ? 'height: 0' : ''"
          v-show="rebroadcast==''||rebroadcast=='rebroadcastEnd'"
          :speakerList="speakerList"
          :accountId="roomInfo.third_party_user_id"
          :roomId="roomInfo.room_id"
          :roleName="roomInfo.role_name"
          :isDocShow="isDocShow"
          :mainScreen="mainScreen"
          :miniElement="miniElement"
          :isInteract="isInteract"
          :layout="layout"
        >
          <!-- 互动区域 -->
          <Interactive
            v-if="roomInfo.third_party_user_id && roomInfo.app_id"
            :mainScreen="mainScreen"
            :miniElement="miniElement"
            :isDocShow="isDocShow"
            :inavId="roomInfo.inav_id"
            :roomId="roomInfo.room_id"
            :appId="roomInfo.app_id"
            :accountId="roomInfo.third_party_user_id"
            :ownerId="roomInfo.account_id"
            :nickName="userInfo.nick_name"
            :token="roomInfo.paas_access_token"
            :vssToken="vssToken"
            :speakerList="speakerList"
            :role="role"
            :roleName="roomInfo.role_name"
            :layout="layout"
            :status="status"
            :isInteract="isInteract"
            :webinarId="ilId"
            ref="interactive"
          ></Interactive>
        </streams>
        <!-- 只有在录制中显示该播放器 -->
        <player
          v-if="!assistantType && ((roomInfo.paas_access_token && rebroadcast!=''&&rebroadcast!='rebroadcastEnd') || roomInfo.role_name == 3)"
          :appId="roomInfo.app_id"
          :playerInfo="{}"
          class="vhall-miniBox"
          :accountId="roomInfo.third_party_user_id"
          :token="roomInfo.paas_access_token"
          :type="'live'"
          :id="'xxx'"
          :liveOption="{roomId:roomInfo.room_id,type:'flv'}"
          ref="vhallPlayer"
        ></player>
        <div class="vhall-document-container">
          <!-- 桌面共享显示区 -->
          <share-screen
            v-if="!assistantType && roomInfo.role_name != 3"
            :ownerId="roomInfo.account_id"
            :mainScreen="mainScreen"
            :accountId="roomInfo.third_party_user_id"
            :roleName="roomInfo.role_name"
          ></share-screen>

          <!-- 文档区域 -->
          <doc
            :class="miniElement == 'doc' ? 'vhall-miniBox vhall-saas-miniArea' : ''"
            ref="doc"
            v-if="!assistantType || (assistantType && assistantType == 'doc')"
            :webinarId="ilId"
            :docPermissionId="doc_permission"
            :roleName="roomInfo.role_name"
            :room-id="roomInfo.room_id"
            :channel-id="roomInfo.channel_id"
            :appId="roomInfo.app_id"
            :token="roomInfo.paas_access_token"
            :live-status="roomInfo.status"
            :accountId="roomInfo.third_party_user_id"
            :documentId="documentId"
            :isInteract="isInteract"
          >
            <!-- 兼容轻享写法 -->
            <!-- <template slot="whiteBoard">
              <span style="display:none"></span>
            </template>-->
            <template slot="liveEnd">
              <!--              <div class="thirdParty-warp live-end" v-show="LiveEndMobild">-->
              <!--                <liveEnd :tooTimeFew="tooTimeFew" :layout="layout"></liveEnd>-->
              <!--              </div>-->
            </template>
            <template slot="mainplaceholder" slot-scope="{docContainerShow}">
              <div v-show="!docContainerShow&&!rebroadcast" class="vhall-main-placeholder">
                <i class="iconfont iconweizhibozhanweitu"></i>
                <span>可在此区域进行文档、白板演示等操作</span>
              </div>
              <div v-show="rebroadcast" class="vhall-main-placeholder">
                <i class="iconfont iconzanwuwendang"></i>
                <span>转播中...</span>
              </div>
            </template>
            <!-- 兼容轻享写法 -->
            <!-- <template slot="watchControl">
              <span style="display:none"></span>
            </template>-->
            <!-- 缩略图 区域 -->
            <template slot="humbnailList">
              <!-- 展开缩略图区域 -->
              <div
                v-show="!isWhiteBoardEnabled"
                :class="isThumbnailEnabled?'document-thumbnail enabled':'document-thumbnail'"
                title="文档缩略图"
                @click="toggleThumbnail"
              >
                <i class="iconfont iconsuolvetu"></i>
              </div>
              <div
                :class="isThumbnailEnabled?'vhall-document-thumbnail-container visible':'vhall-document-thumbnail-container'"
                ref="thumbnailList"
              >
                <!--                <smooth-scrollbar>-->
                <div class="vhall-document-thumbnail">
                  <div
                    v-for="(thumbnail,index) in documentThumbnailList"
                    :key="thumbnail"
                    @click="goToPage(index)"
                    :class="selectedDocumentPage == index?'selected':''"
                  >
                    <span>{{index + 1}}</span>
                    <img :src="thumbnail" />
                  </div>
                </div>
                <!--                </smooth-scrollbar>-->
              </div>
            </template>

            <template slot="placeholder" slot-scope="{docShowType}">
              <div v-show="!docShowType" class="vhall-document-placeholder">
                <i class="iconfont iconzanwuwendang"></i>
                <span>暂未分享任何文档</span>
              </div>
            </template>

            <!-- 画笔工具区 -->
            <template slot="pencilControlBar">
              <div class="vhall-document-operationbar">
                <div class="button-container">
                  <div
                    class="choose-document"
                    @click="chooseDocument"
                    v-show="!isWhiteBoardEnabled"
                  >选择文档</div>
                  <div class="audience-visible">
                    观众可见
                    <div
                      :class="docVisibleToAudience?'toggle-button enabled':'toggle-button'"
                      @click="toggleDocumenVisiblity(!docVisibleToAudience)"
                    >
                      <span></span>
                    </div>
                    <div class="alert" v-show="DocTipsAlert">
                      <div class="v-show-tips">
                        <div class="triangle_border_up"></div>
                        <span class="iconfont iconguanbi1" @click="closeDocTips"></span>
                        如果想让观众看到文档/白板内容， 必须开启“观众可见”开关
                      </div>
                    </div>
                  </div>
                </div>

                <div class="vhall-document-pencilbar">
                  <div
                    class="choose"
                    :class="{active:docToolStatus.docToolActive == 'cancelDrawable'}"
                    title="选择"
                    @click="handleControlBar('cancelDrawable')"
                  >
                    <i class="iconfont iconxuanze"></i>
                  </div>
                  <div class="pencil" :class="{active:docToolStatus.docToolActive == 'hb'}">
                    <i class="iconfont iconhuabi" title="画笔" @click.stop="handleControlBar('hb')"></i>
                    <span></span>
                    <div class="list-wrapper">
                      <div class="list-container">
                        <div class="size-list">
                          <div
                            v-for="size in sizeArr"
                            :key="size"
                            :title="size"
                            :class="{active:docToolStatus.hb.width == size}"
                            @click.stop="handleControlBar('hb',size)"
                          >
                            <i
                              class="iconfont iconhuabichicun"
                              :title="size"
                              :style="`font-size:12px;transform:scale(${size/12})`"
                            ></i>
                          </div>
                        </div>
                        <div class="color-list">
                          <div
                            v-for="color in colorArr"
                            :key="color.color"
                            :class="{active:docToolStatus.hb.color == color.color}"
                            :title="color.title"
                            @click.stop="handleControlBar('hb',color.color)"
                          >
                            <div :style="`background-color:${color.color}`"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="laserpointer"
                    :class="{active:docToolStatus.docToolActive == 'ygb'}"
                    title="荧光笔"
                  >
                    <i class="iconfont iconjiguangbi" @click.stop="handleControlBar('ygb')"></i>
                    <span></span>
                    <div class="list-wrapper">
                      <div class="list-container">
                        <div class="size-list">
                          <div
                            v-for="size in sizeArr"
                            :key="size"
                            :title="size"
                            :class="{active:docToolStatus.ygb.width == size}"
                            @click.stop="handleControlBar('ygb',size)"
                          >
                            <i
                              class="iconfont iconhuabichicun"
                              :style="`font-size:12px;transform:scale(${size/12})`"
                            ></i>
                          </div>
                        </div>
                        <div class="color-list">
                          <div
                            v-for="color in colorArr"
                            :key="color.color"
                            :class="{active:docToolStatus.ygb.color == color.color}"
                            :title="color.title"
                            @click.stop="handleControlBar('ygb',color.color)"
                          >
                            <div :style="`background-color:${color.color}`"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="shape"
                    :class="{active:docToolStatus.docToolActive == 'graph'}"
                    title="形状"
                  >
                    <i class="iconfont icontuxing" @click.stop="handleControlBar('graph')"></i>
                    <span></span>

                    <div class="list-wrapper">
                      <div class="list-container">
                        <div class="size-list">
                          <div
                            v-for="shape in shapeArr"
                            :key="shape.value"
                            :title="shape.tex"
                            :class="{active:docToolStatus.graph.value == shape.value}"
                            @click.stop="handleControlBar('graph',shape.value)"
                          >
                            <i :class="shape.icon" style="font-size:16px"></i>
                          </div>
                        </div>
                        <div class="color-list">
                          <div
                            v-for="color in colorArr"
                            :key="color.color"
                            :title="color.title"
                            :class="{active:docToolStatus.graph.color == color.color}"
                            @click.stop="handleControlBar('graph',color.color)"
                          >
                            <div :style="`background-color:${color.color}`"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    class="font"
                    title="文字"
                    :class="{active:docToolStatus.docToolActive == 'font'}"
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
                            :class="{active:docToolStatus.font.width == font.value}"
                            @click.stop="handleControlBar('font',font.value)"
                          >
                            <i :style="`font-size:${font.showSize}px;font-style:normal`">{{font.label}}</i>
                          </div>
                        </div>
                        <div class="color-list">
                          <div
                            v-for="color in colorArr"
                            :key="color.color"
                            :title="color.title"
                            :class="{active:docToolStatus.font.color == color.color}"
                            @click.stop="handleControlBar('font',color.color)"
                          >
                            <div :style="`background-color:${color.color}`"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="eraser"
                    :class="{active:docToolStatus.docToolActive == 'eraser'}"
                    @click.stop="handleControlBar('eraser',false)"
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
                    :class="{active:docToolStatus.docToolActive == 'clear'}"
                    @click.stop="handleControlBar('clear',false)"
                    title="清除"
                  >
                    <i class="iconfont iconqingkong"></i>
                  </div>
                  <!-- <div class="undo" title="撤销">
                    <i class="iconfont iconchexiao"></i>
                  </div>
                  <div class="redo" title="重做">
                    <i class="iconfont iconzhongzuo"></i>
                  </div>-->
                </div>
              </div>
            </template>
          </doc>
        </div>
      </div>
      <!-- 右侧聊天区域 -->
      <div
        v-if="!assistantType || (assistantType && assistantType == 'chat')"
        class="vhall-chats-box"
        :class="assistantType == 'chat' ? 'assistantStyle':''"
      >
        <div v-if="!assistantType" class="video-box" style="position: relative; overflow: hidden">
          <img
            src="../../assets/thirdDefault.png"
            width="100%"
            height="100%"
            alt
            v-show="thirdPartyMobild && isPublishing"
          />
          <!-- 录制 - 占位区域 -->
        </div>
      </div>
    </div>

    <div></div>

    <div v-if="!assistantType">
      <!-- 嘉宾邀请弹框 -->
      <popup
        :visible="UpperVisible"
        :onClose="closeUpper"
        :background="'#E8E8E8'"
        :width="'438px'"
        :headerShow = 'false'
      >
<!--        <div class="upper-modal-body">-->
<!--          <p>主持人邀请您上麦</p>-->
<!--          <a href="javascript:;" class="v-comfirm" @click="AgreeUpper">同意</a>-->
<!--          <a href="javascript:;" @click="refuseUpper" class="v-cancle">-->
<!--            不同意(-->
<!--            <span class="v-times">{{UpperTime}}</span>s)-->
<!--          </a>-->
<!--        </div>-->
        <div class="visit-wrap-pop">
          <div class="recordboxHeader">
            <span>邀请上麦</span>
            <a href="javascript:;" @click="closeUpper" class="iconfont iconguanbi1" ></a>
          </div>
          <div class="upper-modal-body">
            <p>主持人邀请您上麦</p>
            <a href="javascript:;" class="v-comfirm" @click="AgreeUpper">同意</a>
            <a href="javascript:;" @click="refuseUpper" class="v-cancle">
              不同意(
              <span class="v-times">{{UpperTime}}</span>s)
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
        <div slot="content">{{PopAlert.context}}</div>
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
    </div>
    <lottery
      v-if="!assistantType || (assistantType && assistantType == 'doc')"
      :roomId="roomInfo.room_id"
      :vssToken="vssToken"
      ref="lotterySon"
    ></lottery>
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
import EventBus from '@/utils/Events';
import Mediasettings from '../../libs/media-settings';
import Question from '../../libs/question/saas';
import SignIn from '../../libs/saas-signin';
import Popup from '../../libs/saas-popup';
import SassAlert from '../../libs/saas-popup/alert';
import Rebroadcast from '../../libs/rebroadcast';
import Qa from '../../libs/qa';
import shadowsMixin from '../../libs/shadows/shadow';
import checkMixin from '../../libs/envCheck';
import SaasMember from '../../libs/saas-member';
import lottery from '../../libs/lottery'; // 抽奖
import redcoupon from '../../libs/redcoupon'; // 发红包
import hadEnvelope from '../../libs/redcoupon/hadEnvelope'; // 发红包
import record from './record';
import share from '../../libs/share';
import notice from '../../libs/notice'; // 公告
import thirdParty from '../../libs/thirdParty'; // 第三方发起
import liveEnd from '../../libs/liveEnd'; // 录制结束
import jiabinMixin from './mixin/jiabin';
import player from '../../libs/player/index'; // 录制结束
import shareScreen from '../../libs/desktopScreen';
import { assitantMixin } from './mixin/assitantMixin';
BScroll.use(ScrollBar);
BScroll.use(MouseWheel);
export default {
  name: 'vhallRecordSaas',
  props: {
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
      default: false
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
      // 创建录制时上传的文档Id
      required: true
    },
    record_notice: {
      required: true
    },
    isEmbed: {
      required: false // 是否为嵌入页
    },
    is_recording: {
      required: false
    },
    docLowPriority: {
      required: true
    }
  },
  components: {
    SassAlert,
    hadEnvelope,
    Interactive,
    streams,
    DocList,
    Doc,
    ChatComponent,
    Mediasettings,
    Question,
    SignIn,
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
    liveEnd,
    player,
    shareScreen
  },

  mixins: [shadowsMixin, jiabinMixin, assitantMixin, checkMixin],

  data () {
    return {
      sid: '', // 录制ID
      contentAdminHref: '', // 内容管理的链接
      recordEndShow: false, // 点完结束录制后显示的
      recordResultShow: false, // 直接保存之后显示的
      recordTitleInput: '', // 录制输入框的内容
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
          show: true,
          src: 'javascript:;'
        }
      },
      starting: false,
      stopping: false,
      interactOn: false,
      mediaSettingVisible: false,
      rebroadcastVisible: false,
      webinar_id: this.ilId,
      qaVisible: false,
      qaCount: 0,
      isQAEnabled: false,
      isFullscreen: false,
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
      speakerList: [], // 上麦列表
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

      envCheckResult: false,
      envChecked: false,
      isDocShow: true,
      mainScreen: '',
      isBanned: false, // 是否被禁言
      allBanned: false, // 是否全体禁言
      status: 0, // 录制状态
      rebroadcast: '', // 转播状态 值为truthy并等于后台返回的录制中'rebroadcastingroomid'的时候表示录制中，值为'rebroadcastend'的时候转播结束但是在录制中，falsy的时候非转播
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
      connectable: true // 嘉宾是否可上麦
    };
  },
  provide () {
    return {
      docToolStatus: this.docToolStatus
    };
  },
  created () {
    this.$loadingStus = this.$loading();
    if (sessionStorage.getItem(this.$route.params.il_id)) {
      this.DocTipsAlert = false;
    }
    this.assistantType = this.$route.query.assistantType;
    console.log('=======this.assistantType======', this.assistantType);
  },

  mounted () {
    window.addEventListener(
      'fullscreenchange',
      e => {
        if (document.fullscreenElement) {
        } else {
          this.isFullscreen = false;
        }
      },
      true
    );
    EventBus.$on('live_start', () => {
      this.status = 1; // 开始录制变更录制状态
    });
    EventBus.$on('live_over', () => {
      this.status = 2; // 开始直播变更直播状态
      this.documentThumbnailList = [];
      this.isThumbnailEnabled = false;
      this.isDocEnabled = true;
      this.isWhiteBoardEnabled = false;
      // 结束直播时当前主讲人不是主持人， 就设置为主持人
      if (this.doc_permission != this.roomInfo.account_id) {
        this.doc_permission = this.roomInfo.account_id;
      }
      // 结束直播时 更新当前 speakerList
      this.speakerList = this.speakerList.filter(item => {
        return item.account_id == this.roomInfo.account_id;
      });
      this.$refs.mediasettingsRef.selectedRate = '';
      sessionStorage.setItem('speakerDefinition', '');
      sessionStorage.setItem('selectedRate', '');
    });
    EventBus.$on('startLive', () => {
      this.calculateLiveDuration(1);
      this.isPublishing = true;
      this.starting = false;
      this.stopping = false;
      this.LiveEndMobild = false;
      this.status = 1; // 开始直播变更直播状态
    });
    EventBus.$on('endLive', () => {
      console.log('jiesuzhibo>>>>>>>>>>>>>>>>>>>>>');
      window.clearInterval(this.durationInterval);
      this.isPublishing = false;
      this.starting = false;
      this.stopping = false;
      this.status = 2; // 结束录制变更录制状态
      sessionStorage.removeItem(this.$route.params.il_id, 'true'); // 删除doc提示框
      this.$refs.recordRef.stop(); // 停止录制
      this.$refs.interactive.exchangeDoc();
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
            this.PopAlert.visible = true;
            this.PopAlert.confirm = true;
            this.PopAlert.resId = res.data.id;
          })
          .catch(error => { console.log(error); });
      }
      this.localDuration = 0;
      this.liveDuration = '';
    });

    EventBus.$on('_endLive', () => {
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

    EventBus.$on('docInfo', docInfo => {
      console.log('docInfo', docInfo);
      if (docInfo.docShowType == 'document' || !docInfo.docShowType) {
        this.isDocEnabled = true;
        this.isWhiteBoardEnabled = false;
      } else if (docInfo.docShowType == 'board') {
        this.isWhiteBoardEnabled = true;
        this.isDocEnabled = false;
        this.isThumbnailEnabled = false;
      }
      if (docInfo.docContainerShow) {
        this.NoDocShow = false;
      }
      this.docVisibleToAudience = docInfo.showInWatch;
      if (
        this.isDocEnabled &&
        this.doc_permission == this.roomInfo.third_party_user_id && this.permission.includes(100030)
      ) {
        this.$nextTick(() => {
          const docThumbnails = this.$refs.doc.getThumibnailList() || [];
          this.documentThumbnailList = docThumbnails[0] ? docThumbnails[0].list : [];
          this.isThumbnailEnabled = true;
          this.scrollInitDocMin();
        });
      }
    });

    EventBus.$on('remote_doc_select', e => {
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
    EventBus.$on('documenet_load_complete', e => {
      this.documentThumbnailList = e;
      this.scrollInitDocMin();
      this.scrollThumbnailList && this.scrollThumbnailList.scrollTo && this.scrollThumbnailList.scrollTo(0, 0);
      if (!e.length) {
        this.isThumbnailEnabled = false;
      }
    });
    EventBus.$on('PAGE_CHANGE', (index) => {
      this.selectedDocumentPage = index;
    });

    EventBus.$on('demonstration', e => {
      this.isThumbnailEnabled = true;
    });

    EventBus.$on('deviceSuccess', e => {
      if (e.type == 'deviceCheck') {
        console.log('设备检测结果', e, this.status, this.assistantType);
        this.envChecked = true;
        this.envCheckResult = (e.audio && this.roleName == 1) || (e.audio && e.video); // 只要有音频设备 设备检测通过
        if (!this.envCheckResult) {
          this.$message({
            type: 'error',
            message:
              this.layout == 2
                ? '发起录制前，请先允许访问麦克风'
                : '发起录制前，请先允许访问摄像头和麦克风'
          });
        } else {
          if (this.status != 1) {
            if (this.assistantType) {
              return;
            }

            if (this.roomInfo.roleName == 1) {
              this.$message({
                type: 'success',
                message: '设备检测通过，可以发起录制'
              });
            }
          }
        }
      }
    });

    EventBus.$on('vrtc_speaker_switch', (msg) => {
      if (this.roomInfo.third_party_user_id == msg.room_join_id && this.roomInfo.account_id == this.roomInfo.third_party_user_id) {
        // 主持人被设置成为主讲人。 自动跳过提示
      } else {
        this.$message.success(`${msg.nick_name}设置成为主讲人`);
      }
    });

    // 动态切换布局 --
    EventBus.$on('vhallLayoutExchange', value => {
      this.miniElement = value;
    });

    // 结束录制清空上麦列表
    EventBus.$on('live_over', msg => {
      this.speakerList = this.speakerList.filter((item) => {
        return item.account_id == this.roomInfo.account_id;
      });
    });

    // 手动维护在线上麦人员列表 - 上线
    EventBus.$on('vrtc_connect_success', e => {
      console.log('用户上麦了', e);
      let check = findIndex(this.speakerList, (item) => {
        return item.account_id == e.data.room_join_id;
      });

      if (check < 0) {
        this.speakerList.push({
          account_id: e.data.room_join_id,
          audio: e.data.vrtc_audio_status == 'on' ? 1 : 0,
          nick_name: e.data.nick_name,
          role_name: Number(e.data.room_role),
          video: e.data.vrtc_video_status == 'on' ? 1 : 0
        });
      }
    });

    // 手动维护在线上麦人员列表 - 下线
    EventBus.$on('vrtc_disconnect_success', e => {
      console.log('手动维护在线上麦人员列表 - 下线', e);

      this.speakerList = this.speakerList.filter((item) => {
        return item.account_id != e.target_id;
      });
    });

    // 互动设置主讲人
    EventBus.$on('vrtc_speaker_switch', msg => {
      this.doc_permission = msg.room_join_id;
    });

    window.addEventListener('beforeunload', (event) => {
      event.preventDefault();
      if (this.isPublishing) {
        event.returnValue = '请结束录制后离开页面';
      }
    });
  },
  watch: {
    roomId (newVal) {
      this.getInavInfo();
      this.shareUrl = `https:${this.domains.web}room/watch/${this.ilId}`;
      this.localDuration = this.duration;
    },
    permission (newval) {
      EventBus.$emit('permission', newval);
      this.initThirdPermis();
    }
  },
  methods: {
    // 直接保存
    endSave () {
      this.$vhallFetch('createrecord', {
        webinar_id: this.ilId,
        user_id: this.third_party_user_id,
        params_verify_token: this.params_verify_token,
        name: this.recordTitleInput,
        sid: this.sid,
        type: 1
      }).then(res => {
        if (res.code == 200) {
          this.recordEndShow = false;
          this.recordResultShow = true;
          this.contentAdminHref = `/mywebinar/recordpart/${this.ilId}`;
          // res.data.id
        }
      });
    },
    // 去剪辑
    goCutting () {
      window.location.href = `/mywebinar/addrecord/${this.ilId}?name=${this.recordTitleInput}&sid=${this.sid}`;
    },
    // 开始录制的功能
    startRecord () {
      // startrecord
      this.$vhallFetch('startrecord', {
        webinar_id: this.ilId,
        user_id: this.third_party_user_id,
        params_verify_token: this.params_verify_token
      }).then(res => {
        if (res.code == 200) {
          // recordEndShow || recordResultShow'
          EventBus.$emit('live_start');
          this.recordEndShow = false;
          this.recordResultShow = false;
          this.starting = true;
          this.stopping = false;
          this.sid = res.data.sid;
          localStorage.setItem('sid', this.sid || '');
          this.$refs.interactive.$streamPush().then(() => {
            this.$refs.interactive.startBroadCast();
            this.isPublishing = true;
            this.localDuration = 0;
            this.calculateLiveDuration(1);
          })
            .catch(e => {
              this.$message.error('发起录制失败');
            });
        }
      });
    },
    async stopRecord () {
      await this.$refs.interactive.$streamStop();
      this.$refs.interactive.stopBradCast();
      this.$vhallFetch('stoprecord', {
        webinar_id: this.ilId,
        user_id: this.third_party_user_id,
        params_verify_token: this.params_verify_token
      }).then(res => {
        if (res.code == 200) {
          console.log('结束推流');
          if (this.localDuration <= 30) {
            this.$message.error('录制时间过短，生成回放失败！');
            this.sid = res.data.sid;
            localStorage.setItem('sid', '');
            this.stopping = true;
            this.starting = false;
            this.localDuration = 0;
            this.isPublishing = false;
          } else {
            this.sid = res.data.sid;
            localStorage.setItem('sid', '');
            this.stopping = true;
            this.starting = false;
            this.localDuration = 0;
            this.isPublishing = false;
            this.recordEndShow = true;
          }
        }
      });
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
    // 邀请上下麦
    getWatchUpperMsg () {
      clearInterval(this.UpperTimerInter);
      this.UpperVisible = true;
      this.UpperTime = 25;
      this.UpperTimerInter = setInterval(() => {
        this.UpperTime = this.UpperTime - 1;
        if (this.UpperTime == 0) {
          this.refuseUpper();
          this.$message.warning({
            message: `由于您长时间没有响应，导致上麦失败`
          });
          clearInterval(this.UpperTimerInter);
        }
      }, 1000);
    },
    AgreeUpper () {
      clearInterval(this.UpperTimerInter);
      if (!this.connectable) {
        this.UpperVisible = false;
        return this.$message('无视频设备，无法上麦');
      }
      this.isApplying = true;
      setTimeout(() => {
        this.$refs.interactive.speakOn();
      }, 2000);
      this.UpperVisible = false;
    },
    refuseUpper () {
      this.UpperVisible = false;
      let data = {
        receive_account_id: this.roomInfo.third_party_user_id,
        room_id: this.roomInfo.room_id
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
        if (this.scrollThumbnailList) {
          this.scrollThumbnailList.refresh();
          return;
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
      // 判断是否发起第三方权限，只有录制才有
      if (this.permission.includes(100023)) {
        this.thirdPartyBtn = true;
      }
      console.log(this.permission);
    },
    thirdPartyShow () {
      if (this.isPublishing) {
        this.$message.error('请先结束录制');
        return;
      }
      this.thirdPartyMobild = true;
      this.NoDocShow = true;
    },
    thirdPartyClose () {
      if (this.isPublishing) {
        this.$message.error('请先结束录制');
        return;
      }
      this.thirdPartyMobild = false;
      this.NoDocShow = false;
    },
    getInavInfo () {
      this.$vhallFetch('getInavInfo', {
        room_id: this.roomId
      })
        .then(async res => {
          console.log('vss roomInfo', res);
          this.roomInfo = res.data;
          this.userInfo = JSON.parse(sessionStorage.getItem('user'));
          this.webinar_id = res.data.webinar_id;
          this.status = res.data.status;
          this.isPublishing = this.status == 1;
          // this.is_recording == 1 ? this.isPublishing = true : this.isPublishing = false
          // // this.isPublishing = res.data.is_recording == 1
          // if(this.is_recording == 1){
          //   this.stopping = false
          // }else{
          //   this.stopping = true
          // }
          this.isQAEnabled = this.qaStatus == 1;
          this.roleName = res.data.role_name;
          this.layout = res.data.layout;
          this.localDuration = this.duration;

          await this.getUserStatus();
          this.getRoomStatus();
          let context = {
            nickname: this.userInfo.nick_name, // 昵称
            avatar: this.userInfo.avatar
              ? `https:${this.userInfo.avatar}`
              : 'https://cnstatic01.e.vhall.com/3rdlibs/vhall-static/img/default_avatar.png', // 头像
            // pv: 100, // pv
            role_name: this.roomInfo.role_name, // 角色 1主持人2观众3助理4嘉宾
            device_type: '2', // 设备类型 1手机端 2PC 3SDK
            device_status: '0', // 设备状态  0未检测 1可以上麦 2不可以上麦
            is_banned: this.isBanned // 是否禁言 1是0否
          };
          let opt = {
            appId: this.roomInfo.app_id,
            third_party_user_id: this.roomInfo.third_party_user_id,
            channelId: this.roomInfo.channel_id,
            context: JSON.stringify(context),
            token: this.roomInfo.paas_access_token,
            hide: this.$route.query.hide == 1
          };
          VhallChat.createInstance(
            opt,
            chat => {
              window.chatSDK = chat.message;
              console.log(window.chatSDK);
              this.roomReady = true;
              this.$loadingStus.close();
              EventBus.$on('sdkReady', () => {
                if (!this.assistantType && this.roomInfo.role_name != 3) {
                  this.vhallChecking();
                }
              });
            },
            err => {
              console.error('聊天SDK实例化失败', err);
            }
          );
          // vhallChecking
          // Vhall.config({
          //   appId: this.roomInfo.app_id, // 应用 ID ,必填
          //   accountId: this.roomInfo.third_party_user_id, // 第三方用户唯一标识,必填
          //   token: this.roomInfo.paas_access_token // token必填
          // })

          // Vhall.ready(() => {
          //   console.log('sdk is ready', '开始挂载组件')

          //   window.chatSDK = window.VhallChat({
          //     channelId: this.roomInfo.channel_id,
          //     context: {
          //       isMobile: false
          //     }
          //   })
          // })
        })
        .catch(e => {
          console.log(e);
        });
    },
    /**
     * 得到用户状态是否被禁言/踢出
     */
    getUserStatus () {
      return new Promise((resolve, reject) => {
        let data = {
          room_id: this.roomInfo.room_id,
          account_id: this.roomInfo.third_party_user_id
        };
        this.$vhallFetch('getUserStatus', data).then(res => {
          this.isBanned = res.data.is_banned == '1';
          resolve();
        });
      });
    },
    /**
     * 获取房间状态，是否开启文档/白板/举手/主讲人...
     */
    getRoomStatus () {
      this.$vhallFetch('getRoomStatus', {
        room_id: this.roomId
      })
        .then(res => {
          if (res.data.start_type == 4) {
            this.thirdPartyMobild = true;
          }
          this.allowHandup = Boolean(res.data.is_handsup);
          this.allBanned = res.data.all_banned == 1;
          this.doc_permission = res.data.doc_permission; // 当前主讲人
          this.mainScreen = res.data.main_screen;
          this.speakerList = res.data.speaker_list;
          this.rebroadcast = res.data.rebroadcast;

          this.speakerList.forEach(item => {
            if (item.account_id == this.roomInfo.third_party_user_id) {
              this.isApplying = true;
            }
          });

          console.log('嘉宾是否已经上麦', this.isApplying);
          sessionStorage.setItem('layout', res.data.stream.layout);
          sessionStorage.setItem('definition', res.data.stream.definition || '');
        })
        .then(() => {
          // 动态切换主显示 区域
          EventBus.$on('vrtc_big_screen_set', e => {
            this.mainScreen = e.room_join_id;
          });
          // 动态切换主显示 区域结束
        });
    },
    // 切换聊天窗口标签页
    changeTab (idx) {
      this.tabIndex = idx;
      if (idx == 0) {
        setTimeout(() => {
          this.$refs.chat.refresh();
        }, 20);
      }
      if (idx == 3) {
        window.setTimeout(() => {
          this.$refs.qa.refresh();
        }, 50);
      }
    },
    doCopy () {
      console.log(this);
      this.$copyText(this.ilId).then(e => {
        this.$message.success('复制成功！');
      }).catch(error=>{
        this.$message.error('复制失败！');
      });
    },
    openMediaSettings () {
      if (!this.thirdPartyMobild) {
        this.mediaSettingVisible = true;
      }
    },
    closeMediaSettings () {
      this.mediaSettingVisible = false;
    },
    openQuestionarie () {
      this.showQuestion = true;
    },
    closeQuestionarie () {
      this.questionarieVisible = false;
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
    },
    closeRebroadcast () {
      this.rebroadcastVisible = false;
    },
    openRebroadcast () {
      this.rebroadcastVisible = true;
    },
    // 打开问答
    openQAPopup () {
      this.isQAEnabled &&
        this.$vhallFetch('getQACount', {
          params_verify_token: this.params_verify_token,
          webinar_id: this.ilId,
          join_id: this.saas_join_id
        })
          .then(res => {
            this.qaCount = res.data;
          })
          .catch(() => {
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
      this.$vhallFetch('enableQA', {
        params_verify_token: this.params_verify_token,
        webinar_id: this.ilId,
        join_id: this.saas_join_id,
        type: this.isQAEnabled ? '0' : '1'
      })
        .then(res => {
          console.log(res);
          const tip = this.isQAEnabled ? '关闭问答成功！' : '开启问答成功！';
          if (this.isQAEnabled) {
            this.changeTab(0);
          }
          if (flag != 1) { this.$message(tip); }
          this.closeQAPopup();
          this.isQAEnabled = !this.isQAEnabled;
        })
        .catch(error => {});
    },
    showDoc () {
      if (this.doc_permission != this.roomInfo.third_party_user_id) {
        this.$message.error({ message: `您不是主讲人不能使用该功能` });
        return;
      }
      if (this.isDocEnabled) {
        this.$refs.doc && this.$refs.doc.toggleDocContainer(false);
        this.isDocEnabled = false;
      } else {
        this.isDocEnabled = true;
        this.$refs.doc && this.$refs.doc.toggleDocContainer(true);
        this.$refs.doc && this.$refs.doc.toggleBoard(false);
        this.isWhiteBoardEnabled = false;
      }
      this.NoDocShow = false;
    },
    showWhiteBoard () {
      if (this.doc_permission != this.roomInfo.third_party_user_id) {
        this.$message.error({ message: `您不是主讲人不能使用该功能` });
        return;
      }
      this.NoDocShow = false;
      if (!this.$refs.doc.docInfo.docContainerShow) {
        return;
      }
      if (this.isWhiteBoardEnabled) {
        this.$refs.doc && this.$refs.doc.toggleDocContainer(true);
        this.$refs.doc && this.$refs.doc.toggleBoard(false);
        this.isWhiteBoardEnabled = false;
      } else {
        this.isWhiteBoardEnabled = true;
        this.isDocEnabled = false;
        this.$refs.doc && this.$refs.doc.toggleBoard(true);
        this.isThumbnailEnabled = false;
        // this.$refs.doc.toggleDocContainer(false);
      }
    },
    shareScreen () {
      // if (this.status != 1) return this.$message('录制未开始，不能开启桌面共享')
      if (this.thirdPartyMobild || this.status != 1) {
        return;
      }
      if (this.doc_permission != this.roomInfo.third_party_user_id) {
        this.$message.error({ message: `您不是主讲人不能使用该功能` });
        return;
      }
      if (this.screensharing) {
        this.$refs.interactive.stopShareScreen();
      } else {
        this.$refs.interactive.shareScreen();
      }
    },
    fullscreen () {
      if (this.isFullscreen) {
        this.exitFullscreen();
      } else {
        this.enterFullscreen();
      }
    },
    enterFullscreen () {
      let element = this.$refs.mainWrap;
      if (element.requestFullscreen) element.requestFullscreen();
      else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
      else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) element.msRequestFullscreen();
      this.isFullscreen = true;
    },

    exitFullscreen () {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
      this.isFullscreen = false;
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

      let params = value ? { type, value } : { type };
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
          // Object.assign(params, { value });
          break;
        default:
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
      console.log(JSON.stringify(this.docToolStatus));

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
    }
  }
};
</script>

<style lang="less">
@import url(./interactive.less);

.tab-content {
  flex: 1;
  /*overflow: hidden;*/
}
.records-wrap {
  width: 100%;
  height: 100%;
  position: relative;
  font-family: '微软雅黑';
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  .record-end-main {
    width: 100%;
    height: 100%;
    /*background: url('https://t-alistatic01.e.vhall.com/static/img/host_doc_shade.jpg') no-repeat;*/
    background-size: 100% 100%;
    background-color: #2d2d2d ;
    position: relative;
  }
  .record-end-result {
    width: 500px;
    height: 500px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 2;
    p {
      font-size: 24px;
      color: #fff;
      width: 100%;
      text-align: center;
      a {
        color: #cc0000;
      }
    }
  }
  .record-end {
    width: 500px;
    height: 500px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    z-index: 2;
    .end-title {
      width: 100%;
      text-align: center;
      color: #fff;
      font-size: 24px;
    }

    .end-describe {
      font-size: 14px;
      color: #ff0000;
      width: 100%;
      padding-left: 200px;
    }

    .record-button {
      width: 100%;
      text-align: center;
      margin-top: 20px;
      .end-save {
        width: 124px;
        height: 40px;
        margin-right: 24px;
        background: #f34b46;
      }

      .end-cutting {
        width: 124px;
        height: 40px;
      }
    }

  }
  .vhall-header {
    width: 100%;
    height: 50px;
    line-height: 50px;
    //   background: rgba(67, 67, 67, 1);
    background: rgba(67, 67, 67, 1);
    //   background: #363636;
    //   background: #36383f;
    // box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.68);
    z-index: 51;
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
        width: 137px;
        height: 20px;
        border-radius: 2px;
        border: 1px solid rgba(151, 151, 151, 1);
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        .vhall-room-id-icon {
          width: 22px;
          height: 20px;
          background: rgba(151, 151, 151, 1);
          font-size: 14px;
          color: rgba(255, 255, 255, 1);
          line-height: 20px;
          text-align: center;
        }
        .vhall-room-id {
          width: 80px;
          height: 20px;
          font-size: 14px;
          font-weight: 400;
          color: rgba(153, 153, 153, 1);
          line-height: 20px;
          padding-left: 2px;
          text-align: left;
        }
        .vhall-room-id-copy {
          width: 19px;
          height: 19px;
          color: white;
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
          font-size: 12px;
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
          z-index: 51;
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
          z-index: 14;
          color: #ececec;
          box-sizing: border-box;
          & > li {
            width: 100%;
            height: 32px;
            line-height: 32px;
            color: #fff;
            font-size: 12px;
            cursor: pointer;
            box-sizing: border-box;
            vertical-align: middle;
            & > i {
              font-size: 7px;
              transform: scale(0.6);
              margin-right: 5px;
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
              }
              &.disable {
                cursor: default;
                color: #aaa;
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
      margin-right: 10px;
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
      }
      .iconquanping {
        font-size: 12px;
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
      background-color: #2d2d2d ;
      .vhall-document-container {
        // height: 100%;
        flex: 1;
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
            }
          }
        }
        position: static !important;
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
            background: rgb(87, 87, 85);
          }
          &:active {
            background: rgba(53, 51, 51, 0.897);
          }
          & > i {
            font-size: 17px;
            color: #dadada;
          }
        }
        .document-thumbnail.enabled {
          background: rgba(0, 0, 0, 1);
          &:hover {
            background: rgb(87, 87, 85);
          }
          &:active {
            background: rgba(53, 51, 51, 0.897);
          }
        }
        .vhall-document-thumbnail-container.visible {
          width: 144px;
          right: 0;
        }
        .vhall-document-thumbnail-container {
          width: 0px;
          height: calc(100% - 40px);
          background: black;
          position: absolute;
          right: -144px;
          top: 40px;
          z-index: 50;
          overflow: hidden;
          /*overflow: scroll;*/
          -webkit-transition: all 0.4s ease-in-out;
          transition: all 0.4s ease-in-out;
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
          z-index: 50;
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
            margin-left: -150px;
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
          top:-17px;
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
        bottom: 27px;
        width: 60px;
        left: 50%;
        margin-left: -30px;
      }
    }
    .vhall-chats-box {
      width: 310px;
      box-sizing: border-box;
      background: rgba(67, 67, 67, 1);
      border-left: 1px solid rgb(53, 53, 53);

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
        z-index: 2;
        position: relative;
        display: flex;
        flex-direction: column;
        .chat-tabs-inner-box {
          font-size: 14px;
          display: flex;
          height: 40px;
          line-height: 40px;
          border-bottom: 1px solid #2d2d2d;
          .tabs {
            display: block;
            color: #b8bbca;
            flex: 1;
            text-align: center;
            position: relative;
            border-bottom: 1px solid #2d2d2d;
            &:after {
              display: block;
              position: absolute;
              height: 0px;
              width: 0px;
              content: ' ';
              background: #fc5659;
              bottom: 1px;
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
                bottom: 1px;
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
    border-top: 3px solid #FC5659;
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

.vhall-qa-switch {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 27px 35px 27px;

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
    background: #f34b46;
    color: #fff;
    border: none;
    border-radius: 2px;
    font-size: 12px;
    text-align: center;
    &:hover {
      background: #c51f1d;
    }
  }
}
}
</style>
