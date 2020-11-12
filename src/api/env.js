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
let staticLinkVo = {
    kf: 'http://webim.qiao.baidu.com//im/index?siteid=113762&ucid=2052738'
};
switch (process.env.VUE_APP_NODE_ENV) {
  case 'production':
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    uploadImgUrl = 'http://otp.cdinfotech.top/file/upload_images';
    break;
  case 'test':
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    uploadImgUrl = 'http://otp.cdinfotech.top/file/upload_images';
    break;
  case 'pre':
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    uploadImgUrl = 'http://otp.cdinfotech.top/file/upload_images';
    break;
  case 'development':
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    uploadImgUrl = 'http://otp.cdinfotech.top/file/upload_images';
    break;
  default:
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    uploadImgUrl = 'http://otp.cdinfotech.top/file/upload_images';
}
export default {
  fileBaseUrl,
  downBaseUrl,
  uploadImgUrl,
  staticLinkVo
};
