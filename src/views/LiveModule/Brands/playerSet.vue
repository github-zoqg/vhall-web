<template>
  <div class="prize-card">
    <pageTitle pageTitle="播放器设置"></pageTitle>
    <div class="player-set" style="min-height:741px;">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="防录屏跑马灯" name="first">
          <div class="give-item">
            <div class="give-prize">
              <el-form :model="formHorse" ref="ruleForm" :rules="rules" label-width="100px">
                <el-form-item label="跑马灯">
                  <p class="switch__box">
                    <el-switch
                      v-model="scrolling_open"
                      active-color="#ff4949"
                      inactive-color="#ccc"
                      @change="closeHorseInfo"
                      :active-text="horseLampText"
                    >
                    </el-switch>
                  </p>
                </el-form-item>
                 <el-form-item label="显示方式">
                  <el-radio v-model="formHorse.scroll_type" :label="1" :disabled="!scrolling_open" @change="editHorseInfo">滚动</el-radio>
                  <el-radio v-model="formHorse.scroll_type" :label="2" :disabled="!scrolling_open" @change="editHorseInfo">闪烁</el-radio>
                </el-form-item>
                <el-form-item label="文本类型">
                  <el-radio v-model="formHorse.text_type" :label='1' :disabled="!scrolling_open" @change="editHorseInfo">固定文本</el-radio>
                  <el-radio v-model="formHorse.text_type" :label='2' :disabled="!scrolling_open" @change="editHorseInfo">固定文本+观看者ID和昵称</el-radio>
                </el-form-item>
                <el-form-item label="固定文本">
                  <VhallInput
                    v-model="formHorse.text"
                    class="textType"
                    placeholder="版权所有，盗版必究"
                    :disabled="!scrolling_open"
                    autocomplete="off"
                    :maxlength="20"
                    v-clearEmoij
                    show-word-limit
                    @change="editHorseInfo"
                  ></VhallInput>
                </el-form-item>
                <el-form-item label="文字大小">
                  <el-select v-model="formHorse.size" placeholder="请选择" :disabled="!scrolling_open" style="margin-bottom:10px" @change="editHorseInfo">
                    <el-option
                      v-for="item in fontList"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="文字颜色" prop="color">
                  <color-set ref="pageThemeColors"  :themeKeys=pageThemeColors :openSelect=true  @color="pageStyleHandle" :colorDefault="formHorse.color"></color-set>
                </el-form-item>
                <el-form-item label="不透明度"><el-slider v-model="formHorse.alpha" :disabled="!scrolling_open" style="width:315px" @change="editHorseInfo"></el-slider><span class="isNum">{{formHorse.alpha}}%</span></el-form-item>
                <el-form-item label="移动速度" v-if="formHorse.scroll_type == 1">
                  <el-radio v-model="formHorse.speed" :label="10000" :disabled="!scrolling_open" @change="editHorseInfo">慢</el-radio>
                  <el-radio v-model="formHorse.speed" :label="6000" :disabled="!scrolling_open" @change="editHorseInfo">中</el-radio>
                  <el-radio v-model="formHorse.speed" :label="3000" :disabled="!scrolling_open" @change="editHorseInfo">快</el-radio>
                </el-form-item>
                <el-form-item label="显示位置">
                  <el-radio v-model="formHorse.position" :label="1" :disabled="!scrolling_open" @change="editHorseInfo">随机</el-radio>
                  <el-radio v-model="formHorse.position" :label="2" :disabled="!scrolling_open" @change="editHorseInfo">上</el-radio>
                  <el-radio v-model="formHorse.position" :label="3" :disabled="!scrolling_open" @change="editHorseInfo">中</el-radio>
                  <el-radio v-model="formHorse.position" :label="4" :disabled="!scrolling_open" @change="editHorseInfo">下</el-radio>
                </el-form-item>
                <el-form-item label="间隔时间" prop="interval" v-if="formHorse.scroll_type == 1">
                  <el-input
                    v-model="formHorse.interval"
                    :disabled="!scrolling_open"
                    maxlength="3"
                    @blur="blurChange"
                    @keyup="editHorseInfo"
                    oninput="this.value=this.value.replace(/[^0-9]/g, '')"
                    placeholder="默认20，支持输入范围1-300">
                    <i slot="suffix">秒</i>
                    </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" class="common-save length152" v-preventReClick :disabled="!scrolling_open" @click="preFormHorse">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="give-white" v-show="!scrolling_open"></div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="水印设置" name="second">
          <div class="give-item">
            <div class="give-prize">
              <el-form :model="formWatermark" ref="ruleForm" label-width="100px">
                <el-form-item label="水印">
                  <p class="switch__box">
                    <el-switch
                      v-model="watermark_open"
                      active-color="#ff4949"
                      inactive-color="#ccc"
                      @change="openWaterMarkInfo"
                      :active-text="waterMarkText"
                    >
                    </el-switch>
                  </p>
                </el-form-item>
                <el-form-item label="水印图片" required>
                  <upload
                    class="giftUpload"
                    v-model="formWatermark.img_url"
                    :domain_url="domain_url"
                    :saveData="{
                      path: 'interacts/watermark-imgs',
                      type: 'image',
                    }"
                    :on-success="uploadAdvSuccess"
                    :on-progress="uploadProcess"
                    :on-error="uploadError"
                    :on-preview="uploadPreview"
                    :before-upload="beforeUploadHnadler"
                    :disabled="!watermark_open"
                    @delete="deleteImg"
                  >
                    <div slot="tip">
                      <p>建议尺寸：180*60px，小于2M</p>
                      <p>支持jpg、gif、png、bmp</p>
                    </div>
                  </upload>
                </el-form-item>
                <el-form-item label="水印位置">
                  <el-radio v-model="formWatermark.img_position" :label="1" :disabled="!watermark_open">左上角</el-radio>
                  <el-radio v-model="formWatermark.img_position" :label="2" :disabled="!watermark_open">右上角</el-radio>
                  <el-radio v-model="formWatermark.img_position" :label="4" :disabled="!watermark_open">左下角</el-radio>
                  <el-radio v-model="formWatermark.img_position" :label="3" :disabled="!watermark_open">右下角</el-radio>
                </el-form-item>
                <el-form-item label="不透明度">
                  <el-slider v-model="formWatermark.img_alpha" style="width: 315px" :disabled="!watermark_open"></el-slider>
                  <span class="isNum">{{formWatermark.img_alpha}}%</span>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary length152" v-preventReClick class="common-save" :disabled="!watermark_open" @click="preWatermark">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="give-white" v-show="!watermark_open"></div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="其它" name="third">
        <div class="give-item">
          <div class="give-prize">
              <el-form :model="formOther" ref="ruleForm" label-width="100px">
            <el-form-item label="弹幕">
              <p class="switch__box">
                <el-switch
                  v-model="formOther.bulletChat"
                  active-color="#ff4949"
                  inactive-color="#ccc"
                  :active-text="bulletChatText"
                  @change="otherOtherInfo(1)"
                >
                </el-switch>
              </p>
            </el-form-item>
            <el-form-item label="进度条">
              <p class="switch__box">
                <el-switch
                  v-model="formOther.progress"
                  active-color="#ff4949"
                  inactive-color="#ccc"
                  :active-text="progressText"
                  @change="otherOtherInfo(2)"
                >
                </el-switch>
              </p>
            </el-form-item>
            <el-form-item label="倍速">
              <p class="switch__box">
                <el-switch
                  v-model="formOther.doubleSpeed"
                  active-color="#ff4949"
                  inactive-color="#ccc"
                  :active-text="doubleSpeedText"
                  @change="otherOtherInfo(3)"
                >
                </el-switch>
              </p>
            </el-form-item>
          </el-form>
          </div>
        </div>
        </el-tab-pane>
      </el-tabs>
      <div class="show-purple">
          <!-- <el-button type="white-primary" size="small" round class="preview-video" @click="previewVideo" v-show="activeName=='second'">预览</el-button> -->
          <div class="video-wrap">
            <div id="videoDom"></div>
            <div class="waterMark" :class="`position_${formWatermark.img_position}`" v-if="watermark_open">
              <img :src="domain_url || audioImg" alt="" :style="{opacity: formWatermark.img_alpha + '%'}">
            </div>
            <div class="vod-controller" :class="{'active':hoveVideo}">
              <div class="slider line-slider">
                <el-slider v-model="sliderVal" :show-tooltip="false" ref="controllerRef" @change="setVideo" v-if="formOther.progress"></el-slider>
                <div class="Times" :style="{ left: hoverLeft + 'px' }" v-show="TimesShow">
                  <span class="current-time">{{ hoverTime | secondToDate }}</span>
                </div>
              </div>
              <div class="wrap">
                <div class="left-box fl">
                  <i v-if="!statePaly" class="iconfont-v3 saasicon_zanting" @click="videoPlayBtn"></i>
                  <i v-else class="iconfont-v3 saasicon_bofang" @click="videoPlayBtn"></i>
                  <div class="center-box">
                    <span class="current-time">
                      {{ currentTime | secondToDate }}
                    </span>
                    <span>/</span>
                    <span class="all-time">{{ totalTime | secondToDate }}</span>
                  </div>
                </div>
                <!-- <div class="center-wrap">
                  <div class="speed-box" v-if="formOther.doubleSpeed">
                    <span>倍速</span>
                  </div>
                  <div class="barrage-box">
                    <i class="iconfont-v3 saasdanmukai_icon" v-if="formOther.bulletChat"></i>
                    <i class="iconfont-v3 saasdanmuguan_icon" v-if="!formOther.bulletChat"></i>
                  </div>
                </div> -->
                <div class="right-box fr">
                  <div class="speed-box" v-if="formOther.doubleSpeed">
                    <span @click="choseSpeed">{{ speedText}}</span>
                  </div>
                  <div class="barrage-box">
                    <i class="iconfont-v3 saasdanmukai_icon" v-if="formOther.bulletChat"></i>
                    <!-- <i class="iconfont-v3 saasdanmuguan_icon" v-if="!formOther.bulletChat"></i> -->
                  </div>
                  <div class="volume-box">
                    <span class="icon-box">
                      <i style="color: #ececec" class="iconfont-v3" @click="jingYin"  :class="voice > 0 ? 'saasicon_yangshengqion' : 'saasicon_yangshengqioff'" ></i>
                    </span>
                    <div class="ver-slider">
                      <el-slider vertical height="100px"  @change="setVoice" :min='0'  v-model="voice"></el-slider>
                    </div>
                  </div>
                  <i v-if="isFullscreen" class="iconfont-v3 saasicon_quxiaoquanping" @click="exitFullscreen"></i>
                  <i v-else class="iconfont-v3 saasicon_quanping" @click="enterFullscreen"></i>
                </div>
              </div>
            </div>
            <div class="transtant" v-show="isShowSpeed">
              <transition>
                <div class="speed_list">
                  <p v-for="(item, index) in speedList" :key="index" @click="choseOtherSpeed(item)" :class="speed == item.value ? 'active' : ''">{{ item.label }}</p>
                </div>
              </transition>
            </div>
          </div>
          <!-- <div id="videoDom" v-show="showVideo"></div> -->
          <p class="show-purple-info">
            <span>提示</span>
            <span>1. 移动端全屏播放时，跑马灯会失效</span>
            <span>2. 安卓手机浏览器劫持可能导致跑马灯失效</span>
          </p>
        </div>
    </div>
    <begin-play :webinarId="$route.params.str" v-if="webinarState!=4"></begin-play>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import upload from '@/components/Upload/main';
