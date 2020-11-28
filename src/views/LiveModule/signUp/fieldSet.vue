<template>
  <div>
    <!-- v-model="list" -->
    <!-- 表单名称、表单简介与表单头图为固定字段 -->
    <section class="viewItem">
      <p class="label">{{ routeName==='signup' ? '表单名称（必填）' : '问卷名称'}}</p>
      <el-input maxlength="50" show-word-limit :placeholder="routeName==='signup' ? '请输入表单标题' : '请输入问卷标题'" v-model="designation"></el-input>
    </section>
    <section class="viewItem">
      <p class="label">{{ routeName==='signup' ? '表单简介' : '问卷简介'}}</p>
      <el-input maxlength="500" v-model="introduction" show-word-limit :placeholder="routeName==='signup' ? '请输入表单简介' : '请输入问卷简介'" type="textarea" :autosize="{ minRows: 5 }" resize=none></el-input>
    </section>
    <section class="viewItem" v-if="routeName==='signup'">
      <p class="label">表单头图</p>
      <upload
        v-model="imageUrl"
        :before-upload="beforeUploadHnadler"
        :restPic="resetBanner">
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
            <!-- {{item.required ? '（必填）' : ''}} -->
            <template v-if="!item.labelEditable">
              {{item.label}}
            </template>
            <el-input v-else maxlength="50" show-word-limit placeholder="请输入题目" v-model="item.label" class="radioInput"></el-input>
          </p>
          <template v-for="(node, nodeIndex) in item.nodes">

            <!-- 输入框类型 || 设置表单时下拉框类型 -->
            {{node.other ? "其他" : ''}}
            <el-input v-if="item.type=='input' || item.type=='select'" v-model="node.value" v-bind="node.props" :key='`${index}-${nodeIndex}`'>
              <i class="el-icon-remove-outline removeIcon" slot="suffix" v-if="!!node.canRemove" @click="deleteOptions(item.nodes, nodeIndex, item.privacy)"></i>
              <i class="el-icon-circle-plus-outline removeIcon" slot="suffix" v-if="!!node.privacyAdd && item.nodes.length < 4" @click="privacyAdd(item.nodes, nodeIndex)"></i>
            </el-input>
            <!-- 单选类型 -->
            <el-radio-group v-model="item.value" v-bind="node.props" v-else-if="item.type=='radio'" :key='`${index}-${nodeIndex}`'>
              <el-radio v-for="(radioItem, raionIndex) in node.children" :key="`${index}-${nodeIndex}-${raionIndex}`">
                {{radioItem.other ? "其他" : ''}}
                <el-input maxlength="50" show-word-limit :placeholder="`选项${raionIndex+1}`" v-model="radioItem.value" :class="{noFull: !!radioItem.other, radioInput: true}">
                  <i class="el-icon-remove-outline removeIcon" slot="suffix" @click="deleteOptions(node.children, raionIndex)"></i>
                </el-input>
                <br/>
              </el-radio>
            </el-radio-group>
            <!-- 复选框类型 -->
            <el-checkbox-group v-model="item.value" v-bind="node.props" v-else-if="item.type=='checkBox'" :key='`${index}-${nodeIndex}`'>
              <el-checkbox v-for="(radioItem, raionIndex) in node.children" :key="`${index}-${nodeIndex}-${raionIndex}`">
                {{radioItem.other ? "其他" : ''}}
                <el-input maxlength="50" show-word-limit :placeholder="`选项${raionIndex+1}`" v-model="radioItem.value" :class="{noFull: !!radioItem.other, radioInput: true}">
                  <i class="el-icon-remove-outline removeIcon" slot="suffix" @click="deleteOptions(node.children, raionIndex)"></i>
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
              <el-button type="text" v-if="item.bottomBtn.includes('addBtn')"  @click="addOption(item)"><i class="el-icon-plus"></i>添加选项</el-button>
              <template v-if="item.bottomBtn.includes('addOther')">
                <span class="line"></span>
                <el-button el-button type="text" @click="addOption(item, 'other')"><i class="el-icon-plus"></i>添加其他</el-button>
              </template>
            </div>
            <i class="el-icon-delete" v-if="item.bottomBtn.includes('delete')" @click="deleteOptions(questionArr, index)"></i>
            <i class="el-icon-rank moveBtn" v-if="item.bottomBtn.includes('move')"></i>
            <el-switch
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
    <section class="viewItem sureBtn" v-if="routeName !=='signup'">
      <el-button round type="primary" @click="sureQuestionnaire">保存</el-button>
    </section>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import upload from '@/components/Upload/main';
export default {
  components:{
    draggable,
    upload
  },
  props: {
    questionArr: {
      type: Array,
      default: ()=> []
    }
  },
  watch:{
    questionArr: {
      handler(newVal){
        this.renderQuestion = newVal;
      },
      deep: true,
      immediate: true
    }
  },
  data(){
    return {
      // designation: '', //名称
      // introduction: '', // 简介
      drag: false,
      signUpSwtich: false,
      radio: 3,
      imageUrl: '//cnstatic01.e.vhall.com/static/images/signup-form/form-head-new1.png',
      renderQuestion: []
    };
  },
  created() {
    this.routeName = this.$route.name;
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
    designation() {
      return this.$route.name === 'addQuestion' ? '问卷名称' : '';
    },
    introduction() {
      return this.$route.name === 'addQuestion' ? '问卷简介' : '';
    }
  },
  methods: {
    // 保存问卷
    sureQuestionnaire() {
      if (!this.questionArr.length) {
        this.$message.error('请添加题目');
      }
      console.log(this.questionArr);
      // this.$emit("sureBtn", )
    },
    addOption(data, other){
      let options = data.type != 'input' && data.type != 'select' ? data.nodes[0].children : data.nodes;
      let colneChild = JSON.parse(JSON.stringify(options[options.length - 1]));
      if(data.type == 'input'){
        if(other){
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
      options.push(colneChild);
    },
    deleteOptions(arr, index, privacy){
      console.log(arr, index, privacy);
      if(privacy){
        // 隐私协议删除两个 且不能有数量限制
        console.log(123);
        let reg = new RegExp(`(和${arr[index].value})`);
        arr[0].value = arr[0].value.replace(reg, '');
        arr.splice(index, 2);
        return;
      }
      if(arr.length == 2){
        // 普通选项删除一个
        return this.$message.error('请至少保留两个选项');
      }
      arr.splice(index, 1);
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
    beforeUploadHnadler(file){
      console.log(file);
      const typeList = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'];
      const isType = typeList.includes(file.type.toLowerCase());
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`上传封面图片只能是 ${typeList.join('、')} 格式!`);
      }
      if (!isLt2M) {
        this.$message.error('上传封面图片大小不能超过 2MB!');
      }
      return isType && isLt2M;
    },
    resetBanner(event){
      this.imageUrl= '//cnstatic01.e.vhall.com/static/images/signup-form/form-head-new1.png';
    },
    sortChange(val, arr){
      console.log('sortChange-->', this.renderQuestion);
      this.$emit('update:questionArr', this.renderQuestion);
    }
  },
};
</script>

<style lang="less" scoped>
.viewItem{
  margin-bottom: 16px;
  .label{
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
.sureBtn{
  text-align: center;
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
