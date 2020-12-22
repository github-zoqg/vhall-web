<template>
  <div class="fieldSetBox">
    <!-- v-model="list" -->
    <!-- 表单名称、表单简介与表单头图为固定字段 -->
    <section class="viewItem">
      <p class="label">表单名称</p>
      <el-input
        maxlength="50"
        show-word-limit
        placeholder="请输入表单标题"
        v-model="title"
        @change="baseInfoChange('title')"
      ></el-input>
    </section>
    <section class="viewItem">
      <p class="label">表单简介</p>
      <el-input
        maxlength="500"
        v-model="intro"
        show-word-limit
        placeholder="请输入表单简介"
        type="textarea"
        :autosize="{ minRows: 5 }"
        resize=none
        @change="baseInfoChange('intro')"
      ></el-input>
    </section>
    <section class="viewItem">
      <p class="label">表单头图</p>
      <upload
        :domain_url="imageUrl"
        v-model="imageUrl"
        :on-success="productLoadSuccess"
        :before-upload="beforeUploadHandler"
        :restPic="true"
        @delete="deleteBanner"
      >
        <p slot="tip">最佳头图尺寸：840*240px <br/>小于2MB(支持jpg、gif、png、bmp)</p>
      </upload>
    </section>
    <!-- 表单名称、表单简介与表单头图为固定字段 -->
    <draggable
      class="list-group"
      tag="ul"
      handle=".moveBtn"
      v-bind="dragOptions"
      v-model="renderQuestion"
      @change="sortChange"
      @start="drag = true"
      @end="drag = false"
      :move="onMove"
    >
      <!-- 加上v-model即可排序后实时更新数据 -->
      <transition-group type="transition" :name="!drag ? 'flip-list' : null" >
        <li class="viewItem" v-for="(item, index) in renderQuestion" :key="item.question_id">
          <p class="label">
            {{ index | numFormmat }}.
            <!-- {{item.required ? '（必填）' : ''}} -->
            <template v-if="!item.labelEditable">
              {{item.label}}
            </template>
            <el-input
              v-else
              maxlength="60"
              show-word-limit
              placeholder="请输入题目"
              v-model="item.label"
              class="radioInput"
              @change="subjectChange(item)"
            ></el-input>
          </p>
          <template v-for="(node, nodeIndex) in item.nodes">

            <!-- 输入框类型 || 设置表单时下拉框类型 -->
            {{node.other ? "其他" : ''}}
            <el-input
              v-if="item.type=='input' || item.type=='select'"
              v-model="node.value"
              v-bind="node.props"
              show-word-limit
              :type="node.key == 'url'? 'textarea' : 'text'"
              :autosize="node.key == 'url' ? { minRows: 2 } : ''"
              :maxlength="node.key == 'url'? '200' : '60'"
              :key='`${index}-${nodeIndex}`'
              @change="selectOptChange(item, node, item.type=='select', item.privacy)"
            >
              <i
                class="el-icon-remove-outline removeIcon"
                slot="suffix"
                v-if="!!node.canRemove"
                @click="deleteOptions(item, nodeIndex, item.privacy ? 'privacy' : 'select')"
              ></i>
              <i
                class="el-icon-circle-plus-outline removeIcon"
                slot="suffix"
                v-if="!!node.privacyAdd && item.nodes.length < 4"
                @click="privacyAdd(item.nodes, item)"
              ></i>
            </el-input>
            <!-- 单选类型 -->
            <el-radio-group
              v-model="item.value"
              v-bind="node.props"
              v-else-if="item.type=='radio'"
              :key='`${index}-${nodeIndex}`'
            >
              <el-radio
                disabled
                :name="item.id"
                v-for="(radioItem, raionIndex) in node.children"
                :key="`${index}-${nodeIndex}-${raionIndex}`"
                :label="radioItem.item_id"
              >
                <el-input
                  @change="(chooseOptChange(item, radioItem))"
                  maxlength="60"
                  show-word-limit
                  placeholder="选项"
                  v-model="radioItem.value"
                  class="radioInput"
                >
                  <i
                    class="el-icon-remove-outline removeIcon"
                    slot="suffix"
                    @click="deleteOptions(item, raionIndex, 'option')"
                  ></i>
                </el-input>
                <br/>
                <el-input
                  class="other-input"
                  placeholder="观众输入区"
                  disabled
                  v-if="radioItem.other"
                  :maxlength="60"
                  show-word-limit
                  :key='`${index}-${nodeIndex}disabled`'
                ></el-input>
              </el-radio>
            </el-radio-group>
            <!-- 复选框类型 -->
            <el-checkbox-group
              v-model="item.value"
              v-bind="node.props"
              v-else-if="item.type=='checkBox'"
              :key='`${index}-${nodeIndex}`'
            >
              <el-checkbox
                disabled
                v-for="(radioItem, raionIndex) in node.children"
                :key="`${index}-${nodeIndex}-${raionIndex}`"
                :label="radioItem.item_id"
                :name="item.id"
                :class="{'other-checkbox': radioItem.other}"
              >
                <el-input
                  maxlength="60"
                  show-word-limit
                  placeholder="选项"
                  v-model="radioItem.value"
                  class="radioInput"
                  @change="chooseOptChange(item, radioItem)"
                >
                  <i
                    class="el-icon-remove-outline removeIcon"
                    slot="suffix"
                    @click="deleteOptions(item, raionIndex, 'option')"
                  ></i>
                </el-input>
                <br/>
                <el-input
                  class="other-input"
                  placeholder="观众输入区"
                  disabled
                  v-if="radioItem.other"
                  :maxlength="60"
                  show-word-limit
                  :key='`${index}-${nodeIndex}disabled`'
                ></el-input>
              </el-checkbox>
            </el-checkbox-group>
          </template>
          <div class="previewPrivacy" v-if="item.privacy">
            <p>预览效果</p>
            <el-checkbox>
              <p v-html="privacyFormatter(item.nodes)"></p>
            </el-checkbox>
          </div>
          <!-- 底部按钮 -->
          <div class="bottomBtn" v-if="!!item.bottomBtn">
            <div class="addBtn">
              <el-button
                type="text"
                v-if="item.bottomBtn.includes('addBtn')"
                @click="addOption(item)"
              ><i class="el-icon-plus"></i>添加选项</el-button>
              <template v-if="item.bottomBtn.includes('addOther')">
                <span class="line"></span>
                <el-button
                  el-button
                  type="text"
                  @click="addOption(item, 'other')"
                ><i class="el-icon-plus"></i>添加其他</el-button>
              </template>
            </div>
            <i
              class="el-icon-delete"
              v-if="item.bottomBtn.includes('delete')"
              @click="deleteQuestion(questionArr, index)"
            ></i>
            <i
              class="el-icon-rank moveBtn"
              v-if="item.bottomBtn.includes('move')"
            ></i>
            <el-switch
              @change="requiredSwitchChange(item)"
              v-if="item.bottomBtn.includes('requireSwtich')"
              class="swtich"
              :width='30'
              :height="16"
              v-model="item.required"
              active-color="#FB3A32"
              inactive-color="#CECECE"
              inactive-text="必填项">
            </el-switch>
            <el-switch
              @change="phoneSwitchChange(item)"
              v-if="item.bottomBtn.includes('phoneValid')"
              class="swtich"
              :width='30'
              :height="16"
              v-model="item.phoneValide"
              active-color="#FB3A32"
              inactive-color="#CECECE"
              inactive-text="短信验证">
            </el-switch>
          </div>
          <!-- 底部按钮 -->
        </li>
      </transition-group>
    </draggable>
    <section class="viewItem sureBtn">
      <el-button round type="primary" @click="sureQuestionnaire">保存</el-button>
    </section>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import upload from '@/components/Upload/main';
