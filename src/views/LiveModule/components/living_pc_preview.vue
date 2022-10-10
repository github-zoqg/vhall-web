<template>
  <div class="living_preview_pc">
    <div class="pc_header_tag">
      <img src="./image/living/browser@2x.png" alt="">
    </div>
    <div class="pc_container" :style="pcBackground">
      <div class="pc_header">
        <div class="header_left">
          <div class="left_logo"><img src="./image/living/logo@2x.png" alt=""></div>
          <div class="left_title">
            <p class="title">30分钟直播运营实操-教你从0-1快速上手 <span v-if="type==1"><img src="./image/living/living.png" alt=""></span><span v-if="type==2"><img src="./image/living/subscribe.png" alt=""></span> </p>
            <p class="host">主办方：直播研究院 &nbsp;&nbsp;  2022-06-24 14:30</p>
          </div>
        </div>
        <div class="header_right">
          <div class="right_icon">
            <span><i class="iconfont-v3 saasicon_guanzhu"></i> 关注</span>
            <span><i class="iconfont-v3 saasicon-share"></i> 分享</span>
          </div>
          <div class="right_login"><span><img src="./image/living/avatar@2x.png" alt=""></span> 登录</div>
        </div>
      </div>
      <div class="pc_watch" v-if="type==1">
        <div :class="`watch_left ${livingForm.speakerAndShowLayout == 1 ? 'layout_join' : 'layout_split'}`">
          <div class="left_top" v-if="isShowInteract" :style="videoBackground">
            <!-- 均匀 :style="videoBackground"-->
            <div class="left_top__even" v-if="livingForm.inavLayout=='CANVAS_ADAPTIVE_LAYOUT_GRID_MODE'">
              <div class="imgs">
                <span v-show="livingForm.speakerAndShowLayout == 1"><img src="./image/living/ppt.png" alt=""></span>
                <span class="phone__center"><img src="./image/living/layout6.png" alt=""></span>
                <span><img src="./image/living/layout1.png" alt=""></span>
                <span><img src="./image/living/layout2.png" alt=""></span>
                <span><img src="./image/living/layout3.png" alt=""></span>
                <span><img src="./image/living/layout4.png" alt=""></span>
              </div>
            </div>
            <!-- 主次浮窗 -->
            <div class="left_top__float" v-if="livingForm.inavLayout=='CANVAS_ADAPTIVE_LAYOUT_FLOAT_MODE'">
              <div class="imgs">
                <span v-show="livingForm.speakerAndShowLayout == 1"><img src="./image/living/layout1.png" alt=""></span>
                <span><img src="./image/living/layout2.png" alt=""></span>
                <span><img src="./image/living/layout3.png" alt=""></span>
                <span><img src="./image/living/layout4.png" alt=""></span>
                <span><img src="./image/living/layout5.png" alt=""></span>
              </div>
            </div>
            <!-- 主次平铺 -->
            <div class="left_top__tiling" v-if="livingForm.inavLayout=='CANVAS_ADAPTIVE_LAYOUT_TILED_MODE'">
              <div class="host">
                <img src="./image/living/ppt.png" alt="" v-show="livingForm.speakerAndShowLayout == 1">
                <img src="./image/living/layout1.png" alt="" v-show="livingForm.speakerAndShowLayout != 1">
              </div>
              <div class="imgs">
                <span v-show="livingForm.speakerAndShowLayout == 1"><img src="./image/living/layout1.png" alt=""></span>
                <span><img src="./image/living/layout2.png" alt=""></span>
                <span><img src="./image/living/layout3.png" alt=""></span>
                <span><img src="./image/living/layout4.png" alt=""></span>
                <span><img src="./image/living/layout5.png" alt=""></span>
              </div>
            </div>
            <!-- 顶部成员 -->
            <div class="left_top__tiling" v-if="livingForm.inavLayout=='CANVAS_ADAPTIVE_LAYOUT_TILED_MODE_EXTEND_1'">
              <div class="imgs">
                <span v-show="livingForm.speakerAndShowLayout == 1"><img src="./image/living/layout1.png" alt=""></span>
                <span><img src="./image/living/layout2.png" alt=""></span>
                <span><img src="./image/living/layout3.png" alt=""></span>
                <span><img src="./image/living/layout4.png" alt=""></span>
                <span><img src="./image/living/layout5.png" alt=""></span>
              </div>
              <div class="host">
                <img src="./image/living/ppt.png" alt="" v-show="livingForm.speakerAndShowLayout == 1">
                <img src="./image/living/layout1.png" alt="" v-show="livingForm.speakerAndShowLayout != 1">
              </div>
            </div>
          </div>
          <div class="left_no_interact" v-else :style="videoBackground">
            <img src="./image/living/layout1.png" alt="">
          </div>
          <div class="left_bottom">
            <span class="left_bottom_setting">
              <i class="iconfont-v3 saasicon_Settings1"></i> 设置 &nbsp;
              <i class="iconfont-v3 saasline-user"></i> 12314 &nbsp;
              <i class="iconfont-v3 saasredu_icon"></i> 345671 &nbsp;
            </span>
            <span class="left_bottom_tools"><img src="./image/living/tools@2x.png" alt=""></span>
          </div>
        </div>
        <div :class="`watch_right ${livingForm.speakerAndShowLayout == 1 ? 'layout_join' : 'layout_split'}`">
          <div class="right_top">
            <img src="./image/living/ppt.png" alt="">
          </div>
          <div class="right_bottom">
            <div class="right_bottom_chat">
              <div class="chat_tab">
                <p>聊天</p>
                <span></span>
              </div>
              <div class="chat_box" v-if="livingForm.chatLayout==1">
                <div class="chat_box_item chat_box_top">
                  <div class="item_img">
                    <p><img src="./image/living/chat1.png" alt=""></p>
                  </div>
                  <div class="item_chat">
                    <p class="chat_role"><span class="host">主持人</span> 蒋老师</p>
                    <p class="chat_title">欢迎线上的各位小伙伴～</p>
                  </div>
                </div>
                <div class="chat_box_item chat_box_top">
                  <div class="item_img">
                    <p><img src="./image/living/layout3.png" alt=""></p>
                  </div>
                  <div class="item_chat">
                    <p class="chat_role">邓浩杰</p>
                    <p class="chat_title">期待已久的运营直播实操课～～</p>
                  </div>
                </div>
                <div class="chat_box_item">
                  <div class="item_img">
                    <p><img src="../../../common/images/avatar.png" alt=""></p>
                  </div>
                  <div class="item_chat">
                    <p class="chat_role">王觉</p>
                    <p class="chat_title">30分钟直播运营实操特训营，终于开营啦，快来加入吧</p>
                  </div>
                </div>
                  <div class="chat_box_item">
                  <div class="item_img">
                    <p><img src="./image/living/layout2.png" alt=""></p>
                  </div>
                  <div class="item_chat">
                    <p class="chat_role"><span class="ass">助理</span> 小助理</p>
                    <p class="chat_title">获取PPT，请添加官方企微哦～</p>
                  </div>
                </div>
              </div>
              <div class="chat_right" v-else>
                <div class="chat_right_item">
                  <div class="chat_right_item-box">
                    <span class="item_avatar"><img src="./image/living/chat1.png" alt=""></span>
                    <span class="item_host"> 主持人</span>
                    <span class="item_name"> 蒋老师 </span>
                    欢迎小伙伴们～
                  </div>
                </div>
                <div class="chat_right_item item_other">
                  <div class="chat_right_item-box">
                    <span class="item_avatar"><img src="./image/living/chat2.png" alt=""></span>
                    <span class="item_name"> 邓浩杰 </span>
                    期待已久的运营直播实操，终于可以看啦～
                  </div>
                </div>
                <div class="chat_right_item">
                  <div class="chat_right_item-box">
                    <span class="item_avatar"><img src="./image/living/layout2.png" alt=""></span>
                    <span class="item_ass"> 助理</span>
                    <span class="item_name"> 小助理 </span>
                    获取PPT，加官微哦
                  </div>
                </div>
                <div class="chat_right_item">
                  <div class="chat_right_item-box">
                    <span class="item_avatar"><img src="./image/living/chat3.png" alt=""></span>
                    <span class="item_name"> 王觉 </span>
                    这才是实战特训营
                  </div>
                </div>
                <div class="chat_right_item">
                  <div class="chat_right_item-box">
                    <span class="item_avatar"><img src="../../../common/images/avatar.png" alt=""></span>
                    <span class="item_name"> 刘林一 </span>
                    30分钟直播运营实操特训营 终于开营啦，快来加入吧
                  </div>
                </div>
              </div>
            </div>
            <div class="right_bottom_send">
              <div class="icon">
                <i class="iconfont-v3 saasline-expression"></i>
                <i class="iconfont-v3 saasa-line-zhikanzhubanfang"></i>
              </div>
              <div class="send">
                <p><span>参与聊天</span></p>
                <span class="send_msg"><i class="iconfont-v3 saasline-send"></i></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pc_subscribe" v-else>
        <div class="pc_subscribe_bg"></div>
        <div class="pc_subscribe_bottom">
          <div class="font_scale">距离开播 <span class="color_bold">10</span> 天<span class="color_bold">08</span> 时<span class="color_bold">46</span> 分<span class="color_bold">25</span> 秒</div>
          <div class="font_right">已预约 <span class="color_red">233</span> 人<span class="btn">立即预约</span></div>
        </div>
      </div>
      <div class="pc_footer" v-if="type==1">微吼提供技术支持 ｜ 反馈与举报</div>
    </div>
  </div>
