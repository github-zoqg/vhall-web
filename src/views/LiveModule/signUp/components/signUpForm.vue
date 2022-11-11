<template>
  <div :class="['signFormBox']" @click.self="closePreview">
    <div :class="['signWrap']">
      <vue-scroll @handle-scroll="handleAutoCloseSelect">
        <div class="entryFormBox">
          <header>
            <img v-if="!baseInfo.cover" src="../images/formHeader.png" alt="">
            <img v-else :class="`signWrap__header-${coverImageMode}`" :src="`${ Env.staticLinkVo.uploadBaseUrl }${ baseInfo.cover }`" alt="">
          </header>
          <article>
            <h1 class="pageTitle"><pre>{{ baseInfo.title }}</pre></h1>
            <p ref="intro" v-if="baseInfo.intro" :class="['pageIntro', overflowStatus == 1 ? 'pageIntroEllipsis' : '']">
              <pre>{{ baseInfo.intro }}</pre>
              <span @click="handleUnfold(2)" class="textTail" v-show="overflowStatus == 1">
                <span class="isEllipsis">... </span>{{ '展开' }}
              </span>
              <span @click="handleUnfold(1)" class="textTail" v-show="overflowStatus == 2">
                <span class="isEllipsis"></span>{{ '收起' }}
              </span>
            </p>
            <div v-if="isSubscribe === 1" class="tabsBox">
              <div :class="['tabs', baseInfo.theme_color]">
                <div :class="{active: tabs==1}" @click="tabs=1"><pre>{{ baseInfo.tab_form_title }}</pre></div>
                <div :class="{active: tabs==2}" @click="tabs=2"><pre>{{ baseInfo.tab_verify_title }}</pre></div>
              </div>
            </div>
            <div v-if="isSubscribe === 2" class="tabsBox">
              <div :class="['tabs', baseInfo.theme_color]">
                <div :class="{active: tabs==2}" @click="tabs=2"><pre>{{ baseInfo.tab_verify_title }}</pre></div>
                <div :class="{active: tabs==1}" @click="tabs=1"><pre>{{ baseInfo.tab_form_title }}</pre></div>
              </div>
            </div>
            <!-- 报名表单 -->
            <template>
              <el-form v-show="tabs === 1" :model="form" class="entryForm" ref="form" :rules="rules">
                <el-form-item
                  v-for="(question, quesIndex) in list"
                  :key="question.id"
                  :prop="question.id + ''"
                  v-show="question.type != 6"
                  :label="question.subject === '隐私声明' ? '' : `${quesIndex < 9 ? `0${ quesIndex + 1 }` : quesIndex + 1}.${question.subject}`"
                >
                  <template slot="label">
                    <pre>{{question.subject === '隐私声明' ? '' : `${quesIndex < 9 ? `0${ quesIndex + 1 }` : quesIndex + 1}.${question.subject}`}}</pre>
                  </template>
                  <!-- 输入框 -->
                  <template
                    v-if="(question.type === 0 && question.default_type !== 4) || question.type === 1"
                  >
                    <VhallInput
                      v-if="question.type == 0 && question.default_type == 2"
                      :maxlength="question.type == 0 ? '' : 60"
                      :show-word-limit="question.type != 0"
                      v-model.number.trim="form[question.id]"
                      type="number"
                      autocomplete="off"
                      :placeholder="placeholderList[question.default_type] || '请输入'"></VhallInput>
                    <VhallInput
                      v-else
                      :maxlength="question.type == 0 ? '' : 60"
                      :show-word-limit="question.type != 0"
                      v-model.trim="form[question.id]"
                      autocomplete="off"
                      :placeholder="placeholderList[question.default_type] || '请输入'"></VhallInput>
                  </template>
                  <!-- 单选 -->
                  <template
                    v-if="(question.default_type === 4) || question.type === 2"
                  >
                    <el-radio-group v-model="form[question.id]">
                      <template v-if="question.default_type === 4">
                        <div>
                          <el-radio label="男" name="gender"></el-radio>
                        </div>
                        <div>
                          <el-radio label="女" name="gender"></el-radio>
                        </div>
                      </template>
                      <template v-else>
                        <div v-for="radioItem in question.items" :key="radioItem.id">
                          <el-radio
                            :label="radioItem.id"
                            :name="question.id + ''"
                          >
                            <pre>{{ radioItem.subject }}</pre>
                          </el-radio>
                          <template v-if="radioItem.type === 1">
                            <VhallInput
                              :maxlength="60"
                              autocomplete="off"
                              show-word-limit
                              placeholder="请输入描述内容"
                              v-show="form[question.id] == radioItem.id"
                              style="margin-top: 10px;"
                              v-model.trim="form[`${question.id}${radioItem.id}`]"
                              class="radioInput"
                            ></VhallInput>
                          </template>
                        </div>
                      </template>
                    </el-radio-group>
                  </template>
                  <!-- 多选 -->
                  <template
                    v-if="question.type === 3"
                  >
                    <el-checkbox-group v-model="form[question.id]">
                      <div v-for="checkItem in question.items" :key="checkItem.id">
                        <el-checkbox
                          :label="checkItem.id"
                          :name="question.id + ''"
                        >
                        <pre>{{ checkItem.subject }}</pre>
                        </el-checkbox>
                        <template v-if="checkItem.type === 1">
                          <VhallInput
                            :maxlength="60"
                            show-word-limit
                            placeholder="请输入描述内容"
                            autocomplete="off"
                            v-show="form[question.id].some(id => id == checkItem.id)"
                            style="margin-top: 10px;"
                            v-model.trim="form[`${question.id}${checkItem.id}`]"
                            class="radioInput"
                          ></VhallInput>
                        </template>
                      </div>
                    </el-checkbox-group>
                  </template>
                  <!-- 下拉 -->
                  <template
                    v-if="question.type === 4"
                  >
                    <el-select ref="autoCloseRefFlag" v-model="form[question.id]" placeholder="请选择">
                      <el-option
                        v-for="option in question.items"
                        :key="option.id"
                        :label="option.subject"
                        :value="option.subject"
                      ><pre>{{option.subject}}</pre></el-option>
                    </el-select>
                  </template>
                  <!-- 地域选择 -->
                  <template
                    v-if="question.type === 5"
                  >
                    <el-row :gutter="20">
                      <el-col :span="question.colNum">
                        <VhallInput v-show="false" v-model.trim="form[question.id]" autocomplete="off" ></VhallInput>
                        <el-select ref="autoCloseRefFlag" v-model="province" @change="regionalChange('province')" placeholder="请选择省份">
                          <el-option
                            v-for="opt in provinces"
                            :key="opt.value"
                            :label="opt.label"
                            :value="opt.value"
                          ></el-option>
                        </el-select>
                      </el-col>
                      <el-col v-if="question.options.show_city == 1" :span="question.colNum">
                        <el-select ref="autoCloseRefFlag" v-model="city" @change="regionalChange('city')" placeholder="请选择市">
                          <el-option
                            v-for="opt in cityList"
                            :key="opt.value"
                            :label="opt.label"
                            :value="opt.value"
                          ></el-option>
                        </el-select>
                      </el-col>
                      <el-col v-if="question.options.show_district == 1" :span="question.colNum">
                        <el-select ref="autoCloseRefFlag" v-model="county" @change="regionalChange('county')" placeholder="请选择区/县">
                          <el-option
                            v-for="opt in countyList"
                            :key="opt.value"
                            :label="opt.label"
                            :value="opt.value"
                          ></el-option>
                        </el-select>
                      </el-col>
                    </el-row>
                  </template>
                </el-form-item>
                <el-form-item class="verifyCodeBox" v-if="isPhoneValidate" :required="false" prop="code">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div id="setCaptcha" class="captcha">
                        <VhallInput  v-model.trim="form.imgCode" autocomplete="off" > </VhallInput>
                        <!-- <p class="errorText" v-show="errorMsgShow">图形码错误</p> -->
                      </div>
                    </el-col>
                    <el-col :span="12">
                      <VhallInput v-model.trim="form.code" auto-complete="off" placeholder="请输入验证码" autocomplete="off" ></VhallInput>
                      <el-button
                        :disabled="time !== 60 || isPreview"
                        class="no-border" size="mini"
                        v-preventReClick
                        @click="getDyCode(true)"
                      >{{ time === 60 ? '发送验证码' : `${time}s` }}</el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item class="provicy-item" v-if="provicy" :prop="provicy.id + ''">
                  <!-- 隐私声明 -->
                  <template>
                    <el-checkbox class="provicy-checkbox" v-model="form[provicy.id]">
                      <pre v-html="provicyText"></pre>
                    </el-checkbox>
                  </template>
                </el-form-item>
                <div class="btnBox">
                  <el-button style="margin-top: 11px;" :disabled="isPreview" :class="[baseInfo.theme_color]" round type="primary" v-preventReClick @click="submitForm">报名</el-button>
                </div>
                <!-- 隐私协议合规 -->
                <privacy-select scene="signForm" compType="2"></privacy-select>
              </el-form>
            </template>

            <!-- 验证 -->
            <template>
              <el-form class="entryForm" v-show="tabs === 2" :model="verifyForm" ref="verifyForm" :rules="verifyRules">
                <el-form-item
                  label="请输入报名时您填写的手机号"
                  prop="phone"
                >
                  <VhallInput type="number" v-model.number.trim="verifyForm.phone" auto-complete="off" placeholder="请输入手机号"></VhallInput>
                </el-form-item>
                <el-form-item class="verifyCodeBox" v-if="isPhoneValidate" prop="code">
                  <el-row :gutter="20">
                    <el-col :span="12">
                      <div id="setCaptcha1" class="captcha">
                        <VhallInput  v-model.trim="verifyForm.imgCode" autocomplete="off" > </VhallInput>
                      </div>
                      <!-- <p class="errorText" v-show="verifyErrorMsgShow">验证失败，请重试</p> -->
                    </el-col>
                    <el-col :span="12">
                      <VhallInput v-model.trim="verifyForm.code" auto-complete="off" placeholder="验证码" autocomplete="off" ></VhallInput>
                      <el-button
                        :disabled="verifyTime !== 60 || isPreview"
                        class="no-border"
                        size="mini"
                        v-preventReClick
                        @click="getDyCode(false)"
                      >{{ verifyTime === 60 ? '发送验证码' : `${verifyTime}s` }}</el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
                <div class="btnBox">
                  <el-button :disabled="isPreview" :class="[baseInfo.theme_color]" round type="primary" v-preventReClick @click="submitVerify">提交</el-button>
                </div>
                <!-- 隐私协议合规 -->
                <privacy-select scene="signForm" compType="2"></privacy-select>
              </el-form>
            </template>
          </article>
        </div>
      </vue-scroll>
      <i v-if="!isEntryForm" class="closeBtn" @click="closePreview">
        <i class="iconfont-v3 saasicon_close"></i>
      </i>
    </div>
  </div>
