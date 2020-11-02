var deviceType = (function() {
  var ua = window.navigator.userAgent.toLocaleLowerCase()
  var isIos = /iphone|ipad|ipod/.test(ua)
  var isAndroid = /android/.test(ua)
  return {
    isIos: isIos,
    isAndroid: isAndroid
  }
})()
const softKeyboard = {
  mounted() {
    // console.error('软键盘----', deviceType)
    this.blurKeyBoard()
  },
  methods: {
    blurKeyBoard() {
      // 此为安卓
      if (deviceType.isAndroid) {
        // 原始高度
        var oldHeight =
          document.documentElement.clientHeight || document.body.clientHeight
        window.addEventListener(
          'resize',
          () => {
            // 新高度
            var newHeight =
              document.documentElement.clientHeight ||
              document.body.clientHeight
            console.warn('new height', newHeight)
            if (newHeight < oldHeight && !flag) {
              // 键盘弹起
            } else {
              // 键盘收起
              flag = false
            }
          },
          false
        )
      }
    }
    // 获取到焦点元素滚动到可视区方法
    /* elScrollIntoView(el, delay) {
    修复安卓设备软键盘弹起会覆盖掉输入框
    this.elScrollIntoView(el, 100)
      // contentEditable 属性设置或返回元素内容是否可编辑。
      var editable = el.getAttribute('contenteditable')
      // 输入框获取焦点后没有将该元素滚动到可视区
      if (el.tagName == 'INPUT' || el.tagName == 'TEXTAREA' || editable === '' || editable) {
        setTimeout(function () {
        // 让当前的元素滚动到浏览器窗口的可视区域内。
          el.scrollIntoView()
        }, delay)
      }
    } */
  }
}
export default softKeyboard
