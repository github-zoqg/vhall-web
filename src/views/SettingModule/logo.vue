<template>
  <div v-if="!auth_show">
    <null-page text="控制台标志为高级功能，开通后您可以替换为您的品牌标志。<br/>联系您的客户经理获取权限后方可使用。" nullType="noAuth">
      <el-button type="primary" round @click="openChat">联系客服</el-button>
    </null-page>
  </div>
  <!-- 有权限内容 -->
  <div v-else>
    <pageTitle title='控制台标志'></pageTitle>
    <div class="logo-ctx">
      <el-form :model="logoForm" ref="logoForm" :rules="logoFormRules" label-width="100px">
        <el-form-item label="标志替换：" prop="logo">
          <upload
            class="upload__avatar"
            v-model="logoForm.logo"
            :domain_url="domain_url"
            :saveData="{
               path: 'users/logo-imgs',
               type: 'image',
            }"
            :on-success="handleUploadSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            :before-upload="beforeUploadHandler"
            @delete="logoForm.logo = ''">
            <p slot="tip">最佳头图尺寸：156*56px <br/>小于2MB(支持jpg、gif、png、bmp)</p>
          </upload>
        </el-form-item>
        <el-form-item label="标志链接：" prop="logo_jump_url">
          <el-input type="text" placeholder="请输入标志链接" v-model="logoForm.logo_jump_url"/>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" v-preventReClick round @click="saveConsoleLogo('save')"  class="length152">保存</el-button>
          <el-button round v-preventReClick @click="saveConsoleLogo('default')">恢复默认</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import Upload from '@/components/Upload/main';
import NullPage from '../PlatformModule/Error/nullPage.vue';
import {sessionOrLocal} from "@/utils/utils";
import env from "@/api/env";
export default {
  name: "logo.vue",
  components: {
    PageTitle,
    Upload,
    NullPage
  },
  data() {
    return {
      isAuth: true,
      logoForm: {
        logo: '',
        logo_jump_url: ''
      },
      logoFormRules: {
        logo: [
          { required: true, message: '请上传图片', trigger: 'blur' },
        ],
        logo_jump_url: [
          { required: false, message: '标志链接不能为空', trigger: 'blur' },
          { pattern: /((http|https):\/\/)?[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入正确的标志链接' , trigger: 'blur'}
        ]
      },
      domain_url: '',
      auth_show: false
    };
  },
  methods: {
    getSysConfig() {
      let permissions = sessionOrLocal.get('SAAS_VS_PES', 'localStorage');
      if(permissions) {
        let perVo = JSON.parse(permissions);
        console.log(perVo, '权限-用户');
        perVo['ui.console_logo'] = 1; // TODO 默认配置项权限开启
        if (perVo['ui.console_logo'] > 0) {
          // 开启
          this.auth_show = true;
          let userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
          this.logoForm.logo = userInfo.user_extends.logo || '';
          this.domain_url = userInfo.user_extends.logo || '';
          this.logoForm.logo_jump_url = userInfo.user_extends.logo_jump_url || '';
        } else {
          this.auth_show = false;
        }
      }
    },
    openChat() {
      window.open(`${env.staticLinkVo.kf}`, '_blank');
    },
    handleUploadSuccess(res, file) {
      console.log(res, file);
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.logoForm.logo = file_url;
        this.domain_url = domain_url;
      }
      // 触发验证
      this.$refs.logoForm.validateField('logo');
    },
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`上传封面图片只能是 ${typeList.join('、')} 格式!`);
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传封面图片大小不能超过 2MB!');
        return false;
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
    saveConsoleLogo(type) {
      if(type === 'default') {
        this.saveSend({
          logo: '',
          logo_jump_url: ''
        }, type);
      } else {
        this.$refs.logoForm.validate((valid) => {
          if (valid) {
            this.saveSend({
              logo: this.$parseURL(this.logoForm.logo).path,
              logo_jump_url: this.logoForm.logo_jump_url
            }, type);
          }
        });
      }
    },
    saveSend(params, type) {
      this.$fetch('userEdit', params).then(res => {
        if(res && res.code === 200) {
          this.$message.success('保存设置成功');
          if (type === 'default') {
            this.logoForm.logo_jump_url = '';
            this.logoForm.logo = '';
            try {
              this.$ref.logoForm.resetFields();
            } catch (e) {
              console.log(e);
            }
          }
          this.getAccountInfo();
        } else {
          this.$message.error(res.msg || '保存设置失败');
        }
      }).catch(e => {
        this.$message.error('保存设置失败');
      });
    },
    getAccountInfo() {
      this.$fetch('getInfo', {
        scene_id: 2
      }).then(res =>{
        if(res.code === 200 && res.data) {
          sessionOrLocal.set('userInfo', JSON.stringify(res.data));
          sessionOrLocal.set('userId', JSON.stringify(res.data.user_id));
          this.$EventBus.$emit('saas_vs_account_change', res.data);
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  },
  created() {
    this.getSysConfig();
  }
};
</script>

<style lang="less" scoped>
  .logo-ctx {
    .layout--right--main();
    .padding48-40();
    .min-height();
    /deep/.el-form {
      width: 420px;
    }
  }
  /* 图片上传 */
  .upload__avatar {
    /deep/.el-upload--picture-card {
      width: 180px;
      height: 180px;
      border: 1px solid #CCCCCC;
    }
    /deep/.box > div {
      width: 180px;
      height: 180px;
    }
  }
  .save-btn {
    margin: 40px auto;
  }
</style>
