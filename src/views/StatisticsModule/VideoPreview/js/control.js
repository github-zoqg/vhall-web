const controle = {
  methods: {
    jingYin(){
      if(this.isMute){
        this.isMute = false
        this.$Vhallplayer.setMute(false, ()=>{
          console.log('解除静音失败')
          this.isMute = true
        })
      }else{
        this.isMute = true
        this.$Vhallplayer.setMute(true, ()=>{
          this.isMute = false
          console.log('设置静音失败')
        })
      }
    },
    setVoice(){
      this.$Vhallplayer.setVolume(this.voice, ()=>{
        console.log('改变音量失败')
      })
    },
    setVideo(){
      console.log('seek', )
      let _seekTime = 0
      _seekTime = (this.sliderVal / 100) * this.totalTime
      this.$Vhallplayer.setCurrentTime(_seekTime, () => {
        console.log('调整播放时间失败')
      })
    },
    enterFullscreen(){
      console.log('en  quan')
      this.$Vhallplayer.enterFullScreen( ()=> {})
    },
    exitFullscreen(){
      console.log('tuichu  quan')
      this.$Vhallplayer.exitFullScreen(() => {})
    },
  },
}
export default controle

