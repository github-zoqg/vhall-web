<template>
  <div class="living_preview_wap" :style="wapBackground">
    <div class="living_preview_wap_header" v-if="(livingWapForm.style!=3 && type==1) || type==2">
      <div class="header_left">
        <span><img src="./image/living/chat1.png" alt=""></span>
        戈里瑰夏
      </div>
      <div class="header_right">
        <i class="iconfont-v3 saasline-house"></i>
        <i class="iconfont-v3 saasline-public1"></i>
        <i class="iconfont-v3 saasa-line-collectionsuccess"></i>
      </div>
    </div>
    <div :class="['living_preview_wap_simpleHeader', livingWapForm.style==3 ? 'page__concise' : '']" v-else>
      <div class="header_left">
        <div class="header_left_avatar"><img src="./image/living/chat1.png" alt=""></div>
        <div class="header_left_name">
          <p class="header_host">戈里瑰夏</p>
          <p class="header_hot">
            <i class="iconfont-v3 saasline-user">&nbsp;1234&nbsp;&nbsp;</i>
            <i class="iconfont-v3 saasicon_redu">&nbsp;2345</i>
          </p>
        </div>
        <div class="header_left_attention">
          <span>关注</span>
        </div>
      </div>
       <div class="header_right">
        <span><i class="iconfont-v3 saasline-house"></i></span>
        <span><i class="iconfont-v3 saasline-public1"></i></span>
       </div>
    </div>
    <div class="living_preview_wap_body">
      <div :class="`wap_player ${livingForm.speakerAndShowLayout == 1 ? 'layout_join' : 'layout_split'}`"  v-if="type==1" :style="videoBackground">
        <template v-if="isShowInteract">
          <!-- 均匀 -->
          <div class="watch_layout_1" v-if="livingForm.inavLayout=='CANVAS_ADAPTIVE_LAYOUT_GRID_MODE'">
            <div>
              <span v-show="livingForm.speakerAndShowLayout == 1"><img src="./image/living/ppt.png" alt=""></span>
              <span><img src="./image/living/layout1.jpg" alt=""></span>
              <span><img src="./image/living/layout2.jpg" alt=""></span>
              <span><img src="./image/living/layout3.jpg" alt=""></span>
              <span><img src="./image/living/layout4.jpg" alt=""></span>
              <span><img src="./image/living/layout5.jpg" alt=""></span>
            </div>
          </div>
          <!-- 主次浮窗 -->
          <div class="watch_layout_2" v-if="livingForm.inavLayout=='CANVAS_ADAPTIVE_LAYOUT_FLOAT_MODE'">
            <img src="./image/living/ppt.png" alt="" v-if="livingForm.speakerAndShowLayout == 1">
            <img src="./image/living/layout1.jpg" alt="" v-else>
            <div class="layout_float">
              <span v-show="livingForm.speakerAndShowLayout == 1"><img src="./image/living/layout1.jpg" alt=""></span>
              <span><img src="./image/living/layout2.jpg" alt=""></span>
              <span><img src="./image/living/layout3.jpg" alt=""></span>
              <span><img src="./image/living/layout4.jpg" alt=""></span>
              <span><img src="./image/living/layout5.jpg" alt=""></span>
            </div>
          </div>
          <!-- 主次平铺 -->
          <div class="watch_layout_3" v-if="livingForm.inavLayout=='CANVAS_ADAPTIVE_LAYOUT_TILED_MODE'">
            <div class="layout_top">
              <!-- :style="videoBackground" -->
              <span v-if="livingForm.speakerAndShowLayout == 1"><img src="./image/living/ppt.png" alt=""></span>
              <span v-else><img src="./image/living/layout1.jpg" alt=""></span>
            </div>
            <div class="layout_bottom">
              <span v-show="livingForm.speakerAndShowLayout == 1"><img src="./image/living/layout1.jpg" alt=""></span>
              <span><img src="./image/living/layout2.jpg" alt=""></span>
              <span><img src="./image/living/layout3.jpg" alt=""></span>
              <span><img src="./image/living/layout4.jpg" alt=""></span>
              <span><img src="./image/living/layout5.jpg" alt=""></span>
            </div>
          </div>
          <!-- 顶部成员 -->
          <div class="watch_layout_4" v-if="livingForm.inavLayout=='CANVAS_ADAPTIVE_LAYOUT_TILED_EXT1_MODE'">
            <div class="layout_top">
              <span v-show="livingForm.speakerAndShowLayout == 1"><img src="./image/living/layout1.jpg" alt=""></span>
              <span><img src="./image/living/layout2.jpg" alt=""></span>
              <span><img src="./image/living/layout3.jpg" alt=""></span>
              <span><img src="./image/living/layout4.jpg" alt=""></span>
              <span><img src="./image/living/layout5.jpg" alt=""></span>
            </div>
            <div class="layout_bottom">
              <span v-if="livingForm.speakerAndShowLayout == 1"><img src="./image/living/ppt.png" alt=""></span>
              <span v-else><img src="./image/living/layout1.jpg" alt=""></span>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="watch_layout">
            <img src="./image/living/layout1.jpg" alt="">
          </div>
        </template>
      </div>
      <div class="wap_player" v-else>
        <img class="player_subscribe" src="./image/wap/video.png" alt="">
      </div>
      <div class="wap_subscribe" v-if="type==2">
        <div class="subscribe_time">
          <p class="down_time">距离开播 <span> 01</span>天<span> 02</span>时<span> 27</span>分<span> 03</span>秒</p>
          <p class="down_auth">立即预约</p>
        </div>
        <div class="subscribe_tabs">
          <div class="tab_item">
            简介<span></span>
          </div>
          <div class="tab_intro">
            <p class="tab_intro_title">数字化转型时代企业如何做好直播营销</p>
            <p class="tab_intro_time">2021-03-18 00:00</p>
            <p class="tab_intro_main">中国儿童中心发布通告，近期，国内多地相继发生聚集性疫情，北京市再次出现京外关联本地病例，疫情形势严峻复杂，防控压力持续增大。为保障学员和家长健康安全，8月3日起停止所有兴趣培训和线下活动以及幼儿园、儿童早期托育、亲子班，园内游艺暂停。具体复课时间安排、游艺开放时间将在微信公众号另行通知。</p>
          </div>
        </div>
      </div>
      <div :class="`wap_menus ${livingForm.speakerAndShowLayout == 1 ? 'layout_join' : 'layout_split'}`" v-else>
        <div class="wap_menus_tabs" v-if="livingWapForm.style!=3">
          <!-- <div class="tabs_left">
            <i class="iconfont-v3 saasicon_arrowleft"></i>
          </div> -->
          <div class="tabs_center">
            <span :class="wapMenusType == 'doc' ? 'active' : ''" @click="choseMenusTab('doc')" v-if="livingWapForm.style != 3 && livingForm.speakerAndShowLayout != 1">文档</span>
            <span :class="wapMenusType == 'chat' ? 'active' : ''" @click="choseMenusTab('chat')">聊天</span>
            <!-- <span class="circle">问答<b></b></span>
            <span>私聊</span>
            <span>简介</span> -->
          </div>
          <!-- <div class="tabs_right">
            <i class="iconfont-v3 saasicon_arrowright1"></i>
          </div> -->
        </div>
        <div :class="['wap_menus_chat', livingWapForm.style==3 ? 'page__concise' : '']" v-if="wapMenusType == 'chat'">
          <div class="wap_menus_chat_topBottom chat_clear" v-if="livingWapForm.style==1">
            <div class="chat_item">
              <div class="chat_item_avatar">
                <img src="./image/living/chat2.png" alt="">
              </div>
              <div class="">
                <div class="chat_item_name">Mr Liu</div>
                <div class="chat_item_content">😅😅😅</div>
              </div>
            </div>
            <div class="chat_item">
              <div class="chat_item_avatar">
                <img src="./image/living/chat3.png" alt="">
              </div>
              <div class="chat_item_box">
                <div class="chat_item_name">微吼直播</div>
                <div class="chat_item_content">关于热度兼容老版h5活动 Android 微吼直播app测试
                  <p class="chat_imgs"></p>
                </div>
              </div>
            </div>
            <div class="chat_item">
              <div class="chat_item_avatar">
                <img src="./image/wap/avator.png" alt="">
              </div>
              <div class="chat_item_box">
                <div class="chat_item_name">杨保林</div>
                <div class="chat_item_content">帮助全行业客户落地视频直播营销，开启直播营销，迎来持续增长</div>
              </div>
            </div>
            <div class="chat_item">
              <div class="chat_item_avatar">
                <img src="./image/living/chat1.png" alt="">
              </div>
              <div class="chat_item_box">
                <div class="chat_item_name">微吼直播 <span>主持人</span></div>
                <div class="chat_item_content">😊😊😊<span class="chat_blue">@杨保林...</span>0万+行业标杆企业都在用</div>
              </div>
            </div>
          </div>
          <div class="wap_menus_chat_leftRight chat_clear" v-if="livingWapForm.style==2">
            <div class="chat_item">
              <div class="chat_item_avatar"><img src="./image/living/chat4.png" alt=""></div>
              <div class="chat_item_content"><span class="name">Mr Liu</span>😊😊😊</div>
            </div>
            <!-- 左右（头像、内容）分块结构 <div class="chat_item">
              <div class="chat_item_avatar"><img src="./image/living/chat1.png" alt=""></div>
              <div class="chat_item_content content_host">
                <span class="name">
                  <span class="chat_host">主持人</span>
                  微吼直播
                </span>
                关于热度兼容老版h5动Android微吼直播app测试
              </div>
            </div> -->
            <div class="chat_item more">
              <div class="chat_item_content content_host">
                <div class="chat_item_avatar"><img src="./image/living/chat1.png" alt=""></div>
                <span class="name">
                  <span class="chat_host">主持人</span>
                  微吼直播
                </span>
                关于热度兼容老版h5动Android微吼直播app测试
              </div>
            </div>
            <div class="chat_item">
              <div class="chat_item_avatar"><img src="./image/living/chat3.png" alt=""></div>
              <div class="chat_item_content">
                <span class="name">
                  <span class="chat_ass">助理</span>
                  小助理
                </span>
                点关注加粉丝团小微宠粉为涨粉
              </div>
            </div>
            <div class="chat_item">
              <div class="chat_item_content"><span class="name"><span class="chat_ass">助理</span>
                小助理</span> 推送了问卷 <span class="chat_blue">点击查看</span></div>
            </div>
            <div class="chat_item">
              <div class="chat_item_avatar"><img src="./image/wap/avator.png" alt=""></div>
              <div class="chat_item_content"><span class="name">Mr Liu</span>大会现场的图有吗？</div>
            </div>
            <div class="chat_item">
              <div class="chat_item_avatar"><img src="./image/living/chat3.png" alt=""></div>
              <div class="chat_item_content">
                <span class="name">
                  <span class="chat_ass">助理</span>
                  C咪酱🍒
                </span>
                花老师，yyds.
                <p class="chat_imgs"></p>
              </div>
            </div>
          </div>
          <div class="wap_menus_chat_leftRight chat_clear wap_chat_simple" v-if="livingWapForm.style==3">
            <!-- <div class="chat_item_simple">
              <div class="chat_item_simple_content"><span class="name">Mr Liu</span>😊😊😊</div>
            </div> -->
            <div class="chat_item_simple">
              <div class="chat_item_simple_content">
                <span class="name">
                  <span class="chat_host">主持人</span>
                  微吼直播
                </span>
                关于热度兼容老版h5动微吼直播app测试
              </div>
            </div>
            <div class="chat_item_simple">
              <div class="chat_item_simple_content">
                <span class="name">小助理</span>
                点关注加粉丝团小微宠粉为涨粉
              </div>
            </div>
            <div class="chat_item_simple">
              <div class="chat_item_simple_content">
                <span class="name">
                  <span class="chat_ass">助理</span>
                  耶加雪菲
                </span>
                发起了签到
              </div>
            </div>
             <div class="chat_item_simple">
              <div class="chat_item_simple_content">
                <span class="name">C咪酱🍒</span>
                花老学生宿舍师，yyds.
                <p class="chat_imgs"></p>
              </div>
            </div>
            <div class="chat_item_simple">
              <div class="chat_item_simple_content">
                <span class="name">
                  <span class="chat_ass">助理</span>
                  很长的昵称...
                </span>
                推送了问卷 <span class="chat_blue">点击查看</span>
              </div>
            </div>
            <!-- <div class="chat_item_simple">
              <div class="chat_item_simple_content">
                <span class="name">阿曼达</span>
                0万+行业标杆企业都在用
              </div>
            </div> -->
             <div class="chat_item_simple">
              <div class="chat_item_simple_content">
                <span class="name">董主任</span>
                12年专业实力铸造品牌口碑
              </div>
            </div>
          </div>
        </div>
        <div class="wap_menus_doc" v-if="wapMenusType == 'doc' && livingForm.speakerAndShowLayout != 1">
          <div class="wap_menus_doc_image">
            <img src="./image/living/ppt.png" alt="">
            <span class="wap_doc_left"><i class="iconfont-v3 saasicon_arrowleft"></i></span>
            <span class="wap_doc_right"><i class="iconfont-v3 saasicon_arrowright1"></i></span>
          </div>
          <div class="wap_menus_doc_tools">
            <span class="wap_doc_tools_count">1/4</span>
            <span><i class="iconfont-v3 saasline-public1"></i></span>
            <span><i class="iconfont-v3 saasbofangqi_11"></i></span>
            <span><i class="iconfont-v3 saasline-public1"></i></span>
          </div>
        </div>
      </div>
    </div>
    <div class="living_preview_wap_footer" v-if="type==1 && wapMenusType == 'chat'">
      <div class="footer_left">
        <img src="./image/living/chat5.png" alt="">
      </div>
      <div :class="['footer_center ', livingWapForm && livingWapForm.style == 3 ? 'style_concise' : '']">
        <span><i class="iconfont-v3 saasline-audit"></i> | 参与聊天</span>
      </div>
      <div :class="['footer_right ', livingWapForm && livingWapForm.style == 3 ? 'style_concise' : '']"></div>
    </div>
  </div>
