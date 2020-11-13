<template>
  <div class="sign--set">
    <div class="sign--set--main">
      <div class="sign--set--left">
        <el-form :model="signSetForm" ref="signSetForm" :rules="signSetFormRules" label-width="94px">
          <el-form-item label="主办方信息">
            <div class="switch__box">
              <el-switch
                v-model="signSetForm.switchMoe"
                active-color="#FB3A32"
                inactive-color="#CECECE"
                :active-text="signSetForm.switchMoe ? '关闭后，观看端主办方信息，个人主页入口和关注按钮将被隐藏' : '已关闭，观看端主办方信息，个人主页入口和关注按钮已被隐藏'"
              >
              </el-switch>
            </div>
          </el-form-item>
          <el-form-item label="版权信息">
            <div class="switch__box">
              <el-switch
                v-model="signSetForm.switchAoe"
                active-color="#FB3A32"
                inactive-color="#CECECE"
                :active-text="signSetForm.switchAoe ? '关闭后，观看端的底部版权信息降被隐藏' : '已关闭，观看端的底部版权信息已被隐藏'"
              >
              </el-switch>
            </div>
          </el-form-item>
          <el-form-item label="观看端标志">
            <div class="switch__box">
              <el-switch
                v-model="signSetForm.switchClient"
                active-color="#FB3A32"
                inactive-color="#CECECE"
                :active-text="signSetForm.switchClient ? '关闭后，观看端的标志将被隐藏' : '已关闭，观看端的标志已被隐藏'"
              >
              </el-switch>
            </div>
          </el-form-item>
          <el-form-item label="标志替换：" prop="avatar">
            <upload
              :class="'upload__sign heightMore'"
              v-model="signSetForm.avatar"
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
      <el-button type="primary" round @click.prevent.stop="signSetSave">保 存</el-button>
    </div>
  </div>
</template>

<script>
import Upload from '@/components/Upload/main';
import BrandSetPreview from '../../LiveModule/components/brandSetPreview';
export default {
  name: "signSet.vue",
  components: {
    Upload,
    BrandSetPreview
  },
  data() {
    return {
      signSetForm: {
        switchMoe: null,
        switchAoe: null,
        switchClient: null,
        avatar: '',
      },
      signSetFormRules: {
      }
    }
  },
  methods: {
    handleUploadSuccess(res, file){
      console.log(res, file);
      this.imageUrl = URL.createObjectURL(file.raw);
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
    initComp() {
    },
    // 保存
    signSetSave() {
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
};
</script>

<style lang="less" scoped>
.sign--set {
  .padding41-40();
}
.sign--set--main {
  .flex-display();
  .justify(space-between);
  .align(flex-start);
}
.sign--set--left {
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
/* 标志上传 */
.upload__sign {
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
