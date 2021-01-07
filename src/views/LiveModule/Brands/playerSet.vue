<template>
  <div class="prize-card">
    <pageTitle title="播放器设置"></pageTitle>
    <el-card style="min-height:741px;">
      <el-row :gutter="20">
        <el-col :span="13">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="防录屏跑马灯" name="first">
              <div class="give-item">
                <div class="give-prize">
                  <el-form :model="formHorse" ref="ruleForm" label-width="100px">
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
                    <el-form-item label="类型">
                      <el-radio v-model="formHorse.text_type" :label='1' :disabled="!scrolling_open">固定文本</el-radio>
                      <el-radio v-model="formHorse.text_type" :label='2' :disabled="!scrolling_open">固定文本+观看者ID和昵称</el-radio>
                    </el-form-item>
                    <el-form-item label="固定文本">
                      <VhallInput
                        v-model="formHorse.text"
                        class="textType"
                        placeholder="版权所有，盗版必究"
                        :disabled="!scrolling_open"
                        autocomplete="off"
                        :maxlength="20"
                        show-word-limit
                      ></VhallInput>
                    </el-form-item>
                    <el-form-item label="透明度"><el-slider v-model="formHorse.alpha" :disabled="!scrolling_open" style="width:323px"></el-slider><span class="isNum">{{formHorse.alpha}}%</span></el-form-item>
                    <el-form-item label="字体大小">
                      <el-select v-model="formHorse.size" placeholder="请选择" :disabled="!scrolling_open">
                        <el-option
                          v-for="item in fontList"
                          :key="item.value"
                          :label="item.value"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item label="移动速度">
                      <el-radio v-model="formHorse.speed" :label="10000" :disabled="!scrolling_open">慢</el-radio>
                      <el-radio v-model="formHorse.speed" :label="6000" :disabled="!scrolling_open">中</el-radio>
                      <el-radio v-model="formHorse.speed" :label="3000" :disabled="!scrolling_open">快</el-radio>
                    </el-form-item>
                    <el-form-item label="显示位置">
                      <el-radio v-model="formHorse.position" :label="1" :disabled="!scrolling_open">随机</el-radio>
                      <el-radio v-model="formHorse.position" :label="2" :disabled="!scrolling_open">上</el-radio>
                      <el-radio v-model="formHorse.position" :label="3" :disabled="!scrolling_open">中</el-radio>
                      <el-radio v-model="formHorse.position" :label="4" :disabled="!scrolling_open">下</el-radio>
                    </el-form-item>
                    <el-form-item label="间隔时间">
                      <el-input
                        v-model="formHorse.interval"
                        :disabled="!scrolling_open"
                        maxlength="300"
                        placeholder="默认10s，输入范围1-300s">
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
                          <p>建议尺寸：98*28px，小于2M</p>
                          <p>支持jpg、gif、png、bmp</p>
                        </div>
                      </upload>
                    </el-form-item>
                    <el-form-item label="水印位置">
                      <el-radio v-model="formWatermark.img_position" :label="1" :disabled="!watermark_open">左上角</el-radio>
                      <el-radio v-model="formWatermark.img_position" :label="2" :disabled="!watermark_open">右上角</el-radio>
                      <el-radio v-model="formWatermark.img_position" :label="3" :disabled="!watermark_open">左下角</el-radio>
                      <el-radio v-model="formWatermark.img_position" :label="4" :disabled="!watermark_open">右下角</el-radio>
                    </el-form-item>
                    <el-form-item label="透明度">
                      <el-slider v-model="formWatermark.img_alpha" style="width: 320px" :disabled="!watermark_open"></el-slider>
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
            <el-tab-pane label="其他" name="third">
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
       </el-col>
        <el-col :span="6">
          <div class="show-purple">
            <el-button type="white-primary" size="small" round class="preview-video" @click="previewVideo">预览</el-button>
            <img :src="audioEnd" alt="" v-show="!showVideo">
            <div id="videoDom" v-show="showVideo"></div>
            <p class="show-purple-info">
              <span>提示</span>
              <span>1、移动端全屏播放时，跑马灯会失效</span>
              <span>2、安卓手机浏览器劫持可能导致跑马灯失效</span>
            </p>
            <!-- <video-preview ref="videoPreview" :videoParam='videoParam'></video-preview> -->
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import upload from '@/components/Upload/main';
import Env from "@/api/env";
import VideoPreview from '@/views/MaterialModule/VideoPreview/index.vue';
import { sessionOrLocal } from '@/utils/utils';
export default {
  name: 'prizeSet',
  data() {
    return {
      activeName: 'first',
      showVideo: false,
      totalTime: 0,
      scrolling_open: false,
      watermark_open: false,
      formHorse: {
        color: '#FFFFFF', // 六位
        text_type: 2,
        size: 20,
        speed: 6000,
        text: '版权所有，盗版必究',
        position: 1,
        alpha: 50,
        interval: 10
      },
      accountIds:10000127,
      fontList: [],
      formWatermark: {
        img_position: 1,
        img_url: '',
        img_alpha: 80
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
      audioImg: require('@/common/images/logo4.png'),
      audioEnd: '//t-alistatic01.e.vhall.com/upload/webinars/img_url/fb/40/fb40e62abba02933ada7d97495f81ef1.jpg',
    };
  },
  components: {
    PageTitle,
    upload,
    // VideoPreview
  },
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
  created() {
    this.getFontList();
    this.getBasescrollingList();
  },
  mounted () {
    this.initPlayer();
  },
  methods: {
    // 预览视频
    previewVideo () {
      this.initNodePlay()
      // 设置水印的透明度

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
      switch (value) {
        case 1 :
          if (this.formOther.bulletChat) {
            let content = "弹幕已开启";
            var opt = {
                  position: 0,     // 位置   int  0上    1中  2下  3全屏
                  alpha: 1,      // 透明度 int  0~1
                  fontsize: 15,    // 字体大小 int
                  color: "#000000"  // 颜色   string
                }
            vp.setBarrageInfo(opt ,failure=>{
              console.log('failure',failure);
            } )
            vp.openBarrage()
            setTimeout (()=>{
              vp.addBarrage(content , failure=>{
                console.log('failure',failure);
              })
            },2000)

          } else {
            vp.closeBarrage()
          }
          break;
        case 2 :
           this.formOther.progress ?  this.$Vhallplayer.openControls(true) : this.$Vhallplayer.openControls(false)
          break;
        case 3 :
          let list = this.$Vhallplayer.getUsableSpeed()
          if (this.formOther.doubleSpeed) {
            // this.$Vhallplayer.openControls(false)
            this.$Vhallplayer.setPlaySpeed(list[0])
            // this.$Vhallplayer.openControls(true)
            // document.querySelector('.vhallPlayer-container').style.display = 'block'
            // document.querySelector('.vhallPlayer-container').classList.remove('hide')
             document.querySelector('.vhallPlayer-speed-component').style.display = "block"
          }else {
            // this.$Vhallplayer.openControls(true)
            document.querySelector('.vhallPlayer-speed-component').style.display = "none"
          }
          break;
      }
      // this.initNodePlay()
    },
    // 获取跑马灯基本信息
    getBasescrollingList() {
      this.$fetch('getScrolling', {webinar_id: this.$route.params.str}).then(res => {
        if (res.code == 200 && res.data.webinar_id) {
          this.formHorse = {...res.data};
          this.scrolling_open = Boolean(res.data.scrolling_open);
        } else {
          // this.$message.error('获取信息失败');
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
        } else {
          // this.$message.error('获取信息失败');
        }
      })
    },
    // 获取其他基本信息
     getBaseOtherList() {
       this.$fetch('getOtherOptions', {webinar_id: this.$route.params.str}).then(res => {
        if (res.code == 200) {
          this.formOther.bulletChat = Boolean(res.data.barrage_button);
          this.otherOtherInfo(1)
          this.formOther.progress = Boolean(res.data.progress_bar);
          // this.otherOtherInfo(2)
          this.formOther.doubleSpeed = Boolean(res.data.speed);
          // this.otherOtherInfo(3)
        } else {
          this.$message.success('获取信息失败');
        }
      })
    },
    // 保存跑马灯
    preFormHorse() {
      // 校验间隔时间的输入
      let reg = /^[0-9]*$/
      if(!reg.test(this.formHorse.interval) || this.formHorse.interval == 0){
        this.$message.error('间隔时间只能输入1-300之间的数字')
        return false
      }
      this.formHorse.webinar_id = this.$route.params.str
      this.formHorse.interval = this.formHorse.interval || 10;
      this.formHorse.text = this.formHorse.text || '版权所有，盗版必究';
      this.formHorse.scrolling_open = Number(this.scrolling_open);
      this.$fetch('setScrolling',this.$params(this.formHorse)).then(res => {
         if (res.code == 200) {
           this.$message.success(this.scrolling_open ? "跑马灯开启成功" : '跑马灯关闭成功');

         } else {
           this.$message.error(res.msg || "保存跑马灯失败");
         }
      });
    },
    // 保存水印
    preWatermark() {
      if (!this.domain_url && this.watermark_open) {
        this.$message.error('水印图片不能为空');
        return;
      }
      this.formWatermark.webinar_id = this.$route.params.str;
      this.formWatermark.img_url = this.$parseURL(this.domain_url).path;
      this.formWatermark.watermark_open = Number(this.watermark_open);
      this.$fetch('setWatermark', this.$params(this.formWatermark)).then(res => {
         if (res.code == 200) {
          this.getBaseWaterList();
          this.$message.success(this.watermark_open ? "水印开启成功" : "水印关闭成功");
         } else {
          this.$message.error(res.msg || "保存水印灯失败");
         }
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
      this.$fetch('setOtherOption', {...params}).then(res => {
        if (res.code == 200) {
          this.$message.success('设置成功');
          let backSettingData = res.data
          this.$nextTick(()=>{
            console.log('弹幕',this.$Vhallplayer,vp);
            Number(backSettingData['barrage_button']) ? vp.openBarrage() : vp.closeBarrage()
            // Number(backSettingData['progress_bar']) ? vp.setControls(true) : vp.setControls(false)
            // this.changeController(backSettingData)
            // Number(backSettingData['speed']) ? document.querySelector('.vhallPlayer-speed-component').style.display = 'block' : document.querySelector('.vhallPlayer-speed-component').style.display = 'none'
          })
        } else {
          this.$message.success(res.msg || '设置失败');
        }
      })
    },
    // 开启和隐藏控制台-- 由于sdk文档上这个开关控制条的方法=>openControls不能用，用获取dom去控制
    // changeController (data) {
    //   if( Number(data['progress_bar'])) {
    //     document.querySelector('.vhallPlayer-container').style.visibility = 'visible'
    //     document.querySelector('.vhallPlayer-container').style.opacity = 1
    //   }else {
    //     document.querySelector('.vhallPlayer-container').style.visibility = 'hidden'
    //     document.querySelector('.vhallPlayer-container').style.opacity = 0
    //     document.querySelector('.vhallPlayer-container').style.display= 'none'
    //   }
    // },
    // 初始化播放器
    initPlayer() {
      this.showVideo = true;
      this.initSDK().then(() => {
        // this.initSlider();
        // this.totalTime = this.$Vhallplayer.getDuration(() => {
        //   console.log('获取总时间失败');
        // });
        // this.listen();

      });
    },
    // 删除图片
    deleteImg() {
      this.formWatermark.img_url  ='';
      this.domain_url = '';
    },
    initSDK() {
      let userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
      // 判断水印的位置
      let watermarkOptionPosition = ['10%','10%']
      switch (this.formWatermark.img_position) {
        case 1:
          watermarkOptionPosition = ['75%','5%']
          break;
        case 2:
          watermarkOptionPosition = ['5%','5%']
          break;
        case 3:
          watermarkOptionPosition = ['75%','70%']
          break;
        case 4:
          watermarkOptionPosition = ['5%','70%']
          break;
      }
      const incomingData = {
        appId: 'd317f559', // 应用ID，必填
        accountId: this.accountIds, // 第三方用户ID，必填
        token: 'access:d317f559:b3acfa862ae09232', // access_token，必填
        type: 'vod', // live 直播  vod 点播  必填
        videoNode: 'videoDom', // 播放器的容器， div的id 必填
        poster: '', // 封面地址  仅支持.jpg
        vodOption: { recordId: '922013fa', forceMSE: false },
        marqueeOption:{ // 选填
          enable: Boolean(this.scrolling_open), // 默认 false
          text: this.formHorse.text_type == 2 ? `${this.formHorse.text}${userInfo.user_id}${userInfo.nick_name}` : this.formHorse.text,    // 跑马灯的文字
          alpha: this.formHorse.alpha,    // 透明度  100 完全显示   0 隐藏
          size:this.formHorse.size,      // 文字大小
          color:"#ff8d41",   //  文字颜色
          interval: this.formHorse.interval, // 下次跑马灯开始与本次结束的时间间隔 ， 秒为单位
          speed: this.formHorse.speed, // 跑马灯移动速度  3000快     6000中   10000慢
          position:this.formHorse.position   // 跑马灯位置 ， 1 随机 2上  3中 4下
        },
        watermarkOption: { // 选填
          enable: Boolean(this.watermark_open), // 默认 false
          url: this.domain_url || this.audioImg, // 水印图片的路径
          align: 'tr', // 图片的对其方式， tl | tr | bl | br 分别对应：左上，右上，左下，右下
          position: watermarkOptionPosition, // 对应的横纵位置，支持px,vh,vw,%
          size: ['80px', '35px'], // 水印大小，支持px,vh,vw,%
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

            this.$Vhallplayer.on(window.VhallPlayer.LOADED, () => {
              this.$Vhallplayer.pause()
              this.$Vhallplayer.openControls(true);
              this.loading = false;
              // 加载中
              resolve();
            });
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
   async initNodePlay() {
    if(document.querySelector('#videoDom')){
        await vp.destroy();
        document.querySelector('#videoDom').innerHTML = ''
        await this.initPlayer()
      }
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
    beforeUploadHnadler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`水印图片只能是 ${typeList.join('、')} 格式!`);
        return false;
      }
      if (!isLt2M) {
        this.$message.error('水印图片大小不能超过 2MB!');
        return false;
      }
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`水印图片上传失败`);
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    handleFileChange(file) {
      console.log(file);
    },
    handleClick(tab) {
      this.activeName = tab.name;
      if (tab.name === 'first') {
        this.getBasescrollingList();
      } else if(tab.name === 'second') {
        this.getBaseWaterList();
      } else {
        this.getBaseOtherList();
      }
    },
  },
};
</script>

<style lang="less" scoped>
#videoDom {
  width: 100%;
  height: 100%;
  overflow: hidden;
  /deep/.vhallPlayer-config-btn {
    display: none;
  };
  /deep/ .vhallPlayer-definition-component,/deep/.vhallPlayer-volume-component {
    display: none;
  }
}
.prize-card {
  height: 100%;
  /deep/.el-card__body {
    padding: 0;
  }
  /deep/.el-card {
    box-shadow: none;
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
  /deep/#vh-video {
    border-radius: 5px;
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
    right: 0;
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
        padding: 12px 61px;
        border-radius: 20px;
        margin-top: 25px;
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
    border: 1px solid #ccc;
    margin-top: 100px;
    margin-left: 20px;
    border-radius: 5px;
    position: relative;
    img{
      width: 400px;
      height: 226px;
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
  .preview-video {
    position: absolute;
    top: -41px;
    left: 0;
  }
}
</style>