import ColorSet from '@/components/ColorSelect';
import { sessionOrLocal, debounce } from '@/utils/utils';
import beginPlay from '@/components/beginBtn';
import { secondToDateZH } from '@/utils/general';
import controle from './js/control';
export default {
  name: 'playerSet',
  mixins: [controle],
  data() {
    const intervalValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('间隔时间不能为空'));
      } else {
        if(value < 1) {
          callback(new Error('间隔时间需大于0'));
        } else {
          callback();
        }

      }
    };
    this.$Vhallplayer = null;
    return {
      webinarState: JSON.parse(sessionOrLocal.get("webinarState")),
      activeName: 'first',
      isShowSpeed: false,
      sliderVal: 0, // seek
      hoverLeft: 10,
      hoveVideo:false,
      statePaly: true, // 播放状态
      currentTime: 0,
      voice: 20, // 音量
      isFullscreen: false, // 全屏
      loading: true,
      TimesShow: false,
      showVideo: false,
      hoverTime: 10, // seek显示时间
      totalTime: 0,
      scrolling_open: false,
      watermark_open: false,
      isSpeed: false,
      speed: 1,
      speedText: '倍速',
      speedList: [
        {
          label: '0.5x',
          value: 0.5
        },
        {
          label: '1.0x',
          value: 1
        },
        {
          label: '1.25x',
          value: 1.25
        },
        {
          label: '1.5x',
          value: 1.5
        },
        {
          label: '2.0x',
          value: 2
        }
      ],
      pageThemeColors: ['FFFFFF','1A1A1A','FB3A32', 'FFB201', '16C973', '3562FA', 'DC12D2'],
      formHorse: {
        color: '#FFFFFF', // 六位
        text_type: 2,
        size: 20,
        speed: 6000,
        text: '版权所有，盗版必究',
        position: 1,
        alpha: 100,
        scroll_type: 1,
        interval: 20
      },
      accountIds:10000127,
      fontList: [],
      formWatermark: {
        img_position: 2,
        img_url: '',
        img_alpha: 100
      },
      domain_url: '',
      formOther: {
        progress: true,
        bulletChat: false,
        doubleSpeed: false,
      },
      prizeForm: {
        name: '',
        imageUrl: '',
      },
      videoParam: {
        paas_record_id: '922013fa'
      },
      marqueeOption: {
        enable: Boolean(this.scrolling_open),
        text: '版权所有，盗版必究',
        alpha: 100,    // 透明度  100 完全显示   0 隐藏
        size: 20,      // 文字大小
        color: '#FFFFFF',   //  文字颜色
        interval: 20, // 下次跑马灯开始与本次结束的时间间隔 ， 秒为单位
        speed: 6000, // 跑马灯移动速度  3000快     6000中   10000慢
        displayType: 0,
        position: 1
      },
      rules: {
        interval: [{ required: true, validator: intervalValidate, trigger: 'blur' }]
      },
      vm: null,
      checkEnter: true, // 检验是否是第一次进来的
      audioImg: require('@/common/images/logo4.png'),
    };
  },
  components: {
    PageTitle,
    upload,
    ColorSet,
    beginPlay
  },
  // watch: {
  //   'formHorse.scroll_type'() {
  //     if (this.formHorse.scroll_type == 2) {
  //       this.formHorse.interval = 1
  //     } else {
  //       this.formHorse.interval = 20
  //     }
  //   }
  // },
  computed: {
    horseLampText(){
      if(this.scrolling_open){
        return '已开启，文字以跑马灯的形式出现在播放器画面中';
      }else{
        return "开启后，文字以跑马灯的形式出现在播放器画面中";
      }
    },
    waterMarkText(){
      if(this.watermark_open){
        return '已开启，可在播放器中增加图片、水印';
      }else{
        return "开启后，可在播放器中增加图片、水印";
      }
    },
    progressText(){
      if(this.formOther.progress){
        return '已开启，观看回放时播放器画面显示进度条';
      }else{
        return "开启后，观看回放时播放器画面显示进度条";
      }
    },
    bulletChatText(){
      if(this.formOther.bulletChat){
        return '已开启，观看页播放器画面显示弹幕功能';
      }else{
        return "开启后，观看页播放器画面显示弹幕功能";
      }
    },
    doubleSpeedText(){
      if(this.formOther.doubleSpeed){
        return '已开启，观看回放时播放器画面显示倍速功能';
      }else{
        return "开启后，观看回放时播放器画面显示倍速功能";
      }
    }
  },
  filters: {
    secondToDate (val) {
      return secondToDateZH(val);
    },
  },
  created() {
    this.getFontList();
    this.getBasescrollingList();
    this.getBaseOtherList();
    // 获取其他信息
    this.getBaseOtherList();
  },
  mounted () {
    this.initPlayer();
  },
  beforeDestroy() {
    if(this.$Vhallplayer){
      this.$Vhallplayer.destroy();
      vp.destroy();
    }
  },
  methods: {
    blurChange() {
      if (!this.formHorse.interval || this.formHorse.interval < 0) {
        this.formHorse.interval = 20;
      }
    },
    choseSpeed() {
      this.isShowSpeed = true;
    },
    choseOtherSpeed(item) {
      this.isShowSpeed = false;
      this.speedText = item.label;
      this.speed = item.value;
      this.$Vhallplayer.setPlaySpeed(this.speed)
    },
    // 预览视频
    previewVideo () {
      this.initNodePlay()
      // 设置水印的透明度

    },
    // 页面样式色值
    pageStyleHandle(color) {
      this.formHorse.color = color;
      this.editHorseInfo();
      console.log(color, '??????????????????')
    },
    getFontList() {
      let num = 10;
      while (num <= 36) {
        this.fontList.push({value: num });
        num = num + 2;
      }
    },
    // 关闭跑马灯
    closeHorseInfo() {
      if (!this.scrolling_open) {
        this.preFormHorse();
      }
      this.editHorseInfo();
    },
    // 编辑跑马灯
    editHorseInfo() {
      this.getMarqueeOptionInfo();
      this.$Vhallplayer.editMarquee(this.marqueeOption);
    },
    // 关闭水印
    openWaterMarkInfo() {
      if (!this.watermark_open) {
        this.preWatermark();
      }
    },
    // 关闭或保存其他信息
    otherOtherInfo(value) {
      this.preOthersOptions();
      // 1--弹幕  2--进度条  3--倍速
      // switch (value) {
      //   case 1 :
      //     if (this.formOther.bulletChat) {
      //       let content = "弹幕已开启";
      //       var opt = {
      //             position: 0,     // 位置   int  0上    1中  2下  3全屏
      //             alpha: 1,      // 透明度 int  0~1
      //             fontsize: 15,    // 字体大小 int
      //             color: "#000000"  // 颜色   string
      //           }
      //       vp.setBarrageInfo(opt ,failure=>{
      //         console.log('failure',failure);
      //       } )
      //       vp.openBarrage()
      //       setTimeout (()=>{
      //         vp.addBarrage(content , failure=>{
      //           console.log('failure',failure);
      //         })
      //       },2000)

      //     } else {
      //       vp.closeBarrage()
      //     }
      //     break;
      //   case 2 :
      //     // eslint-disable-next-line no-case-declarations
      //     let progressContainer =  document.querySelector('.vhallPlayer-progress-container')
      //      this.formOther.progress ? progressContainer.style.display = 'block' : progressContainer.style.display = 'none'
      //     break;
      //   case 3 :
      //     // eslint-disable-next-line no-case-declarations
      //     let list = this.$Vhallplayer.getUsableSpeed()
      //     console.log(list, '?????????')
      //     if (this.formOther.doubleSpeed) {
      //       this.$Vhallplayer.setPlaySpeed(list[0])

      //        document.querySelector('.vhallPlayer-speed-component').style.display = "block"
      //     }else {
      //       document.querySelector('.vhallPlayer-speed-component').style.display = "none"
      //     }
      //     break;
      // }
      // this.initNodePlay()
    },
    getMarqueeOptionInfo() {
      let userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
      if (!this.formHorse.text) {
        this.formHorse.text = '版权所有，盗版必究'
      }
      this.marqueeOption = {
        enable: Boolean(this.scrolling_open), // 默认 false
        text: this.formHorse.text_type == 2 ? `${this.formHorse.text}${userInfo.user_id}${userInfo.nick_name}` : this.formHorse.text,    // 跑马灯的文字
        alpha: this.formHorse.alpha,    // 透明度  100 完全显示   0 隐藏
        size:this.formHorse.size,      // 文字大小
        color: this.formHorse.color || '#FFFFFF',   //  文字颜色
        interval: this.formHorse.scroll_type == 2 ? 1 : this.formHorse.interval || 20, // 下次跑马灯开始与本次结束的时间间隔 ， 秒为单位
        speed: this.formHorse.speed || 6000, // 跑马灯移动速度  3000快     6000中   10000慢
        displayType: this.formHorse.scroll_type == 1 ? 0 : 1,
        position:this.formHorse.position || 1
      }
    },
    // 获取跑马灯基本信息
    getBasescrollingList() {
      this.$fetch('getScrolling', {webinar_id: this.$route.params.str}).then(res => {
        if (res.code == 200 && res.data.webinar_id) {
          this.formHorse = {...res.data};
          // if (res.data.scroll_type == 2) {
          //   this.formHorse.interval = 1
          // }
          this.$nextTick(() => {
            this.$refs.pageThemeColors.initColor(res.data.color);
          })
          this.scrolling_open = Boolean(res.data.scrolling_open);
        }
      })
    },
     // 获取水印基本信息
    getBaseWaterList() {
       this.$fetch('getWatermark', {webinar_id: this.$route.params.str}).then(res => {
        if (res.code == 200 && res.data.webinar_id) {
          this.formWatermark = {...res.data};
          this.formWatermark.img_alpha = Number(res.data.img_alpha);
          this.domain_url = res.data.img_url;
          this.watermark_open = Boolean(res.data.watermark_open);
        }
      })
    },
    // 获取其他基本信息
    getBaseOtherList() {
       this.$fetch('getOtherOptions', {webinar_id: this.$route.params.str}).then(res => {
        if (res.code == 200) {
          this.formOther.bulletChat = Boolean(res.data.barrage_button);
          this.formOther.progress = Boolean(res.data.progress_bar);
          this.formOther.doubleSpeed = Boolean(res.data.speed);
          // let progressContainers =  document.querySelector('.vhallPlayer-progress-container')
          // this.formOther.progress ? progressContainers.style.display = 'block' : progressContainers.style.display = 'none'
          // this.$nextTick(()=>{
          //   if (this.formOther.doubleSpeed) {
          //     // this.$Vhallplayer.setPlaySpeed(list[0])
          //       document.querySelector('.vhallPlayer-speed-component').style.display = "block"
          //     }else {
          //       document.querySelector('.vhallPlayer-speed-component').style.display = "none"
          //     }
          // })
        }
      }).catch(res => {
        this.$message({
          message: res.msg || `获取信息失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      })
    },
    // 保存跑马灯
    preFormHorse() {
      // 校验间隔时间的输入
      if(this.formHorse.interval > 300){
        this.$message({
          message: `间隔时间只能输入1-300之间的数字`,
          showClose: true,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false
      }
      this.formHorse.webinar_id = this.$route.params.str
      this.formHorse.interval = this.formHorse.interval || 10;
      this.formHorse.text = this.formHorse.text || '版权所有，盗版必究';
      this.formHorse.scrolling_open = Number(this.scrolling_open);
      this.$fetch('setScrolling',this.$params(this.formHorse)).then(res => {
        this.$message({
          message: this.scrolling_open ? "跑马灯开启成功" : '跑马灯关闭成功',
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
      }).catch(res => {
        this.$message({
          message:res.msg || "保存跑马灯失败",
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    // 保存水印
    preWatermark() {
      if (!this.domain_url && this.watermark_open) {
        this.$message({
          message: `水印图片不能为空`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return;
      }
      this.formWatermark.webinar_id = this.$route.params.str;
      this.formWatermark.img_url = this.$parseURL(this.domain_url).path;
      this.formWatermark.watermark_open = Number(this.watermark_open);
      this.$fetch('setWatermark', this.$params(this.formWatermark)).then(res => {
        this.$message({
          message: this.watermark_open ? "水印开启成功" : "水印关闭成功",
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.getBaseWaterList();
      }).catch(res => {
        this.$message({
          message: res.msg || "保存水印灯失败",
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    // 保存播放器其他设置
    preOthersOptions () {
      let params = {
        barrage_button: Number(this.formOther.bulletChat),
        progress_bar: Number(this.formOther.progress),
        speed: Number(this.formOther.doubleSpeed),
        webinar_id: this.$route.params.str
      }
      console.log('params',params);
       this.$fetch('setOtherOption', {...params}).then((res) => {
          if (res.code == 200) {
            if (this.vm) {
              this.vm.close();
            }
            if (!this.checkEnter) this.messageInfo();
            let backSettingData = res.data;
            this.$nextTick(()=>{
              console.log('弹幕',this.$Vhallplayer,vp);
              Number(backSettingData['barrage_button']) ? vp.openBarrage() : vp.closeBarrage()

           })

           this.checkEnter = false
          }
        }).catch((res) => {
          this.$message({
            message: res.msg || "设置失败",
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        })
    },
    //文案提示问题
    messageInfo() {
      this.vm = this.$message({
        showClose: false,
        duration: 2000,
        message: '设置成功',
        type: 'success'
      });
    },
    // 初始化播放器
    initPlayer() {
      this.showVideo = true;
      this.initSDK().then(() => {
        this.initSlider();
          this.totalTime = this.$Vhallplayer.getDuration(() => {
            console.log('获取总时间失败');
          });
          this.listen();
        // 初试完播放器获取其它设置
        this.getBaseOtherList()

      });
    },
    // 删除图片
    deleteImg() {
      this.formWatermark.img_url  ='';
      this.domain_url = '';
    },
    fromalAlign (val) {
      let text;
      switch (parseInt(val)) {
        case 1:
          text = 'tl';
          break;
        case 2:
          text = 'tr';
          break;
        case 4:
          text = 'bl';
          break;
        case 3:
          text = 'br';
          break;
      }
      return text;
    },
    initSDK() {
      // 判断水印的位置
      // let postion = 'tl';
      // let watermarkOptionPosition = ['10%','10%']
      // switch (this.formWatermark.img_position) {
      //   case 2:
      //     watermarkOptionPosition = ['75%','5%']
      //     break;
      //   case 1:
      //     watermarkOptionPosition = ['5%','5%']
      //     break;
      //   case 4:
      //     watermarkOptionPosition = ['75%','70%']
      //     break;
      //   case 3:
      //     watermarkOptionPosition = ['5%','70%']
      //     break;
      // }
      const incomingData = {
        appId: 'd317f559', // 应用ID，必填
        accountId: this.accountIds, // 第三方用户ID，必填
        token: 'access:d317f559:b3acfa862ae09232', // access_token，必填
        type: 'vod', // live 直播  vod 点播  必填
        videoNode: 'videoDom', // 播放器的容器， div的id 必填
        poster: '', // 封面地址  仅支持.jpg
        vodOption: { recordId: '922013fa', forceMSE: false },
        marqueeOption: this.marqueeOption,
        watermarkOption: { // 选填
          enable: Boolean(this.watermark_open), // 默认 false
          url: this.domain_url || this.audioImg, // 水印图片的路径
          align: this.fromalAlign(this.formWatermark.img_position), // 图片的对其方式， tl | tr | bl | br 分别对应：左上，右上，左下，右下
          position: ['20px', '20px'], // 对应的横纵位置，支持px,vh,vw,%
          size: ['60px', '20px'], // 水印大小，支持px,vh,vw,%  默认 80 35
          alpha:this.formWatermark.img_alpha
        },
        subtitleOption: {
          enable: true
        }

      };
      return new Promise((resolve) => {
        console.log('======实例化播放器参数======', incomingData);
        window.VhallPlayer.createInstance(
          incomingData,
          (event) => {
            // setTimeout(()=>{
               console.log('初始化实例成功',event);
            // },2000)

            this.$Vhallplayer = event.vhallplayer;
            window.vp = this.$Vhallplayer;
            // this.$Vhallplayer.pause()
            this.$Vhallplayer.openControls(false);

            if (this.formOther.doubleSpeed) {
              this.$Vhallplayer.setPlaySpeed(this.speed)
              // this.speedList = this.$Vhallplayer.getUsableSpeed() || [];
              // this.speedList.map((item, index) => {
              //   if (item == 1) {
              //     this.speed = this.speedList[index];
              //   }
              // })
            }
            this.$Vhallplayer.on(window.VhallPlayer.LOADED, () => {
              this.loading = false;
              // 加载中
              resolve();
            });

            // document.querySelector('.vhallPlayer-container').classList.remove("hide");
            // document.querySelector('.vhallPlayer-container').style.display = 'block';
            // document.querySelector('.vhallPlayer-container').classList.remove('hide')
            // console.log(document.querySelector('.vhallPlayer-container').classList, '?????????????')
          },
          (e) => {
            console.log('播放器创建实例失败', e, e.message);
            this.loading = false;
            throw new Error(e.message);
          }
        );
      });
    },
    // 初始化播放器节点，重新加载播放器
   initNodePlay() {
     if (this.$Vhallplayer) {
        this.$Vhallplayer.destroy();
        this.$nextTick(() => {
          document.querySelector('#videoDom').innerHTML = ''
          this.initPlayer()
        })

     }
    // if(document.querySelector('#videoDom')){
    //     await vp.destroy();
    //     document.querySelector('#videoDom').innerHTML = ''
    //     await this.initPlayer()
    //   }
    },
    destroy() {
      vp.destroy();
    },
    uploadAdvSuccess(res, file) {
      console.log(res, file);
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.formWatermark.img_url = file_url;
        this.domain_url = domain_url;
      }
    },
    initSlider () {
      this.$Vhallplayer.on(window.VhallPlayer.TIMEUPDATE, () => {
        this.currentTime = this.$Vhallplayer.getCurrentTime(() => {});
        this.sliderVal = (this.currentTime / this.totalTime) * 100;
      });
      // 拖拽显示时间
      const dom = this.$refs.controllerRef.$el;
      const but = document.querySelector('div.el-slider__button-wrapper');
      const innitDom = () => {
        dom.onmouseover = e => {
          console.log('dom over', e);
          this.TimesShow = true;
          const totalWidth = dom.offsetWidth;
          this.ContorlWidth = dom.offsetWidth;
          const lef = e.layerX;
          this.hoverTime = (lef / totalWidth) * this.totalTime;
          this.hoverLeft = lef;
          dom.onmousemove = event => {
            const lef = event.layerX;
            this.hoverTime = (lef / totalWidth) * this.totalTime;
            this.hoverLeft = lef;
          };
        };
        dom.onmouseout = () => {
          this.TimesShow = false;
        };
      };
      innitDom();
      but.onmousedown = () => {
        dom.onmouseout = dom.onmousemove = dom.onmousemove = dom.onmouseover = null;
        this.ContorlWidth = dom.offsetWidth;
        this.onmousedownControl = true;
        this.pause();
        document.onmousemove = () => {
          this.TimesShow = true;
        };
        document.onmouseup = () => {
          document.onmousemove = null;
          this.onmousedownControl = false;
          this.TimesShow = false;
          innitDom();
        };
      };
      but.onmouseover = e => {
        this.TimesShow = false;
        e.stopPropagation();
      };
    },
    beforeUploadHnadler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message({
          message: `水印图片只能是 ${typeList.join('、')} 格式`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: `水印图片大小不能超过 2M`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message({
        message: `水印图片上传失败`,
        showClose: true,
        // duration: 0,
        type: 'error',
        customClass: 'zdy-info-box'
      });
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    handleFileChange(file) {
      console.log(file);
    },
    handleClick(tab) {
      this.activeName = tab.name;
      // if (tab.name === 'first') {
      //   this.getBasescrollingList();
      // } else if(tab.name === 'second') {
      //   this.getBaseWaterList();
      // } else {
      //   this.checkEnter = true
      //   this.getBaseOtherList();
      //   this.otherOtherInfo(1)
      // }
    },
  },
};
</script>

<style lang="less" scoped>
#videoDom {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: black;
  /deep/.vhallPlayer-container{
    display: none!important;
  }
  // /deep/.vhallPlayer-container{
  //   display: block !important;
  // }
  // /deep/.vhallPlayer-config-btn {
  //   display: none;
  // }
  // /deep/ .vhallPlayer-definition-component,/deep/.vhallPlayer-volume-component {
  //   display: none;
  // }
  // /deep/.vhallPlayer-speed-component span.vhallPlayer-speedBtn:hover{
  //   background: #FB3A32 !important;
  // }
  // /deep/.vhallPlayer-speed-component .speed-popup {
  //   ul.speed-list-box li:hover, ul.speed-list-box li.active{
  //     color: #FB3A32 !important;
  //   }
  // }

}
.prize-card {
  height: 100%;
 .player-set{
   background: #fff;
   position: relative;
   border-radius: 4px;
 }
  /deep/.el-tabs__active-bar {
    border-radius: 2px;
  }
  /deep/.el-form-item__label {
    color: #1a1a1a;
    padding: 0 12px 0 0;
  }
  /deep/.el-switch__label.is-active{
    color: #1A1A1A;
  }
  /deep/.el-radio__input.is-checked+.el-radio__label{
    color: #1A1A1A;
  }
  .el-form-item__content{
    position: relative;
  }
  /deep/.el-switch__label--right {
    span {
       white-space: nowrap;
       color: #999;
    }
  }
  /deep/.el-tabs__content{
    width: 50%;
  }
  /deep/#vh-video {
    border-radius: 5px;
  }
  /deep/.el-input__inner{
    padding: 0 12px;
  }
  /deep/.el-radio__input {
    width: 16px;
    height: 16px;
    /deep/.el-radio__inner {
      width: 16px;
      height: 16px;
    }
    /deep/.el-radio__inner::after {
      width: 8px;
      height: 8px;
    }
  }
  /deep/.el-radio {
    margin-right: 20px;
  }
  .textType{
    width: 360px;
    // text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    // display: -webkit-box;
    // word-break: break-all;
    white-space: nowrap;
  }
  .common-save {
    width: 160px;
    height: 40px;
    line-height: 15px;
  }
  .isNum{
    position: absolute;
    top: -2px;
    right: 0px;
    color: #FB3A32;
  }
  .give-item {
    padding: 40px 24px;
    display: flex;
    position: relative;
    /deep/.el-form {
      position: relative;
      i{
        font-style: normal;
      }
    }
    .give-prize {
      width: 460px;
      // margin-right: 30px;
      /deep/.el-button {
        border-radius: 20px;
        margin-top: 16px;
      }
    }
    .give-show {
      width: 600px;
      height: 500px;
      flex: 1;
      border: 1px solid #ccc;
    }
    .give-white{
      position: absolute;
      width: 100%;
      height: 100%;
      top:80px;
      left:0;
      background: rgba(255, 255, 255, 0.5);
      z-index: 9;
    }
  }
  .show-purple{
    width: 400px;
    height: 226px;
    margin-top: 100px;
    margin-left: 20px;
    border-radius: 5px;
    position: absolute;
    top: 20px;
    left: 53%;
    img{
      width: 400px;
      height: 226px;
    }
    .video-wrap{
      width: 400px;
      height: 226px;
      border: 1px solid #ccc;
    }
    &-info {
      width: 300px;
      margin-top: 15px;
      span {
        display: block;
        color: #999;
        line-height: 20px;
        font-size: 14px;
      }
    }
  }
  .video-wrap{
    position: relative;
    .waterMark{
      position: absolute;
      width: 80px;
      height: 30px;
      &.position_1{
        top: 10px;
        left: 8px;
      }
      &.position_2{
        top: 10px;
        right: 8px;
      }
      &.position_3{
        bottom: 40px;
        right: 8px;
      }
      &.position_4{
        bottom: 40px;
        left: 8px;
      }
      img{
        width: 100%;
        height: 100%;
        object-fit: scale-down;
      }
    }
    .vod-controller{
      position: absolute;
      z-index: 50;
      width: 100%;
      height: 32px;
      bottom: 0;
      background: rgba(0,0,0,0.7);
      transition: all 0.8s;
      color: white;
      .local-icon{
        display: inline-block;
        width: 38px;
        text-align: center;
        color: white;
      }
      .iconfont-v3{
        font-size: 12px;
      }
      .slider::v-deep{
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
        .Times {
          position: absolute;
          top: -35px;
          min-width: 60px;
          text-align: center;
          padding: 5px;
          background: rgba(0, 0, 0, 0.3);
          font-size: 12px;
          color: #fff;
          transform: translateX(-50%);
        }
        &:hover{
          .el-slider__runway{
            height: 3px;
          }
          .el-slider__bar{
            height: 3px;
          }
        }
        .el-slider__button-wrapper{
          top: -16px;
        }
        .el-slider{
          .el-slider__runway{
            margin: 0;
            height: 3px;
            .el-slider__bar{
              height: 3px;
            }
            .el-slider__button{
              border: 5px solid #FB3A32;
              background: transparent;
              vertical-align: middle;
              width: 0;
              height: 0;
            }
          }
        }
      }
      .wrap{
        width: 100%;
        .left-box{
          i:first-child{
            padding: 0 8px;
            cursor: pointer;
          }
          .local-icon{
            margin: 0 4px;
          }
          .center-box{
            display: inline-block;
            line-height: 35px;
            font-size: 12px;
          }
        }
        // .center-wrap{
        //   float: left;
        //   line-height: 32px;
        //   .speed-box{
        //     display: inline-block;
        //     span{
        //       font-size: 12px;
        //     }
        //   }
        //   .barrage-box{
        //     float: right;
        //     i{
        //       font-size: 22px;
        //       vertical-align: middle;
        //     }
        //     .saasdanmu_kai{
        //       color:#FB3A32;
        //     }
        //   }
        // }
        .right-box{
          // i:last-child{
          //   padding: 0 12px;
          //   cursor: pointer;
          // }
          i{
            padding: 0 8px;
          }
          .speed-box{
            display: inline-block;
            span{
              font-size: 12px;
              padding: 0 8px;
              cursor: pointer;
            }
          }
          .barrage-box{
            display: inline-block;
            i{
              font-size: 22px;
              vertical-align: middle;
            }
          }
          .volume-box{
            display: inline-block;
            line-height: 32px;
            position: relative;
            height: 32px;
            &:hover{
              .ver-slider{
                display: block;
              }
            }
            .icon-box{
              i{
                cursor: pointer;
              }
            }
            .ver-slider{
              display: none;
              position: absolute;
              left: 0;
              bottom: 30px;
            }
          }
        }
      }
    }
    .active{
      bottom: 0px;
    }
    .speed_list{
      position: absolute;
      bottom: 30px;
      right: 0;
      width: 80px;
      background: #1A1A1A;
      opacity: 0.85;
      border-radius: 4px;
      p{
        height: 30px;
        text-align: center;
        line-height: 30px;
        color: #fff;
        opacity: 1;
        font-size: 12px;
        cursor: pointer;
        &:hover{
          color: #FB3A32;
        }
        &.active{
          color: #FB3A32;
        }
      }
    }
    .transtant .move-enter-active, .transtant .move-leave-active {
      transition: all 0.5s linear;
      transform: translate3d(0, 0, 0);
    }
    .transtant .move-enter, .transtant .move-leave {
      transform: translate3d(100%, 0, 0);
    }
  }
  .preview-video {
    position: absolute;
    top: -41px;
    left: 0;
  }
}
</style>

