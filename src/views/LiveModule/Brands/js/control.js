const controle = {
  methods: {
    jingYin() {
      if (this.isMute) {
        this.isMute = false;
        this.$Vhallplayer.setMute(false, () => {
          console.log('解除静音失败');
          this.isMute = true;
        });
      } else {
        this.isMute = true;
        this.$Vhallplayer.setMute(true, () => {
          this.isMute = false;
          console.log('设置静音失败');
        });
      }
    },
    setVoice() {
      this.$Vhallplayer.setVolume(this.voice, () => {
        console.log('改变音量失败');
      });
    },
    setVideo() {
      let _seekTime = 0;
      _seekTime = (this.sliderVal / 100) * this.totalTime;
      this.$Vhallplayer.setCurrentTime(_seekTime, () => {
        console.log('调整播放时间失败');
      });
      // 拖动的时候，若进度大于0，设定播放效果
      this.statePaly = this.formOther.progress > 0;
    },
    videoPlayBtn() {
      if (this.statePaly) {
        this.statePaly = false;
        this.$Vhallplayer.pause();
      } else {
        this.statePaly = true;
        this.$Vhallplayer.play();
      }
    },
    enterFullscreen() {
      this.$Vhallplayer.enterFullScreen(() => {});
    },
    exitFullscreen() {
      this.$Vhallplayer.exitFullScreen(() => {});
    },
    wrapEnter() {
      this.hoveVideo = true;
    },
    wrapLeave() {
      this.hoveVideo = false;
    },
    resetPlay() {
      this.sliderVal = 0;
      this.statePaly = true;
      this.$Vhallplayer.play();
      this.tipsType = 0;
      this.setVideo();
      console.log(this.tipsType, '23424');
    },
    listen() {
      this.$Vhallplayer.on(window.VhallPlayer.ENDED, () => {
        console.log('播放结束');
        this.statePaly = false;
      });
    }
  }
};
export default controle;
