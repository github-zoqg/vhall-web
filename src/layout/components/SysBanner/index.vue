<template>
  <div class="sys-banner-layout" v-if="textBanner && textBanner.is_valid == 1 && !textBannerIsClose">
    <div class="sys-banner-left">
      <icon style="color:#FB3A32" class="sys-banner-ting" :icon-class="'saasicon_yangshengqion'"></icon>
    </div>
    <div @click="onOpenLink" id="sysTextBannerNotice">
      <span id="scroll_begin">{{textBanner ? textBanner.content || '' : '' }}</span>
      <span id="scroll_end"></span>
    </div>
    <div class="sys-banner-right">
      <span @click="onCloseTextBanner" class="sys-banner-close">
        <icon style="color:#595959" :icon-class="'saasicon_close'" ></icon>
      </span>
    </div>
  </div>
</template>
<script>
import Env from '@/api/env';
export default {
  name: 'SysBanner',
  data(){
    return {
      env: Env,
      textBanner: null,
      imageBanner: null,
      MyMar: null,
      textBannerIsClose: false
    };
  },
  methods: {
    /*
    * 获取最新文字标题
    */
    getBannerInfo() {
      return this.$fetch('getBannerSetInfo', {
        type: '0,1'
      }).then(res => {
        if (res && res.code == 200 && res.data) {
          this.textBanner = res.data.list[0] || null
          this.imageBanner = res.data.list[1] || null
          console.log('当前呈现内容', this.textBanner, this.imageBanner)
          // 通知图片层
          this.$EventBus.$emit('saas_vs_image_banner', this.imageBanner);
        }
      }).catch(res => {
        this.textBanner = null
        this.imageBanner = null
      })
    },
    /*
    * 关闭文字公告
    */
    onCloseTextBanner() {
      this.textBannerIsClose = true
      window.localStorage.setItem('text-banner-close-id', this.textBanner.id)
    },
    /*
    * 点击文字跳转
    */
    onOpenLink() {
      if (this.textBanner.link) {
        window.open(this.textBanner.link, "_blank");
      }
    },
    scrollImgLeft(){
      const that = this
      const speed = 50
      try {
        if (that.MyMar) {
          clearInterval(that.MyMar)
        }
      } catch(e) {
        console.log(e)
      }
      that.MyMar = null
      const scroll_begin = document.getElementById('scroll_begin')
      const scroll_end = document.getElementById('scroll_end')
      const scroll_div = document.getElementById('sysTextBannerNotice')
      scroll_end.innerHTML=scroll_begin.innerHTML
      function Marquee(){
        if(scroll_end.offsetWidth-scroll_div.scrollLeft<=0)
          scroll_div.scrollLeft-=scroll_begin.offsetWidth
        else
          scroll_div.scrollLeft++
      }
      that.MyMar = setInterval(Marquee,speed)
      scroll_div.onmouseover = function(){
        clearInterval(that.MyMar)
      }
      scroll_div.onmouseout = function(){
        that.MyMar = setInterval(Marquee,speed)
      }
    }
  },
  async mounted() {
    await this.getBannerInfo()
    const oldTextBannerId = window.localStorage.getItem('text-banner-close-id')
    if (oldTextBannerId && oldTextBannerId.toString() == this.textBanner.id.toString()) {
      // 若当前本地存储永久关闭的id跟当前返回的相等，界面不展示
      this.textBannerIsClose = true
    } else {
      this.textBannerIsClose = false
    }
    if (this.textBanner && this.textBanner.is_valid == 1 && !this.textBannerIsClose) {
      // 按照字数执行，是否滚动
      this.scrollImgLeft()
    }
  }
};
</script>
<style lang="less" scoped>
.sys-banner-layout {
  background: linear-gradient(59.32deg, #FFEBE9 0%, #EDECFF 107.06%);
  box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  height: 48px;
  top: 64px;
  position: fixed;
  z-index: 99;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .sys-banner-left {
    width: 48px;
    height: 48px;
    padding-left: 24px;
    line-height: 48px;
    background: linear-gradient(24.56deg, #FFECEA 14.15%, #F9ECF1 83.55%);
    box-shadow: 0px -2px 10px rgba(0, 0, 0, 0.1);
  }
  .sys-banner-right {
    width: 44px;
    height: 48px;
    padding-right: 24px;
    line-height: 48px;
    background: linear-gradient(23.16deg, #F6ECF6 13.52%, #EFECFE 83.56%);
    box-shadow: -1px 0px 4px rgba(0, 0, 0, 0.1);
  }
  div {
    width: 100%;
    font-family: 'PingFang SC';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    /* identical to box height */
    text-align: left;
    color: #262626;
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    white-space: nowrap;
    span {
      display: inline;
      height: 20px;
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
    }
  }
  .sys-banner-ting {
    margin-top: -2px;
  }
  .sys-banner-close {
    cursor: pointer;
    margin-top: -2px;
    margin-left: 8px;
  }
}
</style>
