<template>
  <VhallDialog
      title="问卷预览"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="50%">
      <div id="showQuestion"></div>
      <!-- <div class="question-img"></div>
      <div class="question-title">
        <h1>问卷标题</h1>
        <p>问卷简介</p>
      </div>
      <el-form label-width="100px" :model="questionnaireForm">
        <el-form-item :label="item.label" prop="imgUrl" v-for="(item, index) in formDataList" :key="index">
          <el-input v-model="questionnaireForm[item.name]" :placeholder="item.nodes[0].props.placeholder" v-if="item.type=='input'"></el-input>
          <el-radio-group v-model="questionnaireForm[item.name]" v-else-if="item.type=='radio'">
            <el-radio :label="opt.value" v-for="(opt, indexs) in item.nodes[0].children" :key="indexs"></el-radio>
          </el-radio-group>
          <el-select v-model="questionnaireForm[item.name]" placeholder="请选择" v-else-if="item.type=='select'">
            <el-option :label="opt.value" :value="indexs" v-for="(opt, indexs) in item.nodes" :key="indexs"></el-option>
          </el-select>
          <el-checkbox-group v-model="questionnaireForm[item.name]" v-else-if="item.type=='checkBox'">
            <el-checkbox :label="opt.value" v-for="(opt, indexs) in item.nodes[0].children" :key="indexs"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
    </el-form> -->
    </VhallDialog>
</template>
<script>
import { sessionOrLocal } from '@/utils/utils';
export default {
  props: ['questionId'],
  data() {
    return {
      dialogVisible: false,
      questionnaireForm: {},
      formDataList: [
        {
          label: "名字",
          name: "name",
          nodes: [{
            props: {
              placeholder: '请输入姓名'
            },
            value: "姓名"
          }],
          required: true,
          type: "input",
          value: ""
        },
        {
          label: '性别',
          name: "gender",
          nodes: [{
            children: [
              {value: '男'},
              {value: '女'}
            ],
            value: ''
          }],
          required: true,
          type: "radio",
          value: ""
        },
        {
          label: "教育水平",
          name: "educational",
          nodes: [
            {
              value: "博士",
            },
            {
              value: "研究生"
            },
            {
              value: "本科",
            },
            {
              value: "专科"
            },
            {
              value: "其他",
            }
          ],
          required: true,
          type: "select",
          value: "",
        }
      ]
    };
  },
  mounted() {
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
    // this.initQuestion();
  },
  methods: {
    initQuestion() {
      let service = new VHall_Questionnaire_Service({
        auth: {
          appId: 'd317f559', //paas的应用id,必填
          accountId: this.userId, //paas的第三方用户id,必填
          token: 'vhall' //paas的授权token,必填
        },
        isLoadElementCss: true,
        notify: true //是否开启消息提示，非必填,默认是true
      });
      service.$on(VHall_Questionnaire_Const.EVENT.READY, () => {
        service.renderPagePC("#showQuestion", this.questionId, {
          isPreview: true,
          isPc: true
        }); //预览
      })
    }
  }
};
</script>
<style lang="less" scoped>
  .question-img{
    height: 175px;
    background: url('../../common/images/avatar.jpg') no-repeat;
    background-size: cover;
  }
  .el-form{
    padding-bottom: 24px;
  }
  .question-title{
    text-align: center;
    padding-bottom: 20px;
    h1{
      line-height: 40px;
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
    }
    p{
      font-size: 14px;
      color: #1a1a1a;
      text-align: left ;
    }
  }
</style>
