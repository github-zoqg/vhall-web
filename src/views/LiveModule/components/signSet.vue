<template>
  <div class="sign--set">
    <div class="sign--set--main">
      <div class="sign--set--left">
        <el-form
          :model="signSetForm"
          ref="signSetForm"
          :rules="signSetFormRules"
          label-width="66px"
        >
          <el-form-item label="主办方" prop="organizers_status">
            <div class="switch__box">
              <el-switch
                v-model="signSetForm.organizers_status"
                :active-value="1"
                :inactive-value="0"
                active-color="#FB3A32"
                inactive-color="#CECECE"
                :active-text="
                  signSetForm.organizers_status
                    ? '已开启，观看页显示主办方信息、个人主页按钮和关注按钮'
                    : '开启后，观看页显示主办方信息、个人主页按钮和关注按钮'
                "
              ></el-switch>
            </div>
          </el-form-item>
          <el-form-item label="版权" prop="reserved_status">
            <div class="switch__box">
              <el-switch
                v-model="signSetForm.reserved_status"
                :active-value="1"
                :inactive-value="0"
                active-color="#FB3A32"
                inactive-color="#CECECE"
                :active-text="
                  signSetForm.reserved_status
                    ? '已开启，观看页显示底部版权信息'
                    : '开启后，观看页显示底部版权信息'
                "
              ></el-switch>
            </div>
          </el-form-item>
          <el-form-item label="标识" prop="view_status">
            <div class="switch__box">
              <el-switch
                v-model="signSetForm.view_status"
                :active-value="1"
                :inactive-value="0"
                active-color="#FB3A32"
                inactive-color="#CECECE"
                :active-text="
                  signSetForm.view_status
                    ? '已开启，观看页显示品牌标识'
                    : '开启后，观看页显示品牌标识'
                "
              ></el-switch>
            </div>
          </el-form-item>
          <el-form-item label="图片" prop="logo_url">
            <upload
              class="upload__sign"
              v-model="signSetForm.logo_url"
              :domain_url="domain_url"
              :saveData="{
                path: 'interacts/skin-imgs',
                type: 'image'
              }"
              :heightImg="130"
              :widthImg="231"
              :on-success="handleUploadSuccess"
              :on-progress="uploadProcess"
              :on-error="uploadError"
              :on-preview="uploadPreview"
              :before-upload="beforeUploadHandler"
              @delete="resetLogoUrl"
            >
              <div slot="tip">
                <p>建议尺寸：120*44px，小于2M</p>
                <p>支持jpg、gif、png、bmp</p>
              </div>
            </upload>
          </el-form-item>
          <el-form-item label="链接" prop="skip_url" class="item--skip__url">
            <el-input
              v-model.trim="signSetForm.skip_url"
              placeholder="请输入http://或https://开头的链接"
            />
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" round v-preventReClick @click.prevent.stop="signSetSave">
              保 存
            </el-button>
          </el-form-item>
        </el-form>
        <div class="hide-white" v-show="brandType == 1 && brandConfig == 2"></div>
      </div>
      <!-- 预览区域 -->
      <brand-set-preview
        ref="brandSetPreviewComp"
        class="brand--preview"
        :brandType="brandType"
        :tabType="'signSet'"
      ></brand-set-preview>
    </div>
  </div>
</template>

