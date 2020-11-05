<template>
  <div>
    <div class="head">
      <pageTitle title="报名表单" content="toolTip">
        <el-switch
          class="swtich"
          v-model="signUpSwtich"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          :active-text="signUpSwtichDesc">
        </el-switch>
        <div class="headBtnGroup">
          <el-button round size="medium">设置</el-button>
          <el-button round size="medium">分享</el-button>
          <el-button type="primary" round size="medium">预览</el-button>
        </div>
      </pageTitle>
      <div class="settingBox">
        <ul class="options">
          <template v-for="(item, key) in setOptions">
            <section class="block" :key="key">{{key}}</section>
            <li :class="{item: true, active: setItem.name && questionArr.some(qes=> qes.name == setItem.name)}" v-for="setItem in item" :key="setItem.label" @click="addFiled(setItem)">
              <i :class="setItem.icon"></i>{{setItem.label}}
            </li>
          </template>
        </ul>
        <div class="rightView">
          <signUpView :questionArr="questionArr"></signUpView>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pageTitle from './components/pageTitle';
import signUpView from './signUp/viewSignUp';
import {getfiledJson} from './signUp/util';
export default {
  components: {
    pageTitle,
    signUpView
  },
  data(){
    return {
      signUpSwtich: false,
      radio: 3,
      setOptions: {
        "基本信息": [
          {icon: 'el-icon-user-solid', label: "姓名", name: 'name'},
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
          {icon: 'el-icon-user-solid', label: "隐私声明"},
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
    }
  },
  created(){
    this.addFiled(this.setOptions["基本信息"][0]);
    this.addFiled(this.setOptions["基本信息"][2]);
  },
  methods: {
    addFiled(info){
      this.questionArr.push(getfiledJson({name: info.name, type: info.type}));
      console.log(this.questionArr);
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
      flex: 1;
    }
  }

</style>
