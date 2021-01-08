<template>
  <div class="signup-main">
    <div class="head">
      <pageTitle title="报名表单">
        <div class="switchBox">
          <el-switch
            class="swtich"
            v-model="signUpSwtich"
            active-color="#FB3A32"
            inactive-color="#CECECE"
            @change="switchRegForm"
            :active-text="signUpSwtichDesc">
          </el-switch>
        </div>
        <div class="headBtnGroup">
          <el-button round size="medium" @click="openDialog('theme')">设置</el-button>
          <el-button round size="medium" @click="openDialog('share')">分享</el-button>
          <el-button type="primary" round size="medium" @click="rightComponent='signUpForm'">预览</el-button>
        </div>
      </pageTitle>
      <div id="settingBox" class="settingBox clearFix">
        <ul :class="['options', menuBarFixed ? 'isFixed' : '']" v-show="rightComponent !='signUpForm'">
          <template v-for="(item, key, index) in setOptions">
            <section :class="['block', index == 1 ? 'block-bto' : '']" :key="key">{{key}}</section>
            <li
              :class="{
                item: true,
                active: item.isActive || item.name && questionArr.some(qes => qes.name == item.name)
              }"
              v-for="item in item"
              :key="item.label"
              @click="addFiled(item)"
            >
              <!-- <icon :class="item.icon"></icon> -->
              <icon class="icon" :icon-class="item.icon"></icon>
              <span>{{item.label}}</span>
            </li>
          </template>
        </ul>
        <div class="rightView">
          <!-- 表单编辑组件 -->
          <fieldSet
            ref="fieldSet"
            :baseInfo="baseInfo"
            v-show="rightComponent == 'fieldSet'"
            :questionArr.sync="questionArr"
            @setBaseInfo="setBaseInfo"
          ></fieldSet>
          <!-- 表单预览组件 -->
          <signUpForm
            :baseInfo="baseInfo"
            v-if="rightComponent == 'signUpForm'"
            :questionArr.sync="questionArr"
            @closeSignUp="closePreview"
          ></signUpForm>
        </div>
        <div class="disable_wrap" v-if="!signUpSwtich"></div>
      </div>
    </div>
    <shareDialog
      :baseInfo="baseInfo"
      @setBaseInfo="setBaseInfo"
      ref="share"
    ></shareDialog>
    <themeSet
      :baseInfo="baseInfo"
      @setBaseInfo="setBaseInfo"
      ref="theme"
    ></themeSet>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import fieldSet from './fieldSet';
