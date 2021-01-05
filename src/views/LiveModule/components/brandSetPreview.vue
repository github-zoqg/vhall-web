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
        <div :class="`skin-preview preview-${switchType}`" :style="{ backgroundColor: `${skinSetVo.bgColor}`}">
          <header class="pc-header" v-if="signSetVo && signSetVo.view_status == 1">
            <img class="logo-image" :src="domain_url || signSetVo.logo_url" alt="标志图" v-if="(signSetVo && signSetVo.logo_url) || domain_url"/>
            <div class="title-right">
              <el-button class="button-style button-login" size="mini">登录</el-button>
              <el-button class="button-style button-register" size="mini" type="primary">注册</el-button>
            </div>
          </header>
          <section class="watchContainer"
                   :style="{background: `url(${skinSetVo.bg_url}) 0% 0% / cover no-repeat`}">
            <div class="area">
              <div class="topInfo">
                <p class="">
                  <b>活动标题发布会{{skinSetVo.bgColor.toUpperCase() !== '#1A1A1A'}}</b>
                  <span class="tag">直播</span>
                  <span class="right gray font-14">131237次观看</span>
                </p>
                <p class="top-bottom" >
                  <span class="mrR" v-if="signSetVo && signSetVo.organizers_status == 1">主办方：<a class="blue" href="javascript:void(0);">紫禁之巅</a></span>
                  <span>时间：2020-12-18 00:00:00</span>
                  <span class="right iconBtn" v-if="signSetVo && signSetVo.organizers_status == 1">
                    <icon icon-class="saasyijianfankui">反馈</icon>
                    <template>
                      <i class="focusBtn" :style="{'backgroundColor': skinSetVo.pageStyle}">关注</i>
                      <i class="focusCount">1314520</i>
                    </template>
                    </span>
                </p>
              </div>
              <div class="player">
                <div class="player-content">
                  <div class="player-video">
                    <img width="401" height="186" src="../../../common/images/skin/white/player.png"/>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div class="recommend">
            <div class="rcm-list">
              <div class="rcm-title">
                <div class="title-text" :style="{'borderBottomColor': skinSetVo.pageStyle}">
                  <img width="30" height="10" src="../../../common/images/skin/white/recommend-title.png"
                       v-if="skinSetVo.bgColor.toUpperCase() !== '#1A1A1A'"/>
                  <img width="28" height="10" src="../../../common/images/skin/black/recommend-title.png"
                       v-else/>
                </div>
              </div>
              <div class="rcm-li">
                <img width="369" height="69" src="../../../common/images/skin/white/recommend-list.png"
                     v-if="skinSetVo.bgColor.toUpperCase() !== '#1A1A1A'" />
                <img width="369" height="69" src="../../../common/images/skin/black/recommend-list.png"
                     v-else/>
              </div>
            </div>
          </div>
          <div class="discription">
            <div class="dct-list">
              <div class="dct-title">
                <div class="title-text" :style="{'borderBottomColor': skinSetVo.pageStyle}">
                  <img width="28" height="10" src="../../../common/images/skin/white/discription-title.png"
                       v-if="skinSetVo.bgColor.toUpperCase() !== '#1A1A1A'" />
                  <img width="28" height="10" src="../../../common/images/skin/black/discription-title.png"
                       v-else/>
                </div>
              </div>
              <div class="dct-cont">
                <img width="371" height="68" src="../../../common/images/skin/white/discription-content.png"
                     v-if="skinSetVo.bgColor.toUpperCase() !== '#1A1A1A'"/>
                <img width="371" height="68" src="../../../common/images/skin/black/discription-content.png"
                     v-else/>
              </div>
            </div>
          </div>
          <div class="copyright" v-show="(signSetVo && signSetVo.reserved_status > 0)">
            <div class="content">
              <img width="176" height="25" src="../../../common/images/skin/white/copyright.png"
                   v-if="skinSetVo.bgColor.toUpperCase() !== '#1A1A1A'" />
              <img width="176" height="25" src="../../../common/images/skin/black/copyright.png"
                   v-else/>
            </div>
          </div>
        </div>
      </div>
      <!--PC预览,end-->
      <!--手机预览，begin-->
      <div class="app" v-show="switchType === 'app'">
        <div :class="`skin-preview preview-${switchType} ${bgColorType}`">
          <div class="panel__preview">
            <header class="h5-title"  v-if="signSetVo && signSetVo.organizers_status == 1">
              <img :src="domain_url || signSetVo.logo_url" alt v-if="(signSetVo && signSetVo.logo_url) || domain_url" class="logo"/>
              <span class="title">北京微吼时代科技有限公司</span>
              <div class="title-icons" :style="{'color': skinSetVo.pageStyle }">
                <icon icon-class="saasguanzhu"></icon>
                <icon icon-class="saasbiaoji"></icon>
              </div>
            </header>
            <img src="../../../common/images/h5-show-phone-player2x.png" class="h5-player"/>
            <!-- 菜单 -->
            <ul class="h5-menu">
              <li>文档</li>
              <li>聊天</li>
              <li class="active" :style="{ 'borderBottomColor': skinSetVo.pageStyle, 'color': skinSetVo.pageStyle }">简介</li>
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
      skinSetVo: {
        bgColor: 'ffffff', // 背景色
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
        console.log(this.signSetVo, '4444444444444444')
      });
    },
    skinSetVoInfo(vo) {
      this.$nextTick(() => {
        this.skinSetVo = vo;
        if (vo.status > 0)  {
          // 页面赋值
          this.skinSetVo = vo;
          this.skinSetVo.bg_url = vo.bg_url || vo.domain_url;
        } else {
          this.skinSetVo = {
            bgColor: '#FFFFFF', // 背景色
            pageStyle: '#ff3333', // 按钮色
            bg_url: '' // 背景图
          };
        }
        console.log(this.skinSetVo, '11111111111111')
      });
    },
    getSignInfo() {
      this.$fetch('getInterWebinarTag', {
        webinar_id: this.$route.params.str
      }).then(res => {
        console.log(res);
        if (res && res.code === 200) {
          this.signSetVo = res.data;
        } else {
          this.signSetVo = {};
        }
        console.log(this.signSetVo, '2222222222222')
      }).catch(err=>{
        console.log(err);
        this.signSetVo = {};
      });
    },
    getInterWebinarSkin() {
      this.$fetch('getInterWebinarSkin', {
        webinar_id: this.$route.params.str
      }).then(res => {
        if (res && res.code === 200) {
          this.skinSetVo.status = res.data.status
          if (this.skinSetVo.status > 0)  {
            // 页面赋值
            let skin_json_pc = JSON.parse(res.data.skin_json_pc);
            this.skinSetVo.bgColor = skin_json_pc.bgColor || '#FFFFFF';
            this.skinSetVo.pageStyle = skin_json_pc.pageStyle || '#FB3A32';
            this.skinSetVo.bg_url = skin_json_pc.background;
          } else {
            this.skinSetVo = {
              bgColor: '#FFFFFF', // 背景色
              pageStyle: '#FB3A32', // 按钮色
              bg_url: '' // 背景图
            };
          }
          console.log(this.skinSetVo, '333333333333333')
        } else {
          this.skinSetVo = {
            bgColor: '#FFFFFF', // 背景色
            pageStyle: '#FB3A32', // 按钮色
            bg_url: '' // 背景图
          };
        }
      }).catch(err=>{
        console.log(err);
        this.skinSetVo = {
          bgColor: '#FFFFFF', // 背景色
          pageStyle: '#FB3A32', // 按钮色
          bg_url: '' // 背景图
        };
      });
    },
    initPage() {
      this.getSignInfo();
      this.getInterWebinarSkin();
    }
  },
  created() {
   this.initPage();
  }
};
</script>

