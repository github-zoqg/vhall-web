<template>
  <div class="add-question">
     <pageTitle title="新建问卷">
        <div class="headBtnGroup">
          <el-button round size="medium" @click="returnBack">返回</el-button>
          <!-- $route.meta.name/material/addQuestion -->
        </div>
      </pageTitle>
      <div class="settingBox">
        <ul class="options">
          <template v-for="(item, key) in setOptions">
            <section class="block" :key="key">{{key}}</section>
            <li :class="{item: true, active: setItem.name && questionArr.some(qes=> qes.name == setItem.name)}" v-for="setItem in item" :key="setItem.label" @click="addFiled(setItem)">
              <icon :icon-class="setItem.icon">{{setItem.label}}</icon>
            </li>
          </template>
        </ul>
        <div class="rightView">
          <fieldSet :questionArr="questionArr"></fieldSet>
          <!-- <component :is="rightComponent" :questionArr="questionArr"></component> -->
          <!-- <i class="closeBtn" v-show="rightComponent=='signUpForm'" @click="rightComponent='fieldSet'">&times;</i> -->
        </div>
      </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import fieldSet from '../signUp/fieldSet';
import {getfiledJson} from '../signUp/util';
export default {
  name: 'question',
  data() {
    return {
      rightComponent: 'fieldSet',
      questionArr: [],
      setOptions: {
        "基本信息": [
          {icon: 'saasicon_xingming', label: "姓名", name: 'name'},
          {icon: 'el-icon-male', label: "性别", name: 'gender'},
          {icon: 'el-icon-birthday', label: "生日", name: 'birthday'},
          {icon: 'el-icon-education', label: "教育水平", name: 'educational'},
          {icon: 'el-icon-message', label: "邮箱", name: 'email'},
          {icon: 'el-icon-location', label: "地域", name: 'regional'},
          {icon: 'el-icon-office-building', label: "公司", name: 'company'},
          {icon: 'el-icon-info', label: "职务", name: 'dust'},
          {icon: 'el-icon-info', label: "行业", name: 'industry'},
        ],
        "题目类型": [
          {icon: 'el-icon-user-solid', label: "单选题", type: 'radio'},
          {icon: 'el-icon-user-solid', label: "多选题", type: 'checkBox'},
          {icon: 'el-icon-tickets', label: "问答题", type: 'input'},
          {icon: 'el-icon-caret-bottom', label: "小结", type: 'inputs'},
        ]
      },
    };
  },
  components: {
    PageTitle,
    fieldSet,
  },
  created() {
    console.log(this.$route.meta, '1111111111111111111');
  },
  methods: {
    addFiled(info) {
      this.questionArr.push(getfiledJson({name: info.name, type: info.type}));
    },
    returnBack() {
      this.$router.push({
        path: `/${this.$route.meta.name}/question`
      });
    }
  },
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
      position: relative;
      .closeBtn{
        width: 32px;
        height: 32px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 28px;
        color: #fff;
        position: absolute;
        right: 50px;
        top: 16px;
        font-size: 32px;
        text-align: center;
        line-height: 26px;
        font-style: normal;
        cursor: pointer;
      }
    }
  }

</style>
