<template>
  <div class="brand--set--preview">
    <!-- 模拟开关 -->
    <div class="zdy--switch">
      <span :class="switchType === 'pc' ? 'active' : ''" @click.prevent.stop="changeSwitch('pc')">PC预览</span>
      <span :class="switchType === 'app' ? 'active' : ''"  @click.prevent.stop="changeSwitch('app')">手机预览</span>
    </div>
    <!-- 预览区域 -->
    <div>
      <!--PC预览,begin-->
      <div class="pc" v-show="switchType === 'pc'">
        <div :class="`skin-preview preview-${switchType} ${bgColorType}`">
          <div></div>
          <div class="header">
            <div class="img-logo">
              <img :src="logoUrl" alt="" v-if="logoUrl && signSetVo.view_status > 0"/>
            </div>
          </div>
          <div class="player">
            <div class="player-content">
              <div class="player-title">
                <div class="player-title-logo">
                  <img class="logo-img" title="logo" />
                  <img height="21" width="112" class="player-title-img" src="../../../common/images/skin/black/player-title.png" v-if="bgColorType === 'black'" />
                  <img height="21" width="112" class="player-title-img" src="../../../common/images/skin/white/player-title.png" v-else/>
                </div>
                <div class="player-title-online">
                  <div class="blog">
                    <div class="online"></div>
                  </div>
                  <img width="83" height="20" class="play-follow-img" src="../../../common/images/skin/black/blog-follow.png" v-if="bgColorType === 'black'" />
                  <img width="83" height="20" class="play-follow-img" src="../../../common/images/skin/white/blog-follow.png" v-else/>
                </div>
              </div>
              <div class="player-video">
                <img width="401" height="186" src="../../../common/images/skin/black/player.png" v-if="bgColorType === 'black'"/>
                <img width="401" height="186" src="../../../common/images/skin/white/player.png" v-else/>
              </div>
            </div>
          </div>
          <div class="recommend">
            <div class="rcm-list">
              <div class="rcm-title">
                <div class="title-text">
                  <img width="28" height="10" src="../../../common/images/skin/black/recommend-title.png" v-if="bgColorType === 'black'"/>
                  <img width="28" height="10" src="../../../common/images/skin/white/recommend-title.png" v-else/>
                </div>
              </div>
              <div class="rcm-li">
                <img width="369" height="69" src="../../../common/images/skin/black/recommend-list.png" v-if="bgColorType === 'black'" />
                <img width="369" height="69" src="../../../common/images/skin/white/recommend-list.png" v-else/>
              </div>
            </div>
          </div>
          <div class="discription">
            <div class="dct-list">
              <div class="dct-title">
                <div class="title-text">
                  <img width="28" height="10" src="../../../common/images/skin/black/discription-title.png"  v-if="bgColorType === 'black'" />
                  <img width="28" height="10" src="../../../common/images/skin/white/discription-title.png" v-else/>
                </div>
              </div>
              <div class="dct-cont">
                <img width="371" height="68" src="../../../common/images/skin/black/discription-content.png" v-if="bgColorType === 'black'" />
                <img width="371" height="68" src="../../../common/images/skin/white/discription-content.png" v-else/>
              </div>
            </div>
          </div>
          <div class="copyright">
            <div class="content">
              <img width="176" height="25" src="../../../common/images/skin/black/copyright.png"  v-if="bgColorType === 'black'" />
              <img width="176" height="25" src="../../../common/images/skin/white/copyright.png" v-else/>
            </div>
          </div>
          <!--弹窗,beigin-->
          <div :class="'pop-window ' + bgColorType">
            <div class="pop-title">
              <img width="168" height="16" src="../../../common/images/skin/black/pop-title.png"  v-if="bgColorType === 'black'" />
              <img width="168" height="16" src="../../../common/images/skin/white/pop-title.png" v-else/>
            </div>
            <div class="pop-content">
              <div class="pop-price-btn"></div>
              <div class="pop-pay-btn"></div>
              <img width="168" height="105" src="../../../common/images/skin/black/pop-content.png"  v-if="bgColorType === 'black'" />
              <img width="168" height="105" src="../../../common/images/skin/white/pop-content.png" v-else/>
            </div>
          </div>
          <!--弹窗,end-->
        </div>
      </div>
      <!--PC预览,end-->
      <!--手机预览，begin-->
      <div class="app" v-show="switchType === 'app'">
        <div :class="`skin-preview preview-${switchType} ${bgColorType}`">
          <div class="panel__preview">
            <header class="h5-title">
              <img src="../../../common/images/h5-show-phone-logo2x.png" class="logo"/>
              <span class="title">北京微吼时代科技有限公司</span>
              <div class="title-icons">
                <icon icon-class="saasguanzhu"></icon>
                <icon icon-class="saasbiaoji"></icon>
              </div>
            </header>
            <img src="../../../common/images/h5-show-phone-player2x.png" class="h5-player"/>
            <!-- 菜单 -->
            <ul class="h5-menu">
              <li>文档</li>
              <li>聊天</li>
              <li class="active">简介</li>
              <li>推荐</li>
              <li>商品</li>
            </ul>
            <!-- 简介 -->
            <img src="../../../common/images/custom-tab/detail-bg-new-h5.png" alt="" class="h5-notice" />
          </div>
        </div>
      </div>
      <!--手机预览,end-->
    </div>
  </div>
