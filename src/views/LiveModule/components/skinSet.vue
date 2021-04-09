<template>
  <div class="skin--set">
    <div class="sign--set--main">
      <div class="skin--set--left">
        <el-form :model="skinSetForm" ref="skinSetForm" :rules="skinSetFormRules" label-width="70px">
          <el-form-item label="皮肤方案">
            <el-radio-group v-model="skinType" @change="previewShow">
              <el-radio :label="0">默认皮肤</el-radio>
              <el-radio :label="1">自定义皮肤</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="页面底色" v-if="skinType === 1">
            <color-set ref="pageBgColors" :themeKeys=pageBgColors @color="bgColorHandle" :colorDefault="skinSetForm.bgColor"></color-set>
          </el-form-item>
          <el-form-item label="页面风格" v-if="skinType === 1">
            <color-set ref="pageThemeColors"  :themeKeys=pageThemeColors :openSelect=true  @color="pageStyleHandle" :colorDefault="skinSetForm.pageStyle"></color-set>
          </el-form-item>
          <el-form-item label="背景图" prop="bg_url" v-if="skinType === 1">
            <upload
              class="upload__skin"
              v-model="skinSetForm.bg_url"
              :domain_url="domain_url"
              :saveData="{
                 path: 'interacts/skin-imgs',
                 type: 'image',
              }"
              :on-success="handleUploadSuccess"
              :on-progress="uploadProcess"
              :on-error="uploadError"
              :on-preview="uploadPreview"
              :heightImg="130"
              :widthImg="231"
              :before-upload="beforeUploadHandler"
              @delete="resetLogoUrl">
              <div slot="tip">
                <p>建议尺寸：1920*1080px，小于4M</p>
                <p>支持jpg、gif、png、bmp</p>
              </div>
            </upload>
          </el-form-item>
          <el-form-item label="" v-if="skinType !== 1">
            <p class="p-notice">无需设置皮肤，默认皮肤效果</p>
          </el-form-item>
          <el-form-item label="" v-if="skinVo.status > 0 || skinType === 1">
            <el-button type="primary" v-preventReClick round @click.prevent.stop="skinSetSave">保 存</el-button>
          </el-form-item>
        </el-form>
        <div class="hide-white" v-show="!brandConfig"></div>
      </div>
      <!-- 预览区域 -->
      <brand-set-preview ref="brandSetPreviewComp" class="brand--preview" :brandType="brandType"></brand-set-preview>
    </div>
  </div>
</template>

<script>
import BrandSetPreview from '../../LiveModule/components/brandSetPreview';
import Upload from '@/components/Upload/main';
import ColorSet from '@/components/ColorSelect';

