<template>
  <div class="vhall-playbill">
    <div class="play-bill-content" v-if="billShow">
      <div @click="closeBill" class="close-bill">关闭{{ billTimes }}s</div>
      <img :src="imgUrl" alt />
    </div>
    <div class="qrcodeDialogs" v-if="qrCodeShows">
      <!-- 二维码弹窗 -->
      <div class="qrcodeHeads">
        <p>【{{ qrCodeInfo.user_id }}】</p>
        <p>邀请你关注微信了解更多资讯</p>
      </div>

      <span @click="closeQrDia" class="closeQrcodes">x</span>
      <img :src="qrCodeImg" alt />
      <p class="qrcode-info">扫码关注公众号</p>
    </div>
  </div>
</template>
<script>
import QRcode from 'qrcode';
export default {
  props: {
    ilId: {
      required: true
    }
  },
  data () {
    return {
      qrCodeInfo: '',
      qrCodeImg: '',
      qrCodeShows: false,
      billShow: false,
      billTimes: 3,
      imgUrl: ''
    };
  },
  created () {},

  mounted () {
    this.showPlaybill();
  },

  methods: {
    // 点击关闭微信关注公众号
    closeQrDia () {
      this.$parent.successmsg();
      this.qrCodeShows = false;
    },
    // 二维码的生成
    invitePartner (res) {
      QRcode.toDataURL(res.url, (err, url) => {
        this.qrCodeImg = `${sessionStorage.getItem('imageDomin')}/${res.img}`;
        console.log(err);
      });
    },
    // 是否需要展示开屏海报
    showPlaybill () {
      this.$vhallFetch('playbill', {
        webinar_id: this.ilId
      }).then(res => {
        if (res.code === 200) {
          if (res.data.posters.img) {
            this.imgUrl = `${sessionStorage.getItem('imageDomin')}/${
              res.data.posters.img
            }`;
            this.billShow = true;
            this.closeTimes();
            if (res.data.public.webinar_id) {
              this.qrCodeShows = true;
              this.qrCodeInfo = res.data.public;
              this.invitePartner(res.data.public);
            }
          } else {
            this.billShow = false;
            // this.$parent.successmsg();
            if (res.data.public.webinar_id) {
              this.qrCodeShows = true;
              this.qrCodeInfo = res.data.public;
              this.invitePartner(res.data.public);
            } else {
              this.$parent.successmsg();
            }
          }
          console.log(res);
        }
      });
    },
    // 定时器
    closeTimes () {
      let interval = window.setInterval(() => {
        if (this.billTimes > 0) {
          this.billTimes--;
        } else {
          this.billShow = false;
          clearInterval(interval);
          if (this.qrCodeInfo) {
            this.billShow = false;
          } else {
            this.$parent.successmsg();
          }
        }
      }, 1000);
    },
    closeBill () {
      this.billShow = false;
    }
  }
};
</script>
<style lang="less">
.vhall-playbill {
  width: 100%;
  height: 94%;
  position: relative;
  .play-bill-content {
    width: 100%;
    height: 94%;
    img {
      margin-top: 10%;
      width: 100%;
      height: 100%;
    }

    .close-bill {
      display: block;
      position: absolute;
      top: 50px;
      right: 20px;
      width: 50px;
      height: 20px;
      line-height: 18px;
      text-align: center;
      font-size: 12px;
      border: 1px solid #fff;
      border-radius: 12px;
      color: #fff;
    }
  }

  .qrcodeDialogs {
    width: 340px;
    height: 350px;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    z-index: 9;
    background: #fff;

    img {
      display: block;
      width: 220px;
      height: 220px;
      margin: 0 auto;
    }
    .qrcodeHeads {
      width: 100%;
      text-align: center;
      font-size: 14px;
      margin-top: 45px;
      color: #666;
    }
    .closeQrcodes {
      font-size: 20px;
      position: absolute;
      right: 20px;
      top: 10px;
      cursor: pointer;
    }
    .qrcode-info {
      width: 100%;
      text-align: center;
      font-size: 14px;
      color: #999;
      /* margin-top: 20px; */
    }
  }
}
</style>
