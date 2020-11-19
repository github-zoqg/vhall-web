<template>
  <div class="vhall-dialog-wrap" v-if="signInVisible">
    <div
      class="vhall-signinbox popup"
      style="display: block; margin-left: -135px; margin-top: -79.5px; left: 50%; top: 50%;"
    >
      <!-- <i class="iconfont iconguanbi close" @click="closeSignIn"></i> -->
      <div class="header" >
        <h3>签到</h3>
        <span class="close" @click="closeSignIn">
          <i class="iconfont iconguanbi"></i>
        </span>
      </div>
      <div class="vhall-popbody" v-if="masterEnd">
        <p class="vhall-title">点击按钮，开始签到</p>
        <p class="vhall-btnsbox">
          <button :class="{disabled: disabled}" type="button" @click="start">开始签到</button>
        </p>
        <p v-if="disabled" style="margin-top: 10px;" class="counting">
          正在统计...
          <span class="host-timeout">{{seconds}}秒</span>
        </p>
        <div v-if="!disabled&&countdownVisible" class="vhall-signin-status" style="display: block;">
          <h4>
            签到人数：
            <span class="vhall-total-signin">{{count}}</span>
          </h4>
          <div class="vhall-signinlist-box">
            <div class="scroll-box" style="max-height: 240px;">
              <div class="list-container" style="position:relative; top:0; left:0;" dir="ltr">
                <ul class="signin-list">
                  <li v-for=" item in list" :key="item.id">
                    <a href="javascript:;" class="user-avatar" title="游客1259545599">
                      <img
                        :src="item.signer_avatar||'//t-alistatic01.e.vhall.com/static/img/head50.jpg'"
                        width="32"
                        height="32"
                      >
                    </a>
                    <a
                      href="javascript:;"
                      class="nickname"
                      :title="item.signer_nickname"
                    >{{item.signer_nickname}}</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="vhall-popbody" v-if="!masterEnd">
        <h4>主持人发起了签到</h4>
        <p class="second">您有 <span>{{seconds}}</span> 秒的时间进行签到</p>
        <p class="vhall-btnsbox">
          <button type="button" @click="clientStart">签到</button>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from '@/utils/Events';

