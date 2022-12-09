<template>
  <div v-if="!auth_show">
    <null-page
      text="控制台标志为高级功能，开通后您可以替换为您的品牌标志。<br/>联系您的客户经理获取权限后方可使用。"
      nullType="setting"
    >
      <el-button type="primary" round @click="openChat">联系客服</el-button>
    </null-page>
  </div>
  <!-- 有权限内容 -->
  <div v-else>
    <pageTitle pageTitle="控制台标识"></pageTitle>
    <div class="logo-ctx">
      <el-form :model="logoForm" ref="logoForm" :rules="logoFormRules" label-width="56px">
        <el-form-item label="图片" prop="logo" class="heightNo">
          <upload
            class="upload__avatar"
            v-model="logoForm.logo"
            :domain_url="domain_url"
            :saveData="{
              path: 'users/logo-imgs',
              type: 'image'
            }"
            :on-success="handleUploadSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            :before-upload="beforeUploadHandler"
            @delete="(logoForm.logo = ''), (domain_url = '')"
          >
            <div slot="tip">
              <p>建议尺寸：120*44px，小于2M</p>
              <p>支持jpg、gif、png、bmp</p>
            </div>
          </upload>
        </el-form-item>
        <el-form-item label="链接" prop="logo_jump_url" class="magBottom">
          <el-input
            type="text"
            placeholder="请输入以http://或https://开头的链接"
            v-model="logoForm.logo_jump_url"
          />
        </el-form-item>
        <el-form-item label="">
          <el-button
            type="primary"
            v-preventReClick
            round
            @click="saveConsoleLogo('save')"
            class="length152"
          >
            保存
          </el-button>
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
  import { sessionOrLocal } from '@/utils/utils';
  import env from '@/api/env';
  export default {
    name: 'logoMgr',
    components: {
      PageTitle,
      Upload,
      NullPage
    },
    data() {
      return {
        isAuth: true,
        lowerGradeInterval: null,
        logoForm: {
          logo: '',
          logo_jump_url: ''
        },
        logoFormRules: {
          logo: [{ required: true, message: '请上传图片', trigger: 'blur' }],
          logo_jump_url: [
            { required: false, message: '链接不能为空', trigger: 'blur' },
            // { pattern: /((http|https):\/\/)?[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入正确的标志链接' , trigger: 'blur'}
            {
              pattern: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+).*?/,
              message: '请输入以http://或https://开头的链接',
              trigger: 'blur'
            }
          ]
        },
        domain_url: '',
        auth_show: false
      };
    },
    // mounted() {
    //   this.handleLowerGradeHeart()
    // },
    methods: {
      getSysConfig() {
        let permissions = sessionOrLocal.get('SAAS_VS_PES', 'localStorage');
        if (permissions) {
          let perVo = JSON.parse(permissions);
          console.log(perVo, '权限-用户');
          // perVo['ui.console_logo'] = 1; // TODO 默认配置项权限开启
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
      handleLowerGradeHeart() {
        this.lowerGradeInterval = setInterval(() => {
          this.getLowerGradeConfig();
        }, (Math.random() * 5 + 5) * 1000);
      },
      getLowerGradeConfig() {
        this.$fetch('lowerGrade', {})
          .then(res => {})
          .catch(res => {
            // 降级没有code吗
            const { activity, user, global } = res;
            // 优先顺序：互动 > 用户 > 全局
            const activityConfig =
              activity && activity.length > 0
                ? activity.find(option => option.audience_id == this.$route.params.str)
                : null;
            const userConfig =
              user && user.length > 0
                ? user.find(option => option.audience_id == this.userId)
                : null;
            console.log('777777777', res);
            if (activityConfig) {
              this.setLowerGradeConfig(activityConfig.permissions);
            } else if (userConfig) {
              this.setLowerGradeConfig(userConfig.permissions);
            } else if (global && global.permissions) {
              this.setLowerGradeConfig(global.permissions);
            }
          });
      },
      setLowerGradeConfig(data) {
        if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval);
        const permission = sessionOrLocal.get('SAAS_VS_PES', 'localStorage');
        const permissionInfo = Object.assign(permission, data);
        if (permissionInfo) {
          let perVo = JSON.parse(permissionInfo);
          // perVo['ui.console_logo'] = 1; // TODO 默认配置项权限开启
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
        this.$vhall_paas_port({
          k: 100017,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: '',
            s: '',
            refer: 5,
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        window.open(`${env.staticLinkVo.kf}`, '_blank');
      },
      handleUploadSuccess(res, file) {
        console.log(res, file);
        if (res.data) {
          let domain_url = res.data.domain_url || '';
          let file_url = res.data.file_url || '';
          this.logoForm.logo = file_url;
          this.domain_url = domain_url;
        }
        // 触发验证
        this.$refs.logoForm.validateField('logo');
      },
      beforeUploadHandler(file) {
        console.log(file);
        const typeList = ['png', 'jpeg', 'gif', 'bmp'];
        console.log(file.type.toLowerCase());
        let typeArr = file.type.toLowerCase().split('/');
        const isType = typeList.includes(typeArr[typeArr.length - 1]);
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isType) {
          this.$message({
            message: `上传图片只能是 ${typeList.join('、')} 格式!`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        if (!isLt2M) {
          this.$message({
            message: `上传图片大小不能超过 2MB!`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        return isType && isLt2M;
      },
      uploadProcess(event, file, fileList) {
        console.log('uploadProcess', event, file, fileList);
      },
      uploadError(err, file, fileList) {
        console.log('uploadError', err, file, fileList);
        this.$message({
          message: `图片上传失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      },
      uploadPreview(file) {
        console.log('uploadPreview', file);
      },
      saveConsoleLogo(type) {
        if (type === 'default') {
          this.$vhall_paas_port({
            k: 100619,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: '',
              s: '',
              refer: 5,
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
          this.saveSend(
            {
              logo: '',
              logo_jump_url: ''
            },
            type
          );
        } else {
          this.$refs.logoForm.validate(valid => {
            if (valid) {
              this.saveSend(
                {
                  logo: this.$parseURL(this.logoForm.logo).path,
                  logo_jump_url: this.logoForm.logo_jump_url
                },
                type
              );
            }
          });
        }
      },
      saveSend(params, type) {
        this.$fetch('userEdit', params)
          .then(res => {
            this.$message({
              message: `保存设置成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            if (type === 'default') {
              this.logoForm.logo_jump_url = '';
              this.logoForm.logo = '';
              try {
                this.$ref.logoForm.resetFields();
              } catch (e) {
                console.log(e);
              }
            } else {
              this.$vhall_paas_port({
                k: 100617,
                data: {
                  business_uid: this.userId,
                  user_id: '',
                  webinar_id: '',
                  s: '',
                  refer: 5,
                  report_extra: {},
                  ref_url: '',
                  req_url: ''
                }
              });
              if (this.logoForm.logo_jump_url) {
                this.$vhall_paas_port({
                  k: 100618,
                  data: {
                    business_uid: this.userId,
                    user_id: '',
                    webinar_id: '',
                    s: '',
                    refer: 5,
                    report_extra: {},
                    ref_url: '',
                    req_url: ''
                  }
                });
              }
            }
            this.getAccountInfo();
          })
          .catch(res => {
            console.log(res);
            this.$message({
              message: res.msg || '保存设置失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      },
      getAccountInfo() {
        this.$fetch('getInfo', {
          scene_id: 2
        })
          .then(res => {
            if (res.data) {
              sessionOrLocal.set('userInfo', JSON.stringify(res.data));
              sessionOrLocal.set('userId', JSON.stringify(res.data.user_id));
              this.$EventBus.$emit('saas_vs_account_change', res.data);
            }
          })
          .catch(res => {
            this.$message({
              message: res.msg || '获取信息',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      }
    },
    created() {
      this.userId = JSON.parse(sessionOrLocal.get('userId'));
      this.getSysConfig();
    },
    beforeDestroy() {
      if (this.lowerGradeInterval) clearInterval(this.lowerGradeInterval);
    }
  };
</script>

<style lang="less" scoped>
  .logo-ctx {
    .layout--right--main();
    .padding48-40();
    .min-height();
    /deep/.el-input {
      width: 500px;
    }
    /deep/.el-input__inner {
      padding: 0 12px;
    }
    /deep/.el-form-item {
      margin-bottom: 32px;
    }
    /deep/.el-form-item.heightNo {
      .el-form-item__label {
        line-height: unset;
      }
    }
    /deep/.el-form-item.magBottom {
      margin-bottom: 40px;
    }
  }
  /* 图片上传 */
  .upload__avatar {
    /deep/.el-upload--picture-card {
      width: 500px;
      height: 180px;
      border: 1px solid #cccccc;
    }
    /deep/.box > div {
      width: 500px;
      height: 180px;
    }
  }
  .save-btn {
    margin: 40px auto;
  }
</style>
