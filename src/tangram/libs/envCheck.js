import { browserSupport } from '@/utils/getBrowserType';
import EventBus from '@/utils/Events';
export default {
  data () {
    return {
      vhallDeviceChecked: false,
      CanNotApply: false
    };
  },

  methods: {
    vhallChecking () {
      this.customGetDevices();
    },
    getDevices () {
      VhallRTC.getDevices({
      }, (devices) => {
        console.log('设备检测结果--------', devices);

        this.audioDevices = devices.audioInputDevices.filter(
          d =>
            d.deviceId != 'default' &&
            d.deviceId != 'communications' &&
            d.label
        );
        this.videoDevices = devices.videoInputDevices.filter(d => {
          return d.deviceId != 'desktopScreen' && !!d.label;
        });

        try {
          this.selectedVideoDeviceId = this.videoDevices[0].deviceId;
        } catch (e) {

        }

        try {
          this.selectedAudioDeviceId = this.audioDevices[0].deviceId;
        } catch (e) {

        }
        let savedAudioDevice = sessionStorage.getItem('selectedAudioDeviceId');
        let savedVideoDevice = sessionStorage.getItem('selectedVideoDeviceId');
        if (!savedAudioDevice || savedAudioDevice == 'undefined') {
          sessionStorage.setItem('selectedAudioDeviceId', this.selectedAudioDeviceId || '');
        }
        if (!savedVideoDevice || savedVideoDevice == 'undefined') {
          sessionStorage.setItem('selectedVideoDeviceId', this.selectedVideoDeviceId || '');
        }
      }, e => {
        console.log('获取设备列表失败', e);
      });
    },
    customGetDevices () {
      if (this.isInteract == 1 && navigator.mediaDevices) {
        navigator.mediaDevices.getUserMedia({audio: true, video: true}).then((stream) => {
          EventBus.$emit('deviceSuccess', { audio: true, video: true, type: 'permissionCheck' });
          this.setDeviceStatus(1);
          stream.getTracks().forEach((trackInput) => {
            trackInput.stop();
          });
        }).catch((error) => {
          this.setDeviceStatus(2);
          EventBus.$emit('deviceSuccess', { audio: false, video: false, type: 'permissionCheck' });
          console.error('error', error.name + ' : ' + error.message);
        });
      }
    },
    setDeviceStatus (videoStatus = 0) {
      if (!browserSupport()) {
        videoStatus = 2;
      }
      const type = this.testDevice() ? 1 : 0;
      let lenovo = [ '890279069', '976817269', '674698863', '218742512', '799785041', '720407287', '750076078', '793263025', '829349167', '583800996' ];
      let _flag = true;
      try {
        _flag = !lenovo.includes(this.ilId);
        /*
        * 防止ilId 不存在报错
        */
      } catch (error) {
        _flag = true;
      }
      if (_flag) {
        this.$vhallFetch('setDevice', {
          room_id: this.roomId,
          status: videoStatus,
          type: type
        }).then(() => {});
      }
    },

    testDevice () {
      const UA = navigator.userAgent;
      return /(nokia|iphone|android|ipad|motorola|^mot-|softbank|foma|docomo|kddi|up\.browser|up\.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam\-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte\-|longcos|pantech|gionee|^sie\-|portalmmm|jig\s browser|hiptop|^ucweb|^benq|haier|^lct|opera\s*mobi|opera\*mini|320x320|240x320|176x220)/i.test(UA);
    }
  }

};