</template>
<script>
import Env from "@/api/env";

export default {
  name: "brandSetPreview.vue",
  data() {
    return {
      switchType: 'pc',
      bgColorType: 'black',
      signSetVo: null,
      logoUrl: null
    };
  },
  methods: {
    changeSwitch(type) {
      this.switchType = type;
    },
    signSetVoInfo(vo) {
      this.$nextTick(() => {
        this.signSetVo = vo;
        this.logoUrl = this.$domainCovert(Env.staticLinkVo.uploadBaseUrl, this.signSetVo.logo_url);
      });
    }
  },
  mounted() {
    this.$EventBus.$on('SAAS_V3_SIGN_PREVIEW', this.signSetVoInfo);
  }
};
</script>

<style lang="less" scoped>
/*预览区域样式开始*/
.skin-preview.preview-pc {
  width: 445px;
  height: 565px;
  border: 1px solid #d2d2d2;
  img {
    vertical-align: middle;
    border: none;
  }
  .header {
    background: none;
    width: 443px;
    height: 117px;
    border: none;
    margin-bottom: -91px;
    .img-logo {
      width: 100%;
      height: 27px;
      background: #ffffff;
      img {
        margin: 0 0 0 20px;
        padding: 0;
        width: auto;
        height: 27px;
      }
    }
  }
  .player {
    height: 236px;
    width: 443px;
    padding-top: 10px;
    background-size: 443px 236px;
  }
  .player-content {
    margin: 0 auto;
    height: 236px;
    width: 402px;
  }
  .player-title {
    height: 29px;
    position: relative;
    z-index: 1;
    width: 100%;
    .player-title-logo {
      display: inline;
    }
    .logo-img {
      display: none;
      width: 27px;
      height: 27px;
      border: 1px solid #d2d2d2;
      border-radius: 2px;
    }
    .player-title-img {
      width: 112px;
      height: 21px;
    }
    .player-title-online {
      display: inline;
      float: right;
    }
  }
  .blog {
    z-index: 98;
    height: 10px;
    width: 54px;
    background-color: #ff3333;
    border-radius: 2px;
    margin-top: 10px;
  }
  .online {
    float: right;
    height: 10px;
    width: 27px;
    border-bottom-right-radius: 2px;
    border-top-right-radius: 2px;
    background: url(../../../common/images/skin/online-count.png) no-repeat;
    background-size: 27px 10px;
  }
  .play-follow-img {
    width: 83px;
    height: 20px;
    position: absolute;
    margin-top: -20px;
    margin-left: -29px;
  }
  .player-video {
    img {
      width: 401px;
      height: 186px;
    }
  }
  .recommend {
    width: 100%;
    height: 110px;
    margin-top: 10px;
  }
  .rcm-list {
    margin: 0 auto;
    height: 110px;
    width: 402px;
    border: 1px solid rgba(210,210,210,0.08);
    border-radius: 2px;
    background: rgba(255,255,255,0.08);
  }
  .rcm-title {
    height: 18px;
    border-bottom: 1px solid rgba(210,210,210,0.08);
  }
  .title-text {
    text-align: center;
    vertical-align: middle;
    height: 18px;
    line-height: 18px;
    width: 60px;
    border-bottom: 2px solid #ff0000;
    img {
      margin: 0 auto;
      padding-bottom: 3px;
    }
  }
  .rcm-li {
    height: 90px;
    line-height: 90px;
    text-align: center;
  }
  .discription {
    height: 110px;
    width: 100%;
    margin-top: 5px;
  }
  .dct-list {
    margin: 0 auto;
    height: 110px;
    width: 402px;
    border: 1px solid rgba(210,210,210,0.08);
    border-radius: 2px;
    background: rgba(255,255,255,0.08);
  }
  .dct-title {
    height: 18px;
    border-bottom: 1px solid rgba(210, 210, 210, 0.08);
    .title-text {
      text-align: center;
      vertical-align: middle;
      height: 18px;
      line-height: 18px;
      width: 60px;
      border-bottom: 2px solid #ff0000;
      img {
        margin: 0 auto;
        padding-bottom: 3px;
      }
    }
  }
  .dct-cont {
    text-align: center;
    height: 90px;
    line-height: 90px;
  }
  .copyright {
    width: 100%;
    margin-top: 10px;
  }
  .content {
    margin: 0 auto;
    height: 42px;
    line-height: 42px;
    width: 402px;
    text-align: center;
    border-top: 1px solid rgba(210,210,210,0.08);
  }
  .pop-window {
    display: none;
    position: absolute;
    width: 168px;
    height: 121px;
    border-radius: 2px;
    margin-top: -436px;
    margin-left: 130px;
    &.black {
      background-color: rgb(21, 21, 24);
    }
    &.white {
      background-color: #fff;
    }
  }
  .pop-title {
    width: 168px;
    height: 16px;
    line-height: 16px;
    background: rgba(0,0,0,0.15);
    vertical-align: middle;
  }
  .pop-content {
    width: 168px;
    height: 105px;
    background-color: rgba(255,255,255,0.1);
    img {
      position: absolute;
    }
  }
  .pop-price-btn {
    position: absolute;
    width: 49px;
    height: 13px;
    border-radius: 2px;
    margin-top: 8px;
    margin-left: 31px;
    background-color: #ff3333;
  }
  .pop-pay-btn {
    position: absolute;
    width: 105px;
    height: 13px;
    border-radius: 2px;
    margin-top: 83px;
    margin-left: 32px;
    background-color: #ff3333;
  }
  &.black {
    background: rgb(51, 51, 51);
  }
  &.white {
    background: #ffffff;
    .rcm-list,.dct-list {
      border-color: rgba(210, 210, 210, 0.8);
    }
    .rcm-title,.dct-title {
      border-bottom-color: rgba(210, 210, 210, 0.8);
    }
  }
}
.skin-preview.preview-app {
  width: 368px;
  height: 674px;
  background-image: url('../../../common/images/h5-show-phone-null2x.png');
  background-size: cover;
  margin-top: -16px;
  margin-left: -16px;
  position: relative;
  .panel__preview {
    position: absolute;
    top: 84px;
    width: 310px;
    left: 27px;
  }
  .h5-title {
    .flex-display();
    padding: 12px 12px;
    .logo {
      display: inline-block;
      vertical-align: middle;
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    span.title {
      display: inline-block;
      vertical-align: middle;
      margin-left: 8px;
      width: 168px;
      height: 24px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #1A1A1A;
      line-height: 24px;
    }
    .title-icons {
      display: inline-block;
      vertical-align: middle;
      margin-left: auto;
      span:last-child {
        margin-left: 14px;
      }
    }
  }
  .h5-player {
    width: 310px;
    height: 174px;
  }
  .h5-notice {
    width: 100%;
    border-bottom-left-radius: 30px;
    border-bottom-right-radius: 30px;
  }
  .h5-menu {
    margin-top: -5px;
    height: 40px;
    display: block;
    width: 310px;
    background: #FFFFFF;
    border-bottom: 1px solid #E6E6E6;
    li {
      list-style-type: none;
      display: inline-block;
      vertical-align: middle;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      margin-left: 24px;
      &.active {
        border-bottom: 2px solid #FB3A32;
        color: #FB3A32;
      }
    }
  }
  .panel__preview__ctx {
    height: 275px;
    overflow-y: auto;
    border-bottom-right-radius: 20px;
    border-bottom-left-radius: 20px;
  }
}
</style>
