<template>
  <div class="subject-viewer">
    <pageTitle pageTitle="设置观看鉴权模式"></pageTitle>
    <div class="subject-viewer_container">
      <div class="subject-viewer_choose">
        <el-radio v-model="subject_verify" :label="0">无统一限制，采用直播自己的</el-radio> <br/>
        <el-radio v-model="subject_verify" :label="1" @change="changeViewer">统一观看限制，各直播自己的失效</el-radio><br/>
        <el-radio v-model="subject_verify" :label="2" @change="changeViewer">统一报名表单，各直播自己的失效</el-radio>
      </div>
      <!-- 报名表单 -->
      <sign-up-main v-if="isLoadSignUp"></sign-up-main>
      <template v-if="subject_verify==1">
        <div class="viewer_header">
          <div class="viewer_header_title">专题观看限制</div>
          <el-radio-group v-model="subjectForm.verify">
            <el-radio :label="0">免费</el-radio>
            <el-radio :label="4">邀请码（原F码）</el-radio>
            <el-radio :label="1">密码</el-radio>
            <el-radio :label="2">白名单</el-radio>
          </el-radio-group>
        </div>
        <div class="viewer_container">
          <template v-if="subjectForm.verify == 0">
            <!-- 免费 0 -->
            <div class="viewer_container_free">
              观看无需任何验证，即可观看直播
            </div>
          </template>
          <template v-if="subjectForm.verify == 4">
            <!-- 邀请码（原F码）4-->
            <div class="viewer_container_code">
              <el-form :model="formCode" ref="formCode" :rules="codeFormRules"  label-width="82px">
                <el-form-item label="生成邀请码" prop="code">
                  <div class="code_flex">
                    <VhallInput v-model.trim="formCode.code" autocomplete="off" placeholder="1-1000个" class="code_btn" @input="formatInputs($event, 'formCode', 'code')">
                      <el-button type="text" class="no-border" size="mini" slot="append" v-preventReClick @click.prevent.stop="fCodeExecute('formCode')">生成</el-button>
                    </VhallInput>
                    <span class="inline-count">已生成<span> {{ codeNum || 0}} </span>个</span>
                    <el-button class="down-btn" size="medium" type="white-primary" v-preventReClick round @click="downFCodeHandle">下载邀请码</el-button>
                  </div>
                </el-form-item>
                <el-form-item label="设置提示">
                  <VhallInput v-model.trim="formCode.placeholder" class="code_btn" autocomplete="off" placeholder="请输入邀请码" :maxlength="30" show-word-limit></VhallInput>
                  <span class="code_tip" @click="openDialog(formCode.placeholder|| '请输入邀请码')">查看效果</span>
                </el-form-item>
                <el-form-item label="试看">
                  <div class="switch__box">
                    <el-switch
                      v-model="subjectForm.is_preview"
                      :active-value="1"
                      :inactive-value="0"
                      active-color="#FB3A32"
                      inactive-color="#CECECE">
                    </el-switch>
                    <span class="level_tip">开启后，观众可以对回放进行试看</span>
                  </div>
                </el-form-item>
                <el-form-item label="试看时长" v-show="subjectForm.is_preview">
                <el-select v-model="subjectForm.preview_time" placeholder="请选择">
                  <el-option
                    v-for="item in timeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              </el-form>
            </div>
          </template>
          <template v-if="subjectForm.verify == 1">
            <!-- 免费 密码 -->
            <div class="viewer_container_password">
              <el-form :model="pwdForm" ref="pwdForm" :rules="pwdFormRules"  label-width="70px">
                <el-form-item label="观看密码" prop="password">
                  <VhallInput v-model.trim="pwdForm.password" class="code_btn" autocomplete="off" placeholder="请输入密码" :maxlength="12" show-word-limit></VhallInput>
                </el-form-item>
                <el-form-item label="设置提示" prop="">
                  <VhallInput v-model.trim="pwdForm.placeholder" class="code_btn" autocomplete="off" placeholder="请输入密码" :maxlength="30" show-word-limit></VhallInput>
                  <span class="code_tip" @click="openDialog(pwdForm.placeholder || '请输入密码')">查看效果</span>
                </el-form-item>
                <el-form-item label="试看">
                  <div class="switch__box">
                    <el-switch
                      v-model="subjectForm.is_preview"
                      :active-value="1"
                      :inactive-value="0"
                      active-color="#FB3A32"
                      inactive-color="#CECECE">
                    </el-switch>
                    <span class="level_tip">开启后，观众可以对回放进行试看</span>
                  </div>
                </el-form-item>
                <el-form-item label="试看时长" v-show="subjectForm.is_preview">
                <el-select v-model="subjectForm.preview_time" placeholder="请选择">
                  <el-option
                    v-for="item in timeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              </el-form>
            </div>
          </template>
          <template v-if="subjectForm.verify == 2">
            <!-- 白名单 2 -->
            <div class="viewer_container_white">
              <el-form label-width="82px">
              <el-form-item label="设置提示" prop="">
                <VhallInput v-model.trim="white_verify" class="code_btn" autocomplete="off" placeholder="请输入手机号/邮箱/工号" :maxlength="30" show-word-limit></VhallInput>
                <span class="code_tip" @click="openDialog(white_verify || '请输入手机号/邮箱/工号')">查看效果</span>
              </el-form-item>
              <el-form-item label="选择观众组">
                <ul class="tab__white">
                  <li :class="['tab__btn--solid', {'active': whiteId === item.group_id }]"  v-for="(item, ins) in groupList" :key="`group${ins}`" @click.prevent.stop="selectGroup(item)">
                    <span>{{item.subject}}</span>
                  </li>
                  <li>
                    <router-link :to="{path:'/material/viewer'}"><el-button type="white-primary" class="" size="small" round><i class="el-icon-plus"></i>添加观众组</el-button></router-link>
                  </li>
                </ul>
              </el-form-item>
              <el-form-item label="试看">
                <div class="switch__box">
                  <el-switch
                    v-model="subjectForm.is_preview"
                    :active-value=1
                    :inactive-value=0
                    active-color="#FB3A32"
                    inactive-color="#CECECE">
                  </el-switch>
                  <span class="level_tip">开启后，观众可以对回放进行试看</span>
                </div>
              </el-form-item>
              <el-form-item label="试看时长" v-show="subjectForm.is_preview">
                <el-select v-model="subjectForm.preview_time" placeholder="请选择">
                  <el-option
                    v-for="item in timeOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
            </div>
          </template>
        </div>
      </template>
      <!-- 保存（报名表单展示的时候，用报名表单的按钮） -->
      <div class="subject-viewer_save" v-if="!isLoadSignUp">
        <el-form label-width="82px">
          <el-button type="primary" class="length152" v-preventReClick round @click.prevent.stop="saveSubjectViewer">{{subject_verify==2 ? '下一步' : '保 存'}}</el-button>
        </el-form>
      </div>
      <VhallDialog :visible='visiblePreview' title="权限验证" width='400px' @close="visiblePreview = false;">
        <span  class="subject-viewer_dialog" v-if='!showPwd'>
          <el-input :placeholder="showText" v-model="stash" type="password" maxlength="12"></el-input>
          <span class="iconfont-v3 saaseyeclose_huaban1 inputIcon" @click='showPwd = true'></span>
        </span>
        <span  class="subject-viewer_dialog" v-else>
          <el-input :placeholder="showText" v-model="stash"></el-input>
          <span class="iconfont-v3 saasicon-eye inputIcon" @click='showPwd = false'></span>
        </span>
        <div slot='footer'>
          <el-button type="primary" round @click="visiblePreview = false;" class="button_size">确定</el-button>
        </div>
      </VhallDialog>
      <checkViewer :checkList="checkSubjectList" ref="checkViewer"></checkViewer>
    </div>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
