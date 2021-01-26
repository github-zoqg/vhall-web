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
  wordShowUrl: '//cnstatic01.e.vhall.com/document', // 文档上传后预览地址-通过hash
  downOldUrl: '//t.e.vhall.com', // 旧版控制台地址，AG: 下载邀请码等；跳转旧版控制台
  helpLinkUrl: 'https://www.vhall.com/help' // 帮助中心跳转地址
};
let staticImgs = {
  home: [
    'https://t-alistatic01.e.vhall.com/upload/common/static-imgs/dc/d2/dcd284bd60054e12a1eefebc804a7802.png'
  ]
}
export default {
  staticLinkVo,
  staticImgs
};
