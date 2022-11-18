const controle = {
  methods: {
    jingYin() {
      if (this.isMute) {
        this.voice = 50;
        this.isMute = false;
        this.$Vhallplayer.setMute(false, () => {
          console.log('解除静音失败');
          this.isMute = true;
        });
      } else {
        this.voice = -1;
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
      this.statePaly = true;
      this.$Vhallplayer.setCurrentTime(_seekTime, () => {
        console.log('调整播放时间失败');
      });
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
    /**
     * 全屏切换
     */
    enterFullscreen() {
      this.isFullscreen = true;
      const element = document.querySelector('.content-player');
      if (element.requestFullscreen) element.requestFullscreen();
      else if (element.mozRequestFullScreen) element.mozRequestFullScreen();
      else if (element.webkitRequestFullscreen) element.webkitRequestFullscreen();
      else if (element.msRequestFullscreen) element.msRequestFullscreen();
    },
    exitFullscreen() {
      this.isFullscreen = false;
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      else if (document.msExitFullscreen) document.msExitFullscreen();
    },
    // enterFullscreen(){
    //   this.$Vhallplayer.enterFullScreen( ()=> {});
    // },
    // exitFullscreen(){
    //   this.$Vhallplayer.exitFullScreen(() => {});
    // },
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
        this.tipsType = 2;
      });
    }
  }
};
export default controle;
