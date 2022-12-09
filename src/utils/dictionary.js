/**
 * 枚举类
 * @Author: Jia.li
 * @Date: 2020-11-14 11点58分
 * @Remark:
 */
/*
	文章内容类型管理
	内容类型 0:图文，5:音频，10：视频，15:模板，20:下载包
 */
export function contentType(type) {
  const types = [
    { code: 0, text: '图文', key: 'textImg' },
    { code: 5, text: '音频', key: 'audio' },
    { code: 10, text: '视频', key: 'video' },
    { code: 15, text: '模板', key: 'template' },
    { code: 20, text: '下载包', key: 'downPack' }
  ];
  return filter(type, types);
}
/*
	性别
	内容类型 0:男，1:女
 */
export function gender(type) {
  const types = [
    { code: 1, text: '男', key: 'man' },
    { code: 2, text: '女', key: 'women' }
  ];
  return filter(type, types);
}

/*组件
* 内容类型：
  {name: "图文", is_vip: 0, type: "1", component_id: 1},
  {name: "二维码", is_vip: 0, type: "1", component_id: 2},
  {name: "直播", is_vip: 0, type: "1", component_id: 3},
  {name: "专题", is_vip: 0, type: "1", component_id: 4},
  {name: "文字链", is_vip: 1, type: "1", component_id: 5},
  {name: "图文链", is_vip: 1, type: "1", component_id: 6},
  {name: "标题", is_vip: 1, type: "1", component_id: 7},
  {name: "分割线", is_vip: 1, type: "1", component_id: 8},
  {name: "排行榜", is_vip: 0, type: "2", component_id: 9}
 */
export function customTabCompType(type) {
  const types = [
    { name: '图文', is_vip: 0, type: '1', component_id: 1, key: 'img-txt' },
    { name: '二维码', is_vip: 0, type: '1', component_id: 2, key: 'rq-code' },
    { name: '直播', is_vip: 0, type: '1', component_id: 3, key: 'video' },
    { name: '专题', is_vip: 0, type: '1', component_id: 4, key: 'special' },
    { name: '文字链', is_vip: 1, type: '1', component_id: 5, key: 'text-link' },
    { name: '图文链', is_vip: 1, type: '1', component_id: 6, key: 'img-link' },
    { name: '标题', is_vip: 1, type: '1', component_id: 7, key: 'title' },
    { name: '分割线', is_vip: 1, type: '1', component_id: 8, key: 'hr' },
    { name: '排行榜', is_vip: 0, type: '2', component_id: 9, key: 'rank' }
  ];
  return filter(type, types);
}

/*
 *公共参数platform含义
 */
export function platform(type) {
  const types = [
    { code: 0, text: 'iosAPP', key: 'ios_app' },
    { code: 1, text: 'androidAPP', key: 'android_app' },
    { code: 4, text: 'iosSDK', key: 'ios_sdk' },
    { code: 5, text: 'androidSDK', key: 'android_sdk' },
    { code: 6, text: 'pc客户端小助手', key: 'pc_sdk' },
    { code: 7, text: 'h5播放器pc浏览器端', key: 'h5_pc' },
    { code: 9, text: '微信小程序', key: 'chat' },
    { code: 10, text: 'h5播放器wap端', key: 'h5_wap' },
    { code: 15, text: 'OpenApi', key: 'open_api' },
    { code: 16, text: 'admin后台', key: 'admin' },
    { code: 17, text: '控制台', key: 'console' }
  ];
  return filter(type, types);
}

/*
 * 文件格式类型
 * [doc => application/msword]
 * [docx => application/vnd.openxmlformats-officedocument.wordprocessingml.document]
 * [xls => application/vnd.ms-excel]
 * [xlsx => application/vnd.openxmlformats-officedocument.spreadsheetml.sheet]
 * [ppt => application/vnd.ms-powerpoint]
 * [pptx => application/vnd.openxmlformats-officedocument.presentationml.presentation]
 * [jpeg => image/jpeg]
 * [jpg => image/jpeg]
 * [png => image/png]
 * [bmp => image/bmp]
 */
export function fileUploadType(type) {
  const types = [
    { code: 0, text: 'application/msword', key: 'doc' },
    {
      code: 1,
      text: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      key: 'docx'
    },
    { code: 4, text: 'application/vnd.ms-excel', key: 'xls' },
    {
      code: 5,
      text: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      key: 'xlsx'
    },
    { code: 6, text: 'application/vnd.ms-powerpoint', key: 'ppt' },
    {
      code: 7,
      text: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      key: 'pptx'
    },
    { code: 9, text: 'image/jpeg', key: 'jpeg' },
    { code: 10, text: 'image/jpeg', key: 'jpg' },
    { code: 15, text: 'image/png', key: 'png' },
    { code: 16, text: 'image/bmp', key: 'bmp' }
  ];
  return filter(type, types);
}

