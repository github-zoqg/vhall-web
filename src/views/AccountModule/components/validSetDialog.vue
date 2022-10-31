<template>
  <VhallDialog :title="title" :visible.sync="visible" class="valid-set-dialog" width="400px">
    <div class="content">
      <el-form :model="form" ref="form" :rules="formRules" label-width="80px">
        <p class="info" v-show="showVo.step === 1">
          {{
            showVo.executeType === 'pwd'
              ? pwdTitle
              : showVo.executeType === 'phone'
              ? phoneTitle
              : emailTitle
          }}
        </p>
        <el-form-item
          label="邮箱地址"
          key="email"
          prop="email"
          v-if="showVo.executeType === 'email' && showVo.step === 1"
        >
          <el-input
            v-model.trim="form.email"
            auto-complete="off"
            placeholder="请输入邮箱地址"
            disabled
            :maxlength="30"
          />
        </el-form-item>
        <el-form-item
          label="手机号"
          key="phone"
          prop="phone"
          v-if="showVo.executeType !== 'email' && showVo.step === 1"
        >
          <el-input
            v-model.trim="form.phone"
            auto-complete="off"
            placeholder="请输入手机号"
            disabled
            :maxlength="30"
          />
        </el-form-item>
        <el-form-item
          label="图形码"
          v-show="showVo.step === 1 && showVo.executeType !== 'email'"
          id="captcha-box"
        >
          <div id="setCaptcha" class="captcha">
            <el-input v-model.trim="form.imgCode"></el-input>
          </div>
          <p class="errorText" v-show="errorMsgShow">图形码错误</p>
        </el-form-item>
        <el-form-item label="动态密码" key="code" prop="code" v-if="showVo.step === 1">
          <div class="inputCode">
            <el-input
              v-model.trim="form.code"
              auto-complete="off"
              style="width: 141px"
              :maxlength="6"
            ></el-input>
            <span
              v-if="showVo.executeType === 'email' && form.email"
              @click="time == 60 && getDyCode()"
              class="isLoginActive"
            >
              {{ time == 60 ? '获取验证码' : `${time}秒后发送` }}
            </span>
            <span
              @click="time == 60 && getDyCode()"
              :class="showCaptcha ? 'isLoginActive' : ''"
              v-else
            >
              {{ time == 60 ? '获取验证码' : `${time}秒后发送` }}
            </span>
          </div>
          <p class="codeTitle" v-if="sendText">{{ sendText }}</p>
        </el-form-item>

        <!-- <el-form-item label="动态密码" key="code"  prop="code" v-if="showVo.step === 1">
          <el-input v-model.trim="form.code" auto-complete="off" placeholder="请输入动态密码" :maxlength="6">
            <el-button type="text" class="no-border" size="mini" slot="append" @click="getDyCode()"
                       v-preventReClick
                       :class="showCaptcha ? 'isLoginActive' : ''"
                       :disabled="isDisabledClick">
              {{ time === 60 ? '获取验证码' : `${time}s 后发送` }}
            </el-button>
          </el-input>
          <p v-if="sendText" class="no-use">{{sendText}}</p>
        </el-form-item> -->
        <el-form-item
          label="邮箱地址"
          key="new_email"
          prop="new_email"
          v-if="showVo.executeType === 'email' && (showVo.step === 2 || showVo.is_null)"
        >
          <el-input
            v-model.trim="form.new_email"
            auto-complete="off"
            placeholder="请输入邮箱地址"
            :maxlength="30"
          />
        </el-form-item>
        <el-form-item
          label="手机号"
          key="new_phone"
          prop="new_phone"
          v-if="showVo.executeType === 'phone' && (showVo.step === 2 || showVo.is_null)"
        >
          <el-input
            v-model.trim="form.new_phone"
            auto-complete="off"
            placeholder="请输入手机号"
            :maxlength="30"
          />
        </el-form-item>
        <el-form-item
          label="图形码"
          v-if="showVo.executeType === 'phone' && (showVo.step === 2 || showVo.is_null)"
          id="captcha-box"
        >
          <div id="setCaptcha1" class="captcha">
            <el-input v-model.trim="form.imgCode1"></el-input>
          </div>
          <p class="errorText" v-show="errorMsgShow1">图形码错误</p>
        </el-form-item>
        <el-form-item
          label="动态密码"
          key="new_code"
          prop="new_code"
          v-if="showVo.executeType !== 'pwd' && (showVo.step === 2 || showVo.is_null)"
        >
          <div class="inputCode">
            <el-input
              v-model.trim="form.new_code"
              auto-complete="off"
              style="width: 141px"
              :maxlength="6"
            ></el-input>
            <span
              @click="time1 == 60 && getDyCode1()"
              :class="showCaptcha1 && isValidaCode ? 'isLoginActive' : ''"
              v-if="showVo.executeType === 'phone'"
            >
              {{ time1 == 60 ? '获取验证码' : `${time1}秒后发送` }}
            </span>
            <span
              @click="time1 == 60 && getDyCode1()"
              :class="isValidaEmail ? 'isLoginActive' : ''"
              v-if="showVo.executeType === 'email'"
            >
              {{ time1 == 60 ? '获取验证码' : `${time1}秒后发送` }}
            </span>
          </div>
          <p class="codeTitle" v-if="sendText1">{{ sendText1 }}</p>
        </el-form-item>
        <!--
        <el-form-item label="动态密码" key="new_code"  prop="new_code" v-if="showVo.executeType !== 'pwd' && (showVo.step === 2 || showVo.is_null)">
          <el-input v-model.trim="form.new_code" auto-complete="off" placeholder="请输入动态密码"  :maxlength="6">
            <el-button  type="text" class="no-border" size="mini" slot="append"
                       v-preventReClick
                       @click="getDyCode1()"
                       :class="showCaptcha1 ? 'isLoginActive' : ''"
                       :disabled="isDisabledClick1">{{ time1 === 60 ? '获取验证码' : `${time1}s 后发送` }}</el-button>
          </el-input>
          <p v-if="sendText1" class="no-use">{{sendText1}}</p>
        </el-form-item> -->
        <el-form-item
          label="原密码"
          key="old_pwd"
          prop="old_pwd"
          v-if="showVo.executeType === 'pwd' && showVo.step === 2 && !showVo.is_null"
        >
          <pwd-input
            type="password"
            v-model.trim="form.old_pwd"
            auto-complete="off"
            placeholder="输入原密码"
            :maxlength="30"
          ></pwd-input>
        </el-form-item>
        <el-form-item
          label="新密码"
          key="pasword"
          prop="password"
          v-if="showVo.executeType === 'pwd' && showVo.step === 2"
        >
          <pwd-input
            type="password"
            v-model.trim="form.password"
            auto-complete="off"
            placeholder="输入新密码"
            :class="form.password && form.password.length >= 6 ? 'btn-relative no-border' : ''"
            :maxlength="30"
          >
            <template slot="append" v-if="form.password && form.password.length >= 6">
              {{ pwdLevel }}
            </template>
          </pwd-input>
        </el-form-item>
        <el-form-item
          label="再输一次"
          key="new_password"
          prop="new_password"
          v-if="showVo.executeType === 'pwd' && showVo.step === 2"
        >
          <pwd-input
            type="password"
            v-model.trim="form.new_password"
            auto-complete="off"
            placeholder="再输入一次"
            :maxlength="30"
          ></pwd-input>
        </el-form-item>
        <el-form-item label="" class="link__to" v-if="showVo.step === 1">
          <a :href="openLink" target="_blank" @click="reportData">
            {{ showVo.executeType === 'email' ? '邮箱不可用？' : '手机不可用？' }}
          </a>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer">
      <el-button
        class="dialog-btn"
        type="primary"
        round
        size="medium"
        v-show="showVo.executeType !== 'pwd' && showVo.step === 1"
        v-preventReClick
        @click="changePhoneOrEmailStep"
      >
        下一步
      </el-button>
      <el-button
        class="dialog-btn"
        type="primary"
        round
        size="medium"
        v-show="showVo.executeType === 'pwd'"
        v-preventReClick
        @click="changePwdStep"
      >
        确定
      </el-button>
      <el-button
        class="dialog-btn"
        round
        size="medium"
        v-show="showVo.executeType === 'pwd'"
        v-preventReClick
        @click="cancelPwdStep"
      >
        取消
      </el-button>
      <el-button
        class="dialog-btn"
        type="primary"
        round
        size="medium"
        v-show="showVo.executeType !== 'pwd' && showVo.step === 2"
        v-preventReClick
        @click="sendBindHandle"
      >
        立即绑定
      </el-button>
    </span>
  </VhallDialog>
