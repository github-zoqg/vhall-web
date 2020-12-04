<template>
  <div class="vhall-chat-user-control_bg" v-show="isShow" @click.capture="isShow=false">
    <div class="vhall-chat-user-control" :style="style">
      <div class="setspeak" @click="reply(count)">
        <i></i>
        <span>回复</span>
      </div>
      <div :class="this.atList.find(u => u.nickName == this.nickName)?'setkick disabled':'setkick'" @click="atUser(count)">
        <i></i>
        <span>@TA</span>
      </div>
      <div class="setspeak" @click="deleteMsg(count)" v-if="godMode">
        <i></i>
        <span>删除</span>
      </div>
      <div class="setspeak" @click="setBanned" v-if="godMode">
        <i></i>
        <span>{{userStatus.is_banned ? '取消禁言' : '禁言'}}</span>
      </div>
      <div class="setkick" @click="setKicked" v-if="godMode">
        <i></i>
        <span>{{userStatus.is_kicked ? '取消踢出' : '踢出'}}</span>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from '@/utils/Events';
export default {
  props: {
    roomId: {
      required: true
    },
    userId: {
      required: true
    },
    deleteMsg: {
      required: true
    },
    reply: {
      required: true
    },
    atUser: {
      required: true
    },
    atList: {
      required: true
    }
  },
  data () {
    return {
      isShow: false,
      style: {},
      userStatus: {
        is_banned: null,
        is_kicked: null
      },
      nickName: '',
      godMode: false,
      assistantType: ''
    };
  },
  created () {
    this.assistantType = this.$route.query.assistantType;
  },
  mounted () {
    EventBus.$on('tangram_set_person_status_in_chat', async (el, accountId, count, nickName, godMode, roleName) => {
      if (accountId == this.userId) return; // 不能点击自己
      this.accountId = accountId;
      this.count = count;
      this.userStatus = await this.getUserStatus();
      this.isShow = true;
      this.godMode = godMode;
      this.calculate(el);
      this.nickName = nickName;
      this.roleName = roleName;
    });
    // 监听客户端踢出操作
    EventBus.$on('assistantKickoutCallback', msg => {
      if (msg.type == 0) return;
      this.$fetch('setKickOut', {
        room_id: this.roomId,
        receive_account_id: msg.data.room_join_id,
        status: 1
      }).then(() => {
        EventBus.$emit('kicked_in_chat', {nextStatus: 1, accountId: this.accountId});
      });
    });
  },
  methods: {
    calculate (el) {
      const rect = el.getBoundingClientRect();
      const clientHeight = this.getClientHeight();
      const modalHeigt = this.godMode ? 152 : 68;
      if (clientHeight - rect.bottom < modalHeigt) {
        this.style = {
          top: `${rect.top - modalHeigt}px`,
          left: `${rect.left}px`
        };
      } else {
        this.style = {
          top: `${rect.top + rect.height + 1}px`,
          left: `${rect.left}px`
        };
      }
    },
    /**
     * 得到用户状态是否被禁言/踢出
     */
    getUserStatus () {
      return new Promise((resolve, reject) => {
        this.$fetch('getToolStatus', {
          room_id: this.roomId
        }).then(res => {
          resolve(res.data);
        });
      });
    },
    /**
     * 禁言/取消禁言
     */
    setBanned () {
      let nextStatus = this.userStatus.is_banned ? 0 : 1;
      this.$fetch('setBanned', {
        receive_account_id: this.accountId,
        status: nextStatus,
        room_id: this.roomId
      });
    },
    /**
     * 踢出/取消踢出
     */
    setKicked () {
      let nextStatus = this.userStatus.is_kicked ? 0 : 1;
      let confirmText = nextStatus
        ? '您确定要执行踢出操作？'
        : '您确定要执行取消踢出操作？';
      if (this.assistantType) {
        return EventBus.$emit('assistantKickout', {...data, confirmText, roleName: this.roleName});
      }
      this.$confirm(confirmText, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'info',
        center: true
      })
        .then(() => {
          this.$fetch('setKickOut', {
            room_id: this.roomId,
            receive_account_id: this.accountId,
            status: nextStatus
          }).then(() => {
            EventBus.$emit('kicked_in_chat', {nextStatus, accountId: this.accountId});
          });
        })
        .catch(() => {});
    },
    /**
     * 获取窗口可视化区域高度
     */
    getClientHeight () {
      let clientHeight = 0;
      if (document.body.clientHeight && document.documentElement.clientHeight) {
        clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
      } else {
        clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
      }
      return clientHeight;
    }
  }
};
</script>
<style lang="less">
.vhall-chat-user-control_bg {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: transparent;
  z-index: 900;
  .vhall-chat-user-control {
    position: absolute;
    width: 96px;
    padding: 6px 0;
    background-color: #FFFFFF;
    border-radius: 4px;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    box-sizing: border-box;
    cursor: pointer;
    & > div {
      font-size: 14px;
      height: 28px;
      color: #666666;
      text-align: left;
      line-height: 28px;
      padding: 0;
      padding-left: 10px;
      user-select: none;
      &.disabled {
        color: #C3C3C3;
        &:hover {
          color: #C3C3C3;
          background-color: #FFFFFF;
          cursor: not-allowed;
        }
      }
      &:hover {
        color: #FFFFFF;
        background-color: #FC5659;
      }
    }
  }
}
</style>
