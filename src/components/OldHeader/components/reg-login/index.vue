<!-- Page页面 -->
<template>
  <div class="vhsaas-reg-login">
    <el-dialog
      title=""
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      custom-class="vhsaas-reg-login-dialog"
      width="380px"
      @closed='closeDialogHandler'>
      <div class="vhsaas-reg-login__main">
        <!-- 登录 -->
        <div v-if="tag != 3" class="vhsaas-login-box">
          <p class="vhsaas-box-title">
            <span :class="tag == 2 ? 'active' : ''" @click="changeTagHandler(2)">{{ $t('验证码登录')}}</span>
            <em>|</em>
            <span :class="tag == 1 ? 'active' : ''" @click="changeTagHandler(1)">{{ $t('密码登录')}}</span>
          </p>
          <!-- 验证码登录 -->
          <el-form v-if="tag == 2" key="loginTwoForm" ref="ruleForm" :model="ruleForm"  :rules="ruleFormRules"  label-width="0">
            <!-- 账户相关 -->
            <el-form-item prop="usernames" :class="['vhsaas-box__name', {'vhsaas-box__msg__error' : isShowPhoneErr}]">
              <el-input v-model.trim="ruleForm.usernames" clearable :maxlength="11" placeholder="请输入手机号" @focus="smsLoginErrMsg = ''"></el-input>
            </el-form-item>
            <!-- 图片验证码 -->
            <el-form-item>
              <div id="captcha" class="vhsaas-yundun-captcha"></div>
            </el-form-item>
            <!-- 短信验证码 -->
            <el-form-item prop="captchas" class="vhsaas-wrap-code">
              <el-input v-model.trim="ruleForm.captchas" clearable type="captcha" :maxlength="6" placeholder="动态验证码"  @focus="smsLoginErrMsg = ''"></el-input>
              <span type="danger" :disabled="buttonControl == 'disabled'" :class="['vhsaas-code-btn show-border', buttonControl]" @click.stop.prevent="getCaptha">
                {{sendLoginMsgDisabled ? (time + '秒后重发') : '获取验证码'}}
              </span>
               <!-- TODO 可能注释掉 -->
              <span v-if="smsLoginErrMsg != ''" class="vhsaas-form-error">{{smsLoginErrMsg}}</span>
            </el-form-item>
            <!-- 其它 -->
            <el-form-item>
              <div :class="['vhsaas-box__link', 'vhsaas-box__msg__error', {'vhsaas-box__link__error' : captchaError}]">
                <el-checkbox v-model="accountChecked" class="vhsaas-box-checkbox"></el-checkbox>
                <span class="vhsaas-box__auto vhsaas-box__checked" @click="accountChecked = !accountChecked">自动登录</span>
                <!-- <span class="vhsaas-box__auto vhsaas-box__forget">
                  <a :href="forgetUrl" target="_blank">忘记密码</a>
                </span> -->
              </div>
              <el-button class="vhsaas-red-button length-max vhsaas-login-btn" @click="telLogin">登录</el-button>
              <a href="javascript:void(0)" class="vhsaas-reg__link" @click="changeTagHandler(3)">立即注册</a>
            </el-form-item>
            <!-- 第三方登录 -->
            <div class="vhsaas-third-layout">
              <p class="vhsaas-third-remark">其他登录方式</p>
              <div class="vhsaas-login__way">
                <div class="vhsaas-login__third">
                  <a
                    :href="qqPath"
                    class="vhsaas-login__qq"
                    title="QQ登录"
                  ></a>
                  <a
                    :href="wxPath"
                    class="vhsaas-login__wechat"
                    title="微信登录"
                  ></a>
                </div>
              </div>
            </div>
          </el-form>
          <!-- 密码登录 -->
          <el-form v-if="tag == 1" key="loginOneForm" ref="ruleForm" :model="ruleForm" :rules="ruleFormRules"  label-width="0">
            <!-- 账户相关 -->
            <el-form-item prop="username" :class="['vhsaas-box__name', {'vhsaas-box__msg__error' : accError}]">
              <el-input v-model.trim="ruleForm.username" clearable placeholder="请输入手机号/邮箱" @focus="loginErrMsg = ''"></el-input>
            </el-form-item>
            <!-- 图片验证码 -->
            <el-form-item v-show="photoCpathaShow" :class="loginErrMsg != '' ? 'vhsaas-box__msg__error__bottom' : ''">
              <div id="photoCaptcha" class="vhsaas-yundun-captcha"></div>
               <!-- TODO 可能注释掉 -->
              <span v-if="loginErrMsg != ''" class="vhsaas-form-error">{{loginErrMsg}}</span>
            </el-form-item>
            <!-- 请输入登录密码 -->
            <el-form-item class="vhsaas-box__pwd" prop="password">
              <PwdInput
                v-model.trim="ruleForm.password"
                clearable
                :placeholder="!isLoginPwdFocus ? '请输入登录密码' : ''"
                :maxlength="30"
                auto-complete="off"
                onkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]/g,'')"
                style="ime-mode:disabled"
                :isPasswordVisible="!loginPwdShow"
                @focus="handleFocus('isLoginPwdFocus')"
                @blur="handleBlur('isLoginPwdFocus')">
                <span slot="suffix" class="closePwd" @click="loginPwdType">
                  <icon class="icon"  v-show="loginPwdShow" icon-class="saaseyeclose_huaban1" style="display: inline-block;font-size:14px;margin-right:5px;cursor: pointer;"></icon>
                  <icon class="icon"  v-show="!loginPwdShow" icon-class="saasicon-eye"  style="display: inline-block;font-size:12px;margin-right:5px;cursor: pointer;"></icon>
                </span>
              </PwdInput>
              <!-- <el-input v-if="loginPwdShow" v-model.trim="ruleForm.password" clearable :maxlength="20" placeholder="请输入登录密码" type="password" @focus="loginErrMsg = ''" onkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]/g,'')">
                <i slot="suffix" style="font-size:14px;margin-right:5px;cursor: pointer;" class="iconfont saaseyeclose_huaban1" @click="loginPwdShow = false"></i>
              </el-input>
              <el-input v-else v-model.trim="ruleForm.password" clearable :maxlength="20" placeholder="请输入登录密码" @focus="loginErrMsg = ''" onkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]/g,'')">
                <i slot="suffix" style="font-size:12px;margin-right:5px;cursor: pointer;" class="iconfont saasicon-eye" @click="loginPwdShow = true"></i>
              </el-input> -->
            </el-form-item>
            <!-- 其它 -->
            <el-form-item>
              <div :class="['vhsaas-box__link', {'vhsaas-box__link__error' : mailError, 'vhsaas-box__msg__error': photoCpathaShow}]">
                <el-checkbox v-model="accountChecked" class="vhsaas-box-checkbox"></el-checkbox>
                <span class="vhsaas-box__auto vhsaas-box__checked" @click="accountChecked = !accountChecked">自动登录</span>
                <span class="vhsaas-box__auto vhsaas-box__forget">
                  <a :href="forgetUrl"  target="_blank">忘记密码</a>
                </span>
              </div>
              <el-button class="vhsaas-red-button length-max vhsaas-login-btn" @click="checkLoginAccount">登录</el-button>
              <a href="javascript:void(0)" :class="['vhsaas-reg__link', {'vhsaas-default': !photoCpathaShow}]" @click="changeTagHandler(3)">立即注册</a>
            </el-form-item>
            <!-- 第三方登录 -->
            <div class="vhsaas-third-layout">
              <p class="vhsaas-third-remark">其他登录方式</p>
              <div class="vhsaas-login__way">
                <div class="vhsaas-login__third">
                  <a
                    :href="qqPath"
                    class="vhsaas-login__qq"
                    title="QQ登录"
                  ></a>
                  <a
                    :href="wxPath"
                    class="vhsaas-login__wechat"
                    title="微信登录"
                  ></a>
                </div>
              </div>
            </div>
          </el-form>
        </div>
        <!-- 注册 -->
        <div v-else class="vhsaas-reg-box">
          <p class="vhsaas-box-title reg">
            <span class="active no-border">{{ $t('注册新用户')}}</span>
          </p>
          <el-form  key="regForm" ref="regForm" :model="regForm" :rules="regFormRules">
            <el-form-item prop="phone" :class="['vhsaas-box__phone', {'vhsaas-box__msg__error' : regPhoneFlag}]">
              <el-input v-model.trim="regForm.phone" placeholder="请输入手机号" :maxlength="11" clearable auto-complete="off"></el-input>
             <!--  <div v-if="regPhoneErr != ''" class="vhsaas-form-error">{{regPhoneErr}}</div> -->
            </el-form-item>
            <el-form-item id="captcha-box">
              <div id="regCaptcha"  class="vhsaas-yundun-captcha"></div>
            </el-form-item>
            <!-- 短信密码 -->
            <el-form-item prop="code" :class="['vhsaas-wrap-code', {'vhsaas-box__msg__error' : captchaError || smsRegErrMsg}]">
              <el-input v-model.trim="regForm.code"  clearable type="captcha" :maxlength="6" placeholder="动态验证码"></el-input>
              <span type="danger" :disabled="regBtnControl == 'disabled'" :class="['vhsaas-code-btn show-border', regBtnControl]" @click.stop.prevent="getRegCaptha">
                {{sendRegMsgDisabled ? (regTime + '秒后重发') : '获取验证码'}}
              </span>
              <!-- <div v-if="smsRegErrMsg != ''" class="vhsaas-form-error">{{smsRegErrMsg}}</div> -->
            </el-form-item>
            <!-- 注册密码 -->
            <el-form-item :class="['vhsaas-box__pwd', 'vhsaas-box__msg__error']"  prop="password">
              <PwdInput
                v-model.trim="regForm.password"
                clearable
                :placeholder="!isPasswordFocus ? '设置密码（选填，6-30个字符）' : ''"
                :maxlength="30"
                auto-complete="off"
                onkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]/g,'')"
                style="ime-mode:disabled"
                :isPasswordVisible="!regPwdShow"
                @focus="handleFocus('isPasswordFocus')"
                @blur="handleBlur('isPasswordFocus')">
                <span slot="suffix" class="closePwd" @click="passWordType">
                  <icon class="icon" icon-class="saaseyeclose_huaban1" v-show="regPwdShow"></icon>
                  <icon class="icon" icon-class="saasicon-eye" v-show="!regPwdShow"></icon>
                </span>
              </PwdInput>
              <!-- <el-input v-if="regPwdShow" v-model.trim="regForm.password" clearable :maxlength="20" placeholder="请设置登录密码" type="password" @focus="regErrMsg = ''" onkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]/g,'')">
                <i slot="suffix" style="font-size:14px;margin-right:5px;cursor: pointer;" class="iconfont saaseyeclose_huaban1" @click="regPwdShow = false"></i>
              </el-input>
              <el-input v-else v-model.trim="regForm.password" clearable :maxlength="20" placeholder="请设置登录密码" @focus="regErrMsg = ''" onkeyup="this.value=this.value.replace(/[\u4E00-\u9FA5]/g,'')">
                <i slot="suffix" style="font-size:12px;margin-right:5px;cursor: pointer;" class="iconfont saasicon-eye" @click="regPwdShow = true"></i>
              </el-input> -->
              <!-- 去登录 -->
              <a href="javascript:void(0)" class="vhsaas-reg__login" @click="changeTagHandler(1)">去登录</a>
            </el-form-item>
            <div :class="['login-btn', {'vhsaas-box__msg__error' : mailError}]">
              <!--  :disabled="!checked" -->
              <el-button class="vhsaas-red-button length-max vhsaas-reg-btn" round @click="registerHandler">立即注册</el-button>
            </div>
            <el-form-item class="auto-login register-checked">
              <el-checkbox v-model="checked">我已阅读并同意<a href="https://e.vhall.com/home/vhallapi/serviceterms" target="_blank" rel="noopener noreferrer">服务条款及隐私协议</a></el-checkbox>
            </el-form-item>
        </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script src="./js/reg-login.js"></script>
