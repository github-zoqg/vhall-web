<template>
  <div class="base--set">
    <el-form :model="baseSetForm" ref="baseSetForm" :rules="baseSetFormRules" label-width="94px">
      <el-form-item label="账号昵称" prop="nick_name">
        <VhallInput
          type="text"
          placeholder="请输入账号昵称"
          v-clearEmoij
          autocomplete="off"
          v-model="baseSetForm.nick_name"
          :maxlength="30"
          show-word-limit
        ></VhallInput>
      </el-form-item>
      <el-form-item label="账号头像" prop="avatar">
        <upload
          class="upload__avatar"
          v-model="baseSetForm.avatar"
          :domain_url="domain_url"
          :saveData="{
            path: 'users/face-imgs',
            type: 'image'
          }"
          :widthImg="180"
          :heightImg="180"
          :on-success="handleUploadSuccess"
          :on-progress="uploadProcess"
          :on-error="uploadError"
          :on-preview="uploadPreview"
          :before-upload="beforeUploadHandler"
          @delete="(baseSetForm.avatar = ''), (domain_url = '')"
        >
          <div slot="tip">
            <p>建议尺寸：140*140px</p>
            <p>小于2M</p>
            <p>支持jpg、gif、png、bmp</p>
          </div>
        </upload>
      </el-form-item>
      <el-form-item label="公司名称" prop="company">
        <VhallInput
          type="text"
          v-clearEmoij
          placeholder="请输入公司名称"
          autocomplete="off"
          v-model="baseSetForm.company"
          :maxlength="100"
          show-word-limit
        ></VhallInput>
      </el-form-item>
      <el-form-item label="您的职业" prop="position">
        <VhallInput
          type="text"
          v-clearEmoij
          placeholder="请输入您的职业"
          autocomplete="off"
          v-model="baseSetForm.position"
          :maxlength="150"
          show-word-limit
        ></VhallInput>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          class="length152"
          v-preventReClick
          round
          @click.prevent.stop="baseSetSave"
        >
          保 存
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import Upload from '@/components/Upload/main';
  import { sessionOrLocal } from '@/utils/utils';
  import Env from '@/api/env';
  export default {
    name: 'baseSet.vue',
    components: {
      Upload
    },
    data() {
      return {
        domain_url: '',
        baseSetForm: {
          nick_name: '',
          avatar: '',
          company: '',
          position: ''
        },
        reBaseForm: {
          nick_name: '',
          avatar: '',
          company: '',
          position: ''
        },
        baseSetFormRules: {
          nick_name: [
            { required: true, message: '账号昵称不能为空', trigger: 'blur' },
            { max: 30, message: '最多可输入30个字符', trigger: 'blur' },
            { min: 1, message: '请输入账号昵称', trigger: 'blur' }
          ],
          company: [{ max: 100, message: '最多可输入100个字符', trigger: 'blur' }],
          position: [{ max: 150, message: '最多可输入150个字符', trigger: 'blur' }]
        },
        accountInfo: null
      };
    },
    methods: {
      handleUploadSuccess(res, file) {
        console.log(res, file);
        if (res.data) {
          let domain_url = res.data.domain_url || '';
          let file_url = res.data.file_url || '';
          this.baseSetForm.avatar = file_url;
          this.domain_url = domain_url;
        }
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
            message: `上传封面图片只能是 ${typeList.join('、')} 格式`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        if (!isLt2M) {
          this.$message({
            message: '上传封面图片大小不能超过 2MB',
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
          message: '封面上传失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      },
      uploadPreview(file) {
        console.log('uploadPreview', file);
      },
      initComp() {
        let account_info = sessionOrLocal.get('userInfo');
        if (account_info !== null) {
          let accountInfo = JSON.parse(account_info);
          this.baseSetForm = accountInfo;
          this.domain_url = accountInfo.avatar;
          this.reBaseForm = JSON.parse(account_info);
          console.log(this.domain_url, this.baseSetForm.avatar, '其它头像地址');
        }
      },
      // 保存
      baseSetSave() {
        this.$refs.baseSetForm.validate(valid => {
          if (valid) {
            let params = {
              nick_name: this.baseSetForm.nick_name,
              avatar: this.$parseURL(this.baseSetForm.avatar).path,
              company: this.baseSetForm.company,
              position: this.baseSetForm.position
            };
            let userId = this.$parent.userId;
            // 昵称、头像、公司、职位 可修改
            this.$fetch('userEdit', params)
              .then(res => {
                console.log(res);
                if (this.baseSetForm.nick_name != this.reBaseForm.nick_name) {
                  this.$vhall_paas_port({
                    k: 100781,
                    data: {
                      business_uid: userId,
                      user_id: '',
                      webinar_id: '',
                      refer: '',
                      s: '',
                      report_extra: {},
                      ref_url: '',
                      req_url: ''
                    }
                  });
                }
                if (
                  this.domain_url != this.reBaseForm.avatar ||
                  (this.reBaseForm.avatar && this.baseSetForm.avatar == '')
                ) {
                  this.$vhall_paas_port({
                    k: 100782,
                    data: {
                      business_uid: userId,
                      user_id: '',
                      webinar_id: '',
                      refer: '',
                      s: '',
                      report_extra: {},
                      ref_url: '',
                      req_url: ''
                    }
                  });
                }
                if (this.baseSetForm.company != this.reBaseForm.company) {
                  this.$vhall_paas_port({
                    k: 100783,
                    data: {
                      business_uid: userId,
                      user_id: '',
                      webinar_id: '',
                      refer: '',
                      s: '',
                      report_extra: {},
                      ref_url: '',
                      req_url: ''
                    }
                  });
                }
                if (this.baseSetForm.position != this.reBaseForm.position) {
                  this.$vhall_paas_port({
                    k: 100784,
                    data: {
                      business_uid: userId,
                      user_id: '',
                      webinar_id: '',
                      refer: '',
                      s: '',
                      report_extra: {},
                      ref_url: '',
                      req_url: ''
                    }
                  });
                }
                this.$message({
                  message: '保存基本设置成功',
                  showClose: true,
                  // duration: 0,
                  type: 'success',
                  customClass: 'zdy-info-box'
                });
                // 更新账户信息
                this.getAccountInfo();
              })
              .catch(res => {
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
        });
      },
      getAccountInfo() {
        this.$fetch('getInfo', {
          scene_id: 2
        })
          .then(res => {
            if (res.data) {
              this.reBaseForm = res.data;
              sessionOrLocal.set('userInfo', JSON.stringify(res.data));
              sessionOrLocal.set('userId', JSON.stringify(res.data.user_id));
              this.$EventBus.$emit('saas_vs_account_change', res.data);
            }
          })
          .catch(res => {
            this.$message({
              message: res.msg || '获取账户信息失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      }
    }
  };
</script>

<style lang="less" scoped>
  .base--set {
    .padding41-40();
  }
  /deep/.el-input__inner {
    height: 40px !important;
  }
  /deep/.el-form-item__label {
    padding: 0 10px 0 0;
  }
  /deep/.el-form-item {
    margin-bottom: 32px;
  }
  /* 图片上传 */
  .upload__avatar {
    /deep/.el-upload--picture-card {
      width: 180px;
      height: 180px;
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