export default {
  name: "skinSet.vue",
  props: ['brandConfig'],
  components: {
    Upload,
    BrandSetPreview,
    ColorSet
  },
  data() {
    return {
      skinType: 0, // 0-默认皮肤；1-自定义皮肤
      brandType: 1,
      skinVo: {},
      pageBgColors: ['FFFFFF', 'F2F2F2', '1A1A1A'],
      pageThemeColors: ['FB3A32', 'FFB201', '16C973', '3562FA', 'DC12D2'],
      skinSetForm: {
        bg_url: null,
        bgColor: '#FFFFFF',
        pageStyle: '#FB3A32',
        popStyle: ''
      },
      domain_url: '',
      skinSetFormRules: {
        bg_url: [
          {require: true, message: '请先选择背景图片', trigger: 'change'}
        ]
      },
    };
  },
  computed: {
    tmpl: function() {
      let skin_json_pc = {
        bgColor: this.skinSetForm.bgColor,
        pageStyle: this.skinSetForm.pageStyle,
        popStyle: '',
        background: this.skinSetForm.bg_url ? this.$parseURL(this.skinSetForm.bg_url).path : ''
      };
      // 无手机端设置的时候，如 => skin_json_wap = {"logo":"","pageStyle":""} skin_style_code_wap为空
      // 有手机端设置的时候，{"logo":"webinars/skin_img/5c/5d/5c5dce7de690e4f1d0fbf845eb13c1a9.jpg","pageStyle":"bg-red"}
      let skin_json_wap = skin_json_pc;
      return {
        skin_name: '用户自定义',
        skin_json_pc: JSON.stringify(skin_json_pc),
        skin_style_code_pc: `/*pc端样式*/`,
        skin_json_wap: JSON.stringify(skin_json_wap),
        skin_style_code_wap: `/*手机端样式*/`,
        skin_preview_code_pc: `/*pc端预览样式*/`,
        skin_preview_code_wap: `/*手机端预览样式*/`
      }
    }
  },
  watch: {
    '$parent.type'() {
      if (this.brandType) {
        this.initComp();
      }
    }
  },
  methods: {
    bgColorHandle(color) {
      this.skinSetForm.bgColor = color;
      // 右侧变化
      this.previewShow();
    },
    // 页面样式色值
    pageStyleHandle(color) {
      this.skinSetForm.pageStyle = color;
      this.previewShow();
    },
    closeColor() {
      // this.$refs.pageThemeColors.selectPanelShow = false;
    },
    previewShow() {
      let showRow = Object.assign(this.skinSetForm, {
        status: this.skinType,
        bg_url: this.domain_url || this.skinSetForm.bg_url
      })
      try {
        console.log(showRow, '皮肤变化...');
        this.$refs.brandSetPreviewComp.skinSetVoInfo(showRow);
      } catch (e) {
        console.log(e);
      }
    },
    handleUploadSuccess(res, file){
      console.log(res, file);
      console.log(res, file);
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.skinSetForm.bg_url = file_url;
        this.domain_url = domain_url;
      }
      // 触发验证
      this.$refs.skinSetForm.validateField('bg_url');
      this.previewShow();
    },
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!isType) {
        this.$message({
          message: `背景图片只能是 ${typeList.join('、')} 格式!`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: `背景图片大小不能超过 4MB!`,
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
        message:  `背景图片上传失败`,
        showClose: true,
        // duration: 0,
        type: 'error',
        customClass: 'zdy-info-box'
      });
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    resetLogoUrl() {
      this.$nextTick(()=> {
        this.skinSetForm.bg_url = '';
      });
    },
    initComp() {
      // 获取当前活动启用皮肤的信息详情
      this.brandType = this.$parent.type;
      this.getInterWebinarSkin();
    },
    getInterWebinarSkin() {
      let params = {
        type: this.$parent.type,
        webinar_id: this.$parent.type == 1 ? this.$route.params.str : ''
      }
      this.$fetch('getInterWebinarSkin', this.$params(params)).then(res => {
        this.skinVo = res.data || {};
        this.showBtn = this.skinVo.status !== undefined && this.skinVo.status !== null && this.skinVo.status !== '';
        this.skinType = Number(res.data.status) > 0 ? 1 : 0;
        // 页面赋值
        if (res.data.skin_json_pc) {
          let skin_json_pc = JSON.parse(res.data.skin_json_pc);
          this.skinSetForm.bgColor = skin_json_pc.bgColor;
          this.skinSetForm.pageStyle = skin_json_pc.pageStyle;
          this.skinSetForm.bg_url = skin_json_pc.background;
          this.domain_url = skin_json_pc.background;
          this.$refs['pageBgColors'].initColor(this.skinSetForm.bgColor)
          this.$refs['pageThemeColors'].initColor(this.skinSetForm.pageStyle)
        } else {
          this.skinSetForm.bgColor = '#FFFFFF';
          this.skinSetForm.pageStyle = '#FB3A32';
          this.skinSetForm.bg_url = '';
          this.domain_url = '';
        }
        this.skinSetForm.skin_id = res.data.skin_id || '';
        console.log(this.skinSetForm, '页面刷新后');
        this.previewShow();
      }).catch(err=>{
        console.log(err);
        this.skinVo = {};
      });
    },
    skinSetSave() {
      this.$refs.skinSetForm.validate((valid) => {
        if(valid) {
          if (this.skinType !== 1) {
            let params = {
              webinar_id: this.$route.params.str || '',
              type: this.$parent.type,
              status: 0
            }
            this.$fetch('setSkinWebinarSkin', this.$params(params)).then(res => {
              this.$message({
                message:  `默认皮肤使用设置成功`,
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box'
              });
              this.getInterWebinarSkin();
            }).catch(res=>{
              console.log(res);
              this.$message({
                message: res.msg || '默认皮肤使用设置失败',
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
            });
          } else {
            let params = Object.assign({
              webinar_id: this.$route.params.str || '',
              type: this.$parent.type,
              status: 1
            }, this.tmpl, {
              skin_id: this.skinSetForm.skin_id || ''
            });
            this.$fetch(this.skinSetForm.skin_id ? 'skinUpdate' : 'skinCreate', this.$params(params)).then(res => {
              console.log(res);
               this.$message({
                message:  `保存基本设置成功`,
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box'
              });
              this.getInterWebinarSkin();
            }).catch(res=>{
              console.log(res);
              this.$message({
                message: res.msg || '保存基本设置失败',
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
            });
          }
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.skin--set {
  /* .padding41-40(); */
   padding: 41px 40px 40px 40px;
}
.sign--set--main {
  .flex-display();
  .justify(space-between);
  .align(flex-start);
}
.skin--set--left{
  width: 480px;
  position: relative;
  .hide-white{
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    background: rgba(255, 255, 255, 0.5);
    z-index: 9;
  }
}
/deep/.el-form-item__label {
  line-height: 40px;
}
.brand--preview {
  width: calc(100% - 480px);
  padding-left: 60px;
}
/deep/.el-form-item__label {
  padding: 0 12px 0 0;
}
/deep/.el-form-item {
  margin-bottom: 32px;
}
/* 背景上传 */
.upload__skin {
  /deep/.el-upload--picture-card {
    width: 400px;
    height: 130px;
  }
  /deep/.box > div {
    width: 400px;
    height: 130px;
  }
}
.p-notice {
  font-size: 14px;
  font-family: @fontRegular;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  margin-top: 12px;
}
.btnGroup{
  text-align: center;
  margin: 40px auto;
  .el-button{
    color:#FB3A32;
    border-color:#FB3A32;
    width: 150px;
    &:hover{
      background: #ffebeb;
    }
  }
  .el-button--primary{
    background:#FB3A32;
    border-color:#FB3A32;
    color: #fff;
    &:hover{
      background: #fc615b;
    }
  }
  .el-button.is-round{
    padding: 10px 23px;
  }
}
</style>

