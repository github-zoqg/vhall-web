<template>
  <div class="vhall-split-wrapbox cxs">
    <publisher
       v-if="!!roomId && permission && !isSplited && splitStatus != 0"
       v-bind="$attrs"
      :splitStatus="splitStatus"
      :roomId="roomId"
      :shareId="shareId"
      :ilId="ilId"
      :vssToken="vssToken"
      :joinId="joinId"
      :third_party_user_id="third_party_user_id"
      :params_verify_token="params_verify_token"
      :qaStatus="qaStatus"
      :saas_join_id="saas_join_id"
      :recordFun="recordFun"
      :domains="domains"
      :duration="duration"
      :permission="permission"
      :isInteract="isInteract"
      :record_notice="record_notice"
      :cut_record_status="cut_record_status"
      :documentId="documentId"
      @startSplit="startSplit"
      @endSplit="endSplit"
      :docLowPriority="docLowPriority"
      :recordTip="recordTip"
      :isEmbed="isEmbed"
    ></publisher>

    <!-- <shadow-view
      v-if="isSplited == 1 && !!roomId "
       v-bind="$attrs"
      :splitStatus="splitStatus"
      :roomId="roomId"
      :ilId="ilId"
      :vssToken="vssToken"
      :joinId="joinId"
      :third_party_user_id="third_party_user_id"
      :params_verify_token="params_verify_token"
      :qaStatus="qaStatus"
      :saas_join_id="saas_join_id"
      :recordFun="recordFun"
      :domains="domains"
      :duration="duration"
      :permission="permission"
      :isInteract="isInteract"
      :record_notice="record_notice"
      :cut_record_status="cut_record_status"
      :documentId="documentId"
    ></shadow-view> -->
  </div>
</template>
<script>
/**
 * 分屏
 *
 * @author Sean.shi
 * @exports splitWindow
 */
import shadowsMixin from '../../libs/shadows/shadow';
import EventBus from '@/utils/Events';

import publisher from './index';
import shadowView from './shadowView';

function query (param) {
  let reg = new RegExp('[?&]' + param + '=([^&]*)[&$]*');
  let ret = location.search.match(reg);
  if (ret) {
    ret = decodeURIComponent(ret[1]);
  }
  return ret;
}

