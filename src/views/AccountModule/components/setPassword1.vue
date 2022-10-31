<template>
  <div>
    <VhallDialog :title="title" :visible.sync="visible" :close-on-click-modal="false" width="30%">
      <!-- level 第一步-->
      <div v-if="level === 1 && step === 1">
        <div class="content">
          <el-form :model="levelForm" ref="levelForm" :rules="levelFormRules" label-width="85px">
            <p class="warning-info">
              为了保证您的账号安全，修改密码请先验证绑定的手机号，验证成功后进行下一步操作
            </p>
            <el-form-item label="手机号" prop="data">
              <el-input v-model.trim="levelForm.data" auto-complete="off" disabled />
            </el-form-item>
            <el-form-item label="验证码" prop="code" class="no-margin">
              <el-input
                v-model.trim="levelForm.code"
                auto-complete="off"
                placeholder="请输入验证码"
              >
                <el-button
                  :disabled="isVerifyPhone"
                  v-if="hadSend"
                  @click="time"
                  class="no-border"
                  size="mini"
                  slot="append"
                >
                  发送验证码
                </el-button>
                <el-button
                  v-if="!hadSend"
                  :disabled="isClick"
                  @click="time"
                  class="no-border"
                  size="mini"
                  slot="append"
                >
                  {{ getCode }}
                </el-button>
              </el-input>
            </el-form-item>
            <p class="warning-right">动态验证码已发送至您的手机，请注意查收</p>
            <p class="warning-link">手机不可用？</p>
          </el-form>
        </div>
      </div>
      <!-- level 第二步 -->
      <div v-if="level === 2 || (level === 1 && step === 2)">
        <div class="content">
          <el-form :model="form" ref="form" :rules="formRules" label-width="85px">
            <el-form-item label="原密码" prop="old_password" v-if="vo.has_password > 0">
              <el-input
                v-model.trim="form.old_password"
                auto-complete="off"
                placeholder="请输入原密码"
              />
            </el-form-item>
            <el-form-item label="新密码" prop="password">
              <el-input
                v-model.trim="form.password"
                auto-complete="off"
                placeholder="请输入新密码"
              />
            </el-form-item>
            <el-form-item label="再次输入" prop="confirm_password">
              <el-input
                v-model.trim="form.confirm_password"
                auto-complete="off"
                placeholder="请再一次输入新密码"
              />
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium" round @click="okHandle">确 定</el-button>
        <el-button size="medium" round @click="cancelHandle">取 消</el-button>
      </div>
    </VhallDialog>
  </div>
</template>

