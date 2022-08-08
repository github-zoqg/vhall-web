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
        <div class="wap_menus_chat">11111</div>
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
