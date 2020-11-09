<template>
  <div class="signUpForm">
    <header>
      <img src="//cnstatic01.e.vhall.com/static/images/signup-form/form-head-new1.png" alt="">
    </header>
    <article>
      <h1 class="pageTitle">微吼直播_SASS产品发布会观看报名_微吼SaaS产品发布会</h1>
      <div :class="['tabs', colorIndex]">
        <div :class="{active: tabs==1}" @click="tabs=1">用户报名</div>
        <div :class="{active: tabs==2}" @click="tabs=2">验证</div>
      </div>
      <!-- 表单块 -->
      <template>
        <el-form>
          <el-form-item v-for="(formItem, formIndex) in questionArr" :key="formIndex" :label="`${formIndex}.${formItem.label}`" :required="!!formItem.required">
            <!-- 单选类型 -->
            <template v-if="formItem.type=='select'">
              <el-select v-model="formItem.value" placeholder="请选择">
                <el-option
                  v-for="(nodeItem,nodeIndex) in formItem.nodes"
                  :key="`${formIndex}-${nodeIndex}`"
                  :label="nodeItem.value || `选项${nodeIndex+1}`"
                  :value="nodeItem.value || `选项${nodeIndex+1}`">
                </el-option>
              </el-select>
            </template>
            <!-- 隐私声明 -->
            <template v-else-if="formItem.name=='privacy'">
              <el-checkbox v-model="formItem.value">
                <p v-html="privacyFormatter(formItem.nodes)"></p>
              </el-checkbox>
            </template>
            <template v-for="(nodes, nodeIndex) in formItem.nodes" v-else>
              <el-input v-if="formItem.type=='input'"  :key="`${formIndex}-${nodeIndex}`" v-model="nodes.value" v-bind="nodes.props"></el-input>
              <!-- 单选类型 -->
              <el-radio-group v-model="nodes.value" v-bind="nodes.props" v-else-if="formItem.type=='radio'" :key='`${formIndex}-${nodeIndex}`'>
                <el-radio v-for="(radioItem, raionIndex) in nodes.children" :key="`${formIndex}-${nodeIndex}-${raionIndex}`" :label="radioItem.value || `选项${raionIndex+1}`">
                  <!-- "其他"
                  <br/>
                  <el-input maxlength="50" v-if="!!radioItem.other" show-word-limit :placeholder="`选项${raionIndex+1}`" v-model="radioItem.value" ></el-input> -->
                  <!-- {{radioItem.other ? "其他" : ''}}
                  <el-input maxlength="50" show-word-limit :placeholder="`选项${raionIndex+1}`" v-model="radioItem.value" ></el-input> -->
                  <!-- <br/> -->
                </el-radio>
              </el-radio-group>
              <!-- 多选类型 -->
              <el-checkbox-group v-model="nodes.value" v-bind="nodes.props" v-else-if="formItem.type=='checkBox'" :key='`${formIndex}-${nodeIndex}`'>
                <el-checkbox v-for="(radioItem, raionIndex) in nodes.children" :key="`${formIndex}-${nodeIndex}-${raionIndex}`" :label="radioItem.value || `选项${raionIndex+1}`">
                  <!-- {{radioItem.other ? "其他" : ''}}
                  <el-input maxlength="50" show-word-limit :placeholder="`选项${raionIndex+1}`" v-model="radioItem.value" :class="{noFull: !!radioItem.other, radioInput: true}">
                    <i class="el-icon-remove-outline removeIcon" slot="suffix" @click="deleteOptions(node.children, raionIndex)"></i>
                  </el-input> -->
                  <!-- <br/> -->
                </el-checkbox>
              </el-checkbox-group>
            </template>
          </el-form-item>
        </el-form>
      </template>
      <!-- 表单块 -->

      <!-- 验证块 -->
      <template>
        <div>

        </div>
      </template>
      <!-- 验证块 -->
    </article>

  </div>
</template>

<script>
export default {
  props:{
    questionArr: {
      type: Array,
      default: ()=> []
    }
  },
  data(){
    return{
      colorIndex: 'red',
      tabs: 1
    };
  },
  created(){
    console.log(this.questionArr);
  },
  methods: {
    privacyFormatter(item){
      let text = JSON.parse(JSON.stringify(item[0].value));
      let matchPrivacy1 = item[1].value.trim() ? text.match(item[1].value) : null;
      if(matchPrivacy1){
        let reg = new RegExp(`(${matchPrivacy1[0]})`);
        text = text.replace(reg, `<a href="${item[2].value}" target="_blank">$1</a>`);
      }
      let matchPrivacy2 = (item[3] && item[3].value.trim()) ? text.match(item[3].value) : null;
      if(matchPrivacy2){
        let reg = new RegExp(`(${matchPrivacy2[0]})`, "g");
        console.log(reg);
        text = text.replace(reg, `<a href="${item[4].value}" target="_blank">$1</a>`);
      }

      return text;
    },
  }
};
</script>

<style lang="less" scoped>
  @red: #FB3A32;
  @redBg: #FFEBEB;
  @blue: #3562FA;
  @blueBg: #ebefff;
  @orange: #FA9A32;
  @orangeBg: #fff5eb;
  .signUpForm{
    width: 840px;
    background: #fff;
    padding-bottom: 90px;
  }
  header{
    width: 100%;
    height: 240px;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .pageTitle{
    font-size: 24px;
    color: #1A1A1A;
    margin: 40px 0;
    text-align: center;
  }
  .tabs{
    width: 100%;
    overflow: hidden;
    margin-bottom: 43px;
    >div{
      width: 50%;
      float: left;
      border-radius: 4px;
      border: 1px solid #E6E6E6;
      border-radius: 4px 0px 0px 4px;
      line-height: 40px;
      height: 40px;
      text-align: center;
      transition: all .2s linear;
      cursor: pointer;
      &:nth-child(1){
        border-right: 0px none;
      }
      &:nth-child(2){
        border-left: 0px none;
      }
      &.active{
        border: 1px solid @red;
        background: @redBg;
        color: @red;
      }
    }
    &.red{
      .active{
        border: 1px solid @red;
        background: @redBg;
        color: @red;
      }
    }
    &.blue{
      .active{
        border: 1px solid @blue;
        background: @blueBg;
        color: @blue;
      }
    }
    &.orange{
      .active{
        border: 1px solid@orange;
        background: @orangeBg;
        color:@orange;
      }
    }
  }
  article{
    padding: 0 75px;
  }
  /deep/ .el-form-item__label{
    float: none;
  }
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
  .el-select{
    width: 100%;
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
</style>
