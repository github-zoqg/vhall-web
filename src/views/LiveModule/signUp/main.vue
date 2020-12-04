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
        is_independent_link: 0,
        form_theme_color: 'red',
        form_tab_verify_title: '验证',
        form_tab_register_title: '用户报名',
        form_title: '',
        form_introduce: '',
        form_cover: 'sys/img_url/c7/b4/c7b43630a8699dc2608f846ff92d89d0.png'
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
    this.addFiled(this.setOptions["基本信息"][0]);
    this.addFiled(this.setOptions["基本信息"][2]);
    console.log(this.questionArr);
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
          this.signUpSwtich = res.data.enable_status;
        }
      }).catch(err => {
        this.$message.error(`报名表单${ behaviour }失败！`);
        console.log(err);
      });
    },
    // 获取表单题目列表
    getQuestionList() {
      this.$fetch('regQListGet', {
        webinar_id: this.webinar_id
      }).then(res => {
        console.log(res);
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
        console.log(res);
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
      this.$fetch('regFromUpdate', {
        webinar_id: this.webinar_id,
        ...options
      }).then(res => {
        console.log(res);
        callback && callback();
      }).catch(err => {
        console.log(err);
      });
    },
    // 添加题目方法（通用）
    addFiled(info){
      const filedJson = getfiledJson({name: info.name, type: info.type});
      // 默认添加题目不需要调用添加接口，直接 push 渲染页面
      if (info.name === 'phone' || info.name === 'name') {
        this.questionArr.push({
          ...filedJson,
          question_id: Math.floor(Math.random() * 10000)
        });
        // 这个 if ,等接口通了可以删除，不用判断直接 return
        if(info) {
          return false;
        }
      }
      //*************接口调通删除 */
      const questionsLength = this.questionArr.length;
      const lastQuestion = this.questionArr[questionsLength - 1];
      if (lastQuestion.label === '隐私声明') {
        // 如果最后一个选项是隐私协议，新题目插到倒数第三位
        this.questionArr.splice(questionsLength - 2, 0, {
          ...filedJson,
          question_id: Math.floor(Math.random() * 10000)
        });
      } else if(lastQuestion.label === '手机号') {
        // 如果添加的是隐私声明，直接push
        if (filedJson.label === '隐私声明') {
          this.questionArr.push({
            ...filedJson,
            question_id: Math.floor(Math.random() * 10000)
          });
          return false;
        }
        // 如果最后一个是手机号题目，新题目插到倒数第二位
        this.questionArr.splice(questionsLength - 1, 0, {
          ...filedJson,
          question_id: Math.floor(Math.random() * 10000)
        });
      }
      if(info) {
        return false;
      }
      //*************接口调通删除 */

      // 添加的是隐私协议
      if (name === 'privacy') {
        this.addPrivacy();
      }
      // 添加的是题目
      const options = {
        webinar_id: this.webinar_id,
        type: filedJson.reqType,
        default_type: filedJson.default_type,
        subject: filedJson.label,
        is_must: filedJson.required ? 1 : 0,
        options: JSON.stringify(filedJson.options) || JSON.stringify({ notNull: true })
      };
      this.$fetch('regQAdd', options).then(res => {
        if (res.code === 200) {
          // 提交成功，添加到数组中
          console.log(this.questionArr);
          const questionsLength = this.questionArr.length;
          const lastQuestion = this.questionArr[questionsLength - 1];
          if (lastQuestion.label !== '手机号') {
            // 如果最后一个选项是隐私协议，新题目插到倒数第三位
            this.questionArr.splice(questionsLength - 3, 0, {
              ...filedJson,
              question_id: res.data.question_id || Math.floor(Math.random() * 10000)
            });
          } else {
            // 如果最后一个是手机号题目，新题目插到倒数第二位
            this.questionArr.splice(questionsLength - 2, 0, {
              ...filedJson,
              question_id: res.data.question_id || Math.floor(Math.random() * 10000)
            });
          }
          this.questionArr.push();
          console.log(this.questionArr);
          // 更新题目顺序
          let question_ids = this.questionArr.reduce((acc, curr) => {
            return acc + curr.question_id + ',';
          }, '');
          question_ids.substring(0, question_ids.length - 1);
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
