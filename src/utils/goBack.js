const goBack = {
  created() {
    var hiddenProperty = null;
    if ('hidden' in document) {
      hiddenProperty = 'hidden';
    } else {
      if ('webkitHidden' in document) {
        hiddenProperty = 'webkitHidden';
      } else {
        if ('mozHidden' in document) {
          hiddenProperty = 'mozHidden';
        } else {
          hiddenProperty = null;
        }
      }
    }
    var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
    var onVisibilityChange = () => {
      if (!document[hiddenProperty]) {
        // 判断是否切换页面进入的  防止切换页面进入导致结束的时候会再次展示倒计时
        console.log('页面非激活');
        if (this.webinarInfo.type != 3) {
          this.sureCountDown();
        }
      } else {
        console.log('页面激活');
      }
    };
    document.addEventListener(visibilityChangeEvent, onVisibilityChange);
  }
};
export default goBack;