import Env from "@/api/env";
export default {
  components:{
    draggable,
    upload
  },
  props: {
    questionArr: {
      type: Array,
      default: ()=> []
    },
    baseInfo: {
      type: Object,
    }
  },
  watch:{
    questionArr: {
      handler(newVal){
        this.renderQuestion = newVal;
      },
      deep: true,
      immediate: true
    },
    baseInfo: {
      handler(newVal){
        this.title = newVal.title;
        this.intro = newVal.intro;
        this.imageUrl = `http:${Env.staticLinkVo.uploadBaseUrl}${newVal.cover ? newVal.cover : 'sys/img_url/c7/b4/c7b43630a8699dc2608f846ff92d89d0.png'}`;
      },
      deep: true,
    }
  },
  data(){
    return {
      webinar_id: this.$route.params.str,
      title: '', // 基本信息——表单名称
      intro: '', // 基本信息——表单简介
      drag: false,
      signUpSwtich: false,
      radio: 3,
      imageUrl: '',
      renderQuestion: []
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    },
  },
  filters: {
    numFormmat(val){
      return val < 9 ? `0${ val + 1 }` : val + 1
    }
  },
  methods: {
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      if (relatedElement.reqType === 0) {
        if (relatedElement.default_type === 1 || relatedElement.default_type === 2) {
          return false
        }
      } else if (relatedElement.reqType === 6) {
        return false
      } else {
        return true
      }
    },
    // 保存表单
    sureQuestionnaire() {
      this.$message.success('保存成功');
    },
    // 添加一个题目选项
    addOption(data, other){
      console.log(data);
      let itemType = other ? 1: 0;
      let options = data.type != 'input' && data.type != 'select' ? data.nodes[0].children : data.nodes;
      let colneChild = JSON.parse(JSON.stringify(options[options.length - 1]));
      if(data.type == 'input'){
        if(other){
          itemType = 1;
          if(colneChild.props.class){
            !colneChild.props.class.includes('noFull') && colneChild.props.class.push('noFull');
          }else{
            colneChild.props.class = ['noFull'];
          }
        }else{
          colneChild.props.class && (colneChild.props.class = colneChild.props.class.filter(item=> item!='noFull'));
        }
      }
      colneChild.props && (colneChild.props.disabled = false);
      colneChild.other = !!other;
      colneChild.value = "";

      this.$fetch('regQOptionAdd', {
        question_id: data.question_id,
        item_type: itemType
      }).then(res => {
        options.push({
          ...colneChild,
          value: res.data.subject,
          item_id: res.data.id
        });
      }).catch(err => { console.log(err); });
    },
    // 题目属性改变（通用）
    questionEdit(options) {
      this.$fetch('regQEdit', options)
        .then(res => { console.log(res); })
        .catch(err => { console.log(err); });
    },
    // 选项编辑（通用）
    optionEdit(options) {
      this.$fetch('regQOptionUpdate', options)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    },
    // 题目 title 改变
    subjectChange(question) {
      this.questionEdit({
        question_id: question.question_id,
        subject: question.label,
        options: JSON.stringify(question.options),
        is_must: question.required ? 1 : 0
      });
    },
    // 下拉题目选项 subject 改变
    selectOptChange(question, node, isSelect, isPrivacy) {
      // 只有 select 才可以更改
      if (isSelect) {
        const options = {
          item_id: node.item_id,
          subject: node.value,
          question_id: question.question_id
        };
        this.optionEdit(options);
      }
      // 如果改变的是隐私声明
      if (isPrivacy) {
        // 如果更改默认添加的隐私声明，调用更新题目接口
        if (!node.privacy_id) {
          const options = {
            question_id: question.question_id,
            subject: question.label,
            is_must: question.required ? 1 : 0,
            options: JSON.stringify({
              content: question.nodes[0].value,
              color_text: question.nodes[1].value,
              url: question.nodes[2].value,
            })
          };
          this.questionEdit(options);
        } else {
          // 如果更改自定义添加的隐私声明，调用更新隐私协议的接口
          let options = {
            webinar_id: this.webinar_id,
            privacy_id: node.privacy_id,
            content: question.nodes[0].value,
            color_text: question.nodes[3].value,
            url: question.nodes[4].value,
          };
          // 更改隐私协议
          this.$fetch('regRrivacyUpdate', options)
            .then(res => console.log(res))
            .catch(err => consoel.log(err));
        }
      }
    },
    // 单选\多选题目选项 subject 改变
    chooseOptChange(item, radioItem) {
      const options = {
        item_id: radioItem.item_id,
        subject: radioItem.value,
        question_id: item.question_id
      };
      this.optionEdit(options);
    },
    // 删除一个题目
    deleteQuestion(arr, index) {
      this.$confirm('删除后已收集信息会被清空，确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        this.$fetch('regQDelete', {
          question_id: arr[index].question_id
        }).then(res => {
          arr.splice(index, 1);
          console.log(res);
        }).catch(err => {
          console.log(err);
        });
      })
    },
    // 删除一个题目选项
    deleteOptions(item, index, type){
      // 删除一个隐私协议选项
      if(type === 'privacy'){
        // 隐私协议删除两个元素 且不能有数量限制
        let reg = new RegExp(`(和${item.nodes[3].value})`);
        item.nodes[0].value = item.nodes[0].value.replace(reg, '');

        // 删除隐私协议接口
        this.$fetch('regRrivacyDelete', {
          webinar_id: this.webinar_id,
          privacy_id: item.nodes[index].privacy_id
        }).then(res => {
          // 删除成功调用题目编辑接口更新 content
          const options = {
            question_id: item.question_id,
            subject: item.label,
            is_must: item.required ? 1 : 0,
            options: JSON.stringify({
              content: item.nodes[0].value,
              color_text: item.nodes[1].value,
              url: item.nodes[2].value,
            })
          };
          this.questionEdit(options);
        }).catch(err => { console.log(err); });

        item.nodes.splice(index, 2);
        return;
      }else if(type === 'select') {
        if(item.nodes.length == 2){
          return this.$message.error('请至少保留两个选项');
        }
        // 删除一个下拉框选项
        this.$fetch('regQOptionDelete', {
          item_id: item.nodes[index].item_id,
          question_id: item.question_id
        }).then(res => { console.log(res); })
          .catch(err => { console.log(err); });
        item.nodes.splice(index, 1);
      } else {
        // 普通选项删除
        if(item.nodes[0].children.length == 2){
          return this.$message.error('请至少保留两个选项');
        }
        // 删除其他题目中的一个选项
        this.$fetch('regQOptionDelete', {
          item_id: item.nodes[0].children[index].item_id,
          question_id: item.question_id
        }).then(res => {
          item.nodes[0].children.splice(index, 1);
        }).catch(err => { console.log(err); });

      }
    },
    // 添加一个隐私协议
    privacyAdd(nodes, question){
      let privacy1 = nodes[1].value;
      if(!privacy1 || !nodes[0].value.match(privacy1)){
        return this.$message.error('请完善可点击文字');
      } else if (nodes[0].value.length >= 53) {
        return this.$message.error('添加隐私协议会超出预览字数，请删减后再添加');
      }
      let cloneNode = JSON.parse(JSON.stringify(nodes[1]));
      let cloneNode2 = JSON.parse(JSON.stringify(nodes[2]));
      cloneNode.value = "《隐私声明2》";
      cloneNode.privacyAdd = false;
      cloneNode.canRemove = true;
      cloneNode2.value = "";
      let reg = new RegExp(`(${privacy1})`);
      nodes[0].value = nodes[0].value.replace(reg, `$1和${cloneNode.value}`);
      nodes.push(cloneNode);
      nodes.push(cloneNode2);
      this.$fetch('regRrivacyAdd', {
        webinar_id: this.webinar_id,
        content: nodes[0].value,
        color_text: '《隐私声明2》',
        url: ''
      }).then(res => {
        nodes[3].privacy_id = res.data.privacy_id;
        nodes[4].privacy_id = res.data.privacy_id;
        // 添加成功之后需要调用更新问题接口，更新问题的 content
        const options = {
          question_id: question.question_id,
          subject: question.label,
          is_must: question.required ? 1 : 0,
          options: JSON.stringify({
            content: nodes[0].value,
            color_text: nodes[1].value,
            url: nodes[2].value,
          })
        };
        this.questionEdit(options);
      }).catch(err => { consoel.log(ree); });
    },
    privacyFormatter(item){
      let text = JSON.parse(JSON.stringify(item[0].value));
      // let privacy =
      let matchPrivacy1 = item[1].value.trim() ? text.match(item[1].value) : null;
      if(matchPrivacy1){
        let reg = new RegExp(`(${matchPrivacy1[0]})`);
        text = text.replace(reg, `<a href="${item[2].value}" target="_blank">$1</a>`);
      }else{
        item[1].value = '';
      }
      let matchPrivacy2 = (item[3] && item[3].value.trim()) ? text.match(item[3].value) : null;
      if(matchPrivacy2){
        let reg = new RegExp(`(${matchPrivacy2[0]})`, "g");
        text = text.replace(reg, `<a href="${item[4].value}" target="_blank">$1</a>`);
      }else{
        item[3] && (item[3].value = '');
      }

      return text;
    },
    // 上传格式校验
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`上传表单头图只能是 ${typeList.join('、')} 格式!`);
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传表单头图大小不能超过 2MB!');
        return false;
      }
      return isType && isLt2M;
    },
    productLoadSuccess(res, file) {
      if (res.data.file_url) {
        // 文件上传成功，保存信息
        this.imageUrl = res.data.file_url;
        this.$emit('setBaseInfo', { cover: res.data.file_url });
      }
    },
    // 删除头图
    deleteBanner() {
      this.imageUrl = 'sys/img_url/c7/b4/c7b43630a8699dc2608f846ff92d89d0.png';
      this.$emit('setBaseInfo', { cover: this.imageUrl });
    },
    // 题目顺序修改
    sortChange(val, arr){
      console.log('sortChange-->', this.renderQuestion);
      // 同步父组件数据
      this.$emit('update:questionArr', this.renderQuestion);
      let question_ids = this.renderQuestion.reduce((acc, curr) => {
        return acc + curr.question_id + ',';
      }, '');
      question_ids = question_ids.substring(0, question_ids.length - 1);

      // 以问题数组的 index + 1 作为顺序提交更新顺序接口
      this.$fetch('regQSort', {
        webinar_id: this.webinar_id,
        question_ids
      }).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
    },
    // 标题修改
    baseInfoChange(paramName) {
      const obj = {};
      obj[paramName] = this[paramName];
      this.$emit('setBaseInfo', obj);
    },
    // 短信验证开关
    phoneSwitchChange(question) {
      const options = {
        question_id: question.question_id,
        options: JSON.stringify({
          open_verify: question.phoneValide ? 1 : 0
        }),
        subject: question.label,
        is_must: question.required ? 1: 0
      };
      this.questionEdit(options);
    },
    // 是否必填开关
    requiredSwitchChange(question) {
      const options = {
        question_id: question.question_id,
        is_must: question.required ? 1 : 0,
        subject: question.label
      };
      this.questionEdit(options);
    }
  },
};
</script>