import { sessionOrLocal } from '@/utils/utils';
import checkViewer from './components/checkDialog.vue'
import SignUpMain from '../LiveModule/signUp/main.vue';

export default {
  data() {
    let checkNums = (rule, value, callback) => {
     if (!value) {
        return callback(new Error('邀请码数量1-1000'));
      } else if (value > 1000 || value < 1) {
        return callback(new Error('邀请码数量1-1000'));
      } else if (isNaN(value)) {
        return callback(new Error('邀请码数量1-1000'));
      } else {
        callback();
      }
    };
    let checkPwd = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码只能由1-12位数字或字母组成'));
      } else if (!/^[0-9a-zA-Z]{1,12}$/.test(value)) {
        return callback(new Error('密码只能由1-12位数字或字母组成'));
      } else {
        callback();
      }
    };
    return {
      subject_verify: 0,
      subjectForm: {
        subject_id: this.$route.params.id,
        verify: 0,
        is_preview: false,
        preview_time: 5
      },
      white_verify: '', //白名单提示语
      // 邀请码
      formCode: {
        code: '',
        placeholder: ''
      },
      codeNum: 0, //生成邀请码个数
      whiteId: null,
      // 密码
      pwdForm: {
        password: '',
        placeholder: ''
      },
      groupList: [], //白名单列表
      codeFormRules: {
        code: [
          { required: false, message: '邀请码数量1-1000', trigger: 'blur' },
          { pattern: /^(1000|[1-9][0-9]{0,2})$/, message: '邀请码数量1-1000' , trigger: 'blur'},
          { validator: checkNums, trigger: 'blur' }
        ]
      },
      pwdFormRules: {
        password: [
          { required: false, message: '密码只能由1-12位数字或字母组成', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]{1,12}$/, message: '密码只能由1-12位数字或字母组成' , trigger: 'blur'},
          { validator: checkPwd, trigger: 'blur' }
        ]
      },
      visiblePreview: false,
      showPwd: false,
      showText: '',
      stash:'',
      checkSubjectList: [],
      timeOption: [
        {
          label: '5分钟',
          value: 5
        },
        {
          label: '10分钟',
          value: 10
        },
        {
          label: '15分钟',
          value: 15
        },
        {
          label: '20分钟',
          value: 20
        }
      ],
      isLoadSignUp: false, // 是否加载报名表单
    }
  },
  components: {
    PageTitle,
    checkViewer,
    SignUpMain
  },
  created() {
    this.initInfo();
  },
  methods: {
    // 获取信息
    initInfo() {
      this.$fetch('subjectInfo', {
        subject_id: this.$route.params.id
      }).then(res => {
        if (res.code == 200) {
          const { verify_data } = res.data.webinar_subject;
          this.subject_verify = res.data.webinar_subject.subject_verify;
          this.groupList = verify_data.white_list;
          this.subjectForm.verify = verify_data.verify;
          this.subjectForm.is_preview = verify_data.is_preview;
          this.subjectForm.preview_time = verify_data.preview_time;
          if (verify_data.verify == 1) {
            this.pwdForm.password = verify_data.password;
            this.pwdForm.placeholder = verify_data.placeholder;
          } else if (verify_data.verify == 4) {
            this.formCode.code = verify_data.fcodes;
            this.formCode.placeholder = verify_data.fcode_verify
          } else if (verify_data.verify == 2) {
            this.whiteId = verify_data.white_id;
            this.white_verify = verify_data.white_verify; //白名单提示语
          }
        }
      })
    },
    // 检测是否可以选中权限
    changeViewer() {
      this.$fetch('subjectCheck', {
        subject_id: this.$route.params.id
      }).then(res => {
        if (res.code === 200) {
          if (res.data.length) {
            this.subject_verify = 0;
            this.checkSubjectList = res.data;
            this.$refs.checkViewer = true;
          }
        }
      }).catch(res =>{
         this.subject_verify = 0;
         this.$message({
          message:  res.msg || '获取失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    // 打开查看效果预览
    openDialog(placeholder) {
      this.visiblePreview = true;
      this.showText = placeholder;
      this.stash = '';
      this.showPwd = false;
    },
    // 保存
    saveSubjectViewer() {
      if (this.subject_verify == 1) {
        const verify = this.subjectForm.verify;
        switch (verify) {
          case 0:
            this.saveFreeParams(verify);
            break;
          case 1:
            this.savePwdParams(verify);
            break;
          case 2:
            this.saveWhiteParams(verify);
            break;
          case 4:
            this.saveCodeParams(verify);
            break;
        }
      } else {
        let params = {
          subject_id: this.subjectForm.subject_id,
          subject_verify: this.subject_verify == 2 ? 2 : 0
        }
        this.saveSubjectInfo(params);
      }

    },
    // 0:免费参数
    saveFreeParams(verify) {
      let params = {
          subject_id: this.subjectForm.subject_id,
          verify: verify,
        }
      this.saveSubjectInfo(params)
    },
    // 1:密码参数
    savePwdParams(verify) {
      this.$refs.pwdForm.validate((valid) => {
        if(valid) {
          let params = {
            subject_id: this.subjectForm.subject_id,
            verify: verify,
            password: this.pwdForm.password,
            password_verify: this.pwdForm.placeholder || '请输入密码',
            is_preview: this.subjectForm.is_preview,
            preview_time: this.subjectForm.is_preview ? this.subjectForm.preview_time : undefined
          }
          this.saveSubjectInfo(params)
        }
      });
    },
    // 2:白名单参数
    saveWhiteParams(verify) {
      let flag = this.whiteId !== null && this.whiteId !== undefined && this.whiteId !== '';
      if (!flag) {
        this.$message({
          message:  `请选择观众组`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return;
      }
      let params = {
        webinar_id: this.subjectForm.subject_id,
        verify: verify,
        white_id: this.whiteId,
        is_preview: this.subjectForm.is_preview,
        preview_time: this.subjectForm.is_preview ? this.subjectForm.preview_time : undefined,
        white_verify: this.white_verify || '请输入手机号/邮箱/工号'
      }
      this.saveSubjectInfo(params)
    },
    // 4: 邀请码
    saveCodeParams(verify) {
      if (!this.codeNum) {
        this.$message({
          message:  `您暂无邀请码，请生成后保存`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return;
      }
      this.$refs.formCode.validate((valid) => {
        if(valid) {
          let params = {
            subject_id: this.subjectForm.subject_id,
            verify: verify,
            fcode_verify: this.formCode.placeholder || '请输入邀请码',
            is_preview: this.subjectForm.is_preview,
            preview_time: this.subjectForm.is_preview ? this.subjectForm.preview_time : undefined
          }
          this.saveSubjectInfo(params)
        }
      });
    },
    saveSubjectInfo(params) {
      this.$fetch('createSubjectVerify', params).then(res => {
        this.$message({
          message:  `设置成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        if (this.subject_verify == 2) {
          this.$router.push({path: `/subject/signup/${this.$route.params.id}`})
        } else {
          this.$router.push({ path: `/subject/list`})
        }

      }).catch(res =>{
         this.$message({
          message:  res.msg || '设置失败',
          showClose: true,
          // duration: 0,
          type: res.code == 512999 ? 'warning' : 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    // 选择白名单
    selectGroup(item) {
      this.whiteId = item.group_id;
    },
    // 验证码生成
    fCodeExecute(formName) {
      let errorMsg = '';
      this.$refs[formName].validateField('code', (msg) => {
        errorMsg = msg;
      });
      if(!errorMsg) {
        this.$fetch('createSubjectCode', {
          subject_id: this.subjectForm.subject_id,
          nums: this.formCode.code
        }).then(res => {
          this.$message({
            message:  `生成成功`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          // 更新已生成邀请码数量
          this.codeNum = res.data.code_count;
        }).catch(res => {
          console.log(e);
          this.$message({
            message:  res.msg || '生成失败',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        });
      }
    },
    downFCodeHandle() {
       this.$fetch('downloadSubjectCode', {
        subject_id: this.subjectForm.subject_id
      }).then(res => {
        this.$message({
          message:  `邀请码下载申请成功，请去下载中心查看`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.$EventBus.$emit('saas_vs_download_change');
      }).catch(res => {
        console.log(res);
        this.$message({
          message:  res.msg || '邀请码下载申请失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    formatInputs(value, formName, key) {
      if (key === 'code') {
        if (!/^(1000|[1-9][0-9]{0,2})$/.test(value)) {
          if(!value.match(/^(1000|[1-9][0-9]{0,2})$/g)) {
            this[formName][key] = '';
          } else {
            this[formName][key] = parseFloat(value).toFixed(2);
          }
        }
      } else {
        if (!/^\d{0,5}(\.\d{0,2})?$/.test(value)) {
          if(!value.match(/^\d{0,5}(\.\d{0,2})?$/g)) {
            this[formName][key] = '';
          } else {
            this[formName][key] = parseFloat(value).toFixed(2);
          }
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .subject-viewer{
    &_choose {
      .el-radio{
        padding-bottom: 16px;
      }
    }
    &_container {
      width: 100%;
      height: auto;
      background: #FFFFFF;
      border-radius: 4px;
      overflow: hidden;
      min-height: 544px;
      padding: 49px 56px 40px 56px;
      .viewer_header{
        &_title{
          color: #000;
          padding: 12px 0 24px 0;
        }

      }
      .viewer_container{
        margin-top: 32px;
        &_free{
          font-size: 14px;
          font-family: "-apple-system", "BlinkMacSystemFon", "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
          font-weight: 400;
          color: #666666;
          line-height: 20px;
        }
        .code_btn{
          &.el-input {
            width: 320px;
            .el-input__inner{
              height: 40px;
            }
          }
        }
        .no-border{
          span{
            color: #1A1A1A;
            font-size: 14px;
          }
        }
        .inline-count{
          font-size: 14px;
          font-weight: 400;
          color: #1A1A1A;
          line-height: 20px;
          margin-left: 8px;
          margin-right: 24px;
          span{
            color: #fb3a32;
          }
        }
        .level_tip{
          color: #999;
        }
        .code_tip{
          color: #3562FA;
          padding-left: 10px;
          cursor: pointer;
        }
        &_white{
          .tab__white {
            li {
              display: inline-block;
              list-style-type: none;
              text-align: center;
              padding: 3px 16px;
              margin-right: 12px;
              line-height: 24px;
              background: #F7F7F7;
              border-radius: 16px;
              &:last-child {
                background: #ffffff;
                /* display: block; */
                text-align: left;
                padding: 3px 16px 3px 0;
              }
              span {
                font-size: 14px;
                font-family: @fontRegular;
                font-weight: 400;
                color: #666666;
                line-height: 24px;
              }
            }
          }
          .tab__btn--solid {
            border: 1px solid #F7F7F7;
            cursor: pointer;
            &.active,&:hover{
              background: #FFEBEB;
              border-color: #FFEBEB;
              span {
                color: #FB3A32;
              }
            }
          }
          i.el-icon-plus {
            margin-right: 3px;
            padding: 0;
            color: #FB3A32;
          }
        }
      }
      .switch__box {
        /deep/ .el-switch {
          margin-right: 8px;
        }

        /deep/ span.el-switch__core {
          width: 28px !important;
          height: 16px !important;
          background: #cecece !important;
          border-radius: 10px !important;
          border-color: #cecece !important;
        }

        /deep/ .el-switch.is-checked span.el-switch__core {
          background: #fb3a32 !important;
          border-radius: 8px !important;
          border-color: #fb3a32 !important;
        }

        /deep/ span.el-switch__core:after {
          width: 12px;
          height: 12px;
          background: #fff;
          box-shadow: 1px 1px 4px 0 rgba(0, 0, 0, 0.2);
        }

        /deep/ .el-switch.is-checked .el-switch__core::after {
          margin-left: -13px;
        }
      }
    }
    &_save{
      margin-top: 40px;
    }
    &_dialog{
      position: relative;
      .inputIcon{
        position: absolute;
        right: 10px;
        top: 0px;
        display: inline-block;
        height: 16px;
        background: #fff;
        text-align: right;
      }
    }

  }
</style>
