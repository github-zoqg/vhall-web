<template>
  <div class="skin--set">
    <div class="sign--set--main">
      <div class="skin--set--left">
        <el-form :model="skinSetForm" ref="skinSetForm" :rules="skinSetFormRules" label-width="94px">
          <el-form-item label="皮肤方案">
            <el-radio-group v-model="skinType">
              <el-radio :label="0">默认皮肤</el-radio>
              <el-radio :label="1">自定义皮肤</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="页面设置" v-if="skinType === 1">
            <color-set ref="pageBgColors" :themeKeys=pageBgColors @color="bgColorHandle" :colorDefault="skinSetForm.bgColor"></color-set>
          </el-form-item>
          <el-form-item label="页面风格" v-if="skinType === 1">
            <color-set ref="pageThemeColors"  :themeKeys=pageThemeColors :openSelect=true  @color="pageStyleHandle" :colorDefault="skinSetForm.pageStyle"></color-set>
          </el-form-item>
          <el-form-item label="背景图：" prop="bg_url" v-if="skinType === 1">
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
              :before-upload="beforeUploadHandler"
              @delete="resetLogoUrl">
              <div slot="tip">
                <p>建议尺寸：1920*1080px，小于2M</p>
                <p>支持jpg、gif、png、bmp</p>
              </div>
            </upload>
            <p class="p-notice">开启时支持更换品牌标志</p>
          </el-form-item>
          <el-form-item label="" v-if="skinType !== 1">
            <p>无需设置皮肤，默认皮肤效果</p>
          </el-form-item>
          <el-form-item label="" v-if="skinVo.status > 0 || skinType === 1">
            <el-button type="primary" round @click.prevent.stop="skinSetSave">保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 预览区域 -->
      <brand-set-preview ref="brandSetPreviewComp" class="brand--preview"></brand-set-preview>
    </div>
  </div>
</template>

<script>
import BrandSetPreview from '../../LiveModule/components/brandSetPreview';
import Upload from '@/components/Upload/main';
import ColorSet from '@/components/ColorSelect';

export default {
  name: "skinSet.vue",
  components: {
    Upload,
    BrandSetPreview,
    ColorSet
  },
  data() {
    return {
      skinType: null, // 0-默认皮肤；1-自定义皮肤
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
  methods: {
    bgColorHandle(color) {
      this.skinSetForm.bgColor = color;
    },
    // 页面样式色值
    pageStyleHandle(color) {
      this.skinSetForm.pageStyle = color;
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
      let showRow = Object.assign(this.skinSetForm, {
        status: this.skinVo.status,
        bg_url: this.domain_url
      })
      this.$refs.brandSetPreviewComp.skinSetVoInfo(showRow);
    },
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`背景图片只能是 ${typeList.join('、')} 格式!`);
        return false;
      }
      if (!isLt2M) {
        this.$message.error('背景图片大小不能超过 2MB!');
        return false;
      }
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`背景图片上传失败`);
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
      this.getInterWebinarSkin();
    },
    getInterWebinarSkin() {
      this.$fetch('getInterWebinarSkin', {
        webinar_id: this.$route.params.str
      }).then(res => {
        if (res && res.code === 200) {
          this.skinVo = res.data || {};
          this.showBtn = this.skinVo.status !== undefined && this.skinVo.status !== null && this.skinVo.status !== '';
          this.skinType = Number(res.data.status) > 0 ? 1 : 0;
          // 页面赋值
          let skin_json_pc = JSON.parse(res.data.skin_json_pc);
          this.skinSetForm.bgColor = skin_json_pc.bgColor;
          this.skinSetForm.pageStyle = skin_json_pc.pageStyle;
          this.skinSetForm.bg_url = skin_json_pc.background;
          this.domain_url = skin_json_pc.background;
          this.skinSetForm.skin_id = res.data.skin_id || '';
          console.log(this.skinSetForm, '页面刷新后');
          let showRow = Object.assign(this.skinSetForm, {
             status: this.skinVo.status,
             bg_url: this.domain_url
          })
          this.$refs.brandSetPreviewComp.skinSetVoInfo(showRow);
        } else {
          this.skinVo = {};
        }
      }).catch(err=>{
        console.log(err);
        this.skinVo = {};
      });
    },
    skinSetSave() {
      this.$refs.skinSetForm.validate((valid) => {
        if(valid) {
          if (this.skinType !== 1) {
            this.$fetch('setSkinWebinarSkin', {
              webinar_id: this.$route.params.str,
              status: 0
            }).then(res => {
              if (res && res.code === 200) {
                this.$message.success('默认皮肤使用设置成功');
                this.getInterWebinarSkin();
              } else {
                this.$message.error(res.msg || '默认皮肤使用设置失败');
              }
            }).catch(err=>{
              console.log(err);
              this.$message.error('保存基本设置失败');
            });
          } else {
            let params = Object.assign({
              webinar_id: this.$route.params.str,
              status: 1
            }, this.tmpl, {
              skin_id: this.skinSetForm.skin_id || ''
            });
            this.$fetch(this.skinSetForm.skin_id ? 'skinUpdate' : 'skinCreate', this.$params(params)).then(res => {
              console.log(res);
              if (res && res.code === 200) {
                this.$message.success('保存基本设置成功');
                this.getInterWebinarSkin();
              } else {
                this.$message.error(res.msg || '保存基本设置失败');
              }
            }).catch(err=>{
              console.log(err);
              this.$message.error('保存基本设置失败');
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
  .padding41-40();
}
.sign--set--main {
  .flex-display();
  .justify(space-between);
  .align(flex-start);
}
.skin--set--left{
  width: 50%;
}
/deep/.el-form-item__label {
  line-height: 40px;
}
.brand--preview {
  width: calc(50% - 48px);
  padding-left: 48px;
}
/deep/.el-form-item__label {
  padding: 0 10px 0 0;
}
/deep/.el-form-item {
  margin-bottom: 32px;
}
/* 背景上传 */
.upload__skin {
  /deep/.el-upload--picture-card {
    width: 280px;
    height: 130px;
  }
  /deep/.box > div {
    width: 280px;
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

