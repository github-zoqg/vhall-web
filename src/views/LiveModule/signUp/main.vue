<template>
  <div>
    <div class="head">
      <pageTitle title="报名表单" content="toolTip">
        <el-switch
          class="swtich"
          v-model="signUpSwtich"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          @change="switchRegForm"
          :active-text="signUpSwtichDesc">
        </el-switch>
        <div class="headBtnGroup">
          <el-button round size="medium" @click="openDialog('theme')">设置</el-button>
          <el-button round size="medium" @click="openDialog('share')">分享</el-button>
          <el-button type="primary" round size="medium" @click="rightComponent='signUpForm'">预览</el-button>
        </div>
      </pageTitle>
      <div class="settingBox">
        <ul class="options">
          <template v-for="(item, key) in setOptions">
            <section class="block" :key="key">{{key}}</section>
            <li
              :class="{
                item: true, active: item.name &&
                questionArr.some(qes => qes.name == item.name)
              }"
              v-for="item in item"
              :key="item.label"
              @click="addFiled(item)"
            >
              <!-- <icon :class="item.icon"></icon> -->
              <icon :icon-class="item.icon">{{item.label}}</icon>
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
            v-show="rightComponent == 'signUpForm'"
            :questionArr.sync="questionArr"
            @closePreview="closePreview"
          ></signUpForm>
        </div>
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
import signUpForm from './signUpForm';
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
        cover: 'sys/img_url/c7/b4/c7b43630a8699dc2608f846ff92d89d0.png'
      },
      radio: 3,
      rightComponent: 'fieldSet',
      setOptions: {
        "基本信息": [
          {icon: 'saasicon_xingming', label: "姓名", name: 'name'},
          {icon: 'el-icon-male', label: "性别", name: 'gender'},
          {icon: 'el-icon-phone', label: "手机", name: 'phone'},
          {icon: 'el-icon-message', label: "邮箱", name: 'email'},
          {icon: 'el-icon-location', label: "地域", name: 'regional'},
          {icon: 'el-icon-office-building', label: "公司", name: 'company'},
          {icon: 'el-icon-info', label: "职务", name: 'duty'},
        ],
        "题目类型": [
          {icon: 'el-icon-user-solid', label: "单选题", type: 'radio'},
          {icon: 'el-icon-user-solid', label: "多选题", type: 'checkBox'},
          {icon: 'el-icon-tickets', label: "问答题", type: 'input'},
          {icon: 'el-icon-caret-bottom', label: "下拉题", type: 'select'},
          {icon: 'el-icon-user-solid', label: "隐私声明", name: 'privacy'},
        ]
      },
      questionArr: [],
    };
  },
  computed: {
    signUpSwtichDesc(){
      if(this.signUpSwtich){
        return '已开启，观看直播需要填写以下信息';
      }else{
        return '开启后，观看直播需要填写报名信息';
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
  created(){
    this.getBaseInfo();
    this.getQuestionList();
  },
  methods: {
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
          this.signUpSwtich = res.data.enable_status === '0' ? false : true;
        }
      }).catch(err => {
        this.$message.error(`报名表单${ behaviour }失败！`);
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
          this.$message.success(`报名表单${ behaviour }成功！`);
        } else {
          this.$message.error(`报名表单${ behaviour }失败！`);
        }
      }).catch(err => {
        this.$message.error(`报名表单${ behaviour }失败！`);
        console.log(err);
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
        this.questionArr.push(filedJson);
        return false;
      }

      // 默认添加题目不需要调用添加接口，直接 push 渲染页面
      // if (info.name === 'phone' || info.name === 'name') {
      //   this.questionArr.push({
      //     ...filedJson,
      //     question_id: Math.floor(Math.random() * 10000)
      //   });
      //   // 这个 if ,等接口通了可以删除，不用判断直接 return
      //   if(info) {
      //     return false;
      //   }
      // }

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
  /deep/ .el-switch__label--right,/deep/ .el-switch__label--left{
    color: #999999;
    pointer-events: none;
    user-select: none;
  }
  .swtich{
    margin-left: 12px;
    vertical-align: sub;
  }
  .headBtnGroup{
    float: right;
  }
  .titleBox{
    line-height: 40px;
  }
  .settingBox{
    display: flex;
    .options{
      width: 170px;
      .block{
        font-size: 16px;
        color: #666666;
        margin-bottom: 20px;
      }
      .item{
        font-size: 14px;
        color: #1A1A1A;
        margin-bottom: 20px;
        width: fit-content;
        cursor: pointer;
        &.active{
          color: #FB3A32;
          pointer-events: none;
          i{
            color: #FB3A32;
          }
        }
        i{
          margin-right: 4px;
          color: #1A1A1A;
        }
      }
    }
    .rightView{
      display: flex;
      flex: 1;
      justify-content: center;
    }
  }

</style>
