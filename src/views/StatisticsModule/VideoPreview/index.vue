<template>
  <div class="preview-wrap">
    <div class="content">
      <div id="videoDom"></div>
      <div
        class="vod-controller"
        @mouseenter="controllerMouseEnter"
        @mouseleave="controllerMouseLeave"
      >
        <div class="slider line-slider">
          <el-slider v-model="sliderVal"
            :show-tooltip="false"
            ref="controllerRef"
            @change="setVideo"
          ></el-slider>
          <div
            class="Times"
            :style="{ left: hoverLeft + 'px' }"
            v-show="TimesShow"
          >
            <span class="current-time">{{ hoverTime | secondToDate }}</span>
          </div>
        </div>
        <div class="wrap">
          <div class="left-box fl">
            <i v-if="statePaly" class="local-icon el-icon-eleme" @click="videoPlayBtn"></i>
            <i v-else class="local-icon el-icon-eleme" @click="videoPlayBtn" ></i>
            <div class="center-box">
              <span class="current-time">
                {{ currentTime | secondToDate }}
              </span>
              <span>/</span>
              <span class="all-time">{{ totalTime | secondToDate }}</span>
            </div>
          </div>
          <div class="right-box fr">
            <div class="volume-box">
              <span class="icon-box">
                <i style="color: #ececec" class="local-icon el-icon-eleme"
                  @click="jingYin" :class="voice > 0 ? 'el-icon-eleme' : 'el-icon-eleme'" ></i>
              </span>
              <div class="ver-slider">
                <el-slider vertical height="100px" :min='1' @change="setVoice" v-model="voice"></el-slider>
              </div>
            </div>
            <i v-if="isFullscreen" class="local-icon el-icon-eleme" @click="exitFullscreen"></i>
            <i v-else class="local-icon el-icon-eleme" @click="enterFullscreen"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { secondToDateZH } from '@/utils/general'
import controle from './js/control'
export default {
  data() {
    this.$Vhallplayer = null
    return {
      totalTime: 0,
      currentTime: 0,
      statePaly: false, // 播放状态
      voice: 20, // 音量
      isMute: false, // 是否为静音
      sliderVal: 0, // seek
      hoverTime: 10, // seek显示时间
      hoverLeft: 10,
      TimesShow: false,
      isFullscreen: false // 全屏
    }
  },
  mixins: [controle],
  filters: {
    secondToDate (val) {
      return secondToDateZH(val)
    },
  },
  created() {
    this.initSDK().then(() => {
      this.initSlider()

        this.totalTime = this.$Vhallplayer.getDuration(() => {
          console.log('获取总时间失败')
        })
    })
  },
  beforeDestroy() {
    window.VhallPlayer.destroy()
  },
  methods: {
    initSDK() {
      const incomingData = {
        appId: 'fd8d3653', // 应用ID，必填
        accountId: 'join_1735023' || 1, // 第三方用户ID，必填
        token: 'vhall', // access_token，必填
        type: 'vod', // live 直播  vod 点播  必填
        videoNode: 'videoDom', // 播放器的容器， div的id 必填
        poster: '', // 封面地址  仅支持.jpg
        vodOption: { recordId: '27157fa', forceMSE: false },
      }
      return new Promise((resolve) => {
        console.log('======实例化播放器参数======', incomingData)
        window.VhallPlayer.createInstance(
          incomingData,
          (event) => {
            this.$Vhallplayer = event.vhallplayer
            window.vp = this.$Vhallplayer
            this.$Vhallplayer.openControls(false)
            this.$Vhallplayer.on(window.VhallPlayer.LOADED, () => {
              // 加载中
              resolve()
            })
          },
          (e) => {
            console.log('播放器创建实例失败', e, e.message)
            throw new Error(e.message)
          }
        )
      })
    },
    destroy() {
      this.$Vhallplayer.destroy()
    },
    videoPlayBtn(){
      console.log('播放 -- 暂停', this.statePaly)
      if(this.statePaly){
        this.statePaly = false
        this.$Vhallplayer.pause()
      }else{
        this.statePaly = true
        this.$Vhallplayer.play()
      }
    },
    controllerMouseLeave () {
      clearTimeout(this.hoverVideoTimer)
      this.hoverVideoTimer = setTimeout(() => {
      }, 3000)
    },
    controllerMouseEnter () {
      clearTimeout(this.hoverVideoTimer)
    },
    initSlider () {
      this.$Vhallplayer.on(window.VhallPlayer.TIMEUPDATE, () => {
        this.currentTime = this.$Vhallplayer.getCurrentTime(() => {})
        this.sliderVal = (this.currentTime / this.totalTime) * 100
      })
      // 拖拽显示时间
      // const dom = this.$refs.controllerRef.$el
      // const but = document.querySelector('div.el-slider__button-wrapper')
      // const innitDom = () => {
      //   dom.onmouseover = e => {
      //     console.log('dom over', e)
      //     this.TimesShow = true
      //     const totalWidth = dom.offsetWidth
      //     this.ContorlWidth = dom.offsetWidth
      //     const lef = e.layerX
      //     this.hoverTime = (lef / totalWidth) * this.totalTime
      //     this.hoverLeft = lef
      //     dom.onmousemove = event => {
      //       const lef = event.layerX
      //       this.hoverTime = (lef / totalWidth) * this.totalTime
      //       this.hoverLeft = lef
      //     }
      //   }
      //   dom.onmouseout = e => {
      //     this.TimesShow = false
      //   }
      // }
      // innitDom()
      // but.onmousedown = e => {
      //   dom.onmouseout = dom.onmousemove = dom.onmousemove = dom.onmouseover = null
      //   this.ContorlWidth = dom.offsetWidth
      //   this.onmousedownControl = true
      //   this.pause()
      //   document.onmousemove = e => {
      //     this.TimesShow = true
      //   }
      //   document.onmouseup = e => {
      //     document.onmousemove = null
      //     this.onmousedownControl = false
      //     this.TimesShow = false
      //     innitDom()
      //   }
      // }
      // but.onmouseover = e => {
      //   this.TimesShow = false
      //   e.stopPropagation()
      // }
    },
  },
}
</script>
<style lang="less" scoped>
.content {
  height: 100%;
  height: 320px;
  position: relative;
  .head {
    height: 40px;
    color: red;
    line-height: 40px;
    background: #ccc;
    span {
      display: inline-block;
      width: calc(100% - 40px);
      text-align: center;
    }
    .close {
      padding-right: 10px;
    }
  }
}
#videoDom {
  height: calc(100% - 50px);
  /deep/.vhallPlayer-container{
    display: none!important;
  }
}
.vod-controller{
  position: relative;
  width: 100%;
  display: flex;
  height: 40px;
  border: 1px solid blue;
  flex: 1;
  .local-icon{
    display: inline-block;
    width: 38px;
    text-align: center;
  }
  .slider::v-deep{
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    &:hover{
      top: -2px;
      .el-slider__runway{
        height: 8px;
      }
    }
    .el-slider{
      .el-slider__runway{
        margin: 0;
      }
    }
  }
  .wrap{
    width: 100%;
    .left-box{
      .local-icon{
        margin: 0 4px;
      }
      .center-box{
        display: inline-block;
        line-height: 40px;
      }
    }
    .right-box{
      .volume-box{
        display: inline-block;
        line-height: 40px;
        position: relative;
        &:hover{
          .ver-slider{
            display: block;
          }
        }
        .ver-slider{
          display: none;
          position: absolute;
          left: 0;
          bottom: 30px;
        }
      }
    }
  }
}
</style>
