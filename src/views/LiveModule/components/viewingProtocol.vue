<template>
  <div class="protocol--set">
    <div class="protocol--set--main">
      <div class="protocol--set--left">
        <el-form
          :model="viewingProtocolForm"
          ref="viewingProtocolForm"
          :rules="viewingProtocolFormRules"
          label-width="88px"
        >
          <el-form-item label="观看协议" prop="is_open">
            <div class="switch__box">
              <el-switch
                v-model="viewingProtocolForm.is_open"
                :active-value="1"
                @change="protocolChange"
                :inactive-value="0"
                active-color="#FB3A32"
                inactive-color="#CECECE"
                :active-text="
                  viewingProtocolForm.is_open
                    ? '已开启，观看直播前展示观看协议'
                    : '开启后，观看直播前展示观看协议'
                "
              ></el-switch>
            </div>
          </el-form-item>
          <el-form-item class="protocol-title" label="协议标题" prop="title">
            <VhallInput
              :disabled="viewingProtocolForm.is_open === 0"
              v-model="viewingProtocolForm.title"
              v-clearEmoij
              :maxlength="50"
              autocomplete="off"
              placeholder="请输入《观看协议》标题"
              show-word-limit
            ></VhallInput>
          </el-form-item>
          <el-form-item class="margin32" prop="content" :label="`协议内容`">
            <v-editor
              modelType="restriction"
              :placeholder="introPlaceholder"
              :class="viewingProtocolForm.is_open === 0 ? 'disabled-editor' : ''"
              class="editor-wrap"
              save-type="live"
              :isReturn="true"
              ref="unitImgTxtEditor"
              v-model="viewingProtocolForm.content"
            ></v-editor>
          </el-form-item>
          <!--  -->
          <!-- <el-form-item label="进入规则" prop="rule">
              <el-radio-group v-model="viewingProtocolForm.rule"  :disabled="viewingProtocolForm.is_open === 0">
                <el-radio :label="0">同意后进入直播间</el-radio>
                <el-radio :label="1">阅读后进入直播间</el-radio>
              </el-radio-group>
          </el-form-item> -->
          <el-form-item label="协议声明" prop="statement_status">
            <div class="switch__box">
              <el-switch
                v-model="viewingProtocolForm.statement_status"
                :disabled="viewingProtocolForm.is_open === 0"
                :active-value="1"
                :inactive-value="0"
                active-color="#FB3A32"
                inactive-color="#CECECE"
                :active-text="
                  viewingProtocolForm.statement_status
                    ? '已开启，可以添加隐私协议外链'
                    : '开启后，可以添加隐私协议外链'
                "
              ></el-switch>
            </div>
          </el-form-item>
          <el-form-item
            class="protocol-item"
            v-if="viewingProtocolForm.statement_status"
            prop="statement_content"
          >
            <VhallInput
              :disabled="viewingProtocolForm.is_open === 0"
              @input="handleInputContent($event)"
              :maxlength="100"
              class="title-inform"
              show-word-limit
              v-model="viewingProtocolForm.statement_content"
              autocomplete="off"
              placeholder="我已阅读并同意"
            ></VhallInput>
          </el-form-item>
          <el-form-item
            class="protocol-item item-title"
            v-if="viewingProtocolForm.statement_status"
            prop="proptocolTitle_0"
          >
            <VhallInput
              :disabled="viewingProtocolForm.is_open === 0"
              @input="handleInput($event, 0, 'title')"
              :maxlength="100"
              v-model="viewingProtocolForm.proptocolTitle_0"
              show-word-limit
              autocomplete="off"
              placeholder="请输入第1行中包含的文字才能实现跳转效果"
            ></VhallInput>
            <i
              class="el-icon-circle-plus-outline optIcon"
              v-if="viewingProtocolForm.is_open === 1 && statementList && statementList.length == 1"
              @click="privacyAdd"
            ></i>
          </el-form-item>

          <el-form-item
            class="protocol-item item-link"
            v-if="viewingProtocolForm.statement_status"
            prop="proptocolLink_0"
          >
            <VhallInput
              :disabled="viewingProtocolForm.is_open === 0"
              @input="handleInput($event, 0, 'link')"
              :maxlength="100"
              v-model="viewingProtocolForm.proptocolLink_0"
              class="title-inform"
              show-word-limit
              autocomplete="off"
              placeholder="请输入http://或https://开头的链接"
            ></VhallInput>
          </el-form-item>
          <el-form-item
            class="protocol-item item-title"
            v-if="statementList.length > 1 && viewingProtocolForm.statement_status"
            prop="proptocolTitle_1"
          >
            <VhallInput
              :disabled="viewingProtocolForm.is_open === 0"
              @input="handleInput($event, 1, 'title')"
              :maxlength="100"
              class="title-inform"
              v-model="viewingProtocolForm.proptocolTitle_1"
              show-word-limit
              autocomplete="off"
              placeholder="请输入第1行中包含的文字才能实现跳转效果"
            ></VhallInput>
            <i
              class="el-icon-remove-outline optIcon"
              @click="deleteOptions"
              v-if="viewingProtocolForm.is_open === 1 && statementList && statementList.length == 2"
            ></i>
          </el-form-item>

          <el-form-item
            class="protocol-item item-link"
            v-if="statementList.length > 1"
            v-show="viewingProtocolForm.statement_status"
            prop="proptocolLink_1"
          >
            <VhallInput
              :disabled="viewingProtocolForm.is_open === 0"
              @input="handleInput($event, 1, 'link')"
              :maxlength="100"
              class="title-inform"
              v-model="viewingProtocolForm.proptocolLink_1"
              show-word-limit
              autocomplete="off"
              placeholder="请输入http://或https://开头的链接"
            ></VhallInput>
          </el-form-item>
          <el-form-item label="">
            <el-button
              :disabled="viewingProtocolForm.is_open === 0"
              type="primary"
              round
              v-preventReClick
              @click.prevent.stop="protocolSave"
            >
              保 存
            </el-button>
          </el-form-item>
        </el-form>
        <div class="hide-white" v-show="!viewingProtocolForm.is_open"></div>
      </div>
      <!-- 预览区域 -->
      <protocol-preview
        ref="brandSetPreviewComp"
        :viewingProtocolForm="viewingProtocolForm"
        class="brand--preview"
        :tabType="'signSet'"
        :proptocolTitle_0="viewingProtocolForm.proptocolTitle_0"
        :proptocolTitle_1="viewingProtocolForm.proptocolTitle_1"
        :proptocolLink_0="viewingProtocolForm.proptocolLink_0"
        :proptocolLink_1="viewingProtocolForm.proptocolLink_1"
      ></protocol-preview>
    </div>
  </div>
