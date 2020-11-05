/**
 * Created by jial.li on 2020/11/05.
 */

/**
 * 配置编译环境和线上环境之间的切换
 * fileBaseUrl = 文件所在域名地址
 */
let fileBaseUrl; // 文件服务器
let downBaseUrl; // 下载邀请码
switch (process.env.VUE_APP_NODE_ENV) {
  case 'production':
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    break;
  case 'test':
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    break;
  case 'pre':
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    break;
  case 'development':
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
    break;
  default:
    fileBaseUrl = '//t-alistatic01.e.vhall.com/static';
    downBaseUrl = '//t.e.vhall.com';
}
export default {
  fileBaseUrl,
  downBaseUrl
};
