<template>
  <div class="qa-item">
    <div v-if="msg.answer" class="master-message">
      <p class="nick-name" :title="msg.answer.nick_name">
        <span class="role">{{this.roleMap[msg.answer.role_name]}}</span>
        {{msg.answer.nick_name}}
      </p>
      <span class="time">{{msg.answer.created_at}}</span>
      <br />
      <p class="wrap" v-html="msg.answer.content"></p>
      <i></i>
    </div>
    <div class="nameandtime">
      <div :title="msg.nick_name" class="name">{{msg.nick_name}}</div>
      <div class="time">{{msg.created_at}}</div>
    </div>
    <div class="question-content" v-html="msg.content"></div>
  </div>
</template>
<script>
export default {
  props: {
    msg: {
      required: true,
      default: {}
    }
  },
  mounted () {
    console.log(this.msg, 'msg');
  },
  data () {
    return {
      roleMap: {
        'host': '主持人',
        'guest': '嘉宾',
        'assistant': '助理',
        'user': '观众'
      }
    };
  }
};
</script>
<style lang="less" scoped>
.qa-item {
  display: flex;
  flex-direction: column;
  padding-right: 10px;
  padding-left: 10px;
  margin-top: 12px;
  //   height: 38px;
  font-size: 12px;
  & > .master-message {
    background: #262626;
    margin: 10px 0 10px;
    padding: 5px 8px;
    box-sizing: border-box;
    color: #e4e4e4;
    position: relative;
    & > .nick-name {
      width: 130px;
      display: inline-block;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      & > span {
        padding: 1px 8px;
        color: #eee;
        border-radius: 5px;
        margin-right: 5px;
        background: #999;
        white-space: nowrap;
      }
    }
    & > .time {
      margin-right: 0px;
      color: #555;
      float: right;
    }
    & > i {
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 8px solid #262626;
      position: absolute;
      margin-top: 5px;
    }
    & > p{
      word-wrap: break-word;
      // word-break: break-all;
    }
  }
  & > .nameandtime {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #e4e4e4;
    font-size: 12px;
    height: 18px;
    line-height: 18px;
    & > .name {
      text-align: left;
      width:200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    & > .time {
      text-align: right;
      color: #b4b4b4;
      margin-right: 8px;
    }
  }
  & > .question-content {
    width: 100%;
    line-height: 18px;
    // height: 18px;
    margin-top: 2px;
    font-size: 12px;
    color: #e4e4e4;
    word-wrap: break-word;
    // word-break: break-all;
  }
}
</style>
