/**
 * Created by jial.li on 2020/11/05.
 */

/**
 * 配置编译环境和线上环境之间的切换
 * fileBaseUrl = 文件所在域名地址
 */
let fileBaseUrl; // 文件服务器
let downBaseUrl; // 下载邀请码
let uploadImgUrl; // 图片服务器
let staticBaseUrl; // 静态图片展示地址
let staticLinkVo = {
  kf: 'http://webim.qiao.baidu.com//im/index?siteid=113762&ucid=2052738',
  aliQr: '//aliqr.e.vhall.com/qr.png?t=',
  uploadBaseUrl: '//t-vhallsaas-static.oss-cn-beijing.aliyuncs.com/upload/', // 图片上传后回显域名（后期字段变化）
  tmplDownloadUrl: '//t-alistatic01.e.vhall.com/static', // 原有静态模板下载地址
  wordShowUrl: '//cnstatic01.e.vhall.com/document', // 文档上传后预览地址-通过hash
  downOldUrl: '//t.e.vhall.com', // 旧版控制台地址，AG: 下载邀请码等；跳转旧版控制台
  helpLinkUrl: 'https://www.vhall.com/help', // 帮助中心跳转地址
  WEB_SHARE_URL: '//http://t.e.vhall.com/v3/#'
};
let roomWatchUrl; // 观看页部署域名地址，AG: http://live.vhall.com/
let BASE_URL;
let BASE_URL_DATA;
let BASE_REPORT_URL;
switch (process.env.VUE_APP_NODE_ENV) {
  case 'production':
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    uploadImgUrl = 'http://otp.cdinfotech.top/file/upload_images';
    staticBaseUrl = '//cnstatic01.e.vhall.com/';
    roomWatchUrl = 'http://live.vhall.com/';
    BASE_URL = 'https://t-saas-dispatch.vhall.com';
    BASE_URL_DATA = 'http://t-saas-findc.vhall.com';
    BASE_REPORT_URL = 'https://dc.e.vhall.com/login';
    break;
  case 'test':
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    uploadImgUrl = 'http://otp.cdinfotech.top/file/upload_images';
    staticBaseUrl = '//cnstatic01.e.vhall.com/';
    roomWatchUrl = 'http://live.vhall.com/';
    BASE_URL = 'https://t-saas-dispatch.vhall.com';
    BASE_URL_DATA = 'http://t-saas-findc.vhall.com';
    BASE_REPORT_URL = 'https://t-dc.e.vhall.com/login';
    break;
  case 'pre':
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    uploadImgUrl = 'http://otp.cdinfotech.top/file/upload_images';
    staticBaseUrl = '//cnstatic01.e.vhall.com/';
    roomWatchUrl = 'http://live.vhall.com/';
    BASE_URL = 'https://t-saas-dispatch.vhall.com/';
    BASE_URL_DATA = 'http://t-saas-findc.vhall.com';
    BASE_REPORT_URL = 'https://t-dc.e.vhall.com/login';
    break;
  case 'development':
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    uploadImgUrl = 'http://otp.cdinfotech.top/file/upload_images';
    staticBaseUrl = '//cnstatic01.e.vhall.com/';
    roomWatchUrl = 'http://live.vhall.com/';
    BASE_URL = 'https://t-saas-dispatch.vhall.com';
    BASE_URL_DATA = 'http://t-saas-findc.vhall.com';
    BASE_REPORT_URL = 'https://t-dc.e.vhall.com/login';
    break;
  default:
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    uploadImgUrl = 'http://otp.cdinfotech.top/file/upload_images';
    staticBaseUrl = '//cnstatic01.e.vhall.com/';
    roomWatchUrl = 'http://live.vhall.com/';
    BASE_URL = 'https://t-saas-dispatch.vhall.com';
    BASE_URL_DATA = 'http://t-saas-findc.vhall.com';
    BASE_REPORT_URL = 'https://t-dc.e.vhall.com/login';
}
export default {
  fileBaseUrl,
  downBaseUrl,
  uploadImgUrl,
  staticLinkVo,
  staticBaseUrl,
  roomWatchUrl,
  BASE_URL,
  BASE_URL_DATA,
  BASE_REPORT_URL
};
