<template>
  <div class="prize-card">
    <pageTitle title="播放器设置"></pageTitle>
    <el-card>
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
                  <el-radio v-model="formHorse.text_type" label="1" :disabled="!scrolling_open">固定文本</el-radio>
                  <el-radio v-model="formHorse.text_type" label="2" :disabled="!scrolling_open">固定文本+观看者ID和昵称</el-radio>
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
                  <el-radio v-model="formHorse.position" label="1" :disabled="!scrolling_open">上</el-radio>
                  <el-radio v-model="formHorse.position" label="2" :disabled="!scrolling_open">中</el-radio>
                  <el-radio v-model="formHorse.position" label="3" :disabled="!scrolling_open">下</el-radio>
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
                  <el-button type="primary" :disabled="!scrolling_open" @click="preFormHorse">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="give-show">

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
                <el-form-item label="水印图片">
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
                  <el-button type="primary" :disabled="!watermark_open" @click="preWatermark">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="give-show"></div>
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
           <div class="give-show"></div>
         </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import upload from '@/components/Upload/main';
import Env from "@/api/env";
export default {
  name: 'prizeSet',
  data() {
    return {
      activeName: 'first',
      scrolling_open: true,
      watermark_open: true,
      formHorse: {
        color: '#FFFFFF', // 六位
        text_type: '2',
        size: 20,
        speed: '6000',
        position: '2',
        alpha: 50
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
      prizeImg:
        'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
      prizeForm: {
        name: '',
        imageUrl: '',
      }
    };
  },
  components: {
    PageTitle,
    upload,
  },
   computed: {
    horseLampText(){
      if(this.scrolling_open){
        return '已开启，文字以跑马灯的形式出现在播放器画面中';
      }else{
        return "开启后，文字将以跑马灯的形式出现在播放器画面中";
      }
    },
    waterMarkText(){
      if(this.watermark_open){
        return '已开启，可在播放器画面中添加水印';
      }else{
        return "开启后，可在播放器画面中添加水印";
      }
    },
    progressText(){
      if(this.formOther.progress){
        return '关闭后，回放/点播播放器画面不显示进度条';
      }else{
        return "已关闭，回放/点播播放器画面不显示进度条";
      }
    },
    bulletChatText(){
      if(this.formOther.bulletChat){
        return '关闭后，观看端播放器画面不显示弹幕按钮';
      }else{
        return "已关闭，观看端播放器画面不显示弹幕按钮";
      }
    },
    doubleSpeedText(){
      if(this.formOther.doubleSpeed){
        return '关闭后，回放/点播播放器画面不显示倍速按钮';
      }else{
        return "已关闭，回放/点播播放器画面不显示倍速按钮";
      }
    }
  },
  created() {
    this.getFontList();
  },
  methods: {
    getFontList() {
      let num = 10;
      while (num <= 36) {
        this.fontList.push({value: num });
        num = num + 2;
      }
    },
    // 保存跑马灯
    preFormHorse() {
      this.formHorse.webinar_id = this.$route.params.str
      this.formHorse.interval = this.formHorse.interval || 20;
      this.formHorse.text = this.formHorse.text || '版权所有，盗版必究';
      this.formHorse.scrolling_open = this.scrolling_open ? 1 : 0;
      this.$fetch('setScrolling',this.formHorse).then(res => {
         console.log(res.data, '111111111111');
      });
    },
    // 保存水印
    preWatermark() {
      this.formWatermark.webinar_id = this.$route.params.str
      this.formWatermark.img_url = this.formWatermark.img_url || 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100';
      this.formWatermark.watermark_open = this.watermark_open ? 1 : 0;
      this.$fetch('setWatermark',this.formWatermark).then(res => {
         console.log(res.data, '22222222222222222');
      });
    },
    // 保存播放器其他设置
    preOthersOptions () {
      let params = {
        barrage_button: this.formOther.bulletChat ? 1 : 0,
        progress_bar: this.formOther.progress ? 1 : 0,
        speed: this.formOther.doubleSpeed ? 1 : 0,
        webinar_id: this.$route.params.str
      }
      this.$fetch('setOtherOption', {...params}).then(res => {
        this.$message.success('设置成功')
      })
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
      const typeList = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'];
      const isType = typeList.includes(file.type.toLowerCase());
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`上传封面图片只能是 ${typeList.join('、')} 格式!`);
      }
      if (!isLt2M) {
        this.$message.error('上传封面图片大小不能超过 2MB!');
      }
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`封面上传失败`);
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    handleFileChange(file) {
      console.log(file);
      // this.handleuploadSuccess(file);
    },
    handleClick(tab) {
      this.activeName = tab.name;
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
}
</style>

