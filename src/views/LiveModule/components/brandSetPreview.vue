<template>
  <div class="brand--set--preview">
    <!-- 模拟开关 -->
    <div class="zdy--switch">
      <span :class="switchType === 'pc' ? 'active' : ''" @click.prevent.stop="changeSwitch('pc')">
        PC预览
      </span>
      <span :class="switchType === 'app' ? 'active' : ''" @click.prevent.stop="changeSwitch('app')">
        手机预览
      </span>
    </div>
    <!-- 预览区域 -->
    <div>
      <!--PC预览,begin-->
      <!-- 标识预览 -->
      <div class="pc" v-if="switchType === 'pc' && tabType === 'signSet'">
        <div :class="`skin-preview preview-${switchType} sign-preview`">
          <div class="pc-preview">
            <div class="pc-header" v-if="signSetVo && signSetVo.view_status == 1">
              <img
                class="logo-image"
                :src="domain_url || signSetVo.logo_url"
                alt="标志图"
                v-if="(signSetVo && signSetVo.logo_url) || domain_url"
              />
              <img class="logo-image" src="../../../common/images/skin/logo.png" v-else />
            </div>
            <div class="pc-contain">
              <div class="sign-intro">
                <p>
                  数字化转型时代企业如何做好直播营销
                  <span><img src="../../../common/images/skin/white/live@2x.png" alt="" /></span>
                </p>
              </div>
              <div
                class="sign-title"
                :class="signSetVo && signSetVo.organizers_status == 1 ? 'sign-open' : 'sign-close'"
              >
                <p>
                  <span v-if="signSetVo && signSetVo.organizers_status == 1">
                    主办方：
                    <a class="blue" href="javascript:void(0);">微吼</a>
                  </span>
                  <span class="time">2020-12-18 00:00:00</span>
                </p>
              </div>
            </div>
          </div>
          <div class="sign-version" v-show="signSetVo && signSetVo.reserved_status > 0">
            <p>
              微吼提供技术支持 |
              <span class="blue">反馈与举报</span>
            </p>
          </div>
        </div>
      </div>
      <!-- 皮肤预览 -->
      <div class="pc" v-if="switchType === 'pc' && tabType === 'skinSet'">
        <div :class="`skin-preview preview-${switchType} brand-preview`">
          <div class="skin-header">
            <div class="skin-share">
              <div class="skin-atton skin-left" :style="{ color: skinSetVo.pageStyle }">
                <i class="iconfont-v3 saasfenxiang_icon"></i>
                <p>分享</p>
              </div>
              <div class="skin-atton" :style="{ color: skinSetVo.pageStyle }">
                <i class="iconfont-v3 saasicon_guanzhu"></i>
                <p>关注</p>
              </div>
            </div>
          </div>
          <div
            class="skin-footer"
            :style="{
              backgroundImage: `url(${skinSetVo.bg_url})`,
              backgroundColor: `${skinSetVo.bgColor}`
            }"
          >
            <img src="../../../common/images/skin/skin-footer.png" alt="" />
            <p class="footer-text">
              微吼提供技术支持 |
              <span class="blue">反馈与举报</span>
            </p>
          </div>
          <div class="color-text">
            <p :style="{ backgroundColor: `${skinSetVo.pageStyle}` }"></p>
          </div>
        </div>
      </div>
      <!--PC预览,end-->
      <!--手机预览，begin-->
      <div class="app" v-show="switchType === 'app'">
        <div :class="`skin-preview preview-${switchType} ${bgColorType}`">
          <div class="panel__preview">
            <header class="h5-title" v-if="signSetVo && signSetVo.organizers_status == 1">
              <!-- <img :src="domain_url || signSetVo.logo_url" alt v-if="(signSetVo && signSetVo.logo_url) || domain_url" class="logo"/> -->
              <img src="./image/vhall-logo.png" class="logo" />
              <span class="title">北京微吼时代科技有限公司</span>
              <div class="title-icons" :style="{ color: skinSetVo.pageStyle }">
                <icon icon-class="saasguanzhu"></icon>
                <icon icon-class="saasbiaoji"></icon>
              </div>
            </header>
            <img src="../../../common/images/h5-show-phone-player2x.png" class="h5-player" />
            <!-- 菜单 -->
            <ul class="h5-menu">
              <li>文档</li>
              <li>聊天</li>
              <li
                class="active"
                :style="{ borderBottomColor: skinSetVo.pageStyle, color: skinSetVo.pageStyle }"
              >
                简介
              </li>
              <li>推荐</li>
              <li>商品</li>
            </ul>
            <!-- 简介 -->
            <div class="h5-notice-panel">
              <img
                src="../../../common/images/custom-tab/detail-bg-new-h5.png"
                alt=""
                class="h5-notice"
              />
              <span class="h5__txt" :style="{ background: skinSetVo.pageStyle }"></span>
            </div>
          </div>
        </div>
      </div>
      <!--手机预览,end-->
    </div>
  </div>