<script>
  import regRule from '@/utils/reg-rule';

  export default {
    name: 'setPassword.vue',
    data() {
      let verifyEnterPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码！'));
        } else if (!regRule['pwd'].exec(value)) {
          callback(new Error('6-30位不包含空格及特殊符号的密码！'));
        } else {
          callback();
        }
      };
      let verifyAgainEnterPwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码！'));
          // this.isReset = true;
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致！'));
          // this.isReset = true;
        } else {
          callback();
          // this.isReset = false;
        }
      };
      return {
        level: null, // 1--修改密码；2--设置密码；
        step: 1, // 当前第n步
        numCode: 60,
        getCode: '',
        isClick: true, //按钮置灰
        timeoutA: null,
        isVerifyPhone: true, //未正确填写手机号，禁用“发送验证码”按钮
        isVerifyMsg: true, //未填写验证码，禁用“确定”按钮
        hadSend: true, //未发送验证码，显示“发送验证码”，发送过就变为“重新发送”
        title: '',
        visible: false,
        vo: {
          dialog: 'phone',
          dialogIsEdit: false
        },
        levelForm: {
          type: 1,
          data: null
        },
        levelFormRules: {},
        form: {
          old_password: null,
          password: null,
          confirm_password: null,
          scene_id: null, // scene_id场景ID：1账户信息-修改密码  4忘记密码-邮箱方式找回 5忘记密码-短信方式找回 9设置密码（密码不存在情况）
          key: null // 场景9非必传，场景1、4、5必传
        },
        formRules: {
          password: [
            { required: true, trigger: 'blur', validator: verifyEnterPwd, min: 6, max: 30 }
          ],
          confirm_password: [
            { required: true, trigger: 'blur', validator: verifyAgainEnterPwd, min: 6, max: 30 }
          ]
        },
        codeKey: null // 验证码key值
      };
    },
    methods: {
      initComp(vo) {
        console.log('当前是否展示！！！', vo);
        vo.has_password = 1;
        this.vo = vo;
        this.title = vo.has_password > 0 ? '修改密码' : '设置密码';
        this.form.scene_id = vo.has_password > 0 ? 1 : 9;
        // 设定当前出现级别
        this.level = vo.has_password > 0 ? 1 : 2;
        if (this.level === 1) {
          if (this.$refs.levelForm) {
            this.$refs.levelForm.resetFields();
          }
          this.levelForm.phone = vo.phone;
          this.isVerifyPhone = false;
        } else {
          if (this.$refs.form) {
            this.$refs.form.resetFields();
          }
        }
        this.visible = true;
      },
      // 倒计时
      time: function () {
        let self = this;
        if (this.numCode == 0) {
          this.isClick = false;
          this.getCode = '重新发送';
          this.numCode = 60;
        } else {
          if (this.numCode == 60) {
            this.sendVerifyMsg();
          }
          this.isClick = true;
          this.getCode = '重新发送(' + this.numCode + ')';
          this.numCode--;
          this.timeoutA = setTimeout(function () {
            self.time();
          }, 1000);
        }
      },
      //获取短信验证码
      sendVerifyMsg() {
        let self = this;
        let params = {
          mobile: this.levelForm.phone,
          type: this.levelForm.type
        };
        this.$fetch('sendCode', params)
          .then(res => {
            if (res && res.code === 200) {
              self.hadSend = false;
            }
          })
          .catch(e => {});
      },
      okHandle() {
        if (this.level === 1) {
          this.validatePhone();
        } else {
          this.validatePwd();
        }
      },
      cancelHandle() {
        // level 1 表示 修改密码（有手机验证）；level 2 表示 设置密码。
        // step  1 表示 第一步； step 2 表示第二步。
        if (this.level === 2) {
          // 单纯设置密码，点击取消，关闭弹出框。
          this.visible = false;
        } else if (this.level === 1 && this.step === 1) {
          // 修改密码，当前处于手机验证这步骤，直接关闭弹出框。
          this.visible = false;
        } else if (this.level === 1 && this.step === 2) {
          // 修改密码，当前处于设置密码这步骤，返回第一步
          this.step = 1;
        }
      },
      validatePhone() {},
      validatePwd() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            let params =
              this.form.scene_id === 1
                ? {
                    old_password: this.form.old_password,
                    scene_id: this.form.scene_id,
                    password: this.form.password,
                    confirm_password: this.form.confirm_password,
                    key: this.codeKey
                  }
                : {
                    scene_id: this.form.scene_id,
                    password: this.form.password,
                    confirm_password: this.form.confirm_password
                  };
            this.$fetch('resetPassword', params)
              .then(res => {
                if (res && res.code === 200) {
                  this.$message({
                    message: '操作成功',
                    showClose: true,
                    // duration: 0,
                    type: 'success',
                    customClass: 'zdy-info-box'
                  });
                  this.visible = false;
                  this.$emit('changeOk');
                }
              })
              .catch(e => {});
          }
        });
      },
      checkPassword(val) {
        return !!regRule['pwd'].exec(val);
      }
    }
  };
</script>

<style lang="less" scoped>
  /deep/.el-dialog__footer {
    text-align: center;
  }
  /deep/.el-button.dialog-btn {
    padding: 4px 24px !important;
  }
  /deep/.el-form-item.no-margin {
    margin-bottom: 0;
  }
  .warning-info {
    text-align: center;
    margin-bottom: 16px;
  }
  .warning-link {
    text-align: right;
  }
  .warning-right {
    text-align: right;
  }
</style>
