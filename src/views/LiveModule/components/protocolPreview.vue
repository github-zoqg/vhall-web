<template>
  <div class="brand--set--preview">
    <div :class="viewingProtocolForm.is_open === 0 ? 'preview-readonly' : ''">
      <!-- 标识预览 -->
      <div class="pc">
        <p>预览</p>
        <div :class="`skin-preview preview-pc protocol-preview`">
          <div class="pc-preview">
            <div class="pc-contain">
              <div
                class="protocol-top"
                :class="rule == 1 ? 'protocol-content-read' : 'protocol-content-choose'"
              >
                <div class="protocol-title">
                  <p>
                    {{ viewingProtocolForm.title ? viewingProtocolForm.title : '《观看协议》标题' }}
                  </p>
                </div>
                <div class="protocol-content">
                  <div
                    v-html="
                      viewingProtocolForm.content ? viewingProtocolForm.content : '《观看协议》内容'
                    "
                  ></div>
                </div>
                <div class="protocol-bottom" v-if="viewingProtocolForm.statement_status">
                  <p v-html="result_content"></p>
                </div>
              </div>

              <div class="protocol-button" v-if="rule == 1">
                <el-button size="small" type="primary" round v-preventReClick>同意并继续</el-button>
              </div>
              <!-- <div class="protocol-button" v-if="viewingProtocolForm.rule == 0">
                <div>
                  <el-button size="small" type="primary" round v-preventReClick>同意并继续</el-button>
                </div>
                <div class="bottom-button">
                  <el-button size="small" type="text" round v-preventReClick>拒绝</el-button>
                </div>

              </div> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { replaceWithRules } from '@/utils/utils.js';
  export default {
    name: 'protocolPreview.vue',
    props: [
      'tabType',
      'viewingProtocolForm',
      'proptocolTitle_0',
      'proptocolTitle_1',
      'proptocolLink_0',
      'proptocolLink_1'
    ],
    data() {
      return {
        result_content: null,
        rule: 1
      };
    },
    methods: {
      privacyFormatter() {
        let text = this.viewingProtocolForm.statement_content;
        let rules = [
          {
            before: this.viewingProtocolForm.proptocolTitle_0,
            after: `<a class="protocolLinkStyle" href="${
              this.viewingProtocolForm.proptocolLink_0 || 'javascript:void(0);'
            }" target="_blank">${this.viewingProtocolForm.proptocolTitle_0}</a>`
          }
        ];
        if (this.viewingProtocolForm.proptocolTitle_1) {
          let secondRule = {
            before: this.viewingProtocolForm.proptocolTitle_1,
            after: `<a class="protocolLinkStyle" href="${
              this.viewingProtocolForm.proptocolLink_1 || 'javascript:void(0);'
            }" target="_blank">${this.viewingProtocolForm.proptocolTitle_1}</a>`
          };
          rules.push(secondRule);
        }
        this.result_content = replaceWithRules(text, rules);
        console.log(this.result_content, 'longText');
      },
      replaceAll(longText, rules = []) {
        let restText = longText;
        let replaceText = '';
        for (let i = 0; i < rules.length; i++) {
          const rule = rules[i];
          const idx = restText.indexOf(rule.before);
          if (idx === -1) {
            continue; // 如果当前没有
          } else {
            // console.log('restText', restText)
            // console.log('replaceText', replaceText)
            const splitIdx = idx + rule.before.length; // 切割的位置应该
            const currentReplaceText = restText.substring(0, idx).concat(rule.after);
            // console.log('splitIdx', splitIdx)
            // console.log('currentReplaceText', currentReplaceText)
            restText = restText.substring(splitIdx, restText.length);
            replaceText = replaceText.concat(currentReplaceText);
          }
        }
        return replaceText.concat(restText);
      },
      initPage() {
        this.privacyFormatter();
      }
    },
    mounted() {
      this.initPage();
    },
    watch: {
      'viewingProtocolForm.statement_content'(val, oldVal) {
        this.privacyFormatter();
      },
      proptocolTitle_0(val, oldVal) {
        this.privacyFormatter();
      },
      proptocolTitle_1(val, oldVal) {
        this.privacyFormatter();
      },
      proptocolLink_0(val, oldVal) {
        this.privacyFormatter();
      },
      proptocolLink_1(val, oldVal) {
        this.privacyFormatter();
      }
    }
  };
</script>
<style lang="less">
  .protocolLinkStyle {
    color: #3562fa;
  }
  .protocolLinkStyle:link,
  .protocolLinkStyle:visited,
  .protocolLinkStyle:hover,
  .protocolLinkStyle:active {
    color: #3562fa;
    text-decoration: none;
  }
</style>
<style lang="less" scoped>
  /*预览区域样式开始*/
  .skin-preview.preview-pc {
    width: 360px;
    min-height: 300px;
    border-radius: 4px;
    border: 1px solid #cccccc;
    margin-top: 16px;
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
      padding: 24px 0 16px 16px;
      position: relative;
      .protocol-intro {
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
      .protocol-title {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        // font-weight: 500;
        color: #1a1a1a;
        line-height: 25px;
        word-break: break-all;
        word-wrap: break-word;
        padding-right: 16px;
        .time {
          padding-left: 10px;
        }
        .blue {
          color: #999;
          &:hover {
            color: blue;
          }
        }
        &.protocol-close {
          left: 65px;
        }
      }
      .protocol-top {
        overflow-y: scroll;
      }
      .protocol-content {
        font-size: 14px;
        margin-top: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #1a1a1a;
        line-height: 20px;
        word-break: break-all;
        word-wrap: break-word;
        padding-right: 16px;
        /deep/img {
          max-width: 100%;
        }
      }
      .protocol-content-read {
        height: 206px;
      }
      .protocol-content-choose {
        height: 180px;
      }
      .protocol-bottom {
        width: 100%;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #666666;
        line-height: 20px;
        margin-top: 10px;
        word-break: break-all;
        word-wrap: break-word;
        padding-right: 16px;
      }
      .protocol-button {
        text-align: center;
        margin-top: 16px;
      }
      .bottom-button {
        margin-top: 10px;
        /deep/.el-button--text {
          padding: 0 0;
        }
      }
    }
  }
  .protocol-version {
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

  .preview-readonly {
    .pc-preview {
      .pc-contain {
        .protocol-title {
          color: #999999;
        }
        .protocol-content {
          color: #999999;
        }
      }
    }
  }
  .protocol-button /deep/ .el-button {
    cursor: default;
    pointer-events: none;
  }
</style>