import shareDialog from './shareDialog';
import signUpForm from '../Subscribe/signUpForm';
import themeSet from './themeSet';
import {getfiledJson} from './util';
export default {
  components: {
    PageTitle,
    fieldSet,
    shareDialog,
    themeSet,
    signUpForm
  },
  data(){
    return {
      webinar_id: this.$route.params.str,
      signUpSwtich: false,
      baseInfo: {
        open_link: 0,
        theme_color: 'red',
        tab_verify_title: '验证',
        tab_form_title: '用户报名',
        title: '',
        intro: '',
        cover: ''
      },
      radio: 3,
      rightComponent: 'fieldSet',
      setOptions: {
        "基本信息": [
          {icon: 'saasicon_name', label: "姓名", name: 'name'},
          {icon: 'saasicon_gender', label: "性别", name: 'gender'},
          {icon: 'saasicon_phone', label: "手机", name: 'phone'},
          {icon: 'saasicon_mail', label: "邮箱", name: 'email'},
          {icon: 'saasicon_regional', label: "地域", name: 'regional'},
          {icon: 'saasicon_company', label: "公司", name: 'company'},
          {icon: 'saasicon_position', label: "职务", name: 'duty'},
        ],
        "题目类型": [
          {icon: 'saasicon_radio', label: "单选题", type: 'radio'},
          {icon: 'saasicon_multi-select', label: "多选题", type: 'checkBox'},
          {icon: 'saasicon_question', label: "问答题", type: 'input'},
          {icon: 'saasicon_drop-down', label: "下拉题", type: 'select'},
          {icon: 'saasicon_Privacystatement', label: "隐私声明", name: 'privacy'},
        ]
      },
      questionArr: [],
      menuBarFixed: false
    };
  },
  computed: {
    signUpSwtichDesc(){
      if(this.signUpSwtich){
        return '已开启，观看直播需要填写报名表单';
      }else{
        return '开启后，观看直播需要填写报名表单';
      }
    },
    ques() {
      return this.questionArr.map(item => {
        if (item) {
          return item;
        }
      });
    }
  },
  watch: {
    questionArr: {
      deep: true,
      immediate: true,
      handler(newValue) {
        const sumObj = {}
        newValue.forEach(item => {
          sumObj[item.reqType] ? sumObj[item.reqType]++ : sumObj[item.reqType] = 1
        })
        this.setOptions["题目类型"][2].isActive = sumObj[1] >= 20;
        this.setOptions["题目类型"][0].isActive = sumObj[2] >= 20;
        this.setOptions["题目类型"][1].isActive = sumObj[3] >= 20;
        this.setOptions["题目类型"][3].isActive = sumObj[4] >= 20;
      }
    }
  },
  created(){
    this.getBaseInfo();
    this.getQuestionList();
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll () {
      let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
      let offsetTop = document.querySelector('#settingBox').offsetTop
      if (scrollTop > offsetTop) {
        this.menuBarFixed = true
      } else {
        this.menuBarFixed = false
      }
    },
    // 切换组件
    closePreview() {
      this.rightComponent='fieldSet';
    },
    // 获取表单基本信息
    getBaseInfo() {
      this.$fetch('regFromGet', {
        webinar_id: this.webinar_id
      }).then(res => {
        if (res.code === 200) {
          this.baseInfo = res.data;
          this.signUpSwtich = res.data.enable_status == '0' ? false : true;
        }
      }).catch(err => {
        console.log(err);
      });
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
        list.forEach(element => {
          // 如果是姓名、手机、邮箱、性别
          if (element.type === 0) {
            switch (element.default_type) {
              // 姓名
              case 1:
                this.addFiled(this.setOptions["基本信息"][0], element);
                break;
              // 手机
              case 2:
                this.addFiled(this.setOptions["基本信息"][2], element);
                break;
              // 邮箱
              case 3:
                this.addFiled(this.setOptions["基本信息"][3], element);
                break;
              // 性别
              case 4:
                this.addFiled(this.setOptions["基本信息"][1], element);
                break;
            }
          } else if (element.type === 1) {
            if (element.subject === '公司') {
              this.addFiled(this.setOptions["基本信息"][5], element);
              return false;
            }
            // 问答题
            this.addFiled(this.setOptions["题目类型"][2], element);
          } else if (element.type === 2) {
            // 单选
            this.addFiled(this.setOptions["题目类型"][0], element);
          } else if (element.type === 3) {
            // 多选
            this.addFiled(this.setOptions["题目类型"][1], element);
          } else if (element.type === 4) {
            if (element.subject === '职务') {
              this.addFiled(this.setOptions["基本信息"][6], element);
              return false;
            }
            // 下拉
            this.addFiled(this.setOptions["题目类型"][3], element);
          } else if (element.type === 5) {
            // 地域
            this.addFiled(this.setOptions["基本信息"][4], element);
          } else if (element.type === 6) {
            // 隐私
            this.addFiled(this.setOptions["题目类型"][4], element);
          }
        });
      }).catch(err => {
        console.log(err);
      });
    },
    // 开启\关闭报名表单开关
    switchRegForm(value) {
      const url = value ? 'regFromEnable' : 'regFromDisable';
      const behaviour = value ? '开启' : '关闭';
      this.$fetch(url, {
        webinar_id: this.webinar_id
      }).then(res => {
        if (res.code === 200) {
          this.$message({
            message:  `报名表单${ behaviour }成功！`,
            showClose: true, // 是否展示关闭按钮
            type: 'error', //  提示类型
            customClass: 'zdy-info-box' // 样式处理
          });
        }
      }).catch(err => {
        if (err.code == 12800) {
          this.$message({
            message:  '报名表单不能与白名单同时开启',
            showClose: true, // 是否展示关闭按钮
            type: 'error', //  提示类型
            customClass: 'zdy-info-box' // 样式处理
          });
        } else {
          this.$message({
            message:  `报名表单${ behaviour }失败！`,
            showClose: true, // 是否展示关闭按钮
            type: 'error', //  提示类型
            customClass: 'zdy-info-box' // 样式处理
          });
        }
      });
    },
    // 更改表单基本信息的方法（通用）
    setBaseInfo(options, callback) {
      this.baseInfo = {
        ...this.baseInfo,
        ...options,
      };
      const keyMap = {
        title: 'form_title',
        intro: 'form_introduce',
        cover: 'form_cover',
        theme_color: 'form_theme_color',
        tab_verify_title: 'form_tab_verify_title',
        tab_form_title: 'form_tab_register_title',
        open_link: 'is_independent_link',
      }
      const opts = {}
      for(let item in options) {
        opts[keyMap[item]] = options[item]
      }
      this.$fetch('regFromUpdate', {
        webinar_id: this.webinar_id,
        ...opts
      }).then(res => {
        console.log(res);
        callback && callback();
      }).catch(err => {
        console.log(err);
      });
    },
    // 添加题目方法（通用）
    addFiled(info, opts){
      let mergeObj;
      let filedJson = getfiledJson({name: info.name, type: info.type});
      // 如果 opts 存在，为初始化赋值
      if (opts) {
        mergeObj = {
          question_id: opts.id,
          reqType: opts.type,
          default_type: opts.default_type,
          label: opts.subject,
          order_num: opts.order_num,
          options: opts.options && JSON.parse(opts.options),
          required: !!opts.is_must,
          phoneValide: !!(opts.options && JSON.parse(opts.options) && JSON.parse(opts.options).open_verify)
        };
        filedJson = {
          ...filedJson,
          ...mergeObj
        };
        if ((info.type === 'radio' || info.type === 'checkBox') && opts.items && opts.items.length) {
          opts.items.forEach((item, index) => {
            const length = filedJson.nodes[0].children.length;
            if (index < length) {
              filedJson.nodes[0].children[index].item_id = item.id;
              filedJson.nodes[0].children[index].value = item.subject;
              filedJson.nodes[0].children[index].question_id = item.ques_id;
              filedJson.nodes[0].children[index].type = item.type;
              filedJson.nodes[0].children[index].other = !!item.type;
            } else {
              filedJson.nodes[0].children.push({
                item_id: item.id,
                value: item.subject,
                question_id: item.ques_id,
                type: item.type,
                other: !!item.type
              });
            }
          });
        } else if (info.name === 'duty' || info.type === 'select' && opts.items && opts.items.length) {
          opts.items.forEach((item, index) => {
            const length = filedJson.nodes.length;
            if (index < length) {
              filedJson.nodes[index].item_id = item.id;
              filedJson.nodes[index].value = item.subject;
              filedJson.nodes[index].question_id = item.ques_id;
              filedJson.nodes[index].type = item.type;
            } else {
              filedJson.nodes.push({
                ...JSON.parse(JSON.stringify(filedJson.nodes[index - 1])),
                item_id: item.id,
                value: item.subject,
                question_id: item.ques_id,
                type: item.type
              });
            }
          });
        } else if (info.name === 'privacy' && opts.options && opts.options.length) {
          const optsOptions = JSON.parse(opts.options);
          const optsOptions0 = JSON.parse(optsOptions[0].options);
          const optsOptions1 = optsOptions.length === 2 ? JSON.parse(optsOptions[1].options) : false;
          filedJson.nodes[0].value = optsOptions0.content;
          filedJson.nodes[1].value = optsOptions0.color_text;
          filedJson.nodes[2].value = optsOptions0.url;
          if (optsOptions1) {
            filedJson.nodes[3] = JSON.parse(JSON.stringify(filedJson.nodes[1]));
            filedJson.nodes[4] = JSON.parse(JSON.stringify(filedJson.nodes[2]));
            filedJson.nodes[3].value = optsOptions1.privacy_info;
            filedJson.nodes[3].privacy_id = optsOptions1.privacy_id;
            filedJson.nodes[4].value = optsOptions1.privacy_link;
            filedJson.nodes[4].privacy_id = optsOptions1.privacy_id;
            filedJson.nodes[3].privacyAdd = false;
            filedJson.nodes[3].canRemove = true;
          }
        }
        if(info.type === 'checkBox') {
          filedJson.value = []
        }
        this.questionArr.push(filedJson);
        return false;
      }

      // 添加的是题目
      let options = {
        webinar_id: this.webinar_id,
        type: filedJson.reqType,
        default_type: filedJson.default_type,
        subject: filedJson.label,
        is_must: filedJson.required ? 1 : 0,
        options: JSON.stringify(filedJson.options)
      };
      // 添加的是隐私声明
      if (info.name === 'privacy') {
        console.log(options.options);
        const tempOpts = options.options ? JSON.parse(options.options) : {};
        console.log(tempOpts);
        options.options = JSON.stringify({
          ...tempOpts,
          content: '我们根据《隐私声明》保护您填写的所有信息',
          color_text: '《隐私声明》',
          url: ''
        });
      }
      this.$fetch('regQAdd', options).then(res => {
        if (res.code === 200) {
          // 提交成功，添加到数组中
          const questionsLength = this.questionArr.length;
          const lastQuestion = this.questionArr[questionsLength - 1];
          if ((info.type === 'radio' || info.type === 'checkBox') && res.data.items && res.data.items.length) {
            res.data.items.forEach((item, index) => {
              console.log('..............', filedJson.nodes, filedJson.nodes[0]);
              const length = filedJson.nodes[0].children.length;
              if (index < length) {
                filedJson.nodes[0].children[index].item_id = item.id;
                filedJson.nodes[0].children[index].value = item.subject;
                filedJson.nodes[0].children[index].question_id = item.ques_id;
                filedJson.nodes[0].children[index].type = item.type;
                filedJson.nodes[0].children[index].other = !!item.type;
              } else {
                filedJson.nodes[0].children.push({
                  item_id: item.id,
                  value: item.subject,
                  question_id: item.ques_id,
                  type: item.type,
                  other: !!item.type
                });
              }
            });
          } else if ((info.name === 'duty' || info.type === 'select') && res.data.items && res.data.items.length) {
            res.data.items.forEach((item, index) => {
              const length = filedJson.nodes.length;
              if (index < length) {
                filedJson.nodes[index].item_id = item.id;
                filedJson.nodes[index].value = item.subject;
                filedJson.nodes[index].question_id = item.ques_id;
                filedJson.nodes[index].type = item.type;
              } else {
                filedJson.nodes.push({
                  ...JSON.parse(JSON.stringify(filedJson.node[index - 1])),
                  item_id: item.id,
                  value: item.subject,
                  question_id: item.ques_id,
                  type: item.type
                });
              }
            });
          }
          if (lastQuestion.label === '隐私声明') {
            // 如果最后一个选项是隐私协议，新题目插到倒数第三位
            this.questionArr.splice(questionsLength - 2, 0, {
              ...filedJson,
              question_id: res.data.id
            });
          } else if(lastQuestion.label === '手机') {
            // 如果添加的是隐私声明，直接push
            if (filedJson.label === '隐私声明') {
              this.questionArr.push({
                ...filedJson,
                question_id: res.data.id,
              });
            } else {
              // 如果最后一个是手机号题目，新题目插到倒数第二位
              this.questionArr.splice(questionsLength - 1, 0, {
                ...filedJson,
                question_id: res.data.id
              });
            }
          }
          this.$nextTick(() => {
            // 新增题目显示在视觉中心
            document.documentElement.scrollTo(0, this.$refs.fieldSet.$refs[res.data.id][0].offsetTop - 70)
          })
          let question_ids = this.questionArr.reduce((acc, curr) => {
            return acc + curr.question_id + ',';
          }, '');
          question_ids = question_ids.substring(0, question_ids.length - 1);
          this.$fetch('regQSort', {
            webinar_id: this.webinar_id,
            question_ids
          }).then(res => {
            console.log(res);
          }).catch(err => {
            console.log(err);
          });
        }
      }).catch(err => {
        console.log(err);
      });
    },
    // 添加一个隐私协议
    addPrivacy() {
      const options = {
        webinar_id: this.webinar_id,
        content: '我们根据《隐私声明》保护您填写的所有信息',
        color_text: '《隐私声明》',
        url: ''
      };console.log(res);
      this.$fetch('regRrivacyAdd', options).then(res => {
        // TODO: 给所有关于隐私协议的 node 都添加 privacy_id ,更新和删除的时候需要用到
        console.log(res);
      }).catch(err => console.log(err));
    },
    // 打开 dialog 方法（通用）
    openDialog(ref){
      this.$refs[ref].dialogVisible = true;
    }
  }
};
</script>