</template>

<script>
  import Env from "@/api/env";
  import { validPhone } from '@/utils/validate.js'
  import PrivacySelect from '../../../Login/components/privacy-select.vue';
  import { parseImgOssQueryString, cropperImage } from '@/utils/utils.js'
  // import DevicePixelRatio from '@/utils/devicePixelRatio'
  export default {
    components: {
      PrivacySelect
    },
    created() {
      if (this.signUpPageType == 'webinar') {
        this.getWebinarType();
      } else {
        this.isSubscribe = 1
        this.tabs = 1
      }
      this.getBaseInfo();
      this.getQuestionList();
    },
    watch: {
      coverUrl(newVal) {
        if (cropperImage(newVal)) {
          let obj = parseImgOssQueryString(`https:${newVal}`);
          this.coverImageMode = Number(obj.mode) || 3;
        } else {
          this.coverImageMode = 2;
        }
      },
      province(newVal, oldVal) {
        if (newVal != oldVal) {
          this.city = ''
          this.county = ''
        }
      },
      city(newVal, oldVal) {
        if (newVal != oldVal) {
          this.county = ''
        }
      },
      isPhoneValidate: {
        immediate: true,
        handler(newVal) {
          // 根据是否开启短信验证，生成相应的手机号验证规则
          if (newVal) {
            this.verifyRules.phone = {
              required: true,
              validator: validPhone,
              trigger: 'blur'
            }
          } else {
            this.verifyRules.phone = {
              type: 'number',
              required: true,
              message: '请填写正确的手机号码',
              trigger: 'blur'
            }
          }
          // 云盾实例
          if(newVal) {
            this.$nextTick(() => {
              this.callCaptcha('#setCaptcha');
              this.callCaptcha('#setCaptcha1');
            })
          }
        }
      },
      list: {
        deep: true,
        handler(newList) {
          let form = {};
          let rules = {};
          newList && newList.length && newList.forEach(item => {
            form[item.id] = '';
            if (item.type === 3) {
              form[item.id] = [];
              item.items.forEach(opt => {
                if (opt.type === 1) {
                  form[`${item.id}${opt.id}`] = ''
                }
              })
            } else if (item.type === 0 && item.default_type === 2 && this.currentPhone) {
              // 手机号
              form[item.id] = this.currentPhone;
            } else if (item.type === 2) {
              // 单选/多选
              item.items.forEach(opt => {
                if (opt.type === 1) {
                  form[`${item.id}${opt.id}`] = ''
                }
              })
            }

            // 生成验证规则
            if (item.type === 0 && item.default_type === 1) {
              // 姓名
              rules[item.id] = {
                required: !!item.is_must,
                message: '请填写姓名',
                trigger: 'blur'
              }
            } else if (item.type === 0 && item.default_type === 2) {
              // 手机号
              if (this.isPhoneValidate) {
                rules[item.id] = {
                  required: !!item.is_must,
                  validator: validPhone,
                  trigger: 'blur'
                }
              } else {
                rules[item.id] = {
                  type: 'number',
                  required: !!item.is_must,
                  message: '请填写正确的手机号码',
                  trigger: 'blur'
                }
              }
            } else if (item.type === 0 && item.default_type === 4) {
              // 性别
              rules[item.id] = {
                required: !!item.is_must,
                message: '请选择性别',
                trigger: 'change'
              }
            } else if (item.type === 0 && item.default_type === 3) {
              // 邮箱
              rules[item.id] = [
                {
                  required: !!item.is_must,
                  message: '请填写邮箱',
                  trigger: 'blur'
                },
                {
                  type: 'email',
                  message: '请填写正确格式的邮箱',
                  trigger: 'blur'
                }
              ]
            } else if (item.type === 1) {
              // 问答
              rules[item.id] = {
                required: !!item.is_must,
                message: '请填写内容',
                trigger: 'blur'
              }
            } else if (item.type === 2 || item.type === 4) {
              // 单选/下拉
              rules[item.id] = {
                required: !!item.is_must,
                message: '请选择内容',
                trigger: 'change'
              }
            } else if (item.type === 3) {
              // 多选
              rules[item.id] = {
                type: 'array',
                required: !!item.is_must,
                message: '请选择内容',
                trigger: 'change'
              }
            } else if (item.type === 5) {
              // 地域
              rules[item.id] = {
                required: !!item.is_must,
                validator: this.validRegional,
                trigger: 'blur'
              }
            } else if (item.type === 6) {
              // 隐私协议勾选
              rules[item.id] = {
                required: !!item.is_must,
                message: '请先勾选隐私协议',
                trigger: 'change'
              }
            }
          })
          rules.code = {
            required: true,
            validator: this.validCode,
            trigger: 'blur'
          }
          this.form = {
            imgCode: '',
            code: '',
            ...form
          };
          this.rules = {
            ...rules
          };
        }
      }
    },
    computed: {
      cityList() {
        return this.cities[this.province];
      },
      countyList() {
        return this.counties[this.city]
      },
      coverUrl() {
        return `${ this.Env.staticLinkVo.uploadBaseUrl }${ this.baseInfo.cover }`
      }
    },
    data() {
      return {
        Env: Env,
        isEntryForm: this.$route.path.startsWith('/entryform'), // 是否是独立表单
        isPreview: this.$route.path.startsWith('/live/signup') || this.$route.path.startsWith('/special/viewer'),
        isSubscribe: 0,
        colorIndex: 'red',
        tabs: 0,
        province: '',
        city: '',
        county: '',
        provinces: [],
        cities: {},
        counties: {},
        list: [],
        isPhoneValidate: false,
        currentPhone: '',
        errorMsgShow: false,
        showCaptcha: false, // 专门用于 校验登录次数 接口返回 需要显示图形验证码时使用
        captchakey: 'b7982ef659d64141b7120a6af27e19a0', // 云盾key
        mobileKey: '', // 云盾值
        captcha1: null, // 云盾实例
        captcha2: null, // 云盾实例
        time: 60,
        provicy: false,
        provicyText: '',
        placeholderL: ['', ''],
        placeholderList: {
          1: '请输入姓名',
          2: '请输入手机号',
          3: '请输入邮箱',
          5: {
            province: '请选择省份',
            city: '请选择市',
            county: '请选择区/县'
          },
          6: '请输入验证码',
        },
        rules: {},
        form: {},
        answer: {},
        baseInfo: {
          cover: 1,
          "open_link": 0,
          "theme_color": "red",
          "tab_verify_title": "验证",
          "tab_form_title": "用户报名",
          "intro": "",
        },
        verifyForm: {
          phone: '',
          imgCode: ''
        },
        verifyRules: {
          phone: {
            type: 'number',
            required: true,
            message: '请填写正确的手机号码',
            trigger: 'blur'
          },
          code: {
            required: true,
            validator: this.validCode,
            trigger: 'blur'
          }
        },
        verifyErrorMsgShow: false,
        verifyTime: 60,
        colNum: 8,
        regionalId: '',
        isVerifyCodeErr: false,
        overflowStatus: 0, // 文本溢出的状态，0 未溢出；1 溢出未展开；2溢出展开
        signUpPageType: (window.location.href.indexOf('/live/signup/') != -1 || window.location.href.indexOf('/lives/entryform') != -1) ? 'webinar'
        : (window.location.href.indexOf('/special/viewer/') != -1 || window.location.href.indexOf('/special/entryform') != -1) ? 'subject'
        : '',
        webinarOrSubjectId:
          (window.location.href.indexOf('/live/signup/') != -1)
          ? this.$route.params.str :
          (
            (window.location.href.indexOf('/special/viewer/') != -1 || window.location.href.indexOf('/lives/entryform') != -1 || window.location.href.indexOf('/special/entryform') != -1)
            ? (this.$route.params.id || this.$route.params.str) : ''
          ),
        coverImageMode: 2
      };
    },
    mounted() {
      // new DevicePixelRatio('#signFormBox');
    },
    methods: {
      // 设置接口入参，是活动维度 还是 专题维度
      setParamsIdByRoute(params) {
        if (this.signUpPageType === 'webinar') {
          params.webinar_id = this.webinarOrSubjectId
        } else if (this.signUpPageType === 'subject') {
          params.subject_id = this.webinarOrSubjectId
        }
        return params
      },
      handleAutoCloseSelect() {
        this.$refs.autoCloseRefFlag &&  this.$refs.autoCloseRefFlag.forEach(item => {
          item.blur()
        })
      },
      // 获取当前活动类型
      getWebinarType() {
        // webinar/info调整-正常的信息展示使用0
        this.$fetch('getWebinarInfo', this.setParamsIdByRoute({is_rehearsal: 0})).then(res => {
          // webinar_state  1直播 2预约 3结束 4点播 5回放
          this.isSubscribe = res.data.webinar_state == 2 ? 1 : 2
          this.tabs = res.data.webinar_state == 2 ? 1 : 2
        })
      },
      handleUnfold(val) {
        this.overflowStatus = val
      },
      validCode(rule, value, callback) {
        if (this.isVerifyCodeErr) {
          return callback ? callback(new Error('请输入正确的验证码')) : false
        } else {
          callback();
        }
      },
      validRegional(rule, value, callback) {
        if (!this.province) {
          return callback ? callback(new Error('请选择省份')) : false
        } else if (!this.city && this.colNum <= 12) {
          return callback ? callback(new Error('请选择市')) : false
        } else if (!this.county && this.colNum <= 8) {
          return callback ? callback(new Error('请选择区/县')) : false
        } else {
          callback();
        }
      },
      regionalChange(type) {
        if (type == 'county') {
          this.form[this.regionalId] = this.county
        }
        this.$refs['form'].validateField(''+this.regionalId, res => {
          console.log(res)
        })
      },
      closePreview() {
        this.$emit('closeSignUp');
      },
      // 获取表单基本信息
      getBaseInfo() {
        this.$fetch('regFromGet', this.setParamsIdByRoute({})).then(res => {
          if (res.code === 200) {
            this.baseInfo = res.data;
            this.$nextTick(() => {
              this.calculateText()
            })
          }
        }).catch(err => {
          this.$message({
            message: err.msg || `报名表单基本信息失败`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          console.log(err);
        });
      },
      calculateText() {
        const txtDom = this.$refs.intro
        if(!txtDom) return false;
        const twoHeight = 40;
        const curHeight = txtDom.offsetHeight;
        if (curHeight > twoHeight) {
          this.overflowStatus = 1
        }
      },
      getDyCode(isForm) {
        let isPhoneValid = true
        let phone = ''
        if (isForm) {
          const phoneItem = this.list.find(item => item.type === 0 && item.default_type === 2);
          phone = this.form[phoneItem.id];
          // 点击获取短信验证码之前验证手机号
          this.$refs['form'].validateField(''+phoneItem.id, err => {
            if (!err) {
              isPhoneValid = true
            } else {
              isPhoneValid = false
            }
          })
        } else {
          phone = this.verifyForm.phone
          this.$refs['verifyForm'].validateField('phone', err => {
            if (!err) {
              isPhoneValid = true
            } else {
              isPhoneValid = false
            }
          })
        }
        if (!isPhoneValid) {
          return false
        }

        // 获取短信验证码
        if (this.mobileKey) {
          this.$fetch('regSendVerifyCode', {
            ...this.setParamsIdByRoute({}), // 活动ID 或者 专题ID
            phone: phone,
            captcha: this.mobileKey,
          }).then(() => {
            this.countDown(isForm);
          });
        }
      },
      // 倒计时函数
      countDown(isForm) {
        const key = isForm ? 'time' : 'verifyTime'
        if (this[key]) {
          this[key]--;
          setTimeout(() => {
            this.countDown(isForm);
          }, 1000);
        } else {
          this[key] = 60;
          isForm ? this.callCaptcha('#setCaptcha') : this.callCaptcha('#setCaptcha1');
        }
      },
      /**
       * 初始化网易易盾图片验证码
       */
      callCaptcha(id) {
        const captcha = id === '#setCaptcha' ? 'captcha1' : 'captcha2'
        const that = this;
        // eslint-disable-next-line
        initNECaptcha({
          captchaId: that.captchakey,
          element: id,
          mode: 'float',
          onReady(instance) {
            console.log('instance', instance);
          },
          onVerify(err, data) {
            if (data) {
              that.mobileKey = data.validate;
              that.showCaptcha = true;
              console.log('data>>>', data);
              that.errorMsgShow = '';
            } else {
              that[captcha] = '';
              console.log('errr>>>', err);
              that.errorMsgShow = true;
            }
          },
          onload(instance) {
            console.log('onload', instance);
            that[captcha] = instance;
          }
        });
      },
      // 验证 or  提交答案后，逻辑跳转处理
      renderEndToPage() {
        if (this.signUpPageType === 'webinar') {
          this.getWebinarStatus()
        }
      },
       // 获取当前活动状态，如果直播中，跳转到直播间
      getWebinarStatus() {
        this.$fetch('watchInit', this.setParamsIdByRoute({})).then(res => {
          // const type = res.data.webinar.type
          const status = res.data.status
          if (res.code == 200) {
            if (res.data.status == 'live') {
              this.$router.push({
                path: `/live/watch/${this.webinarOrSubjectId || this.$route.params.id || this.$route.params.str}`
              })
            } else {
              // 如果预约或结束，跳转到预约页
              if(this.isEntryForm) {
                this.$router.push({
                  path: `/subscribe/${this.webinarOrSubjectId || this.$route.params.id || this.$route.params.str}`
                })
              } else {
                this.$router.go(0)
              }
            }
          }
        })
      },
      // 提交表单
      submitForm() {
        this.$refs['form'].validate((valid, errObj) => {
          if (valid) {
            this.formHandler()
            const options = {
              ...this.setParamsIdByRoute({}), // 活动ID 或者 专题ID
              form: JSON.stringify(this.answer),
            }
            this.isPhoneValidate && (options.verify_code = this.form.code);
            sessionStorage.getItem("visitor_id") && (options.visit_id = sessionStorage.getItem("visitor_id"))
            this.$route.query.refer && (options.refer = this.$route.query.refer)
            this.$fetch('regAnswerSubmit', options).then(res => {
              if (res.code == 200) {
                res.data.visit_id && sessionStorage.setItem("visitor_id", res.data.visit_id);
                // 报名成功的操作，跳转到直播间
                this.closePreview()
                // 提交答案后，逻辑跳转处理
                this.renderEndToPage()
              }
            }).catch(err => {
              if (err.code == 512809 || err.code == 512570) {
                // 短信验证码验证失败，触发表单验证失败
                // 现在的表单验证码逻辑完全由后端返回结果决定，前端不验证格式
                this.isVerifyCodeErr = true
                this.$refs['form'].validateField('code', err => {
                  // 还原状态
                  this.isVerifyCodeErr = false
                })
              } else if (err.code == 512814) {
                // res.data.visit_id && sessionStorage.setItem("visitor_id", res.data.visit_id);
                // 报名成功的操作，跳转到直播间
                this.closePreview()
                // 提交答案后，逻辑跳转处理
                this.renderEndToPage()
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      submitVerify() {
        this.$refs['verifyForm'].validate((valid) => {
          if (valid) {
            const options = {
              ...this.setParamsIdByRoute({}), // 活动ID 或者 专题ID
              phone: this.verifyForm.phone,
              verify_code: this.verifyForm.code,
            }
            sessionStorage.getItem("visitor_id") && (options.visit_id = sessionStorage.getItem("visitor_id"))
            this.$fetch('regUserCheck', options).then(res => {
              if (res.code == 200) {
                // 如果已经报名
                if (res.data.has_registed == 1) {
                  // 已报名，跳转到直播间
                  this.closePreview()
                  res.data.visit_id && sessionStorage.setItem('visitor_id', res.data.visit_id)
                  // 验证提交答案后，逻辑跳转处理
                  this.renderEndToPage()
                } else {
                  this.$message.warning('请先报名！');
                  this.tabs = 1;
                }
              }
            }).catch(err => {
              if (res.code == 512809 || err.code == 512570) {
                // 短信验证码验证失败，触发表单验证失败
                // 现在的表单验证码逻辑完全由后端返回结果决定，前端不验证格式
                this.isVerifyCodeErr = true
                this.$refs['verifyForm'].validateField('code', res => {
                  // 还原状态
                  this.isVerifyCodeErr = false
                })
              } else {
                this.$message({
                  message: res.msg,
                  showClose: true,
                  // duration: 0,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      // form => answer
      formHandler() {
        const answer = {}
        this.list.forEach(item => {
          if (!this.form[item.id] || this.form[item.id] == []) {
            console.log('空答案')
          } else if (item.type === 0) {
            // 系统题目
            !answer.default && (answer.default = []);
            answer.default.push({
              "id": item.id,
              "content": this.form[item.id] || '',
              "default_type": item.default_type
            })
          } else if (item.type === 1) {
            // 问答
            const opts = item.options && JSON.parse(item.options);
            let options = [];
            opts && opts.type === 7 && (options = {type: 7})
            !answer.text && (answer.text = []);
            answer.text.push({
              "id": item.id,
              "content": this.form[item.id] || '',
              "options": options
            })
          } else if (item.type === 2) {
            // 单选
            !answer.radio && (answer.radio = []);
            const element = item.items.find(elem => elem.id === this.form[item.id]);
            let content = ''
            if (element) {
              content = element.type !== 1
                ? {
                  id: element.id,
                  content: element.subject
                }
                : {
                  id: element.id,
                  content: this.form[`${item.id}${element.id}`] ? this.form[`${item.id}${element.id}`] : '其他'
                }
            }
            answer.radio.push({
              "id": item.id,
              "content": content
            })
          } else if (item.type === 3) {
            // 多选
            !answer.checkbox && (answer.checkbox = []);
            let content = [];
            this.form[item.id].forEach((checkOpt, index) => {
              const element = item.items.find(elem => elem.id === checkOpt);
              if (element) {
                const obj = element.type !== 1
                  ? {
                    id: element.id,
                    content: element.subject
                  }
                  : {
                    id: element.id,
                    content: this.form[`${item.id}${element.id}`] ? this.form[`${item.id}${element.id}`] : '其他'
                  }
                content.push(obj)
              }
            })
            answer.checkbox.push({
              "id": item.id,
              "content": content
            })
          } else if (item.type === 4) {
            // 下拉
            !answer.select && (answer.select = []);
            const element = item.items.find(elem => elem.subject === this.form[item.id]);
            element && answer.select.push({
              "id": item.id,
              "content": {
                "id": element.id,
                "jobTxt": item.subject,
                "content": element.subject
              }
            })
          } else if (item.type === 5) {
            // 地域
            !answer.address && (answer.address = []);
            const provinec = this.provinces.find(ele => ele.value == this.province) || { label: '', value: '' }
            const city = this.cityList.find(ele => ele.value == this.city) || { label: '', value: '' }
            const county = this.countyList.find(ele => ele.value == this.form[item.id]) || { label: '', value: '' }
            answer.address.push({
              "id": item.id,
              "content": `${provinec.label}${city.label}${county.label}`,
              "contentDe": [
                {
                  "id": provinec.value,
                  "content": provinec.label
                },
                {
                  "id": city.value,
                  "content": city.label
                },
                {
                  "id": county.value,
                  "content": county.label
                }
              ]
            })
          } else if (item.type === 6) {
            // 隐私协议勾选
            !answer.statement && (answer.statement = []);
            answer.statement.push({
              "id": item.id,
              "content": this.form[item.id] ? '是' : '否'
            })
          }
        })
        this.answer = answer;
      },
      // 获取地域列表
      getAreaList() {
        this.$fetch('getAreaListJson').then(res => {
          // console.warn(res, '加载地址');
          this.provinces = res.provinces;
          this.cities = res.cities;
          this.counties = res.counties;
        })
      },
      // 获取表单题目列表
      getQuestionList() {
        function compare(property){
          return function(a,b){
            var value1 = a[property];
            var value2 = b[property];
            return value1 - value2;
          };
        }
        this.$fetch('regQListGet', this.setParamsIdByRoute({})).then(res => {
          // 按照 order_num 从小到大排序
          const list = res.data.ques_list.sort(compare('order_num'));
          !this.isPreview && (this.currentPhone = res.data.phone);
          // 手机号验证开启状态
          const phoneItem = list.find(item => (item.type == 0 && item.default_type == 2))
          this.isPhoneValidate = phoneItem.options && JSON.parse(phoneItem.options).open_verify == 1
          // 默认填写手机号
          !this.isPreview && res.data.phone && (this.verifyForm.phone = res.data.phone)
          this.list = list;
          // 地域 options 格式化处理
          this.list.some(item => {
            if (item.type == 5) {
              item.options = JSON.parse(item.options)
              item.colNum = 8
              item.options.show_district == 0 && (item.colNum = 12)
              item.options.show_city == 0 && (item.colNum = 24)
              this.colNum = item.colNum
              this.regionalId = item.id
              return true;
            }
          })
          // this.list.map(item =>)
          // 隐私声明格式处理
          const lastQuestion = this.list[this.list.length - 1];
          console.log(lastQuestion)
          if (lastQuestion.subject === '隐私声明') {
            this.provicy = lastQuestion
            this.provicy && this.privacyFormatter()
          }
          list.some(item => item.type === 5) && this.getAreaList()
        }).catch(err => {
          console.log(err);
        });
      },
      privacyFormatter(){
        let parseOpts = JSON.parse(this.provicy.options)
        const parseOptsFir = parseOpts[0] && JSON.parse(parseOpts[0].options);
        const parseOptsSec = parseOpts[1] && JSON.parse(parseOpts[1].options);

        let text = parseOptsFir.content;
        let matchPrivacy1 = parseOptsFir.color_text.trim() ? text.match(parseOptsFir.color_text) : null;
        if(matchPrivacy1){
          let reg = new RegExp(`(${matchPrivacy1[0]})`);
          text = text.replace(reg, `<a href="${parseOptsFir.url || 'javascript:void(0);'}" target="_blank">$1</a>`);
        }
        let matchPrivacy2 = (parseOptsSec && parseOptsSec.privacy_info.trim()) ? text.match(parseOptsSec.privacy_info) : null;
        if(matchPrivacy2){
          let reg = new RegExp(`(${matchPrivacy2[0]})`, "g");
          text = text.replace(reg, `<a href="${parseOptsSec.privacy_link || 'javascript:void(0);'}" target="_blank">$1</a>`);
        }

        this.provicyText = text;
      },
    }
  };
</script>

<style lang="less" scoped>
  @red: #FB3A32;
  @redBg: #FFEBEB;
  @blue: #3562FA;
  @blueBg: #ebefff;
  @purple: #8d57a4;
  @purpleBg: #F5BDEA;
  .signFormBox {
    position: fixed;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1002;
    display: flex;
    justify-content: center;
    align-items: center;
    &.signFormBoxHid{
      position: static;
      background-color: #fff;
      width: auto;
      height: auto;
    }
    .signWrap {
      overflow-y: auto;
      height: 85%;
      border-radius: 4px;
      background: #fff;
      position: relative;
      z-index: 101;

      &.signWrapHid{
        height: auto;
        box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.15);
      }
      .entryFormBox {
        width: 720px;
        background: #fff;
        padding-bottom: 87px;
      }
      header{
        width: 100%;
        height: 120px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        img{
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .signWrap__header {
          &-1 {
            object-fit: fill;
          }
          &-2 {
            object-fit: cover;
            object-position: left top;
          }
          &-3 {
            object-fit: contain;
            object-position: center;
          }
        }
      }

      .pageTitle{
        font-size: 22px;
        color: #1A1A1A;
        margin: 40px 0 22px;
        text-align: center;
        font-family: @fontMedium;
        line-height: 33px;
      }
      .pageIntro{
        // width: 658px;
        // margin: 20px auto 0;
        color: #666666;
        font-size: 14px;
        line-height: 20px;
        word-break: break-all;
        font-weight: 400;
        position: relative;
        &.pageIntroEllipsis{
          word-break: break-all;
          text-overflow: ellipsis;
          display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
          -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
          -webkit-line-clamp: 2; /** 显示的行数 **/
          overflow: hidden;  /** 隐藏超出的内容 **/
        }
        .textTail{
          position: absolute;
          bottom: 0px;
          right: 4px;
          cursor: pointer;
          background-color: #fff;
          color: #3562FA;
          .isEllipsis{
            color: #666666;
          }
        }
      }
      article{
        padding: 0 75px;
      }
      .closeBtn{
        width: 24px;
        height: 24px;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 28px;
        color: #fff;
        position: absolute;
        right: 16px;
        top: 16px;
        font-style: normal;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        .saasicon_close{
          font-size: 14px;
        }
      }
      .tabsBox{
        width: 100%;
        margin: 43px auto 20px;
        display: flex;
        justify-content: center;
      }
      .tabs{
        width: 446px;
        overflow: hidden;
        >div{
          width: 50%;
          float: left;
          border-radius: 4px;
          border: 1px solid #E6E6E6;
          line-height: 40px;
          height: 40px;
          text-align: center;
          transition: all .2s linear;
          cursor: pointer;
          &:nth-child(1){
            border-right: 0px none;
            border-radius: 4px 0px 0px 4px;
          }
          &:nth-child(2){
            border-left: 0px none;
            border-radius: 0px 4px 4px 0px;
          }
          &.active{
            border: 1px solid @red;
            background: @redBg;
            color: @red;
          }
        }
        &.red{
          .active{
            border: 1px solid @red;
            background: @redBg;
            color: @red;
          }
        }
        &.blue{
          .active{
            border: 1px solid @blue;
            background: @blueBg;
            color: @blue;
          }
        }
        &.purple{
          .active{
            border: 1px solid@purple;
            background: @purpleBg;
            color:@purple;
          }
        }
      }
      /deep/ .el-form-item__label{
        float: none;
      }
      /deep/ .el-checkbox-group{
        width: 100%;
        padding-left: 0px;
        .el-checkbox{
          display: block;
        }
        /deep/ .el-checkbox__label{
          width: 100%;
        }
      }
      .el-select{
        width: 100%;
      }
      /deep/ .el-radio-group{
        width: 100%;
        padding-left: 0px;
        .el-radio{
          display: block;
        }
      }
      .noFull {
        width: calc(100% - 30px);
      }
    }
    .provicy-item {
      margin-bottom: 24px!important;
      /deep/ .el-form-item__content {
        line-height: normal;
      }
    }
    /deep/ .provicy-checkbox {
      display: flex;
      align-items: flex-start;
      line-height: 40px;
      width: 100%;
      white-space: normal;
      font-size: 14px;
      color: #666;
      font-weight: 400;
      .el-checkbox__input {
        padding-top: 3px;
      }
      // .el-checkbox__label {
      //   width: calc(100% - 16px);
      //   padding-left: 20px;
      //   position: absolute;
      // }
      /deep/ .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #666;
      }
      p{
        /deep/ a{
          color: #3562FA;
          &:link{
            color: #3562FA;
          }
          &:active{
            color: #3562FA;
          }
        }
      }
    }
    .entryForm {
      // 云盾滑块背景
      // /deep/ .yidun.yidun--light .yidun_slider:hover {
      //   background-color: #FB3A32;
      // }
      /deep/ .el-form-item{
        margin-bottom: 28px;
      }
      // 必填form表单 * 颜色
      /deep/ .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label{
        position: relative;
        &:before {
          content: '*';
          color: #FB3A32;
          margin-right: 4px;
          position: absolute;
          left: -10px;
        }
      }
      // 错误提示文本颜色
      /deep/ .el-form-item__error {
        color: #FB3A32;
      }
      // 输入框输入状态边框颜色
      /deep/ .el-input__inner:focus{
        border-color: #999;
      }
      // 输入框正常状态边框颜色
      /deep/ .el-input__inner {
        border-color: #ccc;
        height: 40px;
        color: #1a1a1a;
        &[maxlength='60'] {
          padding-right: 60px!important;
        }
      }
      // 输入框hover状态边框颜色
      /deep/ .el-input__inner:hover {
        border-color: #999;
      }
      // 输入框格式校验失败的边框颜色
      /deep/ .el-form-item.is-error .el-input__inner {
        border-color: #FB3A32;
        &::-webkit-input-placeholder { /* WebKit browsers */
          color: #FB3A32;
        }

        &::-moz-placeholder { /* Mozilla Firefox 19+ */
          color: #FB3A32;
        }

        &:-ms-input-placeholder { /* Internet Explorer 10+ */
          color: #FB3A32;
        }
      }
      // form-item label 样式重置
      /deep/ .el-form-item__label {
        float: none;
        // height: 40px;
        display: block;
        line-height: 22px;
        text-align: left;
        font-size: 14px;
        padding-bottom: 10px;
      }
      // 单选/多选 选项样式重置
      /deep/ .el-radio-group .el-radio, .el-checkbox-group .el-checkbox {
        display: flex;
        align-items: flex-start;
        // line-height: 40px;
        color: #1a1a1a;
        white-space: normal;
        .el-checkbox__input,.el-radio__input {
          padding-top: 2px;
          &.is-checked+.el-radio__label, &.is-checked+.el-checkbox__label{
            color: #FB3A32;
          }
          &.is-checked .el-radio__inner, &.is-checked .el-checkbox__inner{
            border-color: #FB3A32!important;
            background: #FB3A32!important;
          }
          .el-radio__inner{
            width: 16px;
            height: 16px;
            &:after{
              width: 6px;
              height: 6px;
            }
          }
        }
        .el-checkbox__label,.el-radio__label {
          white-space: normal;
          padding-left: 10px;
          line-height: 20px;
          font-size: 14px;
        }
      }
      /deep/ .el-checkbox__inner{
        width: 16px;
        height: 16px;
        &:after{
          top: 2px;
          left: 5px;
        }
      }
      /deep/ .el-radio__input {
        padding-top: 3px;
      }
      .el-radio-group, .el-checkbox-group {
        padding-left: 0px;
        >div {
          padding: 10px 0 10px;
        }
      }
      // 滚动条样式调整
      /deep/ .el-select {
        .el-input__inner {
          &::-webkit-input-placeholder { /* WebKit browsers */
            color: #1a1a1a;
          }
          &::-moz-placeholder { /* Mozilla Firefox 19+ */
            color: #1a1a1a;
          }
          &:-ms-input-placeholder { /* Internet Explorer 10+ */
            color: #1a1a1a;
          }
        }
        .el-input__suffix .el-icon-arrow-up {
          color: #1a1a1a;
        }
      }
      .btnBox {
        display: flex;
        justify-content: center;
        padding-top: 12px;
      }
      .el-button {
        padding: 9px 55px;
      }
      .verifyCodeBox {
        .el-input__inner {
          padding-right: 98px;
        }
        .el-button {
          position: absolute;
          right: 13px;
          top: 3px;
          height: 34px;
          width: 90px;
          padding: 0;
          background: #DEDEDE;
          border-radius: 2px;
          color: #666666;
          font-size: 13px;
          &:hover{
            background: #DEDEDE;
          }
        }
        // 云盾样式重置,注释部分为设计稿样式，暂时不删除，有备无患
        .captcha{
        //   /deep/ .yidun .yidun_control {
        //     border-radius: 4px!important;
        //     border-color: #ccc;
        //     background: #fff;
        //     overflow: hidden;
        //     .yidun_slide_indicator {
        //       border-radius: 4px!important;
        //     }
           /deep/.yidun_tips {
              color: #999999;
              line-height: 38px!important;
              .yidun_tips__text {
                vertical-align: initial;
              }
            }
            /deep/.yidun_slider {
              .yidun_slider__icon {
                background-image: url(../images/icon-slide1.png) !important;
                background-size: 28px 20px;
                background-position: center;
                margin-top: -5px;
              }
              &:hover {
                // background-color: #FB3A32;
                .yidun_slider__icon {
                  background-image: url(../images/icon-slide.png) !important;
                }
              }
            }
        //     &.yidun_control--moving {
        //       background-color: #E2E2E2;
        //       border-color: #FB3A32;
        //       .yidun_slide_indicator {
        //         border-color: #FB3A32;
        //         background-color: #E2E2E2;
        //       }
        //     }

          // }
          /deep/ .yidun--success {
            // .yidun_control--moving {
            //   background-color: #F0F1FE!important;
            //   .yidun_slide_indicator {
            //     background-color: #F0F1FE!important;
            //   }
            // }
            .yidun_control {
              .yidun_slider__icon {
                background-image: url(../images/icon-succeed.png)!important;
              }
              .yidun_slider {
                .yidun_slider__icon {
                  background-image: url(../images/icon-succeed.png);
                  background-size: 28px 20px;
                  background-position: center;
                }
                &:hover {
                  // background-color: #FB3A32;
                  .yidun_slider__icon {
                    background-image: url(../images/icon-succeed.png);
                    background-size: 28px 20px;
                    background-position: center;
                  }
                }
              }
            }
          }
        }
        // .yidun.yidun--light.yidun--success.yidun--jigsaw {
        //   .yidun_control .yidun_slider {
        //     background-color: #3562FA;
        //   }
        //   .yidun_slide_indicator {
        //     border-color: #3562FA;
        //     background-color: #E2E2E2;
        //   }
        // }
        .yidun.yidun--light{
          .yidun_feedback{
            background-position: 0px -240px;
            height: 30px;
          }
          .yidun_refresh{
            background-position: 0px -339px;
          }
        }
      }
    }
    .entryForm .blue {
      background: @blue!important;
      border-color: @blue!important;
      &:hover {
        background: @blue!important;
        border-color: @blue!important;
      }
    }
    .entryForm .red {
      background: @red!important;
      border-color: @red!important;
      &:hover {
        background: @red!important;
        border-color: @red!important;
      }
    }
    .entryForm .purple {
      background: @purple!important;
      border-color: @purple!important;
      &:hover {
        background: @purple!important;
        border-color: @purple!important;
      }
    }
    pre{
      font-family: @fontMedium;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
</style>
<style lang="less">
  .el-select-dropdown__list .el-select-dropdown__item {
    max-width: 608px!important;
    width: 100%;
    line-height: 30px !important;
    height: initial !important;
    span{
      white-space: normal;
      word-wrap: break-word;
      word-break: break-all;
      line-height: 20px;
      display: inline-block;
      padding-top: 4px;
    }
    pre{
      font-family: @fontMedium;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
</style>
