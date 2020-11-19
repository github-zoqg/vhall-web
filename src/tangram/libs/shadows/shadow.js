import EventBus from '@/utils/Events';

function openUrl (url) {
  window.open(url);
}

let hostEventInited = false;
let shadowEventInited = false;

export default {
  data () {
    return {
      hostWin: null,
      shadowWin: null,
      shadowState: false,
      shadowTimerId: 0
    };
  },

  methods: {
    checkShadow () {
      return new Promise((resolve, reject) => {
        this.hostWin = window;
        this.initHostEvent();
        setTimeout(() => {
          resolve(this.shadowWin);
        }, 500);
      });
    },

    startShadow (url) {
      if (this.shadowState) {
        return;
      }
      this.shadowState = true;
      this.hostWin = window;
      //  宿主环境 关闭- 事件 处理。 发消息进行通知 - 分屏页面关闭
      this.hostWin.onbeforeunload = () => {
        if (!this.shadowState) {
          return;
        }
        this.shadowWin.postMessage('host_close', '*');
      };
      // 初始化 宿主 - 事件监听
      this.initHostEvent();

      // 开启- 分屏页- 分屏页面， 进行消息通信 - 告知 connect
      if (this.shadowWin === null) {
        this.shadowWin = openUrl(url);
      } else {
        this.shadowWin.postMessage('host_connect', '*');
      }
    },

    stopShadow () {
      if (!this.shadowState) {
        return;
      }

      this.shadowState = false;
      // 关闭分屏 - 事件 直接发送 分屏关闭消息
      this.shadowWin && this.shadowWin.postMessage('shadow_stop', '*');
      this.hostWin = null;
      this.shadowWin = null;
    },

    initHostEvent () {
      if (hostEventInited) return;
      hostEventInited = true;
      // 初始化 宿主 - 相关消息
      this.hostWin.onmessage = e => {
        // console.log('debuger info -> message from Shadows::', e)
        let type = e.data;
        if (typeof e.data === 'object') {
          type = e.data.type;
        }
        switch (type) {
          case 'shadow_live':
            this.shadowWin = e.source;
            break;
          case 'shadow_connect':
            EventBus.$emit('INTERACT_SHADOW_CONNECT');
            break;
          case 'shadow_disconnect':
            EventBus.$emit('INTERACT_SHADOW_DISCONNECT');
            break;
          case 'shadow_close':
            EventBus.$emit('INTERACT_SHADOW_CLOSE');
            break;
          case 'cmd':
            EventBus.$emit('INTERACT_SHADOW_MSG', e.data.data);
            break;
          default:
            break;
        }
      };
    },

    connectShadow () {
      return new Promise((resolve, reject) => {
        if (this.shadowState) {
          resolve();
          return;
        }
        this.hostWin = window.opener;
        this.shadowWin = window;
        if (this.hostWin === null) {
          // eslint-disable-next-line prefer-promise-reject-errors
          reject('没有主屏');
          return;
        }
        this.shadowState = true;
        this.hostWin.postMessage('shadow_connect', '*');

        //  50ms heart check
        this.shadowTimerId = setInterval(() => {
          this.hostWin.postMessage('shadow_live', '*');
        }, 50);

        // 分屏关闭 事件
        // 细节，扔进了， new APP 里去处理- 刷新重连 还是， 怎么滴。
        this.shadowWin.onbeforeunload = () => {
          if (!this.shadowState) {
            return;
          }
          this.hostWin.postMessage('shadow_close', '*');
        };

        this.initShadowEvent();

        resolve();
      });
    },

    initShadowEvent () {
      if (shadowEventInited) return;
      shadowEventInited = true;

      this.shadowWin.onmessage = e => {
        let type = e.data;
        if (typeof e.data === 'object') {
          type = e.data.type;
        }
        switch (type) {
          case 'host_connect':
            clearInterval(this.shadowTimerId);
            EventBus.$emit('INTERACT_HOST_CONNECT');
            break;
          case 'shadow_stop':
            this.disConnectShadow(true);
            break;
          case 'host_close':
            this.shadowTimerId = setInterval(() => {
              this.hostWin.postMessage('shadow_live', '*');
            }, 20);

            EventBus.$emit('INTERACT_HOST_CLOSE');
            break;
          case 'cmd':
            EventBus.$emit('INTERACT_HOST_MSG', e.data.data);
            console.log('data', e.data.data);
            if (e.data.data.type) {
              EventBus.$emit(`${e.data.data.type}-split`, e.data.data);
              EventBus.$emit(`${e.data.data.type}`, e.data.data);
            }
          default:
            break;
        }
      };
    },
    disConnectShadow (passive) {
      if (this.hostWin === null) {
        return;
      }
      if (!passive) {
        this.hostWin.postMessage('shadow_disconnect', '*');
      }
      clearInterval(this.shadowTimerId);
      this.shadowState = false;
      this.shadowWin.close();
    },

    sendCmdToHost (data) {
      if (this.hostWin) {
        this.hostWin.postMessage({type: 'cmd', data: data}, '*');
      }
    },

    sendCmdToShadow (data) {
      if (this.shadowWin) {
        this.shadowWin.postMessage({type: 'cmd', data: data}, '*');
      }
    }
  },

  destroyed () {
    // 组件销毁时 - 关闭分屏 （干掉）
    // try {
    //   this.disConnectShadow()
    //   this.stopShadow()
    // } catch (e) {
    //   console.log(e)
    // }
  }
};