</template>

<script>
  import ProtocolPreview from '../../LiveModule/components/protocolPreview';
  import VEditor from '@/components/Tinymce';
  export default {
    name: 'viewingProtocol.vue',
    props: ['brandConfig', 'tabType', 'type'],
    components: {
      ProtocolPreview,
      VEditor
    },
    data() {
      return {
        viewingProtocolForm: {
          title: '',
          statement_status: 0,
          logo_url: null,
          content: '',
          is_open: 0,
          statement_content: '我已同意并阅读《观看协议》',
          statement_info: null,
          proptocolTitle_0: '观看协议',
          proptocolLink_0: '',
          proptocolTitle_1: '',
          proptocolLink_1: ''
        },
        introPlaceholder: '',
        brandType: 1,
        domain_url: '',
        statementList: [
          {
            title: '观看协议',
            link: ''
          }
        ],
        viewingProtocolFormRules: {
          title: [{ required: true, message: `请填写协议标题`, trigger: 'blur' }],
          content: [{ required: true, message: `请输入协议内容`, trigger: 'blur' }],
          statement_content: [{ required: true, message: `请填写协议提示内容`, trigger: 'blur' }],
          proptocolTitle_0: [{ required: true, message: `请填写协议名称`, trigger: 'blur' }],
          proptocolLink_0: [
            { required: true, message: `请填写协议链接`, trigger: 'blur' },
            {
              pattern: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+).*?/,
              message: '请输入以http://或https://开头的标志链接',
              trigger: 'blur'
            }
          ],
          proptocolTitle_1: [{ required: true, message: `请填写协议名称`, trigger: 'blur' }],
          proptocolLink_1: [
            { required: true, message: `请填写协议链接`, trigger: 'blur' },
            {
              pattern: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+).*?/,
              message: '请输入以http://或https://开头的标志链接',
              trigger: 'blur'
            }
          ]
        }
      };
    },
    watch: {
      'viewingProtocolForm.content'(newVal) {
        this.introPlaceholder = newVal ? '' : '请输入《观看协议》内容';
      }
    },
    mounted() {
      console.log(this.brandType, 'this.brandType');
      this.initComp();
    },
    methods: {
      protocolChange(value) {
        // console.log(value, 'value')
        if (value === 0) {
          this.viewingProtocolForm.statement_info = JSON.stringify(this.statementList);
          // console.log(this.viewingProtocolForm, 'viewingProtocolForm');
          let params = Object.assign(this.viewingProtocolForm, {
            webinar_id: this.$route.params.str || '',
            type: this.type
          });
          this.$fetch('saveAgreement', this.$params(params))
            .then(res => {
              this.$message({
                message: `保存基本设置成功`,
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box'
              });
              // 重新获取数据
              // this.getProtocol();
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
      },
      handleInputContent(value) {
        let statementList = this.statementList;
        statementList.forEach((item, index) => {
          let titleName = `proptocolTitle_${index}`;
          if (item.title && value.indexOf(item.title) === -1) {
            this.statementList[index].title = '';
            this.viewingProtocolForm[titleName] = '';
          }
        });
        console.log(value, 'value');
        // this.$set(this.viewingProtocolForm, 'statement_content', value)
      },
      handleInput(value, index, type) {
        console.log(value, index);
        let statement_content = this.viewingProtocolForm.statement_content;
        let titleName = `proptocolTitle_${index}`;
        let linkName = `proptocolLink_${index}`;
        // let matchPrivacy1 = this.viewingProtocolForm.proptocolTitle_0 ? statement_content.match(this.viewingProtocolForm.proptocolTitle_0) : null;
        // let matchPrivacy2 = this.viewingProtocolForm.proptocolTitle_1 ? statement_content.match(this.viewingProtocolForm.proptocolTitle_1) : null;
        // this.indexFirst = statement_content.indexOf(this.viewingProtocolForm.proptocolTitle_0)
        // this.indexSecond = statement_content.indexOf(this.viewingProtocolForm.proptocolTitle_1)
        // if(matchPrivacy1 && matchPrivacy2 && this.indexFirst === this.indexSecond){
        //     this.$message({
        //       message: '两个观看协议标题不能占用协议声明相同位置的相同字段，请先补充协议声明',
        //       showClose: true,
        //       // duration: 0,
        //       type: 'error',
        //       customClass: 'zdy-info-box'
        //     });
        //     return
        // }
        if (type === 'title') {
          this.viewingProtocolForm[titleName] = value;
          if (value && statement_content.indexOf(value) === -1) {
            this.statementList[index].title = '';
            this.viewingProtocolForm[titleName] = '';
            // let oldValue = value.substring(0, value.length-1)
            // console.log(value.substring(0, value.length-1), 'value.substring(0, value.length-1)')
            // let viewingProtocolForm = this.viewingProtocolForm
            // this.viewingProtocolForm.statement_content = viewingProtocolForm.statement_content.replace(oldValue, '')
          } else {
            this.statementList[index].title = value;
            this.viewingProtocolForm[titleName] = value;
          }
        } else {
          this.viewingProtocolForm[linkName] = value;
          this.statementList[index].link = value;
          // console.log(this.viewingProtocolForm, linkName, 'linkName')
        }
        // console.log(this.viewingProtocolForm, 'this.viewingProtocolForm[`proptocolTitle_${index}`]')
      },
      deleteOptions() {
        this.statementList.pop();
        let viewingProtocolForm = this.viewingProtocolForm;
        let oldValue = viewingProtocolForm.proptocolTitle_1;
        // console.log(oldValue, 'value.substring(0, value.length-1)')
        this.viewingProtocolForm.statement_content = viewingProtocolForm.statement_content.replace(
          '《' + oldValue + '》',
          ''
        );
        this.viewingProtocolForm.statement_content = viewingProtocolForm.statement_content.replace(
          '及',
          ''
        );

        this.viewingProtocolForm.proptocolTitle_1 = '';
        this.viewingProtocolForm.proptocolLink_1 = '';
      },
      privacyAdd() {
        let statementObj = {
          title: '观看协议2',
          link: ''
        };
        if (this.viewingProtocolForm.proptocolTitle_0) {
          let contentLength = this.viewingProtocolForm.statement_content.length;

          if (contentLength + 8 <= 100) {
            this.statementList.push(statementObj);
            this.viewingProtocolForm.statement_content += '及《观看协议2》';
            // this.viewingProtocolForm.proptocolTitle_1 = '观看协议2'
            this.$set(this.viewingProtocolForm, 'proptocolTitle_1', '观看协议2');
            this.$set(this.viewingProtocolForm, 'proptocolLink_1', '');
          } else {
            this.$message({
              message: '添加隐私协议会超出预览字数，请删减后再添加',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          }
        } else {
          this.$message({
            message: '请完善可点击文字',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        }
      },
      handleUploadSuccess(res, file) {
        console.log(res, file);
        if (res.data) {
          let domain_url = res.data.domain_url || '';
          let file_url = res.data.file_url || '';
          this.viewingProtocolForm.logo_url = file_url;
          this.domain_url = domain_url;
        }
        // 触发验证
        this.$refs.viewingProtocolForm.validateField('logo_url');
        try {
          this.$refs.brandSetPreviewComp.signSetVoInfo(this.viewingProtocolForm, this.domain_url);
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
        const isLt2M = file.size / 1024 / 1024 < 4;
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
            message: `标志图片大小不能超过 4MB!`,
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
      // 获取观看协议记录
      getProtocol() {
        //  this.viewingProtocolForm.proptocolTitle_0 = 'statement_info[0].title';
        //  this.viewingProtocolForm.proptocolLink_0 =' statement_info[0].link'
        let params = {
          type: this.type,
          webinar_id: this.type == 1 ? this.$route.params.str : ''
        };
        this.$fetch('getAgreement', this.$params(params))
          .then(res => {
            console.log(res);
            if (res && res.code === 200) {
              // this.$refs['viewingProtocolForm'] ? this.$refs['viewingProtocolForm'].resetFields() : '';
              if (res.data && res.data.title) {
                // this.viewingProtocolForm = res.data;
                this.$set(this.viewingProtocolForm, 'content', res.data.content);
                this.$set(this.viewingProtocolForm, 'title', res.data.title);
                this.$set(this.viewingProtocolForm, 'statement_status', res.data.statement_status);
                this.$set(this.viewingProtocolForm, 'is_open', res.data.is_open);
                if (res.data.statement_status) {
                  // this.$set(this.viewingProtocolForm, 'statement_info', res.data.statement_info)
                  this.$set(
                    this.viewingProtocolForm,
                    'statement_content',
                    res.data.statement_content
                  );
                  let statement_info = res.data.statement_info;
                  if (statement_info && statement_info.length > 0) {
                    this.statementList = statement_info;

                    statement_info.forEach((item, index) => {
                      let titleName = `proptocolTitle_${index}`;
                      let linkName = `proptocolLink_${index}`;
                      this.$set(this.viewingProtocolForm, titleName, item.title);
                      this.$set(this.viewingProtocolForm, linkName, item.link);
                    });
                  }
                }

                // console.log(this.viewingProtocolForm, this.statementList, ' this.statementList')
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      initComp() {
        this.brandType = this.$parent.type;
        this.getProtocol(); // 获取活动标志内容
      },
      // 保存
      protocolSave() {
        // console.log(this.viewingProtocolForm, this.statementList, 'this.statementList')
        this.$refs.viewingProtocolForm.validate(valid => {
          if (valid) {
            if (
              this.statementList.length === 2 &&
              this.statementList[0].title === this.statementList[1].title
            ) {
              this.$message({
                message: `隐私协议名称不能重复`,
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
              return;
            }
            this.viewingProtocolForm.statement_info = JSON.stringify(this.statementList);
            // console.log(this.viewingProtocolForm, 'viewingProtocolForm');
            let params = Object.assign(this.viewingProtocolForm, {
              webinar_id: this.$route.params.str || '',
              type: this.type
            });
            this.$fetch('saveAgreement', this.$params(params))
              .then(res => {
                console.log(res, 'res');

                this.$message({
                  message: `保存基本设置成功`,
                  showClose: true,
                  // duration: 0,
                  type: 'success',
                  customClass: 'zdy-info-box'
                });
                // 重新获取数据
                // this.getProtocol();
              })
              .catch(res => {
                console.log(res);
                if (res.code === 513554) {
                  this.$message({
                    message: `协议名称不能重复`,
                    showClose: true,
                    // duration: 0,
                    type: 'error',
                    customClass: 'zdy-info-box'
                  });
                  return;
                }
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
  .protocol--set {
    padding: 41px 40px 40px 40px;
  }
  .protocol--set--main {
    .flex-display;
    .justify(space-between);
    .align(flex-start);
  }
  .protocol--set--left {
    width: 480px;
    position: relative;
    /deep/.el-form-item__content {
      line-height: 37px;
    }
    /deep/.el-form-item__label {
      line-height: 40px;
    }
    .hide-white {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 50px;
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
  /deep/.el-radio {
    //选中时边框的颜色
    &.is-checked .el-radio__label {
      color: #1a1a1a !important;
    }
    //鼠标滑过改变字体和小圆圈边框的样式
    &:hover {
      color: #1a1a1a !important;
      //鼠标滑过时小圆点边框显示
      .el-radio__inner {
        color: #1a1a1a !important;
      }
    }
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
  .item-title {
    position: relative;
  }
  .optIcon {
    position: absolute;
    font-weight: bold;
    font-size: 20px;
    color: #666666;
    vertical-align: middle;
    display: none;
    line-height: 34px;
    cursor: pointer;
    display: inline-block;
    right: -26px;
    top: 5px;
  }
  .title-input-div {
    display: flex;
    align-content: center;
  }
  .disabled-editor {
    pointer-events: none;
    cursor: not-allowed;
  }
  .protocol-item /deep/.el-input__inner {
    padding-right: 65px !important;
  }
  .protocol-title /deep/.el-input__inner {
    padding-right: 52px !important;
  }
</style>