</template>
<script>
import skinsWap from '@/common/skins/wap/index';
import { imgPositionSizeMap } from '@/utils/imgSizeMap'

export default {
  data() {
    return {
      menusTab: 'doc'
    }
  },
  props: {
    type: {
      // 是直播页还是引导页
      type: Number,
      default: 1
    },
     // 主题背景
    domainUrl: {
      type: String,
      default: ''
    },
    // 视频区背景
    videoUrl: {
      type: String,
      default: ''
    },
    livingWapForm: {
      type: Object,
      default: ()=>{}
    },
    // 表单数据
    livingForm: {
      type: Object,
      default: ()=>{}
    },
    // 是否显示互动
    isShowInteract: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    videoBackground() {
      if (this.videoUrl) {
        return {backgroundImage: `url(${this.videoUrl})`}
      } else {
        return {backgroundColor: this.livingForm.videoBackGroundColor}
      }
    },
    wapBackground() {
      console.log(this.livingWapForm.style, this.livingWapForm.backGroundColor, '??!2343')
      if (this.livingWapForm.style == 1 && this.livingWapForm.backGroundColor < 3) {
        return {backgroundColor: this.livingWapForm.backGroundColor == 1 ? '#262626' : '#f0f0f0'}
      } else {
        if (this.livingWapForm.background && this.type == 1) {
          return {backgroundImage: `url(${this.domainUrl})`, ...imgPositionSizeMap[this.livingWapForm.backgroundSize.imageCropMode]}
        } else {
          let style = this.type == 2 && this.livingWapForm.style == 3 ? 2 : this.livingWapForm.style
          let url = require(`./image/wap/bg_${style}/theme_${this.livingWapForm.backGroundColor}.png`);
          return {backgroundImage: `url(${url})`}
        }
      }
    },
    wapMenusType() {
      if (this.livingWapForm.style == 3 || this.livingForm.speakerAndShowLayout == 1) {
        // 当前手机端简洁风格 或者 视频区【连麦+演示】布局选择为合并模式
        return 'chat'
      } else {
        return this.menusTab
      }
    }
  },
  methods: {
    settingTheme(style, index, type) {
      // console.log(style, index, type, 'wap预览主题')
      let wapStyle = (type == 2 && style == 3) ? 2 : style;
      let key = `style_${Number(wapStyle)}_theme_${Number(index)}`
      skinsWap.setTheme(skinsWap.themes[key], '.living_preview_wap');
    },
    choseMenusTab(type) {
      this.menusTab = type
    }
  }
}
</script>
<style lang="less" scoped>
  .living_preview_wap{
    width: 100%;
    height: 100%;
    position: relative;
    transition: all 0.8s linear;
    border-radius: 0 0 40px 40px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    &_header{
      width: 100%;
      height: 36px;
      background: var(--background_header_color);
      transition: transparent 0.8s linear;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      .header_left{
        color: var(--color_header_secondary);
        font-size: 14px;
        span{
          display: inline-block;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          vertical-align: middle;
          margin-right: 4px;
          img{
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
      }
      .header_right{
        font-size: 14px;
        color: var(--color_header_secondary);
        i{
          padding-left: 10px;
        }
      }
    }
    &_simpleHeader{
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px 32px 12px;
      .header_left{
        width: 174px;
        height: 40px;
        padding: 0 8px;
        border-radius: 40px;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: space-around;
        &_avatar{
          width: 28px;
          height: 28px;
          border-radius: 50%;
          img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
          }
        }
        &_name{
          margin: 0 6px;
          color: #fff;
          width: 100px;
          transform: scale(0.5);
          transform-origin: center left;
          margin-right: -20px;
          .header_host{
            color: #fff;
            font-size: 24px;
            line-height: 32px;
          }
          .header_hot{
            font-size: 20px;
          }
        }
        &_attention{
          width: 40px;
          height: 24px;
          transition: all 0.8s linear;
          background: linear-gradient(280.56deg, var(--background_header_attention_1) 9.45%, var(--background_header_attention_2) 90.39%);
          border-radius: 30px;
          font-size: 12px;
          color: var(--color_header_attention);
          text-align: center;
          line-height: 24px;
        }
      }
      .header_right{
        span{
          display: inline-block;
          width: 30px;
          height: 30px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 57px;
          text-align: center;
          line-height: 30px;
          margin-left: 12px ;
          i{
            font-size: 18px;
            color: #fff;
          }
        }
      }
      &.page__concise {
        padding: 8px 12px 72px 12px;
      }
    }
    &_body{
      .wap_player{
        width: 100%;
        height: 210px;
        .watch_layout{
          width: 100%;
          height: 100%;
          img{
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        .watch_layout_1{
          width: 100%;
          height: 100%;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          span{
            float: left;
            width: 125px;
            height: 70px;
            img{
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
        }
        .watch_layout_2{
          width: 100%;
          height: 100%;
          position: relative;
          img{
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .layout_float{
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 42px;
            span{
              display: inline-block;
              width: 20%; // 74px;
              height: 42px;
              img{
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
          }
        }
        .watch_layout_3{
          // background-color: #262626;
          .layout_top{
            width: 100%;
            height: 167px;
            padding: 0 38px;
            transition: all 0.8s linear;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            span{
              display: inline-block;
              width: 298px;
              height: 100%;
              img{
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
          }
          .layout_bottom{
            width: 100%;
            height: 43px;
            display: flex;
            span{
              display: inline-block;
              width: 75px;
              height: 43px;
              img{
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
          }
        }
        .watch_layout_4{
          .layout_top{
            width: 100%;
            height: 43px;
            display: flex;
            span{
              display: inline-block;
              width: 75px;
              height: 43px;
              img{
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
          }
          .layout_bottom{
            width: 100%;
            height: 167px;
            padding: 0 38px;
            transition: all 0.8s linear;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            span{
              display: inline-block;
              width: 298px;
              height: 100%;
              img{
                width: 100%;
                height: 100%;
                object-fit: cover;
              }
            }
          }
        }
        .player_subscribe{
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .wap_menus{
        &_tabs{
          transition: all 0.8s linear;
          width: 100%;
          height: 40px;
          padding: 0 8px;
          background: var(--background_tabs_color);
          display: flex;
          justify-content: space-around;
          align-items: center;
          border-bottom: 1px solid var(--border_tabs_color);
          .tabs_left, .tabs_right{
            font-size: 8px;
            color: var(--color_tab_text);
          }
          .tabs_center{
            flex: 1;
            font-size: 14px;
            color: var(--color_tab_text);
            span{
              margin: 0 15px;
              cursor: pointer;
            }
            .active{
              padding-bottom: 5px;
              color: var(--color_tab_text);
              border-bottom: 3px solid var(--background_color_active);
              border-radius: 2px;
            }
            .circle{
              position: relative;
              b{
                position: absolute;
                top: -3px;
                right: -8px;
                display: inline-block;
                width: 7px;
                height: 7px;
                border-radius: 50%;
                background: #FB2626;
              }
            }
          }
        }
        &_chat{
          width: 100%;
          padding: 12px 10px 0 10px;
          height: 342px;
          &_topBottom{
            .chat_item{
              display: flex;
              width: 100%;
              margin-top: 8px;
              &_avatar{
                width: 26px;
                height: 26px;
                border-radius: 50%;
                margin-right: 5px;
                img{
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  border-radius: 50%;
                }
              }
              &_name{
                font-size: 13px;
                color: var(--color_chat_name);
                line-height: 19px;
                margin-bottom: 2px;
                span{
                  display: inline-block;
                  color: #FB2626;
                  padding: 4px 8px;
                  font-size: 20px;
                  background: rgba(251, 38, 38, 0.15);
                  border-radius: 16px;
                  vertical-align: middle;
                  transform: scale(0.5);
                  transform-origin: center left;
                }
              }
              &_content{
                padding: 5px 6px;
                font-size: 13px;
                color: var(--color_chat_primary);
                line-height: 19px;
                background: var(--background_chat_color);
                border-radius: 0px 8px 8px 8px;
                .chat_imgs{
                  width: 135px;
                  height: 30px;
                  padding: 3px;
                  background-image: url('./image/wap/chat.png');
                  background-repeat: no-repeat;
                  background-size: 100% 100%;
                  vertical-align: middle;
                }
              }
            }
            .chat_item_box{
              width: calc(100% - 30px);
            }
          }
          &_leftRight{
            &.wap_chat_simple{
              padding-right: 100px;
            }
            .chat_item{
              padding: 2px 6px;
              transition: all 0.8s linear;
              background: var(--background_chat_color);
              border-radius: 15px;
              margin-bottom: 12px;
              float: left;
              display: flex;
              &_avatar{
                width: 20px;
                height: 20px;
                border-radius: 50%;
                margin-right: 5px;
                img{
                  width: 100%;
                  height: 100%;
                  object-fit: scale-down;
                  border-radius: 50%;
                }
              }
              &_content{
                color: var(--color_chat_primary);
                font-size: 13px;
                line-height: 19px;
                &.content_host{
                  width: calc(100% - 25px);
                }
                .name{
                  color: var(--color_chat_name);
                  font-size: 13px;
                  margin-right: 3px;
                }
                .chat_host{
                  display: inline-block;
                  color: #FB2626;
                  padding: 4px 8px;
                  font-size: 20px;
                  background: rgba(251, 38, 38, 0.15);
                  border-radius: 16px;
                  transform: scale(0.5);
                  transform-origin: center right;
                  margin-left: -40px;
                  vertical-align: middle;
                  margin-right: 3px;
                  margin-top: -3px;
                }
                .chat_ass{
                  display: inline-block;
                  color: #0A7FF5;
                  padding: 4px 8px;
                  font-size: 20px;
                  background: rgba(10, 127, 245, 0.15);
                  border-radius: 16px;
                  transform: scale(0.5);
                  transform-origin: center right;
                  margin-left: -28px;
                  vertical-align: middle;
                  margin-right: 3px;
                  margin-top: -3px;
                }
                .chat_imgs{
                  width: 135px;
                  height: 30px;
                  background-image: url('./image/wap/chat.png');
                  background-repeat: no-repeat;
                  background-size: 100% 100%;
                  vertical-align: middle;
                  margin-bottom: 4px;
                }
              }
              &.more {
                .chat_item_content {
                  line-height: 20px;
                  .chat_item_avatar {
                    display: inline-block;
                    vertical-align: middle;
                  }
                  .chat_host {
                    margin-top: 0;
                  }
                }
              }
            }
            .chat_item_simple{
              padding: 3px 6px;
              background: var(--background_chat_color);
              border-radius: 13px;
              margin-bottom: 4px;
              float: left;
              display: flex;
              &_content{
                color: var(--color_chat_primary);
                font-size: 13px;
                line-height: 19px;
                .name{
                  color: var(--color_chat_name);
                  font-size: 13px;
                  margin-right: 3px;
                }
                .chat_host{
                  display: inline-block;
                  color: #FB2626;
                  padding: 4px 8px;
                  font-size: 20px;
                  background: rgba(251, 38, 38, 0.15);
                  border-radius: 16px;
                  transform: scale(0.5);
                  transform-origin: center right;
                  margin-left: -40px;
                  vertical-align: middle;
                  margin-right: 3px;
                  margin-top: -3px;
                }
                .chat_ass{
                  display: inline-block;
                  color: #0A7FF5;
                  padding: 4px 8px;
                  font-size: 20px;
                  background: rgba(10, 127, 245, 0.15);
                  border-radius: 16px;
                  transform: scale(0.5);
                  transform-origin: center right;
                  margin-left: -28px;
                  vertical-align: middle;
                  margin-right: 3px;
                  margin-top: -3px;
                }
                .chat_imgs{
                  width: 128px;
                  height: 28px;
                  vertical-align: middle;
                  background-image: url('./image/wap/chat.png');
                  background-repeat: no-repeat;
                  background-size: 100% 100%;
                  margin-bottom: 4px;
                }
              }
            }
          }
          .chat_blue{
            color: #0A7FF5;
            font-size: 13px;
            line-height: 19px;
          }
          .chat_clear::after {
            content: "";
            display: block;
            clear: both;
          }
          &.page__concise {
            padding: 32px 10px 0 10px;
            height: 302px;
          }
        }
        &_doc {
          width: 100%;
          height: 342px;
          &_image {
            position: relative;
            img{
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            span {
              display: block;
              width: 28px;
              height: 28px;
              background: rgba(0, 0, 0, 0.45);
              color: #ffffff;
              position: absolute;
              top: 70px;
              border-radius: 32px;
              text-align: center;
              line-height: 28px;
              &.wap_doc_left {
                left: 16px;
              }
              &.wap_doc_right {
                right: 16px;
              }
            }
          }
          &_tools {
            margin-top: 16px;
            text-align: right;
            span {
              display: inline-block;
              width: 28px;
              height: 28px;
              background: var(--background_doc_tools_color);
              color: var(--color_doc_tools_text);
              text-align: center;
              line-height: 28px;
              border-radius: 32px;
              margin-right: 12px;
              &.wap_doc_tools_count {
                width: auto;
                padding: 0 12px;
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                margin-right: 8px;
              }
            }
          }
        }
      }
      .wap_subscribe{
        width: 100%;
        height: 100%;
        height: calc(100% - 257px);
        margin-bottom: 8px;
        .subscribe_time{
          height: 133px;
          transition: all 0.8s linear;
          background: var(--background_subscribe_color);
          margin-bottom: 8px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .down_time{
            font-size: 12px;
            color: var(--color_subscribe_primary);
            margin-bottom: 16px;
            span{
              font-size: 28px;
              color: var(--color_subscribe_secondary);
            }
          }
          .down_auth{
            width: 260px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #fff;
            font-size: 18px;
            background: var(--background_color_active);
            border-radius: 50px;
          }
        }
        .subscribe_tabs{
          width: 100%;
          .tab_item{
            width: 100%;
            height: 40px;
            line-height: 40px;
            padding-left: 12px;
            transition: all 0.8s linear;
            background: var(--background_subscribe_color);
            color: var(--color_subscribe_secondary);
            font-size: 14px;
            font-weight: 500;
            position: relative;
            span{
              position: absolute;
              bottom: 4px;
              left: 14px;
              display: inline-block;
              width: 22px;
              height: 3px;
              background: var(--background_color_active);
              border-radius: 3px;
            }
          }
          .tab_intro{
            margin-top: 25px;
            padding: 0 12px;
            &_title{
              color: var(--color_subscribe_secondary);
              font-size: 16px;
            }
            &_time{
              font-size: 14px;
              color: var(--color_intro_text);
              line-height: 20px;
              padding-bottom: 16px;
            }
            &_main{
              font-size: 14px;
              color: var(--color_intro_text);
              line-height: 20px;
            }
          }
        }
      }
    }
    &_footer{
      width: 100%;
      height: 96px;
      border-radius: 0 0 30px 30px;
      transition: all 0.8s linear;
      background: var(--background_footer_color);
      display: flex;
      // align-items: center;
      padding: 12px 10px 0 10px;
      .footer_left{
        width: 28px;
        height: 28px;
        border-radius: 50%;
        img{
          width: 100%;
          height: 100%;
          margin-top: 3px;
          border-radius: 50%;
          object-fit: cover;
        }
      }
      .footer_center{
        width: 181px;
        height: 36px;
        border-radius: 35px;
        line-height: 36px;
        padding: 0 10px;
        background: var(--background_send_color);
        font-size: 14px;
        color: var(--color_send_color);
        margin: 0 10px;
        .iconfont-v3{
          font-size: 13px;
        }
        &.style_concise {
          width: 151px;
        }
      }
      .footer_right{
        width: 120px;
        height: 32px;
        // margin-left: 15px;
        background-image: url('./image/wap/tools.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
        &.style_concise {
          width: 164px;
          height: 32px;
          // margin-left: 15px;
          background-image: url('./image/wap/tools_concise.png');
        }
      }
    }
  }
</style>
