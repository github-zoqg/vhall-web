<template>
  <div class="living_preview_wap">
    <div class="living_preview_wap_header">
      <div class="header_left">
        <span><img src="./image/living/chat1.png" alt=""></span>
        戈里瑰夏
      </div>
      <div class="header_right">
        <i class="iconfont-v3 saasicon_home1"></i>
        <i class="iconfont-v3 saaszuidahua_icon1"></i>
        <i class="iconfont-v3 saasicon_guanzhu"></i>
      </div>
    </div>
    <div class="living_preview_wap_body">
      <div class="wap_player">
        <img src="./image/living/layout1.png" alt="">
      </div>
      <div class="wap_menus">
        <div class="wap_menus_tabs">
          <div class="tabs_left">
            <i class="iconfont-v3 saasicon_arrowleft"></i>
          </div>
          <div class="tabs_center">
            <span>简介</span>
            <span class="active">聊天</span>
            <span class="circle">问答<b></b></span>
            <span>私聊</span>
          </div>
          <div class="tabs_right">
            <i class="iconfont-v3 saasicon_arrowright1"></i>
          </div>
        </div>
        <div class="wap_menus_chat">
          <div class="wap_menus_chat_topBottom" v-if="false">
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
                <img src="./image/living/chat1.png" alt="">
              </div>
              <div>
                <div class="chat_item_name">微吼直播</div>
                <div class="chat_item_content">关于热度兼容老版h5活动 Android 微吼直播app测试
                  <span class="chat_imgs">
                    <img src="./image/living/layout1.png" alt="">
                    <img src="./image/living/layout2.png" alt="">
                    <img src="./image/living/layout3.png" alt="">
                    <img src="./image/living/layout4.png" alt="">
                  </span>
                </div>
              </div>
            </div>
            <div class="chat_item">
              <div class="chat_item_avatar">
                <img src="./image/living/avatar@2x.png" alt="">
              </div>
              <div>
                <div class="chat_item_name">杨保林</div>
                <div class="chat_item_content">帮助全行业客户落地视频直播营销，开启直播营销，迎来持续增长</div>
              </div>
            </div>
            <div class="chat_item">
              <div class="chat_item_avatar">
                <img src="./image/living/chat3.png" alt="">
              </div>
              <div>
                <div class="chat_item_name">微吼直播 <span>主持人</span></div>
                <div class="chat_item_content">😊😊😊<span class="chat_blue">@杨保林...</span>0万+行业标杆企业都在用</div>
              </div>
            </div>
          </div>
          <div class="wap_menus_chat_leftRight">
            <div class="chat_item">
              <div class="chat_item_avatar"><img src="./image/living/chat1.png" alt=""></div>
              <div class="chat_item_content"><span class="name">Mr Liu</span>😊😊😊</div>
            </div>
            <div class="chat_item">
              <div class="chat_item_avatar"><img src="./image/living/chat2.png" alt=""></div>
              <div class="chat_item_content content_host">
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
              <div class="chat_item_avatar"><img src="./image/living/chat1.png" alt=""></div>
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
                <span class="chat_imgs">
                  <img src="./image/living/layout1.png" alt="">
                  <img src="./image/living/layout2.png" alt="">
                  <img src="./image/living/layout3.png" alt="">
                  <img src="./image/living/layout4.png" alt="">
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="living_preview_wap_footer">
      <div class="footer_left">
        <img src="./image/living/avatar@2x.png" alt="">
      </div>
      <div class="footer_center">
        <span><i class="iconfont-v3 saasa-line-zhikanzhubanfang"></i> | 参加聊天</span>
      </div>
      <div class="footer_right"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      // 是直播页还是引导页
      type: Number,
      default: 1
    }
  }
}
</script>
<style lang="less" scoped>
  .living_preview_wap{
    width: 100%;
    height: 100%;
    &_header{
      width: 100%;
      height: 36px;
      background: #fff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      .header_left{
        color: rgba(0, 0, 0, 0.65);
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
        i{
          padding-left: 10px;
        }
      }
    }
    &_body{
      height: calc(100% - 92px);
      .wap_player{
        width: 100%;
        height: 221px;
        img{
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .wap_menus{
        background: #f0f0f0;
        &_tabs{
          width: 100%;
          height: 40px;
          padding: 0 8px;
          background: #fff;
          display: flex;
          justify-content: space-around;
          align-items: center;
          border: 1px solid rgba(255, 255, 255, 0.45);
          .tabs_left, .tabs_right{
            font-size: 8px;
            color: rgba(0, 0, 0, 0.45);
          }
          .tabs_center{
            flex: 1;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
            span{
              margin: 0 15px;
            }
            .active{
              padding-bottom: 5px;
              color: rgba(0, 0, 0, 1);
              border-bottom: 3px solid #FB2626;
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
          padding: 0 10px;
          height: 327px;
          &_topBottom{
            margin-top: 5px;
            .chat_item{
              display: flex;
              width: 100%;
              margin-top: 10px;
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
                color: rgba(0, 0, 0, 0.45);
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
                color: rgba(0, 0, 0, 0.85);
                line-height: 19px;
                background: rgba(255, 255, 255, 0.85);
                border-radius: 0px 8px 8px 8px;
                .chat_imgs{
                  display: flex;
                  img{
                    width: 30px;
                    height: 30px;
                    margin-right: 4px;
                    border-radius: 4px;
                  }
                }
              }
            }
          }
          &_leftRight{
            margin-top: 10px;
            .chat_item{
              padding: 5px 6px;
              background: rgba(255, 255, 255, 0.85);
              border-radius: 15px;
              margin-bottom: 10px;
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
                color: rgba(0, 0, 0, 0.85);
                font-size: 13px;
                line-height: 19px;
                &.content_host{
                  width: calc(100% - 25px);
                }
                .name{
                  color: rgba(0, 0, 0, 0.65);
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
                }
                .chat_imgs{
                  display: flex;
                  img{
                    width: 30px;
                    height: 30px;
                    margin-right: 4px;
                    border-radius: 4px;
                  }
                }
              }
            }
            // .chat_item_clear::after {
            //   content: "";
            //   display: block;
            //   clear: both;
            // }
          }
          .chat_blue{
            color: #0A7FF5;
            font-size: 13px;
            line-height: 19px;
          }
        }
      }
    }
    &_footer{
      width: 100%;
      height: 56px;
      background: #fff;
      display: flex;
      align-items: center;
      padding: 0 10px;
      .footer_left{
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
      .footer_center{
        width: 181px;
        height: 36px;
        border-radius: 35px;
        line-height: 36px;
        padding: 0 10px;
        background: rgba(0, 0, 0, 0.1);
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin: 0 10px;
        .iconfont-v3{
          font-size: 13px;
        }
      }
      .footer_right{
        width: 130px;
        height: 32px;
        background-image: url('./image/living/tools@2x.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
  }
</style>