</template>
<script>
  export default {
    name: 'brandSetPreview.vue',
    props: ['brandType', 'tabType'],
    data() {
      return {
        switchType: 'pc',
        bgColorType: 'black',
        signSetVo: null,
        skinSetVo: {
          bgColor: '1A1A1A', // 背景色
          pageStyle: 'ff3333', // 按钮色
          bg_url: '' // 背景图
        },
        logoUrl: null,
        domain_url: ''
      };
    },
    methods: {
      changeSwitch(type) {
        this.switchType = type;
      },
      signSetVoInfo(vo, domain_url) {
        this.$nextTick(() => {
          this.signSetVo = vo;
          this.domain_url = domain_url;
          // this.getInterWebinarSkin();
        });
      },
      skinSetVoInfo(vo) {
        this.$nextTick(() => {
          if (vo && Number(vo.status) > 0) {
            // 页面赋值
            this.skinSetVo = vo;
            this.skinSetVo.bg_url = vo.bg_url || vo.domain_url;
          } else {
            this.skinSetVo = {
              bgColor: '#1A1A1A', // 背景色
              pageStyle: '#ff3333', // 按钮色
              bg_url: '' // 背景图
            };
          }
          // this.getSignInfo();
        });
      },
      getSignInfo() {
        let params = {
          webinar_id: this.brandType == 1 ? this.$route.params.str : '',
          type: this.brandType
        };
        this.$fetch('getInterWebinarTag', this.$params(params))
          .then(res => {
            console.log(res);
            if (res && res.code === 200) {
              this.signSetVo = res.data;
            } else {
              this.signSetVo = {};
            }
          })
          .catch(err => {
            console.log(err);
            this.signSetVo = {};
          });
      },
      getInterWebinarSkin() {
        let params = {
          webinar_id: this.brandType == 1 ? this.$route.params.str : '',
          type: this.brandType
        };
        this.$fetch('getInterWebinarSkin', this.$params(params))
          .then(res => {
            if (res && res.code === 200) {
              this.skinSetVo.status = res.data.status;
              if (this.skinSetVo.status > 0) {
                // 页面赋值
                let skin_json_pc = JSON.parse(res.data.skin_json_pc);
                this.skinSetVo.bgColor = skin_json_pc.bgColor || '#1A1A1A';
                this.skinSetVo.pageStyle = skin_json_pc.pageStyle || '#FB3A32';
                this.skinSetVo.bg_url = skin_json_pc.background;
              } else {
                this.skinSetVo = {
                  bgColor: '#1A1A1A', // 背景色
                  pageStyle: '#FB3A32', // 按钮色
                  bg_url: '' // 背景图
                };
              }
            } else {
              this.skinSetVo = {
                bgColor: '#1A1A1A', // 背景色
                pageStyle: '#FB3A32', // 按钮色
                bg_url: '' // 背景图
              };
            }
          })
          .catch(err => {
            console.log(err);
            this.skinSetVo = {
              bgColor: '#1A1A1A', // 背景色
              pageStyle: '#FB3A32', // 按钮色
              bg_url: '' // 背景图
            };
          });
      },
      initPage() {
        this.getSignInfo();
        // this.getInterWebinarSkin();
      }
    },
    created() {
      this.initPage();
    },
    watch: {
      brandType() {
        if (this.brandType) {
          this.initPage();
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  /*预览区域样式开始*/
  .skin-preview.preview-pc {
    width: 400px;
    border: 1px solid #d2d2d2;
    padding-bottom: -10px;
    border-radius: 4px;
    border-top: 0;
    height: 220px;
    position: relative;
    transition: background-color ease-in-out 0.5s;
  }
  .sign-preview {
    background-image: url(../../../common/images/skin/white/brand.png);
    background-size: 100% 100%;
    overflow: hidden;
  }
  .brand-preview {
    overflow: hidden;
    .skin-header {
      width: 100%;
      height: 36px;
      background: url('../../../common/images/skin/skin-header.png') no-repeat;
      background-size: 100% 100%;
      position: relative;
      .skin-share {
        position: absolute;
        right: 30px;
        top: 12px;
        display: flex;
      }
      .skin-atton {
        font-size: 12px;
        transform: scale(0.4);
      }
      .skin-left {
        margin-right: -5px;
      }
      .iconfont-v3 {
        align-items: center;
        padding-left: 3px;
      }
      // .skin-left{
      //   position: absolute;
      //   right: -5px;
      //   top: 0px;
      //   width: 50px;
      // }
      // img{
      //   width: 100%;
      //   height: 100%;
      //   object-fit: scale-down;
      // }
    }
    .skin-footer {
      height: 210px;
      width: 100%;
      background-color: #1a1a1a;
      background-size: 100% 100%;
      padding-top: 5px;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        object-fit: scale-down;
      }
      .footer-text {
        position: absolute;
        bottom: 32px;
        left: 115px;
        font-size: 12px;
        transform: scale(0.5);
        color: #999;
      }
    }
    .color-text {
      position: absolute;
      top: 119px;
      right: 115px;
      p {
        width: 9px;
        height: 1px;
        border-radius: 10px;
        background-color: #fb3a32;
      }
    }
  }
  .zdy--switch {
    margin-bottom: 16px;
  }
  .pc-preview {
    margin-top: 16px;
    width: 100%;
    height: 20px;
    display: flex;
    .pc-header {
      width: 25px;
      height: 100%;
      padding: 2px 0 0 10px;
      .logo-image {
        width: 100%;
        height: 100%;
        // float: left;
        object-fit: scale-down;
      }
    }
    .pc-contain {
      height: 100%;
      // width: calc(100% - 25px);
      width: 100%;
      position: relative;
      margin-left: -95px;
      .sign-intro {
        font-size: 12px;
        color: #999;
        transform: scale(0.4);
        position: absolute;
        top: -3px;
        left: 29px;
        span {
          display: inline-block;
          width: 40px;
          height: 20px;
          margin-left: 10px;
          vertical-align: text-bottom;
          img {
            width: 100%;
            height: 100%;
            object-fit: scale-down;
          }
        }
      }
      .sign-title {
        font-size: 12px;
        color: #999;
        transform: scale(0.4);
        position: absolute;
        left: 46px;
        top: 10px;
        .time {
          padding-left: 10px;
        }
        .blue {
          color: #999;
          &:hover {
            color: blue;
          }
        }
        &.sign-close {
          left: 65px;
        }
      }
    }
  }
  .sign-version {
    position: absolute;
    left: 80px;
    bottom: 2px;
    p {
      color: #666;
      transform: scale(0.3);
      .blue {
        color: #666;
        &:hover {
          color: blue;
        }
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
        font-family: @fontRegular;
        font-weight: 400;
        color: #1a1a1a;
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
    .h5-notice-panel {
      position: relative;
      span {
        width: 2px;
        background: #fb3a32;
        position: absolute;
        top: 114px;
        height: 13px;
        display: block;
        left: 12px;
      }
    }
    .h5-notice {
      width: 100%;
      border-bottom-left-radius: 30px;
      border-bottom-right-radius: 30px;
    }
    .h5-menu {
      /*  margin-top: -5px; */
      height: 40px;
      display: block;
      width: 310px;
      background: #ffffff;
      border-bottom: 1px solid #e6e6e6;
      li {
        list-style-type: none;
        display: inline-block;
        vertical-align: middle;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        font-family: @fontRegular;
        font-weight: 400;
        color: #666666;
        margin-left: 24px;
        &.active {
          border-bottom: 2px solid #fb3a32;
          color: #fb3a32;
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
