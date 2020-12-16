/**
 * Created by jial.li on 2020/11/05.
 */

/**
 * 配置编译环境和线上环境之间的切换
 * fileBaseUrl = 文件所在域名地址
 */
let staticLinkVo = {
  kf: 'http://webim.qiao.baidu.com//im/index?siteid=113762&ucid=2052738',
  aliQr: '//aliqr.e.vhall.com/qr.png?t=',
  uploadBaseUrl: '//t-vhallsaas-static.oss-cn-beijing.aliyuncs.com/upload/', // 图片上传后回显域名（后期字段变化）
  tmplDownloadUrl: '//t-alistatic01.e.vhall.com/static', // 原有静态模板下载地址
  wordShowUrl: '//cnstatic01.e.vhall.com/document', // 文档上传后预览地址-通过hash
  downOldUrl: '//t.e.vhall.com', // 旧版控制台地址，AG: 下载邀请码等；跳转旧版控制台
  helpLinkUrl: 'https://www.vhall.com/help', // 帮助中心跳转地址
  WEB_SHARE_URL: 'http://localhost:8080' // 部署后链接地址（注意发起端，现在必须要https才能发起）
};
export default {
  staticLinkVo
};
