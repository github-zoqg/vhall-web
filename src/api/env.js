/**
 * Created by jial.li on 2020/11/05.
 */

/**
 * 配置编译环境和线上环境之间的切换
 * fileBaseUrl = 文件所在域名地址
 */
let staticLinkVo = {
  kf: 'http://p.qiao.baidu.com/cps/chat?siteId=113762&userId=2052738',
  aliQr: '//aliqr.e.vhall.com/qr.png?t=',
  uploadBaseUrl: '//t-vhallsaas-static.oss-cn-beijing.aliyuncs.com/upload/', // 图片上传后回显域名（后期字段变化）
  tmplDownloadUrl: 'https://t-alistatic01.e.vhall.com/static', // 原有静态模板下载地址
  downOldUrl: '//t.e.vhall.com', // 旧版控制台地址，AG: 下载邀请码等；跳转旧版控制台
  helpLinkUrl: 'https://www.vhall.com/help' // 帮助中心跳转地址
};
let staticImgs = {
  home: [
    'https://t-alistatic01.e.vhall.com/upload/common/static-imgs/dc/d2/dcd284bd60054e12a1eefebc804a7802.png'
  ],
  prize: [
    'http://t-alistatic01.e.vhall.com/upload/sys/img_url/e0/2b/e02b57d63947b5ec20c57c144686cd7d.gif',
    'http://t-alistatic01.e.vhall.com/upload/sys/img_url/47/2a/472ab6904c58829ebcf91d801e146945.gif',
    'http://t-alistatic01.e.vhall.com/upload/sys/img_url/12/80/12806c4743aec43498cef45ea732c977.gif'
  ],
  word: [
    '//t-alistatic01.e.vhall.com/static/images/delFlash/load.gif'
  ],
  video: [
    '//t-alistatic01.e.vhall.com/upload/webinars/img_url/fb/40/fb40e62abba02933ada7d97495f81ef1.jpg'
  ],
  product: [
    'http://t-alistatic01.e.vhall.com/static/img/video_default.png'
  ],
  doc: [
    'http://t-alistatic01.e.vhall.com/static/images/menu/doc-bg-new-h5.png'
  ],
  brand: [
    'https://t-alistatic01.e.vhall.com/upload/users/face-imgs/5b/5c/5b5cff960c528fab4a711df72ff60b7e.png',
    'https://t-alistatic01.e.vhall.com/static/images/menu/rank-bg.png'
  ],
  invitation: [
    'https://t-alistatic01.e.vhall.com/static/images/invitation/bg_1@2x.png',
    'https://t-alistatic01.e.vhall.com/static/images/invitation/bg_2@2x.png',
    'https://t-alistatic01.e.vhall.com/static/images/invitation/bg_3@2x.png',
    'https://t-alistatic01.e.vhall.com/static/images/invitation/bg_4@2x.png',
    'https://t-alistatic01.e.vhall.com/static/images/invitation/bg_5@2x.png',
    'https://t-alistatic01.e.vhall.com/static/images/invitation/bg_6@2x.png',
    'https://t-alistatic01.e.vhall.com/static/images/invitation/bg_7@2x.png',
    'https://t-alistatic01.e.vhall.com/static/images/invitation/bg_8@2x.png',
    'https://t-alistatic01.e.vhall.com/static/images/invitation/bg_9@2x.png'
  ],
  pay: [
    'http://t-alistatic01.e.vhall.com/static/images/vhall3.0/pay-fail.png',
    'http://t-alistatic01.e.vhall.com/static/images/watch/alipay.png',
    'http://t-alistatic01.e.vhall.com/static/images/watch/weixin.png'
  ]
}
if (process.env === 'production') {
  staticLinkVo.tmplDownloadUrl = 'https://cnstatic01.e.vhall.com/static'
  staticImgs = {
    home: [
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/dc/d2/dcd284bd60054e12a1eefebc804a7802.png'
    ],
    prize: [
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/e0/2b/e02b57d63947b5ec20c57c144686cd7d.gif',
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/47/2a/472ab6904c58829ebcf91d801e146945.gif',
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/12/80/12806c4743aec43498cef45ea732c977.gif'
    ],
    word: [
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/43/1b/431b7fae463f9384774e331b322c708b.gif'
    ],
    video: [
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/fb/40/fb40e62abba02933ada7d97495f81ef1.jpg'
    ],
    product: [
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/8a/b6/8ab657fc759c17fab9cb87e5b443ebb4.png'
    ],
    doc: [
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/98/84/9884ea7bd05282ce91e5dc0b716deb6e.png'
    ],
    brand: [
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/5b/5c/5b5cff960c528fab4a711df72ff60b7e.png',
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/8a/7e/8a7e80e131bd7c4c0b7b73ccb5385b64.png'
    ],
    invitation: [
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/c8/38/c838fcf61ce4f692dcf84fa02bb16fe3.png',
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/e1/bf/e1bf10ae70ecb066d30c91602f065d8d.png',
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/8d/cf/8dcf7f555a1b45233c88f07cc3afba79.png',
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/b3/67/b367600cad630ebb1e87d58b25cf515b.png',
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/cc/e8/cce83a13ba3c685fb9363460f6b18ce0.png',
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/72/fc/72fc2222c1da04658009b563f7d1f825.png',
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/4c/10/4c109e22b275fdf1005e53e2694309b2.png',
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/01/a7/01a71e81df96b05c598625cc9032b626.png',
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/20/d5/20d5f3fb24d5d7b834e7520eadca7223.png'
    ],
    pay: [
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/60/39/60394cb48dfb3a92a0a5c53382cc6290.png',
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/e7/10/e71014cd3860cf2f539e09801404d2af.png',
      'https://cnstatic01.e.vhall.com/upload/common/static-imgs/5e/72/5e721fe8963e323590191edf166f7c62.png'
    ]
  }
}
export default {
  staticLinkVo,
  staticImgs
};
