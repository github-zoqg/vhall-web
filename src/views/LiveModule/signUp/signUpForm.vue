<template>
  <div class="signUpForm">
    <header>
      <img :src="`${ Env.staticLinkVo.uploadBaseUrl }sys/img_url/c7/b4/c7b43630a8699dc2608f846ff92d89d0.png`" alt="">
    </header>
    <article>
      <h1 class="pageTitle">{{ baseInfo.title }}</h1>
      <div :class="['tabs', colorIndex]">
        <div :class="{active: tabs==1}" @click="tabs=1">活动报名</div>
        <div :class="{active: tabs==2}" @click="tabs=2">我已报名</div>
      </div>
      <!-- 表单块 -->
      <template>
        <el-form v-show="tabs==1">
          <el-form-item
            v-for="(formItem, formIndex) in renderQuestionArr"
            :key="formIndex"
            :label="formItem.label === '隐私声明' ? '' : `${formIndex < 9 ? `0${ formIndex + 1 }` : formIndex + 1}.${formItem.label}`"
            :required="!!formItem.required"
          >
            <!-- 单选类型 -->
            <template v-if="formItem.type=='select'">
              <el-select v-model="formItem.value" placeholder="请选择">
                <el-option
                  v-for="(nodeItem,nodeIndex) in formItem.nodes"
                  :key="`${formIndex}-${nodeIndex}`"
                  :label="nodeItem.value || `选项${nodeIndex+1}`"
                  :value="nodeItem.value || `选项${nodeIndex+1}`">
                </el-option>
              </el-select>
            </template>
            <!-- 隐私声明 -->
            <!-- <template v-else-if="formItem.name=='privacy'">
              <el-checkbox v-model="formItem.value">
                <p v-html="privacyFormatter(formItem.nodes)"></p>
              </el-checkbox>
            </template> -->
            <template v-for="(nodes, nodeIndex) in formItem.nodes" v-else>
              <el-input v-if="formItem.type=='input'"  :key="`${formIndex}-${nodeIndex}`" v-model.trim="nodes.value" v-bind="nodes.props"></el-input>
              <!-- 单选类型 -->
              <el-radio-group v-model="nodes.value" v-bind="nodes.props" v-else-if="formItem.type=='radio'" :key='`${formIndex}-${nodeIndex}`'>
                <el-radio v-for="(radioItem, raionIndex) in nodes.children" :key="`${formIndex}-${nodeIndex}-${raionIndex}`" :label="radioItem.value || `选项${raionIndex+1}`">
                  {{radioItem.other ? "其他" : radioItem.value}}
                  <el-input v-if="radioItem.other" maxlength="50" show-word-limit :placeholder="`选项${raionIndex+1}`" v-model.trim="radioItem.value" ></el-input>
                  <br/>
                </el-radio>
              </el-radio-group>
              <!-- 多选类型 -->
              <el-checkbox-group v-model="nodes.value" v-bind="nodes.props" v-else-if="formItem.type=='checkBox'" :key='`${formIndex}-${nodeIndex}`'>
                <el-checkbox v-for="(radioItem, raionIndex) in nodes.children" :key="`${formIndex}-${nodeIndex}-${raionIndex}`" :label="radioItem.value || `选项${raionIndex+1}`">
                  {{radioItem.other ? "其他" : radioItem.value}}
                  <el-input v-if="radioItem.other" maxlength="50" show-word-limit :placeholder="`选项${raionIndex+1}`" v-model.trim="radioItem.value" :class="{noFull: !!radioItem.other, radioInput: true}">
                    <i class="el-icon-remove-outline removeIcon" slot="suffix" @click="deleteOptions(node.children, raionIndex)"></i>
                  </el-input>
                  <br/>
                </el-checkbox>
              </el-checkbox-group>
            </template>
          </el-form-item>
          <el-form-item>
            <div id="setCaptcha">
              <el-input  v-model.trim="form.imgCode"> </el-input>
            </div>
            <p class="errorText" v-show="errorMsgShow">图形码错误</p>
          </el-form-item>
          <el-form-item key="code" prop="code">
            <el-input v-model.trim="form.code" auto-complete="off" placeholder="请输入验证码">
              <el-button class="no-border" size="mini" slot="append" v-preventReClick @click.prevent.stop="getDyCode('phone')">{{ time === 60 ? '发送验证码' : `${time}s` }}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item
            v-if="privacyItem"
            :required="!!privacyItem.required"
          >
            <!-- 隐私声明 -->
            <template>
              <el-checkbox v-model="privacyItem.value">
                <p v-html="privacyFormatter(privacyItem.nodes)"></p>
              </el-checkbox>
            </template>
          </el-form-item>
        </el-form>
      </template>
      <!-- 表单块 -->

      <!-- 验证块 -->
      <template>
        <el-form v-show="tabs==2">
          <el-form-item
            required
            label="请输入报名时您填写的手机号"
          >
            <el-input v-model.trim="form.phone" auto-complete="off" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item>
            <div id="setCaptcha1">
              <el-input  v-model.trim="form.imgCode"> </el-input>
            </div>
            <p class="errorText" v-show="errorMsgShow">验证失败，请重试</p>
          </el-form-item>
          <el-form-item key="code" prop="code">
            <el-input v-model.trim="form.code" auto-complete="off" placeholder="验证码">
              <el-button class="no-border" size="mini" slot="append" v-preventReClick @click.prevent.stop="getDyCode('phone')">{{ time === 60 ? '发送验证码' : `${time}s` }}</el-button>
            </el-input>
          </el-form-item>
        </el-form>
        <el-button round type="primary" v-preventReClick @click.prevent.stop="submitForm">{{ tabs == 1 ? '报名' : '提交' }}</el-button>
      </template>
      <!-- 验证块 -->
    </article>
    <i
      class="closeBtn"
      @click="closePreview"
    >&times;</i>
  </div>
