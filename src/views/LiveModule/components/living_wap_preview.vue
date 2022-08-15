<template>
  <div class="living_preview_wap">
    <div class="living_preview_wap_header" v-if="(livingForm.style!=3 && type==1) || type==2">
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
    <div class="living_preview_wap_simpleHeader" v-else>
      <div class="header_left">
        <div class="header_left_avatar"><img src="./image/living/chat1.png" alt=""></div>
        <div class="header_left_name">
          <p class="header_host">戈里瑰夏 </p>
          <p class="header_hot">
            <i class="iconfont-v3 saasicon_home1">&nbsp;1234&nbsp;&nbsp;</i>
            <i class="iconfont-v3 saasicon_home1">&nbsp;2345</i>
          </p>
        </div>
        <div class="header_left_attention">
          <span>关注</span>
        </div>
      </div>
       <div class="header_right">
        <span><i class="iconfont-v3 saasicon_home1"></i></span>
        <span><i class="iconfont-v3 saasicon_home1"></i></span>
       </div>
    </div>
    <div class="living_preview_wap_body">
      <div class="wap_player">
        <img src="./image/living/layout1.png" alt="">
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
      <div class="wap_menus" v-else>
        <div class="wap_menus_tabs" v-if="livingForm.style!=3">
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
          <div class="wap_menus_chat_topBottom chat_clear" v-if="livingForm.style==1">
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
          <div class="wap_menus_chat_leftRight chat_clear" v-if="livingForm.style==2">
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
          <div class="wap_menus_chat_leftRight chat_clear" v-if="livingForm.style==3">
            <div class="chat_item_simple">
              <div class="chat_item_simple_content"><span class="name">Mr Liu</span>😊😊😊</div>
            </div>
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
                <span class="chat_imgs">
                  <img src="./image/living/layout1.png" alt="">
                  <img src="./image/living/layout2.png" alt="">
                  <img src="./image/living/layout3.png" alt="">
                  <img src="./image/living/layout4.png" alt="">
                </span>
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
            <div class="chat_item_simple">
              <div class="chat_item_simple_content">
                <span class="name">阿曼达</span>
                0万+行业标杆企业都在用
              </div>
            </div>
             <div class="chat_item_simple">
              <div class="chat_item_simple_content">
                <span class="name">董主任</span>
                12年专业实力铸造品牌口碑
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="living_preview_wap_footer" v-if="type==1">
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
    // 表单数据
    livingForm: {
      type: Object,
      default: ()=>{}
    }
  }
}
</script>
<style lang="less" scoped>
  .living_preview_wap{
    width: 100%;
    height: 100%;
    position: relative;
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
    &_simpleHeader{
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 12px;
      margin:  8px 0 40px 0;
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
          background: linear-gradient(280.56deg, #FB2626 9.45%, #FF685F 90.39%);
          border-radius: 30px;
          font-size: 12px;
          color: #fff;
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
    }
    &_body{
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
          padding: 12px 10px 20px 10px;
          background: #f0f0f0;
          &_topBottom{
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
            .chat_item{
              padding: 2px 6px;
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
            .chat_item_simple{
              padding: 2px 6px;
              background: rgba(0, 0, 0, 0.25);
              border-radius: 13px;
              margin-bottom: 10px;
              float: left;
              display: flex;
              &_content{
                color: rgba(255, 255, 255, 1);
                font-size: 13px;
                line-height: 19px;
                .name{
                  color: rgba(255, 255, 255, 0.65);
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
                    width: 28px;
                    height: 28px;
                    margin-right: 4px;
                    border-radius: 4px;
                  }
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
        }
      }
      .wap_subscribe{
        width: 100%;
        height: calc(100% - 257px);
        background: #f0f0f0;
        margin-bottom: 8px;
        .subscribe_time{
          height: 133px;
          background: #fff;
          margin-bottom: 8px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .down_time{
            font-size: 12px;
            color: #595959;
            margin-bottom: 16px;
            span{
              font-size: 28px;
              color: #262626;
            }
          }
          .down_auth{
            width: 260px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #fff;
            font-size: 18px;
            background: #FB2626;
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
            background: #fff;
            color: #000;
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
              background: #FB2626;
              border-radius: 3px;
            }
          }
          .tab_intro{
            margin-top: 25px;
            padding: 0 12px;
            &_title{
              color: #262626;
              font-size: 16px;
            }
            &_time{
              font-size: 14px;
              color: rgba(0, 0, 0, 0.65);
              line-height: 20px;
              padding-bottom: 16px;
            }
            &_main{
              font-size: 14px;
              color: rgba(0, 0, 0, 0.65);
              line-height: 20px;
            }
          }
        }
      }
    }
    &_footer{
      // position: absolute;
      // left: 0;
      // bottom: 0;
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