</template>
<script>
import skinsPc from '@/common/skins/pc/index';
import { imgPositionSizeMap } from '@/utils/imgSizeMap'

export default {
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
    // 主题颜色
    livingPcForm: {
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
    pcBackground() {
      if (this.livingPcForm.background) {
        return {backgroundImage: `url(${this.domainUrl})`, ...imgPositionSizeMap[this.livingPcForm.backgroundSize.imageCropMode]}
      } else {
        if (this.livingPcForm.backGroundColor == 1 || (this.livingPcForm.style == 1 && this.livingPcForm.backGroundColor==2)) {
          return {backgroundColor: this.livingPcForm.backGroundColor == 1 ? '#1a1a1a' : 'rgba(0, 0, 0, 0.06)'}
        } else {
          let url = require(`./image/pc/bg_${this.livingPcForm.backGroundColor}.png`);
          return {backgroundImage: `url(${url})`}
        }
      }
    }
  },
  methods: {
    settingTheme(style, index) {
      // console.log(style, index, 'pc预览主题')
       const pcStyle = style == 3 ? 2 : style;
      let key = `style_${Number(pcStyle)}_theme_${Number(index)}`
      skinsPc.setTheme(skinsPc.themes[key], '.living_preview_pc')
    }
  },
  data() {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
  .living_preview_pc{
    .pc_header_tag{
      width: 100%;
      height: 32px;
      border-radius: 8px 8px 0 0;
      img{
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
    .pc_container{
      position: relative;
      width: 100%;
      height: 495px;
      transition: all 0.5s linear;
      // z-index: 0;
      // background-image: url('./image/pc/bg_2.png');
      background-size: 100% 100%;
      background-repeat: no-repeat;
      border-radius: 0 0 4px 4px;
      .pc_bg{
        width: 100%;
        height: 100%;
        border-radius: 0 0 4px 4px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;
        img{
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0 0 4px 4px;
        }
      }
      .pc_header{
        height: 48px;
        width: 100%;
        padding: 0 16px;
        background: var(--background_pc_header_color);
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: all 0.5s linear;
        .header_left{
          display: flex;
          align-items: center;
          .left_logo{
            width: 50px;
            height: 30px;
            margin-right: 12px;
            img{
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
          .left_title{
            .title{
              color: var(--color_pc_header_primary);
              font-size: 12px;
              line-height: 20px;
              span{
                display: inline-block;
                width: 34px;
                height: 12px;
                img{
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                }
              }
            }
            .host{
              color: var(--color_pc_header_secondary);
              font-size: 14px;
              transform: scale(0.8);
              transform-origin: center left;
            }
          }
        }
        .header_right{
          display: flex;
          align-items: center;
          .right_icon{
            color: var(--color_pc_header_secondary);
            font-size: 12px;
            span{
              padding-right: 10px;
            }
            i{
              vertical-align: text-bottom;
            }
          }
          .right_login{
            font-size: 12px;
            color: var(--color_pc_header_secondary);
            padding-left: 14px;
            line-height: 24px;
            span{
              display: inline-block;
              width: 20px;
              height: 20px;
              border-radius: 50%;
              vertical-align: middle;
              img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                object-fit: contain;
              }
            }
          }
        }
      }
      .pc_watch{
        width: 100%;
        padding: 0 55px;
        margin-top: 12px;
        // height: 362px;
        display: flex;
        .watch_left{
          width: calc(100% - 174px);
          height: 100%;
          border-radius: 4px;
          .left_top{
            width: 100%;
            height: 334px;
            background-size: 100% 100%;
            background-repeat: no-repeat;
            border-radius: 4px 4px 0 0;
            background: #262626;
            &__even{
              display: flex;
              height: 100%;
              flex-wrap: wrap;
              // justify-content: center;
              align-items: center;
              .imgs {
                height: fit-content;
              }
              span{
                float: left;
                width: 198px;
                height: 111px;
                &:nth-child(3) {
                  width: 200px;
                }
                &.phone__center {
                  img {
                    object-fit: contain;
                    background: transparent;
                  }
                }
                img{
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
              }
            }
            &__float{
              width: 100%;
              height: 100%;
              position: relative;
              .imgs{
                position: absolute;
                left: 0;
                bottom: 0;
                span{
                  display: inline-block;
                  img{
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  }
                }
              }
            }
            &__tiling{
              .host{
                width: 446px;
                margin: 0 auto;
                img{
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                }
              }
              .imgs{
                display: flex;
                span{
                  display: inline-block;
                  img{
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                  }
                }
              }
            }
          }
          .left_no_interact{
            width: 100%;
            height: 334px;
            border-radius: 4px;
            img{
              width: 100%;
              height: 100%;
              object-fit: cover;
              border-radius: 4px;
            }
          }
          .left_bottom{
            width: 100%;
            height: 28px;
            background: var(--background_pc_tools_color);
            transition: all 0.5s linear;
            border-radius: 0 0 4px 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-left: 10px;
            &_setting{
              font-size: 14px;
              color: var(--color_pc_tools_regular);
              transform: scale(0.8);
              transform-origin: center left;
            }
            &_tools{
              display: inline-block;
              width: 112px;
              height: 20px;
              margin-top: 3px;
              transform: scale(0.9);
              transform-origin: center right;
              img{
                width: 100%;
                height: 100%;
                object-fit: contain;
              }
            }
          }
          &.layout_join {
            /* 合并模式 */
            .left_top__float {
              background-image: url('./image/living/ppt.png');
              background-repeat: no-repeat;
              background-size: 596px 336px;
              .imgs {
                height: 65px;
                span {
                  width: 119px;
                  height: 65px;
                }
              }
            }
            .left_top__tiling {
              .host{
                height: 269px;
              }
              .imgs{
                span {
                  width: 119px;
                  height: 65px;
                }
              }
            }
          }
          &.layout_split {
            /* 分离模式 */
            .left_top__float {
              background-image: url('./image/living/layout1.png');
              background-repeat: no-repeat;
              background-size: 596px 336px;
              .imgs {
                height: 84px;
                span {
                  width: 149px;
                  height: 84px;
                }
              }
            }
            .left_top__tiling {
              .host{
                height: 250px;
              }
              .imgs{
                span {
                  width: 149px;
                  height: 84px;
                }
              }
            }
          }
        }
        .watch_right{
          width: 165px;
          margin-left: 9px;
          .right_top{
            width: 100%;
            height: 93px;
            border-radius: 4px 4px 0 0;
            img{
              width: 100%;
              height: 100%;
              object-fit: contain;
              border-radius: 4px 4px 0 0;
            }
          }
          .right_bottom{
            width: 100%;
            background: var(--background_pc_tabs_color);
            transition: all 0.5s linear;
            position: relative;
            border-radius: 0 0 4px 4px;
            &_chat{
              width: 100%;
              .chat_tab{
                height: 21px;
                width: 100%;
                padding: 0 10px;
                background: var(--background_pc_tabs_color);
                position: relative;
                border-bottom: 1px solid var(--border_pc_tabs_color);
                transition: all 0.5s linear;
                p{
                  color: var(--color_pc_text_active);
                  font-size: 14px;
                  line-height: 19px;
                  transform: scale(0.6);
                  transform-origin: center left;
                }
                span{
                  position: absolute;
                  display: inline-block;
                  width: 15px;
                  height: 2px;
                  bottom: 0;
                  left: 10px;
                  border-radius: 4px;
                  background: var(--background_pc_color_active);
                }
              }
              .chat_box{
                width: 100%;
                padding: 0 10px;
                margin-top: 8px;
                &_item{
                  display: flex;
                  margin-bottom: -14px;
                  &.chat_box_top{
                    margin-bottom: -2px;
                  }
                  .item_img{
                    p{
                      display: inline-block;
                      width: 28px;
                      height: 28px;
                      border-radius: 50%;
                      transform: scale(0.5);
                      transform-origin: top left;
                      img{
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        object-fit: cover;
                      }
                    }
                  }
                  .item_chat{
                    margin-left: -8px;
                    .chat_role{
                      font-size: 16px;
                      transform: scale(0.5);
                      transform-origin: top left;
                      color: var(--color_pc_chat_name);
                      .host{
                        color: #FB2626;
                        padding: 1px 4px;
                        border-radius: 6px;
                        background: rgba(251,38,38, 0.15);
                      }
                      .ass{
                        color: #0A7FF5;
                        padding: 1px 4px;
                        border-radius: 6px;
                        background: rgba(10,127,245, 0.15);
                      }
                    }
                  }
                  .chat_title{
                    display: inline-block;
                    color: var(--color_pc_chat_primary);
                    line-height: 22px;
                    padding: 2px 5px;
                    transform: scale(0.5);
                    font-size: 16px;
                    transform-origin: top left;
                    background: var(--background_pc_chat_color);
                    border-radius: 6px;
                    margin-right: -115px;
                  }
                }
              }
              .chat_right{
                width: 100%;
                padding: 0 10px;
                margin-top: 8px;
                &_item{
                  color: var(--color_pc_chat_primary);


                  transform: scale(0.5);
                  line-height: 24px;
                  transform-origin: top right;
                  margin-left: -150px;
                  margin-bottom: -12px;
                  &-box {
                    padding: 8px 8px 6px 10px;
                    display: inline-block;
                    border-radius: 16px;
                    height: 100%;
                    background: var(--background_pc_chat_color);
                  }
                  &.item_other{
                    margin-bottom: -23px;
                  }
                  span{
                    display: inline-block;
                    font-size: 16px;
                  }
                  .item_avatar{
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    margin-right: 5px;
                    vertical-align: middle;
                    img{
                      width: 100%;
                      height: 100%;
                      border-radius: 50%;
                      object-fit: cover;
                    }
                  }
                  .item_name{
                    color: var(--color_pc_chat_name);
                  }
                  .item_host{
                    color: #FB2626;
                    padding: 1px 4px;
                    border-radius: 6px;
                    margin-right: 5px;
                    background: rgba(251,38,38, 0.15);
                  }
                  .item_ass{
                    color: #0A7FF5;
                    padding: 1px 4px;
                    margin-right: 5px;
                    border-radius: 6px;
                    background: rgba(10,127,245, 0.15);
                  }
                }
              }
          }
          &_send{
            width: 100%;
            position: absolute;
            left: 0;
            bottom: 0;
            height: 40px;
            background: var(--background_pc_tabs_color);
            border-top: 1px solid var(--border_pc_tabs_color);
            padding: 2px 8px;
            color: var(--color_pc_send_color);
            border-radius: 0 0 4px 4px;
            transition: all 0.5s linear;
            .icon{
              font-size: 18px;
              transform: scale(0.5);
              color: var(--color_pc_send_font_color);
              transform-origin: top left;
              i{
                padding-right: 8px;
              }
            }
            .send{
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: -6px;
              p{
                width: 125px;
                height: 20px;
                border-radius: 20px;
                background: var(--background_pc_send_color);
                padding-left: 9px;
                span{
                  display: inline-block;
                  font-size: 16px;
                  line-height: 40px;
                  transform: scale(0.5);
                  transform-origin: top left;
                }
              }
              &_msg{
                width: 20px;
                height: 20px;
                display: inline-block;
                line-height: 40px;
                background: var(--background_pc_send_color);
                border-radius: 50%;
                text-align: center;
                i{
                  display: inline-block;
                  font-size: 18px;
                  transform: scale(0.5);
                  transform-origin: top center;
                }

              }
            }
          }
          }
          &.layout_join {
            /* 合并模式 */
            .right_top {
              display: none;
            }
            .right_bottom {
              height: 362px;
            }
          }
          &.layout_split {
            /* 分离模式 */
            .right_top {
              display: block;
            }
            .right_bottom {
              height: 269px;
            }
          }
        }
      }
      .pc_subscribe{
        margin-top: 12px;
        padding: 0 55px;
        // height: 447px;
        &_bg{
          width: 100%;
          height: 380px;
          border-radius: 4px 4px 0 0;
          background: url('./image/living/ppt.png') no-repeat 50% 50%;
          background-size: cover;
        }
        &_bottom{
          width: 100%;
          height: 32px;
          border-radius:  0 0 4px 4px;
          background: var(--background_pc_subscribe_text);
          padding: 0 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color:var(--color_pc_subscribe_text);
          line-height: 32px;
          .font_scale{
            font-size: 20px;
            transform: scale(0.5);
            transform-origin: center left;
          }
          .color_bold{
            font-size: 40px;
            font-weight: 500;
            padding-left: 10px;
          }
          .color_red{
            color:var(--color_pc_text_active);
            display: inline-block;
          }
          .font_right{
            font-size: 20px;
            color: var(--color_tools_regular);
            transform: scale(0.5);
            transform-origin: center right;
          }
          .btn{
            display: inline-block;
            width: 128px;
            height: 44px;
            border-radius: 18px;
            background: var(--background_pc_color_active);
            color: #fff;
            margin-left: 20px;
            line-height: 44px;
            text-align: center;
          }
        }
      }
      .pc_footer{
        text-align: center;
        font-size: 12px;
        line-height: 18px;
        margin-top: 8px;
        color: var(--color_pc_header_secondary);
      }
    }
  }
</style>