</template>

<script>
import Env from "@/api/env";
export default {
  props:{
    questionArr: {
      type: Array,
      default: ()=> []
    },
    baseInfo: {
      type: Object,
    }
  },
  data(){
    return{
      Env: Env,
      time: 60,
      form: {
        phone: '',
        imgCode: '',
        code: ''
      },
      colorIndex: 'red',
      tabs: 1,
      showCaptcha: false, // 专门用于 校验登录次数 接口返回 需要显示图形验证码时使用
      captchakey: 'b7982ef659d64141b7120a6af27e19a0', // 云盾key
      mobileKey: '', // 云盾值
      captcha: null, // 云盾本身
      errorMsgShow: ''
    };
  },
  computed: {
    renderQuestionArr() {
      return JSON.parse(JSON.stringify(this.questionArr.filter(item => {
        return item.label !== '隐私声明';
      })))
    },
    privacyItem() {
      if (this.questionArr.length > 0 && this.questionArr[this.questionArr.length - 1].label === '隐私声明') {
        return this.questionArr[this.questionArr.length - 1];
      }
      return false;
    }
  },
  created(){},
  mounted() {
    this.callCaptcha('#setCaptcha');
    this.callCaptcha('#setCaptcha1');
    console.log(this.renderQuestionArr);
  },
  methods: {
    closePreview() {
      this.$emit('closePreview');
    },
    submitForm() {
      if(this.tabs === 1) {
        this.submitSignUp();
      }else {
        this.submitVerify();
      }
    },
    submitSignUp() {
      console.log("提交报名表单");
    },
    submitVerify() {
      console.log("提交验证");
    },
    getDyCode() {

    },
    privacyFormatter(item){
      let text = JSON.parse(JSON.stringify(item[0].value));
      let matchPrivacy1 = item[1].value.trim() ? text.match(item[1].value) : null;
      if(matchPrivacy1){
        let reg = new RegExp(`(${matchPrivacy1[0]})`);
        text = text.replace(reg, `<a href="${item[2].value}" target="_blank">$1</a>`);
      }
      let matchPrivacy2 = (item[3] && item[3].value.trim()) ? text.match(item[3].value) : null;
      if(matchPrivacy2){
        let reg = new RegExp(`(${matchPrivacy2[0]})`, "g");
        text = text.replace(reg, `<a href="${item[4].value}" target="_blank">$1</a>`);
      }

      return text;
    },
    /**
     * 初始化网易易盾图片验证码
     */
    callCaptcha(id) {
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
            that.captcha = '';
            console.log('errr>>>', err);
            that.errorMsgShow = true;
          }
        },
        onload(instance) {
          console.log('onload', instance);
          that.captcha = instance;
        }
      });
    },
  }
};
</script>

<style lang="less" scoped>
  @red: #FB3A32;
  @redBg: #FFEBEB;
  @blue: #3562FA;
  @blueBg: #ebefff;
  @orange: #FA9A32;
  @orangeBg: #fff5eb;
  .signUpForm{
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
  .tabs{
    width: 100%;
    overflow: hidden;
    margin-bottom: 43px;
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
    &.orange{
      .active{
        border: 1px solid@orange;
        background: @orangeBg;
        color:@orange;
      }
    }
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
</style>
