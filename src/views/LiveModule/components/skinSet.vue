<template>
  <div class="skin--set">
    <div class="sign--set--main">
      <div class="skin--set--left">
        <el-form :model="skinSetForm" ref="signSetForm" :rules="skinSetFormRules" label-width="94px">
          <el-form-item label="页面设置">
            <color-set :themeKeys=pageBgColors></color-set>
          </el-form-item>
          <el-form-item label="页面风格">
            <color-set :themeKeys=pageThemeColors :openSelect=true></color-set>
          </el-form-item>
          <el-form-item label="背景图" prop="logo">
            <upload
              :class="'upload__skin heightMore'"
              v-model="skinSetForm.logo"
              :on-success="handleUploadSuccess"
              :on-progress="uploadProcess"
              :on-error="uploadError"
              :on-preview="uploadPreview"
              :before-upload="beforeUploadHandler">
              <div slot="tip">
                <p>最佳尺寸：240*78px</p>
                <p>支持jpg、gif、png、bmp</p>
              </div>
            </upload>
            <p>开启时支持更换品牌标志</p>
          </el-form-item>
        </el-form>
      </div>
      <!-- 预览区域 -->
      <brand-set-preview ref="brandSetPreviewComp" class="brand--preview"></brand-set-preview>
    </div>
    <div class="btnGroup">
      <el-button type="primary" round @click.prevent.stop="skinSetSave">保 存</el-button>
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
      pageBgColors: ['FFFFFF', 'F2F2F2', '1A1A1A'],
      pageThemeColors: ['FB3A32', 'FFB201', '16C973', '3562FA', 'DC12D2'],
      skinSetForm: {
        logo: null,
      },
      skinSetFormRules: {
        logo: [
          {require: true, message: '请先选择图片', trigger: 'change'}
        ]
      }
    }
  },
  methods: {
    handleUploadSuccess(res, file){
      console.log(res, file);
      this.skinSetForm.logo = URL.createObjectURL(file.raw);
    },
    beforeUploadHandler(file){
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
    initComp() {},
    skinSetSave() {
      this.$refs.signSetForm.validate((valid) => {
        if(valid) {
          this.$fetch('userEdit', this.signSetForm).then(res => {
            console.log(res);
            if (res && res.code === 200) {
              this.$message.success('保存基本设置成功');
            } else {
              this.$message.error(res.msg || '保存基本设置失败');
            }
          }).catch(err=>{
            console.log(err);
            this.$message.error('保存基本设置失败');
          });
        }
      });
    }
  }
}
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
.brand--preview {
  width: calc(50% - 48px);
  padding-left: 48px;
}
/deep/.el-form-item__label {
  padding: 0 10px 0 0;
  line-height: 20px;
}
/deep/.el-form-item {
  margin-bottom: 32px;
}
/* 背景上传 */
.upload__skin {
  /deep/.el-upload--picture-card {
    width: 280px;
    height: 130px;
    border: 1px solid #CCCCCC;
    img {
      width: 100%;
      height: auto;
    }
  }
  /deep/.box > div {
    width: 280px;
    height: 130px;
  }
  &.withMore {
    /deep/.el-upload--picture-card {
      img {
        width: 100%;
        height: auto;
      }
    }
  }
  &.heightMore {
    /deep/.el-upload--picture-card {
      img {
        width: auto;
        height: 100%;
      }
    }
  }
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