<style lang="less" scoped>
  /* 通用部分 */
  @iconpath: 'images';
  @font-color-title: #333333;
  @font-color-title-active: #fb3a32;
  @font-weight-normal: 400;
  a {
    color: #999999;
    cursor: pointer;
    &:visited {
      color: #999999;
    }
    &:hover {
      color: #3562fa;
    }
    &:active {
      color: #3562fa;
    }
  }
  .vhsaas-box-title {
    margin-bottom: 20px;
    &.reg {
      margin-bottom: 26px;
    }
    span {
      cursor: pointer;
      display: inline-block;
      vertical-align: top;
      height: 30px;
      font-size: 22px;
      font-weight: @font-weight-normal;
      color: @font-color-title;
      line-height: 30px;
      padding-bottom: 4px;
      &.active {
        color: @font-color-title-active;
        border-bottom: 2px solid @font-color-title-active;
        border-radius: 1px;
        &.no-border {
          border-bottom: 0;
          font-size: 22px;
          font-weight: 400;
          color: #333333;
          line-height: 30px;
        }
      }
    }
    em {
      display: inline-block;
      vertical-align: top;
      padding: 0 16px;
      font-size: 16px;
      font-weight: @font-weight-normal;
      color: @font-color-title;
      line-height: 22px;
      margin-top: 4px;
    }
  }
  .vhsaas-box-type {
    width: 196px;
    height: 36px;
    background: #F0F0F0;
    border-radius: 4px;
    margin: 0 auto 20px auto;
    span {
      cursor: pointer;
      display: inline-block;
      vertical-align: center;
      font-size: 14px;
      font-weight: 600;
      line-height: 20px;
      padding: 6px 16px;
      height: 20px;
      border-radius: 4px;
      margin: 2px 2px;
      color: #1A1A1A;
      background: #F0F0F0;
      &:last-child {
        margin: 2px 2px 2px 0;
      }
      &.active {
        color: #FB3A32;
        background: #ffffff;
      }
    }
  }
  /deep/div.vhsaas-reg-login-dialog {
    max-height: 526px;
    height: auto;
    padding-bottom: 24px;
    border-radius: 4px;
    .el-dialog__body {
      padding: 16px 40px 0 40px;
      /*height: 442px;*/
    }
  }
  .vhsaas-reg-login__main {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .el-form {
    display: flex;
    flex-direction: column;
    height: calc(100% - 56px);
  }
  /deep/div.el-form-item {
    margin-bottom: 16px;
    &.vhsaas-box__msg__error__bottom {
      margin-bottom: 8px;
    }
    &.vhsaas-box__msg__error {
      margin-bottom: 24px;
    }
    &.is-success.vhsaas-box__msg__error {
      margin-bottom: 16px;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  /deep/div.el-form-item__error {
    padding-top: 3px;
    font-weight: 400;
    color: #FB3A32;
    line-height: 17px;
  }
  /deep/input.el-input__inner {
    padding: 0 11px;
  }
  .vhsaas-form-error {
    font-size: 12px;
    font-weight: 400;
    color: #FB3A32;
    line-height: 12px;
    display: block;
    margin-top: 6px;
  }
  .length-max {
    width: 100%;
    height: 40px;
    border-radius: 20px;
  }
  button.el-button.vhsaas-red-button {
    background: #FB3A32;
    color: #FFFFFF;
    border: 1px solid #FB3A32;
    &:hover {
      color: #fff;
      background: #FC615B;
      border: 1px solid #FC615B;
    }
    &:focus {
      color: #fff;
      background: #FB3A32;
      border: 1px solid #FB3A32;
    }
    &:active {
      background: #E2332C;
      border: 1px solid #E2332C;
    }
    &.is-disabled {
      background: #F09D99;
      border: 1px solid #F09D99;
      cursor: not-allowed;
      color: #fff;
      &:hover, &:focus, &:active {
        background: #F09D99;
        border: 1px solid #F09D99;
      }
    }
  }
  .vhsaas-box__link {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    line-height: 20px;
    margin-top: 8px;
    margin-bottom: 30px;
    &.vhsaas-box__link__error {
      margin-top: 24px;
    }
    &.vhsaas-box__msg__error {
      margin-bottom: 16px;
    }
    .vhsaas-box__auto {
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
      &.vhsaas-box__checked {
        cursor: pointer;
      }
    }
    .vhsaas-box__forget {
      margin-left: auto;
    }
    .vhsaas-box-checkbox {
      margin-right: 8px;
    }
  }
  .vhsaas-reg__link {
    margin: 14px auto 0 auto;
    &.vhsaas-default {
      /*margin: 50px auto 0 auto;*/
      margin: 12px auto 0 auto;
    }
    display: block;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: #3562FA;
    line-height: 20px;
  }
  .vhsaas-wrap-code {
    position: relative;
    /deep/span.el-input__suffix {
      margin-right: 80px;
    }
  }
  .vhsaas-code-btn {
    position: absolute;
    right: 10px;
    top: 0;
    border-radius: 4px;
    border: none;
    outline: none;
    height: 40px;
    font-size: 14px;
    font-weight: 400;
    line-height: 40px;
    text-align: right;
    &.disabled {
      cursor: not-allowed;
      color: #999999;
    }
    &.start {
      cursor: pointer;
      color: #fb3a32;
    }
    &.pending {
      cursor: not-allowed;
      color: #999999;
    }
    &.show-border {
      width: 103px;
      height: 34px;
      background: #F0F0F0;
      border-radius: 4px;
      text-align: center;
      line-height: 34px;
      right: 0;
      &.disabled {
        color: #1A1A1A;
      }
      &.start {
        background: #FB3A32;
        color: #ffffff;
      }
      &.pending {
        color: #1A1A1A;
      }
    }
  }
  /* 登录 */
  .vhsaas-login-box {
    height: 100%;
    .vhsaas-wrap-code {
     margin-bottom: 0;
    }
    .vhsaas-box__pwd {
      margin-bottom: 0;
    }
    .vhsaas-third-layout {
      margin-top: auto;
    }
    .vhsaas-third-remark {
      margin-top: 8px;
      text-align: center;
      height: 17px;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      line-height: 17px;
    }
    .vhsaas-login__way {
      margin-top: 8px;
    }
    .vhsaas-login__third {
      text-align: center;
      line-height: 30px;
      a {
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        width: 30px;
        height: 30px;
        cursor: pointer;
      }
    }
    .vhsaas-login__qq {
      background: url("@{iconpath}/qq@2x.png") center center no-repeat;
      background-size: 100% 100%;
      margin-right: 16px;
      &:hover {
        background: url("@{iconpath}/qq_hover@2x.png") center center no-repeat;
        background-size: 100% 100%;
      }
    }
    .vhsaas-login__wechat {
      background: url("@{iconpath}/wechat@2x.png") center center no-repeat;
      background-size: 100% 100%;
      &:hover {
        background: url("@{iconpath}/wechat_hover@2x.png") center center no-repeat;
        background-size: 100% 100%;
      }
    }
  }
  /* 注册 */
  .vhsaas-reg-box {
    /deep/.el-checkbox__input.is-checked+.el-checkbox__label {
      font-size: 14px;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
    }
    a {
      color: #5CB8FF;
    }
    .vhsaas-reg__login {
      position: absolute;
      right: 0;
      top: 46px;
      font-size: 14px;
      font-weight: 400;
      color: #3562FA;
      &:hover {
        color: #3562fa;
      }
      line-height: 20px;
    }
    .login-btn {
      margin-top: 48px;
      margin-bottom: 8px;
      &.vhsaas-box__msg__error {
        margin-top: 32px;
      }
    }
  }
  .register-checked {
    /deep/.el-form-item__content {
      line-height: 20px;
    }
  }
  /deep/.yidun.yidun--light .yidun_slider .yidun_slider__icon{
    margin-top: -5px;
  }
  /deep/.yidun.yidun--light .yidun_tips__text{
    vertical-align: top;
  }
  /deep/.yidun-fallback__tip{
    color: #999;
  }
  /deep/.el-checkbox {
    color: #999999;
  }
  /deep/.el-checkbox__label {
    font-weight: 400;
  }
  /deep/.yidun.yidun--light.yidun--float.yidun--jigsaw {
    width: 100%!important;
  }
  /deep/.vhsaas-yundun-captcha .yidun.yidun--light .yidun_top__right {
    line-height: normal;
  }
  /deep/ input.el-input__inner {
    border: none;
    border-radius: unset;
    border-bottom: 1px solid #DCDFE6;
    padding: 0 0;
    &:hover {
      border-color: #999;
    }
    &:focus {
      border-color: #999;
    }
    &::-webkit-input-placeholder { /* WebKit, Blink, Edge */
      color: #999999;
    }
    &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color: #999999;
    }
    &::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: #999999;
    }
    &:-ms-input-placeholder { /* Internet Explorer 10-11 */
      color: #999999;
    }
  }
</style>