export default {
  name: 'vhallSaas',
  props: [
    'shareId',
    'roomId',
    'ilId',
    'vssToken',
    'joinId',
    'third_party_user_id',
    'params_verify_token',
    'qaStatus',
    'saas_join_id',
    'recordFun',
    'domains',
    'duration',
    'permission',
    'isInteract',
    'record_notice',
    'cut_record_status',
    'documentId',
    'docLowPriority',
    'recordTip',
    'isEmbed'
  ],

  created () {

  },

  data () {
    return {
      isSplited: query('s'),
      splitStatus: 0 // 0 == 检测中  1 == 开着分屏 ， 2 == 没开分屏
    };
  },
  mixins: [shadowsMixin],
  components: {
    shadowView,
    publisher
  },

  mounted () {
    // wa
    // EventBus.$on('close_live', () => {
    //   this.endSplit()
    // })

    query('layout') && sessionStorage.setItem('layout', query('layout'));

    EventBus.$on('applyByHost', () => {
      this.sendCmdToShadow({
        type: 'applyByHost-split'
      });
    });
    // 初始化 互动分屏消息相关
    if (!query('s')) {
      this.checkShadow().then((w) => {
        if (w) {
          this.splitStatus = 1;
          console.log('开着分屏');
          this.startShadow();
          this.initHostEvent();
          // 主持端 - 触发-开始直播的消息
          EventBus.$emit('startLive');
          EventBus.$emit('streamPushed');
        } else {
          this.splitStatus = 2;
        }
      }).catch((e) => {
        console.log('split is closed');
      });
    } else {
      this.shadowConnectHandler();
    }

    this.interactEvents();
    // else {
    //   this.splitStatus = query('s')
    // }
    this.addEventListener();
    this.addSplitHandlerListens();
  },

  methods: {

    interactEvents () {
      EventBus.$on('exitShadow', () => {
        this.disConnectShadow();
      });

      // 重置 - 相关东西
      EventBus.$on('close_live', () => {
        this.sendCmdToShadow({
          type: 'close_live'
        });
      });

      EventBus.$on('splitSpeakOff', () => {
        this.sendCmdToShadow({
          type: 'speakOff'
        });
      });

      EventBus.$on('splitSpeakOn', () => {
        this.sendCmdToShadow({
          type: 'speakOn'
        });
      });

      // 分屏事件----
    },

    // 开启分屏
    startSplit () {
      const url = window.location.href.split('#')[0];
      const spltWindow = `${url}?s=1&layout=${sessionStorage.getItem('layout')}`;

      // this.checkShadow().then((w) => {
      //   if (w) {
      //     this.splitStatus = 1
      //     console.log('开着分屏')
      //     this.startShadow()
      //     this.initHostEvent()
      //     // 主持端 - 触发-开始直播的消息
      //     EventBus.$emit('startLive')
      //     EventBus.$emit('streamPushed')
      //   } else {
      //     this.splitStatus = 2
      //   }
      // }).catch((e) => {
      //   this.startShadow(spltWindow)
      //   this.splitStatus = 1
      //   console.log('split is closed')
      // })
      this.stopShadow();
      setTimeout(() => {
        this.startShadow(spltWindow);
        this.splitStatus = 1;
      }, 700);
    },

    // 关闭分屏
    endSplit () {
      this.closeShadow();
    },

    closeShadow () {
      this.stopShadow();
      setTimeout(() => {
        this.splitStatus = 2;
        this.checkShadow();
      }, 700);
    },

    // 分屏所需 方法
    shadowConnectHandler () {
      if (query('s') == '1') {
        this.connectShadow().then(() => {
          console.log('已与 => 主屏建立连接');

          this.initShadowEvent();
        }).catch((e) => {
          window.location.href = '/home/tip?msg=页面无法打开，请检查分屏页面是否已打开或分屏模式未开启';
        });
      }
    },

    addEventListener () {
      EventBus.$on('sendCmdToHost', (data) => {
        console.log('debug info:: tell hostWindow msgs', data);
        this.sendCmdToHost(data);
      });

      EventBus.$on('sendCmdToShadow', (data) => {
        console.log('debug info:: tell shadowWindow msgs', data);
        this.sendCmdToShadow(data);
      });
    },

    // 分屏回调 方法
    addSplitHandlerListens () {
      const timer = 10000;
      let timerId = 0;

      if (query('s')) {
        let shadowTimerID = 1;
        // 绑定分屏 - host 连接 - 事件
        EventBus.$on('INTERACT_HOST_CONNECT', () => {
          this.$message('与发起页面连接建立成功');
          clearTimeout(shadowTimerID);
        });

        // 绑定分屏 - host 关闭 - 事件
        EventBus.$on('INTERACT_HOST_CLOSE', () => {
          const role = sessionStorage.getItem('room_role');
          this.$message(`${role == 1 ? '主持人' : '嘉宾'}暂时离开了页面，请稍等...`);
          shadowTimerID = setTimeout(() => {
            this.$message('与发起页连接超时即将关闭分屏页面');
            this.disConnectShadow();
          }, timer);
        });

        // 绑定分屏 - 分屏连接断开 - 事件
        EventBus.$on('INTERACT_HOST_DISCONNECT', e => {
          clearTimeout(shadowTimerID);
          // this.splitStatus = 2 // 重新初始化 互动组件
          this.$message('主持人关闭了分屏');
        });
      } else {
        // 绑定分屏 - 分屏连接 - 事件
        EventBus.$on('INTERACT_SHADOW_CONNECT', e => {
          console.log('debug:: info -> 分屏已建立连接');
          clearTimeout(timerId);
        });

        // 绑定分屏 - 分屏关闭 - 事件
        EventBus.$on('INTERACT_SHADOW_CLOSE', e => {
          this.$message('正在与分屏页面建立连接，请稍等...');
          timerId = setTimeout(() => {
            this.$message('关闭分屏模式');
            this.splitStatus = 2; // 重新初始化 互动组件
            this.closeShadow();
          }, timer);
        });

        // 绑定分屏 - 分屏连接断开 - 事件
        EventBus.$on('INTERACT_SHADOW_DISCONNECT', e => {
          clearTimeout(timerId);
          this.splitStatus = 2; // 重新初始化 互动组件
          this.$message('分屏已关闭');
          console.log('分屏链接断开！');
          this.closeShadow();
          // this.disConnectShadow()
        });
      }
    }
  }
};
</script>
<style lang="less">
  .vhall-split-wrapbox{
    width: 100%;
    height: 100%;
  }
</style>