<style lang="less" scoped>
/*预览区域样式开始*/
.skin-preview.preview-pc{
  width: 445px;
  border: 1px solid #d2d2d2;
  padding-bottom: 40px;
}
.pc-header {
  padding: 0 24px;
  .logo-image {
    width: auto;
    height: 26px;
    float: left;
    margin-top: 10px;
    margin-bottom: 10px;
  }
  .title-right {
    float: right;
    margin-top: 10px;
    margin-bottom: 10px;
    /deep/.el-button {
      width: 48px;
      height: 26px;
      line-height: 26px;
      padding: 0 0;
    }
  }
}
.watchContainer{
  clear: both;
}
.area {
  margin: 0 24px;
  overflow: hidden;
  width: auto;
  padding: 12px 0;
}
.topInfo{
  b{
    font-size: 12px;
    font-weight: normal;
  }
  .tag{
    display: inline-block;
    font-size: 10px;
    width: 34px;
    height: 16px;
    background: red;
    line-height: 16px;
    vertical-align: middle;
    margin-left: 8px;
    text-align: center;
    color: #ffffff;
    border-radius: 3px;
  }
  .top-bottom {
    margin-bottom: 12px;
    span {
      color: #7c8287;
      font-size: 10px;
    }
  }
  .right{
    float: right;
    width: auto;
    display: flex;
    flex-direction:row;
    align-items: center;
    color: #7c8287;
    font-size: 10px;
  }
  .focusBtn {
    display: inline-block;
    background-color: #ff3333;
    color: #fff;
    text-align: center;
    border-radius: 3px 0 0 3px;
    cursor: pointer;
    font-size: 10px;
    line-height: 1;
    padding: 2px 5px;
  }
  .focusCount {
    background-color: #fbdcdc;
    display: inline-block;
    text-align: center;
    border-radius: 0 3px 3px 0;
    cursor: pointer;
    font-size: 10px;
    line-height: 1;
    padding: 2px 5px;
    color: #ff3333;
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
  margin-top: 10px;
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
  margin-top: 10px;
}
.copyright {
  width: 100%;
  margin-top: 10px;
  .content {
    margin: 0 auto;
    height: 42px;
    line-height: 42px;
    width: 402px;
    text-align: center;
    border-top: 1px solid rgba(210,210,210,0.08);
    padding-top: 20px;
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
      font-family: @fontRegular;
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