export function uploadFileNames(type) {
  // code 序号，url路径地址，若type为1表示不拼接日期，2表示拼接202012/
  const types = [
    {
      code: 1,
      text: '创建直播、编辑直播-上传直播封面',
      url: '/saas/interacts/screen-imgs/',
      type: 2,
      key: 'screenImg2'
    },
    {
      code: 15,
      text: '开屏海报上传图片',
      url: '/saas/interacts/screen-imgs/',
      type: 1,
      key: 'screenImg1'
    },
    {
      code: 2,
      text: '创建直播、编辑直播-上传文档',
      url: '/saas/interacts/docs/',
      type: 2,
      key: 'docs2'
    },
    {
      code: 9,
      text: '自定义菜单上传文档、资料管理上传文档、直播中上传文档',
      url: '/saas/interacts/docs/',
      type: 1,
      key: 'docs1'
    },
    {
      code: 3,
      text: '创建、编辑-直播简介富文本上传',
      url: '/saas/webinars/intro-imgs/',
      type: 2,
      key: 'introImg2'
    },
    {
      code: 8,
      text: '报名表单上传表单头图',
      url: '/saas/webinars/form-head-imgs/',
      type: 1,
      key: 'signImg1'
    },
    {
      code: 10,
      text: '自定义菜单图文组件富文本上传',
      url: '/saas/interacts/menu-imgs/',
      type: 1,
      key: 'menuImg1'
    },
    {
      code: 11,
      text: '自定义菜单二维码组件上传',
      url: '/saas/interacts/menu-qrcode-imgs/',
      type: 1,
      key: 'menuQrCodeImg1'
    },
    {
      code: 12,
      text: '自定义菜单图片链组件上传',
      url: '/saas/interacts/menu-link-imgs/',
      type: 1,
      key: 'menuLinkImg1'
    },
    {
      code: 13,
      text: '播放器设置--水印上传',
      url: '/saas/interacts/watermark-imgs/',
      type: 1,
      key: 'waterImg1'
    },
    {
      code: 14,
      text: '公众号展示上传二维码',
      url: '/saas/interacts/wechat-official-imgs/',
      type: 1,
      key: 'wechatImg1'
    },
    {
      code: 16,
      text: '商品展示上传商品图片',
      url: '/saas/interacts/goods-imgs/',
      type: 1,
      key: 'goodImg1'
    },
    {
      code: 17,
      text: '创建推广、编辑推广上传图片；资料管理创建、编辑-推广上传、图片',
      url: '/saas/webinars/spread-imgs/',
      type: 1,
      key: 'spreadImg1'
    },
    {
      code: 19,
      text: '添加皮肤上传logo和背景设置',
      url: '/saas/interacts/skin-imgs/',
      type: 1,
      key: 'skinImg1'
    },
    {
      code: 20,
      text: '邀请卡上传封面背景',
      url: '/saas/interacts/invite-card-imgs/',
      type: 1,
      key: 'inviteImg1'
    },
    {
      code: 21,
      text: '创建专题、编辑专题上传海报,专题简介富文本上传',
      url: '/saas/webinars/subject-imgs/',
      type: 1,
      key: 'subjectImg1'
    },
    {
      code: 28,
      text: '资料管理上传白名单观众',
      url: '/saas/interacts/audience-docs/',
      type: 1,
      key: 'audienceDocs1'
    },
    {
      code: 31,
      text: '资料管理创建、编辑礼物上传图片',
      url: '/saas/interacts/gift-imgs/',
      type: 1,
      key: 'giftImg1'
    },
    {
      code: 33,
      text: '资料管理上传严禁词过滤',
      url: '/saas/interacts/keyword-docs/',
      type: 1,
      key: 'keywordDocs1'
    },
    {
      code: 34,
      text: '资料管理上传联想词库',
      url: '/saas/interacts/associative-docs/',
      type: 1,
      key: 'assocDocs1'
    },
    {
      code: 35,
      text: '提交问题上传附件',
      url: '/saas/interacts/feedback-imgs/',
      type: 1,
      key: 'feebackDocs1'
    },
    {
      code: 36,
      text: '我的主页设置背景',
      url: '/saas/users/homepage-imgs/',
      type: 1,
      key: 'homeImg1'
    },
    { code: 37, text: '账户设置上传头像', url: '/saas/users/face-imgs/', type: 1, key: 'faceImg1' },
    { code: 41, text: '控制台标志上传', url: ' /saas/users/logo-imgs/', type: 1, key: 'logoImg1' },
    { code: 38, text: '聊天发送图片', url: '/saas/interacts/chat-imgs/', type: 1, key: 'chatImg1' },
    { code: 40, text: '活动数据导出上传', url: '/saas/webinars/', type: 1, key: 'wearUpload' },
    { code: 4, text: '上传点播', url: '', type: 1, key: 'vodUpload' }
  ];
  return filter(type, types);
}

function filter(type, types) {
  if (!type) {
    return types;
  }
  let target = {};
  types.map(item => {
    Object.keys(item).map(n => {
      if (item[n] === type) {
        target = item;
      }
    });
  });
  return target;
}
