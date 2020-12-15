<template>
  <div class="signFormBox">
    <div class="signWrap">
      <div class="entryFormBox">
        <header>
          <img :src="`${ Env.staticLinkVo.uploadBaseUrl }sys/img_url/c7/b4/c7b43630a8699dc2608f846ff92d89d0.png`" alt="">
        </header>
        <article>
          <h1 class="pageTitle">{{ baseInfo.title }}</h1>
          <p class="pageIntro">{{ baseInfo.intro }}</p>
          <div :class="['tabs', baseInfo.theme_color]">
            <div :class="{active: tabs==1}" @click="tabs=1">用户报名</div>
            <div :class="{active: tabs==2}" @click="tabs=2">验证</div>
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
                <!-- 输入框 -->
                <template
                  v-if="(question.type === 0 && question.default_type !== 4) || question.type === 1"
                >
                  <el-input
                    v-model="form[question.id]"
                    :placeholder="placeholderList[question.default_type] || '请输入'"></el-input>
                </template>
                <!-- 单选 -->
                <template
                  v-if="(question.default_type === 4) || question.type === 2"
                >
                  <el-radio-group v-model="form[question.id]">
                    <template v-if="question.default_type === 4">
                      <el-radio label="男" name="gender"></el-radio>
                      <el-radio label="女" name="gender"></el-radio>
                    </template>
                    <template v-else>
                      <el-radio
                        v-for="radioItem in question.items"
                        :key="radioItem.id"
                        :label="radioItem.id"
                        :name="question.id + ''"
                      >
                      {{ radioItem.type != 1 ? radioItem.subject : ''}}
                        <template v-if="radioItem.type === 1">
                          其他
                          <el-input v-model="form[`${question.id}${radioItem.id}`]" class="noFull radioInput"></el-input>
                          <br/>
                        </template>
                      </el-radio>
                    </template>
                  </el-radio-group>
                </template>
                <!-- 多选 -->
                <template
                  v-if="question.type === 3"
                >
                  <el-checkbox-group v-model="form[question.id]">
                    <el-checkbox
                      v-for="checkItem in question.items"
                      :key="checkItem.id"
                      :label="checkItem.id"
                      :name="question.id + ''"
                    >
                    {{ checkItem.type != 1 ? checkItem.subject : ''}}
                      <template v-if="checkItem.type === 1">
                        其他
                        <el-input v-model="form[`${question.id}${checkItem.id}`]" class="noFull radioInput"></el-input>
                        <br/>
                      </template>
                    </el-checkbox>
                  </el-checkbox-group>
                </template>
                <!-- 下拉 -->
                <template
                  v-if="question.type === 4"
                >
                  <el-select v-model="form[question.id]" placeholder="请选择">
                    <el-option
                      v-for="option in question.items"
                      :key="option.id"
                      :label="option.subject"
                      :value="option.subject"
                    ></el-option>
                  </el-select>
                </template>
                <!-- 地域选择 -->
                <template
                  v-if="question.type === 5"
                >
                  <el-row :gutter="20">
                    <el-col :span="8">
                      <el-select v-model="province" placeholder="请选择省份">
                        <el-option
                          v-for="opt in provinces"
                          :key="opt.value"
                          :label="opt.label"
                          :value="opt.value"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="8">
                      <el-select v-model="city" placeholder="请选择市">
                        <el-option
                          v-for="opt in cityList"
                          :key="opt.value"
                          :label="opt.label"
                          :value="opt.value"
                        ></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="8" countyList>
                      <el-select v-model="form[question.id]" placeholder="请选择区/县">
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
              <el-form-item>
                <div id="setCaptcha">
                  <el-input  v-model.trim="form.imgCode"> </el-input>
                </div>
                <p class="errorText" v-show="errorMsgShow">图形码错误</p>
              </el-form-item>
              <el-form-item :required="false" prop="code">
                <el-input v-model="form.code" auto-complete="off" placeholder="请输入验证码">
                  <el-button :disabled="time !== 60" class="no-border" size="mini" slot="append" @click="getDyCode(true)">{{ time === 60 ? '发送验证码' : `${time}s` }}</el-button>
                </el-input>
              </el-form-item>
              <el-form-item :prop="provicy.id + ''">
                <!-- 隐私声明 -->
                <template
                  v-if="provicy"
                >
                  <el-checkbox v-model="form[provicy.id]">
                    <p v-html="provicyText"></p>
                  </el-checkbox>
                </template>
              </el-form-item>
              <el-button :class="[baseInfo.theme_color]" round type="primary" @click="submitForm">报名</el-button>
            </el-form>
          </template>

          <!-- 验证 -->
          <template>
            <el-form class="entryForm" v-show="tabs === 2" :model="verifyForm" ref="verifyForm" :rules="verifyRules">
              <el-form-item
                required
                label="请输入报名时您填写的手机号"
                prop="phone"
              >
                <el-input v-model.trim="verifyForm.phone" auto-complete="off" placeholder="请输入手机号"></el-input>
              </el-form-item>
              <el-form-item>
                <div id="setCaptcha1">
                  <el-input  v-model.trim="verifyForm.imgCode"> </el-input>
                </div>
                <p class="errorText" v-show="verifyErrorMsgShow">验证失败，请重试</p>
              </el-form-item>
              <el-form-item prop="code">
                <el-input v-model.trim="verifyForm.code" auto-complete="off" placeholder="验证码">
                  <el-button class="no-border" size="mini" slot="append" @click="getDyCode(false)">{{ verifyTime === 60 ? '发送验证码' : `${verifyTime}s` }}</el-button>
                </el-input>
              </el-form-item>
              <el-button :class="[baseInfo.theme_color]" round type="primary" @click="submitVerify">提交</el-button>
            </el-form>
          </template>
        </article>
        <i
          class="closeBtn"
          @click="closePreview"
        >&times;</i>
      </div>
    </div>
  </div>
