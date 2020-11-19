<template>
  <div id="preview-audio" class="preview-audio">
    <div class="preview-audio-current" :style="{width:`${this.width}%`}"></div>
  </div>
</template>
<script>
export default {
  props: {
    visible: {
      required: true
    },
    audioId: {
      required: true,
      default: null
    }
  },
  data () {
    return {
      rafID: null,
      analyserNode: null,
      width: 0
    };
  },
  watch: {
    visible (newValue) {
      if (newValue) {
        this.initAudio(this.audioId);
      } else {
        this.cancelAnalyserUpdates();
      }
    },
    audioId (newValue) {
      if (newValue && this.visible) {
        this.cancelAnalyserUpdates();
        window.setTimeout(() => {
          this.initAudio(newValue);
        }, 200);
      }
    }
  },
  methods: {
    initAudio (audioId) {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!navigator.getUserMedia) {
        navigator.getUserMedia =
          navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
      }
      if (!navigator.cancelAnimationFrame) {
        navigator.cancelAnimationFrame =
          navigator.webkitCancelAnimationFrame ||
          navigator.mozCancelAnimationFrame;
      }
      if (!navigator.requestAnimationFrame) {
        navigator.requestAnimationFrame =
          navigator.webkitRequestAnimationFrame ||
          navigator.mozRequestAnimationFrame;
      }

      navigator.getUserMedia(
        { audio: {deviceId: audioId} },
        stream => {
          this.stream = stream;
          const audioContext = new AudioContext();
          this.inputPoint = audioContext.createGain();
          this.audioInput = audioContext.createMediaStreamSource(stream);
          this.audioInput.connect(this.inputPoint);

          this.analyserNode = audioContext.createAnalyser();
          this.analyserNode.fftSize = 1024;
          this.inputPoint.connect(this.analyserNode);

          this.zeroGain = audioContext.createGain();
          this.zeroGain.gain.value = 0.0;
          this.inputPoint.connect(this.zeroGain);
          this.zeroGain.connect(audioContext.destination);
          //  播放
          this.scriptNode = audioContext.createScriptProcessor(1024, 1, 1);
          this.audioInput.connect(this.scriptNode);
          this.scriptNode.connect(audioContext.destination);
          this.audioInput.connect(audioContext.destination);
          this.scriptNode.onaudioprocess = () => {
            this.rafID = window.requestAnimationFrame(this.updateAnalysers);
          };
        },
        e => {
          console.error(e);
        }
      );
    },
    updateAnalysers (time) {
      if (!this.analyserNode) return;
      const freqByteData = new Uint8Array(this.analyserNode.frequencyBinCount);
      this.analyserNode.getByteFrequencyData(freqByteData);
      let magnitude = 0;
      for (let j = 0; j < this.analyserNode.frequencyBinCount; j++) {
        magnitude += freqByteData[j];
      }
      this.width = (magnitude / this.analyserNode.frequencyBinCount) * 2;
    },
    cancelAnalyserUpdates () {
      window.cancelAnimationFrame(this.rafID);
      this.inputPoint && this.inputPoint.disconnect();
      this.audioInput && this.audioInput.disconnect();
      this.scriptNode && this.scriptNode.disconnect();
      this.rafID = null;
      this.inputPoint = null;
      this.audioInput = null;
      this.analyserNode = null;
      this.zeroGain = null;
      this.stream.getTracks().forEach((trackInput) => {
        trackInput.stop();
      });
    }
  },
  destroyed () {
    this.cancelAnalyserUpdates();
  }
};
</script>
<style lang="less" scoped>
.preview-audio {
  width: 320px;
  height: 40px;
  margin: auto;
  background: url('../../buTemplates/saas/img/volume_gray.png') no-repeat;
  background-position: left center;
  & > .preview-audio-current {
    background: url('../../buTemplates/saas/img/volume_orange.png') no-repeat;
    background-position: left center;
    height: 40px;
    position: relative;
  }
}
</style>
