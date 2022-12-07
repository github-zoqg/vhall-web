/**
 * Created by jial.li on 2020/11/05.
 */

/**
 * 配置编译环境和线上环境之间的切换
 * fileBaseUrl = 文件所在域名地址
 */
let staticLinkVo = {
  kf: 'https://vhall.s4.udesk.cn/im_client/?web_plugin_id=15038',
  aliQr: '//aliqr.e.vhall.com/qr.png?s=7&m=1&t=',
  uploadBaseUrl: '//t-vhallsaas-static.oss-cn-beijing.aliyuncs.com/upload/', // 图片上传后回显域名（后期字段变化）
  tmplDownloadUrl: 'https://t-alistatic01.e.vhall.com/static', // 原有静态模板下载地址
  helpLinkUrl: 'https://www.vhall.com/help' // 帮助中心跳转地址
};
let staticImgs = {
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
  ]
};
if (['production', 'pre'].includes(process.env.VUE_APP_NODE_ENV)) {
  staticLinkVo.uploadBaseUrl = 'https://cnstatic01.e.vhall.com/upload/';
  staticLinkVo.tmplDownloadUrl = 'https://cnstatic01.e.vhall.com/static';
  staticImgs = {
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
    ]
  };
}
export default {
  staticLinkVo,
  staticImgs
};
