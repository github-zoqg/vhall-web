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
  uploadBaseUrl: '//t-alistatic01.e.vhall.com/upload/'
};
let roomWatchUrl; // 观看页部署域名地址，AG: http://live.vhall.com/
let BASE_URL;
let BASE_URL_DATA;
switch (process.env.VUE_APP_NODE_ENV) {
  case 'production':
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    uploadImgUrl = 'http://otp.cdinfotech.top/file/upload_images';
    staticBaseUrl = '//cnstatic01.e.vhall.com/';
    roomWatchUrl = 'http://live.vhall.com/';
    BASE_URL = 'https://t-saas-dispatch.vhall.com';
    BASE_URL_DATA = 'http://t-saas-findc.vhall.com';
    break;
  case 'test':
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    uploadImgUrl = 'http://otp.cdinfotech.top/file/upload_images';
    staticBaseUrl = '//cnstatic01.e.vhall.com/';
    roomWatchUrl = 'http://live.vhall.com/';
    BASE_URL = 'https://t-saas-dispatch.vhall.com';
    BASE_URL_DATA = 'http://t-saas-findc.vhall.com';
    break;
  case 'pre':
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    uploadImgUrl = 'http://otp.cdinfotech.top/file/upload_images';
    staticBaseUrl = '//cnstatic01.e.vhall.com/';
    roomWatchUrl = 'http://live.vhall.com/';
    BASE_URL = 'https://t-saas-dispatch.vhall.com/';
    BASE_URL_DATA = 'http://t-saas-findc.vhall.com';
    break;
  case 'development':
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    uploadImgUrl = 'http://otp.cdinfotech.top/file/upload_images';
    staticBaseUrl = '//cnstatic01.e.vhall.com/';
    roomWatchUrl = 'http://live.vhall.com/';
    BASE_URL = 'https://t-saas-dispatch.vhall.com';
    BASE_URL_DATA = 'http://t-saas-findc.vhall.com';
    break;
  default:
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    uploadImgUrl = 'http://otp.cdinfotech.top/file/upload_images';
    staticBaseUrl = '//cnstatic01.e.vhall.com/';
    roomWatchUrl = 'http://live.vhall.com/';
    BASE_URL = 'https://t-saas-dispatch.vhall.com';
    BASE_URL_DATA = 'http://t-saas-findc.vhall.com';
}
export default {
  fileBaseUrl,
  downBaseUrl,
  uploadImgUrl,
  staticLinkVo,
  staticBaseUrl,
  roomWatchUrl,
  BASE_URL,
  BASE_URL_DATA
};
