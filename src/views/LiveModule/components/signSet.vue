<template>
  <div class="sign--set">
    <div class="sign--set--main">
      <div class="sign--set--left">
        <el-form :model="signSetForm" ref="signSetForm" :rules="signSetFormRules" label-width="94px">
          <el-form-item label="主办方信息" prop="organizers_status">
            <div class="switch__box">
              <el-switch
                v-model="signSetForm.organizers_status"
                :active-value="1"
                :inactive-value="0"
                active-color="#FB3A32"
                inactive-color="#CECECE"
                :active-text="signSetForm.organizers_status ? '关闭后，观看端主办方信息，个人主页入口和关注按钮将被隐藏' : '已关闭，观看端主办方信息，个人主页入口和关注按钮已被隐藏'"
              >
              </el-switch>
            </div>
          </el-form-item>
          <el-form-item label="版权信息" prop="reserved_status">
            <div class="switch__box">
              <el-switch
                v-model="signSetForm.reserved_status"
                :active-value="1"
                :inactive-value="0"
                active-color="#FB3A32"
                inactive-color="#CECECE"
                :active-text="signSetForm.reserved_status ? '关闭后，观看端的底部版权信息将被隐藏' : '已关闭，观看端的底部版权信息已被隐藏'"
              >
              </el-switch>
            </div>
          </el-form-item>
          <el-form-item label="观看端标志" prop="view_status">
            <div class="switch__box">
              <el-switch
                v-model="signSetForm.view_status"
                :active-value="1"
                :inactive-value="0"
                active-color="#FB3A32"
                inactive-color="#CECECE"
                :active-text="signSetForm.view_status ? '关闭后，观看端的标志将被隐藏' : '已关闭，观看端的标志已被隐藏'"
              >
              </el-switch>
            </div>
          </el-form-item>
          <el-form-item label="标志替换：" prop="logo_url">
            <upload
              class="upload__sign heightMore"
              v-model="signSetForm.logo_url"
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
                <p>最佳尺寸：240*78px</p>
                <p>支持jpg、gif、png、bmp</p>
              </div>
            </upload>
            <p class="p-notice">开启时支持更换品牌标志</p>
          </el-form-item>
          <el-form-item label="标志链接" prop="skip_url">
            <el-input v-model.trim="signSetForm.skip_url" />
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" round @click.prevent.stop="signSetSave">保 存</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 预览区域 -->
      <brand-set-preview ref="brandSetPreviewComp" class="brand--preview"></brand-set-preview>
    </div>
  </div>
</template>

<script>
import Upload from '@/components/Upload/main';
import BrandSetPreview from '../../LiveModule/components/brandSetPreview';
import Env from "@/api/env";
export default {
  name: "signSet.vue",
  components: {
    Upload,
    BrandSetPreview
  },
  data() {
    return {
      signSetForm: {
        organizers_status: 0,
        reserved_status: 0,
        view_status: 0,
        logo_url: null,
        skip_url: null
      },
      domain_url: '',
      signSetFormRules: {
        logo_url: [
          { required: true, message: '请选择标志', trigger: 'change'}
        ],
        skip_url: [
          { required: true, message: '请填写标志链接', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    handleUploadSuccess(res, file){
      console.log(res, file);
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.signSetForm.logo_url = file_url;
        this.domain_url = domain_url;
      }
      // 触发验证
      this.$refs.signSetForm.validateField('logo_url');
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
    resetLogoUrl() {
      this.$nextTick(()=> {
        this.signSetForm.logoUrl = '';
      });
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    // 获取活动标记记录
    getSignInfo() {
      this.$fetch('getInterWebinarTag', {
        webinar_id: this.$route.params.str
      }).then(res => {
        console.log(res);
        if (res && res.code === 200) {
          if (res.data.logo_url) {
            this.signSetForm = res.data;
          } else {
            this.signSetForm = {
              organizers_status: 0,
              reserved_status: 0,
              view_status: 0,
              logo_url: null,
              skip_url: null
            };
          }
          this.domain_url = res.data.logo_url || '';
          this.$refs.brandSetPreviewComp.signSetVoInfo(this.signSetForm);
        } else {
          this.signSetForm = {
            organizers_status: 0,
            reserved_status: 0,
            view_status: 0,
            logo_url: null,
            skip_url: null
          };
        }
      }).catch(err=>{
        console.log(err);
      });
    },
    initComp() {
      this.getSignInfo();// 获取活动标志内容
    },
    // 保存
    signSetSave() {
      this.$refs.signSetForm.validate((valid) => {
        if(valid) {
          console.log(this.signSetForm, 'signSetForm');
          let params = Object.assign(this.signSetForm, {webinar_id: this.$route.params.str});
          this.$fetch('setInterWebinarTag', params).then(res => {
            console.log(res);
            if (res && res.code === 200) {
              this.$message.success('保存基本设置成功');
              // 重新获取数据
              this.getSignInfo();
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
  .padding41-40;
}
.sign--set--main {
  .flex-display;
  .justify(space-between);
  .align(flex-start);
}
.sign--set--left {
  width: 50%;
  /deep/.el-form-item__label {
    line-height: 40px;
  }
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
/deep/.el-switch__label {
  color: #999999;
}
/deep/.el-switch__label.is-active {
  color: #999999;
}
.p-notice {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  margin-top: 12px;
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
