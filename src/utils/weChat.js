const mixins = {
  methods: {
    initWeChatSdk(initData = {}, shareData = {}) {
      const params = {
        debug: false,
        appId: '', // 必填,公众号的唯一标识
        timestamp: '', // 必填,生成签名的时间戳
        nonceStr: '', // 必填,生成签名的随机串
        signature: '', // 必填,签名
        jsApiList: ['chooseWXPay', 'updateAppMessageShareData', 'updateTimelineShareData']
      };
      wx.config({ ...params, ...initData });
      wx.ready(() => {
        wx.updateAppMessageShareData({
          title: shareData.title, // 分享标题
          desc: shareData.desc, // 分享描述
          link: shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: shareData.imgUrl, // 分享图标
          success() {
            // 设置成功
            this.$toast('分享成功');
          }
        });
        wx.updateTimelineShareData({
          title: shareData.title, // 分享标题
          link: shareData.link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: shareData.imgUrl, // 分享图标
          success() {
            // 设置成功
            this.$toast('分享成功');
          }
        });
      });
    }
  }
};
export default mixins;
