import EventBus from '@/utils/Events';

export const assitantMixin = {
  mounted () {
    EventBus.$on('Join', msg => {
      this.$emit('assistantMsg', msg.data.type, msg);
    });
    EventBus.$on('Leave', msg => {
      this.$emit('assistantMsg', msg.data.type, msg);
    });
    // 禁言某个用户
    EventBus.$on('disable', msg => {
      this.$emit('assistantMsg', msg.data.type, msg);
    });
    // 取消禁言某个用户
    EventBus.$on('permit', msg => {
      this.$emit('assistantMsg', msg.data.type, msg);
    });
    // 取消禁言某个用户
    EventBus.$on('chatFilterUrl', url => {
      this.$emit('assistantMsg', 'filterUrl', url);
    });
    // 图片预览
    EventBus.$on('imgPreview', imgs => {
      this.$emit('assistantMsg', 'imgPreview', imgs);
    });
    // 客户端踢出操作
    EventBus.$on('assistantKickout', msg => {
      this.$emit('assistantMsg', 'kickout', msg);
    });
    // 支付宝红包打开支付页面
    EventBus.$on('alipayCashier', url => {
      this.$emit('assistantMsg', 'red_url', url);
    });
    // 左侧栏选中白板
    EventBus.$on('doc_loaded', url => {
      this.$emit('assistantMsg', 'page', url);
    });
  },
  methods: {
    handleAssitant (type) {
      // 助手相关
      console.log('assitant', type);
      let container = document.querySelector('.vhall-document-container');
      switch (type) {
        case 1: // 文档
          this.showDoc();
          break;
        case 2: // 白板
          this.showWhiteBoard();
          break;
        case 3: // 问卷
          this.closeAssistantTools();
          this.openQuestionarie();
          break;
        case 4: // 抽奖
          this.closeAssistantTools();
          this.openLettery();
          break;
        case 5: // 签到
          this.closeAssistantTools();
          this.openSignIn();
          break;
        case 6: // 答题
          this.closeAssistantTools();
          this.openQAPopup();
          break;
        case 7: // 隐藏文档
          container && (container.style.opacity = 0);

          break;
        case 8: // 显示文档
          container && (container.style.opacity = 1);
          break;
        case 9: // 文档最小化
          this.exitFullscreen('#vhall-document-container');
          break;
        case 11: // 打开红包
          this.closeAssistantTools();
          this.openRedPacketPopup();
          break;
        case 12: // 打开红包
          // this.closeAssistantTools()
          // this.openRedPacketPopup()
          EventBus.$emit('live_start');
          break;
      }
    },
    handleAssitantDocTool (type) {
      switch (type) {
        case 0: // 隐藏工具栏
          EventBus.$emit('vhallLayoutExchange', 'doc');
          break;
        case 1: // 显示工具栏
          EventBus.$emit('vhallLayoutExchange', 'video');
          break;
      }
    },
    handleAssitantKickout (msg, type) {
      delete msg.confirmText;
      EventBus.$emit('assistantKickoutCallback', {data: msg, type});
    },
    handleAssitantDocFocus (msg) {
      this.$refs.doc && this.$refs.doc.$el.focus();
      this.$refs.doc && this.$refs.doc.$el.click();
    },
    closeAssistantTools () {
      this.closeRedPacketPopup();
      this.closeQuestionarie();
      this.closeQAPopup();
      this.$refs.lotterySon && this.$refs.lotterySon.close();
      this.$refs.signin && this.$refs.signin.closeSignIn();
    }
  }
};