<style lang="less" scoped>
.fieldSetBox {
  width: 100%
}
.viewItem{
  margin-bottom: 16px;
  .label{
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #1A1A1A;
    margin-bottom: 9px;
    // text-indent: 8px;
  }
  .noFull{
    width: calc(100% - 40px);
  }
  padding: 20px 24px;
  background: #fff;
  .el-checkbox-group{
    width: 100%;
    padding-left: 20px;
    .el-checkbox{
      display: block;
      margin-top: 20px;
    }
    /deep/ .el-checkbox__label{
      width: calc(100% - 14px);
    }
  }
  .el-radio-group{
    width: 100%;
    padding-left: 20px;
    .el-radio{
      display: block;
      margin-top: 20px;
      margin-right: 0px;
      /deep/ .el-radio__label {
        .radioInput {
          width: calc(100% - 24px);
        }
        .other-input {
          margin-top: 10px;
        }
      }
    }
  }
  /deep/ .el-input .el-input__count .el-input__count-inner {
    background: inherit;
  }
  .el-checkbox {
    margin-right: 0px;
  }
  .other-checkbox {
    /deep/ .el-checkbox__input {
      position: absolute;
      top: 11px;
    }
    /deep/ .el-checkbox__label {
      padding-left: 24px;
      width: 100%;
    }
    .other-input {
      margin-top: 10px;
    }
  }
  .bottomBtn{
    margin-top: 23px;
    text-align: right;
    overflow: hidden;
    .addBtn{
      float: left;
      i{
        margin-left: 0px;
        color: #3562FA;
        font-weight: bold;
        font-size: 14px;

      }
      .el-button{
        margin-left: 0;
      }
      .line{
        width: 2px;
        height: 13px;
        background: #999999;
        display: inline-block;
        margin: 0 12px;
        vertical-align: middle;
      }
    }
    .moveBtn{
      cursor: move;
    }
    i{
      font-size: 18px;
      color: #666666;
      margin-left: 25px;
      cursor: pointer;
    }
    .swtich{
      vertical-align: text-top;
      margin-left: 25px;
    }
    /deep/ .el-switch__label{
      font-size: 14px;
      color: #666666;
    }
  }
  .selectInput{
    margin-bottom: 16px;
  }
  /deep/ .box .avatar {
    width: auto;
  }
  .el-textarea {
    /deep/ .el-textarea__inner {
      font-family: @fontRegular;
    }
    /deep/ .el-input__count {
      font-size: 14px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #666666;
    }
  }
}
.sureBtn{
  background: none;
  text-align: left;
  .el-button{
    padding: 12px 50px;
  }
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
.radioInput:not(.noFull){
  /deep/ .el-input__inner{
    border-color: transparent !important;
    &:focus{
      background: #F7F7F7;
      /deep/ & + .el-input__suffix .el-input__count{
        visibility: visible;
      }
    }
  }
  /deep/ .el-input__count{
    visibility: hidden;
  }


}
.radioInput,.selectInput{
  &:hover .removeIcon{
    display: inline-block;
  }
}
.removeIcon{
  font-weight: bold;
  font-size: 16px;
  color: #666666;
  vertical-align: middle;
  display: none;
  line-height: 34px;
  cursor: pointer;
}
.previewPrivacy{
  font-size: 14px;
  color: #666;
  p{
    margin: 16px 0 8px 0;
  }
  a{
    color: #337ab7;
    &:link{
      color: #337ab7;
    }
    &:active{
      color: #337ab7;
    }
  }
}
</style>
