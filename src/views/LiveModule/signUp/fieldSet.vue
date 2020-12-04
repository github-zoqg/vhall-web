<template>
  <div class="fieldSetBox">
    <!-- v-model="list" -->
    <!-- 表单名称、表单简介与表单头图为固定字段 -->
    <section class="viewItem">
      <p class="label">表单名称（必填）</p>
      <el-input
        maxlength="50"
        show-word-limit
        placeholder="请输入表单标题"
        v-model="form_title"
        @change="baseInfoChange('form_title')"
      ></el-input>
    </section>
    <section class="viewItem">
      <p class="label">表单简介</p>
      <el-input
        maxlength="500"
        v-model="form_introduce"
        show-word-limit
        placeholder="请输入表单简介"
        type="textarea"
        :autosize="{ minRows: 5 }"
        resize=none
        @change="baseInfoChange('form_introduce')"
      ></el-input>
    </section>
    <section class="viewItem">
      <p class="label">表单头图</p>
      <upload
        v-model="imageUrl"
        :on-success="productLoadSuccess"
        :restPic="resetBanner"
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
    >
      <!-- 加上v-model即可排序后实时更新数据 -->
      <transition-group type="transition" :name="!drag ? 'flip-list' : null" >
        <li class="viewItem" v-for="(item, index) in renderQuestion" :key="index">
          <p class="label">
            {{ index < 9 ? `0${ index + 1 }` : index + 1 }}.
            <!-- {{item.required ? '（必填）' : ''}} -->
            <template v-if="!item.labelEditable">
              {{item.label}}
            </template>
            <el-input
              v-else
              axlength="50"
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
                @click="privacyAdd(item.nodes, nodeIndex)"
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
                :name="item.id || 'ceshi'"
                v-for="(radioItem, raionIndex) in node.children"
                :key="`${index}-${nodeIndex}-${raionIndex}`"
              >
                {{radioItem.other ? "其他" : ''}}
                <el-input
                  @change="(chooseOptChange(item, radioItem))"
                  maxlength="50"
                  show-word-limit
                  :placeholder="`选项${raionIndex+1}`"
                  v-model="radioItem.value"
                  :class="{noFull: !!radioItem.other, radioInput: true}"
                >
                  <i
                    class="el-icon-remove-outline removeIcon"
                    slot="suffix"
                    @click="deleteOptions(item, raionIndex, 'option')"
                  ></i>
                </el-input>
                <br/>
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
                v-for="(radioItem, raionIndex) in node.children"
                :key="`${index}-${nodeIndex}-${raionIndex}`"
              >
                {{radioItem.other ? "其他" : ''}}
                <el-input
                  maxlength="50"
                  show-word-limit
                  :placeholder="`选项${raionIndex+1}`"
                  v-model="radioItem.value"
                  :class="{noFull: !!radioItem.other, radioInput: true}"
                  @change="chooseOptChange(item, radioItem)"
                >
                  <i
                    class="el-icon-remove-outline removeIcon"
                    slot="suffix"
                    @click="deleteOptions(item, raionIndex, 'option')"
                  ></i>
                </el-input>
                <br/>
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
        this.form_title = newVal.form_title;
        this.form_introduce = newVal.form_introduce;
        this.imageUrl = newVal.form_cover;
      },
      deep: true,
      immediate: true
    }
  },
  data(){
    return {
      webinar_id: this.$route.params.str,
      form_title: '', // 基本信息——表单名称
      form_introduce: '', // 基本信息——表单简介
      drag: false,
      signUpSwtich: false,
      radio: 3,
      imageUrl: 'sys/img_url/c7/b4/c7b43630a8699dc2608f846ff92d89d0.png',
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
  methods: {
    // 保存表单
    sureQuestionnaire() {
      if (!this.form_title) {
        this.$message.error('请填写表单名称！');
      } else {
        this.$message.success('保存成功！');
      }
    },
    // 添加一个题目选项
    addOption(data, other){
      let itemType = 0;
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
        options.push(colneChild);
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
      console.log(question);
      this.questionEdit({
        question_id: question.question_id,
        subject: question.label,
      });
    },
    // 下拉题目选项 subject 改变
    selectOptChange(question, node, isSelect, isPrivacy) {
      // 只有 select 才可以更改
      if (isSelect) {
        const options = {
          item_id: node.item_id,
          subject: node.value,
          question_id: item.question_id
        };
        this.optionEdit(options);
      }
      if (isPrivacy) {
        const options = {
          webinar_id: this.webinar_id,
          privacy_id: node.privacy_id,
          [node.key]: node.value
        };
        // 更改隐私协议
        this.$fetch('regRrivacyUpdate', options)
          .then(res => console.log(res))
          .catch(err => consoel.log(err));
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
      this.$fetch('regQDelete', {
        question_id: arr[index].question_id
      }).then(res => {
        arr.splice(index, 1);
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
    },
    // 删除一个题目选项
    deleteOptions(item, index, type){
      console.log(item, index, type);
      // 删除一个隐私协议选项
      if(type === 'privacy'){
        // 隐私协议删除两个元素 且不能有数量限制
        console.log(123);
        let reg = new RegExp(`(和${item.nodes[index].value})`);
        item.nodes[0].value = item.nodes[0].value.replace(reg, '');
        item.nodes.splice(index, 2);
        console.log(item.nodes);
        // 删除隐私协议接口
        this.$fetch('regRrivacyDelete', {
          webinar_id: this.webinar_id,
          privacy_id: item.nodes[index].privacy_id
        }).then(res => { console.log(res); })
        .catch(err => { console.log(err); });
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
        console.log(item);
        // 普通选项删除
        if(item.nodes[0].children.length == 2){
          return this.$message.error('请至少保留两个选项');
        }
        // 删除其他题目中的一个选项
        this.$fetch('regQOptionDelete', {
          item_id: item.nodes[0].children[index].item_id,
          question_id: item.question_id
        }).then(res => {
          console.log(res);
          item.nodes[0].children.splice(index, 1);
        }).catch(err => { console.log(err); });

      }
    },
    privacyAdd(nodes){
      let privacy1 = nodes[1].value;
      if(!privacy1 || !nodes[0].value.match(privacy1)){
        return this.$message.error('请完善可点击文字');
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
      this.fetch('regRrivacyAdd', {
        webinar_id: this.webinar_id,
        content: '',
        color_text: '',
        url: ''
      }).then(res => { console.log(res); })
        .catch(err => { consoel.log(ree); });
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
      console.log(item[3] &&item[3].value, text);
      if(matchPrivacy2){
        let reg = new RegExp(`(${matchPrivacy2[0]})`, "g");
        console.log(reg);
        text = text.replace(reg, `<a href="${item[4].value}" target="_blank">$1</a>`);
      }else{
        item[3] && (item[3].value = '');
      }

      return text;
    },
    // beforeUploadHnadler(file){
    //   console.log(file);
    //   const typeList = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'];
    //   const isType = typeList.includes(file.type.toLowerCase());
    //   const isLt2M = file.size / 1024 / 1024 < 2;
    //   if (!isType) {
    //     this.$message.error(`上传封面图片只能是 ${typeList.join('、')} 格式!`);
    //   }
    //   if (!isLt2M) {
    //     this.$message.error('上传封面图片大小不能超过 2MB!');
    //   }
    //   return isType && isLt2M;
    // },
    productLoadSuccess(res, file) {
      console.log(res, file);
      if (res.data.file_url) {
        // 文件上传成功，保存信息
        this.imageUrl = Env.staticLinkVo.uploadBaseUrl + res.data.file_url;
        console.log(this.imageUrl);
        this.$emit('setBaseInfo', { form_cover: res.data.file_url });
      }
    },
    // 删除头图
    deleteBanner() {
      this.imageUrl = '';
      this.$emit('setBaseInfo', { form_cover: this.imageUrl });
    },
    // 重置头图
    resetBanner(event){
      this.imageUrl= 'sys/img_url/c7/b4/c7b43630a8699dc2608f846ff92d89d0.png';
      this.$emit('setBaseInfo', { form_cover: this.imageUrl });
    },
    // 题目顺序修改
    sortChange(val, arr){
      console.log('sortChange-->', this.renderQuestion);
      // 同步父组件数据
      this.$emit('update:questionArr', this.renderQuestion);
      let question_ids = this.renderQuestion.reduce((acc, curr) => {
        return acc + curr.question_id + ',';
      }, '');
      question_ids.substring(0, question_ids.length - 1);
      // console.log(question_ids);
      // console.log(question_ids.splice(question_ids.index, 1));

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
      console.log(question);
      const options = {
        question_id: question.question_id,
        options: {
          open_verify: question.phoneValide ? 1 : 0
        }
      };
      console.log(question);
      this.questionEdit(options);
    },
    // 是否必填开关
    requiredSwitchChange(question) {
      console.log(question);
      const options = {
        question_id: question.question_id,
        is_must: question.required ? 1 : 0
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
      width: 100%;
    }
    .el-checkbox:last-child{
      margin-right: 30px;
    }
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
}
/deep/ .box .avatar {
  width: auto;
}
/deep/ .el-textarea__inner {
  font-family: Arial, Arial, 'Microsoft Yahei';
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