<style lang="less" scoped>
  .signup-main {
    /deep/ .el-switch__core{
      height: 16px;
      width: 28px!important;
      &:after {
        width: 12px;
        height: 12px;
      }
    }
    /deep/ .el-switch.is-checked .el-switch__core::after {
      margin-left: -13px;
    }
  }
  /deep/ .el-switch__label--right,/deep/ .el-switch__label--left{
    color: #999999;
    pointer-events: none;
    user-select: none;
  }
  .swtich{
    margin-left: 12px;
    vertical-align: sub;
  }
  .switchBox{
    display: inline-flex;
    height: 100%;
  }
  .headBtnGroup{
    float: right;
    /deep/.el-button {
      background: transparent;
      &:hover {
        background: #FB3A32;
        border: 1px solid #FB3A32;
      }
      &:active {
        background: #E2332C;
        border: 1px solid #E2332C;
      }
      &.is-disabled {
        border: 1px solid #E6E6E6;
        background: transparent;
        color: #B3B3B3;
        &:hover,&:active {
          background: transparent;
        }
      }
    }

  }
  .titleBox{
    display: block!important;
    line-height: 40px;
  }
  .settingBox{
    position: relative;
    .isFixed {
      position:fixed;
      top:70px;
      z-index:999;
    }
    .options{
      width: 170px;
      float: left;
      .block{
        font-size: 16px;
        color: #666666;
        height: 40px;
        line-height: 40px;
      }
      .block-bto{
        margin-top: 10px;
      }
      .item{
        font-size: 14px;
        color: #1A1A1A;
        width: fit-content;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
        &:hover {
          color: #FB3A32!important;
          i{
            color: #FB3A32!important;
          }
        }
        &.active{
          color: #B3B3B3;
          pointer-events: none;
          i{
            color: #B3B3B3;
          }
        }
        i{
          margin-right: 4px;
          color: #1A1A1A;
        }
        .icon {
          width: 14px;
          height: 14px;
          font-size: 14px;
          display: inline-block;
          margin-right: 8px;
        }
      }
    }
    .rightView{
      display: flex;
      justify-content: center;
      width: calc(100% - 170px);
      float: right;
    }
    .disable_wrap{
      position: absolute;
      z-index: 1000;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.5)
    }
  }

</style>
