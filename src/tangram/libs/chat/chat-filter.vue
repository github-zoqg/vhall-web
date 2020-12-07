<template>
  <transition name="chat-filter-slide">
    <div class="chat-filter" v-show="chatFilterShow">
      <p v-auth="100017" class="chat-banned-all">
        <input
          class="chat-filter-input"
          v-model="bannedAll"
          @change="handleChange"
          type="checkbox"
          id="disableSendMsg"
        />
        <label class="chat-filter-label" for="disableSendMsg">全员禁言</label>
      </p>
      <a
        v-auth="100015"
        v-if="!isAssistant"
        class="chat-filter-btn"
        :href="filterUrl"
        target="_blank"
      >开启手动过滤</a>
      <a
        v-auth="100015"
        v-if="isAssistant"
        class="chat-filter-btn"
        @click="sendMsgToAssistant"
      >开启手动过滤</a>
    </div>
  </transition>
</template>

<script>
import EventBus from '@/utils/Events';
export default {
  props: {
    webinarId: {
      required: true
    },
    roomId: {
      required: true
    },
    allBanned: {
      required: true
    },
    chatFilterUrl: {
      required: true // 聊天过滤的跳转路径
    },
    isAssistant: {
      required: true
    }
  },
  data () {
    return {
      chatFilterShow: false,
      bannedAll: this.allBanned,
      filterUrl: ''
    };
  },
  mounted () {
    this.filterUrl = this.chatFilterUrl;
    // 全体禁言
    EventBus.$on('disable_all', () => {
      this.bannedAll = true;
    });
    // 取消全体禁言
    EventBus.$on('permit_all', () => {
      this.bannedAll = false;
    });
  },
  methods: {
    handleChange (e) {
      this.setAllBanned(e.target.checked);
    },
    toggleShow () {
      this.chatFilterShow = !this.chatFilterShow;
    },
    setAllBanned (flag) {
      this.$fetch('setAllBanned', {
        room_id: this.roomId,
        status: flag ? 1 : 0
      }).catch(error => {
        console.error('全体禁言接口失败', error);
      });
    },
    sendMsgToAssistant () {
      EventBus.$emit('chatFilterUrl', this.filterUrl);
    }
  }
};
</script>
<style lang="less">
.chat-filter {
  position: absolute;
  top: 0;
  right: 10px;
  transform: translateY(-100%);
  background: #fff;
  padding: 11px 10px 11px 12px;
  width: 148px;
  // height: 80px;
  box-sizing: border-box;
  border-radius: 2px;
  font-size: 12px;
  .chat-banned-all {
    margin-bottom: 25px;
  }
  .chat-filter-input {
    position: absolute;
    margin-top: 3px;
    cursor: pointer;
  }
  .chat-filter-label {
    padding-left: 18px;
    color: #999;
    padding-bottom: 5px;
    cursor: pointer;
  }
  .chat-filter-btn {
    display: block;
    color: #4da1ff;
    text-align: right;
  }
}
.chat-filter-slide-enter-active {
  transition: all 0.3s ease;
}
.chat-filter-slide-leave-active {
  transition: all 0.3s ease;
}
.chat-filter-slide-enter,
.chat-filter-slide-leave-to {
  transform: translateY(0);
  opacity: 0;
}
</style>
