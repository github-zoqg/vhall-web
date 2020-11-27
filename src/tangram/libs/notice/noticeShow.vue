<template>
  <div class="vhall-saas-noticeshow-wrap" v-show="noticeShowStatus">
    <span class="iconfont icons">&#xe744;</span>
    <p class="nowrap">
        <span class="sys-con animated" id="noticeTextWrap">
          <span id="noticeText">{{ noticeText }}</span>
        </span>
    </p>
    <span class="iconfont close" @click="noticeShowStatus = false">&#xe725;</span>
  </div>
</template>
<script>
import EventBus from '@/utils/Events';
export default {
  data () {
    return {
      noticeText: '',
      noticeShowStatus: false
    };
  },

  created () {
    this.init();
  },

  methods: {
    animates () {
      this.$nextTick(() => {
        const noticeText = document.querySelector('#noticeText');
        const widthWrap = document.querySelector('#noticeTextWrap').offsetWidth;
        let widthtext = noticeText.offsetWidth;
        // widthtext = widthtext >= widthWrap ? widthtext : widthWrap
        // alert(widthWrap)
        // alert(widthtext)
        let left = widthWrap;
        function render () {
          if (-left >= widthtext) {
            left = widthWrap;
          }
          left = left - 2;
          noticeText.style.marginLeft = left + 'px';
          window.requestAnimationFrame(render);
        }
        window.requestAnimationFrame(render);
      });
    },
    init () {
      // 接受公告
      EventBus.$on('room_announcement', msg => {
        this.noticeShowStatus = true;
        this.noticeText = msg.room_announcement_text;
        this.animates();
        let timer;
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.noticeShowStatus = false;
        }, 1000 * 200);
      });
    }
  }
};
</script>
<style lang="less">
  .vhall-saas-noticeshow-wrap{
    color: #fff;
    font-size: 16px;
    background-color: rgba(0, 0, 0, 0.6);
    line-height: 35px;
    left: 0;
    top: 0;
    right: 0;
    height: 35px;
    position: absolute;
    z-index: 100;
    .icons {
      display: inline-block;
      position: absolute;
      top: 2px;
      font-size: 14px;
      color: #fba511;
      left: 15px;
    }
    .nowrap {
      color: #fff;
      height: 35px;
      margin: 0 50px;
      transition: all 4s;
      overflow: hidden;
      .animated {
        display: block;
        /*transition: all 4s;*/
        /*text-align: right;*/
        /*animation: myfirst 16s linear infinite;*/
        span {
          white-space: nowrap;
        }
      }
      @keyframes myfirst {
        from {
          transform: translateX(0%);
        }
        to {
          transform: translateX(-100%);
        }
      }
    }
    .close {
      cursor: pointer;
      display: inline-block;
      position: absolute;
      top: 2px;
      font-size: 14px;
      color: #fff;
      right: 15px;
    }
  }
</style>
