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
                    v-model="formHorse.isOn"
                    active-color="#ff4949"
                    inactive-color="#ccc"
                    :active-text="horseLampText"
                  >
                  </el-switch>
                </el-form-item>
                <el-form-item label="类型">
                  <el-radio v-model="formHorse.type" label="1" :disabled="!formHorse.isOn">固定文本</el-radio>
                  <el-radio v-model="formHorse.type" label="2" :disabled="!formHorse.isOn">固定文本+观看者ID和昵称</el-radio>
                </el-form-item>
                <el-form-item label="固定文本">
                  <el-input
                    v-model="formHorse.text"
                    placeholder="版权所有，盗版必究"
                    :disabled="!formHorse.isOn"
                    maxlength="20"
                    show-word-limit
                  ></el-input>
                </el-form-item>
                <el-form-item label="透明度"><el-slider v-model="formHorse.transparency" :disabled="!formHorse.isOn" style="width:350px"></el-slider><span class="isNum">{{formHorse.transparency}}%</span></el-form-item>
                <el-form-item label="字体大小">
                  <el-select v-model="formHorse.fontSize" placeholder="请选择" :disabled="!formHorse.isOn">
                    <el-option
                      v-for="item in fontList"
                      :key="item.value"
                      :label="item.value"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="移动速度">
                  <el-radio v-model="formHorse.speed" label="1" :disabled="!formHorse.isOn">慢</el-radio>
                  <el-radio v-model="formHorse.speed" label="2" :disabled="!formHorse.isOn">中</el-radio>
                  <el-radio v-model="formHorse.speed" label="3" :disabled="!formHorse.isOn">快</el-radio>
                </el-form-item>
                <el-form-item label="显示位置">
                  <el-radio v-model="formHorse.position" label="1" :disabled="!formHorse.isOn">上</el-radio>
                  <el-radio v-model="formHorse.position" label="2" :disabled="!formHorse.isOn">中</el-radio>
                  <el-radio v-model="formHorse.position" label="3" :disabled="!formHorse.isOn">下</el-radio>
                </el-form-item>
                <el-form-item label="间隔时间">
                   <el-input
                    v-model="formHorse.intervalTime"
                    :disabled="!formHorse.isOn"
                    placeholder="1~300">
                    <i slot="suffix">秒</i>
                    </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :disabled="!formHorse.isOn">保存</el-button>
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
                    v-model="formWatermark.isOn"
                    active-color="#ff4949"
                    inactive-color="#ccc"
                    :active-text="waterMarkText"
                  >
                  </el-switch>
                </el-form-item>
                <el-form-item label="水印图片">
                  <upload
                    class="giftUpload"
                    v-model="formWatermark.imageUrl"
                    :on-success="handleuploadSuccess"
                    :on-progress="uploadProcess"
                    :on-error="uploadError"
                    :on-preview="uploadPreview"
                    :before-upload="beforeUploadHnadler"
                    :disabled="!formWatermark.isOn"
                  >
                    <p slot="tip">
                      推荐尺寸：240*240px，小于2MB <br />
                      支持jpg、gif、png、bmp
                    </p>
                  </upload>
                </el-form-item>
                <el-form-item label="水印位置">
                  <el-radio v-model="formWatermark.position" label="1" :disabled="!formWatermark.isOn">左上角</el-radio>
                  <el-radio v-model="formWatermark.position" label="2" :disabled="!formWatermark.isOn">右上角</el-radio>
                  <el-radio v-model="formWatermark.position" label="3" :disabled="!formWatermark.isOn">左下角</el-radio>
                  <el-radio v-model="formWatermark.position" label="4" :disabled="!formWatermark.isOn">右下角</el-radio>
                </el-form-item>
                <el-form-item label="透明度">
                  <el-slider v-model="formWatermark.transparency" style="width: 350px" :disabled="!formWatermark.isOn"></el-slider>
                  <span class="isNum">{{formWatermark.transparency}}%</span>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :disabled="!formWatermark.isOn">保存</el-button>
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
              <el-button type="primary">保存</el-button>
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
export default {
  name: 'prizeSet',
  data() {
    return {
      activeName: 'first',
      formHorse: {
        isOn: true,
        type: '2',
        fontSize: 20,
        speed: '2',
        position: '2',
        transparency: 50
      },
      fontList: [],
      formWatermark: {
        isOn: true,
        position: '1',
        transparency: 80
      },
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
      if(this.formHorse.isOn){
        return '已开启，文字以跑马灯的形式出现在播放器画面中';
      }else{
        return "开启后，文字将以跑马灯的形式出现在播放器画面中";
      }
    },
    waterMarkText(){
      if(this.formWatermark.isOn){
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
    handleClick(tab) {
      this.activeName = tab.name;
    },
    changeType(items) {
      this.prizeImg = items.url;
      this.typeList.map((item) => {
        item.isChecked = false;
        items.isChecked = true;
      });
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

