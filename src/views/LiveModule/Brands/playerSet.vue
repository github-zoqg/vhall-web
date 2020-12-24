<template>
  <div class="prize-card">
    <pageTitle title="播放器设置"></pageTitle>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="防录屏跑马灯" name="first">
              <div class="give-item">
                <div class="give-prize">
                  <el-form :model="formHorse" ref="ruleForm" label-width="100px">
                    <el-form-item label="跑马灯">
                      <el-switch
                        v-model="scrolling_open"
                        active-color="#ff4949"
                        inactive-color="#ccc"
                        :active-text="horseLampText"
                      >
                      </el-switch>
                    </el-form-item>
                    <el-form-item label="类型">
                      <el-radio v-model="formHorse.text_type" label='1' :disabled="!scrolling_open">固定文本</el-radio>
                      <el-radio v-model="formHorse.text_type" label='2' :disabled="!scrolling_open">固定文本+观看者ID和昵称</el-radio>
                    </el-form-item>
                    <el-form-item label="固定文本">
                      <el-input
                        v-model="formHorse.text"
                        placeholder="版权所有，盗版必究"
                        :disabled="!scrolling_open"
                        maxlength="20"
                        show-word-limit
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="透明度"><el-slider v-model="formHorse.alpha" :disabled="!scrolling_open" style="width:350px"></el-slider><span class="isNum">{{formHorse.alpha}}%</span></el-form-item>
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
                      <el-radio v-model="formHorse.speed" label="10000" :disabled="!scrolling_open">慢</el-radio>
                      <el-radio v-model="formHorse.speed" label="6000" :disabled="!scrolling_open">中</el-radio>
                      <el-radio v-model="formHorse.speed" label="3000" :disabled="!scrolling_open">快</el-radio>
                    </el-form-item>
                    <el-form-item label="显示位置">
                      <el-radio v-model="formHorse.position" label="2" :disabled="!scrolling_open">上</el-radio>
                      <el-radio v-model="formHorse.position" label="3" :disabled="!scrolling_open">中</el-radio>
                      <el-radio v-model="formHorse.position" label="4" :disabled="!scrolling_open">下</el-radio>
                    </el-form-item>
                    <el-form-item label="间隔时间">
                      <el-input
                        v-model="formHorse.interval"
                        :disabled="!scrolling_open"
                        placeholder="1~300">
                        <i slot="suffix">秒</i>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="preFormHorse">保存</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="水印设置" name="second">
              <div class="give-item">
                <div class="give-prize">
                  <el-form :model="formWatermark" ref="ruleForm" label-width="100px">
                    <el-form-item label="水印">
                      <el-switch
                        v-model="watermark_open"
                        active-color="#ff4949"
                        inactive-color="#ccc"
                        :active-text="waterMarkText"
                      >
                      </el-switch>
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
                      >
                        <p slot="tip">
                          推荐尺寸：240*240px，小于2MB <br />
                          支持jpg、gif、png、bmp
                        </p>
                      </upload>
                    </el-form-item>
                    <el-form-item label="水印位置">
                      <el-radio v-model="formWatermark.img_position" label="1" :disabled="!watermark_open">左上角</el-radio>
                      <el-radio v-model="formWatermark.img_position" label="2" :disabled="!watermark_open">右上角</el-radio>
                      <el-radio v-model="formWatermark.img_position" label="3" :disabled="!watermark_open">左下角</el-radio>
                      <el-radio v-model="formWatermark.img_position" label="4" :disabled="!watermark_open">右下角</el-radio>
                    </el-form-item>
                    <el-form-item label="透明度">
                      <el-slider v-model="formWatermark.img_alpha" style="width: 350px" :disabled="!watermark_open"></el-slider>
                      <span class="isNum">{{formWatermark.img_alpha}}%</span>
                    </el-form-item>
                    <el-form-item>
                      <el-button type="primary" @click="preWatermark">保存</el-button>
                    </el-form-item>
                  </el-form>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="其他" name="third">
            <div class="give-item">
              <div class="give-prize">
                  <el-form :model="formOther" ref="ruleForm" label-width="100px">
                <el-form-item label="弹幕按钮">
                  <el-switch
                        v-model="formOther.bulletChat"
                        active-color="#ff4949"
                        inactive-color="#ccc"
                        :active-text="bulletChatText"
                      >
                      </el-switch>
                </el-form-item>
                <el-form-item label="进度条">
                  <el-switch
                        v-model="formOther.progress"
                        active-color="#ff4949"
                        inactive-color="#ccc"
                        :active-text="progressText"
                      >
                      </el-switch>
                </el-form-item>
                <el-form-item label="倍速">
                  <el-switch
                        v-model="formOther.doubleSpeed"
                        active-color="#ff4949"
                        inactive-color="#ccc"
                        :active-text="doubleSpeedText"
                      >
                      </el-switch>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" @click="preOthersOptions">保存</el-button>
                </el-form-item>
              </el-form>
              </div>
            </div>
            </el-tab-pane>
          </el-tabs>
       </el-col>
        <el-col :span="6">
          <div class="show-purple">
            <img :src="audioEnd" alt="" v-show="!showVideo">
            <div id="videoDom" v-show="showVideo"></div>
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
        text_type: '2',
        size: 20,
        speed: '6000',
        position: '3',
        alpha: 50,
        interval: 0
      },
      fontList: [],
      formWatermark: {
        img_position: '1',
        img_url: '',
        img_alpha: 80
      },
      domain_url: '',
      formOther: {
        progress: true,
        bulletChat: true,
        doubleSpeed: true,
      },
      prizeForm: {
        name: '',
        imageUrl: '',
      },
      videoParam: {
        paas_record_id: '922013fa'
      },
      audioImg: require('@/common/images/v35-webinar.png'),
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
        return '已开启，回放/点播播放器画面进度条显示';
      }else{
        return "开启后，回放/点播播放器画面进度条不显示";
      }
    },
    bulletChatText(){
      if(this.formOther.bulletChat){
        return '已开启，观看端播放器画面弹幕功能显示';
      }else{
        return "开启后，观看端播放器画面弹幕功能不显示";
      }
    },
    doubleSpeedText(){
      if(this.formOther.doubleSpeed){
        return '已开启，回放/点播播放器画面倍速功能显示';
      }else{
        return "开启后，回放/点播播放器画面倍速功能不显示";
      }
    }
  },
  created() {
    this.getFontList();
    this.getBasescrollingList();
  },
  methods: {
    getFontList() {
      let num = 10;
      while (num <= 36) {
        this.fontList.push({value: num });
        num = num + 2;
      }
    },
    // 获取跑马灯基本信息
    getBasescrollingList() {
      this.$fetch('getScrolling', {webinar_id: this.$route.params.str}).then(res => {
        if (res.code == 200 && res.data.webinar_id) {
          this.formHorse = {...res.data};
          this.formHorse.text_type = String(res.data.text_type);
          this.formHorse.position = String(res.data.position);
          this.formHorse.speed = String(res.data.speed);
          this.formHorse.alpha = Number(res.data.alpha);
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
          this.formOther.progress = Boolean(res.data.progress_bar);
          this.formOther.doubleSpeed = Boolean(res.data.speed);
        } else {
          this.$message.success('获取信息失败');
        }
      })
    },
    // 保存跑马灯
    preFormHorse() {
      this.formHorse.webinar_id = this.$route.params.str
      this.formHorse.interval = this.formHorse.interval || 20;
      this.formHorse.text = this.formHorse.text || '版权所有，盗版必究';
      this.formHorse.scrolling_open = Number(this.scrolling_open);
      this.$fetch('setScrolling',this.$params(this.formHorse)).then(res => {
         if (res.code == 200) {
           this.$message.success("保存跑马灯成功");
          //  this.initPlayer();
         } else {
           this.$message.error("保存跑马灯失败");
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
          //  this.initPlayer();
          this.getBaseWaterList();
          this.$message.success("保存水印成功");
         } else {
          this.$message.error("保存水印灯失败");
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
      this.$fetch('setOtherOption', {...params}).then(res => {
        if (res.code == 200) {
          this.$message.success('设置成功');
        } else {
          this.$message.success('设置失败');
        }
      })
    },
    // 初始化播放器
    initPlayer() {
      this.showVideo = true;
      this.initSDK().then(() => {
        // this.initSlider();
        this.totalTime = this.$Vhallplayer.getDuration(() => {
          console.log('获取总时间失败');
        });
        // this.listen();
      });
    },
    initSDK() {
      const incomingData = {
        appId: 'd317f559', // 应用ID，必填
        accountId: '10000127', // 第三方用户ID，必填
        token: 'access:d317f559:b3acfa862ae09232', // access_token，必填
        type: 'vod', // live 直播  vod 点播  必填
        videoNode: 'videoDom', // 播放器的容器， div的id 必填
        poster: '', // 封面地址  仅支持.jpg
        vodOption: { recordId: '922013fa', forceMSE: false },
        marqueeOption:{ // 选填
          enable: Boolean(this.scrolling_open), // 默认 false
          text: this.formHorse.text_type,    // 跑马灯的文字
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
          position: this.formWatermark.img_position, // 对应的横纵位置，支持px,vh,vw,%
          size: ['80px', '35px'], // 水印大小，支持px,vh,vw,%
        },
      };
      return new Promise((resolve) => {
        console.log('======实例化播放器参数======', incomingData);
        window.VhallPlayer.createInstance(
          incomingData,
          (event) => {
            this.$Vhallplayer = event.vhallplayer;
            window.vp = this.$Vhallplayer;
            this.$Vhallplayer.openControls(false);
            this.$Vhallplayer.on(window.VhallPlayer.LOADED, () => {
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
    destroy() {
      this.$Vhallplayer.destroy();
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
.prize-card {
  height: 100%;
  /deep/.el-card__body {
    padding: 0;
  }
  /deep/.el-form-item__label {
    color: #1a1a1a;
    padding: 0 20px 0 0;
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
  .isNum{
    position: absolute;
    top: -2px;
    right: 0;
  }
  .give-item {
    padding: 40px 24px;
    display: flex;
    /deep/.el-form {
      position: relative;
      i{
        font-style: normal;
      }
    }
    .give-prize {
      width: 500px;
      margin-right: 120px;
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
  }
  .show-purple{
    width: 400px;
    height: 270px;
    border: 1px solid #ccc;
    margin-top: 100px;
    margin-left: 20px;
    img{
      width: 400px;
      height: 270px;
    }
  }
}
</style>

