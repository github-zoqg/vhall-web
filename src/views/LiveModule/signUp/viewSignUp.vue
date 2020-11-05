<template>
  <div>
    <!-- v-model="list" -->
    <!-- 表单名称与表单简介为固定字段 -->
    <section class="viewItem">
      <p class="label">表单名称（必填）</p>
      <el-input maxlength="50" show-word-limit placeholder="请输入表单标题"></el-input>
    </section>
    <section class="viewItem">
      <p class="label">表单简介</p>
      <el-input maxlength="500" show-word-limit placeholder="请输入表单简介" type="textarea" autosize resize=none></el-input>
    </section>
    <!-- 表单名称与表单简介为固定字段 -->
    <draggable
      class="list-group"
      tag="ul"
      v-bind="dragOptions"
      @start="drag = true"
      @end="drag = false"
    >
      <transition-group type="transition" :name="!drag ? 'flip-list' : null" >
        <li class="viewItem" v-for="item in renderData" :key="item.id">
          <p class="label">{{item.label}} {{item.required ? '（必填）' : ''}}</p>
          <template v-for="node in item.nodes">
            <!-- 输入框类型 -->
            <el-input v-if="node.type=='input'" v-model="item.value" v-bind="node.props" :key='node.id'></el-input>
            <!-- 单选类型 -->
            <el-radio-group v-model="item.value" v-bind="node.props" v-else-if="node.type=='radio'" :key='node.id'>
              <el-radio v-for="radioItem in node.children" :key="radioItem.id">
                <el-input maxlength="50" show-word-limit placeholder="选项" :value="radioItem.value"></el-input>
              </el-radio>
            </el-radio-group>
            <!-- 复选框类型 -->
            <el-checkbox-group v-model="item.value" v-bind="node.props" v-else-if="node.type=='checkBox'" :key='node.id'>
              <el-checkbox v-for="radioItem in node.children" :key="radioItem.id">
                {{radioItem.other ? "其他" : ''}}
                <el-input maxlength="50" show-word-limit placeholder="选项" :value="radioItem.value" :class="{noFull: !!radioItem.other}"></el-input>
              </el-checkbox>
            </el-checkbox-group>
          </template>
          <div class="bottomBtn" v-if="!!item.bottomBtn">


            <template v-for="btn in item.bottomBtn">
              <div class="addBtn" v-if="btn=='addBtn'" :key="btn">
                <el-button type="text" @click="addOption(item)"><i class="el-icon-plus"></i>添加选项</el-button>
                <span class="line"></span>
                <el-button el-button type="text" @click="addOption(item, 'other')"><i class="el-icon-plus"></i>添加其他</el-button>
              </div>
              <i class="el-icon-delete" v-else-if="btn=='delete'" :key="btn"></i>
              <i class="el-icon-rank" v-else-if="btn=='move'" :key="btn"></i>
              <el-switch
                v-else-if="btn=='requireSwtich'"
                :key="btn"
                class="swtich"
                :width='30'
                :height="16"
                v-model="item.required"
                active-color="#FB3A32"
                inactive-color="#CECECE"
                inactive-text="必填项">
              </el-switch>
              <el-switch
                v-else-if="btn=='phoneValide'"
                :key="btn"
                class="swtich"
                :width='30'
                :height="16"
                v-model="item.phoneValide"
                active-color="#FB3A32"
                inactive-color="#CECECE"
                inactive-text="短信验证">
              </el-switch>
            </template>
          </div>
        </li>
      </transition-group>
    </draggable>
  </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
  components:{
    draggable
  },
  data(){
    return {
      drag: false,
      signUpSwtich: false,
      radio: 3,
      renderData: [
        {
          label: '单选题',
          required: false,
          bottomBtn: ['delete', 'move', 'requireSwtich'],
          id: 3,
          nodes: [
            {
              type: 'radio',
              props: {},
              id: '3-1',
              value:'',
              children: [
                {value: '', id: '3-1-1'},
                {value: '', id: '3-1-2'}
              ]
            }
          ]
        },
        {
          label: '多选题',
          required: false,
          bottomBtn: ['delete', 'move', 'requireSwtich'],
          id: 4,
          value: '',
          nodes: [
            {
              type: 'checkBox',
              props: {},
              id: '4-1',
              value:'',
              children: [
                {value: '男', id: '4-1-1'},
                {value: '', id: '4-1-2'},
                {value: '', id: '4-1-3', other: true}
              ]
            }
          ]
        },
        {
          label: '下拉题',
          required: false,
          bottomBtn: ["addBtn", 'delete', 'move', 'requireSwtich'],
          id: 5,
          value: '',
          nodes: [
            {
              type: 'input',
              id: '5-1',
              props: {
                maxlength: "50",
                "show-word-limit": true,
                placeholder: "选项",
                class: 'selectInput'
              }
            },
            {
              type: 'input',
              id: '5-2',
              props: {
                maxlength: "50",
                "show-word-limit": true,
                placeholder: "选项",
                class: 'selectInput'
              }
            }
          ]
        }
      ]
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
    }
  },
  methods: {
    addOption(data, other){
      console.log(data, other);
      let colneChild = JSON.parse(JSON.stringify(data.nodes[data.nodes.length - 1]));
      console.log(colneChild);
      colneChild.other = other;
      colneChild.id = colneChild.id.split('-');
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
</style>
