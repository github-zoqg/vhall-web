<template>
  <div class="vhall-share-box" :class="{'is-ie': isIE}" >
    <div class="share-box">
      <h5>直播地址</h5>
      <p class="copyurl">
        <input type="text" class="shareurl link_text" :value="url" />
        <a class="copy-button" @click="doCopy">复制</a>
      </p>
    </div>
    <div class="bdsharebuttonbox">
      <a
        href="#"
        class="bds_weixin"
        data-cmd="weixin"
        title="分享到微信"
        :style="{'background-image':`url(https://${domains.static}/static/images/signup-form/share-wx.png)`}"
        @click="openQRCode"
      ></a>
      <a
        href="#"
        @click="shareToQQ"
        class="bds_sqq"
        data-cmd="sqq"
        title="分享到QQ好友"
        :style="{'background-image':`url(https://${domains.static}/static/images/signup-form/share-qq1.png)`}"
      ></a>
      <a
        href="#"
        @click="shareToWeiBo"
        class="bds_tsina"
        data-cmd="tsina"
        title="分享到新浪微博"
        :style="{'background-image':`url(https://${domains.static}/static/images/signup-form/share-wb.png)`}"
      ></a>
    </div>
    <popup
      :visible="QRCodeVisible"
      :onClose="closeQRCode"
      :width="'362px'"
      :title="'分享到微信朋友圈'"
    >
      <div class="weixin-qrcode-share" :class="{'is-ie': isIE}">
        <img :src="shareUrl" />
        <p>打开微信，点击底部的“发现”，使用“扫一扫”即可将网页分享至朋友圈。</p>
      </div>
    </popup>
  </div>
</template>
<script>
import Popup from '../saas-popup/index';
import { isIE } from '../../utils/utils';
export default {
  name: 'share',
  props: ['url', 'domains', 'shareId'],
  components: {
    Popup
  },
  data () {
    return {
      QRCodeVisible: false,
      isIE: isIE()
    };
  },
  computed: {
    shareUrl () {
      let shareId = this.shareId + '-3';
      let url = `${this.url}?shareId=${encodeURIComponent(shareId)}`;
      return `https://aliqr.e.vhall.com/qr.png?t=${url}`;
    }
  },
  methods: {
    doCopy () {
      this.$copyText(this.url).then(e => {
        this.$message.success('复制成功！');
        window.vhallReport.report('SHARE', {
          event: 0
        });
      }).catch(error=>{
        console.log(error);
        this.$message.error('复制失败！');
      });
    },
    closeQRCode () {
      this.QRCodeVisible = false;
    },
    openQRCode () {
      this.QRCodeVisible = true;
      window.vhallReport.report('SHARE', {
        event: 2
      });
    },
    shareToQQ () {
      window.vhallReport.report('SHARE', {
        event: 1
      });
      const p = {
        /* 获取URL，可加上来自分享到QQ标识，方便统计 */
        url: this.shareUrl,
        desc: '',
        /* 分享标题(可选) */
        title: '微吼直播',
        /* 分享摘要(可选) */
        summary: '点击查看更多详情',
        /* 分享图片(可选) */
        pics: '',
        /* 分享来源(可选) 如：QQ分享 */
        site: '',
        style: '201',
        width: 32,
        height: 32
      };
      const s = [];
      for (let i in p) {
        s.push(i + '=' + encodeURIComponent(p[i] || ''));
      }
      const url = 'http://connect.qq.com/widget/shareqq/index.html?' + s.join('&');
      window.open(url);
    },
    shareToWeiBo () {
      window.vhallReport.report('SHARE', {
        event: 4
      });
      const p = {
        // 表示是否显示当前页面被分享数量(1 显示)(可选， 允许为空)
        // count: '1',
        // 将页面地址转成短域名， 并显示在内容文字后面。(可选， 允许为空)
        url: this.shareUrl,
        // 用于发布微博的来源显示， 为空则分享的内容来源会显示来自互联网。(可选， 允许为空)
        // appkey: '3537586442',
        // 分享时所示的文字内容， 为空则自动抓取分享页面的title值(可选， 允许为空)
        title: '点击查看详情'
        // 自定义图片地址， 作为微博配图(可选， 允许为空)
        // pic: '',
        // 转发时会 @相关的微博账号(可选， 允许为空)
        // ralateUid: '',
        // 语言设置(zh_cn | zh_tw)(可选)
        // language: 'zh_cn'
      };

      const s = [];
      for (let i in p) {
        s.push(i + '=' + encodeURIComponent(p[i] || ''));
      }
      const url = 'http://service.weibo.com/share/share.php?' + s.join('&');
      window.open(url);
    }
  }
};
</script>
<style lang="less">
.weixin-qrcode-share {
  background-color: white;
  text-align: center;
  &.is-ie{
    img {
      height: 129px;
    }
  }
  img {
    height: 180px;
    margin-bottom: 10px;
  }
  p {
    margin-bottom: 20px;
    padding: 0 30px;
  }
}
.vhall-share-box {
  padding: 6px 16px 10px;
  background: #fff;
  border-radius: 0 0 4px 4px;
  &.is-ie{
    position: relative;
    & > .bdsharebuttonbox {
      left: -55px;
    }
  }
  .shareurl {
    padding: 0px 5px;
  }
  & > .share-box {
    margin: 0;
    padding: 0;
    & > h5 {
      color: #2b2b2b;
      margin-left: 14px;
      margin-top: 24px;
    }
    & > p {
      margin-bottom: 30px;
      display: flex;
      justify-content: center;
      margin-top: 20px;
      & > input {
        border: 1px solid #a4a4a4;
        width: 325px;
        padding: 4px 5 solid #a4a4a4;
        height: 30px;
        color: #4b4b4b;
      }
      & > a.copy-button {
        margin-left: 4px;
        padding: 7px 12px;
        background: #eb6662;
        color: #fff;
        text-align: center;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
        font-style: '微软雅黑';
        &:hover {
          background: #eb5a58;
        }
        &:active {
          background: #e94644;
        }
      }
    }
  }
  & > .bdsharebuttonbox {
    height: 80px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: relative;
    & > a {
      display: inline-block;
      text-decoration: none;
      color: #333;
      height: 32px;
      width: 32px;
      background-size: 100%;
      position: relative;
    }
    & > a:first-child::after {
      content: '微信';
      position: absolute;
      top: 32px;
      font-size: 12px;
      left: 4px;
    }
    & > a:nth-child(2)::after {
      content: 'QQ';
      position: absolute;
      top: 32px;
      font-size: 12px;
      left: 4px;
    }
    & > a:nth-child(3)::after {
      content: '微博';
      position: absolute;
      top: 32px;
      font-size: 12px;
      left: 4px;
    }
    &::before {
      content: '';
      display: inline-block;
      position: absolute;
      height: 1px;
      width: 438px;
      background-color: #e3e3e3;
      top: 0;
      // left: -25px;
    }
  }
}
</style>