export default {
  name: 'sign-in',
  props: {
    vss_token: {
      required: true
    },
    room_id: {
      required: true
    },
    masterEnd: {
      required: true
    }
  },
  data () {
    return {
      signInVisible: false,
      countdownVisible: false,
      seconds: 30,
      disabled: false,
      sign_id: '',
      list: [],
      count: 0,
      clock: null
    };
  },
  created () {
    EventBus.$on('sign_in_push', e => {
      if (!this.masterEnd) {
        this.openSignIn(e.sign_id);
      }
    });
  },
  methods: {
    /**
    *@param {string} sign_id -签到id
     */
    openSignIn (signId) { // 发起端/观看端开启关闭签到窗口,观看端消息触发该方法并传sign_id，倒计时结束后自动关闭
      this.sign_id = signId;
      this.signInVisible = true;
      if (signId) {
        this.seconds = 30;
        this.clock = window.setInterval(() => {
          this.seconds--;
          if (this.seconds == 0) {
            window.clearInterval(this.clock);
            this.signInVisible = false;
          }
        }, 1000);
      }
    },
    closeSignIn () {
      this.signInVisible = false;
    },
    start () { // 发起端开始签到
      this.disabled = true;
      this.$vhallFetch('signin', {
        vss_token: this.vss_token,
        show_time: '30',
        room_id: this.room_id
      })
        .then(res => {
          this.countDown(res.data.id);
        })
        .catch(error => {
          console.error(error);
        });
    },
    countDown (id) { // 倒计时函数，倒计时结束后统计签到数量
      window.clearInterval(this.clock);
      this.seconds = 30;
      this.clock = window.setInterval(() => {
        this.seconds--;
        if (this.seconds == 0) {
          window.clearInterval(this.clock);
          this.disabled = false;
          this.$vhallFetch('getUserList', {
            vss_token: this.vss_token,
            offset: '0',
            limit: '999',
            sort_type: 'asc',
            room_id: this.room_id,
            sign_id: id
          })
            .then(res => {
              this.list = res.data.list;
              this.count = res.data.count;
              this.countdownVisible = true;
            })
            .catch(error => {
              console.error(error);
            });
        }
      }, 1000);
    },
    clientStart () { // 观看端签到
      this.signInVisible = false;
      this.$vhallFetch('clientSignin', {
        vss_token: this.vss_token,
        sign_id: this.sign_id,
        room_id: this.room_id
      })
        .then(res => {
          this.$message.success('签到成功');
        })
        .catch(() => {
          this.$message.error('签到失败');
        });
    }
  }
};
</script>
<style lang="less" scoped>
.vhall-dialog-wrap {
  font-family: "微软雅黑";
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999999;
  align-items: center;
  display: flex;
  justify-content: center;
}
.vhall-signinbox {
  color: #353535;
  position: fixed;
  width: 270px;
  z-index: 99;
  // padding: 30px 27px 35px;
  border-radius: 4px;
  background: #fff;
  box-sizing: border-box;

  & > .header {
      width: 100%;
      height: 40px;
      border-bottom: 1px solid #dfdfdf;
      margin-bottom: 0;
      text-align: center;
      line-height: 40px;
      h3 {
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        font-weight: 500;
        display: inline-block;
        font-size: 14px;
      }
      .close {
        margin-right: 11px;
        margin-top: 11px;
        cursor: pointer;
        width: 20px;
        height: 20px;
        opacity: 0.8;
        position: absolute;
        right: 0px;
        & > i {
          font-size: 10px;
          float: right;
          line-height: 20px;
        }
      }
    }
  .vhall-popbody {
    text-align: center;
    background: #fff;
    padding: 30px 27px 35px;
    border-bottom-left-radius: 5px;
    border-bottom-right-radius: 5px;
    .second {
      margin-top: 12px;
      color: #888888;
      font-size: 12px;
      span {
        color: #f34b46;
      }
    }
    & > .counting {
      margin-top: 10px;
      text-align: center;
      font-size: 12px;
      & > .host-timeout {
        color: #cc0000;
        text-align: center;
        font-size: 12px;
      }
    }
    & > .vhall-title {
      font-size: 14px;
      text-align: center;
    }
    & > .vhall-btnsbox {
      & > button {
        line-height: 36px;
        width: 110px;
        height: 36px;
        padding: 0;
        cursor: pointer;
        background: #fc5659;
        margin-top: 16px;
        color: #fff;
        border: none;
        border-radius: 4px;
        &:hover {
          background: #c51f1d;
        }
      }
      & > button.disabled {
        cursor: wait;
        background-color: #fdc7c7;
        pointer-events: none;
      }
    }
    & > .vhall-signin-status {
      text-align: center;
      color: #353535;
      font-size: 12px;
      & > h4 {
        line-height: 38px;
        border-bottom: solid 1px #b3b3b3;
        margin-top: 20px;
        font-size: 14px;
        .vhall-total-signin {
          font-size: 14px;
          line-height: 38px;
        }
      }
      & > .vhall-signinlist-box {
        max-height: 240px;
        margin-top: 8px;
        text-align: center;
        & > .scroll-box {
          position: relative;
          overflow: hidden;
          height: 100%;
          max-width: 100%;
          outline: 0;
          direction: ltr;
          max-height: 240px;
          overflow-y: scroll;
          & > .list-container {
            position: relative;
            & > .signin-list {
              display: flex;
              flex-direction: column;
              & > li {
                padding-left: 10px;
                padding-right: 10px;
                margin-bottom: 10px;
                display: flex;

                align-items: center;
                & > .user-avatar {
                  border-radius: 50%;
                  overflow: hidden;
                  float: left;
                  margin-right: 8px;
                  cursor: pointer;
                  & > img {
                    display: block;
                    border: none;
                  }
                }
                & > .nickname {
                  width: 100px;
                  text-align: left;
                  color: #383838;
                  float: left;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
