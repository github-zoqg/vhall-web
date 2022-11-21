<template>
  <div class="editBox">
    <pageTitle
      v-if="title"
      :pageTitle="
        Number($route.query.type) === 2 ? '编辑信息' : `${title || ''}${webinarTypeToZHTitle}`
      "
    ></pageTitle>
    <el-form :model="formData" ref="ruleForm" v-loading="loading" label-width="100px">
      <!-- 观看语种 -->
      <el-form-item label="观看语种" prop="languageVa" class="margin32">
        <div class="titleBox">
          <span class="pageTitle">
            <!-- 未开通权限 -->
            <span v-if="!hasMultilingual">
              分组直播暂不支持多语言！观看语种为收费功能，需要开通请
              <a
                class="set-font"
                href="https://vhall.s4.udesk.cn/im_client/?web_plugin_id=15038"
                target="_blank"
              >
                联系客服
              </a>
              <a
                class="set-font"
                href="https://saas-doc.vhall.com/opendocs/show/1384"
                target="_blank"
              >
                功能介绍
              </a>
            </span>
            <!-- 已开通权限 -->
            <span v-else>
              分组直播暂不支持多语言！仅生效网页观看端，不生效JS-SDK和移动SDK观看端
              <a
                class="set-font"
                href="https://saas-doc.vhall.com/opendocs/show/1384"
                target="_blank"
              >
                功能介绍
              </a>
            </span>
          </span>
        </div>
        <div class="language-select">
          <el-checkbox-group :min="1" v-model="languageVa" @change="addLangList">
            <!-- 没有多语言权限 或者 当前选择的分组直播模式 -->
            <el-checkbox
              v-for="(item, key) in languageOps"
              :key="'lang_' + key"
              :label="item.value"
              :disabled="!hasMultilingual || (webinarTypeToZHTitle == '直播' && liveMode == 6)"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <!-- 直播标题 -->
      <el-form-item
        class="margin32"
        v-for="(domain, index) in formData.titleList"
        :label="index == 0 ? `${webinarTypeToZH}标题` : ''"
        :key="'title_' + domain.lang"
        :prop="'titleList.' + index + '.value'"
        :rules="[
          {
            required: true,
            max: 100,
            message: `请输入${domain.label}${webinarTypeToZH}标题`,
            trigger: 'blur'
          }
        ]"
      >
        <VhallInput
          v-model="domain.value"
          v-clearEmoij
          :maxlength="100"
          class="title-inform"
          autocomplete="off"
          :placeholder="`请输入${domain.label}${webinarTypeToZH}标题`"
          show-word-limit
        ></VhallInput>
      </el-form-item>
      <el-form-item
        label="直播时间"
        required
        v-if="webinarType == 'live' || webinarType == 'time'"
        class="item-time"
      >
        <p v-if="webinarTypeToZHTitle == '定时直播'">
          直播过程中，定时直播活动的直播时间将不可修改
        </p>
        <el-col :span="11.5" class="line">
          <el-form-item
            prop="date1"
            style="width: 286px"
            :rules="[{ required: true, message: `请选择直播开始日期`, trigger: 'blur' }]"
          >
            <el-date-picker
              type="date"
              class="date"
              :disabled="isEditTime"
              prefix-icon="iconfont-v3 saasicon_date"
              :picker-options="pickerOptions"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              v-model="formData.date1"
              style="width: 100%"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="11.5">
          <el-form-item
            prop="date2"
            style="width: 286px"
            :rules="[{ required: true, message: `请选择直播开始时间`, trigger: 'blur' }]"
          >
            <el-time-picker
              placeholder="选择时间"
              :default-value="dafaultTime"
              :disabled="!formData.date1 || isEditTime"
              type="datetime"
              :picker-options="{
                selectableRange: rangHourMins
              }"
              format="HH:mm"
              value-format="HH:mm"
              v-model="formData.date2"
              style="width: 100%"
            ></el-time-picker>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="直播模式" required v-if="webinarType == 'live'" class="max-column">
        <div class="titleBox">
          <span class="pageTitle">
            直播创建成功后，直播模式将不可修改，分组直播不支持免费观看，观看限制默认为“密码”
          </span>
          <el-tooltip v-tooltipMove>
            <div slot="content">
              <p>1.视频直播：音频+视频直播，需要保证摄像头和麦克风正常</p>
              <p>2.互动直播：音视频互动连麦，最多支持16人连麦直播</p>
              <p>3.音频直播：音频直播，需要保证麦克风正常</p>
              <p>
                4.分组直播：一种特殊的实时互动直播，最高可容纳2000人，支持分组讨论功能，每组最大支持16人连麦讨论
              </p>
            </div>
            <i class="iconfont-v3 saasicon_help_m tip" style="color: #999999"></i>
          </el-tooltip>
          <slot name="default"></slot>
        </div>
        <!-- card 视频直播 -->
        <div class="modeBox">
          <div>
            <img
              src="../../common/images/live/mode-video_check@2x.png"
              :class="{ active: liveMode == 2 }"
              @click="liveModeChange(2)"
              v-if="liveMode == 2"
            />
            <img
              src="../../common/images/live/mode-video@2x.png"
              alt=""
              @click="liveModeChange(2)"
              v-else
            />
            <p class="desc">视频直播</p>
          </div>
          <!-- card 互动直播 -->
          <div>
            <template v-if="webniarIntact">
              <img
                src="../../common/images/live/mode-active_disabled@2x.png"
                alt=""
                style="cursor: default"
              />
            </template>
            <template v-else>
              <img
                src="../../common/images/live/mode-active_check@2x.png"
                alt=""
                :class="{ active: liveMode == 3 }"
                @click="!webniarIntact && liveModeChange(3)"
                v-if="liveMode == 3"
              />
              <img
                src="../../common/images/live/mode-active@2x.png"
                alt=""
                @click="!webniarIntact && liveModeChange(3)"
                v-else
              />
            </template>
            <p class="desc">互动直播</p>
            <!-- <span class="notAllow" v-if="webniarIntact">未开通</span> -->
          </div>
          <!-- card 音频直播 -->
          <div>
            <img
              src="../../common/images/live/mode-media_check@2x.png"
              :class="{ active: liveMode == 1 }"
              alt=""
              @click="liveModeChange(1)"
              v-if="liveMode == 1"
            />
            <img
              src="../../common/images/live/mode-media@2x.png"
              alt=""
              @click="liveModeChange(1)"
              v-else
            />
            <p class="desc">音频直播</p>
          </div>
          <!-- card 分组直播 -->
          <div>
            <template v-if="webinarGroup">
              <img
                src="../../common/images/live/mode-group_disabled@2x.png"
                alt=""
                style="cursor: default"
              />
            </template>
            <template v-else>
              <img
                src="../../common/images/live/mode-group_check@2x.png"
                alt=""
                :class="{ active: liveMode == 6 }"
                @click="!webinarGroup && liveModeChange(6)"
                v-if="liveMode == 6"
              />
              <img
                src="../../common/images/live/mode-group@2x.png"
                alt=""
                @click="!webinarGroup && liveModeChange(6)"
                v-else
              />
            </template>
            <p class="desc">分组直播</p>
          </div>
        </div>
        <div class="modeHide" v-if="$route.query.type == 2"></div>
      </el-form-item>
      <el-form-item
        label="横竖屏设置"
        required
        v-if="webinarType == 'live' && (liveMode == 1 || liveMode == 2)"
        class="max-column"
      >
        <div class="titleBox">
          <div class="pageTitle">
            <span>创建直播后，横竖屏设置将无法修改</span>
          </div>
        </div>
        <div class="delay-director">
          <div
            class="mode-common"
            :class="{ directorActive: isFullScreen == 1, noDelay: $route.params.id }"
            @click.stop="choseFullScreen(1)"
          >
            <i class="vh-saas-iconfont vh-saas-line-vertical-screen ft20"></i>
            横屏直播
          </div>
          <div
            v-if="webinarPortraitScreen"
            class="mode-director"
            :class="{
              directorActive: isFullScreen != 1,
              disableBox: selectDirectorMode === 1,
              noDelay: $route.params.id
            }"
            @click.stop="choseFullScreen(0)"
          >
            <span class="text-content">
              <i class="vh-saas-iconfont vh-saas-line-landscape ft20"></i>
              竖屏直播
            </span>
          </div>
          <div
            v-if="!webinarPortraitScreen"
            class="mode-director noDirector"
            :class="{ directorActive: isFullScreen != 1, disableBox: selectDirectorMode === 1 }"
          >
            <span class="text-content">
              <i class="vh-saas-iconfont vh-saas-line-landscape ft20"></i>
              竖屏直播
            </span>
            <span class="no-open">未开通</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="云导播" required v-if="showDelayTag && liveMode == 2" class="max-column">
        <div class="titleBox">
          <div class="pageTitle">
            <span v-if="!webinarDirector">
              云导播活动为付费功能请
              <a
                class="blue"
                target="_blank"
                href="https://vhall.s4.udesk.cn/im_client/?web_plugin_id=15038"
              >
                联系客服
              </a>
              开通，点我了解
              <a
                class="set-font"
                href="https://saas-doc.vhall.com/opendocs/show/1388"
                target="_blank"
              >
                云导播活动
              </a>
            </span>
            <span v-else>
              云导播活动不能使用无延迟技术，点我了解
              <a
                class="set-font"
                href="https://saas-doc.vhall.com/opendocs/show/1388"
                target="_blank"
              >
                云导播活动
              </a>
            </span>
          </div>
        </div>
        <div class="delay-director">
          <div
            class="mode-common"
            :class="{ directorActive: selectDirectorMode === 0 }"
            @click.stop="handleSelectDirectorMode(0)"
          >
            <i class="vh-saas-iconfont vh-saas-line-mixeroff ft20"></i>
            不启用云导播
          </div>
          <div
            v-if="webinarDirector"
            class="mode-director"
            :class="{
              directorActive: selectDirectorMode === 1,
              disableBox: selectDelayMode == 'delay' || isFullScreen == 0,
              noDelay: $route.params.id
            }"
            @click.stop="handleSelectDirectorMode(1)"
          >
            <span class="text-content">
              <i class="vh-saas-iconfont vh-saas-line-mixer-on ft20"></i>
              启用云导播
            </span>
          </div>
          <div
            v-if="!webinarDirector"
            class="mode-director noDirector"
            :class="{ disableBox: selectDelayMode == 'delay' }"
          >
            <span class="text-content">
              <i class="vh-saas-iconfont vh-saas-line-mixer-on ft20"></i>
              启用云导播
            </span>
            <span class="no-open">未开通</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item
        v-if="(liveMode == 3 || liveMode == 6) && webinarType == 'live'"
        label="连麦人数"
        required
        :class="['invd-number', { margin32: liveMode == 6 }]"
      >
        <div class="titleBox">
          <span class="pageTitle">
            <span>
              {{
                liveMode == 6
                  ? '直播中请勿修改连麦人数！最大支持1v15连麦，开通更多连麦人数'
                  : '直播中请勿修改连麦人数！无延迟最大支持1v5连麦，常规直播最大支持1v15连麦，开通更多连麦人数'
              }}
              <a
                class="blue"
                target="_blank"
                href="https://vhall.s4.udesk.cn/im_client/?web_plugin_id=15038"
              >
                联系客服
              </a>
              ，支持
              <a class="blue" target="_blank" href="https://saas-doc.vhall.com/opendocs/show/1385">
                手机网页连麦
              </a>
            </span>
          </span>
        </div>
        <el-select filterable v-model="zdy_inav_num" style="width: 312px">
          <el-option
            v-for="(opt, optIndex) in inavNumOptions"
            :key="optIndex"
            :label="opt.label"
            :value="opt.label"
            :disabled="
              selectDelayMode == 'delay' && liveMode != 6
                ? speakerMaxNum < 6
                  ? opt.value > speakerMaxNum
                  : opt.value > 6
                : opt.value > speakerMaxNum
            "
          />
        </el-select>
        <el-tooltip v-if="liveMode == 3" v-tooltipMove>
          <div slot="content">
            <p>1.开启视频轮巡功能后，会占用上麦数（视频轮巡路数&lt;=当前活动连麦数-已连麦数）</p>
            <p>2.请根据视频轮巡及上麦的需要，酌情设置本场活动的连麦数量</p>
          </div>
          <i class="iconfont-v3 saasicon_help_m tip" style="color: #999999; margin-left: 5px"></i>
        </el-tooltip>
      </el-form-item>
      <template v-if="showDelayTag && liveMode != 6">
        <el-form-item
          class="margin32"
          label="直播延迟"
          required
          style="display: none"
          :style="{ display: liveMode != 6 ? 'block' : 'nonelay' }"
        >
          <div class="titleBox">
            <span class="pageTitle">
              <span v-if="!hasDelayPermission">
                无延迟直播为付费功能请
                <a
                  class="blue"
                  target="_blank"
                  href="https://vhall.s4.udesk.cn/im_client/?web_plugin_id=15038"
                >
                  联系客服
                </a>
                开通，点我了解
                <span class="blue" @click.stop="showDelayMask = true">无延迟直播</span>
              </span>
              <span v-else>
                直播创建成功后，直播延迟类型将不可修改，点我了解
                <span class="blue" @click.stop="showDelayMask = true">无延迟直播</span>
              </span>
            </span>
          </div>
          <div class="delay-select">
            <div
              class="mode-common"
              :class="{ delayActive: selectDelayMode == 'common', noDelay: $route.params.id }"
              @click.stop="handleSelectDelayMode('common')"
            >
              <i class="iconfont-v3 saasicon-changgui ft20"></i>
              常规延迟≈5S
            </div>
            <div
              v-if="webinarDelay"
              class="mode-delay"
              :class="{
                delayActive: selectDelayMode == 'delay',
                noDelay: $route.params.id,
                disableBox: selectDirectorMode === 1 && liveMode == 2
              }"
              @click.stop="handleSelectDelayMode('delay')"
            >
              <span class="text-content">
                <i class="iconfont-v3 saasicon-wuyanchi ft20"></i>
                无延迟&lt;0.4S
              </span>
            </div>
            <div
              v-if="!webinarDelay"
              class="mode-delay noDelay"
              :class="{ disableBox: selectDirectorMode === 1 && liveMode == 2 }"
            >
              <span class="text-content">
                <i class="iconfont-v3 saasjishiqi ft20"></i>
                无延迟&lt;0.4S
              </span>
              <span class="no-open">未开通</span>
            </div>
          </div>
        </el-form-item>
      </template>
      <el-form-item label="直播标签" class="tags_box">
        <div
          class="tag_name_dom"
          :class="checkedTags.length ? '' : 'notag'"
          @click="openTagDia('but')"
        >
          <span v-if="!checkedTags.length">点击引用标签</span>
          <div v-else class="tag_box_lineheight">
            <span class="name_base" v-for="item in tags_name" :key="item">{{ item }}</span>
          </div>
        </div>
        <el-button type="text" class="tags_edit" @click="openTagDia">设置</el-button>
      </el-form-item>
      <el-form-item class="margin32" :label="`${webinarTypeToZH}封面`">
        <upload
          class="upload__avatar"
          id="webinar_cropper"
          v-model="formData.imageUrl"
          :domain_url="domain_url"
          :saveData="{
            path: pathUrl,
            type: 'image'
          }"
          :on-success="handleUploadSuccess"
          :on-progress="uploadProcess"
          :on-error="uploadError"
          :on-preview="uploadPreview"
          :before-upload="beforeUploadHnadler"
          @delete="deleteImage"
        >
          <div slot="tip">
            <p>建议尺寸：1280*720px，小于4M</p>
            <p>支持jpg、gif、png、bmp</p>
          </div>
        </upload>
        <div class="image_cropper">
          <div class="image_cropper_item">
            <span>模糊程度</span>
            <vh-slider
              v-model="formData.blurryDegree"
              :max="10"
              :disabled="!formData.imageUrl"
              style="width: 500px"
            ></vh-slider>
            <span class="wid_block">{{ formData.blurryDegree }}</span>
          </div>
          <div class="image_cropper_item">
            <span>背景亮度</span>
            <vh-slider
              v-model="formData.lightDegree"
              :max="20"
              :disabled="!formData.imageUrl"
              style="width: 500px"
            ></vh-slider>
            <span class="wid_block">{{ formData.lightDegree }}</span>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="选择视频" v-if="webinarType == 'vod' || webinarType == 'time'" required>
        <div class="mediaBox" @mouseenter="showMenu" @mouseleave="hiddenMenu">
          <div
            class="mediaSlot"
            v-if="!selectMedia.id"
            @click="$refs.selecteMedia.dialogVisible = true"
          >
            <div class="picInco"><i class="iconfont-v3 saasicon_shangchuan"></i></div>
            <!-- <i class="iconfont-v3 saasicon_shangchuan"></i> -->
            <p>
              视频格式支持：rmvb、mp4、avi、wmv、mkv、flv、mov；
              <br />
              音频格式支持mp3、wav 文件大小不超过5G
            </p>
          </div>
          <div class="mediaSlot" v-else>
            <icon icon-class="saasshipinwenjian"></icon>
            <p class="selectMediaName">{{ selectMedia.name }}</p>
          </div>
          <div class="abRight" v-if="selectMedia.id && showChecked">
            <div class="tool" @click.stop="previewVideo">
              <i class="iconfont-v3 saasicon-eye"></i>
              <el-button type="text" class="operaBtn">预览</el-button>
            </div>
            <div class="tool" v-if="!isEditTime" @click.stop="deleteSelectMedia">
              <i class="iconfont-v3 saasicon_shanchu"></i>
              <el-button type="text" class="operaBtn">删除</el-button>
            </div>
          </div>
          <el-tooltip v-if="!$route.query.record_id" v-tooltipMove>
            <div slot="content">
              1.上传单个文件最大5G
              <br />
              2.视频格式支持RMVB、MP4、AVI、WMV、MKV、FLV、MOV；上传音频格式支持MP3、WAV
              <br />
              3.上传的视频，不支持剪辑和下载
            </div>
            <i class="iconfont-v3 saasicon_help_m tip"></i>
          </el-tooltip>
        </div>
        <!-- <div class="vod-hover"> -->
        <!-- </div> -->
      </el-form-item>
      <!-- 直播简介 -->
      <!--  <el-form-item
        v-for="(domain, index) in formData.contentList"
        :label="index == 0 ? `${webinarTypeToZH}简介` : ''"
        :key="'introduction_' + domain.lang"
        :prop="'contentList.' + index + '.value'"
        class="item-last"
      >
        <v-editor class="editor-wrap" save-type='live' :placeholder="`请输入${domain.label}${webinarTypeToZH}简介`" :isReturn=true ref="unitImgTxtEditor" v-model="domain.value"></v-editor>
      </el-form-item> -->
      <el-form-item
        class="margin32"
        v-if="formData.contentList[0]"
        :label="`${webinarTypeToZH}简介`"
      >
        <v-editor
          class="editor-wrap"
          save-type="live"
          :placeholder="`请输入${formData.contentList[0].label}${webinarTypeToZH}简介`"
          :isReturn="true"
          ref="unitImgTxtEditor"
          v-model="formData.contentList[0].value"
        ></v-editor>
      </el-form-item>
      <el-form-item
        class="margin32"
        v-if="formData.contentList[1] && !(webinarTypeToZHTitle == '直播' && liveMode == 6)"
      >
        <v-editor
          class="editor-wrap"
          save-type="live"
          :placeholder="`请输入${formData.contentList[1].label}${webinarTypeToZH}简介`"
          :isReturn="true"
          ref="unitImgTxtEditor"
          v-model="formData.contentList[1].value"
        ></v-editor>
      </el-form-item>
      <el-form-item
        class="margin32"
        v-if="formData.contentList[2] && !(webinarTypeToZHTitle == '直播' && liveMode == 6)"
      >
        <v-editor
          class="editor-wrap"
          save-type="live"
          :placeholder="`请输入${formData.contentList[2].label}${webinarTypeToZH}简介`"
          :isReturn="true"
          ref="unitImgTxtEditor"
          v-model="formData.contentList[2].value"
        ></v-editor>
      </el-form-item>
      <!-- <el-form-item :label="`${webinarTypeToZH}类别`" >
        <span :class="{tag: true, active: tagIndex === index}" v-for="(item, index) in liveTags" :key="item" @click="tagIndex=index">{{item}}</span>
      </el-form-item> -->
      <p class="switch__box" v-if="webinarType == 'live' && liveMode == 6">
        <el-switch
          v-model="speakSwitch"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          inactive-text="自动上麦"
          :active-text="speakSwitchDesc"
        ></el-switch>
      </p>
      <p class="switch__box" v-if="webinarType == 'live' || webinarType == 'time'">
        <el-switch
          v-model="formData.docSwtich"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          inactive-text="文档翻页"
          :active-text="docSwtichDesc"
        ></el-switch>
      </p>
      <p class="switch__box" v-if="webinarType == 'live' || webinarType == 'time'">
        <el-switch
          v-model="formData.reservation"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          inactive-text="预约人数"
          :active-text="reservationDesc"
        ></el-switch>
      </p>
      <p class="switch__box" v-if="webinarType == 'live' || webinarType == 'time'">
        <el-switch
          v-model="formData.online"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          inactive-text="在线人数"
          :active-text="onlineDesc"
        ></el-switch>
      </p>
      <p class="switch__box">
        <el-switch
          v-model="formData.hot"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          inactive-text="活动热度"
          :active-text="hotDesc"
        ></el-switch>
      </p>
      <p class="switch__box">
        <el-switch
          v-model="formData.home"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          inactive-text="关联主页"
          :active-text="homeDesc"
        ></el-switch>
      </p>
      <p
        class="switch__box"
        v-if="(webinarType == 'live' || webinarType == 'time') && !versionType"
      >
        <el-switch
          v-model="formData.capacity"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          inactive-text="并发扩容"
          :disabled="!limitInfo.extend"
          :active-text="capacityDesc"
        ></el-switch>
      </p>
      <p class="switch__box last">
        <el-switch
          v-model="formData.limitCapacitySwtich"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          inactive-text="最高并发"
          :active-text="limitCapacityDesc"
        ></el-switch>
        <VhallInput
          :placeholder="placeholder"
          :maxlength="!versionType ? '' : '7'"
          v-show="formData.limitCapacitySwtich"
          v-model="formData.limitCapacity"
          class="limitInput"
          oninput="this.value=this.value.replace(/\D/g, '')"
          style="display: block"
        ></VhallInput>
      </p>
      <el-form-item class="btnGroup">
        <el-button
          type="primary"
          class="common-button length152"
          :disabled="isBtnDisabled"
          @click="submitForm('ruleForm')"
          v-preventReClick="1000"
          round
        >
          保存
        </el-button>
        <el-button class="length152" @click="resetForm('ruleForm')" round>取消</el-button>
      </el-form-item>
      <!-- <p class="btnGroup">

      </p> -->
    </el-form>
    <selectMedia
      ref="selecteMedia"
      @selected="mediaSelected"
      :isVodVideo="true"
      :selectedList="[]"
    ></selectMedia>
    <template v-if="showDialog">
      <el-dialog
        class="vh-saas-dialog"
        :visible.sync="showDialog"
        width="30%"
        center
        :close-on-press-escape="false"
      >
        <video-preview ref="videoPreview" :videoParam="selectMedia"></video-preview>
      </el-dialog>
    </template>
    <begin-play
      :webinarId="$route.params.id"
      v-if="
        webinarTypeToZHTitle != '定时直播' && liveDetailInfo.webinar_state != 4 && title !== '创建'
      "
    ></begin-play>
    <div class="delay-mask" v-if="showDelayMask">
      <div class="delay-intro">
        <span class="close iconfont-v3 saasclose" @click.stop="showDelayMask = false"></span>
        <div class="title">无延迟直播介绍</div>
        <div class="content">
          <div class="lf"></div>
          <div class="lr">
            <div class="sub-title">使用场景</div>
            <div class="sub-content">
              传统直播中，观众与主办方存在4-10秒的时间差，微吼全新VRTC技术使延迟低至0.4秒，打造零距离交流场景。支持实时性的直播场景，例如在线大班课、电商直播、在线拍卖场景，互动更加实时。
            </div>
            <div class="sub-title">注意事项</div>
            <div class="sub-content">
              <!-- 1、使用PC客户端、移动APP、移动SDK发起直播时，目前暂不支持无延迟直播，后续进行迭代支持，敬请期待；<br/>
              2、使用PC标准网页、手机wap端网页、网页完全嵌入方式观看时支持无延迟直播；<br/>
              3、以下情况不支持无延迟观看：<br/>
              （1）使用JS-SDK、移动SDK、单视频嵌入的观看形式，不支持无延迟观看，后续进行迭代支持，敬请期待；<br/>
              （2）将观看页直接嵌入到客户的小程序进行观看，不支持无延迟观看，因为小程序环境采用的方式不是webrtc技术，无法支持<br/>
              4、无延迟直播不支持第三方推流、转播功能；目前暂不支持设置跑马灯、水印、弹幕，和清晰度，弹幕功能直播时默认进行隐藏，回放不受影响。 -->
              1、支持使用PC网页、PC客户端、移动APP、移动SDK发起无延迟直播
              <br />
              2、使用PC标准网页、手机wap端网页、网页完全嵌入、移动SDK、JS-SDK方式观看时支持无延迟直播
              <br />
              3、以下情况不支持无延迟观看：
              <br />
              （1）使用单视频嵌入的观看形式，不支持无延迟观看，后续进行迭代支持，敬请期待；
              <br />
              （2）将观看页直接嵌入到客户的小程序进行观看，不支持无延迟观看，因为小程序环境采用的方式不是webrtc技术，无法支持
              <br />
              4、无延迟直播不支持第三方推流、转播功能；目前暂不支持设置跑马灯、水印、弹幕，和清晰度，弹幕功能直播时默认进行隐藏，回放不受影响。
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 裁剪图片弹窗 -->
    <cropper ref="webinarCropper" @cropComplete="cropComplete" @resetUpload="resetUpload"></cropper>
    <!-- 活动标签选择弹框 -->
    <VhallDialog
      title="标签引用"
      :visible.sync="selectTagDialog"
      class="zdy-async-dialog selectTagDia"
      width="480px"
    >
      <div v-if="tagList.length">
        <div class="tag_content">
          <div class="creat_header">
            <el-button type="primary" round @click="openCreatTagDia" v-preventReClick size="medium">
              创建标签
            </el-button>
            <span class="creat_tip">直播下最多引用10个标签</span>
          </div>
          <el-checkbox-group v-model="checkedTagsBefore" :max="10">
            <el-checkbox
              v-for="tag in tagList"
              :label="tag.label_id"
              :key="tag.label_id"
              class="check_base"
            >
              <span class="tag_base">{{ tag.name }}</span>
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="async__footer">
          <span class="checked_num">
            当前选中
            <span>{{ checkedTagsBefore.length }}</span>
            个标签
          </span>
          <el-button type="primary" size="medium" v-preventReClick @click="sureSelectTag" round>
            确 定
          </el-button>
          <el-button size="medium" @click="unSureSelectTag" round>取 消</el-button>
        </div>
      </div>
      <div v-else>
        <null-page text="您还没有标签，快来创建吧！" nullType="button">
          <el-button type="primary" round @click="openCreatTagDia" v-preventReClick size="medium">
            创建标签
          </el-button>
        </null-page>
      </div>
      <div></div>
    </VhallDialog>
    <!-- 创建标签弹框 -->
    <VhallDialog
      title="创建"
      :visible.sync="createTagDialog"
      class="zdy-async-dialog createTagDia"
      width="400px"
    >
      <div class="async__body">
        <div class="async__ctx">
          <VhallInput
            placeholder="请输入标签名称"
            v-model="tagName"
            v-clearEmoij
            show-word-limit
            maxlength="10"
          ></VhallInput>
        </div>
        <div class="async__footer">
          <el-button type="primary" size="medium" v-preventReClick @click="sureAsyncHandle" round>
            确 定
          </el-button>
          <el-button size="medium" @click="unSureAsyncHandle" round>取 消</el-button>
        </div>
      </div>
    </VhallDialog>
  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle';
  import beginPlay from '@/components/beginBtn';
  import upload from '@/components/Upload/main';
  import selectMedia from './selecteMedia';
  import VEditor from '@/components/Tinymce';
  import {
    sessionOrLocal,
    parseImgOssQueryString,
    cropperImage,
    getImageQuery
  } from '@/utils/utils';
  import cropper from '@/components/Cropper/index';
  import VideoPreview from '../MaterialModule/VideoPreview/index.vue';
  import NullPage from '@/views/PlatformModule/Error/nullPage.vue';

  export default {
    components: {
      PageTitle,
      upload,
      selectMedia,
      VEditor,
      VideoPreview,
      beginPlay,
      NullPage,
      cropper
    },
    computed: {
      domain_url() {
        if (!this.formData.imageUrl) return '';
        return `${
          this.formData.imageUrl
        }?x-oss-process=image/crop,x_${this.formData.backgroundSize.x.toFixed()},y_${this.formData.backgroundSize.y.toFixed()},w_${this.formData.backgroundSize.width.toFixed()},h_${this.formData.backgroundSize.height.toFixed()}${
          this.formData.blurryDegree > 0 ? `,/blur,r_10,s_${this.formData.blurryDegree * 2}` : ''
        },/bright,${(this.formData.lightDegree - 10) * 5}&mode=${this.imageCropMode}`;
      },
      rangHourMins() {
        let sysDate = new Date().getTime();
        let str = dayjs().format('HH:mm');
        console.log(this.formData.date1, str);
        let selectDate = dayjs(this.formData.date1).format('YYYY/MM/DD');
        let targetDate = new Date(`${selectDate} 00:00:00`).getTime();
        if (targetDate > sysDate) {
          return `00:00:00 - 23:59:00`;
        } else {
          return `${str}:00 - 23:59:00`;
        }
      },
      dafaultTime() {
        let sysDate = new Date().getTime();
        let str = dayjs(sysDate + 10 * 60 * 1000).format('HH:mm');
        let selectDate = dayjs(this.formData.date1).format('YYYY/MM/DD');
        return selectDate + ' ' + `${str}:00`;
      },
      pathUrl: function () {
        return `interacts/screen-imgs/${dayjs().format('YYYYMM')}`;
      },
      speakSwitchDesc() {
        if (this.speakSwitch) {
          return '已开启，按照观众进入直播间的先后顺序自动上麦，直到上麦人数达到上限';
        } else {
          return '开启后，按照观众进入直播间的先后顺序自动上麦，直到上麦人数达到上限';
        }
      },
      docSwtichDesc() {
        if (this.formData.docSwtich) {
          return '已开启，直播中观众可以提前预览文档，进行文档翻页';
        } else {
          return '开启后，直播中观众可以提前预览文档，进行文档翻页';
        }
      },
      reservationDesc() {
        if (this.formData.reservation) {
          return '已开启，观看端显示预约人数';
        } else {
          return '开启后，观看端显示预约人数';
        }
      },
      onlineDesc() {
        if (this.formData.online) {
          return '已开启，观看端显示在线人数';
        } else {
          return '开启后，观看端显示在线人数';
        }
      },
      hotDesc() {
        if (this.formData.hot) {
          return '已开启，观看端显示活动热度';
        } else {
          return '开启后，观看端显示活动热度';
        }
      },
      homeDesc() {
        if (this.formData.home) {
          return '已开启，该活动在个人主页中显示';
        } else {
          return '开启后，该活动在个人主页中显示';
        }
      },
      capacityDesc() {
        if (this.formData.capacity) {
          return `已开启，可以使用扩展包扩容并发人数（扩展包剩余${this.limitInfo.extend}人）`;
        } else {
          return `开启后，可以使用扩展包扩容并发人数（扩展包剩余${this.limitInfo.extend}人）`;
        }
      },
      limitCapacityDesc() {
        if (this.formData.limitCapacitySwtich) {
          return '已开启，限制进入活动的观众最大并发数';
        } else {
          return '开启后，限制进入活动的观众最大并发数';
        }
      },
      placeholder() {
        if (!this.versionType && this.formData.limitCapacitySwtich) {
          if (this.formData.capacity) {
            return `请输入1-${this.limitInfo.total + this.limitInfo.extend}的并发数`;
          } else {
            return `请输入1-${this.limitInfo.total}的并发数`;
          }
        } else {
          return `请输入1-9999999的并发数`;
        }
      },
      webinarType() {
        return this.$route.meta.webinarType;
      },
      webinarTypeToZH() {
        const zh = {
          vod: '点播',
          live: '直播',
          time: '直播'
        };
        return zh[this.$route.meta.webinarType];
      },
      webinarVideo() {
        return this.$route.meta.webinarType == 'live' ? false : true;
      },
      webinarTypeToZHTitle() {
        const zh = {
          vod: '点播',
          live: '直播',
          time: '定时直播'
        };
        return zh[this.$route.meta.webinarType];
      },
      webniarIntact() {
        // new_interact 1:有互动权限  0:无权限
        if (JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage')).new_interact == '1') {
          return false;
        } else {
          return true;
        }
      },
      webinarGroup() {
        // webinar.group 1:有分组直播权限  0:无权限
        if (JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))['webinar.group'] == '1') {
          return false;
        } else {
          return true;
        }
      },
      isEditTime() {
        return this.liveDetailInfo.webinar_state == 1 && this.liveDetailInfo.webinar_type == 5;
      },
      // admin无延迟活动权限
      webinarDelay() {
        // no.delay.webinar 1:有无延迟权限  0:无权限
        if (
          JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))['no.delay.webinar'] == '1'
        ) {
          return true;
        } else {
          return false;
        }
      },
      // 是否有多语种权限
      hasMultilingual() {
        // 发布为定时直播 或者 点播，不需要取值 this.$route.query.webinar_id
        // 编辑活动，取值 this.$route.params.id，需要查活动下权限
        // 复制活动，取值 this.$route.query.id，需要查活动下权限
        // 创建，webinar_id 取值 ''，不查活动下权限
        const webinar_id = this.$route.params.id || this.$route.query.id;
        if (webinar_id) {
          return this.WEBINAR_PES && this.WEBINAR_PES['multilingual'] == '1';
        } else {
          return (
            JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))['multilingual'] == '1'
          );
        }
      },
      start_line: function () {
        // 获取当前时分
        let sysDate = new Date();
        let hours = sysDate.getHours();
        let minutes = sysDate.getMinutes();
        if (hours <= 9) {
          hours = `0${hours}`;
        }
        if (minutes <= 9) {
          minutes = `0${minutes}`;
        }
        return `${hours}:${minutes}`;
      },
      // 判断保存按钮是否可点击
      isBtnDisabled: function () {
        let count = 0;
        for (let i = 0; i < this.formData.titleList.length; i++) {
          if (this.formData.titleList[i].value == '') {
            count++;
          }
        }
        return count > 0 || this.languageVa.length <= 0;
      }
    },
    filters: {
      filterLiveMode(mode) {
        if (mode == 1) {
          return '音频模式将不可修改';
        } else if (mode == 2) {
          return '视频模式将不可修改';
        } else {
          return '互动模式将不可修改';
        }
      }
    },
    watch: {
      formData: {
        deep: true,
        handler() {
          for (let i = 0; i < this.formData.titleList.length; i++) {
            // 标题勾选是必填项
            this.historyLang['lang' + this.formData.titleList[i].lang].subject =
              this.formData.titleList[i].value;
          }
          for (let i = 0; i < this.formData.contentList.length; i++) {
            // 标题勾选是必填项
            this.historyLang['lang' + this.formData.contentList[i].lang].introduce =
              this.formData.contentList[i].value;
          }
          console.log('当前历史记录', this.historyLang);
          this.isChange = true;
        }
      },
      selectMedia: {
        deep: true,
        handler() {
          this.isChange = true;
        }
      },
      checkedTags(val) {
        console.log(val, 'checkedTags');
        let arr = [];
        val.forEach(item => {
          this.tagList.forEach(i => {
            if (i.label_id == item) {
              arr.push(i.name);
            }
          });
        });
        console.log(arr);
        this.tags_name = arr;
      }
    },
    data() {
      return {
        lowerGradeInterval: null,
        showDelayTag: true,
        hasDelayPermission: false, // 是否有无延迟权限
        isDelay: false,
        showDelayMask: false,
        selectDelayMode: 'common',
        selectDirectorMode: 0,
        imageCropMode: 1,
        formData: {
          title: '',
          date1: '',
          date2: '',
          content: ``,
          docSwtich: false,
          reservation: true,
          online: true,
          hot: true,
          home: true,
          capacity: false,
          limitCapacity: '',
          limitCapacitySwtich: false,
          imageUrl: '',
          domain_url: '',
          blurryDegree: 0,
          lightDegree: 10,
          backgroundSize: {
            x: 0,
            y: 0,
            width: 0,
            height: 0
          },
          titleList: [],
          contentList: []
        },
        speakSwitch: true, // 是否自动上麦，默认是开启状态
        zdy_inav_num: '',
        liveMode: null,
        liveDetailInfo: {},
        showChecked: false,
        isChange: false,
        showDialog: false,
        startVal: '',
        limitInfo: {},
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        liveTags: ['金融', '互联网', '汽车', '教育', '健康', '其他'],
        tagIndex: 0,
        loading: false,
        selectMedia: {},
        expireTimeOption: {
          disabledDate(time) {
            // formData.date1
            this.startVal = this.formData.date1.getTime() < Date.now() - 24 * 60 * 60 * 1000;
            return startVal;
            // return this.formData.date1.getTime() < Date.now() - 24 * 60 * 60 * 1000
            // return time.getTime() < Date.now()
          }
        },
        inavNumOptions: [
          {
            value: 2,
            label: '1v1'
          },
          {
            value: 3,
            label: '1v2'
          },
          {
            value: 4,
            label: '1v3'
          },
          {
            value: 5,
            label: '1v4'
          },
          {
            value: 6,
            label: '1v5'
          },
          {
            value: 7,
            label: '1v6'
          },
          {
            value: 8,
            label: '1v7'
          },
          {
            value: 9,
            label: '1v8'
          },
          {
            value: 10,
            label: '1v9'
          },
          {
            value: 11,
            label: '1v10'
          },
          {
            value: 12,
            label: '1v11'
          },
          {
            value: 13,
            label: '1v12'
          },
          {
            value: 14,
            label: '1v13'
          },
          {
            value: 15,
            label: '1v14'
          },
          {
            value: 16,
            label: '1v15'
          }
        ],
        speakerMaxNum: '',
        languageOps: [
          {
            label: '简体中文',
            value: 1
          },
          {
            label: '英文',
            value: 2
          } /*,
        {
          label: '西班牙语',
          value: 3
        }*/
        ],
        isPushVodLanguage: false, // 是不是发布为点播或定时直播
        oldLanguageVa: [], // 当前活动，默认没有设置过语言
        languageVa: [], // 当前已勾选的语言
        queryLangList: [],
        delLang: [], // 编辑&无权限时，使用该待删除语种集合
        historyLang: {
          lang1: {
            subject: '',
            introduce: ''
          }, // 1固定，表示中文
          lang2: {
            subject: '',
            introduce: ''
          }, // 1固定，表示英文
          lang3: {
            subject: '',
            introduce: ''
          } // 1固定，表示西班牙语
        },
        webinarDirector: false, // admin无云导播活动权限
        webinarPortraitScreen: false, // admin无竖屏权限
        tags_name: [],
        checkedTags: [], // 选中标签
        checkedTagsBefore: [], // 选中标签确认前
        selectTagDialog: false, // 选择标签弹框
        createTagDialog: false, // 创建标签弹框
        tagName: '', // 新建标签名称
        tagList: [1, 2, 3, 4], // 所有标签集合
        SAAS_VS_PES: null,
        WEBINAR_PES: null,
        isFullScreen: 1 // 横竖屏设置
      };
    },
    beforeRouteEnter(to, from, next) {
      let userPhone = JSON.parse(sessionOrLocal.get('userInfo')).phone;
      if (!vm.$route.query.id && !userPhone) {
        vm.$alert('您还没有绑定手机，为了保证您的权益，请绑定后再发起直播！', '提示', {
          confirmButtonText: '立即绑定',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel',
          callback: action => {
            if (action === 'confirm') {
              vm.$router.push({ path: '/acc/info', query: { tab: 1 } });
            }
          }
        });
      } else {
        next();
      }
    },
    beforeRouteLeave(to, from, next) {
      // 离开页面前判断信息是否修改
      if (!this.isChange) {
        next();
        return false;
      }
      this.$confirm(`确定不${this.title}${this.webinarTypeToZH}内容？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      })
        .then(() => {
          next();
        })
        .catch(() => {});
    },
    async created() {
      const path = this.$route.path;
      console.log('>>>>>>>>11111', path);
      if (path.indexOf('/live/vodEdit') != -1 || path.indexOf('/live/timeEdit') != -1) {
        this.showDelayTag = false;
      }
      this.versionType = JSON.parse(sessionOrLocal.get('versionType'));
      window.scrollTo(0, 0);
      // 标题文案先展示
      if (this.$route.query.id || this.$route.params.id) {
        if (this.$route.query.id) {
          this.title = this.$route.query.type == 2 ? '编辑' : '复制';
        } else {
          this.title = '编辑';
        }
      } else {
        this.title = '创建';
      }
      // 获取活动维度下 - 配置项开关集合 - 通过地址栏参数传递活动ID
      console.log('>>>>>>>>当前活动-配置项开关内容(创建/编辑中调用)', this.$route.params.id);
      await this.getConfigListIsOpen('webinar', 1, this.$route.params.id);
      // 获取活动维度下 - 具体配置项值 - 通过地址栏参数传递活动ID
      console.log('>>>>>>>>当前活动-配置项值(创建/编辑中调用)');
      await this.getConfigListIsOpen('webinar', 2, this.$route.params.id);
      if (this.$route.query.id || this.$route.params.id) {
        this.webinarId = this.$route.query.id || this.$route.params.id;
        this.getLiveBaseInfo(this.webinarId, false);
      } else {
        this.liveMode = 2;
        this.webinarId = '';
        // 默认中文选中
        this.languageVa = [1];
        this.formData.titleList = [];
        this.formData.titleList.push({
          value: '',
          key: 'titleList_1',
          lang: 1,
          label: this.getLangKeyVal(1, 'label')
        });
        // 默认中文简介
        this.formData.contentList = [];
        this.formData.contentList.push({
          value: '',
          key: 'contentList_1',
          lang: 1,
          label: this.getLangKeyVal(1, 'label')
        });
      }
      // 发布为点播
      if (this.$route.query.record_id) {
        this.isPushVodLanguage = true;
        this.selectMedia = {
          id: this.$route.query.record_id,
          paas_record_id: this.$route.query.paas_record_id,
          name: this.$route.query.name
        };
        this.getLiveBaseInfo(this.$route.query.webinar_id, true);
      }
      if (this.title == '复制') {
        this.isPushVodLanguage = true;
      }
      if (!this.versionType) {
        this.getHighLimit();
      }

      //  webinar.director 1:有无延迟权限  0:无权限
      if (
        JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))['webinar.director'] == '1'
      ) {
        this.webinarDirector = true;
      } else {
        this.webinarDirector = false;
      }
      //  portrait_screen 是否支持竖屏 1:开启 0:关闭。
      if (JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))['portrait_screen'] == '1') {
        this.webinarPortraitScreen = true;
      } else {
        this.webinarPortraitScreen = false;
      }
      this.getTagsList('init');
    },
    beforeDestroy() {
      if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval);
    },
    methods: {
      handleLowerGradeHeart() {
        this.getLowerGradeConfig();
        this.lowerGradeInterval = setInterval(() => {
          this.getLowerGradeConfig();
        }, (Math.random() * 5 + 5) * 1000);
      },
      getLowerGradeConfig() {
        let userId = JSON.parse(sessionOrLocal.get('userId'));
        this.$fetch('lowerGrade', {})
          .then(res => {})
          .catch(res => {
            // 降级没有code吗
            const { activity, user, global } = res;
            // 优先顺序：互动 > 用户 > 全局
            const activityConfig =
              activity && activity.length > 0
                ? activity.find(option => option.audience_id == this.$route.params.str)
                : null;
            const userConfig =
              user && user.length > 0 ? user.find(option => option.audience_id == userId) : null;
            if (activityConfig) {
              this.setLowerGradeConfig(activityConfig.permissions);
            } else if (userConfig) {
              this.setLowerGradeConfig(userConfig.permissions);
            } else if (global && global.permissions) {
              this.setLowerGradeConfig(global.permissions);
            }
          });
      },
      setLowerGradeConfig(val) {
        if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval);
        const data = val;
        this.hasDelayPermission =
          data['no.delay.webinar'] && data['no.delay.webinar'] == 1 ? true : false;
        if (!this.hasDelayPermission) {
          this.selectDelayMode = 'common';
        }
        this.speakerMaxNum = data['speaker_max_num'] || '';
        if (Number(this.$route.query.type) !== 2) {
          // 不是编辑，默认设置值如此
          // this.formData.zdy_inav_num = data['speaker_max_num'] > 1 ? `1v${Number(data['speaker_max_num'])-1}` : '1v1'
          this.zdy_inav_num =
            data['speaker_max_num'] > 1 ? `1v${Number(data['speaker_max_num']) - 1}` : '1v1';
        }
      },
      getLangKeyVal(lang, key) {
        let label = '';
        if (key == 'real') {
          for (let i = 0; i < this.queryLangList.length; i++) {
            if (this.queryLangList[i].language_type == lang) {
              label = this.queryLangList[i][key];
              break;
            }
          }
        } else {
          for (let i = 0; i < this.languageOps.length; i++) {
            if (this.languageOps[i].value == lang) {
              label = this.languageOps[i][key];
              break;
            }
          }
        }
        // console.log('当前label结果', label)
        return label;
      },
      addLangList(val) {
        // 默认选择排序，永远简体中文 > 英文 > 西班牙语
        const newVal = val.sort();
        this.languageVa = newVal;
        this.$nextTick(() => {
          this.setTitleOrContentList(newVal, 'titleList');
          this.setTitleOrContentList(newVal, 'contentList');
        });
      },
      setTitleOrContentList(val, key) {
        const oldList = this.formData[key]; // 历史表单内容
        console.log('勾选语言之前历史语言包情况：', JSON.stringify(oldList));
        // console.log('当前选中值', val) // 语言情况
        // 若是已经勾选过，进行更新
        this.formData[key] = [];
        for (let i = 0; i < val.length; i++) {
          const findList = oldList.filter(item => item.lang == val[i]);
          console.log('查找勾选前历史数据', JSON.stringify(findList));
          console.log('查找勾选前历史数据-history', JSON.stringify(this.historyLang));
          let value = '';
          if (findList && findList.length > 0) {
            value = findList[0].value;
          } else if (key == 'titleList' && this.historyLang[`lang${val[i]}`].subject) {
            value = this.historyLang[`lang${val[i]}`].subject;
          } else if (key == 'contentList' && this.historyLang[`lang${val[i]}`].introduce) {
            value = this.historyLang[`lang${val[i]}`].introduce;
          } else {
            value = '';
          }
          this.formData[key].push({
            value: value,
            key: key + '_' + val[i],
            lang: val[i],
            label: this.getLangKeyVal(val[i], 'label')
          });
        }
      },
      // 获取配置项开关 / 具体配置项值
      getConfigListIsOpen(type = 'user', scene = 1, webinar_id = '') {
        let userId = JSON.parse(sessionOrLocal.get('userId'));
        let params = {};
        if (type === 'webinar') {
          params = {
            webinar_id: webinar_id,
            webinar_user_id: userId,
            scene_id: scene
          };
        } else {
          params = {};
        }
        return this.$fetch('planFunctionGet', this.$params(params), {
          'gray-id': userId
        })
          .then(res => {
            if (res && res.code === 200 && res.data.permissions) {
              const data = JSON.parse(res.data.permissions);
              if (type === 'webinar' && scene == 1) {
                // 设置活动全部权限
                this.WEBINAR_PES = data;
              } else if (type === 'webinar' && scene == 2) {
                // 数据渲染
                this.hasDelayPermission =
                  data['no.delay.webinar'] && data['no.delay.webinar'] == 1 ? true : false;
                if (!this.hasDelayPermission) {
                  this.selectDelayMode = 'common';
                }
                this.speakerMaxNum = data['speaker_max_num'] || '';
                if (Number(this.$route.query.type) !== 2) {
                  // 不是编辑，默认设置值如此
                  // this.formData.zdy_inav_num = data['speaker_max_num'] > 1 ? `1v${Number(data['speaker_max_num'])-1}` : '1v1'
                  this.zdy_inav_num =
                    data['speaker_max_num'] > 1
                      ? `1v${Number(data['speaker_max_num']) - 1}`
                      : '1v1';
                }
                // this.handleLowerGradeHeart()
              } else {
                this.SAAS_VS_PES = data;
              }
            }
          })
          .catch(e => {
            console.log('刷新等情况下获取活动下接口配置项情况，异常不做任何处理');
          });
      },
      covertMaxNum(keyNum) {
        return;
      },
      handleSelectDelayMode(mode) {
        if (this.title === '编辑') return;
        if (this.selectDirectorMode === 1 && this.liveMode == 2) return;
        this.selectDelayMode = mode;
        // 切换直播延迟方式后，直播模式限制更新
        let inav_num = Number(this.zdy_inav_num.replace('1v', '')) + 1;
        if (mode === 'delay' && inav_num > 6) {
          this.zdy_inav_num = '1v5';
        }
      },
      handleSelectDirectorMode(mode) {
        if (this.title === '编辑') return;
        if (this.selectDelayMode == 'delay' && mode == 1) return;
        if (this.isFullScreen == 0) return;
        this.selectDirectorMode = mode;
      },
      getLiveBaseInfo(id, flag) {
        // webinar/info调整-直播中不能操作的使用1
        this.$fetch('getWebinarInfo', { webinar_id: id })
          .then(async res => {
            if (res.code != 200) {
              return this.$message.warning(res.msg);
            }
            this.liveDetailInfo = res.data;
            this.selectDirectorMode = this.liveDetailInfo.is_director || 0;
            this.isDelay = this.liveDetailInfo.no_delay_webinar == 1 ? true : false;
            this.selectDelayMode =
              this.hasDelayPermission && this.liveDetailInfo.no_delay_webinar == 1
                ? 'delay'
                : 'common';
            this.formData.title = this.liveDetailInfo.subject;
            this.formData.date1 = this.liveDetailInfo.start_time.substring(0, 10);
            this.formData.date2 = this.liveDetailInfo.start_time.substring(11, 16);
            this.liveMode = this.liveDetailInfo.webinar_type;
            this.isFullScreen = this.liveDetailInfo.webinar_show_type;
            // this.formData.imageUrl = this.liveDetailInfo.img_url;
            // this.formData.domain_url = this.liveDetailInfo.img_url;
            this.tagIndex = this.liveDetailInfo.category - 1;
            this.formData.home = this.liveDetailInfo.is_private == 1 ? false : true;
            this.formData.docSwtich = Boolean(this.liveDetailInfo.is_adi_watch_doc);
            this.formData.online = Boolean(this.liveDetailInfo.hide_watch);
            this.formData.reservation = Boolean(this.liveDetailInfo.hide_appointment);
            this.formData.content = this.liveDetailInfo.introduction;
            this.formData.hot = Boolean(this.liveDetailInfo.hide_pv);
            this.speakSwitch = Boolean(res.data.auto_speak);
            // 图片处理
            if (this.liveDetailInfo.img_url) {
              this.handlerImageInfo(this.liveDetailInfo.img_url);
            }
            // 当前还有其它语种
            await this.getLanguageList(id);
            if (this.liveDetailInfo.webinar_curr_num) {
              this.formData.limitCapacity = this.liveDetailInfo.webinar_curr_num;
              this.formData.limitCapacitySwtich = true;
            } else {
              this.formData.limitCapacitySwtich = false;
            }
            this.formData.capacity = Boolean(this.liveDetailInfo.is_capacity);
            // this.formData.zdy_inav_num = `1v${Number(this.liveDetailInfo.inav_num) - 1}`;
            this.zdy_inav_num = `1v${Number(this.liveDetailInfo.inav_num) - 1}`;
            if (this.liveDetailInfo.paas_record_id) {
              // 通过回放视频发布点播或定时直播跳转过来的，通过query参数赋值给selectMedia，不重新赋值，否则小组视频会出问题
              if (!this.selectMedia.id) {
                this.selectMedia.paas_record_id = this.liveDetailInfo.paas_record_id;
                this.selectMedia.id = this.liveDetailInfo.record_id;
                this.selectMedia.name = this.liveDetailInfo.record_subject;
              }
              this.selectMedia.msg_url = this.liveDetailInfo.msg_url || '.mp4';
            }
            if (flag) {
              // 音频直播 后缀是mp3,其它直播后缀是mp4
              this.selectMedia.msg_url = this.liveDetailInfo.webinar_type == 1 ? '.mp3' : '.mp4';
            }
            //处理云导播到期情况
            if (!this.webinarDirector) {
              this.selectDirectorMode = 0;
            }
            console.log(this.selectMedia, '?????????');
            // 重置修改状态
            setTimeout(() => {
              this.isChange = false;
            }, 300);
          })
          .catch(res => {
            this.$message({
              message: res.msg || '获取信息失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            console.log(res);
          })
          .finally(() => {
            this.loading = false;
          });
      },
      // 处理图片
      handlerImageInfo(url) {
        this.formData.imageUrl = getImageQuery(url);
        // 有参数
        if (cropperImage(url)) {
          let obj = parseImgOssQueryString(url);
          const { blur, crop } = obj;
          this.formData.backgroundSize = {
            x: Number(crop.x),
            y: Number(crop.y),
            width: Number(crop.w),
            height: Number(crop.h)
          };
          this.formData.blurryDegree = (blur && Number(blur.s) / 2) || 0;
          this.formData.lightDegree = obj.bright ? 10 + Number(obj.bright) / 5 : 10;
          this.imageCropMode = obj.mode;
        }
      },
      setQueryLang(text, lang, type) {
        // 当前只有默认语种
        this.formData[type].push({
          value: text,
          key: `${type}_${lang}`, // 组装格式，titleList_语言lang值
          lang: lang,
          label: this.getLangKeyVal(lang, 'label')
        });
        console.log('语种设置......', this.formData.titleList, this.formData.contentList);
      },
      // 查询其它非默认语种集合
      getLanguageList(webinar_id) {
        this.$fetch('languageList', { webinar_id: webinar_id })
          .then(langRes => {
            if (langRes.code == 200) {
              const list =
                langRes && langRes.data && langRes.data.list ? langRes.data.list || [] : []; // 多语言包，若无设定，默认中文
              this.queryLangList = list;
              this.delLang = langRes.data.language_types.split(',').filter(item => item != 1) || [];
              console.log('当前待删除语种集合', this.delLang);
              if (list.length > 0) {
                // 多语言包，若无设定，默认中文
                const langList =
                  list
                    .map(item => {
                      return item.language_type;
                    })
                    .sort() || [];
                this.oldLanguageVa = langList; // 已勾选的语言 - 参考值
                this.languageVa = this.hasMultilingual ? langList : [1];
                console.log('获取当前语言值', langList);
                this.formData.titleList = [];
                this.formData.contentList = [];
                for (let i = 0; i < langList.length; i++) {
                  console.log('当前语种情况', langList[i]);
                  if (!this.hasMultilingual && langList[i] != 1) {
                    // 若当前多语言未开启，重置为中文，并且直接跳出循环，只配置了一个
                    this.setQueryLang('', 1, 'titleList');
                    this.setQueryLang('', 1, 'contentList');
                    break;
                  } else {
                    const vo = list.filter(item => {
                      return item.language_type == langList[i];
                    });
                    if (vo && vo.length > 0) {
                      this.setQueryLang(vo[0].subject, langList[i], 'titleList');
                      this.setQueryLang(vo[0].introduction, langList[i], 'contentList');
                    }
                  }
                }
              } else {
                // 默认语言 - 简体中文
                this.languageVa = [1];
                this.setQueryLang(this.liveDetailInfo.subject || '', 1, 'titleList');
                this.setQueryLang(this.liveDetailInfo.introduction || '', 1, 'contentList');
              }
            }
          })
          .catch(error => {
            console.log('获取其它语种集合', error);
            // 默认语言 - 简体中文
            this.languageVa = [1];
            this.setQueryLang(this.liveDetailInfo.subject || '', 1, 'titleList');
            this.setQueryLang(this.liveDetailInfo.introduction || '', 1, 'contentList');
          });
      },
      sendData(content) {
        this.formData.content = content;
      },
      liveModeChange(index) {
        this.liveMode = index;
        // TODO 数据处理， 若当前是分组直播
        if (index == 6) {
          // 默认中文选中
          this.languageVa = [1];
          this.$nextTick(() => {
            this.setTitleOrContentList([1], 'titleList');
            this.setTitleOrContentList([1], 'contentList');
          });
        }
        if (index == 2) {
          this.selectDirectorMode = 0;
          this.isFullScreen = 1;
        }
      },
      cropComplete(cropperData, url, mode) {
        console.log(cropperData, url, '?????');
        this.formData.backgroundSize = cropperData;
        this.formData.imageUrl = url;
        this.imageCropMode = mode;
      },
      resetUpload() {
        let dom = document.querySelector('#webinar_cropper .el-upload__input');
        dom.click();
      },
      handleUploadSuccess(res, file) {
        console.log(res, file);
        // 文件上传成功，保存信息
        if (res.data) {
          this.$refs.webinarCropper.showModel(res.data.domain_url);
          // let domain_url = res.data.domain_url || ''
          // let file_url = res.data.file_url || '';
          // this.formData.imageUrl = file_url;
          // this.formData.domain_url = domain_url;
        }
      },
      beforeUploadHnadler(file) {
        const typeList = ['png', 'jpeg', 'gif', 'bmp'];
        console.log(file.type.toLowerCase());
        let typeArr = file.type.toLowerCase().split('/');
        const isType = typeList.includes(typeArr[typeArr.length - 1]);
        const isLt2M = file.size / 1024 / 1024 < 4;
        if (!isType) {
          this.$message({
            message: `上传封面图片只能是 ${typeList.join('、')} 格式`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        if (!isLt2M) {
          this.$message({
            message: '上传封面图片大小不能超过 4M',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        return isType && isLt2M;
      },
      uploadProcess(event, file, fileList) {
        console.log('uploadProcess', event, file, fileList);
      },
      uploadError(err, file, fileList) {
        console.log('uploadError', err, file, fileList);
        this.$message({
          message: '封面上传失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      },
      uploadPreview(file) {
        console.log('uploadPreview', file);
      },
      // 删除图片
      deleteImage() {
        this.formData.imageUrl = '';
        this.formData.blurryDegree = 0;
        this.formData.lightDegree = 10;
      },
      submitForm(formName) {
        if (this.formData.limitCapacitySwtich && this.formData.limitCapacity < 1) {
          this.$message({
            message: '最高并发请输入大于1的数值',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return;
        }
        if (!this.versionType && this.formData.limitCapacitySwtich) {
          if (this.formData.capacity) {
            if (this.formData.limitCapacity > this.limitInfo.total + this.limitInfo.extend) {
              this.$message({
                message: '最大并发数不能大于并发剩余量',
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
              return;
            }
          } else {
            if (this.formData.limitCapacity > this.limitInfo.total) {
              this.$message({
                message: '最大并发数不能大于并发剩余量',
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
              return;
            }
          }
        }
        if (this.webinarVideo && !this.selectMedia.id) {
          this.$message({
            message: '请先上传视频',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return;
        }
        // 特殊逻辑处理
        const defaultVo = {
          title: this.formData.titleList[0].value || '',
          introduction:
            this.unescapeHTML(
              (this.formData.contentList[0].value || '').replace('&lt;p&gt;', '')
            ) || '<p></p>'
        };

        let abelIdArr = [];
        this.checkedTags.forEach(item => {
          abelIdArr.push(item);
        });
        let label_ids = abelIdArr.join(',');

        let data = {
          webinar_id: this.webinarId || '',
          record_id: this.webinarVideo ? this.selectMedia.id : '',
          subject: defaultVo.title, // 标题
          introduction: defaultVo.introduction, // 简介
          start_time:
            this.webinarTypeToZH == '点播' ? '' : `${this.formData.date1} ${this.formData.date2}`, // 创建时间
          webinar_type: this.liveMode, // 1 音频 2 视频 3 互动 6 分组
          category: this.tagIndex + 1, // 类别 1 金融 2 互联网 3 汽车 4 教育 5 医疗 6 其他
          is_private: this.formData.home ? 0 : 1, // 是否在个人主页显示
          // is_open: Number(this.home),  // 是否公开活动 默认0为公开，1为不公开
          hide_watch: Number(this.formData.online), // 是否显示在线人数  1 是 0 否
          is_adi_watch_doc: Number(this.formData.docSwtich), // 观众是否可预览文档 1 是 0 否
          hide_appointment: Number(this.formData.reservation), // 是否显示预约人数 1 是 0 否
          hide_pv: Number(this.formData.hot), // 是否显示活动热度 1 是 0 否
          webinar_curr_num: this.formData.limitCapacitySwtich ? this.formData.limitCapacity : 0, // 	最高并发 0 无限制
          is_capacity: Number(this.formData.capacity), // 是否扩容 1 是 0 否
          img_url: this.$parseURL(this.domain_url).path, // 封面图
          copy_webinar_id: this.title == '复制' ? this.webinarId : '',
          no_delay_webinar: this.liveMode == 6 ? 1 : this.selectDelayMode == 'delay' ? 1 : 0, // 是否为无延迟直播 默认为0  1:无延迟 0:默认 对应知客delay_status [分组直播默认无延迟]
          is_timing: this.webinarVideo ? (this.$route.meta.webinarType == 'vod' ? 0 : 1) : '',
          inav_num:
            (this.liveMode == 3 || this.liveMode == 6) && this.webinarType == 'live'
              ? Number(this.zdy_inav_num.replace('1v', '')) + 1
              : '',
          is_director: this.selectDirectorMode || 0,
          webinar_show_type: this.liveMode == 1 || this.liveMode == 2 ? this.isFullScreen : 1
        };
        if (this.liveMode == 6) {
          data.auto_speak = Number(this.speakSwitch);
        }
        console.log('>>>>>>>>>>创建直播最终保存', data);

        if (this.$route.query.type != 2) {
          data = this.$params(data);
        }
        console.log('>>>>>>>>>>111', this.webinarTypeToZH, this.$params(data));
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.loading = true;
            let url;
            if (this.webinarVideo) {
              url = this.title === '编辑' ? 'liveEdit' : 'demandCreate';
            } else {
              url = this.title === '编辑' ? 'liveEdit' : 'createLive';
            }
            // 如果是复制活动，被复制的活动如果是需要付费转成免费，付费/邀请码转成邀请码
            if (
              (this.title == '复制' && this.liveDetailInfo.verify == 6) ||
              this.liveDetailInfo.verify == 3
            ) {
              const desc =
                this.liveDetailInfo.verify == 3
                  ? '根据合规要求，已将付费条件改为免费，如需调整请到观看限制中修改'
                  : '根据合规要求，已将付费+邀请码条件改为邀请码，如需调整请到观看限制中修改';
              this.$confirm(desc, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                customClass: 'zdy-message-box',
                lockScroll: false,
                cancelButtonClass: 'zdy-confirm-cancel'
              })
                .then(() => {
                  this.postWebinarInfo(data, url, label_ids);
                })
                .catch(() => {
                  this.loading = false;
                });
            } else {
              this.postWebinarInfo(data, url, label_ids);
            }
            console.log(data);
          } else {
            this.$message({
              message: '请完善必填字段',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            document.documentElement.scrollTop = 0;
            return false;
          }
        });
      },
      // 提交活动信息
      postWebinarInfo(data, url, label_ids) {
        this.$fetch(url, Object.assign(this.$params(data), { label_ids }))
          .then(async res => {
            if (res.code == 200) {
              if (this.selectDirectorMode === 1) {
                //创建或者编辑云导播活动 保存成功后
                let userId = JSON.parse(sessionOrLocal.get('userId'));
                this.$vhall_paas_port({
                  k: 100837,
                  data: {
                    business_uid: userId,
                    user_id: '',
                    webinar_id: this.webinarId,
                    refer: '',
                    s: '',
                    report_extra: {},
                    ref_url: '',
                    req_url: ''
                  }
                });
              }
              // 若是开启了 - 多语言权限，调用创建多语言接口。否则不调用
              await this.sendLanguage(res.data.webinar_id, url)
                .then(result => {
                  console.log('Promise.all --- success', result, res); // 返回的是个结果数据 [ '3秒后醒来', '2秒后醒来' ]
                  this.loading = false;
                  this.renderSave(res);
                })
                .catch(error => {
                  console.log('Promise.all --- error', error);
                  this.loading = false;
                  this.$message({
                    message: error.msg || '操作失败',
                    showClose: true,
                    // duration: 0,
                    type: 'error',
                    customClass: 'zdy-info-box'
                  });
                });
            } else {
              this.$message({
                message: res.msg || '操作失败',
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
            }
          })
          .catch(res => {
            this.$message({
              message: res.msg || `操作失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            if (res.code == 512076) {
              this.checkedTags = [];
              this.checkedTagsBefore = [];
              this.getTagsList('init');
            }
          })
          .finally(() => {
            this.loading = false;
          });
      },
      renderSave(res) {
        if (this.liveMode == 6) {
          // 创建分组直播成功
          this.isChange = false;
          if (this.title == '创建' && !this.isPushVodLanguage) {
            this.$alert(
              `创建成功，观看密码默认为666666，请前往 <a href="${window.location.origin}${process.env.VUE_APP_WEB_KEY}/live/viewerRules/${res.data.webinar_id}?type=${res.data.webinar_type}">【观看限制】</a>更改密码或观看限制`,
              '提示',
              {
                confirmButtonText: '我知道了',
                customClass: 'zdy-alert-box zdy-padding',
                dangerouslyUseHTMLString: true,
                // center: true,
                lockScroll: false,
                callback: () => {
                  this.$router.push({ path: `/live/detail/${res.data.webinar_id}` });
                  //location.href = `${window.location.origin}${process.env.VUE_APP_WEB_KEY}/live/viewerRules/${res.data.webinar_id}?type=${data.webinar_type}`
                }
              }
            );
          } else {
            // 创建其它直播成功
            this.$message({
              message: `${this.title}成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            setTimeout(() => {
              this.$router.push({ path: `/live/detail/${res.data.webinar_id}` });
            }, 500);
          }
        } else {
          // 创建其它直播成功
          this.$message({
            message: `${this.title}成功`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          this.$route.query.record_id ? this.reVodEditReportData() : this.reportData();
          this.isChange = false;
          setTimeout(() => {
            this.$router.push({ path: `/live/detail/${res.data.webinar_id}` });
          }, 500);
        }
      },
      async languageCreate(params) {
        return await this.$fetch('languageCreate', {
          ...params
        });
      },
      async languageEdit(params) {
        return await this.$fetch('languageEdit', {
          ...params
        });
      },
      async languageDel(params) {
        return await this.$fetch('languageDel', {
          ...params
        });
      },
      sendLanguage(webinar_id, url) {
        const arrList = [];
        // concatLang = （原来设置的语种集合 + 已勾选的语种集合）去除重复数据后结果
        let concatLang = [];
        if (this.$route.query.id) {
          // 当前表示复制，因为拿有oldLanguageVa的历史数据，导致保存时调用接口错误，需要去除
          concatLang = Array.from(new Set(this.languageVa));
        } else if (this.$route.query.webinar_id) {
          // 当前表示发布为定时直播，因为拿有oldLanguageVa的历史数据，导致保存时调用接口错误，需要去除
          concatLang = Array.from(new Set(this.languageVa));
        } else {
          concatLang = Array.from(new Set(this.oldLanguageVa.concat(this.languageVa)));
        }
        console.log('最终需要处理的语种有', concatLang);
        // demo 当前默认勾选的语种
        const demo = this.languageVa[0];
        for (let i = 0; i < concatLang.length; i++) {
          const langTitle = this.formData.titleList.filter(item => {
            return item.lang == concatLang[i];
          });
          const langIntroduce = this.formData.contentList.filter(item => {
            return item.lang == concatLang[i];
          });
          if (url == 'liveEdit') {
            // 如果是编辑
            if (
              this.oldLanguageVa.includes(concatLang[i]) &&
              this.languageVa.includes(concatLang[i])
            ) {
              // 如果当前语种在原来的语种里，也在新勾选的语种里也有。
              console.log('当前语言为修改', concatLang[i]);
              console.log('当前语言为修改-判断1', this.liveDetailInfo.subject);
              console.log('当前语言为修改-判断2', this.queryLangList);
              // 获取循环的语种，是否真实存在与数据库标记
              let realTag = this.getLangKeyVal(concatLang[i], 'real');
              if (realTag == 0 || this.isPushVodLanguage) {
                // 举例: 只设置了英文，然后关闭多语言权限，点击保存中文，这个时候应该是新增
                arrList.push(
                  this.languageCreate({
                    webinar_id: webinar_id,
                    language_type: concatLang[i],
                    subject: langTitle && langTitle.length > 0 ? langTitle[0].value : '',
                    introduction:
                      langIntroduce && langIntroduce.length > 0 ? langIntroduce[0].value : '',
                    status: concatLang[i] == demo ? 1 : 0 // 0:非默认语种 1：默认语种
                  })
                );
              } else {
                // 当前语言为修改
                arrList.push(
                  this.languageEdit({
                    webinar_id: webinar_id,
                    language_type: concatLang[i],
                    subject: langTitle && langTitle.length > 0 ? langTitle[0].value : '',
                    introduction:
                      langIntroduce && langIntroduce.length > 0 ? langIntroduce[0].value : '',
                    status: concatLang[i] == demo ? 1 : 0 // 0:非默认语种 1：默认语种
                  })
                );
              }
            } else if (
              !this.oldLanguageVa.includes(concatLang[i]) &&
              this.languageVa.includes(concatLang[i])
            ) {
              // 如果当前语种，不在原来的语种集合里，当前为新增的数据。
              console.log('当前语言为新增', concatLang[i]);
              // 当前语言为新增
              arrList.push(
                this.languageCreate({
                  webinar_id: webinar_id,
                  language_type: concatLang[i],
                  subject: langTitle && langTitle.length > 0 ? langTitle[0].value : '',
                  introduction:
                    langIntroduce && langIntroduce.length > 0 ? langIntroduce[0].value : '',
                  status: concatLang[i] == demo ? 1 : 0 // 0:非默认语种 1：默认语种
                })
              );
            } else if (
              this.oldLanguageVa.includes(concatLang[i]) &&
              !this.languageVa.includes(concatLang[i])
            ) {
              // 如果当前语种，在原来的语种集合里，但是不在新勾选的语种里，且数据库里真实存在，删除该语种记录
              console.log('当前语言为删除', concatLang[i]);
              console.log(this.queryLangList);
              const isReal = this.queryLangList.filter(
                item => item.language_type == concatLang[i]
              )[0].real;
              if (isReal == 1) {
                arrList.push(
                  this.languageDel({
                    webinar_id: webinar_id,
                    language_type: concatLang[i]
                  })
                );
              }
            }
            if (!this.hasMultilingual) {
              // 如果是编辑，并且当前无权限
              for (let j = 0; j < this.delLang.length; j++) {
                arrList.push(
                  this.languageDel({
                    webinar_id: webinar_id,
                    language_type: this.delLang[j]
                  })
                );
              }
            }
          } else {
            // 如果当前是新增操作，所有的语言都为新增
            arrList.push(
              this.languageCreate({
                webinar_id: webinar_id,
                language_type: concatLang[i],
                subject: langTitle && langTitle.length > 0 ? langTitle[0].value : '',
                introduction:
                  langIntroduce && langIntroduce.length > 0 ? langIntroduce[0].value : '',
                status: concatLang[i] == demo ? 1 : 0 // 0:非默认语种 1：默认语种
              })
            );
          }
        }
        console.log('当前最终发送的请求为...', arrList);
        return arrList.length > 0 ? Promise.all(arrList) : Promise.resolve(null);
      },
      reportData() {
        let userId = JSON.parse(sessionOrLocal.get('userId'));
        let arrType = [100022, 100020, 100021];
        if (this.title === '创建') {
          let refer = this.$route.query.refer || 2;
          if (this.webinarTypeToZH === '点播') {
            this.$vhall_paas_port({
              k: 100019,
              data: {
                business_uid: userId,
                user_id: '',
                webinar_id: '',
                refer: refer,
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
          }
          if (this.webinarTypeToZHTitle === '直播') {
            this.$vhall_paas_port({
              k: 100018,
              data: {
                business_uid: userId,
                user_id: '',
                webinar_id: '',
                refer: refer,
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
            this.$vhall_paas_port({
              k: arrType[this.liveMode - 1],
              data: {
                business_uid: userId,
                user_id: '',
                webinar_id: '',
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
          }
        }
        if (this.webinarTypeToZHTitle === '直播') {
          // 文档
          this.$vhall_paas_port({
            k: this.formData.docSwtich ? 100023 : 100024,
            data: {
              business_uid: userId,
              user_id: '',
              webinar_id: this.webinarId,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
          // 预约
          this.$vhall_paas_port({
            k: this.formData.reservation ? 100025 : 100026,
            data: {
              business_uid: userId,
              user_id: '',
              webinar_id: this.webinarId,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
          // 在线人数
          this.$vhall_paas_port({
            k: this.formData.online ? 100027 : 100028,
            data: {
              business_uid: userId,
              user_id: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
          // 并发扩容
          this.$vhall_paas_port({
            k: this.formData.capacity ? 100033 : 100034,
            data: {
              business_uid: userId,
              user_id: '',
              webinar_id: this.webinarId,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
        }
        // 封面图
        this.$vhall_paas_port({
          k: 100037,
          data: {
            business_uid: userId,
            user_id: '',
            webinar_id: this.webinarId,
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        // 热度
        this.$vhall_paas_port({
          k: this.formData.hot ? 100029 : 100030,
          data: {
            business_uid: userId,
            user_id: '',
            webinar_id: this.webinarId,
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        // 关联主页
        this.$vhall_paas_port({
          k: this.formData.home ? 100031 : 100032,
          data: {
            business_uid: userId,
            user_id: '',
            webinar_id: this.webinarId,
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        // 最高并发
        this.$vhall_paas_port({
          k: this.formData.limitCapacitySwtich ? 100035 : 100036,
          data: {
            business_uid: userId,
            user_id: '',
            webinar_id: this.webinarId,
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
      },
      reVodEditReportData() {
        let userId = JSON.parse(sessionOrLocal.get('userId'));
        this.$vhall_paas_port({
          k: 100414,
          data: {
            business_uid: userId,
            user_id: '',
            webinar_id: '',
            s: '',
            refer: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
      },
      unescapeHTML(title) {
        title = '' + title;
        return title
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/p&gt;/g, 'p>')
          .replace(/&apos;/g, "'")
          .replace(/&quot;/g, '"');
      },
      // 预览
      previewVideo() {
        this.showDialog = true;
      },
      // 删除
      deleteSelectMedia() {
        this.selectMedia = {};
      },
      getHighLimit() {
        this.$fetch('getHighLimit').then(res => {
          this.limitInfo = res.data;
          // this.versionType = res.data.type;
        });
      },
      resetForm(formName) {
        this.$router.push({ path: '/live/list' });
        // this.$refs[formName].resetFields();
        // if(this.$route.query.type == 2){
        //    this.$router.go(-1)
        // }else {
        //   this.$confirm(`取消将不保存此页面的内容？`, '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     customClass: 'zdy-message-box',
        //     lockScroll: false,
        //     cancelButtonClass: 'zdy-confirm-cancel'
        //   }).then(() => {
        //     // next();
        //       this.$router.go(-1)
        //   }).catch(() => {
        //     });
        // }
        // 重置直播模式、直播封面、直播简介。
      },
      // 鼠标离开
      hiddenMenu() {
        this.showChecked = false;
      },
      //鼠标滑上去
      showMenu() {
        this.showChecked = true;
      },
      mediaSelected(media) {
        this.selectMedia = media;
        console.log(this.selectMedia);
      },

      // open标签编辑
      openTagDia(type) {
        if (type == 'but' && this.checkedTags.length) return false;
        this.selectTagDialog = true;
      },
      // open创建标签
      openCreatTagDia() {
        if (this.tagList.length >= 100) {
          this.$message.warning('账号下最多创建100个直播标签');
          return false;
        }
        this.tagName = '';
        this.createTagDialog = true;
      },
      // 获取标签列表
      getTagsList(data) {
        return this.$fetch('labelList', {
          // 编辑使用params 复制使用query
          webinar_id: this.$route.params.id || this.$route.query.id,
          pos: 0,
          limit: 100
        }).then(res => {
          if (res.code == 200) {
            this.tagList = res.data.list;
            // 初始化时同步一次选中数据
            if (data == 'init') {
              this.tagList.forEach(item => {
                if (item.is_check) {
                  this.checkedTags.push(item.label_id);
                  this.checkedTagsBefore.push(item.label_id);
                }
              });
            }
          }
        });
      },
      // 创建保存
      sureAsyncHandle() {
        let params = {
          name: this.tagName
        };
        this.$fetch('labelCreate', params)
          .then(async res => {
            if (res.code == 200) {
              this.$message.success('标签保存成功');
              this.unSureAsyncHandle();
              await this.getTagsList();
              console.log(this.checkedTagsBefore);
              if (this.checkedTagsBefore.length < 10) {
                let obj = this.tagList.find(item => item.name == this.tagName);
                this.checkedTagsBefore.push(obj.label_id);
              }
            }
          })
          .catch(err => {
            this.$message.warning(err.msg);
          });
      },
      // 创建取消
      unSureAsyncHandle() {
        this.createTagDialog = false;
      },
      // 确认选择标签
      sureSelectTag() {
        this.selectTagDialog = false;
        this.checkedTags = JSON.parse(JSON.stringify(this.checkedTagsBefore));
      },
      // 取消选择标签
      unSureSelectTag() {
        this.checkedTagsBefore = this.checkedTags;
        this.selectTagDialog = false;
      },
      // 选择横竖屏直播设置
      choseFullScreen(type) {
        if (this.title === '编辑') return;
        if (this.selectDirectorMode === 1 && (this.liveMode == 1 || this.liveMode == 2)) return;
        this.isFullScreen = type;
      }
    }
  };
</script>

<style lang="less" scoped>
  .set-font {
    font-size: 14px;
    font-weight: 400;
    color: #3562fa;
  }
  .ft20 {
    font-size: 20px;
    position: relative;
    top: 2px;
  }
  .titleBox {
    padding-bottom: 4px;
  }
  .el-form {
    background: #ffffff;
    padding: 48px 20px 50px 48px;
    margin-top: 32px;
    border-radius: 4px;
    /deep/ .el-switch__label--left {
      color: #1a1a1a;
      pointer-events: none;
      user-select: none;
      margin: 0 13px;
    }
    /deep/ .el-switch__label--right {
      color: #999999;
      pointer-events: none;
      user-select: none;
    }
    /deep/.el-input__inner {
      height: 40px;
    }
    .title-inform /deep/.el-input__inner {
      padding: 0 12px;
    }
    // /deep/.el-date-editor {
    //   /deep/input {
    //     width: 270px;
    //   }
    // }
  }
  .form-slider {
    position: relative;
  }
  .image_cropper {
    width: 100%;
    margin-top: 16px;
    &_item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        color: #595959;
      }
      .wid_block {
        display: inline-block;
        width: 16px;
      }
    }
  }
  .item-time {
    p {
      color: #666;
      font-size: 14px;
    }
    .el-form-item {
      margin-bottom: 0px;
      /deep/.iconfont-v3 {
        color: #999;
        font-size: 14px;
      }
      /deep/.el-input__icon {
        color: #999;
      }
    }
  }
  .item-last {
    &.el-form-item {
      margin-bottom: 0px;
    }
  }

  /deep/.el-upload--picture-card i.saasicon_shangchuan {
    font-size: 40px;
  }
  .date {
    /deep/.el-input__prefix {
      left: 8px;
    }
  }
  /deep/ .el-form-item {
    // width: 100%;
    max-width: 700px;
    margin-bottom: 22px;
    &.max-column {
      max-width: 868px;
      margin-bottom: 26px;
      .titleBox {
        padding-bottom: 4px;
      }
      .group {
        display: flex;
        align-items: center;
        .btn {
          height: 36px;
          line-height: 36px;
          border-radius: 4px;
          background-color: #fff;
          border: 1px solid #ccc;
          color: #666;
          padding: 0 10px;
          margin-right: 10px;
          cursor: pointer;
          &.active {
            background-color: #fb3a32;
            border-color: #fb3a32;
            color: #fff;
          }
        }
      }
    }
  }
  /deep/.el-col-11 {
    height: 40px;
  }
  /deep/.tox-tinymce {
    border-radius: 4px;
  }
  /deep/.el-upload--picture-card {
    border-radius: 4px;
  }
  /* 图片上传 */
  .upload__avatar {
    /deep/.el-upload--picture-card {
      height: 180px;
      border: 1px solid #cccccc;
      &:hover {
        border: 1px solid #999;
      }
    }
    /deep/.box > div {
      height: 180px;
    }
  }
  .line {
    margin-right: 16px;
  }
  .pageTitle {
    font-size: 14px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #666666;
    line-height: 40px;
    margin-right: 9px;
    .blue {
      color: #3562fa;
      &:hover {
        cursor: pointer;
      }
    }
    // padding-bottom: 5px;
  }
  .el-form-item.invd-number {
    max-width: 800px;
  }
  .delay-select,
  .delay-director {
    min-width: 200px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    .mode-common,
    .mode-delay,
    .mode-director {
      width: 183px;
      height: 86px;
      border: 1px solid #f2f2f2;
      background: #f2f2f2;
      border-radius: 4px;
      position: relative;
      line-height: 80px;
      text-align: center;
      color: #666666;
      &:hover {
        cursor: pointer;
      }
      .no-open {
        width: 44px;
        height: 18px;
        position: absolute;
        bottom: 0px;
        left: 0px;
        background: #999999;
        border-radius: 0px 12px 0px 4px;
        text-align: center;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 17px;
      }
      .common-icon {
        display: inline-block;
        width: 20px;
        height: 20px;
      }
    }
    .noDelay,
    .noDirector {
      &:hover {
        cursor: unset;
      }
    }
    .mode-delay,
    .mode-director {
      margin-left: 24px;
    }
    .delayActive,
    .directorActive {
      border-color: #fb3a32;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        top: -1px;
        right: -1px;
        width: 20px;
        height: 20px;
        background: url('../../common/images/icon-choose.png');
        background-size: 20px;
        background-position: center;
      }
    }
    .disableBox .text-content {
      opacity: 0.3;
    }
  }
  .margin32 {
    margin-bottom: 32px;
  }
  .language-select {
    min-width: 200px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: row;
    /deep/.el-checkbox-group {
      height: 20px;
      line-height: 20px;
    }
    /deep/.el-checkbox__input.is-disabled .el-checkbox__inner {
      background-color: #ffffff;
      border-color: #cccccc;
      cursor: not-allowed;
    }
    /deep/.el-checkbox__input.is-checked .el-checkbox__inner {
      border-color: #fb3a32;
    }
    /deep/.el-checkbox {
      color: #1a1a1a;
    }
    /deep/.el-checkbox__inner {
      border-color: #999999;
      &:hover,
      &:active {
        border-color: #fb3a32;
      }
    }
  }
  .el-icon-question {
    color: #999999;
  }
  .modeBox {
    display: flex;
    justify-content: space-between;
    position: relative;
    transition: all 0.15s ease-in;
    > div {
      // height: 112px;
      width: 185px;
      border-radius: 4px;
      img {
        width: 100%;
        height: 116px;
        object-fit: scale-down;
        cursor: pointer;
        &.disabled {
          pointer-events: none;
          .notAllow {
            display: block;
          }
        }
        &.active {
          border-color: #fb3a32;
          .block {
            background: #ffebeb;
            .icon {
              color: #fb3a32;
            }
          }
        }
        &:nth-child(2) {
          .el-header {
            .block {
              height: 13px;
            }
          }
        }
        &:hover {
          box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
        }
        &.active {
          box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
          // box-shadow: 0px 6px 12px 0px rgba(251, 58, 50, 0.16);
        }
      }
      // position: relative;
      // overflow: hidden;
      .notAllow {
        position: absolute;
        color: #727272;
        bottom: -24px;
        right: -32px;
        background: #f2f2f2;
        font-size: 10px;
        line-height: normal;
        padding: 5px 20px;
        padding-bottom: 39px;
        transform: rotate(-45deg);
        display: block;
      }
    }
    // .model{
    //   width: 100px;
    //   height: 56px;
    //   margin: 0 auto;
    //   margin-top: 16px;
    //   img{
    //     width: 100%;
    //     height: 100%;
    //     object-fit: scale-down;
    //   }
    //   .el-aside{
    //     margin-right: 2px;
    //   }
    //   .el-header{
    //     margin-bottom: 2px;
    //   }
    //   .el-header,.el-main{
    //     padding: 0;
    //   }
    //   .block{
    //     background: #F2F2F2;
    //     position: relative;
    //   }
    //   .icon{
    //     position: absolute;
    //     top: 0;
    //     right: 0;
    //     bottom: 0;
    //     left: 0;
    //     margin: auto;
    //     font-size: 20px;
    //     color: #999999;
    //     height: fit-content;
    //     width: fit-content;
    //   }
    // }
    .desc {
      font-size: 14px;
      text-align: center;
      line-height: 5px;
      color: #666666;
    }
  }
  .modeHide {
    position: absolute;
    top: 0;
    left: 0;
    height: 130px;
    width: 100%;
    margin-top: 30px;
  }
  .tag {
    padding: 3px 18px;
    border: 1px solid #cccccc;
    font-size: 14px;
    color: #666666;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 16px;
    transition: all 0.2s ease-out;
    &.active {
      background: #fb3a32;
      color: #fff;
      border-color: transparent;
    }
  }
  .el-switch {
    margin-bottom: 32px;
  }
  .switch__box.last {
    .el-switch {
      margin-bottom: 0;
    }
  }
  .limitInput {
    margin-left: 80px;
    max-width: 360px;
    margin-top: 15px;
  }
  .limitInput /deep/.el-input__inner {
    padding: 0 12px;
  }
  .uploadDesc {
    line-height: 20px;
  }
  .btnGroup {
    // text-align: center;
    margin-top: 32px;
    margin-bottom: 0;
  }
  .editBox {
    .common-button {
      height: 40px;
    }
  }
  /*.editBox {
    padding: 0px 40px;
  }
  @media screen and (min-width: 1920px) {
    .editBox {
      padding: 0px 140px;
    }
  }*/
  .mediaBox {
    background-color: #fbfdff;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
    width: 100%;
    height: 180px;
    display: table;
    position: relative;
    .abRight {
      position: absolute;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.7);
      top: 0px;
      right: 0px;
      // line-height: 180px;
      text-align: center;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      color: #fff;
      .tool {
        width: 30px;
        line-height: 20px;
        margin: 0px 5px;
        &:hover {
          cursor: pointer;
        }
      }
      span {
        color: #fff;
        font-size: 14px;
      }
      /deep/.saasicon_shanchu {
        font-size: 20px !important;
        height: 30px;
      }
      /deep/.saasicon-eye {
        font-size: 22px !important;
        height: 30px;
      }
    }
    .operaBtn {
      font-size: 14px;
      color: #fff;
    }
    &:hover {
      border-color: #999;
    }
    .mediaSlot {
      display: table-cell;
      text-align: center;
      vertical-align: middle;
      line-height: 20px;
      color: #999999;
      background: #f7f7f7;
      font-size: 12px;
      cursor: pointer;
      border-radius: 4px;
      .selectMediaName {
        word-break: break-word;
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        padding: 0 144px;
        font-size: 14px;
        color: #666;
        padding-top: 12px;
        line-height: 18px;
      }
      i {
        font-size: 30px;
      }
      /deep/.iconfont-v3 {
        font-size: 26px;
      }
      .picInco {
        height: 24px;
      }
      /deep/.saasicon_shangchuan {
        font-size: 40px;
      }
      /deep/.saasshipinwenjian {
        color: #ff733c;
      }
      p {
        padding-top: 5px;
      }
    }
    .el-tooltip {
      position: absolute;
      right: -24px;
      top: -10px;
      i {
        font-size: 14px;
      }
    }
  }
  .vh-saas-dialog {
    /deep/ .el-dialog {
      width: 624px !important;
      background: transparent !important;
      border: none;
      box-shadow: none;
    }
    /deep/ .el-dialog__header {
      width: 642px !important;
      padding: 0px;
      height: 55px;
      background: transparent !important;
      border: none;
      color: #fff;
    }
    /deep/ .el-dialog__headerbtn {
      top: 30px;
      right: -18px;
      .el-dialog__close {
        color: #fff;
      }
    }
    /deep/ .el-dialog__body {
      width: 642px;
      height: 375px;
      border-top: 4px solid #1a1a1a;
      border-bottom: 4px solid #1a1a1a;
      background: #1a1a1a;
      border-radius: 4px;
      padding: 0 4px;
    }
  }
  /deep/.saasicon_help_m {
    color: #999999;
    vertical-align: bottom;
    &:hover {
      color: #666;
    }
  }
  .delay-mask {
    position: fixed;
    top: 0px;
    left: 0px;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    width: 100%;
    height: 100%;
    .delay-intro {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;
      border-radius: 8px;
      width: 740px;
      height: 500px;
      .title {
        width: 310px;
        min-height: 30px;
        font-size: 44px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #fb3b32;
        line-height: 62px;
        margin: 60px auto 56px;
        text-align: center;
        position: relative;
        &::before {
          content: '';
          position: absolute;
          top: 50%;
          left: -70px;
          transform: translateY(-50%);
          background: url('../../common/images/delay-intro-left.png');
          background-position: center;
          background-size: 60px 22px;
          width: 60px;
          height: 22px;
          display: inline-block;
        }
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          right: -70px;
          transform: translateY(-50%);
          background: url('../../common/images/delay-intro-right.png');
          background-position: center;
          background-size: 60px 22px;
          width: 60px;
          height: 22px;
          display: inline-block;
        }
      }
      .content {
        display: flex;
        flex-direction: row;
        .lf,
        .lr {
          width: 50%;
        }
        .lr {
          box-sizing: border-box;
          padding: 0px 50px 0px 30px;
          height: 260px;
          overflow-y: scroll;
          .sub-title {
            width: 95px;
            height: 24px;
            background: #fb3d32;
            border-radius: 15px;
            font-size: 16px;
            font-family: HiraginoSansGB-W6, HiraginoSansGB;
            font-weight: normal;
            color: #ffffff;
            line-height: 24px;
            text-align: center;
            margin-bottom: 24px;
            position: relative;
            &::after {
              content: '';
              position: absolute;
              bottom: -12px;
              left: 0px;
              width: 40px;
              height: 4px;
              background: url('../../common/images/delay-bottom.png');
              background-position: center;
              background-size: 40px 4px;
            }
          }
          .sub-content {
            color: #1a1a1a;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            line-height: 20px;
            margin-bottom: 16px;
          }
        }
        .lf {
          height: 306px;
          // border-bottom-left-radius: 8px;
          background: url('../../common/images/nodelay.png') no-repeat;
          background-position: center;
          background-size: 100%;
        }
      }
      .close {
        position: absolute;
        top: -25px;
        right: 4px;
        color: #fff;
        &:hover {
          cursor: pointer;
        }
      }
    }
  }
  li.el-select-dropdown__item.is-disabled {
    color: #bfbfbf;
    &:hover {
      background: #ffffff;
    }
  }
  /deep/.el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #fb3a32;
    border-color: #fb3a32;
  }
</style>
<style lang="less">
  html {
    background: #f7f7f7;
  }
  .el-tooltip__popper {
    max-width: 372px;
  }
  .editor-wrap {
    .tox-statusbar {
      display: none;
    }
  }
  .zdy-alert-box.zdy-padding {
    padding-bottom: 0 !important;
  }
  .tags_box {
    .tag_name_dom {
      width: 92%;
      line-height: 38px;
      display: inline-block;
      border: 1px solid #ccc;
      padding: 4px 12px;
      border-radius: 4px;
      .tag_box_lineheight {
        line-height: 30px;
        .name_base {
          display: inline-block;
          line-height: initial;
          padding: 3px 8px 4px;
          background: #f2f2f2;
          border-radius: 4px;
          margin-right: 8px;
        }
      }
    }
    .notag {
      background: #f7f7f7;
      text-align: center;
      color: #666;
      cursor: pointer;
    }
    .tags_edit {
      margin-left: 14px !important;
      color: #3562fa !important;
      position: absolute;
      top: 12px;
    }
  }
  .selectTagDia {
    .el-dialog__header {
      padding: 24px 32px 12px;
    }
    .el-dialog {
      margin-top: 20vh !important;
    }
    .el-dialog__body {
      padding: 0;
    }
    .el-dialog__title {
      font-weight: bold;
    }
    .null-page {
      margin-top: 35px !important;
    }
    .createActive {
      padding-bottom: 40px;
    }
    .creat_tip {
      margin-left: 8px;
      color: #999;
    }
    .creat_header {
      padding-top: 12px;
      padding-bottom: 20px;
    }
    .tag_content {
      padding: 0 28px 0 32px;
      height: 204px;
      overflow: auto;
      margin-right: 4px;
      .el-checkbox__input.is-disabled .el-checkbox__inner {
        background: rgba(230, 230, 230, 40%);
      }
      .el-checkbox__label {
        padding-left: 6px;
      }
      .check_base {
        margin: 0 16px 12px 0;
        .tag_base {
          padding: 4px 8px;
          border-radius: 4px;
          background: #f2f2f2;
          color: #666;
        }
      }
    }
    .checked_num {
      float: left;
      display: block;
      line-height: 36px;
      &:first-child > span {
        color: #fb3a32;
      }
    }
    .async__footer {
      padding: 12px 32px 24px !important;
    }
  }
  .createTagDia {
    .el-dialog {
      margin-top: 30vh !important;
    }
    .el-dialog__title {
      font-weight: bold;
    }
    .async__footer {
      padding: 24px 0 !important;
    }
  }
</style>
