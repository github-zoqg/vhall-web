<template>
  <div  v-loading="fetching" element-loading-text="努力加载中">
    <PageTitle :title="pageTitle"></PageTitle>
    <div class="app--info-ctx">
      <el-form :model="appForm" ref="appForm" label-width="200px">
        <template v-for="(node, index) in nodesData">
          <p class="subject" v-if="node.subject" :key="index">{{node.label}}</p>
          <el-form-item
            v-else
            :key="index"
            :prop="node.modelKey"
            :label="`${node.label}`"
            :rules="node.validateRules || []"
          >
            <template v-if="action!='detail' && node.nodeType != 'text'">
              <el-input v-if="node.nodeType == 'input'" v-model="appForm[node.modelKey]" v-bind="node.attrs"></el-input>
              <el-radio-group v-else-if="node.nodeType == 'radio'" v-model="appForm[node.modelKey]">
                <el-radio v-for="radio in node.items" :label="radio.value" :key="radio.label">{{radio.label}}</el-radio>
              </el-radio-group>
            </template>
            <span v-else>{{appForm[node.modelKey]}}</span>
          </el-form-item>
        </template>
        <el-form-item v-if="action!='detail'">
          <el-button type="primary" @click="submitForm('appForm')" round>保存</el-button>
          <el-button @click="cancel('appForm')" round>取消</el-button>
        </el-form-item>
        <div class="right" v-if="action=='detail'">
          <img :src="env.staticLinkVo.aliQr + appForm.qr_code_string " alt="">
          <el-button type="primary" @click="modify" round>修改</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import Env from '@/api/env.js';
export default {
  components: {
    PageTitle,
  },
  data(){
    return {
      env: Env,
      appForm: {
        app_name: '',
        sign_type: 1, // 加密算法
        callback_webinar_status: '', //直播状态URL：
        callback_play_download: '', //回放下载URL：
        callback_sdk_upload: '', //JSSDK上传视频完成URL：
        signature: '', //Android 签名
        package_name: '', // Android 包名
        bundle_id: '', //ios bundle_id,
        APPKey: '',
        SecretKey: '',
        APP_SecretKey: '',
        qr_code_string: ''
      },
      nodesData: [
        {
          subject: true,
          label: '基本信息'
        },
        {
          nodeType: 'input',
          label: '应用名称',
          attrs:{
            placeholder: '请输入应用名称',
            maxlength: 7,
            "show-word-limit": true
          },
          modelKey: 'app_name',
          validateRules: [
            { required: true, message: '请输入应用名称', trigger: 'blur' },
          ]
        },
        {
          nodeType: 'text',
          label: 'APPKey',
          modelKey: 'app_key',
        },
        {
          nodeType: 'text',
          modelKey: 'secret_key',
          label: 'SecretKey（API使用）',
        },
        {
          nodeType: 'text',
          modelKey: 'app_secret_key',
          label: 'App SecretKey（SDK使用）',
        },
        {
          subject: true,
          label: 'Android-SDK 签名值 *请不要在未更新的情况下修改，否则将导致SDK服务无法使用'
        },
        {
          nodeType: 'input',
          label: '安全码SHA1',
          attrs:{
            placeholder: '请输入安全码SHA1',
          },
          modelKey: 'signature',
        },
        {
          nodeType: 'input',
          label: '包名',
          attrs:{
            placeholder: '请输入包名',
          },
          modelKey: 'package_name',
        },
        {
          subject: true,
          label: 'IOS-SDK 签名值'
        },
        {
          nodeType: 'input',
          label: '安全码Bundle ID',
          attrs:{
            placeholder: '安全码Bundle ID',
          },
          modelKey: 'bundle_id',
        },
        {
          subject: true,
          label: '加密算法'
        },
        {
          nodeType: 'radio',
          label: '',
          items: [
            {label: 'MD5', value: 1},
            {label: 'RSA', value: 2}
          ],
          modelKey: 'sign_type',
        },
        {
          subject: true,
          label: '回调设置'
        },
        {
          nodeType: 'input',
          label: '直播状态URL',
          attrs:{
            placeholder: '请输入完整URL',
          },
          modelKey: 'callback_webinar_status',
        },
        {
          nodeType: 'input',
          label: '回放下载URL',
          attrs:{
            placeholder: '请输入完整URL',
          },
          modelKey: 'callback_play_download',
        },
        {
          nodeType: 'input',
          label: 'JSSDK上传视频完成',
          attrs:{
            placeholder: '请输入完整URL',
          },
          modelKey: 'callback_sdk_upload',
        },
      ],
      fetching: false
    };
  },
  created(){
    if(this.$route.meta.action != 'add'){
      this.getAppInfo();
    }
  },
  computed:{
    action(){
      return this.$route.meta.action;
    },
    pageTitle(){
      if(this.action == 'modify'){
        return '应用修改';
      }else{
        return '应用详情';
      }
    }
  },
  methods: {
    submitForm(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addApp();
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    addApp(){
      console.log();
      let param = JSON.parse(JSON.stringify(this.appForm));
      delete param.APPKey;
      delete param.SecretKey;
      delete param.APP_SecretKey;
      this.fetching = true;
      let api = 'createApp';
      let msgText = '创建';
      if(this.action == 'modify'){
        api = 'modifyApp';
        param.id = this.$route.params.appId;
        msgText = '修改';
      }
      this.$fetch(api, param).then(res => {
        this.$message.success(`${msgText}成功`);
        setTimeout(()=>{
          this.$router.push({path: "/dev/list"});
        }, 500);
      }).catch(error=>{
        this.$message.error(`应用${msgText}失败，${error.$message}`);
      }).finally(()=>{
        this.fetching = false;
      });
    },
    getAppInfo(){
      this.fetching = true;
      this.$fetch('getAppInfo', {id: this.$route.params.appId}).then(res => {
        console.log('getAppInfo', res);
        const resVo = res.data;
        this.appForm = resVo;
        /*this.appForm.app_name = resVo.app_name;
        this.appForm.sign_type = resVo.sign_type;
        this.appForm.callback_webinar_status = resVo.callback_webinar_status;
        this.appForm.callback_play_download = resVo.callback_play_download;
        this.appForm.callback_sdk_upload = resVo.callback_sdk_upload;
        this.appForm.signature = resVo.signature;
        this.appForm.package_name = resVo.package_name;
        this.appForm.bundle_id = resVo.bundle_id;
        this.appForm.qr_code_string = resVo.qr_code_string;*/
      }).catch(error=>{
        console.log(error);
        this.$message.error(`获取应用信息失败，${error.$message}`);
      }).finally(()=>{
        this.fetching = false;
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    cancel(){
      if(this.action == 'modify'){
        this.getAppInfo();
        this.$route.meta.action= 'detail';
        this.$route.meta.title= this.pageTitle;
      }
    },
    modify(){
      this.$route.meta.action = 'modify';
      this.$route.meta.title= this.pageTitle;
    }
  }
};
</script>

<style lang="less" scoped>
.app--info-ctx {
  .layout--right--main();
  .padding41-40();
}
.el-form{
  position: relative;
}
.el-form-item{
  width: 600px;
}
.subject{
  font-size: 20px;
  color: #333333;
  border-left: 4px solid #FB3A32;
  line-height: 16px;
  height: 18px;
  margin-top: 32px;
  margin-bottom: 12px;
  padding-left: 5px;
}
.right{
  position: absolute;
  right: 0;
  top: 0;
  img{
    width: 170px;
    height: 170px;
    vertical-align: top;
    margin-right: 60px;
  }
}
</style>
