<template>
  <div class="vhall-notice-wrap">
    <div class="scroll-warp" ref="scroll">
      <ul>
        <li v-for="(item, index) in contenList" :key="index">
          <span class="iconfont icons">&#xe744;</span>
          <p>
            <span class="v-type">[公告]</span>
            {{item.text}}
          </p>
          <p class="v-time">{{item.time}}</p>
        </li>
      </ul>
    </div>

    <div class="v-control">
      <div class="toSay">
        <div class="clearfix text-box">
          <textarea
            class="mywords fl"
            placeholder="请输入公告内容"
            v-on:keyup.enter="sendNotice"
            v-model.trim="NoticeVal"
            name="xword"
            maxlength="300"
          ></textarea>
          <input type="button" class="sendMsg fr" value="发送" @click="sendNotice" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from '@/utils/Events';
import BScroll from '@better-scroll/core';
import ScrollBar from '@better-scroll/scroll-bar';
import MouseWheel from '@better-scroll/mouse-wheel';

BScroll.use(ScrollBar);
BScroll.use(MouseWheel);

export default {
  props: {
    roomId: {
      required: true
    },
    channel_id:{
      required: true
    }
  },
  data () {
    return {
      NoticeVal: '',
      contenList: []
    };
  },

  created () {},

  mounted () {
    this.scrollInitNotice();
    EventBus.$on('room_announcement', msg => {
      this.contenList.unshift({
        text: msg.room_announcement_text,
        time: msg.push_time
      });
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    });
  },
  methods: {
    scrollInitNotice () {
      this.$nextTick(() => {
        this.scroll = new BScroll(this.$refs.scroll, {
          click: true,
          bounce: false,
          scrollY: true,
          scrollbar: true,
          mouseWheel: {
            speed: 20,
            invert: false,
            easeTime: 300
          }
        });
      });
    },
    sendNotice () {
      if (!this.NoticeVal) return this.$message.error('内容不能为空');
      this.$fetch('v3SendNotice', {
        room_id: this.roomId,
        channel_id: this.channel_id,
        body: this.NoticeVal
      }).then(res => {
          this.NoticeVal = '';
        }).catch(error => {
          console.warn('发送公告消息----err',error);
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import '../../public/iconfont/iconfont.css';

.vhall-notice-wrap {
  height: 100%;
  position: relative;
  .scroll-warp {
    top: 0px;
    bottom: 52px;
    left: 0px;
    right: 0px;
    position: absolute;
    overflow: hidden;
  }
  ul {
    li {
      margin: 0px;
      box-sizing: border-box;
      list-style-type: none;
      width: 100%;
      position: relative;
      padding: 14px 20px 14px 43px;
      background-color: #2d2d2d;
      &:not(:first-child) {
        margin-top: 1px;
      }
      .icons {
        display: inline-block;
        position: absolute;
        top: 15px;
        font-size: 14px;
        color: #fba511;
        left: 15px;
      }
      p {
        width: 100%;
        word-break: break-all;
        font-size: 12px;
        color: #ececec;
        box-sizing: border-box;
        padding-right: 20px;
        .v-type {
          display: inline-block;
          margin-right: 10px;
        }
      }
      .v-time {
        color: #999999;
        margin-top: 4px;
      }
    }
  }
  .v-control {
    width: 100%;
    height: 52px;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 1;
    background-color: #34363a;
    .toSay {
      position: relative;
      background-color: transparent;
      padding: 9px 9px 0;
      height: 100%;
    }
    .text-box {
      .mywords {
        border: none;
        background: #545454;
        height: 32px;
        width: 250px;
        resize: none;
        outline: none;
        padding: 0 9px;
        line-height: 32px;
        color: #fff;
        overflow: auto;
        border-radius: 4px 0 0 4px;
        box-sizing: border-box;
        font-size: 12px;
        float: left;
        display: inline-block;
      }
      .sendMsg {
        box-sizing: border-box;
        width: 40px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #999;
        cursor: pointer;
        border: none;
        color: #fff;
        float: left;
        border-radius: 0 4px 4px 0;
        font-size: 12px;
        display: inline-block;
        outline: none;
        &:hover {
          background: #fc5659;
        }
      }
    }
  }
}
</style>
