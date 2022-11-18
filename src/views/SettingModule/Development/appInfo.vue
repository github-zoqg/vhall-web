<template>
  <div v-loading="fetching" element-loading-text="努力加载中">
    <PageTitle :pageTitle="pageTitle">
      <div class="title_text">SecretKey适用于API和JSSDK，App SecretKey适用于移动端SDK</div>
    </PageTitle>
    <!-- 按钮 -->
    <div class="app-btns" v-if="action === 'detail'">
      <el-button size="medium" @click="modify" round>修改</el-button>
    </div>
    <!-- 面板 -->
    <div class="app-layout">
      <div :class="`app--info-ctx ${action == 'detail' ? 'detail-show' : 'edit-show'}`">
        <el-form :model="appForm" ref="appForm" label-width="160px">
          <template v-for="(node, index) in nodesShowData">
            <div :class="node.subject ? 'app-node-item padding' : 'app-node-item'">
              <p class="subject" v-if="node.subject" :key="index" v-html="node.label"></p>
              <el-form-item
                v-else
                :key="index"
                :prop="node.modelKey"
                :label="node.label"
                :rules="node.validateRules || []"
                :class="`${action !== 'detail' && node.nodeType == 'text' ? 'page-read-only' : ''}`"
              >
                <template v-if="action != 'detail' && node.nodeType != 'text'">
                  <VhallInput
                    v-if="node.nodeType == 'input'"
                    v-model="appForm[node.modelKey]"
                    v-bind="node.attrs"
                    autocomplete="off"
                  ></VhallInput>
                  <el-radio-group
                    v-else-if="node.nodeType == 'radio'"
                    v-model="appForm[node.modelKey]"
                  >
                    <el-radio v-for="radio in node.items" :label="radio.value" :key="radio.label">
                      {{ radio.label }}
                    </el-radio>
                  </el-radio-group>
                </template>
                <template v-else-if="node.modelKey === 'sign_type'">
                  <el-radio-group v-model="appForm[node.modelKey]" disabled>
                    <el-radio v-for="radio in node.items" :label="radio.value" :key="radio.label">
                      {{ radio.label }}
                    </el-radio>
                  </el-radio-group>
                </template>
                <span class="show-span" v-else>{{ appForm[node.modelKey] }}</span>
                <span
                  class="copy"
                  v-if="action === 'detail' && node.nodeType == 'text'"
                  @click="copy(appForm[node.modelKey])"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    content="复制"
                    placement="top"
                    v-tooltipMove
                  >
                    <i class="iconfont-v3 saasicon_copy"></i>
                  </el-tooltip>
                </span>
              </el-form-item>
            </div>
          </template>
        </el-form>
        <div v-if="action !== 'detail'" class="app-info-btn">
          <el-button class="length152" type="primary" @click="submitForm('appForm')" round>
            保存
          </el-button>
          <el-button class="length152 no-background" @click="cancel('appForm')" round>
            取消
          </el-button>
        </div>
      </div>
      <div class="app-code-right" v-if="action == 'detail'">
        <img :src="env.staticLinkVo.aliQr + appForm.qr_code_string" alt="" />
        <p>请用微吼小直播扫码</p>
      </div>
    </div>
  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle';
  import Env from '@/api/env.js';
  import Clipboard from 'clipboard';
  export default {
    components: {
      PageTitle
    },
    data() {
      return {
        action: 'detail',
        env: Env,
        appForm: {
          app_name: '',
          sign_type: '0', // 加密算法
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
            attrs: {
              placeholder: '请输入应用名称',
              maxlength: 7,
              'show-word-limit': true
            },
            modelKey: 'app_name',
            validateRules: [{ required: true, message: '请输入应用名称', trigger: 'blur' }]
          },
          {
            nodeType: 'text',
            label: 'APPKey',
            modelKey: 'app_key'
          },
          {
            nodeType: 'text',
            modelKey: 'secret_key',
            label: 'SecretKey'
          },
          {
            nodeType: 'text',
            modelKey: 'app_secret_key',
            label: 'App SecretKey'
          },
          {
            subject: true,
            label: `Android-SDK 签名值 <span style="font-size: 14px;font-weight: 400;color: #999999;line-height: 20px;">*请不要在未更新的情况下修改，否则将导致SDK服务无法使用</span>`
          },
          {
            nodeType: 'input',
            label: '安全码SHA1',
            attrs: {
              placeholder: '请输入安全码SHA1'
            },
            modelKey: 'signature'
          },
          {
            nodeType: 'input',
            label: '包名',
            attrs: {
              placeholder: '请输入包名'
            },
            modelKey: 'package_name'
          },
          {
            subject: true,
            label: 'IOS-SDK 签名值'
          },
          {
            nodeType: 'input',
            label: '安全码Bundle ID',
            attrs: {
              placeholder: '安全码Bundle ID'
            },
            modelKey: 'bundle_id'
          },
          {
            subject: true,
            label: '加密算法'
          },
          {
            nodeType: 'radio',
            label: '',
            items: [
              { label: 'MD5', value: '0' },
              { label: 'RSA', value: '1' }
            ],
            modelKey: 'sign_type'
          },
          {
            nodeType: 'text',
            modelKey: 'rsa_private_key',
            label: '私钥'
          },
          {
            nodeType: 'text',
            modelKey: 'rsa_public_key',
            label: '公钥'
          }
          /*{
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
        },*/
        ],
        fetching: false
      };
    },
    created() {
      this.getAppInfo();
    },
    computed: {
      pageTitle() {
        if (this.action == 'modify') {
          return '应用修改';
        } else {
          return '应用详情';
        }
      },
      nodesShowData() {
        return this.appForm['sign_type'] > 0
          ? this.nodesData
          : this.nodesData.filter(item => {
              return item.modelKey !== 'rsa_private_key' && item.modelKey !== 'rsa_public_key';
            });
      }
    },
    methods: {
      copy(text) {
        let clipboard = new Clipboard('.copy', {
          text: () => text
        });
        clipboard.on('success', () => {
          this.$message({
            message: `复制成功`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          // 释放内存
          clipboard.destroy();
        });
        clipboard.on('error', () => {
          this.$message({
            message: `复制失败，暂不支持自动复制`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          // 释放内存
          clipboard.destroy();
        });
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.addApp();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      addApp() {
        let param = JSON.parse(JSON.stringify(this.appForm));
        delete param.APPKey;
        delete param.SecretKey;
        delete param.APP_SecretKey;
        delete param.rsa_private_key;
        delete param.rsa_public_key;
        this.fetching = true;
        let api = 'createApp';
        let msgText = '创建';
        if (this.action == 'modify') {
          api = 'modifyApp';
          param.id = this.$route.params.appId;
          msgText = '修改';
        }
        this.$fetch(api, param)
          .then(res => {
            this.$message({
              message: `${msgText}成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            setTimeout(() => {
              this.$router.push({ path: '/setting/dev' });
            }, 500);
          })
          .catch(res => {
            this.$message({
              message: res.msg || `应用${msgText}失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          })
          .finally(() => {
            this.fetching = false;
          });
      },
      getAppInfo() {
        this.fetching = true;
        this.$fetch('getAppInfo', { id: this.$route.params.appId })
          .then(res => {
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
          })
          .catch(res => {
            this.$message({
              message: res.msg || `应用信息获取失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          })
          .finally(() => {
            this.fetching = false;
          });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      cancel() {
        if (this.action == 'modify') {
          this.getAppInfo();
          this.action = 'detail';
          // this.$route.meta.title= this.pageTitle;
        }
      },
      modify() {
        // this.$route.meta.action = 'modify';
        this.action = 'modify';
        // this.$route.meta.title= this.pageTitle;
      }
    }
  };
</script>

<style lang="less" scoped>
  .app--info-ctx {
    .layout--right--main();
    background: #f7f7f7;
    .show-span {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    &.edit-show {
      .el-form-item {
        width: 820px;
      }
      .app-node-item {
        &:first-child {
          margin-top: 0;
        }
      }
      /deep/.el-radio-group {
        margin-left: -120px;
        /deep/.el-radio__input {
          .el-radio__inner {
            width: 16px;
            height: 16px;
            background: #ffffff;
            border-color: #999999;
            &::after {
              background-color: #ffffff;
            }
          }
          &.is-checked {
            .el-radio__inner {
              width: 16px;
              height: 16px;
              background: #fb3a32;
              border-color: #fb3a32;
              &::after {
                background-color: #ffffff;
              }
            }
          }
        }
        /deep/.el-radio__label {
          font-size: 14px;
          font-weight: 400;
          color: #222222;
          line-height: 20px;
        }
      }
    }
    &.detail-show {
      width: calc(100% - 272px);
      display: inline-block;
      vertical-align: top;
      .el-form-item {
        width: 720px;
      }
      .copy {
        position: absolute;
        right: 67px;
        top: 0;
        color: #666666;
        font-size: 15px;
        cursor: pointer;
      }
      /deep/.el-form-item__content {
        line-height: 40px;
        position: relative;
      }
      /deep/.el-form-item__label {
        color: #666666;
      }
      .show-span {
        display: block;
        width: 500px;
        height: 40px;
        border-radius: 4px;
        border: 1px solid #cccccc;
        padding: 0 10px;
        font-size: 14px;
        font-weight: 400;
        color: #1a1a1a;
      }
      /deep/.el-form-item__label {
        &::before {
          display: none;
        }
      }
      /deep/.el-radio-group {
        margin-left: -120px;
        /deep/.el-radio__input {
          .el-radio__inner {
            width: 16px;
            height: 16px;
            background: #ffffff;
            border-color: #999999;
            &::after {
              background-color: #ffffff;
            }
          }
          &.is-checked {
            .el-radio__inner {
              width: 16px;
              height: 16px;
              background: #fb3a32;
              border-color: #fb3a32;
              &::after {
                background-color: #ffffff;
              }
            }
          }
        }
        /deep/.el-radio__label {
          font-size: 14px;
          font-weight: 400;
          color: #222222;
          line-height: 20px;
        }
      }
    }
  }
  .title_text {
    color: #999;
    font-size: 14px;
  }
  .app-node-item {
    background: #ffffff;
    /deep/.el-form-item {
      background: #ffffff;
      padding-bottom: 32px;
      margin-bottom: 0;
      &.page-read-only {
        .el-form-item__content {
          background: #f7f7f7;
          padding: 0 10px;
          border-radius: 4px;
        }
      }
    }
    &.padding {
      margin-top: 24px;
      padding-top: 24px;
      padding-left: 24px;
      padding-bottom: 24px;
    }
  }
  .app-btns {
    /deep/.el-button {
      border-radius: 20px;
      border: 1px solid #cccccc;
      font-weight: 400;
      color: #666666;
      background: transparent;
      &:hover {
        background: #fb3a32;
        border: 1px solid #fb3a32;
        color: #ffffff;
      }
      &:active {
        background: #e2332c;
        border: 1px solid #e2332c;
        color: #ffffff;
      }
    }
  }
  .el-form {
    position: relative;
  }
  .subject {
    border-left: 4px solid #fb3a32;
    padding-left: 8px;
    font-size: 20px;
    font-weight: 400;
    color: #333333;
    line-height: 28px;
  }
  .app-info-btn {
    margin-top: 40px;
    .no-background {
      border-radius: 20px;
      border: 1px solid #cccccc;
      font-weight: 400;
      color: #666666;
      background: transparent;
      &:hover {
        background: #fb3a32;
        border: 1px solid #fb3a32;
        color: #ffffff;
      }
      &:active {
        background: #e2332c;
        border: 1px solid #e2332c;
        color: #ffffff;
      }
    }
  }
  .app-code-right {
    display: inline-block;
    vertical-align: top;
    width: 248px;
    height: 276px;
    background: #ffffff;
    border-radius: 4px;
    margin-left: 24px;
    margin-top: 24px;
    img {
      display: block;
      width: 160px;
      height: 160px;
      margin: 44px 44px 8px 44px;
    }
    p {
      font-size: 14px;
      font-weight: 400;
      color: #1a1a1a;
      line-height: 20px;
      text-align: center;
    }
  }
</style>
