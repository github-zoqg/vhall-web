<template>
  <div class="brand--set--preview">
    <div>
      <!-- 标识预览 -->
      <div  class="pc">
        <p> 预览</p>
        <div :class="`skin-preview preview-pc protocol-preview`">
          
          <div class="pc-preview">
           
            <div class="pc-contain">
              <div class="protocol-title">
                <p>
                  {{viewingProtocolForm.title}}
                </p>
              </div>
              <div class="protocol-content" :class="viewingProtocolForm.rule == 1 ? 'protocol-content-read' : 'protocol-content-choose'">
                <div v-html="viewingProtocolForm.content">

                </div>
              </div>
              <div class="protocol-bottom">
                <p v-html="result_content"></p>

              </div>
              <div class="protocol-button" v-if="viewingProtocolForm.rule == 1">
                <el-button size="medium" type="primary" round v-preventReClick>我知道了</el-button>
              </div>
              <div class="protocol-button" v-if="viewingProtocolForm.rule == 0">
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
  name: "protocolPreview.vue",
  props: ['brandType', 'tabType', 'viewingProtocolForm', 'proptocolTitle_0', 'proptocolTitle_1'],
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
      console.log(text, matchPrivacy1, this.viewingProtocolForm, 'text')
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
      text += '，了解详细信息'
      this.result_content = text;
    },

    initPage() {
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
    'viewingProtocolForm.statement_content'(val, oldVal) {
      if (val) {
        this.privacyFormatter()
      }
    },
    proptocolTitle_0(val, oldVal) {
      if (val) {
        this.privacyFormatter()
      }
    },
    proptocolTitle_1(val, oldVal) {
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
  margin-top: 16px
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
    .protocol-intro{
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
    .protocol-title{
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
      &.protocol-close{
        left: 65px;
      }
    }
    .protocol-content{
      font-size: 14px;
      margin-top: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #1A1A1A;
      line-height: 20px;
      
      overflow-y: scroll
    }
    .protocol-content-read{
      height: 148px;
    }
    .protocol-content-choose{
      height: 110px;
    }
    .protocol-bottom{
      width: 100%;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
    }
    .protocol-button{
      text-align: center;
      margin-top: 2px;
    }
    .bottom-button{
      margin-top: 8px
    }
  }
}
.protocol-version{
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