</template>

<script>
  import Cookies from 'js-cookie';
  import env from '@/api/env';
  import PwdInput from './pwdInput.vue';
  import { sessionOrLocal } from '@/utils/utils';
  import regRule from '@/utils/reg-rule';

  export default {
    name: 'validSetDialog.vue',
    components: {
      PwdInput
    },
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
      let validatePhone = (rule, value, callback) => {
        this.isValidaCode = false;
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else {
          if (!regRule['mobile'].test(value)) {
            callback(new Error('请输入正确的手机号'));
          } else {
            this.isValidaCode = true;
            callback();
          }
        }
      };
      let validateEmail = (rule, value, callback) => {
        this.isValidaEmail = false;
        if (value === '') {
          callback(new Error('请输入邮箱'));
        } else {
          if (!/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(value)) {
            callback(new Error('请输入正确的邮箱格式'));
          } else {
            this.isValidaEmail = true;
            callback();
          }
        }
      };
      return {
        pwdTitle: '为了保证您的账号安全，修改密码请先验证绑定的手机号，验证成功后进行下一步操作',
        phoneTitle: '为了保证您的账号安全，修改手机号前请先验证已绑定的手机号',
        emailTitle: '为了保证您的账号安全，修改邮箱前请先验证已绑定的邮箱',
        showVo: {
          executeType: null, //当前弹出层类型
          step: null, // 当前步骤
          is_null: true // true表示未设置过
        },
        visible: false,
        isValidaCode: false,
        isValidaEmail: false,
        validate: {
          type: 1, // 发送类型： 1手机；2邮箱
          data: null, // 根据type值不同 分别传手机号、邮箱
          validate: null, // 图形动态密码数据
          scene_id: null // 1账户信息-修改密码  2账户信息-修改密保手机 3账户信息-修改关联邮箱 4忘记密码-邮箱方式找回 5忘记密码-短信方式找回 6提现绑定时手机号验证 7快捷方式登录 8注册-动态密码
        },
        form: {
          old_pwd: null,
          password: null, // 目标-密码
          new_password: null,
          email: null,
          new_email: null, // 目标-邮箱
          phone: null,
          new_phone: null, // 目标-手机号
          code: null,
          new_code: null, // 目标-动态密码
          imgCode: null,
          imgCode1: null
        },
        formRules: {
          password: [
            { required: true, trigger: 'blur', validator: verifyEnterPwd, min: 6, max: 30 }
          ],
          new_password: [
            { required: true, trigger: 'blur', validator: verifyAgainEnterPwd, min: 6, max: 30 }
          ],
          old_pwd: [
            { required: true, trigger: 'blur', validator: verifyEnterPwd, min: 6, max: 30 }
          ],
          code: [{ required: true, message: '请输入动态密码', trigger: 'blur' }],
          new_phone: [
            { required: true, min: 6, max: 30, validator: validatePhone, trigger: 'blur' }
          ],
          new_email: [
            { required: true, min: 1, max: 30, validator: validateEmail, trigger: 'blur' }
          ],
          new_code: [{ required: true, message: '请输入动态密码', trigger: 'blur' }]
        },
        downTimer: null,
        time: 60, // 倒计时
        isDisabledClick: false,
        showCaptcha: false, // 专门用于 校验登录次数 接口返回 需要显示图形动态密码时使用
        captchakey: 'b7982ef659d64141b7120a6af27e19a0', // 云盾key
        mobileKey: '', // 云盾值
        captcha: null, // 云盾本身
        codeKey: null, // 短信、邮箱动态密码校验接口返回key值
        errorMsgShow: '',
        downTimer1: null,
        time1: 60, // 倒计时
        isDisabledClick1: false,
        showCaptcha1: false, // 专门用于 校验登录次数 接口返回 需要显示图形动态密码时使用
        captchakey1: 'b7982ef659d64141b7120a6af27e19a0', // 云盾key
        mobileKey1: '', // 云盾值
        captcha1: null, // 云盾本身
        codeKey1: null, // 短信、邮箱动态密码校验接口返回key值
        errorMsgShow1: '',
        sendText: ``,
        sendText1: ``
      };
    },
    computed: {
      title() {
        return this.getScenedTitle().title;
      },
      openLink() {
        return env.staticLinkVo.kf;
      },
      pwdLevel() {
        // 密码强度分为：弱/一般/强
        // （1）弱：密码长度6位，纯数字或者纯字母，如123456、111111、aaaaaa  纯6个
        // （2）一般：密码长度6位及以上的，数字+字母组合；
        // （3）一般：密码长度7位及以上的，纯数字或者纯字母组合，如1111111
        // （4）强：密码长度7位及以上的，数字+特殊符号+（大/小写字母）
        let Regex = [/\d/g, /[a-z]/g, /[A-Z]/g, /[^a-zA-Z0-9]/g]; //字符正则数字正则其它正则
        let pwd = this.form.password;
        if (pwd.length < 6) {
          return '';
        }
        // 获取字符类别数量
        let num = pwd.match(Regex[0]) != null ? 1 : 0,
          minCount = pwd.match(Regex[1]) != null ? 1 : 0,
          maxCount = pwd.match(Regex[2]) != null ? 1 : 0,
          oCount = pwd.match(Regex[3]) != null ? 1 : 0;
        if (num + minCount + maxCount === 1) {
          // 纯数字 or 纯字母数据
          return pwd.length === 6 ? '弱' : '一般';
        }
        if (num === 1 && (minCount === 1 || maxCount === 1) && oCount === 1) {
          // 数字 + （大/小）字母 + 特殊字符
          return pwd.length >= 7 ? '强' : '弱';
        } else {
          return '一般';
        }
      }
    },
    methods: {
      // 获取不同场景下sceneId 和 标题
      getScenedTitle() {
        // 1 表示提供标题
        let title = '',
          scene_id = '';
        if (this.showVo.executeType === 'pwd' && this.vo && this.vo.phone) {
          title = !(this.vo && this.vo.has_password > 0) ? '设置密码' : '修改密码';
          scene_id = 1;
        } else if (this.showVo.executeType === 'phone' && this.vo && this.vo.phone) {
          title = '修改密保手机';
          scene_id = 2;
        } else if (this.showVo.executeType === 'phone' && this.vo && !this.vo.phone) {
          title = '设置密保手机';
          scene_id = 2;
        } else if (this.showVo.executeType === 'email' && this.vo && this.vo.email) {
          title = '修改关联邮箱';
          scene_id = 3;
        } else if (this.showVo.executeType === 'email' && this.vo && !this.vo.email) {
          title = '设置关联邮箱';
          scene_id = 3;
        } else {
          title = '';
          scene_id = '';
        }
        return {
          title: title,
          scene_id: scene_id
        };
      },
      reportData() {
        let refer = '';
        const userId = JSON.parse(sessionOrLocal.get('userId'));
        if (this.title == '修改密码') {
          refer = 6;
        } else if (this.title == '修改密保手机') {
          refer = 7;
        } else if (this.title == '修改关联邮箱') {
          refer = 8;
        }
        this.$vhall_paas_port({
          k: 100017,
          data: {
            business_uid: this.userId,
            user_id: this.userId,
            s: '',
            refer: refer,
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
      },
      // 场景适用： 设置密码、修改密码、修改手机号-第一步、修改邮箱-第一步
      getDyCode() {
        if (this.isDisabledClick) {
          return;
        }
        // scene_id场景ID：1账户信息-修改密码  2账户信息-修改密保手机 3账户信息-修改关联邮箱 4忘记密码-邮箱方式找回
        // 5忘记密码-短信方式找回 6提现绑定时手机号验证 7快捷方式登录 8注册-动态密码
        // 获取短信动态密码
        let data = this.form.phone;
        let flag = false;
        if (this.showVo.executeType !== 'email') {
          if (!this.mobileKey) {
            this.$message({
              message: `图形验证码校验失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            flag = false;
          } else {
            flag = true;
            data = this.form.phone;
          }
        } else {
          // 验证邮箱
          flag = true;
          data = this.form.email;
        }
        if (flag) {
          let params = {
            type: this.showVo.executeType !== 'email' ? 1 : 2, // 1手机  2邮箱
            data: data,
            validate: this.mobileKey, // 图形码key值
            scene_id: this.getScenedTitle().scene_id
          };
          this.$fetch('sendCode', this.$params(params))
            .then(res => {
              this.isDisabledClick = true;
              if (this.downTimer) {
                window.clearTimeout(this.downTimer);
              }
              // this.sendText = `动态验证码已发送至您的${this.showVo.executeType !== 'email' ? '手机' : '邮箱'},请注意查收`;
              this.countDown();
            })
            .catch(res => {
              console.log(res);
              this.$message({
                message: res.msg || '动态密码发送失败',
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
              // 发送验证码失败，图形验证码重新生成
              this.$nextTick(() => {
                this.mobileKey = '';
                this.callCaptcha();
              });
              // this.sendText = ``;
            });
        }
      },
      // 场景使用： 设置手机号、修改手机号-第二步、修改邮箱-第二步、设置邮箱
      getDyCode1() {
        if (this.isDisabledClick1) {
          return;
        }
        // scene_id场景ID：1账户信息-修改密码  2账户信息-修改密保手机 3账户信息-修改关联邮箱 4忘记密码-邮箱方式找回
        // 5忘记密码-短信方式找回 6提现绑定时手机号验证 7快捷方式登录 8注册-验证码
        let data = this.form.new_phone;
        let flag = false;
        if (this.showVo.executeType !== 'email') {
          if (!regRule['mobile'].test(this.form.new_phone)) {
            this.$message({
              message: '手机号校验失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            flag = false;
          } else if (!this.mobileKey1) {
            this.$message({
              message: '图形验证码校验失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            flag = false;
          } else {
            flag = true;
            data = this.form.new_phone;
          }
        } else {
          // 验证邮箱
          flag = true;
          data = this.form.new_email;
        }
        if (flag) {
          let params = {
            type: this.showVo.executeType !== 'email' ? 1 : 2, // 1手机  2邮箱
            data: data,
            validate: this.mobileKey1, // 图形码key值
            scene_id: this.getScenedTitle().scene_id
          };
          this.$fetch('sendCode', this.$params(params))
            .then(res => {
              this.isDisabledClick1 = true;
              if (this.downTimer1) {
                window.clearTimeout(this.downTimer1);
              }
              // this.sendText1 = `动态验证码已发送至您的${this.showVo.executeType !== 'email' ? '手机' : '邮箱'},请注意查收`;
              this.countDown1();
            })
            .catch(res => {
              console.log(res);
              // this.sendText1 = ``;
              this.$message({
                message: res.msg || '动态密码发送失败',
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
              // 发送验证码失败，图形验证码重新生成
              this.$nextTick(() => {
                this.mobileKey1 = '';
                this.callCaptcha(1);
              });
            });
        }
      },
      // 验证码倒计时（ 场景使用： 设置密码、修改密码、修改手机号-第一步、修改邮箱-第一步）
      countDown() {
        this.isDisabledClick = this.time > 1;
        if (this.time > 1) {
          this.time--;
          this.downTimer = setTimeout(() => {
            this.countDown();
          }, 1000);
        } else {
          // 倒计时结束
          this.time = 60;
          this.isDisabledClick = false;
          this.$nextTick(() => {
            this.callCaptcha();
          });
          // this.sendText = '';
        }
      },
      // 验证码倒计时（ 场景使用： 设置手机号、修改手机号-第二步、修改邮箱-第二步、设置邮箱）
      countDown1() {
        this.isDisabledClick1 = this.time1 > 1;
        if (this.time1 > 1) {
          this.time1--;
          this.downTimer1 = setTimeout(() => {
            this.countDown1();
          }, 1000);
        } else {
          this.time1 = 60;
          this.isDisabledClick1 = false;
          this.$nextTick(() => {
            this.callCaptcha(1);
          });
          // this.sendText1 = '';
        }
      },
      // 下一步按钮，校验 验证码，成功后进入下一步。 （场景使用： 修改手机、修改关联邮箱）
      changePhoneOrEmailStep() {
        this.$refs.form.validate(valid => {
          if (valid) {
            // 第一步，验证码，获取验证码是否正确得到key，验证通过，继续下一步
            let params = {
              type: this.showVo.executeType === 'phone' ? 1 : 2,
              data: this.showVo.executeType === 'phone' ? this.form.phone : this.form.email,
              code: this.form.code,
              scene_id: this.getScenedTitle().scene_id
            };
            this.$fetch('codeCheck', params)
              .then(async res => {
                if (res.data.check_result > 0) {
                  this.codeKey = res.data.key || '';
                  // 验证码第一步，继续下一步
                  this.showVo.step = 2;
                  await this.$nextTick(() => {
                    this.callCaptcha('1');
                  });
                } else {
                  this.$message({
                    message: res.msg || '验证失败，无法操作',
                    showClose: true,
                    // duration: 0,
                    type: 'error',
                    customClass: 'zdy-info-box'
                  });
                }
              })
              .catch(res => {
                console.log(res);
                this.$message({
                  message: res.msg || '验证失败，无法操作',
                  showClose: true,
                  // duration: 0,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
              });
          }
        });
      },
      // 立即绑定（场景使用： 设置手机号、修改手机号-第二步、设置邮箱、修改邮箱-第二步）
      sendBindHandle() {
        this.$refs.form.validate(valid => {
          if (valid) {
            // 先验证验证码结果，再实际绑定为新手机号 或 新邮箱
            let params = {
              type: this.showVo.executeType === 'phone' ? 1 : 2,
              data: this.showVo.executeType === 'phone' ? this.form.new_phone : this.form.new_email,
              code: this.form.new_code,
              scene_id: this.getScenedTitle().scene_id
            };
            this.$fetch('codeCheck', params)
              .then(res => {
                if (res.data.check_result > 0) {
                  this.codeKey1 = res.data.key || '';
                  if (this.title === '修改密保手机') {
                    this.$vhall_paas_port({
                      k: 100786,
                      data: {
                        business_uid: this.$parent.userId,
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
                  if (this.title === '修改关联邮箱') {
                    this.$vhall_paas_port({
                      k: 100787,
                      data: {
                        business_uid: this.$parent.userId,
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
                  this.bindSave();
                } else {
                  this.$message({
                    message: '验证结果不成功，无法操作',
                    showClose: true,
                    // duration: 0,
                    type: 'error',
                    customClass: 'zdy-info-box'
                  });
                }
              })
              .catch(res => {
                console.log(res);
                this.$message({
                  message: res.msg || '验证失败，无法操作',
                  showClose: true,
                  // duration: 0,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
              });
          }
        });
      },
      // 实际绑定（场景使用： 设置手机号、修改手机号-第二步、设置邮箱、修改邮箱-第二步）
      bindSave() {
        let params = {
          type: this.showVo.executeType === 'phone' ? 1 : 2,
          account: this.showVo.executeType === 'phone' ? this.form.new_phone : this.form.new_email,
          code: this.form.new_code,
          scene_id: this.getScenedTitle().scene_id,
          key: this.codeKey1
        };
        // 确认绑定新功能
        this.$fetch('bindInfo', params)
          .then(res => {
            this.$message({
              message: '绑定成功',
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.visible = false;
            this.showCaptcha = false;
            this.showCaptcha1 = false;
            // 刷新回显数据
            this.$emit('changeOk');
          })
          .catch(res => {
            console.log(res);
            this.$message({
              message: res.msg || '绑定失败',
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      },
      // 确定按钮（场景使用： 设置密码第一、二步，修改密码第一、二步）
      changePwdStep() {
        this.$refs.form.validate(valid => {
          if (valid) {
            // 验证原有手机号
            if (this.showVo.step === 1) {
              // 第一步，验证码，获取验证码是否正确得到key，验证通过，继续下一步
              // 场景：1账户信息-修改密码  2账户信息-修改密保手机 3账户信息-修改关联邮箱 4忘记密码-邮箱方式找回 5忘记密码-短信方式找回
              let params = {
                type: 1, // 密码修改-默认手机号校验
                data: this.form.phone,
                code: this.form.code,
                scene_id: this.getScenedTitle().scene_id
              };
              this.$fetch('codeCheck', params)
                .then(res => {
                  if (this.title === '修改密码') {
                    this.$vhall_paas_port({
                      k: 100785,
                      data: {
                        business_uid: this.$parent.userId,
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
                  if (res.data.check_result > 0) {
                    this.codeKey = res.data.key || '';
                    // 验证码第一步，继续下一步
                    this.showVo.step = 2;
                  } else {
                    this.$message({
                      message: res.msg || '验证失败，无法操作',
                      showClose: true,
                      // duration: 0,
                      type: 'error',
                      customClass: 'zdy-info-box'
                    });
                  }
                })
                .catch(res => {
                  console.log(res);
                  this.$message({
                    message: res.msg || '验证失败，无法操作',
                    showClose: true,
                    // duration: 0,
                    type: 'error',
                    customClass: 'zdy-info-box'
                  });
                  // 验证码错误，重置验证码
                });
            } else {
              // 第二步密码保存 => 存储密码  scene_id场景ID：1账户信息-修改密码  4忘记密码-邮箱方式找回 5忘记密码-短信方式找回 9设置密码（密码不存在情况）
              console.log('changePwdStep ---- 保存密码');
              let params = {
                old_password: this.form.old_pwd || '',
                password: this.form.password,
                confirm_password: this.form.new_password,
                scene_id: !(this.vo && this.vo.has_password > 0) ? 9 : 1,
                key: this.codeKey
              };
              this.$fetch('resetPassword', this.$params(params))
                .then(res => {
                  this.$message({
                    message: '操作成功',
                    showClose: true,
                    // duration: 0,
                    type: 'success',
                    customClass: 'zdy-info-box'
                  });
                  this.visible = false;
                  this.showCaptcha = false;
                  this.showCaptcha1 = false;
                  // 跳转登录页
                  sessionOrLocal.clear();
                  sessionOrLocal.clear('localStorage');
                  // 清除cookies
                  Cookies.remove('gray-id');
                  // 监听消息变化
                  this.$router.push({ path: '/login' });
                })
                .catch(res => {
                  console.log(res);
                  this.$message({
                    message: res.msg || '操作失败',
                    showClose: true,
                    // duration: 0,
                    type: 'error',
                    customClass: 'zdy-info-box'
                  });
                });
            }
          }
        });
      },
      // 取消修改密码
      cancelPwdStep() {
        // 关闭弹出框
        this.visible = false;
        this.showCaptcha = false;
        this.showCaptcha1 = false;
        /* if(this.showVo.step === 2) {
        // 返回上一步
        this.showVo.step = 1;
      } else {
        // 关闭弹出框
        this.visible = false;
      }*/
      },
      initComp(vo, btnType) {
        // btnType => pwd 密码；email 邮箱； phone手机号
        // 场景ID：1账户信息-修改密码  2账户信息-修改密保手机 3账户信息-修改关联邮箱 4忘记密码-邮箱方式找回 5忘记密码-短信方式找回 6提现绑定时手机号验证 7快捷方式登录 8注册-验证码 9设置密码（密码不存在情况）
        // vo = {
        //   has_password: 0,
        //   phone: '183****0764',
        //   email: '18*****0764@sina.cn'
        // };
        this.vo = vo;
        this.showVo.executeType = btnType;
        if (!vo) {
          this.$confirm(`信息获取失败，请您检查网络或重新登录`, '提示', {
            confirmButtonText: '我知道了',
            cancelButtonText: '',
            customClass: 'zdy-message-box',
            lockScroll: false,
            cancelButtonClass: 'zdy-confirm-cancel-hide'
          })
            .then(() => {})
            .catch(() => {});
          return;
        } else if (btnType === 'pwd' && vo && !vo.phone) {
          // 无密码
          this.$confirm(`为了保证您的账号安全，请您先绑定手机号`, '提示', {
            confirmButtonText: '我知道了',
            cancelButtonText: '',
            customClass: 'zdy-message-box',
            lockScroll: false,
            cancelButtonClass: 'zdy-confirm-cancel-hide'
          })
            .then(() => {})
            .catch(() => {});
          return;
        } else if (btnType === 'pwd' && vo && vo.phone) {
          // 密码，并且手机号不为空
          this.showVo.step = 1;
          this.showVo.is_null = !(vo && vo.has_password > 0);
        } else if (btnType === 'phone' && vo && vo.phone) {
          // 手机号，并且手机号不为空
          this.showVo.step = 1;
          this.showVo.is_null = false;
        } else if (btnType === 'phone' && vo && !vo.phone) {
          // 手机号，并且手机号为空
          this.showVo.step = 2;
          this.showVo.is_null = true;
        } else if (btnType === 'email' && vo && vo.email) {
          // 邮箱，并且邮箱不为空
          this.showVo.step = 1;
          this.showVo.is_null = false;
        } else if (btnType === 'email' && vo && !vo.email) {
          // 邮箱，并且邮箱为空
          this.showVo.step = 2;
          this.showVo.is_null = true;
        } else {
          return;
        }
        this.visible = true;
        this.$nextTick(() => {
          if (this.$refs.form) {
            this.$refs.form.resetFields();
          }
          // 为表单赋值-初始化
          this.form.phone = vo.phone || '';
          this.form.email = vo.email || '';
          this.form.code = '';
          this.form.new_code = '';
          this.form.new_password = '';
          this.form.password = '';
          this.form.old_pwd = '';
          this.form.new_email = '';
          this.form.new_phone = '';
          this.form.imgCode = '';
          this.form.imgCode1 = '';
          this.showCaptcha = false;
          this.showCaptcha1 = false;
          this.isValidaEmail = false;
          this.isValidaCode = false;
          if (this.downTimer) {
            window.clearTimeout(this.downTimer);
            this.isDisabledClick = false;
            this.time = 60;
          }
          if (this.downTimer1) {
            window.clearTimeout(this.downTimer1);
            this.isDisabledClick1 = false;
            this.time1 = 60;
          }
          if (this.showVo.executeType !== 'email') {
            this.$nextTick(() => {
              this.callCaptcha();
            });
          }
          if (
            this.showVo.executeType === 'phone' &&
            (this.showVo.step === 2 || this.showVo.is_null)
          ) {
            this.$nextTick(() => {
              this.callCaptcha(1);
            });
          }
        });
      },
      /**
       * 初始化网易易盾图片验证码
       */
      callCaptcha(val = '') {
        try {
          const that = this;
          let catp = document.getElementById(`setCaptcha${val}`);
          if (!catp) {
            that.form[`captcha${val}`] = '';
            console.log('errr>>>', err);
            that.form[`errorMsgShow${val}`] = true;
            return;
          }
          // eslint-disable-next-line
          initNECaptcha({
            captchaId: this.captchakey,
            element: `#setCaptcha${val}`,
            mode: 'float',
            onReady(instance) {
              console.log('instance', instance);
            },
            onVerify(err, data) {
              if (data) {
                that[`mobileKey${val}`] = data.validate;
                that[`showCaptcha${val}`] = true;
                console.log('data>>>', data);
                that[`errorMsgShow${val}`] = '';
              } else {
                that.form[`captcha${val}`] = '';
                console.log('errr>>>', err);
                that.form[`errorMsgShow${val}`] = true;
              }
            },
            onload(instance) {
              console.log('onload', instance);
              that[`captcha${val}`] = instance;
            }
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .valid-set-dialog {
    /deep/.el-dialog__footer {
      padding: 0 32px 24px 32px;
    }
  }
  .errorText {
    color: #e2332c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
  /deep/.el-input__inner {
    height: 40px !important;
  }
  .el-input-group__append {
    /deep/.el-button.is-disabled,
    .el-button.is-disabled:focus,
    .el-button.is-disabled:hover {
      background: transparent;
      color: #666666;
    }
  }
  .info {
    margin-bottom: 16px;
    line-height: 20px;
    color: #1a1a1a;
  }
  /deep/.el-form-item.link__to {
    text-align: right;
    margin-bottom: 11px;
    margin-top: -20px;
    a {
      color: #3562fa;
      &:hover {
        color: #3562fa;
      }
      &:active {
        color: #3562fa;
      }
    }
  }
  .no-use {
    color: #1384ff;
  }
  .el-input-group__append,
  .el-input-group__prepend {
    .el-button {
      /deep/span {
        color: #666666;
      }
    }
  }

  .inputCode {
    height: 40px;
    line-height: 40px;
    width: 256px;
    border: 1px solid #ccc;
    border-radius: 2px;
    /deep/.el-input__inner {
      border: none;
      height: 40px;
    }
    span {
      display: inline-block;
      width: 113px;
      height: 38px;
      text-align: center;
      line-height: 38px;
      background: #f2f2f2;
      color: #666666;
      vertical-align: top;
      cursor: not-allowed;
      &.isLoginActive {
        background: #fc5659;
        color: #fff;
        cursor: pointer;
      }
    }
    // i {
    //   font-weight: normal;
    //   color: #ff0000;
    // }
  }
  #captcha-box {
    .captcha {
      // 云盾样式重置
      /deep/.yidun_tips {
        color: #999999;
        line-height: 38px !important;
        .yidun_tips__text {
          vertical-align: initial;
        }
      }
      /deep/.yidun_slider {
        .yidun_slider__icon {
          background-image: url(./images/icon-slide1.png) !important;
          background-size: 28px 20px;
          background-position: center;
          margin-top: -5px;
        }
        &:hover {
          .yidun_slider__icon {
            background-image: url(./images/icon-slide.png) !important;
          }
        }
      }
      /deep/ .yidun--success {
        .yidun_control {
          .yidun_slider__icon {
            background-image: url(./images/icon-succeed.png) !important;
          }
          .yidun_slider {
            .yidun_slider__icon {
              background-image: url(./images/icon-succeed.png);
              background-size: 28px 20px;
              background-position: center;
            }
            &:hover {
              .yidun_slider__icon {
                background-image: url(./images/icon-succeed.png);
                background-size: 28px 20px;
                background-position: center;
              }
            }
          }
        }
      }
      .yidun.yidun--light {
        .yidun_feedback {
          background-position: 0px -240px;
          height: 30px;
        }
        .yidun_refresh {
          background-position: 0px -339px;
        }
      }
    }
  }
</style>