</template>

<script>
  import Env from "@/api/env";
  import { validPhone } from '@/utils/validate.js'
  export default {
    created() {
      this.getBaseInfo();
      this.getQuestionList();
    },
    watch: {
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
            // if (item.items && item.items.length) {
            //   item.items.some(elem => elem.type === 1) && (form[`${item.id}other`] = '');
            // }

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
              rules[item.id] = {
                required: !!item.is_must,
                validator: validPhone,
                trigger: 'blur'
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
              rules[item.id] = {
                type: 'email',
                required: !!item.is_must,
                message: '请填写邮箱',
                trigger: 'blur'
              }
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
                message: '请选择地域',
                trigger: 'change'
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
            message: '请输入验证码',
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
      }
    },
    data() {
      return {
        Env: Env,
        webinar_id: this.$route.params.id,
        colorIndex: 'red',
        tabs: 1,
        province: '',
        city: '',
        provinces: [],
        cities: {},
        counties: {},
        list: [],
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
          "open_link": 0,
          "theme_color": "red",
          "tab_verify_title": "验证",
          "tab_form_title": "用户报名",
          "title": "ddassd",
          "intro": "",
          "cover": "sys/img_url/c7/b4/c7b43630a8699dc2608f846ff92d89d0.png"
        },
        verifyForm: {
          phone: '',
          imgCode: ''
        },
        verifyRules: {
          phone: {
            required: true,
            message: '请输入手机号',
            trigger: 'blur'
          },
          code: {
            required: true,
            message: '请输入验证码',
            trigger: 'blur'
          }
        },
        verifyErrorMsgShow: false,
        verifyTime: 60,
      };
    },
    mounted() {
      this.callCaptcha('#setCaptcha');
      this.callCaptcha('#setCaptcha1');
    },
    methods: {
      closePreview() {
        this.$emit('closeSignUp');
      },
      // 获取表单基本信息
      getBaseInfo() {
        this.$fetch('regFromGet', {
          webinar_id: this.webinar_id
        }).then(res => {
          if (res.code === 200) {
            this.baseInfo = res.data;
          }
        }).catch(err => {
          this.$message.error(`报名表单基本信息失败！`);
          console.log(err);
        });
      },
      getDyCode(isForm) {
        let phone = ''
        if (isForm) {
          const phoneItem = this.list.find(item => item.type === 0 && item.default_type === 2);
          phone = this.form[phoneItem.id];
        } else {
          phone = this.verifyForm.phone
        }
        console.log(phone)
        // 获取短信验证码
        if (validPhone('', phone) && this.mobileKey) {
          this.$fetch('regSendVerifyCode', {
            webinar_id: this.webinar_id,
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
      // 提交表单
      submitForm() {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            this.formHandler()
            const phoneItem = this.list.find(item => item.type === 0 && item.default_type === 2);
            const nameItem = this.list.find(item => item.type === 0 && item.default_type === 1);
            const options = {
              webinar_id: this.webinar_id,
              phone: this.form[phoneItem.id],
              verify_code: this.form.code,
              form: JSON.stringify(this.answer),
              report: JSON.stringify({
                phone: this.form[phoneItem.id],
                real_name: this.form[nameItem.id]
              })
            }
            this.$route.query.refer && (options.refer = this.$route.query.refer)
            this.$fetch('regAnswerSubmit', options).then(res => {
              if(res.code == 200) {
                // 报名成功的操作，跳转到直播间
                this.closePreview()
                this.$emit('changeBtnVal', '已预约')
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
            this.$fetch('regUserCheck', {
              webinar_id: this.webinar_id,
              phone: this.verifyForm.phone,
              verify_code: this.verifyForm.code,
              visit_id: sessionStorage.getItem("visitor_id")
            }).then(res => {
              if (res.code == 12809) {
                this.$message.error('短信验证码错误')
              } else if (res.code == 12002) {
                this.$message.error('活动不存在或已删除')
              } else if (res.code == 12502) {
                this.$message.error('不支持的活动类型(flash)')
              } else {
                // 如果已经报名
                if (res.data.has_registed == 1) {
                  // 已报名，跳转到直播间
                  this.closePreview()
                  this.$emit('changeBtnVal', '已预约')
                } else {
                  this.$message.warning('请先报名！');
                }
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
          if (item.type === 0) {
            // 系统题目
            !answer.default && (answer.default = []);
            answer.default.push({
              "id": item.id,
              "content": this.form[item.id],
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
              "content": this.form[item.id],
              "options": options
            })
          } else if (item.type === 2) {
            // 单选
            !answer.radio && (answer.radio = []);
            const element = item.items.find(elem => elem.id === this.form[item.id]);
            let content = element.type !== 1
              ? {
                id: element.id,
                content: element.subject
              }
              : {
                id: element.id,
                content: this.form[`${item.id}${element.id}`] ? this.form[`${item.id}${element.id}`] : '其他'
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
            })
            answer.checkbox.push({
              "id": item.id,
              "content": content
            })
          } else if (item.type === 4) {
            // 下拉
            !answer.select && (answer.select = []);
            const element = item.items.find(elem => elem.subject === this.form[item.id]);
            answer.select.push({
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
            const provinec = this.provinces.find(ele => ele.value == this.province)
            console.log(provinec)
            const city = this.cityList.find(ele => ele.value == this.city)
            console.log(this.form[item.id])
            const county = this.countyList.find(ele => ele.value == this.form[item.id])
            console.log(county)
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
        axios.get(`${process.env.VUE_APP_STATIC_URL}/saas/common_libs/area.json`).then(res => {
          console.warn(res, '加载地址');
          this.provinces = res.data.provinces;
          this.cities = res.data.cities;
          this.counties = res.data.counties;
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
        this.$fetch('regQListGet', {
          webinar_id: this.webinar_id
        }).then(res => {
          // 按照 order_num 从小到大排序
          const list = res.data.ques_list.sort(compare('order_num'));
          this.currentPhone = res.data.phone;
          res.data.phone && (this.verifyForm.phone = res.data.phone)
          this.list = list;
          console.log(list);
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
          text = text.replace(reg, `<a href="${parseOptsFir.url}" target="_blank">$1</a>`);
        }
        let matchPrivacy2 = (parseOptsSec && parseOptsSec.privacy_info.trim()) ? text.match(parseOptsSec.privacy_info) : null;
        if(matchPrivacy2){
          let reg = new RegExp(`(${matchPrivacy2[0]})`, "g");
          text = text.replace(reg, `<a href="${parseOptsSec.privacy_link}" target="_blank">$1</a>`);
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
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
    .signWrap {
      overflow-y: auto;
      height: 843px;
      .entryFormBox {
        width: 840px;
        background: #fff;
        padding-bottom: 90px;
        position: relative;
      }
      header{
        width: 100%;
        height: 240px;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .pageTitle{
        font-size: 24px;
        color: #1A1A1A;
        margin: 40px 0;
        text-align: center;
      }
      .pageIntro{
        width: 658px;
        margin: 20px auto 0;
        color: #333333;
        font-size: 16px;
        word-break: break-all;
        font-weight: 300;
      }
      article{
        padding: 0 75px;
      }
      .closeBtn{
        width: 32px;
        height: 32px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 28px;
        color: #fff;
        position: absolute;
        right: 16px;
        top: 16px;
        font-size: 32px;
        text-align: center;
        line-height: 26px;
        font-style: normal;
        cursor: pointer;
      }
      .tabs{
        width: 100%;
        overflow: hidden;
        margin-bottom: 43px;
        margin-top: 20px;
        >div{
          width: 50%;
          float: left;
          border-radius: 4px;
          border: 1px solid #E6E6E6;
          border-radius: 4px 0px 0px 4px;
          line-height: 40px;
          height: 40px;
          text-align: center;
          transition: all .2s linear;
          cursor: pointer;
          &:nth-child(1){
            border-right: 0px none;
          }
          &:nth-child(2){
            border-left: 0px none;
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
      .el-checkbox-group{
        width: 100%;
        padding-left: 20px;
        .el-checkbox{
          display: block;
          margin-top: 20px;
        }
        /deep/ .el-checkbox__label{
          width: 100%;
        }
        .el-checkbox:last-child{
          margin-right: 30px;
        }
      }
      .el-select{
        width: 100%;
      }
      .el-radio-group{
        width: 100%;
        padding-left: 20px;
        .el-radio{
          display: block;
          margin-top: 20px;
        }
        .el-radio:last-child{
          margin-right: 30px;
        }
      }
      .noFull {
        width: calc(100% - 30px);
      }
      /deep/ .el-button.is-disabled, .el-button.is-disabled:focus, .el-button.is-disabled:hover {
        background-color: inherit;
        border: none;
      }
    }
    .entryForm .blue {
      background: @blue;
      border-color: @blue;
      &:hover {
        background: @blue;
        border-color: @blue;
      }
    }
    .entryForm .red {
      background: @red;
      border-color: @red;
      &:hover {
        background: @red;
        border-color: @red;
      }
    }
    .entryForm .purple {
      background: @purple;
      border-color: @purple;
      &:hover {
        background: @purple;
        border-color: @purple;
      }
    }
  }
</style>