<script>
  import Upload from '@/components/Upload/main';
  import BrandSetPreview from '../../LiveModule/components/brandSetPreview';
  import Env from '@/api/env';
  export default {
    name: 'signSet.vue',
    props: ['brandConfig', 'brandType'],
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
        // brandType: 1,
        domain_url: '',
        signSetFormRules: {
          logo_url: [{ required: false, message: '请选择标志', trigger: 'change' }],
          skip_url: [
            { required: false, message: '请输入标志链接', trigger: 'blur' },
            // { pattern: /((http|https):\/\/)?[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入正确的标志链接' , trigger: 'blur'}
            {
              pattern: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+).*?/,
              message: '请输入以http://或https://开头的标志链接',
              trigger: 'blur'
            }
          ]
        }
      };
    },
    // watch: {
    //   '$parent.type'() {
    //     if (this.brandType) {
    //       this.initComp();
    //     }
    //   }
    // },
    methods: {
      handleUploadSuccess(res, file) {
        console.log(res, file);
        if (res.data) {
          let domain_url = res.data.domain_url || '';
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
      beforeUploadHandler(file) {
        console.log(file);
        const typeList = ['png', 'jpeg', 'gif', 'bmp'];
        console.log(file.type.toLowerCase());
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
      uploadProcess(event, file, fileList) {
        console.log('uploadProcess', event, file, fileList);
      },
      uploadError(err, file, fileList) {
        console.log('uploadError', err, file, fileList);
        this.$message({
          message: `标志图片上传失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      },
      resetLogoUrl() {
        this.$nextTick(() => {
          this.signSetForm.logo_url = '';
          this.domain_url = '';
          try {
            this.$refs.brandSetPreviewComp.signSetVoInfo(this.signSetForm, this.domain_url);
          } catch (e) {
            console.log(e);
          }
        });
      },
      uploadPreview(file) {
        console.log('uploadPreview', file);
      },
      // 获取活动标记记录
      getSignInfo() {
        let params = {
          type: this.brandType,
          webinar_id: this.$route.params.str || ''
        };
        this.$fetch('getInterWebinarTag', this.$params(params))
          .then(res => {
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
          })
          .catch(err => {
            console.log(err);
          });
      },
      initComp() {
        // this.brandType = this.$parent.type;
        this.getSignInfo(); // 获取活动标志内容
      },
      // 保存
      signSetSave() {
        this.$refs.signSetForm.validate(valid => {
          if (valid) {
            console.log(this.signSetForm, 'signSetForm');
            let params = Object.assign(this.signSetForm, {
              webinar_id: this.$route.params.str || '',
              type: this.brandType
            });
            // let signObj = {}
            this.$fetch('setInterWebinarTag', this.$params(params))
              .then(res => {
                this.setReportData(this.$params(params));
                this.$message({
                  message: `保存基本设置成功`,
                  showClose: true,
                  // duration: 0,
                  type: 'success',
                  customClass: 'zdy-info-box'
                });
                // 重新获取数据
                this.getSignInfo();
              })
              .catch(res => {
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
      },
      setReportData(params) {
        let { keys, values } = Object;
        let wData = {
          organizers_status: 100199,
          reserved_status: 100201,
          view_status: 100203
        };
        let UData = {
          organizers_status: 100634,
          reserved_status: 100636,
          view_status: 100638
        };
        let data = this.$route.params.str ? wData : UData;
        keys(params).map((item, value) => {
          if (data[item]) {
            this.$vhall_paas_port({
              k: Number(values(params)[value]) === 1 ? data[item] + 1 : data[item],
              data: {
                business_uid: this.$parent.userId,
                user_id: '',
                webinar_id: this.$route.params.str || '',
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
          }
        });
        if (params.logo_url) {
          this.$vhall_paas_port({
            k: this.$route.params.str ? 100205 : 100640,
            data: {
              business_uid: this.$parent.userId,
              user_id: '',
              webinar_id: this.$route.params.str || '',
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
        }
        if (params.skip_url) {
          this.$vhall_paas_port({
            k: this.$route.params.str ? 100206 : 100641,
            data: {
              business_uid: this.$parent.userId,
              user_id: '',
              webinar_id: this.$route.params.str || '',
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .sign--set {
    padding: 41px 40px 40px 40px;
  }
  .sign--set--main {
    .flex-display;
    .justify(space-between);
    .align(flex-start);
  }
  .sign--set--left {
    width: 480px;
    position: relative;
    /deep/.el-form-item__label {
      line-height: 40px;
    }
    .hide-white {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background: rgba(255, 255, 255, 0.5);
      z-index: 9;
    }
  }
  .brand--preview {
    width: calc(100% - 480px);
    padding-left: 60px;
  }
  /deep/.el-form-item__label {
    padding: 0 10px 0 0;
    line-height: 20px;
  }
  /deep/.el-form-item {
    margin-bottom: 32px;
  }
  /deep/.el-input__inner {
    padding: 0 12px;
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
  .btnGroup {
    text-align: center;
    margin: 40px auto;
    .el-button {
      color: #fb3a32;
      border-color: #fb3a32;
      width: 150px;
      &:hover {
        background: #ffebeb;
      }
    }
    .el-button--primary {
      background: #fb3a32;
      border-color: #fb3a32;
      color: #fff;
      &:hover {
        background: #fc615b;
      }
    }
    .el-button.is-round {
      padding: 10px 23px;
    }
  }
</style>
