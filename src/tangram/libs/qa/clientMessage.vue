<template>
  <div class="qa-item">
    <a class="question-icon">
      <img
        :src="msg.avatar||'//t-alistatic01.e.vhall.com/static/images/watch/question.png'"
        width="32"
        height="32"
      />
    </a>
    <div class="content-container">
      <div class="nameandtime">
        <div :title="msg.data?msg.data.nick_name:msg.nick_name" class="name">{{msg.data?msg.data.nick_name:msg.nick_name}}</div>
        <div class="time">{{msg.created_at}}</div>
      </div>
      <div class="question-content" v-html="msg.content"></div>
    </div>
    <div v-if="msg.answer" class="answerlist">
      <div class="triangle">
        <div></div>
      </div>
      <ul>
        <li>
          <p>
            <i :title="msg.answer.nick_name">{{msg.answer.nick_name}} </i>|
            <a
              style="cursor: default"
              class="role host"
              href="javascript:;"
            >{{this.roleMap[msg.answer.role_name]}}回答</a>
            <span class="time">{{msg.answer.created_at}}</span>
          </p>
          <p class="content" v-html="msg.answer.content"></p>
        </li>
      </ul>
    </div>
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
  //   height: 64px;
  padding: 10px 20px;
  box-sizing: border-box;
  //   display: flex;
  //   justify-content: flex-start;
  //   align-items: center;
  & > .question-icon {
    width: 32px;
    height: 32px;
    // align-self: flex-start;
    display: inline-block;
    vertical-align: top;
    margin-right: 8px;
    & > img {
      border-radius: 50%;
      display: block;
      height: 32px;
      width: 32px;
    }
  }
  & > .content-container {
    // flex: 1;
    // display: flex;
    display: inline-block;
    width: 206px;
    flex-direction: column;
    & > .nameandtime {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #6f6e6e;
      font-size: 12px;
      height: 18px;
      line-height: 18px;
      &>.name {
        text-align: left;
        width:130px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      & > .time {
        text-align: right;
      }
    }
    & > .question-content {
      width: 100%;
      line-height: 18px;
      height: 18px;
      margin-top: 8px;
      font-size: 14px;
      color: #bcbcbc;
      word-wrap: break-word;
      // word-break: break-all;
    }
  }
  & > .answerlist {
    position: relative;
    margin-left: 42px;
    margin-top: 10px;
    border-radius: 3px;
    border: 1px solid #393940;
    background-color: #202026;
    padding: 10px;
    & > .triangle {
      position: absolute;
      top: -10px;
      left: 14px;
      width: 0;
      height: 0;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #37373e;
      font-size: 0;
      line-height: 0;
      & > div {
        position: absolute;
        top: 2px;
        left: -8.5px;
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid #202026;
        font-size: 0;
        line-height: 0;
      }
    }
    & > ul {
      & > li {
        padding: 0;
        overflow: hidden;
        text-align: left;
        & > p {
          font-size: 12px;
          color: #909090;
          line-height: 20px;
          vertical-align: middle;
          &>i{
            font-style: normal;
            max-width:80px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: middle;
            display: inline-block;
          }
          & > a {
            color: #ff3333;
            text-decoration: none;
            display: inline-block;
            vertical-align: middle;
          }
          & > span {
            float: right;
            display: inline-block;
            vertical-align: middle;
          }
        }
        & > .content {
          color: #e2e1e1;
          word-wrap: break-word;
          // word-break: break-all;
        }
      }
    }
  }
}
</style>
