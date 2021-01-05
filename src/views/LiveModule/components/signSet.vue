<template>
  <div class="sign--set">
    <div class="sign--set--main">
      <div class="sign--set--left">
        <el-form :model="signSetForm" ref="signSetForm" :rules="signSetFormRules" label-width="94px">
          <el-form-item label="主办方信息" prop="organizers_status">
            <div class="switch__box">
              <el-switch
                v-model="signSetForm.organizers_status"
                :active-value=1
                :inactive-value=0
                active-color="#FB3A32"
                inactive-color="#CECECE"
                :active-text="signSetForm.organizers_status ? '已开启，观看页显示主办方信息、个人主页按钮和关注按钮' : '开启后，观看页显示主办方信息、个人主页按钮和关注按钮'"
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
                :active-text="signSetForm.reserved_status ? '已开启，观看页显示底部版权信息' : '开启后，观看页显示底部版权信息'"
              >
              </el-switch>
            </div>
          </el-form-item>
          <el-form-item label="观看端标志" prop="view_status">
            <div class="switch__box">
              <el-switch
                v-model="signSetForm.view_status"
                :active-value=1
                :inactive-value=0
                active-color="#FB3A32"
                inactive-color="#CECECE"
                :active-text="signSetForm.view_status ? '已开启，观看页显示品牌标志' : '开启后，观看页显示品牌标志'"
              >
              </el-switch>
            </div>
          </el-form-item>
          <el-form-item label="标志替换" prop="logo_url">
            <upload
              class="upload__sign"
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
                <p>建议尺寸：240*78px，小于2M</p>
                <p>支持jpg、gif、png、bmp</p>
              </div>
            </upload>
          </el-form-item>
          <el-form-item label="标志链接" prop="skip_url" class="item--skip__url">
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
        organizers_status: null,
        reserved_status: null,
        view_status: null,
        logo_url: null,
        skip_url: null
      },
      domain_url: '',
      signSetFormRules: {
        logo_url: [
          { required: false, message: '请选择标志', trigger: 'change'}
        ],
        skip_url: [
          { required: false, message: '请填写标志链接', trigger: 'blur'},
          // { pattern: /((http|https):\/\/)?[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入正确的标志链接' , trigger: 'blur'}
          { pattern: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入正确的标志链接' , trigger: 'blur'}
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
      try {
        this.$refs.brandSetPreviewComp.signSetVoInfo(this.signSetForm, this.domain_url);
      } catch (e) {
        console.log(e);
      }
    },
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message({
          message: `标志图片只能是 ${typeList.join('、')} 格式!`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: `标志图片大小不能超过 2MB!`,
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
        message:  `标志图片上传失败`,
        showClose: true,
        // duration: 0,
        type: 'error',
        customClass: 'zdy-info-box'
      });
    },
    resetLogoUrl() {
      this.$nextTick(()=> {
        this.signSetForm.logo_url = '';
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
          if (res.data) {
            this.signSetForm = res.data;
          } else {
            this.signSetForm = {
              organizers_status: null,
              reserved_status: null,
              view_status: null,
              logo_url: null,
              skip_url: null
            };
          }
          this.domain_url = res.data.logo_url || '';
          try {
            this.$refs.brandSetPreviewComp.signSetVoInfo(this.signSetForm, this.domain_url);
          } catch (e) {
            console.log(e);
          }
        } else {
          this.signSetForm = {
            organizers_status: null,
            reserved_status: null,
            view_status: null,
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
          this.$fetch('setInterWebinarTag', this.$params(params)).then(res => {
            console.log(res);
            this.$message({
              message:  `保存基本设置成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            // 重新获取数据
            this.getSignInfo();
          }).catch(res=>{
            console.log(res);
            this.$message({
              message: res.msg || `保存基本设置失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
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
  font-family: @fontRegular;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  margin-top: 12px;
}
/* 标志上传 */
.upload__sign {
  /deep/.el-upload--picture-card {
    width: 400px;
    height: 130px;
  }
  /deep/.box > div {
    width: 400px;
    height: 130px;
  }
}
.item--skip__url {
  /deep/.el-input {
    width: 400px;
    border-radius: 4px;
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
