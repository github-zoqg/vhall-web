<template>
  <div class="brand--set--preview">
    <div>
      <!-- 标识预览 -->
      <div  class="pc" v-if="switchType === 'pc' && tabType === 'signSet' ">
        <div :class="`skin-preview preview-${switchType} sign-preview`">
          <div class="pc-preview">
            
            <div class="pc-contain">
              <div class="sign-title" :class="signSetVo && signSetVo.organizers_status == 1 ? 'sign-open' : 'sign-close'">
                <p>
                  {{viewingProtocolForm.title}}
                </p>
              </div>
              <div class="sign-content" :class="viewingProtocolForm.rule == 0 ? 'sign-content-read' : 'sign-content-choose'">
                <div v-html="viewingProtocolForm.content">

                </div>
              </div>
              <div class="sign-bottom" :class="signSetVo && signSetVo.organizers_status == 1 ? 'sign-open' : 'sign-close'">

                  <!-- <span>{{viewingProtocolForm.statement_content}}</span>,了解详细信息 -->

                <p v-html="result_content"></p>

              </div>
              <div class="sign-button" v-if="viewingProtocolForm.rule == 0">
                <el-button size="medium" type="primary" round v-preventReClick>我知道了</el-button>
              </div>
              <div class="sign-button sign-button" v-if="viewingProtocolForm.rule == 1">
                <div>
                  <el-button size="medium" type="primary" round v-preventReClick>同意并继续</el-button>
                </div>
                <div class="bottom-button">
                  <el-button size="medium" round v-preventReClick>拒绝</el-button>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "brandSetPreview.vue",
  props: ['brandType', 'tabType', 'viewingProtocolForm'],
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
      domain_url: '',
      result_content: null
    };
  },
  methods: {
    privacyFormatter(){
      let text = this.viewingProtocolForm.statement_content
      let matchPrivacy1 = this.viewingProtocolForm.proptocolTitle_0 ? text.match(this.viewingProtocolForm.proptocolTitle_0) : null;
      console.log(text, matchPrivacy1, 'text')
      if(matchPrivacy1){
        let reg = new RegExp(`(${matchPrivacy1[0]})`);
        text = text.replace(reg, `<a href="${this.viewingProtocolForm.proptocolLink_0 || 'javascript:void(0);'}" target="_blank">$1</a>`);
      }
      let matchPrivacy2 = this.viewingProtocolForm.proptocolTitle_1 ? text.match(this.viewingProtocolForm.proptocolTitle_1) : null;
      // alert(matchPrivacy2, 'matchPrivacy2')
      if(matchPrivacy2){
        let reg = new RegExp(`(${matchPrivacy2[0]})`, "g");
        text = text.replace(reg, `<a href="${this.viewingProtocolForm.proptocolLink_1 || 'javascript:void(0);'}" target="_blank">$1</a>`);
      }
      text += ',了解详细信息'
      this.result_content = text;
    },
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
        if (vo && Number(vo.status) > 0)  {
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
      }
      this.$fetch('getInterWebinarTag', this.$params(params)).then(res => {
        console.log(res);
        if (res && res.code === 200) {
          this.signSetVo = res.data;
        } else {
          this.signSetVo = {};
        }
      }).catch(err=>{
        console.log(err);
        this.signSetVo = {};
      });
    },
    getInterWebinarSkin() {
      let params = {
        webinar_id: this.brandType == 1 ? this.$route.params.str : '',
        type: this.brandType
      }
      this.$fetch('getInterWebinarSkin', this.$params(params)).then(res => {
        if (res && res.code === 200) {
          this.skinSetVo.status = res.data.status
          if (this.skinSetVo.status > 0)  {
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
      }).catch(err=>{
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
      this.getInterWebinarSkin();
      this.privacyFormatter()
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
    },
    'viewingProtocolForm.proptocolTitle_0'(val, oldVal) {
      if (val) {
        this.privacyFormatter()
      }
    },
    'viewingProtocolForm.proptocolTitle_1'(val, oldVal) {
      if (val) {
        this.privacyFormatter()
      }
    },
    'viewingProtocolForm.statement_content'(val, oldVal) {
      if (val) {
        this.privacyFormatter()
      }
    },
  }
};
</script>

<style lang="less" scoped>
/*预览区域样式开始*/
.skin-preview.preview-pc{
  width: 360px;
  height: 300px;
  border-radius: 4px;
  border: 1px solid #CCCCCC;
}
.brand-preview{
  overflow: hidden;
  .skin-header{
    width: 100%;
    height: 36px;
    background: url('../../../common/images/skin/skin-header.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    .skin-share{
      position: absolute;
      right:30px;
      top: 12px;
      display: flex;
    }
    .skin-atton{
      font-size: 12px;
      transform:scale(0.4);
    }
    .skin-left{
      margin-right: -5px;
    }
    .iconfont-v3{
      align-items: center;
      padding-left: 3px;
    }
  }
  .skin-footer{
    height: 210px;
    width: 100%;
    background-color: #1A1A1A;
    background-size: 100% 100%;
    padding-top: 5px;
    position: relative;
    img{
      width: 100%;
      height: 100%;
      object-fit: scale-down;
    }
    .footer-text{
      position: absolute;
      bottom: 32px;
      left: 115px;
      font-size: 12px;
      transform:scale(0.5);
      color: #999;
    }
  }
  .color-text{
    position: absolute;
    top: 119px;
    right: 115px;
    p{
      width: 9px;
      height: 1px;
      border-radius: 10px;
      background-color: #FB3A32;
    }
  }
}
.zdy--switch {
  margin-bottom: 16px;
}
.pc-preview{

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
  .pc-contain{
    height: 100%;
    // width: calc(100% - 25px);
    width: 100%;
    margin: 16px;
    position: relative;
    .sign-intro{
      font-size: 12px;
      color: #999;
      transform:scale(0.4);
      position: absolute;
      top: -3px;
      left: 29px;
      span{
        display: inline-block;
        width: 40px;
        height: 20px;
        margin-left: 10px;
        vertical-align: text-bottom;
        img{
          width: 100%;
          height: 100%;
          object-fit: scale-down;
        }
      }
      
    }
    .sign-title{
      height: 25px;
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #1A1A1A;
      line-height: 25px;
      .time{
        padding-left: 10px;
      }
      .blue{
        color: #999;
        &:hover{
          color: blue;
        }
      }
      &.sign-close{
        left: 65px;
      }
    }
    .sign-content{
      font-size: 14px;
      margin-top: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #1A1A1A;
      line-height: 20px;
      
      overflow-y: scroll
    }
    .sign-content-read{
      height: 138px;
    }
    .sign-content-choose{
      height: 92px;
    }
    .sign-bottom{
      width: 100%;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
    }
    .sign-button{
      text-align: center;
      margin-top: 16px;
    }
    .bottom-button{
      margin-top: 8px
    }
  }
}
.sign-version{
  position: absolute;
  left: 80px;
  bottom: 2px;
  p{
    color: #666;
    transform:scale(0.3);
    .blue{
      color: #666;
      &:hover{
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
  .h5-notice-panel {
    position: relative;
    span {
      width: 2px;
      background: #FB3A32;
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
